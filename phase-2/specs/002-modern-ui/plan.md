# Implementation Plan: Modern UI Enhancement

**Branch**: `002-modern-ui` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-modern-ui/spec.md`

## Summary

Enhance the Hackathon Todo application UI with a modern, visually appealing, and responsive design system. The implementation uses Tailwind CSS v4 with custom design tokens, Framer Motion for animations, Sonner for toast notifications, React Hook Form with Zod for validation, and Lucide React for icons. The enhancement covers the landing page, authentication pages, and task dashboard with consistent styling, micro-interactions, and accessibility compliance.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+
**Primary Dependencies**: Next.js 16.1.1, React 19, Tailwind CSS v4, Framer Motion, Sonner, React Hook Form, Zod, Lucide React
**Storage**: Neon Serverless PostgreSQL (unchanged - no schema changes)
**Testing**: Jest, React Testing Library, Playwright (E2E)
**Target Platform**: Web (modern browsers, last 2 versions)
**Project Type**: Web application (frontend enhancement only)
**Performance Goals**:
- Lighthouse accessibility score 90+
- Animations < 300ms
- TTI < 3 seconds on 4G
- 60fps animations
**Constraints**:
- No backend changes
- Mobile-first responsive design
- WCAG AA compliance
- Dark mode deferred (out of scope)
**Scale/Scope**: 4 pages (landing, login, signup, tasks), ~25 components, ~5 custom hooks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Separation of Concerns | **PASS** | UI layer only; no backend changes; API contract unchanged |
| II. API-First Design | **PASS** | Existing API consumed as-is; no new endpoints needed |
| III. Stateless Authentication | **PASS** | JWT flow unchanged; UI styling only |
| IV. Type Safety Everywhere | **PASS** | TypeScript strict mode; Zod validation schemas |
| V. Database as Single Source of Truth | **PASS** | No data model changes; display layer only |

### Technology Stack Compliance

| Requirement | Status | Notes |
|-------------|--------|-------|
| Backend: FastAPI + SQLModel | **N/A** | No backend changes |
| Frontend: Next.js App Router | **PASS** | Using Next.js 16.1.1 App Router |
| Auth: Better Auth | **PASS** | Existing auth unchanged |
| Database: Neon PostgreSQL | **N/A** | No database changes |

### Forbidden Patterns Check

| Pattern | Status |
|---------|--------|
| Raw SQL queries | **N/A** - Frontend only |
| Server-side sessions | **PASS** - Using JWT |
| Pages Router | **PASS** - Using App Router |
| Client-only critical data | **PASS** - All data from API |
| Hardcoded secrets | **PASS** - Using env vars |

**Constitution Check Result**: **PASSED** - No violations detected

## Project Structure

### Documentation (this feature)

```text
specs/002-modern-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output (complete)
├── data-model.md        # Phase 1 output (complete)
├── quickstart.md        # Phase 1 output (complete)
├── contracts/
│   └── components.md    # Component API contracts (complete)
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /sp.specify)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── globals.css          # Updated with design tokens
│   ├── layout.tsx           # Updated with Toaster provider
│   ├── page.tsx             # Landing page (redesign)
│   ├── login/page.tsx       # Login page (redesign)
│   ├── signup/page.tsx      # Signup page (redesign)
│   └── tasks/page.tsx       # Tasks dashboard (redesign)
├── components/
│   ├── ui/                  # UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Avatar.tsx
│   ├── forms/               # Form-specific components
│   │   ├── FormField.tsx
│   │   ├── PasswordInput.tsx
│   │   └── PasswordStrength.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── tasks/               # Task feature components
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskFilter.tsx
│   ├── modals/              # Modal components
│   │   ├── Modal.tsx
│   │   └── ConfirmModal.tsx
│   └── feedback/            # Feedback components
│       ├── EmptyState.tsx
│       └── SkeletonCard.tsx
├── hooks/                   # Custom hooks
│   ├── useScrollPosition.ts
│   ├── useMediaQuery.ts
│   ├── usePasswordStrength.ts
│   └── useToast.ts
├── lib/
│   ├── api.ts               # Existing API client
│   ├── auth.ts              # Existing auth config
│   ├── types.ts             # Existing types
│   ├── utils.ts             # New utility functions (cn)
│   └── validations/         # Zod schemas
│       ├── auth.ts
│       └── task.ts
└── package.json             # Updated dependencies

