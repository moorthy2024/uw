"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type UserRole = "underwriter" | "manager";

interface UserContextValue {
  userName: string;
  userEmail: string;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [role, setRole] = useState<UserRole>("underwriter");

  const value = useMemo<UserContextValue>(() => {
    const userName = session?.user?.name ?? "Ashley Rodriguez";
    const userEmail = session?.user?.email ?? "";

    return {
      userName,
      userEmail,
      role,
      setRole,
    };
  }, [role, session?.user?.email, session?.user?.name]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }

  return context;
}
