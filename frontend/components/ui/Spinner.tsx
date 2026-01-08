'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'gray';
  label?: string;
}

function Spinner({ size = 'md', variant = 'primary', label }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  const variants = {
    primary: 'border-purple-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
  };

  return (
    <div role="status" aria-label={label || 'Loading'}>
      <div
        className={cn(
          'animate-spin rounded-full',
          sizes[size],
          variants[variant]
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}

export { Spinner };
export type { SpinnerProps };
