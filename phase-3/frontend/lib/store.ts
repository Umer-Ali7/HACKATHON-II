import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserPreferences {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const usePreferences = create<UserPreferences>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

// Chat message type
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: Array<{
    tool: string;
    parameters: Record<string, unknown>;
    result: Record<string, unknown>;
  }>;
}

// Chat state interface
interface ChatState {
  conversationId: number | null;
  messages: ChatMessage[];
  setConversationId: (id: number | null) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearChat: () => void;
}

// Chat store with localStorage persistence
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversationId: null,
      messages: [],
      setConversationId: (id) => set({ conversationId: id }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      clearChat: () => set({ conversationId: null, messages: [] }),
    }),
    {
      name: "chat-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

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
