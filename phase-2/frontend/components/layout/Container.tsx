'use client';

import { cn } from '@/lib/utils';

interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Container({
  size = 'lg',
  padding = 'md',
  centered = true,
  children,
  className,
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddings = {
    none: '',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };

  return (
    <div
      className={cn(
        'w-full',
        sizes[size],
        paddings[padding],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export { Container };
export type { ContainerProps };
