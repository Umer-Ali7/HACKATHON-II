'use client';

import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  variant?: 'default' | 'task';
  animated?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, variant = 'default', animated = false, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const variants = {
      default: {
        box: 'w-5 h-5 rounded border-2 border-gray-300 peer-checked:border-purple-500 peer-checked:bg-purple-500',
        check: 'text-white',
      },
      task: {
        box: 'w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-500',
        check: 'text-white',
      },
    };

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center transition-all duration-200',
              variants[variant].box,
              animated && 'peer-checked:scale-110 peer-checked:animate-pulse'
            )}
          >
            <Check
              className={cn(
                'w-3.5 h-3.5 opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100',
                variants[variant].check,
                // Target the check icon inside the checked state
                '[input:checked+div>&]:opacity-100 [input:checked+div>&]:scale-100'
              )}
            />
          </div>
        </div>
        {label && (
          <span className="text-sm text-gray-700 peer-checked:text-gray-500">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export type { CheckboxProps };
