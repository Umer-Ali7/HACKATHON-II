"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

const STORAGE_KEY = "todo_ai_user";

interface StoredUser {
  userId: string;
  email: string;
  displayName: string | null;
  token: string | null;
}

export function useAuth(redirectIfUnauthenticated = true) {
  const router = useRouter();
  const { userId, email, displayName, token, isAuthenticated, setUser, clearUser } =
    useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed: StoredUser = JSON.parse(stored);
          setUser(parsed.userId, parsed.email, parsed.displayName, parsed.token);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      } else if (redirectIfUnauthenticated) {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, redirectIfUnauthenticated, router, setUser]);

  const login = (userId: string, email: string, displayName?: string, token?: string) => {
    const user: StoredUser = {
      userId,
      email,
      displayName: displayName ?? null,
      token: token ?? null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setUser(userId, email, displayName, token);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    clearUser();
    router.replace("/login");
  };

  return { userId, email, displayName, token, isAuthenticated, login, logout };
}
