---
description: "Task list for Hackathon Todo - Multi-User Task Management"
---

# Tasks: Hackathon Todo - Multi-User Task Management

**Input**: Design documents from `/specs/001-multi-user-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.yaml

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are EXCLUDED from this task list. Focus is on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` (Next.js App Router)
- **Backend**: `backend/app/` (FastAPI application)
- Paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify Python 3.13+ installed and create backend virtual environment
- [ ] T002 Install uv package manager for backend dependency management
- [ ] T003 Verify Node.js 20+ and npm installed for frontend
- [ ] T004 Create Neon PostgreSQL database and obtain connection string
- [ ] T005 Generate JWT secret using openssl rand -base64 32

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [ ] T006 [P] Initialize backend project with uv in backend/pyproject.toml
- [ ] T007 [P] Create backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, FRONTEND_URL
- [ ] T008 [P] Create backend/.env from .env.example with actual credentials
- [ ] T009 [P] Install FastAPI, SQLModel, PyJWT, Uvicorn, Alembic dependencies via uv
- [ ] T010 [P] Create backend/app/__init__.py (empty init file)
- [ ] T011 [P] Create backend/app/config.py for environment variable loading
- [ ] T012 [P] Create backend/app/db.py with SQLModel engine and get_session dependency
- [ ] T013 [P] Create backend/alembic.ini for database migrations
- [ ] T014 [P] Create backend/alembic/env.py with SQLModel metadata
- [ ] T015 Create backend/app/main.py with FastAPI app instance and CORS middleware

### Frontend Foundation

- [ ] T016 [P] Initialize frontend project with Next.js 16 App Router in frontend/
- [ ] T017 [P] Install Better Auth, Tailwind CSS, TypeScript dependencies via npm
- [ ] T018 [P] Create frontend/.env.local.example with DATABASE_URL, BETTER_AUTH_SECRET, NEXT_PUBLIC_API_URL
- [ ] T019 [P] Create frontend/.env.local from example with actual credentials
- [ ] T020 [P] Configure TypeScript strict mode in frontend/tsconfig.json
- [ ] T021 [P] Configure Tailwind CSS in frontend/tailwind.config.ts
- [ ] T022 [P] Create frontend/lib/types.ts with Task interface
- [ ] T023 [P] Create frontend/lib/auth.ts with Better Auth configuration
- [ ] T024 Create frontend/lib/api.ts with API client helper functions

### Database Schema

- [ ] T025 [P] Create backend/app/models/__init__.py
- [ ] T026 [P] Create backend/app/models/task.py with Task SQLModel
- [ ] T027 Run Alembic migration to create tasks table with indexes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Account Creation and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts and authenticate to access the application

**Independent Test**: Create account with email/password, logout, login again, verify session persistence

### Backend: Authentication

- [ ] T028 [P] [US1] Create backend/app/middleware/__init__.py
- [ ] T029 [P] [US1] Create backend/app/middleware/auth.py with verify_jwt dependency
- [ ] T030 [P] [US1] Create backend/app/middleware/cors.py with CORS configuration
- [ ] T031 [P] [US1] Create backend/app/schemas/__init__.py
- [ ] T032 [P] [US1] Create backend/app/schemas/responses.py with Error schema
- [ ] T033 [US1] Add JWT verification middleware to backend/app/main.py

### Frontend: Auth Pages

- [ ] T034 [P] [US1] Create frontend/app/layout.tsx with Better Auth provider
- [ ] T035 [P] [US1] Create frontend/app/page.tsx with redirect logic based on auth state
- [ ] T036 [P] [US1] Create frontend/app/signup/page.tsx with signup form
- [ ] T037 [P] [US1] Create frontend/app/login/page.tsx with login form
- [ ] T038 [P] [US1] Create frontend/components/ui/Button.tsx reusable button component
- [ ] T039 [P] [US1] Create frontend/components/ui/Input.tsx reusable input component
- [ ] T040 [P] [US1] Create frontend/hooks/useAuth.ts for auth state management
- [ ] T041 [US1] Create frontend/middleware.ts for route protection

### Verification

- [ ] T042 [US1] Start backend server and verify /docs endpoint accessible
- [ ] T043 [US1] Start frontend server and verify login/signup pages render
- [ ] T044 [US1] Test signup flow: create account, verify redirection
- [ ] T045 [US1] Test login flow: login with credentials, verify JWT token issued
- [ ] T046 [US1] Test session persistence: close browser, reopen, verify still logged in

