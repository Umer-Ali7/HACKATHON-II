import type { Task, TaskCreate, TaskUpdate, TaskStatus, ApiError } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Get the JWT token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    throw new ApiClientError("Not authenticated", 401);
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    // Redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiClientError("Unauthorized", 401, "Session expired");
  }

  // Handle other errors
  if (!response.ok) {
    let errorDetail = `HTTP error ${response.status}`;
    try {
      const errorData: ApiError = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      // Response wasn't JSON
    }

    throw new ApiClientError(
      `Request failed: ${errorDetail}`,
      response.status,
      errorDetail
    );
  }

  // Handle 204 No Content (e.g., DELETE requests)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * API client for task operations
 */
export const api = {
  /**
   * Get all tasks for the authenticated user
   *
   * @param status - Optional filter: 'all', 'pending', or 'completed'
   * @returns Array of tasks sorted by creation date (newest first)
   */
  getTasks: async (status?: TaskStatus): Promise<Task[]> => {
    const queryParams = status && status !== "all" ? `?status=${status}` : "";
    return apiRequest<Task[]>(`/api/tasks${queryParams}`);
  },

  /**
   * Get a single task by ID
   *
   * @param id - Task ID
   * @returns The task
   * @throws ApiClientError if task not found or user doesn't have access
   */
  getTask: async (id: number): Promise<Task> => {
    return apiRequest<Task>(`/api/tasks/${id}`);
  },

  /**
   * Create a new task
   *
   * @param data - Task data (title and optional description)
   * @returns The created task with generated ID and timestamps
   */
  createTask: async (data: TaskCreate): Promise<Task> => {
    return apiRequest<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing task
   *
   * @param id - Task ID
   * @param data - Updated task data (title and/or description)
   * @returns The updated task
   * @throws ApiClientError if task not found or user doesn't have access
   */
  updateTask: async (id: number, data: TaskUpdate): Promise<Task> => {
    return apiRequest<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Toggle task completion status
   *
   * @param id - Task ID
   * @returns The updated task with toggled completion status
   * @throws ApiClientError if task not found or user doesn't have access
   */
  toggleTaskCompletion: async (id: number): Promise<Task> => {
    return apiRequest<Task>(`/api/tasks/${id}/complete`, {
      method: "PATCH",
    });
  },

  /**
   * Delete a task
   *
   * @param id - Task ID
   * @throws ApiClientError if task not found or user doesn't have access
   */
  deleteTask: async (id: number): Promise<void> => {
    return apiRequest<void>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
