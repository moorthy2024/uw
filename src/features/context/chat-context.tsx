"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createMessage, createThread, fetchAssistantResponse, inferThreadTitle } from "@/features/chat/chat-service";
import { chatStorageKey, loadChatState, saveChatState } from "@/features/chat/chat-storage";
import { chatThreadApi } from "@/features/chat/chat-thread-api";
import { env } from "@/lib/config/env";
import { appLog } from "@/lib/monitoring/logger";
import { createId } from "@/lib/utils/id";
import { ChatAttachment, ChatMessage, ChatThread, PersistedChatState } from "@/types/chat";

const persistenceMode = env.chatPersistenceMode;
const isServerPersistence = persistenceMode === "server";

interface ChatContextValue {
  threads: ChatThread[];
  recentThreads: ChatThread[];
  activeThreadId: string | null;
  activeMessages: ChatMessage[];
  pendingAttachments: ChatAttachment[];
  isThinking: boolean;
  createNewThread: () => string;
  openThread: (threadId: string) => void;
  attachFiles: (files: FileList | null) => void;
  removeAttachment: (attachmentId: string) => void;
  sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function sortThreads(threads: ChatThread[]): ChatThread[] {
  return [...threads].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatState, setChatState] = useState<PersistedChatState>({ threads: [], messages: {} });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const syncThreadToServer = useCallback(async (thread: ChatThread) => {
    if (!isServerPersistence) {
      return;
    }

    try {
      await chatThreadApi.createThread({ id: thread.id, title: thread.title });
    } catch (error) {
      appLog("warn", {
        message: "Thread sync to server failed",
        error,
        context: { threadId: thread.id },
      });
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (isServerPersistence) {
        try {
          const serverThreads = await chatThreadApi.listThreads();
          const sortedThreads = sortThreads(serverThreads);
          const nextMessages: Record<string, ChatMessage[]> = {};
          await Promise.all(
            sortedThreads.map(async (thread) => {
              const detail = await chatThreadApi.getThread(thread.id);
              nextMessages[thread.id] = detail.messages ?? [];
            }),
          );

          setChatState({ threads: sortedThreads, messages: nextMessages });
          if (sortedThreads[0]?.id) {
            setActiveThreadId(sortedThreads[0].id);
          }
          return;
        } catch (error) {
          appLog("warn", {
            message: "Server chat bootstrap failed; falling back to local storage",
            error,
          });
        }
      }

      const loaded = loadChatState();
      const sorted = sortThreads(loaded.threads);
      setChatState({ ...loaded, threads: sorted });
      if (sorted[0]?.id) {
        setActiveThreadId(sorted[0].id);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    if (isServerPersistence) {
      return;
    }

    saveChatState(chatState);
    if (channelRef.current) {
      channelRef.current.postMessage({ type: "chat-state-updated" });
    }
  }, [chatState]);

  useEffect(() => {
    if (isServerPersistence) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== chatStorageKey()) {
        return;
      }

      setChatState(loadChatState());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (isServerPersistence) {
      return;
    }

    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }

    channelRef.current = new BroadcastChannel("uw-chat-sync");
    channelRef.current.onmessage = (event) => {
      if (event.data?.type === "chat-state-updated") {
        setChatState(loadChatState());
      }
    };

    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  const createNewThread = useCallback(() => {
    const thread = createThread();
    setChatState((prev) => ({
      threads: sortThreads([thread, ...prev.threads]),
      messages: {
        ...prev.messages,
        [thread.id]: [],
      },
    }));
    setActiveThreadId(thread.id);
    void syncThreadToServer(thread);
    return thread.id;
  }, [syncThreadToServer]);

  const openThread = useCallback(
    (threadId: string) => {
      setChatState((prev) => {
        const exists = prev.threads.some((thread) => thread.id === threadId);
        if (exists) {
          return prev;
        }

        const placeholder = {
          ...createThread("New thread"),
          id: threadId,
        };

        return {
          threads: sortThreads([placeholder, ...prev.threads]),
          messages: {
            ...prev.messages,
            [threadId]: prev.messages[threadId] ?? [],
          },
        };
      });

      if (isServerPersistence) {
        void chatThreadApi
          .getThread(threadId)
          .then((detail) => {
            setChatState((prev) => ({
              threads: sortThreads(
                prev.threads.map((thread) => (thread.id === detail.item.id ? detail.item : thread)),
              ),
              messages: {
                ...prev.messages,
                [threadId]: detail.messages,
              },
            }));
          })
          .catch((error) => {
            appLog("warn", {
              message: "Failed loading thread from server",
              error,
              context: { threadId },
            });
          });
      }

      setActiveThreadId(threadId);
    },
    [],
  );

  const attachFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const nextAttachments = Array.from(files).map((file) => ({
      id: createId(),
      name: file.name,
      size: file.size,
      type: file.type,
      localUrl: URL.createObjectURL(file),
    }));

    setPendingAttachments((prev) => {
      const seen = new Set(prev.map((item) => `${item.name}|${item.size}`));
      const deduped = nextAttachments.filter((item) => !seen.has(`${item.name}|${item.size}`));
      return [...prev, ...deduped];
    });
  }, []);