**Checkpoint**: At this point, User Story 1 (authentication) is fully functional and testable independently

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P2) 🎯 MVP

**Goal**: Enable authenticated users to create tasks and view their personal task list

**Independent Test**: Login, create multiple tasks with titles/descriptions, verify they appear in list sorted by newest first, verify user isolation

### Backend: Task API

- [ ] T047 [P] [US2] Create backend/app/routes/__init__.py
- [ ] T048 [P] [US2] Create backend/app/schemas/task.py with TaskCreate, TaskUpdate, TaskResponse schemas
- [ ] T049 [P] [US2] Create backend/app/routes/tasks.py with router setup
- [ ] T050 [US2] Implement POST /api/tasks endpoint in backend/app/routes/tasks.py
- [ ] T051 [US2] Implement GET /api/tasks endpoint with sorting in backend/app/routes/tasks.py
- [ ] T052 [US2] Add task routes to FastAPI app in backend/app/main.py

### Frontend: Task UI

- [ ] T053 [P] [US2] Create frontend/app/tasks/page.tsx as server component with initial data fetch
- [ ] T054 [P] [US2] Create frontend/components/TaskForm.tsx for creating tasks
- [ ] T055 [P] [US2] Create frontend/components/TaskList.tsx as client component with state
- [ ] T056 [P] [US2] Create frontend/components/TaskItem.tsx for individual task display
- [ ] T057 [P] [US2] Create frontend/components/ui/Card.tsx reusable card component
- [ ] T058 [P] [US2] Create frontend/hooks/useTasks.ts for task operations
- [ ] T059 [US2] Add task type definitions to frontend/lib/types.ts
- [ ] T060 [US2] Implement createTask API call in frontend/lib/api.ts
- [ ] T061 [US2] Implement getTasks API call in frontend/lib/api.ts

### Verification

- [ ] T062 [US2] Test create task: enter title, verify task appears at top of list
- [ ] T063 [US2] Test create task with description: verify both title and description saved
- [ ] T064 [US2] Test validation: try to create task with empty title, verify error message
- [ ] T065 [US2] Test sorting: create multiple tasks, verify newest appears first
- [ ] T066 [US2] Test user isolation: create second user, verify they don't see first user's tasks

**Checkpoint**: At this point, User Stories 1 AND 2 work independently (MVP = P1 + P2)

---

## Phase 5: User Story 3 - Mark Tasks Complete/Incomplete (Priority: P3)

**Goal**: Enable users to toggle task completion status with visual feedback

**Independent Test**: Create task, mark complete via checkbox, verify visual indicator, mark incomplete, verify toggle works

### Backend: Completion Toggle

- [ ] T067 [US3] Implement PATCH /api/tasks/{id}/complete endpoint in backend/app/routes/tasks.py

### Frontend: Completion UI

- [ ] T068 [US3] Add checkbox to TaskItem component in frontend/components/TaskItem.tsx
- [ ] T069 [US3] Add visual indicator for completed tasks in frontend/components/TaskItem.tsx
- [ ] T070 [US3] Implement toggleComplete API call in frontend/lib/api.ts
- [ ] T071 [US3] Add completion toggle handler to useTasks hook in frontend/hooks/useTasks.ts

### Verification

- [ ] T072 [US3] Test mark complete: click checkbox, verify task marked complete and visual updates
- [ ] T073 [US3] Test mark incomplete: click checkbox again, verify task marked incomplete
- [ ] T074 [US3] Test persistence: mark task complete, refresh page, verify still complete
- [ ] T075 [US3] Test timestamp: toggle status, verify updated_at timestamp changes

**Checkpoint**: User Stories 1, 2, AND 3 all work independently

---

## Phase 6: User Story 4 - Filter Tasks by Status (Priority: P4)

**Goal**: Enable users to filter task list by completion status (All/Pending/Completed)

**Independent Test**: Create both complete and incomplete tasks, click filter buttons, verify correct tasks displayed

### Backend: Filter Support

- [ ] T076 [US4] Add status query parameter to GET /api/tasks endpoint in backend/app/routes/tasks.py
- [ ] T077 [US4] Implement filtering logic for completed/pending tasks in backend/app/routes/tasks.py

### Frontend: Filter UI

