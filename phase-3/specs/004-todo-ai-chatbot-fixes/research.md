# Research: Todo AI Chatbot - Critical Fixes

**Branch**: `004-todo-ai-chatbot-fixes` | **Date**: 2026-02-07

## Research Task 1: Async vs Sync Database Driver

### Question
Should we switch from `asyncpg` to `psycopg2` (sync) as the user's spec suggests?

### Decision: Keep asyncpg (async driver)

### Rationale
The entire existing codebase is async:
- `database.py` uses `AsyncSession`, `create_async_engine`
- All 5 route files (`chat.py`, `tasks.py`, `profile.py`, `conversations.py`, `stats.py`) use `async def` with `AsyncSession = Depends(get_session)`
- All 5 MCP tools (`add_task.py`, `list_tasks.py`, etc.) are `async def` with `AsyncSession` parameter
- `todo_agent.py` uses `async with async_session_factory()`

Switching to sync `psycopg2` would require rewriting **every database-touching function** across ~12 files. This is a scope explosion for an emergency fix.

### Alternatives Considered
1. **Switch to psycopg2 (sync)**: Rejected - requires rewriting 12+ files
2. **Keep asyncpg**: Selected - zero code changes to existing working async code
3. **Use both drivers**: Rejected - unnecessary complexity

### Key Insight
The database insertion issue is **NOT caused by the driver**. It's caused by missing `SQLModel.metadata.create_all()` at startup. Tables don't exist, so inserts fail.

---

## Research Task 2: OpenAI Agents SDK Integration with Groq

### Question
How to use the OpenAI Agents SDK with Groq as the inference provider?

### Decision: Use `OpenAIChatCompletionsModel` with `AsyncOpenAI` client

### Rationale
The OpenAI Agents SDK (package: `openai-agents`) defaults to OpenAI's Responses API, which Groq doesn't support. For OpenAI-compatible providers, the SDK provides `OpenAIChatCompletionsModel` which uses the standard Chat Completions API.

### Correct Import Path
```python
from agents import Agent, Runner, function_tool, set_tracing_disabled
from agents.models import OpenAIChatCompletionsModel
from openai import AsyncOpenAI
```

**Important**: The package installs as `openai-agents` but imports as `agents` (NOT `openai_agents`).

### Groq Configuration
```python
set_tracing_disabled(True)  # Required: no OpenAI API key available

groq_client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key="gsk_..."
)

model = OpenAIChatCompletionsModel(
    model="llama-3.3-70b-versatile",
    openai_client=groq_client
)
```

### Tool Registration
```python
@function_tool
def add_task(user_id: str, title: str, description: str = "") -> str:
    """Add a new task for the user."""
    # Implementation
    return json.dumps({"task_id": 1, "status": "created"})

agent = Agent(
    name="todo_assistant",
    model=model,
    tools=[add_task, list_tasks, ...]
)
```

### Alternatives Considered
1. **LiteLLM provider**: `pip install openai-agents[litellm]` then `model="litellm/groq/llama-3.3-70b-versatile"` - More dependencies but simpler
2. **OpenAIChatCompletionsModel**: Selected - Direct, minimal dependencies, full control
3. **Keep generic OpenAI client**: Fallback option if SDK migration encounters issues

---

## Research Task 3: Password Hashing on Windows

### Question
Which bcrypt implementation works reliably on Windows?

### Decision: Use `passlib[bcrypt]`

### Rationale
- `passlib` is already in `pyproject.toml` dependencies (`psycopg2-binary` is there, passlib was specified by user)
- `passlib.context.CryptContext` provides a clean API: `hash()` and `verify()`
- Works on Windows without C compiler requirements (uses `bcrypt` pure-Python fallback)

### Implementation
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

### Alternatives Considered
1. **`bcrypt` package directly**: Works but lower-level API
2. **`argon2-cffi`**: Better algorithm but requires C compiler on Windows
3. **`passlib[bcrypt]`**: Selected - high-level API, Windows-compatible

---

## Research Task 4: Frontend 404 Root Cause

### Question
Why do `/dashboard`, `/chat`, `/tasks`, `/settings` return 404?

### Decision: Pages exist; issue is likely auth guard or build cache

### Findings
All page files exist at the correct Next.js App Router paths:
- `frontend/app/(dashboard)/layout.tsx` - EXISTS (27 lines)
- `frontend/app/(dashboard)/dashboard/page.tsx` - EXISTS
- `frontend/app/(dashboard)/chat/page.tsx` - EXISTS
- `frontend/app/(dashboard)/tasks/page.tsx` - EXISTS
- `frontend/app/(dashboard)/settings/page.tsx` - EXISTS

The `(dashboard)/layout.tsx` uses `useAuth(true)` which redirects to `/login` when no user is in localStorage. This redirect may be perceived as a "404" by the user.

### Most Likely Causes (ordered by probability)
1. **Auth guard redirect**: User is not "logged in" (no localStorage data), so they get redirected to `/login`. This isn't a 404 but looks like one.
2. **Build cache**: `.next/` may have stale artifacts from before pages were created
3. **Missing `.env.local`**: No `NEXT_PUBLIC_API_URL` causes silent API failures

### Fix
1. Clear `.next/` build cache
2. Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Fix auth (Phase 2) so users can actually log in and access dashboard
4. If still 404, investigate `next.config.ts` for conflicting rewrites

---

## Research Task 5: User Model ID Strategy

### Question
The existing User model uses `id: str` (string primary key) while the spec suggests `user_id: int`. Which to use?

### Decision: Keep `id: str` (string primary key)

### Rationale
The entire codebase (all routes, MCP tools, frontend API client, agent) uses string user_id:
- Routes: `POST /api/{user_id}/chat`, `GET /api/{user_id}/tasks`, etc.
- MCP tools: `user_id: str` parameter on all 5 tools
- Frontend: `userId: string` in useAuth, api.ts
- Agent: `user_id: str` in tool definitions

Changing to `int` would require modifying every file. Instead, generate a UUID string or use email-derived slug as the User.id.

### Impact on Auth
- Signup: Generate `id` as UUID or email-derived slug
- Login response: Return the string `id` as `user_id`
- Frontend: Store server-provided `userId` (no client-side slug generation)
