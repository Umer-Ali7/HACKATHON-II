# Tasks: Todo AI Chatbot - Critical Fixes

**Input**: Design documents from `specs/004-todo-ai-chatbot-fixes/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/auth-api.yaml

**Tests**: Not explicitly requested. Manual verification commands included per phase checkpoint.

**Organization**: Tasks grouped by user story. US1 (database) is foundational - must complete before US2/US3. US4 is P2 and can be deferred.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/` (Python/FastAPI)
- **Frontend**: `frontend/` (Next.js/React)
- All paths relative to repository root `phase-3/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install missing dependencies and configure environment

- [x] T001 Install passlib[bcrypt] dependency in backend virtual environment: `cd backend && pip install "passlib[bcrypt]"`
- [x] T002 [P] Add AUTH_SECRET field to backend/app/core/config.py (add `AUTH_SECRET: str = "changeme-in-production-at-least-32-chars"` to Settings class)
- [x] T003 [P] Add AUTH_SECRET to backend/.env file (append `AUTH_SECRET=supersecretkey12345678901234567890` line)
- [x] T004 [P] Create frontend/.env.local with `NEXT_PUBLIC_API_URL=http://localhost:8000`

**Checkpoint**: Dependencies installed, environment configured. Verify: `cd backend && python -c "from passlib.context import CryptContext; print('OK')"`

---

## Phase 2: Foundational - Database Auto-Creation (Blocking)

**Purpose**: Fix table creation so ALL subsequent operations have a working database. This is User Story 1 (P1) and blocks everything else.

**⚠️ CRITICAL**: No auth or frontend work can succeed until tables exist in Neon.

- [x] T005 [US1] Add async `create_db_and_tables()` function to backend/app/core/database.py. Import `SQLModel` from sqlmodel. Add function that uses `async with engine.begin() as conn: await conn.run_sync(SQLModel.metadata.create_all)`. Add logging to confirm table creation.
- [x] T006 [US1] Add lifespan handler to backend/app/main.py. Import `asynccontextmanager` from contextlib and `create_db_and_tables` from `app.core.database`. Create `async def lifespan(app)` context manager that calls `await create_db_and_tables()` on startup and logs shutdown. Update `FastAPI()` constructor to pass `lifespan=lifespan`.
- [x] T007 [US1] Verify database tables are created on startup. Run `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000` and confirm logs show table creation. Check Neon dashboard for `user`, `task`, `conversation`, `message` tables.

**Checkpoint (US1 - Database Persistence)**: Tables auto-created on startup. Verify:
```bash
cd backend
curl http://localhost:8000/health
# Expected: {"status":"ok"} and no startup errors in server logs
```

---

## Phase 3: User Story 2 - Password Verification (Priority: P1)

**Goal**: Implement backend auth endpoints with bcrypt hashing so login rejects wrong passwords.

**Independent Test**: Sign up a user, then test login with correct password (200) and wrong password (401).

### Implementation for User Story 2

- [x] T008 [US2] Add auth Pydantic schemas to backend/app/api/schemas.py. Add `SignupRequest` (email: EmailStr, password: str with min_length=6, name: str | None), `LoginRequest` (email: EmailStr, password: str), and `AuthResponse` (user_id: str, email: str, name: str | None, token: str) classes.
- [x] T009 [US2] Create backend/app/api/routes/auth.py with signup and login endpoints. Implement `POST /api/auth/signup`: generate user ID from email slug, hash password with `passlib.context.CryptContext(schemes=["bcrypt"])`, create User with hashed_password, check email uniqueness (400 if duplicate), return AuthResponse. Implement `POST /api/auth/login`: find user by email (401 if not found), verify password with `pwd_context.verify()` (401 if mismatch), return AuthResponse. Use `AsyncSession` from `get_session` dependency. Use `select(User).where(User.email == ...)` for queries.
- [x] T010 [US2] Register auth router in backend/app/main.py. Import `from app.api.routes.auth import router as auth_router`. Add `app.include_router(auth_router)` after existing router registrations.
- [x] T011 [US2] Verify signup and login work via curl commands. Test: (1) POST /api/auth/signup creates user, (2) POST /api/auth/login with correct password returns 200, (3) POST /api/auth/login with wrong password returns 401, (4) POST /api/auth/signup with duplicate email returns 400.

**Checkpoint (US2 - Auth Verification)**:
```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"pass123\",\"name\":\"Test\"}"
# Login correct
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"pass123\"}"
# Login wrong -> 401
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"wrong\"}"
```

---

## Phase 4: User Story 3 - Dashboard Pages Accessible (Priority: P1)

**Goal**: Ensure `/dashboard`, `/chat`, `/tasks`, `/settings` routes render correctly (not 404).

**Independent Test**: Navigate to each URL in browser after logging in and verify page content renders.

### Implementation for User Story 3