- [ ] T078 [US4] Add filter state to TaskList component in frontend/components/TaskList.tsx
- [ ] T079 [US4] Create filter buttons (All/Pending/Completed) in frontend/components/TaskList.tsx
- [ ] T080 [US4] Update getTasks API call to accept status parameter in frontend/lib/api.ts
- [ ] T081 [US4] Implement filter change handler in frontend/components/TaskList.tsx

### Verification

- [ ] T082 [US4] Test "Pending" filter: click button, verify only incomplete tasks shown
- [ ] T083 [US4] Test "Completed" filter: click button, verify only complete tasks shown
- [ ] T084 [US4] Test "All" filter: click button, verify all tasks shown
- [ ] T085 [US4] Test filter with create: activate filter, create new task, verify list updates correctly

**Checkpoint**: User Stories 1, 2, 3, AND 4 all work independently

---

## Phase 7: User Story 5 - Edit Task Details (Priority: P5)

**Goal**: Enable users to update task title and description

**Independent Test**: Create task, click edit, modify title/description, save, verify changes persisted

### Backend: Update API

- [ ] T086 [US5] Implement GET /api/tasks/{id} endpoint in backend/app/routes/tasks.py
- [ ] T087 [US5] Implement PUT /api/tasks/{id} endpoint in backend/app/routes/tasks.py
- [ ] T088 [US5] Add authorization check (task.user_id == authenticated user) in backend/app/routes/tasks.py

### Frontend: Edit UI

- [ ] T089 [US5] Add edit mode state to TaskItem component in frontend/components/TaskItem.tsx
- [ ] T090 [US5] Create edit form UI in TaskItem component in frontend/components/TaskItem.tsx
- [ ] T091 [US5] Implement updateTask API call in frontend/lib/api.ts
- [ ] T092 [US5] Add update handler to useTasks hook in frontend/hooks/useTasks.ts
- [ ] T093 [US5] Add cancel button to reset edit mode in frontend/components/TaskItem.tsx

### Verification

- [ ] T094 [US5] Test edit title: click edit, change title, save, verify updated
- [ ] T095 [US5] Test edit description: click edit, change description, save, verify updated
- [ ] T096 [US5] Test validation: try to save empty title, verify error and cannot save
- [ ] T097 [US5] Test timestamp: edit task, verify updated_at changes
- [ ] T098 [US5] Test cancel: start editing, click cancel, verify original values remain

**Checkpoint**: User Stories 1-5 all work independently

---

## Phase 8: User Story 6 - Delete Tasks (Priority: P6)

**Goal**: Enable users to permanently delete tasks with confirmation

**Independent Test**: Create task, click delete, confirm deletion, verify task removed from list and database

### Backend: Delete API

- [ ] T099 [US6] Implement DELETE /api/tasks/{id} endpoint in backend/app/routes/tasks.py
- [ ] T100 [US6] Add authorization check before deletion in backend/app/routes/tasks.py

### Frontend: Delete UI

- [ ] T101 [US6] Add delete button to TaskItem component in frontend/components/TaskItem.tsx
- [ ] T102 [US6] Implement confirmation dialog (window.confirm or custom modal) in frontend/components/TaskItem.tsx
- [ ] T103 [US6] Implement deleteTask API call in frontend/lib/api.ts
- [ ] T104 [US6] Add delete handler to useTasks hook in frontend/hooks/useTasks.ts

### Verification

- [ ] T105 [US6] Test delete with confirmation: click delete, confirm, verify task removed
- [ ] T106 [US6] Test cancel deletion: click delete, cancel, verify task remains
- [ ] T107 [US6] Test persistence: delete task, refresh page, verify task doesn't reappear
- [ ] T108 [US6] Test authorization: verify user cannot delete other users' tasks (API returns 403)

**Checkpoint**: All user stories (1-6) work independently and together

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final touches

