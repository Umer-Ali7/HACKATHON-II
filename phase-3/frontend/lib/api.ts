/**
 * Backend API client for the Todo AI Chatbot.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ToolCallRecord {
  tool: string;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: ToolCallRecord[];
}

export interface TaskItem {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StatsData {
  total: number;
  pending: number;
  completed: number;
  recent_tasks: TaskItem[];
  activity: { date: string; count: number }[];
}

export interface ConversationItem {
  id: number;
  created_at: string;
  message_count: number;
  last_message_preview: string | null;
}

export interface MessageItem {
  id: number;
  role: "user" | "assistant";
  content: string;
  tool_calls: ToolCallRecord[] | null;
  created_at: string;
}

export interface ProfileData {
  id: string;
  email: string;
  display_name: string | null;
  theme_preference: string | null;
}

export interface ApiError {
  error: string;
  detail: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body: ApiError = await res.json().catch(() => ({
        error: "unknown",
        detail: `Request failed with status ${res.status}`,
      }));
      throw new Error(body.detail);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Auth
export interface AuthResponse {
  user_id: string;
  email: string;
  name: string | null;
  token: string;
}

export async function signup(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  return request<AuthResponse>(`${API_URL}/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ email, password, name: name ?? null }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>(`${API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Chat
export async function sendMessage(
  userId: string,
  message: string,
  conversationId?: number
): Promise<ChatResponse> {
  return request<ChatResponse>(`${API_URL}/api/${userId}/chat`, {
    method: "POST",
    body: JSON.stringify({
      message,
      conversation_id: conversationId ?? null,
    }),
  });
}

// Tasks
export async function listTasks(
  userId: string,
  status: string = "all",
  search: string = ""
): Promise<{ tasks: TaskItem[] }> {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (search) params.set("search", search);
  const qs = params.toString();
  return request(`${API_URL}/api/${userId}/tasks${qs ? `?${qs}` : ""}`);
}

export async function createTask(
  userId: string,
  title: string,
  description?: string
): Promise<TaskItem> {
  return request(`${API_URL}/api/${userId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title, description: description ?? null }),
  });
}

export async function updateTask(
  userId: string,
  taskId: number,
  data: { title?: string; description?: string; completed?: boolean }
): Promise<TaskItem> {
  return request(`${API_URL}/api/${userId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(
  userId: string,
  taskId: number
): Promise<void> {
  return request(`${API_URL}/api/${userId}/tasks/${taskId}`, {
    method: "DELETE",
  });
}

// Stats
export async function getStats(userId: string): Promise<StatsData> {
  return request(`${API_URL}/api/${userId}/stats`);
}

// Conversations
export async function listConversations(
  userId: string
): Promise<{ conversations: ConversationItem[] }> {
  return request(`${API_URL}/api/${userId}/conversations`);
}

export async function getMessages(
  userId: string,
  conversationId: number,
  limit: number = 50
): Promise<{ messages: MessageItem[] }> {
  return request(
    `${API_URL}/api/${userId}/conversations/${conversationId}/messages?limit=${limit}`
  );
}

// Profile
export async function getProfile(userId: string): Promise<ProfileData> {
  return request(`${API_URL}/api/${userId}/profile`);
}

export async function updateProfile(
  userId: string,
  data: { display_name?: string; theme_preference?: string }
): Promise<ProfileData> {
  return request(`${API_URL}/api/${userId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
