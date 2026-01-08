'use client';

import { useMemo } from 'react';

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';

interface PasswordRequirements {
  minLength: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

interface PasswordStrength {
  score: number;
  level: StrengthLevel;
  requirements: PasswordRequirements;
}

function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    const requirements: PasswordRequirements = {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    // Calculate score (0-5)
    const score = Object.values(requirements).filter(Boolean).length;

    // Determine level
    let level: StrengthLevel;
    if (score <= 2) {
      level = 'weak';
    } else if (score === 3) {
      level = 'medium';
    } else if (score === 4) {
      level = 'strong';
    } else {
      level = 'very-strong';
    }

    return { score, level, requirements };
  }, [password]);
}

export { usePasswordStrength };
export type { PasswordStrength, PasswordRequirements, StrengthLevel };
