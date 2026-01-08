'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  isSubmitting?: boolean;
}

function TaskForm({ onSubmit, isSubmitting = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      title: data.title,
      description: data.description || undefined,
    });
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-card"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Create New Task
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="What needs to be done?"
          leftIcon={<FileText className="w-5 h-5" />}
          error={errors.title?.message}
          {...register('title')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description (optional)
          </label>
          <textarea
            placeholder="Add more details..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-purple-500 focus:ring-purple-500/20"
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-500" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Add Task
        </Button>
      </form>
    </motion.div>
  );
}

export { TaskForm };
export type { TaskFormProps };
