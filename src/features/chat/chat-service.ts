import { chatApi } from "@/lib/api";
import { env } from "@/lib/config/env";
import { appLog } from "@/lib/monitoring/logger";
import { createId } from "@/lib/utils/id";
import { ChatAttachment, ChatMessage, ChatThread } from "@/types/chat";

export function createThread(title = "New thread"): ChatThread {
  const now = new Date().toISOString();
  return {
    id: createId(),
    title,
    createdAt: now,
    updatedAt: now,
    lastMessagePreview: "",
  };
}

export function createMessage(params: {
  threadId: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: ChatAttachment[];
}): ChatMessage {
  return {
    id: createId(),
    threadId: params.threadId,
    role: params.role,
    content: params.content,
    createdAt: new Date().toISOString(),
    attachments: params.attachments,
  };
}

export function inferThreadTitle(input: string): string {
  const normalized = input.trim();
  if (!normalized) {
    return "New thread";
  }

  return normalized.length > 60 ? `${normalized.slice(0, 57)}...` : normalized;
}

export async function fetchAssistantResponse(params: {
  threadId: string;
  message: string;
  attachments?: ChatAttachment[];
}): Promise<string> {
  if (!env.apiBaseUrl) {
    return "I can help with this underwriting question. Connect NEXT_PUBLIC_API_BASE_URL to your backend chat endpoint for live production responses.";
  }

  try {
    const response = await chatApi.sendMessage({
      threadId: params.threadId,
      message: params.message,
      attachments: params.attachments?.map((attachment) => ({
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
      })),
    });

    return response.assistantMessage;
  } catch (error) {
    appLog("warn", {
      message: "Chat API unavailable; returning fallback assistant response",
      error,
      context: { threadId: params.threadId },
    });

    return "The backend chat endpoint is currently unavailable. Please retry or check API configuration in NEXT_PUBLIC_API_BASE_URL.";
  }
}
