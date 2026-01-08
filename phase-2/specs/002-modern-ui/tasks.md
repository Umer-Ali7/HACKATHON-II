# Tasks: Modern UI Enhancement

**Input**: Design documents from `/specs/002-modern-ui/`
**Prerequisites**: plan.md (complete), spec.md (complete), data-model.md (complete), contracts/components.md (complete)

**Tests**: Not explicitly requested in spec - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/` at repository root
- Backend unchanged (no backend tasks)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and establish design system foundation

- [ ] T001 Install new npm dependencies in frontend/package.json (framer-motion, sonner, react-hook-form, @hookform/resolvers, zod, lucide-react, clsx, tailwind-merge)
- [ ] T002 [P] Create utility function cn() in frontend/lib/utils.ts
- [ ] T003 [P] Update design tokens in frontend/app/globals.css with color variables, gradients, shadows, and animations
- [ ] T004 [P] Add Toaster provider to frontend/app/layout.tsx
- [ ] T005 [P] Create component directory structure: frontend/components/{ui,forms,layout,tasks,modals,feedback}
- [ ] T006 [P] Create hooks directory: frontend/hooks/
- [ ] T007 [P] Create validations directory: frontend/lib/validations/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build reusable UI primitives and utilities that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

### UI Primitives

- [ ] T008 [P] Create Button component with variants (primary, secondary, outline, ghost, danger) in frontend/components/ui/Button.tsx
- [ ] T009 [P] Create Input component with label, error, icons in frontend/components/ui/Input.tsx
- [ ] T010 [P] Create Checkbox component with default and task variants in frontend/components/ui/Checkbox.tsx
- [ ] T011 [P] Create Badge component in frontend/components/ui/Badge.tsx
- [ ] T012 [P] Create Spinner component in frontend/components/ui/Spinner.tsx
- [ ] T013 [P] Create Avatar component in frontend/components/ui/Avatar.tsx

### Custom Hooks

- [ ] T014 [P] Create useScrollPosition hook in frontend/hooks/useScrollPosition.ts
- [ ] T015 [P] Create useMediaQuery hook in frontend/hooks/useMediaQuery.ts
- [ ] T016 [P] Create usePasswordStrength hook in frontend/hooks/usePasswordStrength.ts

### Layout Components

- [ ] T017 [P] Create Container component in frontend/components/layout/Container.tsx
- [ ] T018 [P] Create Footer component in frontend/components/layout/Footer.tsx

### Feedback Components

- [ ] T019 [P] Create EmptyState component in frontend/components/feedback/EmptyState.tsx
- [ ] T020 [P] Create SkeletonCard component in frontend/components/feedback/SkeletonCard.tsx

### Modal Components

- [ ] T021 [P] Create Modal base component with backdrop blur and animations in frontend/components/modals/Modal.tsx
- [ ] T022 Create ConfirmModal component extending Modal in frontend/components/modals/ConfirmModal.tsx

**Checkpoint**: Foundation ready - all UI primitives, hooks, and shared components available

---

## Phase 3: User Story 1 - Landing Page (Priority: P1) MVP

**Goal**: Create a visually compelling landing page with hero section, features, and footer

**Independent Test**: Visit root URL, verify hero renders with gradient background, CTA buttons have hover effects, feature cards display, responsive at 375px/768px/1440px

### Implementation for User Story 1

- [ ] T023 [US1] Create hero section with gradient background, headline, subheadline in frontend/app/page.tsx
- [ ] T024 [US1] Add animated background patterns to hero section in frontend/app/page.tsx
- [ ] T025 [US1] Implement "Get Started" and "Sign In" CTA buttons with hover animations in frontend/app/page.tsx
- [ ] T026 [US1] Create feature card component with icon, title, description in frontend/app/page.tsx
- [ ] T027 [US1] Build features grid section with 4 feature cards in frontend/app/page.tsx
- [ ] T028 [US1] Integrate Footer component into landing page in frontend/app/page.tsx
- [ ] T029 [US1] Add responsive styles for mobile (< 640px) single column layout in frontend/app/page.tsx
- [ ] T030 [US1] Add tablet (640px-1024px) and desktop (> 1024px) responsive breakpoints in frontend/app/page.tsx

**Checkpoint**: Landing page is fully functional and responsive - can demo independently

---

## Phase 4: User Story 2 - Authentication Pages (Priority: P1)

**Goal**: Modern login and signup pages with form validation, loading states, and password strength

**Independent Test**: Navigate to /login and /signup, verify glassmorphism card, input focus animations, password toggle, validation errors, loading spinner on submit

### Form Components (US2 specific)

- [ ] T031 [P] [US2] Create FormField wrapper component in frontend/components/forms/FormField.tsx
- [ ] T032 [P] [US2] Create PasswordInput component with visibility toggle in frontend/components/forms/PasswordInput.tsx
- [ ] T033 [P] [US2] Create PasswordStrength indicator component in frontend/components/forms/PasswordStrength.tsx

### Validation Schemas

- [ ] T034 [P] [US2] Create login validation schema with Zod in frontend/lib/validations/auth.ts
- [ ] T035 [P] [US2] Create signup validation schema with password confirmation in frontend/lib/validations/auth.ts

### Login Page Implementation

- [ ] T036 [US2] Redesign login page with centered glassmorphism card in frontend/app/login/page.tsx
- [ ] T037 [US2] Add gradient background pattern to login page in frontend/app/login/page.tsx
- [ ] T038 [US2] Implement email input with icon and validation in frontend/app/login/page.tsx
- [ ] T039 [US2] Implement password input with visibility toggle in frontend/app/login/page.tsx
- [ ] T040 [US2] Add "Remember me" checkbox and "Forgot Password" link in frontend/app/login/page.tsx
- [ ] T041 [US2] Integrate React Hook Form with Zod validation in frontend/app/login/page.tsx
- [ ] T042 [US2] Add loading spinner to submit button during form submission in frontend/app/login/page.tsx
- [ ] T043 [US2] Display inline validation error messages in frontend/app/login/page.tsx

### Signup Page Implementation

- [ ] T044 [US2] Redesign signup page with centered glassmorphism card in frontend/app/signup/page.tsx
- [ ] T045 [US2] Add name input field with validation in frontend/app/signup/page.tsx
- [ ] T046 [US2] Implement email input with validation in frontend/app/signup/page.tsx
- [ ] T047 [US2] Add password field with PasswordStrength indicator in frontend/app/signup/page.tsx
- [ ] T048 [US2] Add confirm password field with match validation in frontend/app/signup/page.tsx
- [ ] T049 [US2] Add terms and conditions checkbox with custom styling in frontend/app/signup/page.tsx
- [ ] T050 [US2] Integrate React Hook Form with signup schema validation in frontend/app/signup/page.tsx
- [ ] T051 [US2] Add loading state and error handling in frontend/app/signup/page.tsx
- [ ] T052 [US2] Add responsive styles for mobile/tablet/desktop in frontend/app/login/page.tsx and frontend/app/signup/page.tsx

**Checkpoint**: Both auth pages are fully styled with validation - can test registration and login flow

---

## Phase 5: User Story 3 - Task Dashboard (Priority: P1)

**Goal**: Modern task management dashboard with header, filters, task cards, CRUD operations, and feedback

**Independent Test**: Log in, verify sticky header, create/edit/delete tasks, filter by status, see toast notifications, confirm delete modal works

### Header Component

- [ ] T053 [US3] Create Header component with logo, user avatar, name, logout in frontend/components/layout/Header.tsx
- [ ] T054 [US3] Implement scroll-triggered shadow effect on Header in frontend/components/layout/Header.tsx

### Task Components

- [ ] T055 [P] [US3] Create TaskFilter component with pill buttons and count badges in frontend/components/tasks/TaskFilter.tsx
- [ ] T056 [P] [US3] Create task validation schema with Zod in frontend/lib/validations/task.ts
- [ ] T057 [P] [US3] Create TaskForm component with icon inputs and gradient button in frontend/components/tasks/TaskForm.tsx
- [ ] T058 [US3] Create TaskCard component with checkbox, title, description, date, actions in frontend/components/tasks/TaskCard.tsx
- [ ] T059 [US3] Add hover lift effect and shadow animation to TaskCard in frontend/components/tasks/TaskCard.tsx
- [ ] T060 [US3] Implement completed state styling (strikethrough, opacity) in TaskCard in frontend/components/tasks/TaskCard.tsx
- [ ] T061 [US3] Create TaskList component with grid layout in frontend/components/tasks/TaskList.tsx
- [ ] T062 [US3] Integrate SkeletonCard loading state in TaskList in frontend/components/tasks/TaskList.tsx
- [ ] T063 [US3] Integrate EmptyState when no tasks in TaskList in frontend/components/tasks/TaskList.tsx

### Tasks Page Implementation

- [ ] T064 [US3] Redesign tasks page layout with Header component in frontend/app/tasks/page.tsx
- [ ] T065 [US3] Integrate useScrollPosition for header shadow in frontend/app/tasks/page.tsx
- [ ] T066 [US3] Add TaskForm in card container at top of page in frontend/app/tasks/page.tsx
- [ ] T067 [US3] Add TaskFilter section with All/Pending/Completed filters in frontend/app/tasks/page.tsx
- [ ] T068 [US3] Integrate TaskList component with existing API calls in frontend/app/tasks/page.tsx
- [ ] T069 [US3] Add toast notifications for create/update/delete operations in frontend/app/tasks/page.tsx
- [ ] T070 [US3] Integrate ConfirmModal for delete confirmation in frontend/app/tasks/page.tsx
- [ ] T071 [US3] Add responsive grid layout (1 col mobile, 2 col tablet/desktop) in frontend/app/tasks/page.tsx

**Checkpoint**: Full task management dashboard working with all CRUD operations and feedback

---

## Phase 6: User Story 4 - Responsive Design (Priority: P2)

**Goal**: Ensure all pages adapt seamlessly across mobile (375px), tablet (768px), and desktop (1440px)

**Independent Test**: Resize browser at each breakpoint, verify layouts adapt, touch targets are 44px+, no horizontal scroll

### Implementation for User Story 4

- [ ] T072 [US4] Audit and fix mobile layout (< 640px) for landing page in frontend/app/page.tsx
- [ ] T073 [US4] Audit and fix mobile layout for login/signup pages in frontend/app/login/page.tsx, frontend/app/signup/page.tsx
- [ ] T074 [US4] Audit and fix mobile layout for tasks page in frontend/app/tasks/page.tsx
- [ ] T075 [US4] Ensure all buttons/inputs have minimum 44px touch targets across all pages
- [ ] T076 [US4] Verify tablet breakpoint (640px-1024px) layouts in all pages
- [ ] T077 [US4] Verify desktop breakpoint (> 1024px) layouts in all pages
- [ ] T078 [US4] Test and fix spacing/padding adjustments per breakpoint

**Checkpoint**: All pages responsive - no layout issues at any breakpoint

---

## Phase 7: User Story 5 - Micro-Interactions (Priority: P2)

**Goal**: Implement smooth animations and delightful feedback throughout the app

**Independent Test**: Interact with all buttons, cards, modals - verify animations are smooth (60fps), < 300ms duration

### Implementation for User Story 5

- [ ] T079 [US5] Add Framer Motion page transition wrapper in frontend/app/layout.tsx
- [ ] T080 [US5] Enhance Button hover/tap animations with scale effect in frontend/components/ui/Button.tsx
- [ ] T081 [US5] Add Input focus border animation in frontend/components/ui/Input.tsx
- [ ] T082 [US5] Implement animated checkbox toggle in frontend/components/ui/Checkbox.tsx
- [ ] T083 [US5] Add entrance animation to TaskCard list items in frontend/components/tasks/TaskList.tsx
- [ ] T084 [US5] Implement exit animation when task is deleted in frontend/components/tasks/TaskList.tsx
- [ ] T085 [US5] Add transition animation from empty state to task list in frontend/components/tasks/TaskList.tsx
- [ ] T086 [US5] Enhance Modal enter/exit animations in frontend/components/modals/Modal.tsx
- [ ] T087 [US5] Configure toast notification animations and stacking in frontend/app/layout.tsx

**Checkpoint**: All interactions feel polished - animations smooth and responsive

---

## Phase 8: User Story 6 - Accessibility (Priority: P3)

**Goal**: Ensure WCAG AA compliance with keyboard navigation, ARIA labels, and color contrast

**Independent Test**: Navigate with keyboard only, use screen reader, run Lighthouse accessibility audit (target 90+)

### Implementation for User Story 6

- [ ] T088 [P] [US6] Add ARIA labels to all Button variants in frontend/components/ui/Button.tsx
- [ ] T089 [P] [US6] Add ARIA labels and aria-describedby for Input errors in frontend/components/ui/Input.tsx
- [ ] T090 [P] [US6] Ensure Checkbox has proper role and aria-checked in frontend/components/ui/Checkbox.tsx
- [ ] T091 [US6] Add focus indicators (ring-2) to all interactive elements
- [ ] T092 [US6] Implement keyboard navigation for TaskCard actions in frontend/components/tasks/TaskCard.tsx
- [ ] T093 [US6] Add keyboard trap and focus management to Modal in frontend/components/modals/Modal.tsx
- [ ] T094 [US6] Add role="dialog" and aria-modal to Modal in frontend/components/modals/Modal.tsx
- [ ] T095 [US6] Add role="alert" and aria-live to toast notifications
- [ ] T096 [US6] Verify and fix color contrast for all text/background combinations
- [ ] T097 [US6] Add prefers-reduced-motion support to disable animations in frontend/app/globals.css

**Checkpoint**: Lighthouse accessibility score 90+ achieved

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final quality improvements and edge case handling

- [ ] T098 Handle edge case: truncate long user names with ellipsis in Header in frontend/components/layout/Header.tsx
- [ ] T099 Handle edge case: toast stacking without overlap in frontend/app/layout.tsx
- [ ] T100 Verify 100+ tasks renders performantly with smooth scrolling in frontend/app/tasks/page.tsx
- [ ] T101 Add loading states for all async operations across all pages
- [ ] T102 Final code cleanup and unused import removal
- [ ] T103 Run Lighthouse performance audit and optimize TTI if needed
- [ ] T104 Final visual QA pass at all breakpoints (375px, 768px, 1440px)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Landing), US2 (Auth), US3 (Tasks) are P1 - implement first
  - US4 (Responsive), US5 (Animations) are P2 - implement after P1 complete
  - US6 (Accessibility) is P3 - implement after P2 complete
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Dependencies | Can Start After |
|-------|----------|--------------|-----------------|
| US1 - Landing | P1 | Foundational only | Phase 2 |
| US2 - Auth | P1 | Foundational only | Phase 2 |
| US3 - Tasks | P1 | Foundational only | Phase 2 |
| US4 - Responsive | P2 | US1, US2, US3 | Phase 5 |
| US5 - Animations | P2 | US1, US2, US3 | Phase 5 |
| US6 - Accessibility | P3 | US4, US5 | Phase 7 |

### Within Each User Story

- Components before pages
- Validation schemas before form integration
- Base styling before animations
- Core functionality before polish

### Parallel Opportunities

**Setup Phase (all parallel):**
```
T002, T003, T004, T005, T006, T007 - can run simultaneously
```

**Foundational Phase (all parallel):**
```
T008, T009, T010, T011, T012, T013 - UI primitives
T014, T015, T016 - Hooks
T017, T018 - Layout
T019, T020 - Feedback
T021 - Modal (T022 depends on T021)
```

**P1 Stories (can run in parallel after Phase 2):**
```
US1 (Landing): T023-T030
US2 (Auth): T031-T052
US3 (Tasks): T053-T071
```

---

## Parallel Example: User Story 2 (Auth Pages)

```bash
# Launch all form components in parallel:
Task: "Create FormField wrapper component in frontend/components/forms/FormField.tsx"
Task: "Create PasswordInput component with visibility toggle in frontend/components/forms/PasswordInput.tsx"
Task: "Create PasswordStrength indicator component in frontend/components/forms/PasswordStrength.tsx"

