# Implementation Plan: Todo AI Chatbot - Critical Fixes

**Branch**: `004-todo-ai-chatbot-fixes` | **Date**: 2026-02-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/004-todo-ai-chatbot-fixes/spec.md`

## Summary

Fix three critical blocking bugs (database not persisting, password verification bypassed, frontend 404 errors) and migrate the AI agent from the generic OpenAI client to the official OpenAI Agents SDK with Groq as the inference provider. The existing codebase is a FastAPI + Next.js application with async PostgreSQL (Neon), where the async driver (`asyncpg`) works but tables aren't being auto-created, auth has no password hashing, and the agent uses raw `openai.OpenAI` instead of `agents.Agent`.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript 5 (frontend)
**Primary Dependencies**: FastAPI, SQLModel, SQLAlchemy (async), OpenAI Agents SDK (`openai-agents`), passlib[bcrypt], Next.js 16, React 19
**Storage**: Neon Serverless PostgreSQL via `asyncpg` (keeping async driver - see research.md)
**Testing**: Manual curl tests for API, browser verification for frontend routes
**Target Platform**: Local development (Windows), deployment to Railway/Vercel
**Project Type**: Web application (backend + frontend monorepo)
**Performance Goals**: < 2s AI response, < 500ms TTFB, < 100ms DB queries
**Constraints**: 10 PM deadline, must fix 3 P1 bugs before P2 agent migration
**Scale/Scope**: Single developer, ~15 files modified

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Stateless Architecture | PASS | No server-side session state; conversation history stored in PostgreSQL |
| II. MCP-First Design | PASS | All task operations exposed as MCP tools; agent uses tools for data access |
| III. Modern Developer Experience | PASS | Environment-based config, structured logging, Pydantic validation |
| IV. Production Quality | DEVIATION | Using passlib bcrypt instead of Better Auth (acceptable: foundation for future Better Auth integration) |
| V. Type Safety & Validation | PASS | TypeScript strict mode, Python type hints, Pydantic models |
| VI. Security by Default | PASS | bcrypt hashing, user_id isolation, no raw SQL, secrets in .env |
| VII. UI/UX Excellence | PASS | Existing dashboard pages use sidebar layout, theme support |

**Deviation Justification**: Better Auth integration requires significant setup. This fix establishes proper bcrypt password hashing as a secure foundation. Better Auth can be layered on top in a future iteration without data migration (bcrypt hashes are compatible).

## Project Structure

### Documentation (this feature)

```text
specs/004-todo-ai-chatbot-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output - technical research
├── data-model.md        # Phase 1 output - data model changes
├── quickstart.md        # Phase 1 output - developer setup
├── contracts/           # Phase 1 output - API contracts
│   └── auth-api.yaml    # New auth endpoints
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py                    # MODIFY: add lifespan, auth router
│   ├── core/
│   │   ├── config.py              # MODIFY: add AUTH_SECRET field
│   │   └── database.py            # MODIFY: add create_db_and_tables()
│   ├── models/
│   │   ├── __init__.py            # NO CHANGE
│   │   ├── user.py                # MODIFY: add password_hash field alias
│   │   ├── task.py                # NO CHANGE
│   │   ├── conversation.py        # NO CHANGE
│   │   └── message.py             # NO CHANGE
│   ├── api/
│   │   ├── schemas.py             # MODIFY: add auth request/response schemas
│   │   └── routes/
│   │       ├── auth.py            # CREATE: signup + login endpoints
│   │       ├── chat.py            # NO CHANGE
│   │       ├── tasks.py           # NO CHANGE
│   │       ├── profile.py         # NO CHANGE
│   │       ├── conversations.py   # NO CHANGE
│   │       └── stats.py           # NO CHANGE
│   ├── agents/
│   │   └── todo_agent.py          # MODIFY: migrate to OpenAI Agents SDK
│   └── mcp/
│       ├── server.py              # NO CHANGE
│       └── tools/                 # MODIFY: adapt tools for Agents SDK
│           ├── __init__.py        # NO CHANGE
│           ├── add_task.py        # MODIFY: wrap with @function_tool
│           ├── list_tasks.py      # MODIFY: wrap with @function_tool
│           ├── complete_task.py   # MODIFY: wrap with @function_tool
│           ├── delete_task.py     # MODIFY: wrap with @function_tool
│           └── update_task.py     # MODIFY: wrap with @function_tool
├── .env                           # MODIFY: add AUTH_SECRET
└── pyproject.toml                 # NO CHANGE (deps already present)

frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx         # MODIFY: call backend auth API
│   │   └── signup/page.tsx        # MODIFY: call backend auth API
│   ├── (dashboard)/
│   │   ├── layout.tsx             # NO CHANGE (already exists)
│   │   ├── dashboard/page.tsx     # NO CHANGE (already exists)
│   │   ├── chat/page.tsx          # NO CHANGE (already exists)
│   │   ├── tasks/page.tsx         # NO CHANGE (already exists)
│   │   └── settings/page.tsx      # NO CHANGE (already exists)
│   └── layout.tsx                 # NO CHANGE
├── lib/
│   └── api.ts                     # MODIFY: add auth API functions
└── hooks/
    └── useAuth.ts                 # MODIFY: call backend signup/login
```

**Structure Decision**: Web application with separate backend/ and frontend/ directories. This matches the existing monorepo structure established in phase-3.

## Complexity Tracking

| Deviation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| passlib bcrypt instead of Better Auth | Emergency fix needs working auth immediately | Better Auth requires OAuth provider setup, session management, and frontend SDK integration - too complex for deadline |
| Keep async driver (asyncpg) | All existing code (5 route files, 5 MCP tools, agent) uses AsyncSession | Switching to sync (psycopg2) would require rewriting every database-touching file - scope explosion |
| OpenAI Agents SDK `OpenAIChatCompletionsModel` | Groq doesn't support OpenAI Responses API | Direct `Agent(model="...")` won't work with Groq; need explicit client wrapper |

---

## Phase 1: Database Fix (Priority: P1-Critical)

### Problem Analysis

The current `database.py` creates an async engine and session factory but **never calls `SQLModel.metadata.create_all()`** during startup. The `main.py` has no lifespan handler. Tables only exist if manually created via Alembic (which isn't configured).

### Root Cause
- `app/main.py:25` - FastAPI app created without `lifespan` parameter
- `app/core/database.py` - No `create_db_and_tables()` function exists
- `.env:1` - Uses `postgresql+asyncpg://` which IS correct for the async codebase (NOT the problem the user assumed)

### Solution

1. **Add `create_db_and_tables()` to `database.py`** using async engine:
   ```python
   from sqlmodel import SQLModel

   async def create_db_and_tables():
       async with engine.begin() as conn:
           await conn.run_sync(SQLModel.metadata.create_all)
   ```

2. **Add lifespan handler to `main.py`**:
   ```python
   from contextlib import asynccontextmanager

   @asynccontextmanager
   async def lifespan(app: FastAPI):
       await create_db_and_tables()
       yield

   app = FastAPI(title="Todo AI Chatbot", version="1.0.0", lifespan=lifespan)
   ```

3. **Keep the async driver** (`asyncpg`) - the entire codebase is async. Switching to sync `psycopg2` would require rewriting every route and MCP tool.

4. **Fix `.env` SSL parameter**: Change `?ssl=require` to `?ssl=require` with proper asyncpg SSL handling (asyncpg uses `ssl=require`, not `sslmode=require`).

### Files Modified
- `backend/app/core/database.py` - Add `create_db_and_tables()` async function
- `backend/app/main.py` - Add lifespan handler calling `create_db_and_tables()`

### Verification
```bash
# Start server - should see "Creating database tables..." in logs
uvicorn app.main:app --reload

# Check health
curl http://localhost:8000/health
# Expected: {"status":"ok"}
```

---

## Phase 2: Auth Fix (Priority: P1-Critical)

### Problem Analysis

The current system has **no backend auth endpoints**. The frontend login/signup pages (`frontend/app/(auth)/login/page.tsx:37`, `frontend/app/(auth)/signup/page.tsx:42`) use a client-side-only approach:
- Extract userId from email prefix (e.g., `user@test.com` -> `user`)
- Store in localStorage via Zustand
- No password verification at all

The User model already has a `hashed_password` field (`backend/app/models/user.py:14`) but nothing writes to it.

