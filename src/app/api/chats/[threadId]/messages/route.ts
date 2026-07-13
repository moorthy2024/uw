import { NextRequest, NextResponse } from "next/server";
import { appendMessage, getThread, listMessages } from "@/features/chat/server-thread-store";

interface RouteContext {
  params: {
    threadId: string;
  };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { threadId } = context.params;
  if (!getThread(threadId)) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json({ items: listMessages(threadId) });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { threadId } = context.params;
  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    role?: "user" | "assistant" | "system";
    content?: string;
    attachments?: Array<{
      id: string;
      name: string;
      size: number;
      type: string;
    }>;
    createdAt?: string;
  };

  if (!getThread(threadId)) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  if (!body.role || !body.content) {
    return NextResponse.json({ error: "role and content are required" }, { status: 400 });
  }

  // Backend integration point:
  // Persist message records in your chat messages table/container with thread ownership checks.
  const item = appendMessage(threadId, {
    id: body.id,
    threadId,
    role: body.role,
    content: body.content,
    attachments: body.attachments,
    createdAt: body.createdAt,
  });

  return NextResponse.json({ item }, { status: 201 });
}
