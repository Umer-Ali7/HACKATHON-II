# Implementation Plan: Todo AI Chatbot (Modern UI Edition)

**Branch**: `003-todo-ai-chatbot` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-todo-ai-chatbot/spec.md`

## Summary

Build a production-ready AI-powered todo management chatbot with a
Next.js 14+ frontend (7 polished pages, dark/light mode, Framer
Motion animations, OpenAI ChatKit chat interface) and a FastAPI
backend. The backend uses Groq (via OpenAI Agents SDK) for fast
inference and exposes all task CRUD operations as MCP tools.
Conversation history and tasks are persisted in Neon PostgreSQL.
The system is stateless — every request reconstructs context from
the database.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5.x (frontend)
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, MCP SDK, SQLModel, Next.js 14+, Tailwind CSS, shadcn/ui, Framer Motion, next-themes, @openai/chatkit-react, Recharts, Zustand, React Hook Form + Zod, Lucide React
**Storage**: Neon Serverless PostgreSQL (via SQLModel/SQLAlchemy async engine)
**Testing**: pytest + httpx (backend), React Testing Library (frontend)
**Target Platform**: Web — Linux/container server (backend), Vercel edge (frontend)
**Project Type**: web (frontend + backend)
**Performance Goals**: < 2 s end-to-end for simple queries, < 500 ms TTFB, < 100 ms DB queries, Lighthouse Performance > 90, Lighthouse Accessibility > 95
**Constraints**: < 200 KB gzipped frontend bundle, 100 req/min/user rate limit, Groq token limits, 60fps animations
**Scale/Scope**: 50 concurrent users, 1,000 tasks/user, 7 pages, single chat endpoint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | Stateless Architecture | PASS | Server stores nothing in memory; all state in PostgreSQL. Each request loads conversation history from DB, processes, saves, and forgets. |
| II | MCP-First Design | PASS | All 5 task operations (add, list, complete, update, delete) are MCP tools. Agent calls tools only; no direct DB queries from agent layer. Data flow: UI -> API -> Agent -> MCP Tools -> Database. |
| III | Modern Developer Experience | PASS | Environment-based config via Pydantic Settings + `.env`. Single-command local setup via `make dev`. Structured logging on all API paths. Docstrings on all public functions. |
| IV | Production Quality | PASS | Better Auth for authentication. Alembic for migrations. CORS whitelist frontend domain only. Rate limiting 100 req/min/user. Pydantic input validation on all endpoints. |
| V | Type Safety & Validation | PASS | TypeScript strict mode on frontend. Python type hints + SQLModel on backend. Pydantic models validate all request/response bodies. Error messages never expose internals. |
| VI | Security by Default | PASS | user_id isolation enforced at query layer. SQLModel parameterized queries (no raw SQL). Secrets in `.env` only. Exponential backoff for Groq 429 errors. |
| VII | UI/UX Excellence | PASS | Custom design language with CSS variables. Dark/light mode via next-themes with system detection. Mobile-first responsive (375px+). WCAG 2.1 AA (keyboard nav, focus indicators, ARIA). Framer Motion animations. Skeleton loading (no spinners). ChatKit for chat interface. Error boundaries on all pages. SEO metadata on all pages. |

**GATE RESULT: ALL PASS** — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-todo-ai-chatbot/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── openapi.yaml     # API contract (v2.0.0)
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── chat.py              # POST /api/{user_id}/chat
│   │       ├── tasks.py             # GET/POST/PATCH/DELETE tasks
│   │       ├── stats.py             # GET /api/{user_id}/stats
│   │       ├── conversations.py     # GET conversations + messages
│   │       └── profile.py           # GET/PATCH profile
│   ├── core/
│   │   ├── config.py                # Pydantic Settings from .env
│   │   └── database.py              # SQLModel async engine + session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                  # User SQLModel
│   │   ├── task.py                  # Task SQLModel
│   │   ├── conversation.py          # Conversation SQLModel
│   │   └── message.py               # Message SQLModel
│   ├── mcp/
│   │   ├── server.py                # MCP server setup
│   │   └── tools/
│   │       ├── __init__.py
│   │       ├── add_task.py
│   │       ├── list_tasks.py
│   │       ├── complete_task.py
│   │       ├── delete_task.py
│   │       └── update_task.py
│   ├── agents/
│   │   └── todo_agent.py            # OpenAI Agents SDK + Groq
│   └── main.py                      # FastAPI app entry + CORS + health
├── alembic/
│   ├── alembic.ini
│   ├── env.py
│   └── versions/
├── tests/
│   ├── conftest.py
│   ├── test_mcp_tools.py
│   └── test_chat_endpoint.py
├── pyproject.toml
├── .env.example
└── Makefile

frontend/
├── app/
│   ├── layout.tsx                   # Root layout (ThemeProvider, fonts)
│   ├── providers.tsx                # Client providers (next-themes)
│   ├── globals.css                  # CSS variables, Tailwind base
│   ├── page.tsx                     # Home / landing page
│   ├── (auth)/
│   │   ├── layout.tsx               # Auth layout (centered card)
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   └── signup/
│   │       └── page.tsx             # Signup page
│   └── (dashboard)/
│       ├── layout.tsx               # Dashboard layout (sidebar)
│       ├── dashboard/
│       │   └── page.tsx             # Dashboard page
│       ├── chat/
│       │   └── page.tsx             # Chat page
│       ├── tasks/
│       │   └── page.tsx             # Tasks page
│       └── settings/
│           └── page.tsx             # Settings page
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── layout/
│   │   ├── Navbar.tsx               # Landing page navbar
│   │   ├── Sidebar.tsx              # Dashboard sidebar
│   │   ├── Footer.tsx               # Landing page footer
│   │   └── PageTransition.tsx       # Framer Motion wrapper
│   ├── home/
│   │   ├── Hero.tsx                 # Hero section
│   │   ├── Features.tsx             # Feature cards grid
│   │   └── DemoPreview.tsx          # Animated chat demo
│   ├── chat/
│   │   ├── ChatInterface.tsx        # Custom chat (dev fallback)
│   │   └── ChatKitWrapper.tsx       # OpenAI ChatKit wrapper
│   ├── dashboard/
│   │   ├── StatCard.tsx             # Animated stat display
│   │   ├── RecentTasks.tsx          # Last 5 tasks list
│   │   └── ActivityChart.tsx        # Recharts area chart
│   ├── tasks/
│   │   ├── TaskList.tsx             # Task list with filter/search
│   │   ├── TaskItem.tsx             # Single task row
│   │   ├── TaskFilter.tsx           # Status filter + search
│   │   └── NewTaskModal.tsx         # Create task dialog
│   ├── settings/
│   │   ├── ProfileTab.tsx           # Name, email display
│   │   ├── PreferencesTab.tsx       # Theme toggle
│   │   └── AccountTab.tsx           # Password, delete account
│   └── ErrorBoundary.tsx            # React error boundary
├── lib/
│   ├── api.ts                       # Backend API client
│   ├── utils.ts                     # Shared utilities (cn helper)
│   └── store.ts                     # Zustand store (user prefs)
├── hooks/
│   └── useAuth.ts                   # Auth state hook
├── .env.example
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

**Structure Decision**: Web application layout (frontend + backend
at repository root). Backend follows FastAPI convention with `app/`
package. Frontend follows Next.js App Router with route groups:
`(auth)` for login/signup, `(dashboard)` for authenticated pages.
This matches constitution technology mandates.

## Complexity Tracking

> No constitution violations detected. No complexity justifications needed.

## Phase 0: Research Decisions

See [research.md](./research.md) for full analysis. Key decisions:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Groq model | `llama-3.3-70b-versatile` | Best balance of speed and tool-calling accuracy |
| MCP integration | Stdio transport, in-process server | Simplest for single-backend deployment |
| DB driver | `asyncpg` via SQLAlchemy async | Fastest async PostgreSQL driver |
| Auth approach | Better Auth with session tokens | Constitution mandate; simplest for chat UI |
| Rate limiting | `slowapi` middleware | Lightweight, per-user, FastAPI-native |
| Chat UI | `@openai/chatkit-react` v1.4.0 + custom fallback | ChatKit requires domain key; dual-mode for dev/prod |
| Theme system | `next-themes` + CSS variables + Tailwind | System detection, localStorage persistence, no FOUC |
| Animations | Framer Motion | Constitution mandate; GPU-accelerated transforms |
| Charts | Recharts area chart | Constitution mandate; responsive, Tailwind-compatible |
| shadcn/ui | 12 components (button, input, card, dialog, dropdown-menu, avatar, badge, skeleton, toast, sheet, tabs, checkbox) | Mapped to page requirements |
| Conversation history | Last 50 messages per request | Sufficient context within token limits |
| Backoff strategy | 3 retries, 1s/2s/4s delays | Stays within 5s error threshold |

## Phase 1: Design Artifacts

### Data Model

See [data-model.md](./data-model.md) for full entity definitions.

Four entities: **User**, **Task**, **Conversation**, **Message**.

- User managed by Better Auth with display_name and theme_preference.
- Task has composite index on `(user_id, completed)` for filtered listing.
- Message has composite index on `(conversation_id, created_at)` for ordered retrieval.
- Message includes `tool_calls` JSON field for MCP tool transparency.
- All entities use `updated_at` with auto-update for audit trails.

### API Contract

See [contracts/openapi.yaml](./contracts/openapi.yaml) (v2.0.0).

Endpoints:
- `POST /api/{user_id}/chat` — AI chat with MCP tools
- `GET /api/{user_id}/tasks` — List tasks (filter, search)
- `POST /api/{user_id}/tasks` — Create task directly
- `PATCH /api/{user_id}/tasks/{task_id}` — Update task
- `DELETE /api/{user_id}/tasks/{task_id}` — Delete task
- `GET /api/{user_id}/stats` — Dashboard statistics + activity
- `GET /api/{user_id}/conversations` — List conversations
- `GET /api/{user_id}/conversations/{id}/messages` — Get messages
- `GET /api/{user_id}/profile` — Get user profile
- `PATCH /api/{user_id}/profile` — Update profile
- `GET /health` — Health check

### Quickstart

See [quickstart.md](./quickstart.md) for local development setup.

## Stateless Request Flow

```
1. Client sends message → POST /api/{user_id}/chat
2. FastAPI validates input (Pydantic model)
3. Get or create Conversation record in DB
4. Fetch last 50 messages for conversation from DB
5. Save new user message to DB
6. Build OpenAI-format messages array [system, ...history, user_msg]
7. Call OpenAI Agents SDK (Groq provider) with MCP tools
8. Agent decides which tool(s) to call → MCP tools execute via SQLModel
9. Agent generates natural language response
10. Save assistant response + tool_calls metadata to DB
11. Return response + tool_calls to client
12. Server forgets everything (stateless)
```

## Error Handling Architecture

| Layer | Error Type | Handling |
|-------|-----------|----------|
| API Input | Invalid body / missing fields | Pydantic validation -> 422 with field-level errors |
| API Input | Message too long (>10,000 chars) | Pre-validation -> 400 with friendly message |
| API Input | Rate limit exceeded | slowapi -> 429 with retry-after header |
| Database | Connection failure / pool exhausted | Catch SQLAlchemy errors -> 503 "Service temporarily unavailable" |
| MCP Tool | Task not found / invalid ID | Tool returns structured error -> agent explains to user |
| MCP Tool | User isolation violation | Query always filters by user_id -> impossible by design |
| Groq API | 429 rate limit | Exponential backoff (3 retries, 1s/2s/4s) |
| Groq API | 500/503 server error | Retry 3 times -> fallback message |
| Groq API | Invalid/empty response | Log full response -> return generic error to user |
| Frontend | Network failure | Display "Unable to connect" with retry button |
| Frontend | Backend timeout (>10s) | Display "Response taking longer than expected..." |
| Frontend | React component crash | ErrorBoundary catches -> displays fallback UI |
| Frontend | ChatKit domain key missing | Fall back to custom chat component |

## Frontend Architecture

### Theme System

```
next-themes ThemeProvider (attribute="class", defaultTheme="system")
  └── <html class="dark|light" suppressHydrationWarning>
       └── CSS variables switch: :root vs .dark
            └── Tailwind uses hsl(var(--variable)) for all colors
                 └── All components inherit theme automatically
