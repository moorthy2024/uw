import { env } from "@/lib/config/env";
import { appLog } from "@/lib/monitoring/logger";
import { ApiError, ApiRequestOptions } from "@/lib/api/types";

interface RequestInterceptor {
  (url: string, init: RequestInit): Promise<{ url: string; init: RequestInit }>;
}

interface ResponseInterceptor {
  (response: Response): Promise<Response>;
}

class HttpClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  async request<TResponse, TBody = unknown>(
    path: string,
    options: ApiRequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const {
      method = "GET",
      body,
      headers,
      timeoutMs = env.apiTimeoutMs,
      retries = env.apiRetryCount,
    } = options;

    // Configure backend URL in NEXT_PUBLIC_API_BASE_URL.
    const baseUrl = env.apiBaseUrl;
    if (!baseUrl) {
      throw new ApiError(
        "Missing NEXT_PUBLIC_API_BASE_URL. Configure backend URL before enabling API calls.",
        500,
      );
    }

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

    let requestUrl = `${baseUrl}${path}`;
    let requestInit: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    };

    for (const interceptor of this.requestInterceptors) {
      const next = await interceptor(requestUrl, requestInit);
      requestUrl = next.url;
      requestInit = next.init;
    }

    try {
      let response = await this.fetchWithRetry(requestUrl, requestInit, retries);

      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        throw await this.toApiError(response);
      }

      if (response.status === 204) {
        return undefined as TResponse;
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      appLog("error", {
        message: "API request failed",
        context: { path, method },
        error,
      });
      throw error;
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  private async fetchWithRetry(url: string, init: RequestInit, retries: number): Promise<Response> {
    let attempt = 0;

    while (true) {
      try {
        return await fetch(url, init);
      } catch (error) {
        if (attempt >= retries) {
          throw error;
        }

        attempt += 1;
        const delayMs = 300 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  private async toApiError(response: Response): Promise<ApiError> {
    let payload: { message?: string; code?: string; details?: unknown } = {};

    try {
      payload = await response.json();
    } catch {
      // Ignore parse failure and fallback to response text.
      payload.message = await response.text();
    }

    return new ApiError(
      payload.message || `API request failed (${response.status})`,
      response.status,
      payload.code,
      payload.details,
    );
  }
}

export const apiClient = new HttpClient();
