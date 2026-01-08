'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api, ApiClientError } from '@/lib/api';
import type { Task, TaskCreate } from '@/lib/types';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilter, type TaskStatus } from '@/components/tasks/TaskFilter';
import { TaskList } from '@/components/tasks/TaskList';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function TasksPage() {
  const router = useRouter();
  const { isScrolled } = useScrollPosition();
  const formRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Invalid user data
      }
    }
  }, []);

  // Load tasks
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTasks(filter);
      setTasks(data);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.push('/login');
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to load tasks');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  // Calculate counts
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  // Get filtered tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Create task
  const handleCreate = async (data: { title: string; description?: string }) => {
    setIsCreating(true);
    try {
      const newTask: TaskCreate = {
        title: data.title,
        description: data.description,
      };
      await api.createTask(newTask);
      toast.success('Task created successfully');
      await loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle completion
  const handleToggleComplete = async (id: number) => {
    try {
      await api.toggleTaskCompletion(id);
      const task = tasks.find((t) => t.id === id);
      toast.success(
        task?.completed ? 'Task marked as pending' : 'Task completed!'
      );
      await loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  // Edit task
  const handleEdit = async (id: number, title: string, description?: string) => {
    try {
      await api.updateTask(id, { title, description });
      setEditingId(null);
      toast.success('Task updated successfully');
      await loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  // Delete task
  const confirmDelete = (id: number) => {
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;

    setIsDeleting(true);
    try {
      await api.deleteTask(taskToDelete);
      toast.success('Task deleted successfully');
      await loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Failed to log out');
    }
  };

  // Focus on form
  const focusTaskForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    const input = formRef.current?.querySelector('input');
    input?.focus();
  };

  // Get empty message based on filter
  const getEmptyMessage = () => {
    if (filter === 'pending') return 'No pending tasks';
    if (filter === 'completed') return 'No completed tasks';
    return 'No tasks yet';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user ? { name: user.name || 'User', email: user.email } : null}
        onLogout={handleLogout}
        hasScrolled={isScrolled}
      />

      <main className="py-8">
        <Container size="lg" padding="md">
          {/* Task Form */}
          <div ref={formRef} className="mb-8">
            <TaskForm onSubmit={handleCreate} isSubmitting={isCreating} />
          </div>

          {/* Filter Section */}
          <div className="mb-6">
            <TaskFilter value={filter} onChange={setFilter} counts={counts} />
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            emptyMessage={getEmptyMessage()}
            editingId={editingId}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            onStartEdit={setEditingId}
            onCancelEdit={() => setEditingId(null)}
            onEmptyAction={filter === 'all' ? focusTaskForm : undefined}
          />
        </Container>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        isDanger
        isLoading={isDeleting}
      />
    </div>
  );
}
