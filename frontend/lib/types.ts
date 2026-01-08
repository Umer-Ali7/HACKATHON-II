/**
 * Type definitions for the Todo application
 */

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
}

export type TaskStatus = "all" | "pending" | "completed";

export interface ApiError {
  detail: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