- [x] T012 [US3] Clear Next.js build cache by deleting frontend/.next directory. Run: `cd frontend && rm -rf .next`
- [x] T013 [US3] Add auth API functions to frontend/lib/api.ts. Add `signupApi(email, password, name?)` function that POSTs to `${API_URL}/api/auth/signup` and returns AuthResponse. Add `loginApi(email, password)` function that POSTs to `${API_URL}/api/auth/login` and returns AuthResponse. Export both functions with proper TypeScript types matching the AuthResponse contract.
- [x] T014 [US3] Update frontend/hooks/useAuth.ts login function to accept and store token from server response. Modify `StoredUser` interface to include `token: string | null`. Update `login()` to accept `(userId, email, displayName?, token?)` and persist token in localStorage alongside existing fields.
- [x] T015 [P] [US3] Update frontend/app/(auth)/login/page.tsx to call backend login API. Replace client-side-only slug generation with `loginApi(email, password)` call. On success: call `login(response.user_id, response.email, response.name, response.token)` and redirect to `/dashboard`. On error: display server error message. Keep existing form UI.
- [x] T016 [P] [US3] Update frontend/app/(auth)/signup/page.tsx to call backend signup API. Replace client-side-only slug generation with `signupApi(email, password, name)` call. On success: call `login(response.user_id, response.email, response.name, response.token)` and redirect to `/dashboard`. On error: display server error message (including "Email already registered"). Keep existing form UI.
- [x] T017 [US3] Rebuild and verify frontend routes. Run `cd frontend && npm run dev`. Navigate to `/login`, sign up, then verify `/dashboard`, `/chat`, `/tasks`, `/settings` all render correctly with sidebar navigation.

**Checkpoint (US3 - Dashboard Pages)**:
```
Navigate to http://localhost:3000/signup -> Create account
Navigate to http://localhost:3000/dashboard -> Shows stats cards
Navigate to http://localhost:3000/chat -> Shows chat interface
Navigate to http://localhost:3000/tasks -> Shows task list
Navigate to http://localhost:3000/settings -> Shows preferences
All pages render with sidebar (not 404)
```

---

## Phase 5: User Story 4 - AI Chat via OpenAI Agents SDK (Priority: P2)

**Goal**: Migrate the AI agent from generic OpenAI client to the official OpenAI Agents SDK with Groq provider.

**Independent Test**: Send a chat message "Add a task: Buy groceries" via API and verify the agent creates a task in the database.

### Implementation for User Story 4

- [x] T018 [US4] Create agent-compatible tool wrapper functions in backend/app/agents/todo_agent.py. For each of the 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task), create a `@function_tool`-decorated wrapper function that: (1) imports the async tool implementation from `app.mcp.tools.*`, (2) creates an async session via `async_session_factory()`, (3) calls the underlying tool function, (4) returns the result as a JSON string. Each wrapper must have clear docstrings with Args descriptions (the SDK uses docstrings for schema generation). Import `function_tool` from `agents`.
- [x] T019 [US4] Rewrite backend/app/agents/todo_agent.py to use OpenAI Agents SDK. Replace `from openai import OpenAI` with `from agents import Agent, Runner, set_tracing_disabled` and `from agents.models import OpenAIChatCompletionsModel` and `from openai import AsyncOpenAI`. Call `set_tracing_disabled(True)`. Create `groq_client = AsyncOpenAI(base_url="https://api.groq.com/openai/v1", api_key=settings.GROQ_API_KEY)`. Create `groq_model = OpenAIChatCompletionsModel(model="llama-3.3-70b-versatile", openai_client=groq_client)`. Create `todo_agent = Agent(name="todo_assistant", instructions=AGENT_INSTRUCTIONS, model=groq_model, tools=[...wrapper tools...])`. Keep existing `AGENT_INSTRUCTIONS` string.
- [x] T020 [US4] Rewrite `run_agent()` function in backend/app/agents/todo_agent.py to use `Runner.run()`. Build messages list from conversation_history + new_message. Call `result = await Runner.run(todo_agent, messages)`. Extract `result.final_output` as response text. Collect tool call records from result if available. Return `(response_text, tool_call_records)` tuple matching existing function signature so `chat.py` route needs no changes.
- [x] T021 [US4] Verify agent works with Groq via chat endpoint. Start server, then: `curl -X POST http://localhost:8000/api/testuser/chat -H "Content-Type: application/json" -d "{\"message\":\"Add a task: Buy groceries\"}"`. Verify response includes AI confirmation and task appears in database.

**Checkpoint (US4 - Agents SDK)**:
```bash
# Create a user first (if not exists)
curl -X POST http://localhost:8000/api/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"agent@test.com\",\"password\":\"pass123\",\"name\":\"Agent Test\"}"
# Chat with agent
curl -X POST http://localhost:8000/api/agent-test/chat -H "Content-Type: application/json" -d "{\"message\":\"Add a task called Buy groceries\"}"
# List tasks to verify
curl http://localhost:8000/api/agent-test/tasks
```

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration verification and cleanup