- [ ] T109 [P] Add loading indicators during API calls in frontend/components/TaskList.tsx
- [ ] T110 [P] Add error messages for failed operations in frontend/components/TaskList.tsx
- [ ] T111 [P] Implement responsive design breakpoints in Tailwind CSS
- [ ] T112 [P] Add loading.tsx file for tasks page in frontend/app/tasks/loading.tsx
- [ ] T113 [P] Add error.tsx file for tasks page in frontend/app/tasks/error.tsx
- [ ] T114 [P] Create backend/app/utils/__init__.py
- [ ] T115 [P] Create backend/app/utils/security.py for security utility functions
- [ ] T116 [P] Add request logging middleware to backend/app/main.py
- [ ] T117 [P] Optimize database queries with proper indexing (verify indexes from migration)
- [ ] T118 [P] Add README.md with setup instructions at repository root
- [ ] T119 Verify all API endpoints return correct HTTP status codes
- [ ] T120 Verify all TypeScript types are explicitly defined (no 'any')
- [ ] T121 Test mobile responsiveness on 375px viewport
- [ ] T122 Test application with 2+ concurrent users
- [ ] T123 Performance test: verify API responses < 200ms
- [ ] T124 Performance test: verify frontend load < 2 seconds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational - Builds on US2 but independently testable
- **User Story 4 (P4)**: Can start after Foundational - Builds on US2/US3 but independently testable
- **User Story 5 (P5)**: Can start after Foundational - Builds on US2 but independently testable
- **User Story 6 (P6)**: Can start after Foundational - Builds on US2 but independently testable

### Within Each User Story

- Backend endpoints before frontend API calls
- API integration before UI updates
- Core functionality before error handling
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase**:
- T001-T005 can all run in parallel (independent prerequisites)

**Foundational Phase**:
- Backend tasks (T006-T015) can run in parallel
- Frontend tasks (T016-T024) can run in parallel
- Backend and Frontend work can proceed simultaneously
- T025-T027 (database) must complete before user stories begin

**User Story 1**:
- T028-T032 (backend auth files) can run in parallel
- T034-T040 (frontend pages/components) can run in parallel
- Backend and Frontend work can proceed simultaneously

**User Story 2**:
- T047-T048 (backend schemas) can run in parallel
- T053-T057 (frontend components) can run in parallel
- Backend and Frontend work can proceed simultaneously

**Multiple User Stories**:
- Once Foundational is complete, ALL user stories (P1-P6) can be developed in parallel by different team members
- Each story is independently testable and deployable

---

## Parallel Example: Foundational Phase

```bash
# Backend team (can work simultaneously):
- T006: Initialize backend project
- T007: Create .env.example
- T010: Create __init__.py
- T011: Create config.py
- T012: Create db.py

# Frontend team (can work simultaneously):
- T016: Initialize frontend project
- T017: Install dependencies
- T020: Configure TypeScript
- T021: Configure Tailwind
- T022: Create types.ts

# After both complete, run sequentially:
- T015: Create main.py (needs config.py, db.py)
- T024: Create api.ts (needs types.ts)
- T025-T027: Database setup (blocks user stories)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T027) - CRITICAL
3. Complete Phase 3: User Story 1 (T028-T046)
4. Complete Phase 4: User Story 2 (T047-T066)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo MVP (users can signup, login, create tasks, view tasks)

**Total MVP Tasks**: ~66 tasks

### Incremental Delivery

1. Complete Setup + Foundational (T001-T027) → Foundation ready
2. Add User Story 1 (T028-T046) → Test independently → Deploy (Authentication MVP)
3. Add User Story 2 (T047-T066) → Test independently → Deploy (Full MVP)
4. Add User Story 3 (T067-T075) → Test independently → Deploy (Completion tracking)
5. Add User Story 4 (T076-T085) → Test independently → Deploy (Filtering)
6. Add User Story 5 (T086-T098) → Test independently → Deploy (Editing)
7. Add User Story 6 (T099-T108) → Test independently → Deploy (Deletion)
8. Add Polish (T109-T124) → Final release

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T027)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (T028-T046)
   - Developer B: User Story 2 (T047-T066)
   - Developer C: User Story 3 (T067-T075)
3. Stories complete and integrate independently
4. Team proceeds to remaining stories (US4-US6) in parallel
5. Team completes Polish phase together

---

## Notes

- **[P]** tasks = different files, no dependencies
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Tests excluded**: Spec did not explicitly request TDD approach, so test tasks omitted
- Validation happens at checkpoint steps (T042-T046, T062-T066, etc.)

**Total Tasks**: 124 tasks
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 22 tasks
- Phase 3 (US1): 19 tasks
- Phase 4 (US2): 20 tasks
- Phase 5 (US3): 9 tasks
- Phase 6 (US4): 10 tasks
- Phase 7 (US5): 13 tasks
- Phase 8 (US6): 10 tasks
- Phase 9 (Polish): 16 tasks

**Parallel Opportunities**: 50+ tasks can run in parallel during Foundational and User Story phases
**MVP Scope**: Phases 1-4 (T001-T066) = 66 tasks for fully functional authentication + task management
