# Tasks: Todo AI Chatbot (Modern UI Edition)

**Input**: Design documents from `/specs/003-todo-ai-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/openapi.yaml
**Branch**: `003-todo-ai-chatbot` | **Date**: 2026-02-06

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are omitted. Manual verification is described at each checkpoint.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Each task references exact file paths from `plan.md` project structure.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Backend and frontend project scaffolding, dependencies, environment config

- [ ] T001 Create backend app package structure: `backend/app/__init__.py`, `backend/app/api/__init__.py`, `backend/app/api/routes/__init__.py`, `backend/app/core/__init__.py`, `backend/app/models/__init__.py`, `backend/app/mcp/__init__.py`, `backend/app/mcp/tools/__init__.py`, `backend/app/agents/__init__.py`
- [ ] T002 [P] Create `backend/pyproject.toml` with dependencies: fastapi, uvicorn[standard], sqlmodel, asyncpg, sqlalchemy[asyncio], openai-agents, mcp, slowapi, pydantic-settings, python-dotenv, alembic, tenacity, better-auth
- [ ] T003 [P] Create `backend/.env.example` with variables: DATABASE_URL, GROQ_API_KEY, FRONTEND_URL, ENVIRONMENT
- [ ] T004 [P] Create `frontend/.env.example` with variables: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_OPENAI_DOMAIN_KEY
- [ ] T005 [P] Create root `Makefile` with `dev` target that starts backend (uvicorn port 8000) and frontend (next dev port 3000) concurrently
- [ ] T006 [P] Initialize Next.js 14+ project in `frontend/` with TypeScript, Tailwind CSS, App Router, and `frontend/tsconfig.json` with strict mode enabled
- [ ] T007 [P] Install frontend dependencies: `@openai/chatkit-react`, `framer-motion`, `next-themes`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`, `recharts`
- [ ] T008 [P] Initialize shadcn/ui in `frontend/` and add 12 components: button, input, card, dialog, dropdown-menu, avatar, badge, skeleton, toast, sheet, tabs, checkbox

**Checkpoint**: Both `backend/` and `frontend/` directories have valid package files. `uv sync` and `npm install` complete without errors.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can begin

**CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [ ] T009 Implement Pydantic Settings config in `backend/app/core/config.py`: load DATABASE_URL, GROQ_API_KEY, FRONTEND_URL, ENVIRONMENT from .env with validation
- [ ] T010 Implement async database engine and session dependency in `backend/app/core/database.py`: create_async_engine with asyncpg, async session factory, get_session dependency
- [ ] T011 [P] Create User SQLModel in `backend/app/models/user.py` per data-model.md: id (UUID string PK), email (unique, max 255), hashed_password, display_name (nullable, max 100), theme_preference (nullable, enum light/dark/null), created_at, updated_at with `ix_user_email` index
- [ ] T012 [P] Create Task SQLModel in `backend/app/models/task.py` per data-model.md: id (auto-increment PK), user_id (FK → user.id), title (max 255), description (nullable text), completed (default false), created_at, updated_at with indexes `ix_task_user_id` and `ix_task_user_completed`
- [ ] T013 [P] Create Conversation SQLModel in `backend/app/models/conversation.py` per data-model.md: id (auto-increment PK), user_id (FK → user.id), created_at, updated_at with `ix_conversation_user_id` index
- [ ] T014 [P] Create Message SQLModel in `backend/app/models/message.py` per data-model.md: id (auto-increment PK), conversation_id (FK → conversation.id), user_id, role (enum user/assistant), content (text), tool_calls (JSON nullable), created_at with indexes `ix_message_conversation_created` and `ix_message_user_id`
- [ ] T015 Export all models from `backend/app/models/__init__.py`: import User, Task, Conversation, Message
- [ ] T016 Initialize Alembic in `backend/alembic/`: create alembic.ini, env.py configured for async SQLModel, generate initial migration for all 4 tables
- [ ] T017 Create FastAPI app entry in `backend/app/main.py`: app instance, CORS middleware (whitelist FRONTEND_URL), health check GET /health returning {"status": "ok"}
- [ ] T018 [P] Create Pydantic request/response schemas per openapi.yaml: ChatRequest, ChatResponse, ToolCallRecord, TaskResponse, CreateTaskRequest, UpdateTaskRequest, StatsResponse, ConversationResponse, MessageResponse, ProfileResponse, UpdateProfileRequest, ErrorResponse — all in appropriate route files or a shared `backend/app/api/schemas.py`
- [ ] T019 [P] Configure rate limiting with slowapi in `backend/app/main.py`: 100 req/min per user_id on all /api/{user_id}/* endpoints

### Frontend Foundation

- [ ] T020 Create CSS variables and Tailwind theme in `frontend/app/globals.css`: define `:root` (light) and `.dark` color variables for background, foreground, card, popover, primary, secondary, muted, accent, destructive per the design system; configure Tailwind to use `hsl(var(--variable))`
- [ ] T021 Configure `frontend/tailwind.config.ts`: set `darkMode: 'selector'`, extend colors to use CSS variables, add Inter and Space Grotesk font families
- [ ] T022 Create ThemeProvider wrapper in `frontend/app/providers.tsx`: wrap app with `next-themes` ThemeProvider (attribute="class", defaultTheme="system", enableSystem=true)
- [ ] T023 Create root layout in `frontend/app/layout.tsx`: import Inter + Space Grotesk fonts from next/font/google, wrap children with Providers, add `suppressHydrationWarning` on `<html>` tag, include global metadata (title, description)
- [ ] T024 [P] Create utility file `frontend/lib/utils.ts`: export `cn()` helper (clsx + tailwind-merge)
- [ ] T025 [P] Create Zustand store in `frontend/lib/store.ts`: user preferences state (theme, sidebar collapsed), auth state placeholder
- [ ] T026 [P] Create ErrorBoundary component in `frontend/components/ErrorBoundary.tsx`: React error boundary with fallback UI displaying "Something went wrong" with retry button

**Checkpoint**: Backend starts with `uv run uvicorn app.main:app --reload`, health check returns 200, Alembic migration applies cleanly. Frontend starts with `npm run dev`, renders empty page with correct theme system (dark/light toggle works via browser devtools class toggle).

---

## Phase 3: User Story 1 — AI Chat Task Management (Priority: P1) MVP

**Goal**: User navigates to Chat page, sends natural language messages to manage tasks. AI interprets intent, executes MCP tools, conversations persist across sessions.

**Independent Test**: Log in, open Chat page, send "Add buy groceries to my list", verify: message appears right-aligned, AI responds left-aligned with confirmation, tool call badge shows "add_task", refreshing preserves conversation.

### Backend: MCP Tools

- [ ] T027 [P] [US1] Implement `add_task` MCP tool in `backend/app/mcp/tools/add_task.py`: accepts user_id, title, optional description; creates Task via SQLModel; returns {task_id, status: "created", title}
- [ ] T028 [P] [US1] Implement `list_tasks` MCP tool in `backend/app/mcp/tools/list_tasks.py`: accepts user_id; queries tasks filtered by user_id ordered by created_at; returns {tasks: [{id, title, completed, created_at}], count: int}
- [ ] T029 [P] [US1] Implement `complete_task` MCP tool in `backend/app/mcp/tools/complete_task.py`: accepts user_id, task_id; finds task by id + user_id; sets completed=True; returns {task_id, title, status: "completed"} or error if not found
- [ ] T030 [P] [US1] Implement `delete_task` MCP tool in `backend/app/mcp/tools/delete_task.py`: accepts user_id, task_id; finds task by id + user_id; deletes from DB; returns {task_id, title, status: "deleted"} or error if not found
- [ ] T031 [P] [US1] Implement `update_task` MCP tool in `backend/app/mcp/tools/update_task.py`: accepts user_id, task_id, optional new_title, optional new_description; updates fields; returns {task_id, old_title, new_title, status: "updated"} or error if not found

### Backend: Agent & Chat Endpoint

- [ ] T032 [US1] Initialize MCP server in `backend/app/mcp/server.py`: create FastMCP server instance, register all 5 tools (add_task, list_tasks, complete_task, delete_task, update_task)
- [ ] T033 [US1] Implement todo agent in `backend/app/agents/todo_agent.py`: configure OpenAI Agents SDK with Groq base_url and model `llama-3.3-70b-versatile`, system prompt for task management, MCP tool integration, exponential backoff for 429 errors (3 retries: 1s/2s/4s via tenacity)
- [ ] T034 [US1] Implement POST /api/{user_id}/chat endpoint in `backend/app/api/routes/chat.py`: validate ChatRequest, get/create conversation, fetch last 50 messages ordered by created_at, save user message, call agent with MCP tools, save assistant response with tool_calls metadata, return ChatResponse per openapi.yaml contract
- [ ] T035 [US1] Register chat router in `backend/app/main.py`: include routes from `api/routes/chat.py`

### Frontend: Chat Interface

- [ ] T036 [US1] Create backend API client in `frontend/lib/api.ts`: typed async functions for all 11 endpoints per openapi.yaml — sendMessage(), listTasks(), createTask(), updateTask(), deleteTask(), getStats(), listConversations(), getMessages(), getProfile(), updateProfile(); include error handling for network failures and timeouts (10s)
- [ ] T037 [US1] Create custom ChatInterface component in `frontend/components/chat/ChatInterface.tsx`: message list (user messages right-aligned, assistant left-aligned with avatar), tool call badges showing MCP tool names, input field with send button, loading state with animated dots, error display with retry, auto-scroll to latest message, skeleton loading on initial load
- [ ] T038 [US1] Create ChatKitWrapper component in `frontend/components/chat/ChatKitWrapper.tsx`: conditionally render `<ChatKit>` from `@openai/chatkit-react` when NEXT_PUBLIC_OPENAI_DOMAIN_KEY is set, otherwise fall back to custom ChatInterface; pass theme-aware styling
- [ ] T039 [US1] Create chat page in `frontend/app/(dashboard)/chat/page.tsx`: integrate ChatKitWrapper, manage conversationId state, get userId from auth context, responsive layout, SEO metadata (title: "Chat - Todo AI Chatbot")

**Checkpoint**: POST /api/testuser/chat with body {"message": "Add buy groceries"} returns 200 with confirmation and tool_calls. Frontend chat page renders, messages display correctly. Conversation persists on page refresh.

---

## Phase 4: User Story 2 — User Registration and Login (Priority: P1) MVP

**Goal**: Visitors sign up with email/password, get redirected to Dashboard. Returning users log in. Unauthenticated users are redirected to /login.

**Independent Test**: Visit /signup, enter valid credentials, verify redirect to /dashboard. Log out, visit /login, sign back in.

### Backend: Authentication

- [ ] T040 [US2] Configure Better Auth in backend: setup auth routes for signup (POST), login (POST), logout (POST), session validation; integrate with User SQLModel; store session tokens in httpOnly cookies
- [ ] T041 [US2] Add auth middleware to protect all /api/{user_id}/* endpoints: validate session token from cookie, verify user_id matches authenticated user, return 401/403 for unauthorized access

### Frontend: Auth Pages

- [ ] T042 [US2] Create auth layout in `frontend/app/(auth)/layout.tsx`: centered card layout with logo, no sidebar, gradient background matching design system
- [ ] T043 [P] [US2] Create Login page in `frontend/app/(auth)/login/page.tsx`: email + password form with React Hook Form + Zod validation (email format, 8+ char password), inline error display, "Don't have an account? Sign up" link, disabled OAuth buttons with "Coming Soon" badge, SEO metadata
- [ ] T044 [P] [US2] Create Signup page in `frontend/app/(auth)/signup/page.tsx`: email + password + confirm password form with React Hook Form + Zod validation, duplicate email error handling ("This email is already registered"), "Already have an account? Log in" link, disabled OAuth buttons, SEO metadata
- [ ] T045 [US2] Create auth hook in `frontend/hooks/useAuth.ts`: login(), signup(), logout() functions calling Better Auth endpoints; redirect logic (unauthenticated → /login, post-login → /dashboard); expose user state and loading state
- [ ] T046 [US2] Add route protection: redirect unauthenticated users accessing /dashboard, /chat, /tasks, /settings to /login; redirect authenticated users accessing /login, /signup to /dashboard

**Checkpoint**: Sign up at /signup with valid email/password → redirected to /dashboard. Log out → redirected to /login. Log in → back to /dashboard. Visit /chat unauthenticated → redirected to /login.

---

## Phase 5: User Story 3 — Dashboard Overview (Priority: P2)

**Goal**: Logged-in user sees personalized greeting, task statistics (total/pending/completed), 5 most recent tasks, and 7-day activity chart. All data loads with skeleton placeholders.

**Independent Test**: Pre-populate tasks for a user, log in, verify stats cards show correct counts, recent tasks listed, chart renders.

### Backend: Stats Endpoint

- [ ] T047 [US3] Implement GET /api/{user_id}/stats endpoint in `backend/app/api/routes/stats.py`: query task counts (total, pending, completed), fetch 5 most recent tasks, aggregate daily task completion counts for last 7 days; return StatsResponse per openapi.yaml
- [ ] T048 [US3] Register stats router in `backend/app/main.py`

### Frontend: Dashboard Components

- [ ] T049 [P] [US3] Create StatCard component in `frontend/components/dashboard/StatCard.tsx`: animated number count-up (0.8s duration) using Framer Motion, icon + label + value, skeleton loading state, responsive card with hover translateY(-4px) effect
- [ ] T050 [P] [US3] Create RecentTasks component in `frontend/components/dashboard/RecentTasks.tsx`: list of 5 most recent tasks with title, completed badge, relative timestamp ("2 hours ago"), skeleton loading state, empty state message ("No tasks yet — try chatting with the AI!")
- [ ] T051 [P] [US3] Create ActivityChart component in `frontend/components/dashboard/ActivityChart.tsx`: Recharts area chart showing daily task completion over 7 days, responsive container, theme-aware colors (dark/light), skeleton loading state
- [ ] T052 [US3] Create Dashboard page in `frontend/app/(dashboard)/dashboard/page.tsx`: personalized greeting ("Good morning, {name}!"), 3 StatCard components (total, pending, completed), RecentTasks section, ActivityChart section, all wrapped with skeleton loading, SEO metadata

**Checkpoint**: Log in → /dashboard shows correct stats for pre-populated tasks. Stats animate on load. Chart renders with 7-day data. Empty state shows for new users.

---

## Phase 6: User Story 4 — Tasks Page with Filter and Search (Priority: P2)

**Goal**: User sees all tasks in a list, can filter by status, search by title, edit inline, delete with confirmation, and add new tasks via modal.

**Independent Test**: Pre-populate tasks, visit /tasks, filter by "Completed", search "groceries", edit a title inline, delete a task with confirmation.

### Backend: Tasks CRUD Endpoints

- [ ] T053 [US4] Implement GET /api/{user_id}/tasks endpoint in `backend/app/api/routes/tasks.py`: query tasks filtered by user_id, optional status filter (all/pending/completed), optional search by title (case-insensitive ILIKE), return {tasks: TaskResponse[]}
- [ ] T054 [US4] Implement POST /api/{user_id}/tasks endpoint in `backend/app/api/routes/tasks.py`: validate CreateTaskRequest, create task for user, return 201 with TaskResponse
- [ ] T055 [US4] Implement PATCH /api/{user_id}/tasks/{task_id} endpoint in `backend/app/api/routes/tasks.py`: validate UpdateTaskRequest, find task by id + user_id, update provided fields, return TaskResponse or 404
- [ ] T056 [US4] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in `backend/app/api/routes/tasks.py`: find task by id + user_id, delete, return 204 or 404
- [ ] T057 [US4] Register tasks router in `backend/app/main.py`

### Frontend: Tasks Components

- [ ] T058 [P] [US4] Create TaskFilter component in `frontend/components/tasks/TaskFilter.tsx`: status filter buttons (All, Pending, Completed) with active state highlighting, search input with debounced filtering (300ms), responsive layout
- [ ] T059 [P] [US4] Create TaskItem component in `frontend/components/tasks/TaskItem.tsx`: task row with checkbox (toggle complete via PATCH), title (click to edit inline — Enter saves, Escape reverts), delete button with confirmation dialog (shadcn/ui Dialog), Framer Motion enter/exit animations
- [ ] T060 [P] [US4] Create NewTaskModal component in `frontend/components/tasks/NewTaskModal.tsx`: shadcn/ui Dialog with React Hook Form + Zod validation (title required, max 255 chars, optional description), submit calls POST /api/{user_id}/tasks, close on success
- [ ] T061 [US4] Create TaskList component in `frontend/components/tasks/TaskList.tsx`: renders filtered TaskItem[] with Framer Motion AnimatePresence for enter/exit animations, empty state ("No tasks match your filter"), skeleton loading
- [ ] T062 [US4] Create Tasks page in `frontend/app/(dashboard)/tasks/page.tsx`: header with "+ New Task" button, TaskFilter, TaskList, integrate with API client (listTasks, createTask, updateTask, deleteTask), SEO metadata

**Checkpoint**: Visit /tasks → see all tasks. Filter by "Completed" → only completed shown. Search "groceries" → filtered results. Click title → edit inline. Click delete → confirmation dialog → task removed. Click "+ New Task" → modal → create task.

---

## Phase 7: User Story 5 — Landing Page and Navigation (Priority: P3)

**Goal**: Visitors see a compelling landing page with hero, features, animated demo. Authenticated users get sidebar navigation on internal pages.

**Independent Test**: Visit / as unauthenticated, verify hero/features/demo/footer render. Click "Get Started" → /signup. Log in → verify sidebar on /dashboard.

### Frontend: Landing Page Components

- [ ] T063 [P] [US5] Create Navbar component in `frontend/components/layout/Navbar.tsx`: logo + "Todo AI Chatbot" text, Login and Sign Up buttons linking to /login and /signup, responsive hamburger menu on mobile (shadcn/ui Sheet), sticky position with backdrop blur
- [ ] T064 [P] [US5] Create Hero component in `frontend/components/home/Hero.tsx`: headline ("Manage Tasks with AI") with Framer Motion fade-in + slide-up (0.6s), subtext paragraph, "Get Started" button (link to /signup) and "Watch Demo" button (scroll to demo section), gradient background accent
- [ ] T065 [P] [US5] Create Features component in `frontend/components/home/Features.tsx`: 3-column grid of feature cards (AI Chat, Task Management, Dark Mode) with icons (Lucide), Framer Motion stagger fade-in (0.4s each, 0.1s stagger) triggered on scroll into view via `whileInView`
- [ ] T066 [P] [US5] Create DemoPreview component in `frontend/components/home/DemoPreview.tsx`: animated chat demo showing sample messages with typing effect (50ms/char), auto-play loop, mock conversation showing task creation flow, card container with shadow
- [ ] T067 [P] [US5] Create Footer component in `frontend/components/layout/Footer.tsx`: copyright text, links (GitHub, docs), minimal design matching theme

### Frontend: Dashboard Layout & Sidebar

- [ ] T068 [US5] Create Sidebar component in `frontend/components/layout/Sidebar.tsx`: navigation links with Lucide icons — Dashboard (LayoutDashboard), Chat (MessageSquare), Tasks (CheckSquare), Settings (Settings icon); active state highlighting based on current route; logout button; collapsible on desktop; slide-in overlay on mobile (shadcn/ui Sheet, Framer Motion slide from left 0.3s); user avatar (initials-based) at top
- [ ] T069 [US5] Create dashboard layout in `frontend/app/(dashboard)/layout.tsx`: Sidebar + main content area with responsive grid (sidebar fixed width on desktop, overlay on mobile), wrap children with auth protection
- [ ] T070 [US5] Create PageTransition wrapper in `frontend/components/layout/PageTransition.tsx`: Framer Motion AnimatePresence with fade + slide-up (0.3s) triggered on route change, wrap all page content

### Frontend: Landing Page Assembly

- [ ] T071 [US5] Create Home page in `frontend/app/page.tsx`: compose Navbar → Hero → Features → DemoPreview → Footer, full-page scroll layout, SEO metadata (title: "Todo AI Chatbot - AI-Powered Task Management")

**Checkpoint**: Visit / → hero, features (animate on scroll), demo preview (auto-playing), footer all render. "Get Started" → /signup. Log in → /dashboard with sidebar. Mobile sidebar opens/closes correctly.

---

## Phase 8: User Story 6 — Dark/Light Mode and Theme Settings (Priority: P3)

**Goal**: User toggles dark/light themes from Settings page or toggle button. Theme persists across sessions, respects system preference on first visit. All pages and ChatKit adapt.

**Independent Test**: Visit /settings, toggle theme, verify all pages change. Refresh → theme persists. First visit with system dark mode → app renders dark.

- [ ] T072 [US6] Create theme toggle component (reusable): Sun/Moon icon toggle button using `useTheme()` from next-themes, animated icon swap with Framer Motion, place in Sidebar and Settings page
- [ ] T073 [US6] Verify all shadcn/ui components respect dark mode: test Button, Card, Dialog, Input, Badge, Skeleton, Toast, Sheet, Tabs, Checkbox, Dropdown, Avatar in both themes — fix any components not picking up CSS variables
- [ ] T074 [US6] Verify ChatKit theme integration: ensure `<ChatKit>` wrapper passes correct theme class/colors for dark/light mode, test custom ChatInterface fallback also adapts
- [ ] T075 [US6] Verify all custom components adapt: StatCard, RecentTasks, ActivityChart, TaskItem, TaskFilter, NewTaskModal, Navbar, Hero, Features, DemoPreview, Footer — ensure all use CSS variable colors via Tailwind (no hardcoded colors)

**Checkpoint**: Toggle dark → light → dark on /settings. Navigate to /chat, /tasks, /dashboard — all pages use correct theme. Refresh browser — theme persists. Clear localStorage → system theme used.

---

## Phase 9: User Story 7 — Settings Page Profile and Account (Priority: P3)

**Goal**: User views/edits profile, manages theme preference, changes password, deletes account. Organized in tabs.

**Independent Test**: Visit /settings, switch tabs, edit name, save, verify change. Toggle theme, verify persistence.

### Backend: Profile Endpoints

- [ ] T076 [US7] Implement GET /api/{user_id}/profile endpoint in `backend/app/api/routes/profile.py`: return ProfileResponse (id, email, display_name, theme_preference) per openapi.yaml
- [ ] T077 [US7] Implement PATCH /api/{user_id}/profile endpoint in `backend/app/api/routes/profile.py`: validate UpdateProfileRequest, update display_name and/or theme_preference, return updated ProfileResponse
- [ ] T078 [US7] Register profile router in `backend/app/main.py`

### Backend: Conversations Endpoint

- [ ] T079 [US7] Implement GET /api/{user_id}/conversations endpoint in `backend/app/api/routes/conversations.py`: return list of conversations with message count and last message preview per openapi.yaml
- [ ] T080 [US7] Implement GET /api/{user_id}/conversations/{conversation_id}/messages endpoint in `backend/app/api/routes/conversations.py`: return messages ordered by created_at with limit parameter (default 50, max 100)
- [ ] T081 [US7] Register conversations router in `backend/app/main.py`

### Frontend: Settings Components

- [ ] T082 [P] [US7] Create ProfileTab component in `frontend/components/settings/ProfileTab.tsx`: display name input (editable), email display (read-only), initials-based avatar, Save button, success toast on save, React Hook Form + Zod validation (display_name max 100 chars)
- [ ] T083 [P] [US7] Create PreferencesTab component in `frontend/components/settings/PreferencesTab.tsx`: theme toggle (Light/Dark/System) using next-themes, save preference to backend via PATCH /profile
- [ ] T084 [P] [US7] Create AccountTab component in `frontend/components/settings/AccountTab.tsx`: change password form (current password, new password, confirm), "Delete Account" button with confirmation dialog, logout on delete
- [ ] T085 [US7] Create Settings page in `frontend/app/(dashboard)/settings/page.tsx`: shadcn/ui Tabs component with Profile, Preferences, Account tabs; integrate with API client (getProfile, updateProfile); SEO metadata

**Checkpoint**: Visit /settings → Profile tab shows name + email. Edit name → save → toast. Preferences tab → theme toggle works and persists to backend. Account tab renders with forms.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Animations, responsive design, error handling, production hardening, documentation

### Animations & Motion

- [ ] T086 [P] Add page transition animations: wrap all page content in PageTransition component (fade + slide up 0.3s on route change)
- [ ] T087 [P] Add button hover animations globally: scale 1.02 + shadow increase on hover (0.2s) via Tailwind + Framer Motion
- [ ] T088 [P] Add card hover animations: translateY(-4px) on hover for all Card components (0.2s)
- [ ] T089 [P] Add toast slide-in animation: notifications slide in from right (0.3s) via shadcn/ui Toast + Framer Motion

### Mobile Responsiveness

- [ ] T090 Verify all 7 pages at 375px width: no horizontal scroll, no overlapping elements, readable text. Fix: landing page features stack vertically, sidebar becomes overlay, chat input stays above keyboard, task list items wrap correctly, stat cards stack on mobile
- [ ] T091 Implement hamburger menu on Navbar for mobile: toggle mobile nav with smooth animation, close on route change

### Error Handling & Production

- [ ] T092 Add structured logging to `backend/app/main.py` and all route files: log MCP tool calls with timestamps, Groq API latency, errors with context (no internal details in responses)
- [ ] T093 Add global exception handlers in `backend/app/main.py`: catch SQLAlchemy errors → 503 "Service temporarily unavailable", catch unhandled exceptions → 500 with generic message, no stack traces in responses
- [ ] T094 [P] Add input validation edge cases in `backend/app/api/routes/chat.py`: empty message returns helpful prompt, message >10000 chars returns 400 with friendly message, empty user_id returns 400
- [ ] T095 [P] Add frontend error boundaries: wrap each page in ErrorBoundary component, display fallback UI with retry button on React crashes
- [ ] T096 [P] Add network error handling in `frontend/lib/api.ts`: display "Unable to connect" with retry button on network failure, "Response taking longer than expected..." on backend timeout (>10s)

### SEO & Accessibility

- [ ] T097 Add SEO metadata to all 7 pages: unique title and description for each (Home, Login, Signup, Dashboard, Chat, Tasks, Settings)
- [ ] T098 Verify WCAG 2.1 AA compliance: keyboard navigation on all interactive elements, visible focus indicators, ARIA labels on icons, sufficient color contrast in both themes

### Documentation

- [ ] T099 [P] Add docstrings to all public functions in `backend/app/` modules
- [ ] T100 Create README.md at project root: project overview, architecture diagram (text), tech stack, setup instructions (reference quickstart.md), environment variables, API endpoints summary, screenshots placeholder

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001 for package structure, T006 for frontend)
- **US1 Chat (Phase 3)**: Depends on Foundational completion (models, database, config, frontend foundation)
- **US2 Auth (Phase 4)**: Depends on Foundational (User model, frontend foundation); can run in parallel with US1
- **US3 Dashboard (Phase 5)**: Depends on Phase 2 (foundation) + Phase 4 (auth for route protection)
- **US4 Tasks (Phase 6)**: Depends on Phase 2 (foundation) + Phase 4 (auth); can run in parallel with US3
- **US5 Landing/Nav (Phase 7)**: Depends on Phase 2 (frontend foundation); can start sidebar after auth (Phase 4)
- **US6 Theme (Phase 8)**: Depends on Phase 2 (theme system) + all pages existing (Phases 3-7)
- **US7 Settings (Phase 9)**: Depends on Phase 4 (auth) + Phase 2 (foundation)
- **Polish (Phase 10)**: Depends on all user stories being complete

### Within Each User Story

- Models before MCP tools (tools query models)
- MCP server before agent (agent uses MCP tools)
- Agent before chat endpoint (endpoint calls agent)
- Backend endpoints before frontend pages (pages call API)
- API client before page components (components use client)

### Parallel Opportunities

- T002–T008 can all run in parallel (Phase 1, different files)
- T011–T014 can run in parallel (different model files)
- T018, T019 can run in parallel (different concerns)
- T020–T026 can run in parallel (different frontend files)
- T027–T031 can run in parallel (5 independent MCP tool files)
- T043, T044 can run in parallel (login + signup are independent pages)
- T049, T050, T051 can run in parallel (independent dashboard components)
- T058, T059, T060 can run in parallel (independent task components)
- T063–T067 can run in parallel (independent landing page components)
- T082, T083, T084 can run in parallel (independent settings tab components)
- T086–T089 can run in parallel (independent animation additions)
- US3 (Phase 5) and US4 (Phase 6) can run in parallel (independent features)
- US5 landing page components (Phase 7) can start as soon as frontend foundation is ready

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (AI Chat — validates entire backend pipeline)
4. Complete Phase 4: User Story 2 (Auth — enables protected routes)
5. **STOP and VALIDATE**: Sign up, log in, open /chat, send "Add buy milk", then "Show my tasks" — verify full end-to-end
6. Deploy/demo if ready (MVP achieved)

### Incremental Delivery

1. Setup + Foundational → Both apps start, DB migrated
2. + User Story 1 → Can create/list/complete/delete/update tasks via chat (MVP core!)
3. + User Story 2 → Users can register and log in (MVP complete!)
4. + User Stories 3 + 4 → Dashboard analytics + direct task management
5. + User Story 5 → Landing page + sidebar navigation (marketing + polish)
6. + User Stories 6 + 7 → Theme system + settings (complete experience)
7. + Polish → Animations, accessibility, error handling, documentation (production-ready)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (backend MCP + agent + chat endpoint)
   - Developer B: User Story 2 (auth + login/signup pages)
3. After MVP validation:
   - Developer A: User Stories 3 + 4 (dashboard + tasks — backend + frontend)
   - Developer B: User Stories 5 + 7 (landing + navigation + settings)
4. Together: User Story 6 (theme verification across all pages) + Phase 10 (polish)

---

## Task Summary

| Phase | Tasks | Story | Priority |
|-------|-------|-------|----------|
| Phase 1: Setup | T001–T008 | — | — |
| Phase 2: Foundational | T009–T026 | — | — |
| Phase 3: AI Chat | T027–T039 | US1 | P1 |
| Phase 4: Auth | T040–T046 | US2 | P1 |
| Phase 5: Dashboard | T047–T052 | US3 | P2 |
| Phase 6: Tasks Page | T053–T062 | US4 | P2 |
| Phase 7: Landing/Nav | T063–T071 | US5 | P3 |
| Phase 8: Theme | T072–T075 | US6 | P3 |
| Phase 9: Settings | T076–T085 | US7 | P3 |
| Phase 10: Polish | T086–T100 | — | — |
| **Total** | **100 tasks** | **7 stories** | **3 priorities** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Frontend API client (T036) is shared across all stories — created in US1, reused by US3-US7
- Theme system (Phase 2 foundation T020–T023) is shared — verification in US6 (Phase 8)
- All 5 MCP tools are built together in US1 since the chat endpoint needs all of them for full task management
