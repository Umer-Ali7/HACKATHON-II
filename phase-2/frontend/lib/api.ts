import type { Task, TaskCreate, TaskUpdate } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      message = body.detail || body.message || message;
    } catch {
      // ignore JSON parse error
    }
    throw new ApiClientError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

type TaskStatus = 'all' | 'pending' | 'completed';

export const api = {
  getTasks(filter: TaskStatus = 'all'): Promise<Task[]> {
    const params = filter !== 'all' ? `?completed=${filter === 'completed'}` : '';
    return request<Task[]>(`/api/tasks${params}`);
  },

  createTask(data: TaskCreate): Promise<Task> {
    return request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask(id: number, data: TaskUpdate): Promise<Task> {
    return request<Task>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  toggleTaskCompletion(id: number): Promise<Task> {
    return request<Task>(`/api/tasks/${id}/toggle`, { method: 'POST' });
  },

  deleteTask(id: number): Promise<void> {
    return request<void>(`/api/tasks/${id}`, { method: 'DELETE' });
  },
};
