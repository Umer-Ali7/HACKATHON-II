'use client';

import { Check, X } from 'lucide-react';
import { usePasswordStrength, type StrengthLevel } from '@/hooks/usePasswordStrength';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

const strengthConfig: Record<StrengthLevel, { label: string; color: string; width: string }> = {
  weak: { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' },
  medium: { label: 'Medium', color: 'bg-amber-500', width: 'w-2/4' },
  strong: { label: 'Strong', color: 'bg-green-500', width: 'w-3/4' },
  'very-strong': { label: 'Very Strong', color: 'bg-green-600', width: 'w-full' },
};

function PasswordStrength({ password, showRequirements = false }: PasswordStrengthProps) {
  const { level, requirements } = usePasswordStrength(password);
  const config = strengthConfig[level];

  const requirementsList = [
    { key: 'minLength', label: 'At least 8 characters', met: requirements.minLength },
    { key: 'hasLowercase', label: 'One lowercase letter', met: requirements.hasLowercase },
    { key: 'hasUppercase', label: 'One uppercase letter', met: requirements.hasUppercase },
    { key: 'hasNumber', label: 'One number', met: requirements.hasNumber },
    { key: 'hasSpecial', label: 'One special character', met: requirements.hasSpecial },
  ];

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              config.color,
              config.width
            )}
          />
        </div>
        <p className={cn('text-xs font-medium', {
          'text-red-500': level === 'weak',
          'text-amber-500': level === 'medium',
          'text-green-500': level === 'strong' || level === 'very-strong',
        })}>
          {config.label}
        </p>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <ul className="space-y-1">
          {requirementsList.map(({ key, label, met }) => (
            <li
              key={key}
              className={cn(
                'flex items-center gap-2 text-xs transition-colors',
                met ? 'text-green-600' : 'text-gray-400'
              )}
            >
              {met ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { PasswordStrength };
export type { PasswordStrengthProps };
