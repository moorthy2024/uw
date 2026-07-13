import { ChatMessage, ChatThread } from "@/types/chat";

interface ThreadApiListResponse {
  items: ChatThread[];
}

interface ThreadApiItemResponse {
  item: ChatThread;
  messages?: ChatMessage[];
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export const chatThreadApi = {
  listThreads: async (): Promise<ChatThread[]> => {
    const response = await fetch("/api/chats", { cache: "no-store" });
    const data = await parseJson<ThreadApiListResponse>(response);
    return data.items ?? [];
  },

  createThread: async (payload: { id?: string; title?: string }): Promise<ChatThread> => {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await parseJson<ThreadApiItemResponse>(response);
    return data.item;
  },

  getThread: async (threadId: string): Promise<{ item: ChatThread; messages: ChatMessage[] }> => {
    const response = await fetch(`/api/chats/${threadId}`, { cache: "no-store" });
    const data = await parseJson<ThreadApiItemResponse>(response);
    return { item: data.item, messages: data.messages ?? [] };
  },

  renameThread: async (threadId: string, title: string): Promise<ChatThread> => {
    const response = await fetch(`/api/chats/${threadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data = await parseJson<ThreadApiItemResponse>(response);
    return data.item;
  },

  deleteThread: async (threadId: string): Promise<void> => {
    const response = await fetch(`/api/chats/${threadId}`, { method: "DELETE" });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `Delete failed with ${response.status}`);
    }
  },

  appendMessage: async (threadId: string, message: Omit<ChatMessage, "threadId">): Promise<ChatMessage> => {
    const response = await fetch(`/api/chats/${threadId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    const data = await parseJson<{ item: ChatMessage }>(response);
    return data.item;
  },
};
