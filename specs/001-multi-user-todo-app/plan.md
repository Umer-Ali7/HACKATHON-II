# Implementation Plan: Hackathon Todo - Multi-User Task Management

**Branch**: `001-multi-user-todo-app` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-multi-user-todo-app/spec.md`

**Note**: This template is filled in by the `/sp.plan` command.

## Summary

Build a multi-user todo web application with secure user authentication and complete task management capabilities. Users can create accounts, manage personal task lists with CRUD operations, filter tasks by status, and maintain complete data isolation from other users. The application uses a modern web stack with Next.js frontend, FastAPI backend, and Neon PostgreSQL database, implementing JWT-based stateless authentication for security and scalability.

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript (frontend with Next.js 16+)
**Primary Dependencies**: FastAPI + SQLModel (backend), Next.js App Router + Better Auth + Tailwind CSS (frontend)
**Storage**: Neon Serverless PostgreSQL with SSL mode enabled
**Testing**: pytest (backend), Jest + React Testing Library (frontend)
**Target Platform**: Web application (Linux server for backend, Vercel for frontend deployment)
**Project Type**: Web application (frontend + backend monorepo)
**Performance Goals**: API response <200ms p95, frontend load <2 seconds, support 100+ concurrent users
**Constraints**: User data isolation mandatory, JWT secret must match across services, mobile-responsive design required
**Scale/Scope**: Multi-user application, estimated 100-1000 users, 3 pages (login/signup/tasks), 6 API endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Separation of Concerns
- **Status**: COMPLIANT
- **Implementation**: Frontend (Next.js) and backend (FastAPI) are independent services
- **Evidence**: Monorepo structure with separate `frontend/` and `backend/` directories, API-only communication

### ✅ II. API-First Design
- **Status**: COMPLIANT
- **Implementation**: Backend exposes RESTful API, frontend consumes as client
- **Evidence**: All task operations go through `/api/{user_id}/tasks` endpoints with proper HTTP verbs

### ✅ III. Stateless Authentication
- **Status**: COMPLIANT
- **Implementation**: JWT tokens with Better Auth, no server-side sessions
- **Evidence**: JWT tokens carry user context, localStorage on frontend, verification on backend

### ✅ IV. Type Safety Everywhere
- **Status**: COMPLIANT
- **Implementation**: TypeScript strict mode in frontend, Pydantic models in backend
- **Evidence**: All API responses typed with interfaces, SQLModel + Pydantic validation

### ✅ V. Database as Single Source of Truth
- **Status**: COMPLIANT
- **Implementation**: All state persists to Neon PostgreSQL via SQLModel
- **Evidence**: No client-side persistence of critical data, all operations write to database

### ✅ Technology Stack Constraints
- **Status**: COMPLIANT
- **Mandatory Technologies Used**:
  - ✅ Python 3.13+ with uv (backend)
  - ✅ FastAPI for REST API
  - ✅ SQLModel for ORM
  - ✅ Neon Serverless PostgreSQL
  - ✅ Next.js 16+ App Router
  - ✅ Better Auth for authentication
- **Forbidden Patterns Avoided**:
  - ✅ No raw SQL (using SQLModel)
  - ✅ No server-side sessions (JWT only)
  - ✅ No Pages Router (App Router only)
  - ✅ No client-side critical state (database-backed)
  - ✅ No hardcoded secrets (environment variables)

### ✅ Code Quality Standards
- **Status**: COMPLIANT
- **API Standards**: All endpoints filter by `user_id`, use Pydantic validation, return proper HTTP codes
- **Frontend Standards**: TypeScript with explicit types, proper error/loading states
- **Validation**: Multi-layer (frontend UX, backend security, database integrity)

### ✅ Security Standards
- **Status**: COMPLIANT
- **Authentication**: All API endpoints require JWT verification
- **User Isolation**: All queries filter by authenticated user_id
- **Token Security**: JWT secret matched between services, httpOnly cookies planned
- **CORS**: Configured for specific frontend domain only

### ✅ Performance Standards
- **Status**: COMPLIANT
- **Response Times**: <200ms target with indexed queries
- **Frontend Load**: <2s target with Next.js optimization
- **Database**: Indexes on user_id and completed fields, connection pooling enabled

### ✅ Testing Standards
- **Status**: COMPLIANT (to be implemented in tasks phase)
- **Unit Tests**: Planned for business logic and validation
- **Integration Tests**: Planned for API endpoints with auth
- **E2E Tests**: Planned for authentication flow and user isolation

**Constitution Check Result**: ✅ **ALL GATES PASSED** - No violations, proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-multi-user-todo-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api.yaml         # OpenAPI specification
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── layout.tsx                # Root layout with Better Auth provider
│   ├── page.tsx                  # Home page (redirects based on auth)
│   ├── login/
│   │   └── page.tsx              # Login page with Better Auth
│   ├── signup/
│   │   └── page.tsx              # Signup page with Better Auth
│   └── tasks/
│       └── page.tsx              # Main tasks page (protected route)
├── components/
│   ├── TaskList.tsx              # Task list container with filters
│   ├── TaskItem.tsx              # Individual task card
│   ├── TaskForm.tsx              # Create/edit task form
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── lib/
│   ├── api.ts                    # API client with auth headers
│   ├── auth.ts                   # Better Auth configuration
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
├── hooks/
│   ├── useTasks.ts               # Task operations hook
│   └── useAuth.ts                # Auth state hook
├── middleware.ts                 # Next.js middleware for auth
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration (strict mode)
├── package.json                  # npm dependencies
├── .env.local.example            # Environment variables template
└── .gitignore

backend/
├── app/
│   ├── main.py                   # FastAPI application entry
│   ├── config.py                 # Configuration and environment variables
│   ├── db.py                     # Database connection and session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py               # Task SQLModel
│   │   └── user.py               # User model (Better Auth managed)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── task.py               # Task Pydantic schemas
│   │   └── responses.py          # Standard response models
│   ├── routes/
│   │   ├── __init__.py
│   │   └── tasks.py              # Task CRUD endpoints
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth.py               # JWT verification middleware
│   │   └── cors.py               # CORS configuration
│   └── utils/
│       ├── __init__.py
│       └── security.py           # Security utilities
├── tests/
│   ├── __init__.py
│   ├── conftest.py               # pytest configuration
│   ├── test_tasks.py             # Task endpoint tests
│   └── test_auth.py              # Auth middleware tests
├── alembic/                      # Database migrations
│   ├── versions/
│   └── env.py
├── alembic.ini                   # Alembic configuration
├── pyproject.toml                # uv project configuration
├── .env.example                  # Environment variables template
└── .gitignore
```