- [x] T022 Full-stack integration smoke test. Start both backend and frontend. Sign up new user via frontend. Login. Verify dashboard loads with stats. Navigate to chat page and send a message. Navigate to tasks page and verify task list. Navigate to settings page.
- [x] T023 [P] Verify database persistence in Neon. Check Neon dashboard for `user`, `task`, `conversation`, `message` tables. Run `SELECT * FROM "user"` to see registered users. Confirm hashed_password column contains bcrypt hashes (format `$2b$...`).
- [x] T024 Run quickstart.md validation - follow all steps in specs/004-todo-ai-chatbot-fixes/quickstart.md and confirm each verification passes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Database/US1)**: Depends on Phase 1 - BLOCKS all subsequent phases
- **Phase 3 (Auth/US2)**: Depends on Phase 2 (needs working database to store users)
- **Phase 4 (Frontend/US3)**: Depends on Phase 3 (needs auth API for login/signup flow)
- **Phase 5 (Agent/US4)**: Depends on Phase 2 only (can run in parallel with Phase 3/4)
- **Phase 6 (Polish)**: Depends on Phases 3 and 4 (full-stack smoke test)

### User Story Dependencies

```
Phase 1 (Setup)
    │
    v
Phase 2 (US1: Database) ─── BLOCKS ALL ───┐
    │                                       │
    v                                       v
Phase 3 (US2: Auth)                   Phase 5 (US4: Agent SDK)
    │                                   [CAN RUN IN PARALLEL]
    v
Phase 4 (US3: Frontend)
    │
    v
Phase 6 (Polish)
```

- **US1 (Database)**: Must complete first - foundational
- **US2 (Auth)**: Depends on US1 (needs tables)
- **US3 (Frontend)**: Depends on US2 (needs auth API for login flow)
- **US4 (Agent SDK)**: Depends on US1 only (needs tables for MCP tools); **CAN run in parallel with US2/US3**

### Within Each User Story

- Config/setup tasks before implementation
- Backend changes before frontend changes
- Verification after implementation

### Parallel Opportunities

Within Phase 1:
- T002, T003, T004 can all run in parallel (different files)

Within Phase 4:
- T015 and T016 can run in parallel (login and signup are separate page files)

Cross-phase parallelism:
- Phase 5 (US4: Agent SDK) can start as soon as Phase 2 completes, running alongside Phases 3-4

---

## Parallel Example: Phase 1

```bash
# Launch all setup tasks in parallel (different files):
Task T002: "Add AUTH_SECRET to backend/app/core/config.py"
Task T003: "Add AUTH_SECRET to backend/.env"
Task T004: "Create frontend/.env.local"
```

## Parallel Example: Phase 4 + Phase 5

```bash
# After Phase 2 completes, run US3 frontend and US4 agent in parallel:
# Stream 1: Frontend auth integration
Task T013: "Add auth API functions to frontend/lib/api.ts"
Task T014: "Update useAuth.ts"
Task T015: "Update login page"
Task T016: "Update signup page"

# Stream 2 (parallel): Agent SDK migration
Task T018: "Create tool wrapper functions"
Task T019: "Rewrite agent to Agents SDK"
Task T020: "Rewrite run_agent()"
```

---

## Implementation Strategy

### MVP First (P1 Fixes Only: Phases 1-4)

1. Complete Phase 1: Setup (install deps, config env)
2. Complete Phase 2: Database fix (auto-create tables) - **US1 done**
3. Complete Phase 3: Auth fix (bcrypt signup/login) - **US2 done**
4. Complete Phase 4: Frontend fix (auth API + rebuild) - **US3 done**
5. **STOP and VALIDATE**: All 3 P1 bugs fixed. Deploy/demo if deadline pressure.

### Full Delivery (P1 + P2: All Phases)

1. Complete Phases 1-4 (MVP)
2. Complete Phase 5: Agent SDK migration - **US4 done**
3. Complete Phase 6: Full integration smoke test
4. All 4 user stories complete.

### Emergency Fallback (if running out of time)

If deadline pressure:
- Phase 5 (Agent SDK) can be **skipped entirely** - the generic OpenAI client already works with Groq
- Phase 4 T013-T016 (frontend auth API) can be **skipped** - client-side auth "works" for demo
- Minimum viable: Phases 1-2 + T009-T010 (backend auth endpoints only)

---

## Summary

| Metric | Count |
|--------|-------|
| Total tasks | 24 |
| Phase 1 (Setup) | 4 |
| Phase 2 (US1: Database) | 3 |
| Phase 3 (US2: Auth) | 4 |
| Phase 4 (US3: Frontend) | 6 |
| Phase 5 (US4: Agent SDK) | 4 |
| Phase 6 (Polish) | 3 |
| Parallelizable tasks [P] | 6 |
| MVP scope (P1 only) | 17 tasks (Phases 1-4) |
| Suggested first delivery | After Phase 2 checkpoint (tables working) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to user story for traceability
- All backend paths relative to `backend/` directory
- All frontend paths relative to `frontend/` directory
- Keep async driver (asyncpg) - do NOT switch to psycopg2 (see research.md)
- User.id remains `str` type - do NOT change to `int` (see research.md)
- Commit after each phase checkpoint
