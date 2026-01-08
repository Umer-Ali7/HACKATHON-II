'use client';

import { cn } from '@/lib/utils';
import { Badge } from '../ui/Badge';

type TaskStatus = 'all' | 'pending' | 'completed';

interface TaskFilterProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

const filterOptions: { value: TaskStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

function TaskFilter({ value, onChange, counts }: TaskFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            value === option.value
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          )}
        >
          {option.label}
          <Badge
            variant={value === option.value ? 'default' : 'primary'}
            size="sm"
            className={cn(
              value === option.value
                ? 'bg-white/20 text-white'
                : ''
            )}
          >
            {counts[option.value]}
          </Badge>
        </button>
      ))}
    </div>
  );
}

export { TaskFilter };
export type { TaskFilterProps, TaskStatus };
