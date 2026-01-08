---
id: 0002
title: Implementation plan creation
stage: plan
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-multi-user-todo-app
branch: 001-multi-user-todo-app
user: anzal
command: /sp.plan
labels: ["plan", "architecture", "research", "data-model", "api-contracts"]
links:
  spec: specs/001-multi-user-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-multi-user-todo-app/plan.md
  - specs/001-multi-user-todo-app/research.md
  - specs/001-multi-user-todo-app/data-model.md
  - specs/001-multi-user-todo-app/contracts/api.yaml
  - specs/001-multi-user-todo-app/quickstart.md
  - CLAUDE.md
tests:
  - none
---

## Prompt

User provided detailed technology stack and monorepo structure:

TECHNOLOGY STACK:
- Frontend: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- Backend: Python FastAPI with SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (frontend) with JWT tokens (backend)
- Package Manager: npm (frontend), uv (backend)

MONOREPO STRUCTURE:
- frontend/ with Next.js App Router structure
- backend/ with FastAPI structure
- Detailed file organization for both services

IMPLEMENTATION DETAILS:
- Better Auth setup with JWT generation, 7-day token expiry
- API client with Authorization headers, 401 error handling
- Database setup with Neon SSL, SQLModel, Alembic migrations
- JWT verification with PyJWT, dependency injection pattern
- Security: all endpoints require JWT, user_id filtering, CORS configuration
- Authentication flow: Better Auth → JWT → localStorage → API headers → backend verification

## Response snapshot

Created comprehensive implementation plan with Phase 0 (Research) and Phase 1 (Design) completed.

**Plan Structure**:

1. **Technical Context** - Fully specified:
   - Language/Version: Python 3.13+ (backend), TypeScript (frontend)
   - Dependencies: FastAPI + SQLModel, Next.js + Better Auth + Tailwind
   - Storage: Neon Serverless PostgreSQL with SSL
   - Testing: pytest (backend), Jest (frontend)
   - Performance goals: <200ms API, <2s frontend load, 100+ concurrent users

2. **Constitution Check** - All gates PASSED:
   - ✅ Separation of Concerns (frontend/backend independent)
   - ✅ API-First Design (RESTful endpoints)
   - ✅ Stateless Authentication (JWT tokens)
   - ✅ Type Safety (TypeScript + Pydantic)
   - ✅ Database as Source of Truth (PostgreSQL persistence)
   - ✅ All mandatory technologies used
   - ✅ No forbidden patterns
   - Zero violations

3. **Project Structure** - Monorepo defined:
   - frontend/ with App Router pages, components, lib, hooks
   - backend/ with app/main.py, models, schemas, routes, middleware
   - Detailed file structure for both services

4. **Phase 0: Research** - 6 research topics documented in research.md:
   - Better Auth + Next.js 16 App Router integration (decision: httpOnly cookies NOT localStorage)
   - JWT Verification in FastAPI (decision: PyJWT with dependency injection)
   - SQLModel + Neon PostgreSQL (decision: NullPool, Alembic migrations, composite indexes)
   - User Isolation Patterns (decision: JWT dependency injection NOT path parameters)
   - Server/Client Component Patterns (decision: server for initial load, client for interactivity)
   - CORS Configuration (decision: specific origin + credentials enabled)

5. **Phase 1: Design Artifacts**:

   a) **data-model.md** - Complete schema:
      - User entity (managed by Better Auth): id, email, password_hash
      - Task entity: id, user_id (FK), title, description, completed, timestamps
      - Indexes: user_id (critical for isolation), completed, composite (user_id, completed)
      - Foreign key with CASCADE delete
      - SQLModel + Pydantic schemas
      - Validation rules at 3 layers (DB, backend, frontend)

   b) **contracts/api.yaml** - OpenAPI 3.0 specification:
      - 6 endpoints: GET/POST /api/tasks, GET/PUT/DELETE /api/tasks/{id}, PATCH /api/tasks/{id}/complete
      - JWT Bearer authentication
      - Request/response schemas (Task, TaskCreate, TaskUpdate, TaskResponse, Error)
      - HTTP status codes: 200, 201, 204, 400, 401, 403, 404
      - Query parameter: status filter (all/pending/completed)

   c) **quickstart.md** - 15-minute setup guide:
      - Prerequisites: Python 3.13+, Node 20+, uv, Neon account
      - 8-step process: clone, create DB, generate JWT secret, setup backend, setup frontend, verify, create user, test isolation
      - Troubleshooting section
      - Development workflow instructions

6. **Agent Context Update** - CLAUDE.md updated:
   - Added Python 3.13+ (backend), TypeScript (frontend)
   - Added FastAPI + SQLModel + Next.js + Better Auth
   - Added Neon Serverless PostgreSQL

**Key Architectural Decisions**:

| Decision | Choice | Alternative Rejected | Rationale |
|----------|--------|---------------------|-----------|
| Token Storage | httpOnly cookies | localStorage | XSS protection, auto-send |
| User Isolation | Dependency injection | Path parameters | Prevents URL manipulation |
| Component Pattern | Server + Client | Client-only | Performance, SEO |
| Connection Pool | NullPool (Neon handles) | SQLAlchemy pool | Avoid double-pooling |
| Indexes | Composite (user_id, completed) | Single indexes only | Query optimization |

## Outcome

- ✅ Impact: Complete implementation plan with all design artifacts ready for task generation, passing all constitution gates
- 🧪 Tests: No tests created (planning phase) - test strategy defined in constitution check
- 📁 Files: 6 files created (plan.md, research.md, data-model.md, api.yaml, quickstart.md, CLAUDE.md updated)
- 🔁 Next prompts: /sp.tasks to generate actionable implementation tasks organized by user story
- 🧠 Reflection: Plan successfully translates spec requirements to technical architecture. All research questions resolved with clear decisions and rationale. Constitution compliance verified. Ready for implementation phase.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - all constitution gates passed, all research resolved, complete design artifacts
- Prompt variant (if applicable): standard-plan-with-research-v1
- Next experiment (smallest change to try): Generate tasks to validate plan translates to actionable implementation steps
