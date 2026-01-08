'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input, InputProps } from '../ui/Input';
import { PasswordStrength } from './PasswordStrength';

interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon' | 'onRightIconClick'> {
  showStrength?: boolean;
  value?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, value = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )
          }
          onRightIconClick={() => setShowPassword(!showPassword)}
          value={value}
          {...props}
        />
        {showStrength && value && (
          <div className="mt-2">
            <PasswordStrength password={value} showRequirements />
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
export type { PasswordInputProps };
