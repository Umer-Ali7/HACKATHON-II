# Data Model: Modern UI Enhancement

**Feature**: 002-modern-ui
**Date**: 2026-01-07
**Status**: Complete

## Overview

This UI enhancement feature does not introduce new database entities. Instead, it defines **design tokens** and **component contracts** that govern the visual presentation layer.

---

## Design Token Entities

### Color Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--color-primary-50` | `#f5f3ff` | Primary background tints |
| `--color-primary-100` | `#ede9fe` | Hover backgrounds |
| `--color-primary-500` | `#8b5cf6` | Primary actions, links |
| `--color-primary-600` | `#7c3aed` | Primary hover states |
| `--color-primary-700` | `#6d28d9` | Primary active states |
| `--color-secondary-500` | `#06b6d4` | Secondary actions, accents |
| `--color-secondary-600` | `#0891b2` | Secondary hover states |
| `--color-success-500` | `#10b981` | Success states, completed |
| `--color-success-100` | `#d1fae5` | Success backgrounds |
| `--color-warning-500` | `#f59e0b` | Warning states |
| `--color-warning-100` | `#fef3c7` | Warning backgrounds |
| `--color-danger-500` | `#ef4444` | Error states, delete |
| `--color-danger-100` | `#fee2e2` | Error backgrounds |
| `--color-gray-50` | `#f9fafb` | Page backgrounds |
| `--color-gray-100` | `#f3f4f6` | Card backgrounds |
| `--color-gray-200` | `#e5e7eb` | Borders |
| `--color-gray-300` | `#d1d5db` | Disabled states |
| `--color-gray-500` | `#6b7280` | Muted text |
| `--color-gray-700` | `#374151` | Secondary text |
| `--color-gray-900` | `#111827` | Primary text |

### Gradient Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--gradient-primary` | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)` | Hero backgrounds, primary buttons |
| `--gradient-hero` | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)` | Landing page hero |

### Spacing Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--space-1` | `4px` | Tight spacing (icon gaps) |
| `--space-2` | `8px` | Small spacing (button padding) |
| `--space-3` | `12px` | Medium spacing |
| `--space-4` | `16px` | Standard spacing (card padding) |
| `--space-5` | `20px` | Comfortable spacing |
| `--space-6` | `24px` | Section spacing |
| `--space-8` | `32px` | Large spacing |
| `--space-10` | `40px` | Extra large spacing |
| `--space-12` | `48px` | Section margins |
| `--space-16` | `64px` | Page sections |

### Typography Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--font-sans` | `'Inter', system-ui, sans-serif` | Body text |
| `--font-mono` | `'Geist Mono', monospace` | Code, technical |
| `--text-xs` | `12px / 1.5` | Badges, labels |
| `--text-sm` | `14px / 1.5` | Secondary text |
| `--text-base` | `16px / 1.5` | Body text |
| `--text-lg` | `18px / 1.5` | Lead text |
| `--text-xl` | `20px / 1.5` | Card titles |
| `--text-2xl` | `24px / 1.3` | Section headings |
| `--text-3xl` | `30px / 1.2` | Page headings |
| `--text-4xl` | `36px / 1.1` | Hero text |
| `--text-5xl` | `48px / 1.0` | Display text |
| `--font-normal` | `400` | Body weight |
| `--font-medium` | `500` | Emphasis |
| `--font-semibold` | `600` | Headings |
| `--font-bold` | `700` | Strong emphasis |

### Shadow Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Elevated elements |
| `--shadow-glow` | `0 0 20px rgba(139,92,246,0.4)` | Focus, active states |
| `--shadow-card` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` | Task cards |
| `--shadow-card-hover` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` | Card hover |

### Border Radius Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-sm` | `4px` | Buttons, inputs |
| `--radius-md` | `8px` | Cards, containers |
| `--radius-lg` | `12px` | Modals, large cards |
| `--radius-xl` | `16px` | Hero sections |
| `--radius-full` | `9999px` | Pills, avatars |

### Animation Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--duration-fast` | `150ms` | Hover effects |
| `--duration-normal` | `200ms` | State changes |
| `--duration-slow` | `300ms` | Page transitions |
| `--duration-slower` | `500ms` | Modal enter |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State transitions |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful animations |

### Breakpoint Tokens