**Structure Decision**: Web application monorepo with separate frontend and backend directories. This structure enables:
- Independent development and deployment of frontend/backend
- Clear separation of concerns (constitution principle I)
- Shared environment variables for JWT secret
- Unified version control and CI/CD
- Frontend and backend already exist in the repo

## Complexity Tracking

> No constitution violations - this section is empty.

---

## Phase 0: Research

### Research Topics

The following technical decisions and patterns need to be researched and documented in `research.md`:

1. **Better Auth Integration with Next.js 16 App Router**
   - Better Auth setup for App Router (vs Pages Router)
   - JWT token generation configuration
   - Session persistence with localStorage vs httpOnly cookies
   - Better Auth + Neon PostgreSQL integration

2. **JWT Verification in FastAPI**
   - PyJWT library usage patterns
   - JWT secret sharing between Next.js and FastAPI
   - Token expiration and refresh strategies
   - Middleware implementation for dependency injection

3. **SQLModel with Neon Serverless PostgreSQL**
   - Neon connection string format with SSL
   - SQLModel connection pooling configuration
   - Alembic migrations with SQLModel
   - Index creation patterns for performance

4. **User Isolation Patterns in FastAPI**
   - Path parameters vs dependency injection for user_id
   - Query filtering patterns with SQLModel
   - Authorization checks (URL user_id matches JWT user_id)
   - Error handling for unauthorized access

5. **Next.js App Router Server/Client Component Patterns**
   - Server components for initial data fetching
   - Client components for interactivity
   - Data passing between server and client components
   - Loading and error boundaries

6. **CORS Configuration for FastAPI + Next.js**
   - CORS middleware setup for development (localhost)
   - CORS for production (Vercel frontend domain)
   - Credentials handling with JWT tokens

---

*Research tasks will be dispatched to generate `research.md`.*

---

## Phase 1: Design Artifacts

### 1. Data Model (`data-model.md`)

Will define:
- **User Entity** (managed by Better Auth):
  - Fields: id, email, password_hash, created_at
  - Relationships: one-to-many with Tasks
  - Constraints: unique email

- **Task Entity**:
  - Fields: id, user_id, title, description, completed, created_at, updated_at
  - Relationships: belongs to User
  - Constraints: title NOT NULL max 200 chars, description max 1000 chars
  - Indexes: user_id (for filtering), completed (for filter queries)

### 2. API Contracts (`contracts/api.yaml`)

Will define OpenAPI spec for:
- `POST /api/auth/signup` - Create user account (Better Auth)
- `POST /api/auth/login` - Authenticate user (Better Auth)
- `GET /api/tasks` - List user's tasks with optional status filter
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get single task
- `PUT /api/tasks/{id}` - Update task title/description
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status
- `DELETE /api/tasks/{id}` - Delete task

### 3. Quickstart Guide (`quickstart.md`)

Will provide:
- Prerequisites (Python 3.13+, Node.js 20+, Neon account)
- Environment setup instructions
- Database initialization steps
- Development server startup
- First user creation and task operations
- Verification steps for user isolation

---

*Phase 1 artifacts will be generated after research is complete.*
