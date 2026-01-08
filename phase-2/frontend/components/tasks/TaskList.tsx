'use client';

import { AnimatePresence } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import type { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../feedback/EmptyState';
import { SkeletonCard } from '../feedback/SkeletonCard';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  emptyMessage?: string;
  editingId: number | null;
  onToggleComplete: (id: number) => void;
  onEdit: (id: number, title: string, description?: string) => void;
  onDelete: (id: number) => void;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  onEmptyAction?: () => void;
}

function TaskList({
  tasks,
  isLoading = false,
  emptyMessage = 'No tasks yet',
  editingId,
  onToggleComplete,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onEmptyAction,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard count={3} variant="task" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<CheckSquare className="w-16 h-16" />}
        title={emptyMessage}
        description="Create your first task to get started"
        action={
          onEmptyAction
            ? { label: 'Create Task', onClick: onEmptyAction }
            : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isEditing={editingId === task.id}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onStartEdit={() => onStartEdit(task.id)}
            onCancelEdit={onCancelEdit}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export { TaskList };
export type { TaskListProps };