  const removeAttachment = useCallback((attachmentId: string) => {
    setPendingAttachments((prev) => {
      const target = prev.find((item) => item.id === attachmentId);
      if (target?.localUrl) {
        URL.revokeObjectURL(target.localUrl);
      }

      return prev.filter((item) => item.id !== attachmentId);
    });
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const content = message.trim();
      if (!content) {
        return;
      }

      const threadId = activeThreadId ?? createNewThread();
      const currentAttachments = pendingAttachments;

      const userMessage = createMessage({
        threadId,
        role: "user",
        content,
        attachments: currentAttachments,
      });

      setPendingAttachments([]);
      setIsThinking(true);

      setChatState((prev) => {
        const existingMessages = prev.messages[threadId] ?? [];
        const nextMessages = [...existingMessages, userMessage];

        const nextThreads = sortThreads(
          prev.threads.map((thread) => {
            if (thread.id !== threadId) {
              return thread;
            }

            const shouldRename = thread.title.toLowerCase() === "new thread" && existingMessages.length === 0;
            return {
              ...thread,
              title: shouldRename ? inferThreadTitle(content) : thread.title,
              updatedAt: userMessage.createdAt,
              lastMessagePreview: content,
            };
          }),
        );

        return {
          threads: nextThreads,
          messages: {
            ...prev.messages,
            [threadId]: nextMessages,
          },
        };
      });

      if (isServerPersistence) {
        void chatThreadApi.appendMessage(threadId, {
          id: userMessage.id,
          role: userMessage.role,
          content: userMessage.content,
          attachments: userMessage.attachments,
          createdAt: userMessage.createdAt,
        });

        void chatThreadApi.renameThread(threadId, inferThreadTitle(content));
      }

      try {
        const assistantContent = await fetchAssistantResponse({
          threadId,
          message: content,
          attachments: currentAttachments,
        });

        const assistantMessage = createMessage({
          threadId,
          role: "assistant",
          content: assistantContent,
        });

        setChatState((prev) => {
          const nextMessages = [...(prev.messages[threadId] ?? []), assistantMessage];
          const nextThreads = sortThreads(
            prev.threads.map((thread) => {
              if (thread.id !== threadId) {
                return thread;
              }

              return {
                ...thread,
                updatedAt: assistantMessage.createdAt,
                lastMessagePreview: assistantContent,
              };
            }),
          );

          return {
            threads: nextThreads,
            messages: {
              ...prev.messages,
              [threadId]: nextMessages,
            },
          };
        });

        if (isServerPersistence) {
          void chatThreadApi.appendMessage(threadId, {
            id: assistantMessage.id,
            role: assistantMessage.role,
            content: assistantMessage.content,
            attachments: assistantMessage.attachments,
            createdAt: assistantMessage.createdAt,
          });
        }
      } catch (error) {
        appLog("error", {
          message: "Failed to send chat message",
          error,
          context: { threadId },
        });
      } finally {
        setIsThinking(false);
      }
    },
    [activeThreadId, createNewThread, pendingAttachments],
  );

  const activeMessages = useMemo(() => {
    if (!activeThreadId) {
      return [];
    }

    return chatState.messages[activeThreadId] ?? [];
  }, [activeThreadId, chatState.messages]);

  const value = useMemo<ChatContextValue>(
    () => ({
      threads: chatState.threads,
      recentThreads: chatState.threads.slice(0, 10),
      activeThreadId,
      activeMessages,
      pendingAttachments,
      isThinking,
      createNewThread,
      openThread,
      attachFiles,
      removeAttachment,
      sendMessage,
    }),
    [
      chatState.threads,
      activeThreadId,
      activeMessages,
      pendingAttachments,
      isThinking,
      createNewThread,
      openThread,
      attachFiles,
      removeAttachment,
      sendMessage,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }

  return context;
}
