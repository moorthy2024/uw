export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retries?: number;
}

export interface ApiErrorShape {
  code?: string;
  message?: string;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ChatSendRequest {
  threadId: string;
  message: string;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
  }>;
}

export interface ChatSendResponse {
  assistantMessage: string;
  threadTitle?: string;
}
