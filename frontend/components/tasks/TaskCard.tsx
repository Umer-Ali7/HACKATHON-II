'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit2, Trash2, Check } from 'lucide-react';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onEdit: (id: number, title: string, description?: string) => void;
  onDelete: (id: number) => void;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
}

function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
}: TaskCardProps) {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(task.id, editTitle.trim(), editDescription.trim() || undefined);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isEditing) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-5 shadow-card"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            maxLength={200}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Task description (optional)"
              maxLength={1000}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-purple-500 focus:ring-purple-500/20"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!editTitle.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        'bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200',
        task.completed && 'opacity-75'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-purple-500'
          )}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'text-lg font-semibold transition-all duration-200',
              task.completed
                ? 'line-through text-gray-400'
                : 'text-gray-900'
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={cn(
                'mt-1 text-sm',
                task.completed ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(task.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartEdit}
            className="text-gray-400 hover:text-purple-600"
            aria-label="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export { TaskCard };
export type { TaskCardProps };
