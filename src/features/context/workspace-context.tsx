"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface WorkspaceContextValue {
  workspaceId: string;
  sidebarPinned: boolean;
  setSidebarPinned: (next: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [sidebarPinned, setSidebarPinned] = useState(true);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspaceId: "uw-workspace-default",
      sidebarPinned,
      setSidebarPinned,
    }),
    [sidebarPinned],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within WorkspaceProvider");
  }

  return context;
}
