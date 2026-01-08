# Quickstart: Modern UI Enhancement

**Feature**: 002-modern-ui
**Date**: 2026-01-07

## Prerequisites

- Node.js 18+ (for Next.js 16)
- npm or pnpm package manager
- Running backend API at `http://localhost:8000`
- Existing frontend project with Tailwind CSS v4

## Setup

### 1. Install New Dependencies

```bash
cd frontend

# Animation library
npm install framer-motion

# Toast notifications
npm install sonner

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Icons
npm install lucide-react
```

### 2. Update Global Styles

Edit `app/globals.css` to add design tokens:

```css
@import "tailwindcss";

:root {
  /* Existing variables preserved */
  --background: #ffffff;
  --foreground: #171717;

  /* NEW: Design System Colors */
  --color-primary-50: #f5f3ff;
  --color-primary-100: #ede9fe;
  --color-primary-500: #8b5cf6;
  --color-primary-600: #7c3aed;
  --color-primary-700: #6d28d9;

  --color-secondary-500: #06b6d4;
  --color-secondary-600: #0891b2;

  --color-success-100: #d1fae5;
  --color-success-500: #10b981;

  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;

  --color-danger-100: #fee2e2;
  --color-danger-500: #ef4444;

  /* NEW: Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-hero: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);

  /* NEW: Shadows */
  --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.4);
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* NEW: Animation durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

/* NEW: Utility Classes */
@layer utilities {
  .gradient-primary {
    background: var(--gradient-primary);
  }

  .gradient-hero {
    background: var(--gradient-hero);
  }

  .shadow-card {
    box-shadow: var(--shadow-card);
  }

  .shadow-card-hover {
    box-shadow: var(--shadow-card-hover);
  }

  .shadow-glow {
    box-shadow: var(--shadow-glow);
  }
}

/* NEW: Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Add Toast Provider to Layout

Edit `app/layout.tsx`:

```tsx
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            },
          }}
        />
      </body>
    </html>
  );
}
```

### 4. Create Component Directory Structure

```bash
mkdir -p components/ui
mkdir -p components/forms
mkdir -p components/layout
mkdir -p components/tasks
mkdir -p components/modals
mkdir -p components/feedback
mkdir -p hooks
mkdir -p lib/validations
```

### 5. Create Base Button Component

Create `components/ui/Button.tsx`:

```tsx
'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    disabled,
    ...props
  }, ref) => {
    const variants = {
      primary: 'gradient-primary text-white hover:opacity-90 shadow-md hover:shadow-lg',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
      outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
      ghost: 'text-gray-600 hover:bg-gray-100',
      danger: 'bg-danger-500 text-white hover:bg-red-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
```

### 6. Create Utility Functions

Create `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install utility dependencies:

```bash
npm install clsx tailwind-merge
```

### 7. Create Validation Schemas

Create `lib/validations/auth.ts`:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
```

Create `lib/validations/task.ts`:

```typescript
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(val => val.trim()),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .transform(val => val.trim())
    .optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
```

## Development Workflow

### Running the Application

```bash
# Terminal 1: Backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Component Development Order

1. **UI Primitives** (Day 1)
   - Button, Input, Checkbox, Badge, Spinner, Avatar

2. **Form Components** (Day 1-2)
   - FormField, PasswordInput, PasswordStrength

3. **Layout Components** (Day 2)
   - Header, Footer, Container

4. **Feedback Components** (Day 2)
   - Modal, ConfirmModal, EmptyState, SkeletonCard

5. **Task Components** (Day 3)
   - TaskCard, TaskList, TaskForm, TaskFilter

6. **Page Updates** (Day 3-4)
   - Landing page, Login page, Signup page, Tasks page

### Testing Checklist

After implementing each component:

- [ ] Renders correctly in light mode
- [ ] Hover/focus states work
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Responsive at 375px, 768px, 1440px
- [ ] Animations run at 60fps
- [ ] Reduced motion respected

## File Structure Reference

```
frontend/
├── app/
│   ├── globals.css        # Updated with design tokens
│   ├── layout.tsx         # Updated with Toaster
│   ├── page.tsx           # Landing page (new)
│   ├── login/page.tsx     # Redesigned
│   ├── signup/page.tsx    # Redesigned
│   └── tasks/page.tsx     # Redesigned
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Avatar.tsx
│   ├── forms/
│   │   ├── FormField.tsx
│   │   ├── PasswordInput.tsx
│   │   └── PasswordStrength.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskFilter.tsx
│   ├── modals/
│   │   ├── Modal.tsx
│   │   └── ConfirmModal.tsx
│   └── feedback/
│       ├── EmptyState.tsx
│       └── SkeletonCard.tsx
├── hooks/
│   ├── useScrollPosition.ts
│   ├── useMediaQuery.ts
│   ├── usePasswordStrength.ts
│   └── useToast.ts
├── lib/
│   ├── api.ts             # Existing
│   ├── auth.ts            # Existing
│   ├── types.ts           # Existing
│   ├── utils.ts           # New
│   └── validations/
│       ├── auth.ts
│       └── task.ts
└── package.json           # Updated dependencies
```

## Troubleshooting

### Framer Motion SSR Issues

If you see hydration errors, wrap animated components:

```tsx
import { LazyMotion, domAnimation } from 'framer-motion';

<LazyMotion features={domAnimation}>
  {/* Animated components here */}
</LazyMotion>
```

### Tailwind v4 CSS Variables

Tailwind v4 uses CSS-first configuration. Add custom utilities in `globals.css` using `@layer utilities {}` instead of `tailwind.config.js`.

### Toast Not Showing

Ensure `<Toaster />` is in the root layout and positioned correctly. Check that `sonner` is imported from the correct package.