# Launch validation schemas in parallel:
Task: "Create login validation schema with Zod in frontend/lib/validations/auth.ts"
Task: "Create signup validation schema with password confirmation in frontend/lib/validations/auth.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: Landing Page (US1)
4. Complete Phase 4: Auth Pages (US2)
5. Complete Phase 5: Task Dashboard (US3)
6. **STOP and VALIDATE**: All P1 features complete - demo ready

### Incremental Delivery

1. Setup + Foundational → Framework ready
2. Add US1 (Landing) → Test independently → Marketing-ready landing page
3. Add US2 (Auth) → Test independently → User registration/login works
4. Add US3 (Tasks) → Test independently → **Core MVP complete**
5. Add US4 (Responsive) → Mobile users supported
6. Add US5 (Animations) → Polished experience
7. Add US6 (Accessibility) → WCAG AA compliant

### Suggested MVP Scope

**Minimum:** Phase 1 + Phase 2 + Phase 3 (US1 Landing Page only)
**Recommended:** Phase 1 + Phase 2 + Phases 3-5 (All P1 stories: Landing + Auth + Tasks)

---

## Task Summary

| Phase | Description | Task Count |
|-------|-------------|------------|
| Phase 1 | Setup | 7 |
| Phase 2 | Foundational | 15 |
| Phase 3 | US1 - Landing | 8 |
| Phase 4 | US2 - Auth | 22 |
| Phase 5 | US3 - Tasks | 19 |
| Phase 6 | US4 - Responsive | 7 |
| Phase 7 | US5 - Animations | 9 |
| Phase 8 | US6 - Accessibility | 10 |
| Phase 9 | Polish | 7 |
| **Total** | | **104** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test tasks included (not explicitly requested in spec)
