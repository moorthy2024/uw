import { PersistedChatState, ChatMessage, ChatThread } from "@/types/chat";

const STORAGE_KEY = "uw.chat.state.v1";

function parseDate(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function dedupeThreads(threads: ChatThread[]): ChatThread[] {
  const byId = new Map<string, ChatThread>();

  for (const thread of threads) {
    const current = byId.get(thread.id);
    if (!current || parseDate(thread.updatedAt) > parseDate(current.updatedAt)) {
      byId.set(thread.id, thread);
    }
  }

  const bySignature = new Map<string, ChatThread>();
  for (const thread of byId.values()) {
    const signature = `${thread.title.trim().toLowerCase()}|${(thread.lastMessagePreview ?? "").trim().toLowerCase()}`;
    const current = bySignature.get(signature);
    if (!current || parseDate(thread.updatedAt) > parseDate(current.updatedAt)) {
      bySignature.set(signature, thread);
    }
  }

  return Array.from(bySignature.values()).sort((a, b) => parseDate(b.updatedAt) - parseDate(a.updatedAt));
}

function dedupeMessages(messages: ChatMessage[]): ChatMessage[] {
  const byId = new Map<string, ChatMessage>();
  for (const message of messages) {
    if (!byId.has(message.id)) {
      byId.set(message.id, message);
    }
  }

  return Array.from(byId.values()).sort((a, b) => parseDate(a.createdAt) - parseDate(b.createdAt));
}

export function loadChatState(): PersistedChatState {
  if (typeof window === "undefined") {
    return { threads: [], messages: {} };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { threads: [], messages: {} };
    }

    const parsed = JSON.parse(raw) as PersistedChatState;
    const normalizedMessages: Record<string, ChatMessage[]> = {};

    Object.entries(parsed.messages ?? {}).forEach(([threadId, messages]) => {
      normalizedMessages[threadId] = dedupeMessages(messages ?? []);
    });

    return {
      threads: dedupeThreads(parsed.threads ?? []),
      messages: normalizedMessages,
    };
  } catch {
    return { threads: [], messages: {} };
  }
}

export function saveChatState(state: PersistedChatState): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: PersistedChatState = {
    threads: dedupeThreads(state.threads),
    messages: Object.fromEntries(
      Object.entries(state.messages).map(([threadId, messages]) => {
        const sanitized = messages.map((message) => ({
          ...message,
          attachments: message.attachments?.map((attachment) => ({
            id: attachment.id,
            name: attachment.name,
            size: attachment.size,
            type: attachment.type,
          })),
        }));

        return [threadId, dedupeMessages(sanitized)];
      }),
    ),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function chatStorageKey(): string {
  return STORAGE_KEY;
}
