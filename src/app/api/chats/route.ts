import { NextRequest, NextResponse } from "next/server";
import { createThread, listThreads } from "@/features/chat/server-thread-store";

export async function GET(_request: NextRequest) {
  // Backend integration point:
  // Replace listThreads() with a repository query to your thread table/container.
  const items = listThreads();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  // Backend integration point:
  // Persist thread metadata in backend storage and return canonical thread payload.
  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    title?: string;
  };

  const thread = createThread({ id: body.id, title: body.title });
  return NextResponse.json({ item: thread }, { status: 201 });
}
