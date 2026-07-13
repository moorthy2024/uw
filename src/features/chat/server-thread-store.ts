import { createId } from "@/lib/utils/id";
import { ChatMessage, ChatThread } from "@/types/chat";

interface ServerChatStore {
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>;
}

// In-memory store used only as a development stub.
// Replace this module with database-backed repository calls in production.
const store: ServerChatStore = {
  threads: [],
  messages: {},
};

function sortThreads(threads: ChatThread[]): ChatThread[] {
  return [...threads].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function dedupeThreads(threads: ChatThread[]): ChatThread[] {
  const byId = new Map<string, ChatThread>();
  for (const thread of threads) {
    const current = byId.get(thread.id);
    if (!current || Date.parse(thread.updatedAt) > Date.parse(current.updatedAt)) {
      byId.set(thread.id, thread);
    }
  }

  return sortThreads(Array.from(byId.values()));
}

export function listThreads(): ChatThread[] {
  store.threads = dedupeThreads(store.threads);
  return store.threads;
}

export function createThread(input?: { id?: string; title?: string }): ChatThread {
  const now = new Date().toISOString();
  const thread: ChatThread = {
    id: input?.id ?? createId(),
    title: input?.title?.trim() || "New thread",
    createdAt: now,
    updatedAt: now,
    lastMessagePreview: "",
  };

  store.threads = dedupeThreads([thread, ...store.threads]);
  store.messages[thread.id] = store.messages[thread.id] ?? [];
  return thread;
}

export function getThread(threadId: string): ChatThread | null {
  return store.threads.find((thread) => thread.id === threadId) ?? null;
}

export function renameThread(threadId: string, title: string): ChatThread | null {
  let updated: ChatThread | null = null;

  store.threads = store.threads.map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    updated = {
      ...thread,
      title: title.trim() || thread.title,
      updatedAt: new Date().toISOString(),
    };

    return updated;
  });

  store.threads = dedupeThreads(store.threads);
  return updated;
}

export function deleteThread(threadId: string): boolean {
  const existing = store.threads.length;
  store.threads = store.threads.filter((thread) => thread.id !== threadId);
  delete store.messages[threadId];
  return store.threads.length < existing;
}

export function listMessages(threadId: string): ChatMessage[] {
  return [...(store.messages[threadId] ?? [])].sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
  );
}

export function appendMessage(
  threadId: string,
  message: Omit<ChatMessage, "id" | "createdAt"> & { id?: string; createdAt?: string },
): ChatMessage {
  const createdAt = message.createdAt ?? new Date().toISOString();
  const normalized: ChatMessage = {
    ...message,
    id: message.id ?? createId(),
    createdAt,
  };

  store.messages[threadId] = [...(store.messages[threadId] ?? []), normalized];

  const preview = normalized.content.slice(0, 120);
  store.threads = dedupeThreads(
    store.threads.map((thread) => {
      if (thread.id !== threadId) {
        return thread;
      }

      return {
        ...thread,
        updatedAt: createdAt,
        lastMessagePreview: preview,
      };
    }),
  );

  return normalized;
}
