'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const initials = useMemo(() => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgColor = useMemo(() => {
    // Generate consistent color based on name
    const colors = [
      'bg-purple-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-green-500',
      'bg-amber-500',
      'bg-red-500',
      'bg-pink-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [name]);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover',
          sizes[size]
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium',
        sizes[size],
        bgColor
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
