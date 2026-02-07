import { create } from "zustand";

interface UserPreferences {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const usePreferences = create<UserPreferences>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

interface AuthState {
  userId: string | null;
  email: string | null;
  displayName: string | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (userId: string, email: string, displayName?: string | null, token?: string | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  displayName: null,
  token: null,
  isAuthenticated: false,
  setUser: (userId, email, displayName = null, token = null) =>
    set({ userId, email, displayName, token, isAuthenticated: true }),
  clearUser: () =>
    set({ userId: null, email: null, displayName: null, token: null, isAuthenticated: false }),
}));