```

### Route Groups

```
app/
├── page.tsx                   # / (public - landing page)
├── (auth)/                    # Auth route group (no sidebar)
│   ├── layout.tsx             # Centered card layout
│   ├── login/page.tsx         # /login
│   └── signup/page.tsx        # /signup
└── (dashboard)/               # Authenticated route group
    ├── layout.tsx             # Sidebar + main content layout
    ├── dashboard/page.tsx     # /dashboard
    ├── chat/page.tsx          # /chat
    ├── tasks/page.tsx         # /tasks
    └── settings/page.tsx      # /settings
```

### Component Hierarchy

```
Landing: Navbar → Hero → Features → DemoPreview → Footer
Auth:    Logo → Card(Form(Input, Button))
Dashboard Layout: Sidebar + [Page Content]
  Dashboard: StatCard x3 → RecentTasks → ActivityChart
  Chat: ChatKitWrapper | ChatInterface (fallback)
  Tasks: TaskFilter → TaskList(TaskItem[]) → NewTaskModal
  Settings: Tabs(ProfileTab, PreferencesTab, AccountTab)
```

### Animation Inventory

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Hero text | Fade in + slide up | Page load | 0.6s |
| Feature cards | Stagger fade in | Scroll into view | 0.4s each, 0.1s stagger |
| Demo messages | Typing effect | Auto-play loop | 50ms/char |
| Page transitions | Fade + slide up | Route change | 0.3s |
| Stat cards | Number count-up | Data loaded | 0.8s |
| Button hover | Scale 1.02 + shadow | Hover | 0.2s |
| Card hover | TranslateY -4px | Hover | 0.2s |
| Sidebar mobile | Slide from left | Menu toggle | 0.3s |
| Skeleton pulse | Opacity oscillation | Loading state | 1.5s loop |
| Toast | Slide in from right | Notification | 0.3s |

## Post-Design Constitution Re-Check

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Stateless Architecture | PASS | Request flow confirmed stateless (step 12). No in-memory session. |
| II | MCP-First Design | PASS | 5 MCP tools defined. Agent has no SQLModel imports. |
| III | Modern Developer Experience | PASS | `make dev` starts both. `.env.example` provided. ChatKit setup in quickstart. |
| IV | Production Quality | PASS | Better Auth, Alembic, CORS, rate limiting, Pydantic all in plan. |
| V | Type Safety & Validation | PASS | TypeScript strict, Python typed, Pydantic on all boundaries. |
| VI | Security by Default | PASS | user_id isolation in every query. No raw SQL. Secrets in .env. Backoff for 429. |
| VII | UI/UX Excellence | PASS | 7 pages defined. Dark/light via next-themes. Framer Motion animations inventoried. Skeleton loading. ChatKit + fallback. Error boundaries. SEO metadata. Mobile-first responsive. WCAG 2.1 AA (keyboard nav, focus indicators, ARIA via shadcn/ui). |

**POST-DESIGN GATE: ALL PASS** — ready for `/sp.tasks`.