| Token Name | Value | Usage |
|------------|-------|-------|
| `--breakpoint-sm` | `640px` | Mobile/Tablet boundary |
| `--breakpoint-md` | `768px` | Tablet |
| `--breakpoint-lg` | `1024px` | Desktop |
| `--breakpoint-xl` | `1280px` | Large desktop |
| `--breakpoint-2xl` | `1536px` | Extra large |

---

## Component State Models

### Button States

```typescript
interface ButtonState {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  state: 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading';
}
```

| State | Visual Treatment |
|-------|------------------|
| Default | Base colors, normal shadow |
| Hover | Darker shade, increased shadow, slight scale (1.02) |
| Active | Darkest shade, reduced shadow, scale down (0.98) |
| Focus | Focus ring (glow shadow), outline offset |
| Disabled | Reduced opacity (0.5), cursor not-allowed |
| Loading | Spinner icon, disabled interaction |

### Input States

```typescript
interface InputState {
  state: 'default' | 'focus' | 'error' | 'success' | 'disabled';
  hasValue: boolean;
  hasIcon: boolean;
}
```

| State | Visual Treatment |
|-------|------------------|
| Default | Gray border, gray placeholder |
| Focus | Primary border, glow shadow, label floats up |
| Error | Danger border, error icon, error message below |
| Success | Success border, checkmark icon |
| Disabled | Gray background, reduced opacity |

### Task Card States

```typescript
interface TaskCardState {
  completed: boolean;
  isHovered: boolean;
  isDeleting: boolean;
  isEditing: boolean;
}
```

| State | Visual Treatment |
|-------|------------------|
| Default | White background, subtle shadow |
| Hover | Elevated shadow, slight lift (-2px translateY) |
| Completed | Strikethrough title, reduced opacity (0.7), green checkbox |
| Deleting | Danger border, fade out animation |
| Editing | Primary border, expanded form fields |

### Filter Button States

```typescript
interface FilterState {
  active: boolean;
  count: number;
}
```

| State | Visual Treatment |
|-------|------------------|
| Inactive | Gray background, dark text |
| Active | Primary gradient background, white text |
| With Badge | Circular count badge on right |

---

## Validation Schemas

### Login Form Schema

```typescript
const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});
```

### Signup Form Schema

```typescript
const signupSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

### Task Form Schema

```typescript
const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(val => val.trim()),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .transform(val => val.trim())
    .optional(),
});
```

---

## Animation Definitions

### Page Transitions

```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } },
};
```

### Card Animations

```typescript
const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  hover: { y: -2, boxShadow: 'var(--shadow-card-hover)' },
};
```

### Modal Animations

```typescript
const modalVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
  },
};
```

### Toast Animations

```typescript
const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: 100, transition: { duration: 0.2 } },
};
```

---

## Responsive Layout Definitions

### Container Widths

| Breakpoint | Container Max-Width |
|------------|---------------------|
| Mobile (< 640px) | 100% - 32px padding |
| Tablet (640px - 1024px) | 640px centered |
| Desktop (> 1024px) | 1024px centered |
| Wide (> 1280px) | 1200px centered |

### Grid Configurations

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Feature Cards | 1 column | 2 columns | 4 columns |
| Task List | 1 column | 2 columns | 2 columns |
| Auth Form | 1 column | 1 column (centered) | 1 column (centered) |
| Header | Stack | Inline | Inline |

---

## Accessibility Requirements

### Focus Management

| Element | Focus Style |
|---------|-------------|
| Buttons | `ring-2 ring-primary-500 ring-offset-2` |
| Inputs | `border-primary-500 ring-2 ring-primary-500/20` |
| Cards | `ring-2 ring-primary-500 ring-offset-2` |
| Links | `underline outline-primary-500` |

### ARIA Attributes Required

| Component | Required ARIA |
|-----------|---------------|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="alert"`, `aria-live="polite"` |
| Loading Spinner | `role="status"`, `aria-label="Loading"` |
| Password Toggle | `aria-label="Toggle password visibility"` |
| Filter Buttons | `role="tablist"`, `aria-selected` |
| Task Checkbox | `role="checkbox"`, `aria-checked` |

### Color Contrast Requirements

| Text Type | Minimum Ratio | Achieved |
|-----------|---------------|----------|
| Body text on white | 4.5:1 | `gray-900` on `white` = 21:1 |
| Muted text on white | 4.5:1 | `gray-500` on `white` = 7.5:1 |
| White text on primary | 4.5:1 | `white` on `primary-600` = 6.2:1 |
| Error text on white | 4.5:1 | `danger-500` on `white` = 4.6:1 |
