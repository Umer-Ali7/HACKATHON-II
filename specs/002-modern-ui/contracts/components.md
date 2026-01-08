# Component API Contracts

**Feature**: 002-modern-ui
**Date**: 2026-01-07

## UI Components (`components/ui/`)

### Button

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  isLoading?: boolean;
  /** Icon to show before text */
  leftIcon?: React.ReactNode;
  /** Icon to show after text */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}
```

**Usage:**
```tsx
<Button variant="primary" size="md" isLoading={submitting}>
  Sign In
</Button>

<Button variant="outline" leftIcon={<Plus />}>
  Add Task
</Button>

<Button variant="danger" size="sm">
  <Trash2 className="w-4 h-4" />
</Button>
```

---

### Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text (required for accessibility) */
  label: string;
  /** Error message to display */
  error?: string;
  /** Icon to show on left side */
  leftIcon?: React.ReactNode;
  /** Icon to show on right side (clickable) */
  rightIcon?: React.ReactNode;
  /** Callback when right icon clicked */
  onRightIconClick?: () => void;
  /** Helper text below input */
  helperText?: string;
}
```

**Usage:**
```tsx
<Input
  label="Email"
  type="email"
  leftIcon={<Mail />}
  error={errors.email?.message}
  {...register('email')}
/>

<Input
  label="Password"
  type={showPassword ? 'text' : 'password'}
  leftIcon={<Lock />}
  rightIcon={showPassword ? <EyeOff /> : <Eye />}
  onRightIconClick={() => setShowPassword(!showPassword)}
  error={errors.password?.message}
  {...register('password')}
/>
```

---

### Checkbox

```typescript
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Visual variant */
  variant?: 'default' | 'task';
  /** Show checkmark animation */
  animated?: boolean;
}
```

**Usage:**
```tsx
<Checkbox
  label="Remember me"
  {...register('rememberMe')}
/>

<Checkbox
  variant="task"
  checked={task.completed}
  onChange={() => toggleComplete(task.id)}
  animated
/>
```

---

### Badge

```typescript
interface BadgeProps {
  /** Content to display */
  children: React.ReactNode;
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Size */
  size?: 'sm' | 'md';
}
```

**Usage:**
```tsx
<Badge variant="primary">3</Badge>
<Badge variant="success" size="sm">Completed</Badge>
```

---

### Spinner

```typescript
interface SpinnerProps {
  /** Size of spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'white' | 'gray';
  /** Accessible label */
  label?: string;
}
```

**Usage:**
```tsx
<Spinner size="md" variant="white" label="Loading tasks..." />
```

---

### Avatar

```typescript
interface AvatarProps {
  /** User name for fallback initials */
  name: string;
  /** Image URL (optional) */
  src?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage:**
```tsx
<Avatar name="John Doe" size="md" />
```

---

## Form Components (`components/forms/`)

### FormField

```typescript
interface FormFieldProps {
  /** Label text */
  label: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Required indicator */
  required?: boolean;
  /** Field content */
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<FormField label="Email" error={errors.email?.message} required>
  <input {...register('email')} />
</FormField>
```

---

### PasswordInput

```typescript
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon' | 'onRightIconClick'> {
  /** Show password strength indicator */
  showStrength?: boolean;
}
```

**Usage:**
```tsx
<PasswordInput
  label="Password"
  showStrength
  error={errors.password?.message}
  {...register('password')}
