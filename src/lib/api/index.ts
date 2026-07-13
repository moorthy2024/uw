import { getSession } from "next-auth/react";
import { apiClient } from "@/lib/api/http-client";
import { ChatSendRequest, ChatSendResponse } from "@/lib/api/types";

// Attach bearer tokens from NextAuth session to outbound requests.
apiClient.addRequestInterceptor(async (url, init) => {
  const session = await getSession();
  const token = session?.accessToken as string | undefined;

  if (!token) {
    return { url, init };
  }

  return {
    url,
    init: {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    },
  };
});

// Central response interceptor for auth failures.
apiClient.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    // Integrate silent token refresh or forced sign-out flow here.
    console.warn("Unauthorized API response. Validate backend token trust configuration.");
  }

  return response;
});

export const chatApi = {
  // UPDATE endpoint path to your backend contract.
  sendMessage: (payload: ChatSendRequest) =>
    apiClient.request<ChatSendResponse, ChatSendRequest>(`/v1/chat/threads/${payload.threadId}/messages`, {
      method: "POST",
      body: payload,
      timeoutMs: 20000,
      retries: 1,
    }),
};