backend/                     # NO CHANGES
```

**Structure Decision**: Web application structure maintained. Frontend-only changes in existing Next.js App Router architecture. New directories created for component organization following atomic design principles.

## Complexity Tracking

> No constitutional violations requiring justification.

| Decision | Rationale | Alternative Rejected |
|----------|-----------|---------------------|
| 6 new dependencies | Each solves specific need; total ~77kb gzipped | Custom implementations would take longer and be less maintainable |
| ~25 components | Atomic design enables reuse; each component single-purpose | Inline styling harder to maintain; inconsistent UX |
| CSS variables over Tailwind config | Tailwind v4 CSS-first approach | tailwind.config.js modification not recommended for v4 |

## Implementation Phases

### Phase 1: Foundation (Components & Styling)

**Goal**: Establish design system and base components

1. Install dependencies (framer-motion, sonner, react-hook-form, zod, lucide-react, clsx, tailwind-merge)
2. Update `globals.css` with design tokens
3. Create `lib/utils.ts` with `cn()` utility
4. Create UI primitives: Button, Input, Checkbox, Badge, Spinner, Avatar
5. Create form components: FormField, PasswordInput, PasswordStrength
6. Create layout components: Header, Footer, Container
7. Create feedback components: Modal, ConfirmModal, EmptyState, SkeletonCard
8. Create custom hooks: useScrollPosition, useMediaQuery, usePasswordStrength
9. Add Toaster to root layout

### Phase 2: Feature Components

**Goal**: Build task-specific components

1. Create TaskCard with animations and states
2. Create TaskList with skeleton loading
3. Create TaskForm with validation
4. Create TaskFilter with count badges
5. Create validation schemas (auth.ts, task.ts)

### Phase 3: Page Implementation

**Goal**: Redesign all pages with new components

1. Landing page: Hero, features grid, footer
2. Login page: Centered card, form validation, loading states
3. Signup page: Password strength, terms checkbox
4. Tasks page: Header, task CRUD, filters, empty state, modals

### Phase 4: Polish & Accessibility

**Goal**: Ensure quality and compliance

1. Add ARIA labels to all interactive elements
2. Implement keyboard navigation
3. Test and fix color contrast
4. Add prefers-reduced-motion support
5. Responsive testing at 375px, 768px, 1440px
6. Performance optimization (lazy loading, code splitting)

## Dependencies

### New Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| framer-motion | ^11.0.0 | Animation library |
| sonner | ^1.4.0 | Toast notifications |
| react-hook-form | ^7.50.0 | Form state management |
| @hookform/resolvers | ^3.3.0 | Zod resolver |
| zod | ^3.22.0 | Schema validation |
| lucide-react | ^0.344.0 | Icons |
| clsx | ^2.1.0 | Class composition |
| tailwind-merge | ^2.2.0 | Tailwind class merging |

### Existing Dependencies (unchanged)

- next: 16.1.1
- react: 19.2.3
- better-auth: ^1.0.0
- tailwindcss: ^4

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation performance issues | Medium | Medium | Use `will-change`, test on throttled CPU, use `LazyMotion` |
| Hydration mismatches (SSR) | Low | High | Wrap client components properly, use `use client` directive |
| Accessibility regression | Low | High | Automated Lighthouse tests, manual screen reader testing |
| Bundle size increase | Low | Low | Tree-shaking, code splitting, monitor bundle analyzer |

## Success Criteria Verification

| Criteria | Metric | Verification Method |
|----------|--------|---------------------|
| SC-001 | Lighthouse a11y 90+ | Lighthouse CI in pipeline |
| SC-002 | Animations < 300ms | Performance profiler |
| SC-003 | TTI < 3s on 4G | WebPageTest, throttled network |
| SC-004 | Touch targets 44px+ | Manual measurement |
| SC-005 | Task creation < 10s | User testing |
| SC-006 | Status identification < 1s | Visual inspection |
| SC-007 | Responsive layouts | Browser DevTools at breakpoints |
| SC-008 | 100% inline validation | Manual form testing |
| SC-009 | 100% loading states | Code review |
| SC-010 | 100% hover/focus states | Interactive testing |

## Next Steps

Run `/sp.tasks` to generate the detailed task list with test cases for implementation.

## Related Documents

- [Feature Specification](./spec.md)
- [Research Findings](./research.md)
- [Data Model (Design Tokens)](./data-model.md)
- [Component Contracts](./contracts/components.md)
- [Quickstart Guide](./quickstart.md)