/>
```

---

### PasswordStrength

```typescript
interface PasswordStrengthProps {
  /** Password to evaluate */
  password: string;
  /** Show requirements list */
  showRequirements?: boolean;
}

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'very-strong';
```

**Usage:**
```tsx
<PasswordStrength password={watchedPassword} showRequirements />
```

---

## Layout Components (`components/layout/`)

### Header

```typescript
interface HeaderProps {
  /** User information */
  user: { name: string; email: string } | null;
  /** Logout handler */
  onLogout: () => void;
  /** Show shadow (scroll state) */
  hasScrolled?: boolean;
}
```

**Usage:**
```tsx
<Header user={currentUser} onLogout={handleLogout} hasScrolled={scrollY > 0} />
```

---

### Footer

```typescript
interface FooterProps {
  /** Additional links */
  links?: Array<{ label: string; href: string }>;
}
```

**Usage:**
```tsx
<Footer links={[{ label: 'GitHub', href: 'https://github.com/...' }]} />
```

---

### Container

```typescript
interface ContainerProps {
  /** Max width constraint */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Center content */
  centered?: boolean;
  /** Content */
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Container size="lg" padding="md">
  <TaskList tasks={tasks} />
</Container>
```

---

## Task Components (`components/tasks/`)

### TaskCard

```typescript
interface TaskCardProps {
  /** Task data */
  task: Task;
  /** Toggle completion handler */
  onToggleComplete: (id: number) => void;
  /** Edit handler */
  onEdit: (id: number) => void;
  /** Delete handler */
  onDelete: (id: number) => void;
  /** Show edit mode */
  isEditing?: boolean;
}
```

**Usage:**
```tsx
<TaskCard
  task={task}
  onToggleComplete={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### TaskList

```typescript
interface TaskListProps {
  /** Array of tasks */
  tasks: Task[];
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Task action handlers */
  onToggleComplete: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
```

**Usage:**
```tsx
<TaskList
  tasks={filteredTasks}
  isLoading={loading}
  onToggleComplete={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### TaskForm

```typescript
interface TaskFormProps {
  /** Submit handler */
  onSubmit: (data: TaskCreate) => Promise<void>;
  /** Initial values (for edit mode) */
  initialValues?: TaskUpdate;
  /** Form mode */
  mode?: 'create' | 'edit';
  /** Cancel handler (for edit mode) */
  onCancel?: () => void;
  /** Submitting state */
  isSubmitting?: boolean;
}
```

**Usage:**
```tsx
<TaskForm onSubmit={handleCreate} isSubmitting={creating} />

<TaskForm
  mode="edit"
  initialValues={editingTask}
  onSubmit={handleUpdate}
  onCancel={() => setEditingTask(null)}
  isSubmitting={updating}
/>
```

---

### TaskFilter

```typescript
interface TaskFilterProps {
  /** Current filter value */
  value: TaskStatus;
  /** Change handler */
  onChange: (status: TaskStatus) => void;
  /** Task counts by status */
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}
```

**Usage:**
```tsx
<TaskFilter
  value={filter}
  onChange={setFilter}
  counts={{ all: tasks.length, pending: pendingCount, completed: completedCount }}
/>
```

---

## Modal Components (`components/modals/`)

### Modal

```typescript
interface ModalProps {
  /** Open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
}
```

**Usage:**
```tsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Task">
  <TaskForm mode="edit" ... />
</Modal>
```

---

### ConfirmModal

```typescript
interface ConfirmModalProps {
  /** Open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Confirm handler */
  onConfirm: () => void;
  /** Modal title */
  title: string;
  /** Confirmation message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Danger mode (red confirm button) */
  isDanger?: boolean;
  /** Loading state */
  isLoading?: boolean;
}
```

**Usage:**
```tsx
<ConfirmModal
  isOpen={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={handleDelete}
  title="Delete Task"
  message="Are you sure you want to delete this task? This action cannot be undone."
  confirmText="Delete"
  isDanger
  isLoading={deleting}
/>
```

---

## Feedback Components (`components/feedback/`)

### EmptyState

```typescript
interface EmptyStateProps {
  /** Icon to display */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```tsx
<EmptyState
  icon={<CheckSquare className="w-16 h-16 text-gray-300" />}
  title="No tasks yet"
  description="Create your first task to get started"
  action={{ label: 'Create Task', onClick: focusTaskInput }}
/>
```

---

### SkeletonCard

```typescript
interface SkeletonCardProps {
  /** Number of skeleton cards to show */
  count?: number;
  /** Card variant */
  variant?: 'task' | 'feature' | 'default';
}
```

**Usage:**
```tsx
{isLoading ? <SkeletonCard count={3} variant="task" /> : <TaskList ... />}
```

---

## Custom Hooks (`hooks/`)

### useScrollPosition

```typescript
function useScrollPosition(): {
  scrollY: number;
  isScrolled: boolean;
}
```

**Usage:**
```tsx
const { isScrolled } = useScrollPosition();
<Header hasScrolled={isScrolled} />
```

---

### useMediaQuery

```typescript
function useMediaQuery(query: string): boolean;
```

**Usage:**
```tsx
const isMobile = useMediaQuery('(max-width: 640px)');
```

---

### usePasswordStrength

```typescript
function usePasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  requirements: {
    minLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}
```

**Usage:**
```tsx
const { level, requirements } = usePasswordStrength(password);
```

---

### useToast

```typescript
function useToast(): {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (id: string) => void;
}
```

**Usage:**
```tsx
const toast = useToast();
toast.success('Task created successfully!');
toast.error('Failed to delete task');
const loadingId = toast.loading('Creating task...');
toast.dismiss(loadingId);
```