### Root Cause
- No `app/api/routes/auth.py` exists
- Frontend calls `login(userId, email)` without any backend round-trip
- No password hashing library integrated (passlib is not imported anywhere)

### Solution

1. **Create `app/api/routes/auth.py`** with:
   - `POST /api/auth/signup` - Hash password with bcrypt, create User, return user data + temp token
   - `POST /api/auth/login` - Find user by email, verify bcrypt hash, return user data + temp token

2. **Add auth schemas to `app/api/schemas.py`**:
   - `SignupRequest(email, password, name)`
   - `LoginRequest(email, password)`
   - `AuthResponse(user_id, email, name, token)`

3. **Register auth router in `main.py`**:
   ```python
   from app.api.routes.auth import router as auth_router
   app.include_router(auth_router)
   ```

4. **Update frontend `lib/api.ts`** with `signup()` and `loginApi()` functions

5. **Update frontend auth pages** to call backend API instead of client-side-only auth

6. **Update `useAuth.ts`** to store the server-assigned userId (not email-derived slug)

### Files Created
- `backend/app/api/routes/auth.py` - Signup + Login endpoints

### Files Modified
- `backend/app/api/schemas.py` - Add auth schemas
- `backend/app/main.py` - Register auth router
- `backend/app/core/config.py` - Add AUTH_SECRET setting
- `frontend/lib/api.ts` - Add signup/login API calls
- `frontend/app/(auth)/login/page.tsx` - Call backend login API
- `frontend/app/(auth)/signup/page.tsx` - Call backend signup API
- `frontend/hooks/useAuth.ts` - Store server token + userId

### Verification
```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Test"}'
# Expected: {"user_id":"...","email":"test@test.com","name":"Test","token":"temp_token_..."}

# Login (correct password)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
# Expected: 200 with user data

# Login (wrong password)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
# Expected: 401 {"detail":"Invalid email or password"}
```

---

## Phase 3: Frontend 404 Fix (Priority: P1-Critical)

### Problem Analysis

After codebase exploration, **all dashboard page files already exist**:
- `frontend/app/(dashboard)/layout.tsx` - EXISTS
- `frontend/app/(dashboard)/dashboard/page.tsx` - EXISTS
- `frontend/app/(dashboard)/chat/page.tsx` - EXISTS
- `frontend/app/(dashboard)/tasks/page.tsx` - EXISTS
- `frontend/app/(dashboard)/settings/page.tsx` - EXISTS

### Likely Root Cause

The 404 issue is most likely caused by one of:
1. **Next.js build cache corruption** - `.next/` directory has stale build artifacts
2. **The `useAuth(true)` guard** in `(dashboard)/layout.tsx:11` - If localStorage is empty (no user stored), the layout redirects to `/login` before the page renders, which may appear as a 404 to the user
3. **Missing `.env.local`** - The frontend has no `NEXT_PUBLIC_API_URL` configured, causing API calls to fail silently

### Solution

1. **Clear Next.js cache and rebuild**:
   ```bash
   cd frontend
   rm -rf .next
   npm run build
   ```

2. **Create `frontend/.env.local`**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Verify the auth guard behavior**: The `useAuth(true)` redirects to `/login` when not authenticated. This is correct behavior but may be perceived as "404" by users who aren't logged in. After fixing auth (Phase 2), users will be able to log in and access dashboard pages normally.

4. **If pages still 404 after rebuild**: Check `next.config.ts` for any rewrites or redirects that might interfere.

### Files Created
- `frontend/.env.local` - API URL environment variable

### Files Modified
- None (pages already exist)

### Verification
```bash
cd frontend
rm -rf .next
npm run dev

# Navigate to:
# http://localhost:3000/login -> Should show login form
# http://localhost:3000/signup -> Should show signup form
# After logging in:
# http://localhost:3000/dashboard -> Should show stats
# http://localhost:3000/chat -> Should show chat interface
# http://localhost:3000/tasks -> Should show task list
# http://localhost:3000/settings -> Should show settings
```

---

## Phase 4: OpenAI Agents SDK Migration (Priority: P2)

### Problem Analysis

The current agent (`backend/app/agents/todo_agent.py`) uses:
```python
from openai import OpenAI  # Generic client
client = OpenAI(api_key=..., base_url="https://api.groq.com/openai/v1")
```

