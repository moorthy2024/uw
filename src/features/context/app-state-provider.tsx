"use client";

import { SessionProvider } from "next-auth/react";
import { ChatProvider } from "@/features/context/chat-context";
import { UserProvider } from "@/features/context/user-context";
import { WorkspaceProvider } from "@/features/context/workspace-context";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <WorkspaceProvider>
          <ChatProvider>{children}</ChatProvider>
        </WorkspaceProvider>
      </UserProvider>
    </SessionProvider>
  );
}
