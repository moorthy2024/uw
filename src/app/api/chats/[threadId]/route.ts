import { NextRequest, NextResponse } from "next/server";
import { deleteThread, getThread, listMessages, renameThread } from "@/features/chat/server-thread-store";

interface RouteContext {
  params: {
    threadId: string;
  };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { threadId } = context.params;
  const thread = getThread(threadId);

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  // Backend integration point:
  // Replace listMessages() with backend message history retrieval by thread ID.
  return NextResponse.json({ item: thread, messages: listMessages(threadId) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { threadId } = context.params;
  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
  };

  if (!body.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  // Backend integration point:
  // Replace renameThread() with backend update call and audit logging.
  const updated = renameThread(threadId, body.title);
  if (!updated) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { threadId } = context.params;

  // Backend integration point:
  // Replace with soft-delete strategy and ownership/authorization checks.
  const removed = deleteThread(threadId);
  if (!removed) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