The spec requires the official OpenAI Agents SDK:
```python
from agents import Agent, Runner  # Agents SDK
from agents.models import OpenAIChatCompletionsModel
```

### Key Discovery (from research)

The OpenAI Agents SDK:
- Uses `from agents import Agent, Runner, function_tool` (NOT `from openai_agents`)
- For Groq (non-OpenAI provider), use `OpenAIChatCompletionsModel` with `AsyncOpenAI` client
- Must disable tracing when no OpenAI API key: `from agents import set_tracing_disabled; set_tracing_disabled(True)`
- Tools use `@function_tool` decorator (NOT `@tool`)
- Runner.run() is async: `result = await Runner.run(agent, messages)`

### Solution

1. **Rewrite `todo_agent.py`** to use Agents SDK:
   ```python
   from agents import Agent, Runner, function_tool, set_tracing_disabled
   from agents.models import OpenAIChatCompletionsModel
   from openai import AsyncOpenAI

   set_tracing_disabled(True)  # No OpenAI key, using Groq

   groq_client = AsyncOpenAI(
       base_url="https://api.groq.com/openai/v1",
       api_key=settings.GROQ_API_KEY,
   )

   groq_model = OpenAIChatCompletionsModel(
       model="llama-3.3-70b-versatile",
       openai_client=groq_client,
   )

   todo_agent = Agent(
       name="todo_assistant",
       instructions=AGENT_INSTRUCTIONS,
       model=groq_model,
       tools=[add_task_tool, list_tasks_tool, ...],
   )
   ```

2. **Wrap MCP tools with `@function_tool`**: Each tool in `app/mcp/tools/` needs to be wrapped as an Agents SDK function tool. The tools must be sync-compatible or adapted for the Runner's execution model.

3. **Update `run_agent()` function** to use `Runner.run()`:
   ```python
   async def run_agent(user_id, conversation_history, new_message):
       result = await Runner.run(todo_agent, messages=[...])
       return result.final_output, []
   ```

4. **Keep existing MCP tool implementations** as internal functions; wrap with `@function_tool` for agent registration.

### Files Modified
- `backend/app/agents/todo_agent.py` - Full rewrite to Agents SDK
- `backend/app/mcp/tools/*.py` - Add `@function_tool` wrapper functions

### Verification
```bash
# Start server
uvicorn app.main:app --reload

# Send chat message
curl -X POST http://localhost:8000/api/testuser/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Add a task: Buy groceries"}'
# Expected: AI response confirming task creation
```

---

## Phase 5: Integration Testing

### Full Stack Smoke Test

1. **Backend health**: `GET /health` returns 200
2. **Signup flow**: `POST /api/auth/signup` creates user with bcrypt hash
3. **Login flow**: Correct password -> 200, wrong password -> 401
4. **Dashboard pages**: All 4 routes return 200 (not 404)
5. **Chat with agent**: Natural language task creation works
6. **Database persistence**: Records visible in Neon dashboard

### Emergency Shortcuts (if time-constrained)

| Skip | Why Safe |
|------|----------|
| OpenAI Agents SDK migration | Generic OpenAI client already works with Groq; SDK migration is a code quality improvement, not a bug fix |
| Frontend auth API integration | Client-side auth "works" for demo; backend auth is the real fix |
| Alembic migrations | Auto-create tables is sufficient for development |

### Must-Have Checklist

- [ ] Database tables auto-created on startup
- [ ] Signup creates bcrypt-hashed password
- [ ] Login rejects wrong passwords (401)
- [ ] Dashboard pages accessible (not 404)
- [ ] Backend /health returns ok

---

## Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| asyncpg SSL connection fails | Medium | High | Fall back to `?ssl=require` parameter; test with Neon dashboard |
| OpenAI Agents SDK incompatible with Groq | Medium | Medium | Keep generic OpenAI client as fallback; SDK migration is P2 |
| Frontend build cache persists 404 | Low | Medium | Delete `.next/` and `node_modules/.cache/` |
| passlib bcrypt fails on Windows | Low | High | Use `bcrypt` package directly as alternative |
| Groq rate limits during testing | Low | Low | Exponential backoff already implemented in agent |
