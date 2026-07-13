"use client";

import { AppStateProvider } from "@/features/context/app-state-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}
