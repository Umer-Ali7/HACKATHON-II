# Research: Hackathon Todo Technical Decisions

**Feature**: 001-multi-user-todo-app
**Date**: 2026-01-06
**Purpose**: Document technical decisions and patterns for implementation

## 1. Better Auth Integration with Next.js 16 App Router

### Decision
Use Better Auth v1.0+ with Next.js 16 App Router, implementing email/password authentication with JWT token generation.

### Rationale
- Better Auth is specifically designed for Next.js App Router (unlike NextAuth v4 which targets Pages Router)
- Native support for JWT token generation and verification
- Built-in Neon PostgreSQL adapter available
- Simpler configuration than custom auth implementation
- Active development and App Router-first design

### Implementation Pattern
```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "@neondatabase/serverless";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  jwt: {
    enabled: true,
    secret: process.env.BETTER_AUTH_SECRET,
  },
});
```

### Session Storage Decision
**Decision**: Use httpOnly cookies for JWT storage (NOT localStorage)

**Rationale**:
- HttpOnly cookies prevent XSS attacks (JavaScript cannot access token)
- Better Auth handles cookie management automatically
- Cookies sent automatically with requests (simpler than manual headers)
- Constitution security standards require secure token storage

**Alternative Considered**: localStorage
**Rejected Because**: Vulnerable to XSS attacks, requires manual token refresh logic

### Better Auth + Neon PostgreSQL
Better Auth includes built-in Neon adapter using `@neondatabase/serverless`:
- Automatic user table creation
- Connection pooling handled by Neon driver
- SSL enabled by default with Neon connections

## 2. JWT Verification in FastAPI

### Decision
Use PyJWT library with custom FastAPI dependency for JWT verification.

### Rationale
- PyJWT is the standard Python library for JWT operations
- FastAPI dependency injection cleanly handles verification
- Raises HTTPException automatically for invalid tokens
- Supports HS256 algorithm (same as Better Auth default)

### Implementation Pattern
```python
# app/middleware/auth.py
from fastapi import Depends, HTTPException, Header
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

async def verify_jwt(authorization: str = Header(...)) -> dict:
    """Extract and verify JWT token from Authorization header"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.replace("Bearer ", "")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_user_id(token_data: dict = Depends(verify_jwt)) -> str:
    """Extract user ID from verified JWT payload"""
    user_id = token_data.get("sub")  # Better Auth uses 'sub' claim
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing user ID")
    return user_id
```

### JWT Secret Sharing
**Critical Requirement**: `BETTER_AUTH_SECRET` must be identical in both services:
- Frontend `.env.local`: `BETTER_AUTH_SECRET=<min-32-char-secret>`
- Backend `.env`: `BETTER_AUTH_SECRET=<same-value>`

**Generation**: Use cryptographically secure random string:
```bash
openssl rand -base64 32
```

### Token Expiration Strategy
- Access token: 7 days (Better Auth session.expiresIn)
- No refresh token for Phase II (simplicity)
- User must re-login after expiration

**Alternative Considered**: Refresh token pattern
**Rejected Because**: Adds complexity, not required for Phase II scope

## 3. SQLModel with Neon Serverless PostgreSQL

### Decision
Use SQLModel for ORM with Neon Serverless PostgreSQL, Alembic for migrations.

### Rationale
- SQLModel combines SQLAlchemy + Pydantic (constitution type safety requirement)
- Neon Serverless provides automatic scaling and connection pooling
- Alembic is industry standard for Python database migrations
- SQLModel models serve as both ORM and Pydantic validation

### Neon Connection String Format
```python
# app/config.py
DATABASE_URL = "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

**SSL Mode**: REQUIRED by Neon (sslmode=require parameter)

### SQLModel Connection Pooling
```python
# app/db.py
from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy.pool import NullPool
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# Neon handles connection pooling, use NullPool to avoid client-side pooling
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set True for SQL logging during development
    poolclass=NullPool,  # Neon manages pooling
)

def get_session():
    """Dependency for FastAPI endpoints"""
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """Initialize database tables"""
    SQLModel.metadata.create_all(engine)
```

### Alembic Migrations with SQLModel
```python
# alembic/env.py
from sqlmodel import SQLModel
from app.models.task import Task  # Import all models

target_metadata = SQLModel.metadata
```

### Index Creation Pattern
```python
# app/models/task.py
from sqlmodel import Field, SQLModel, Index

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)  # Index for filtering
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)  # Index for status filter
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    __table_args__ = (
        Index("idx_user_completed", "user_id", "completed"),  # Composite index
    )
```

## 4. User Isolation Patterns in FastAPI

### Decision
Extract user_id from JWT in dependency, filter all queries explicitly by user_id.

### Rationale
- Dependency injection provides user_id to all endpoints
- Explicit filtering prevents accidental data leakage
- Constitution requirement: all queries must filter by authenticated user
- Fail-safe: even if URL manipulation attempted, query filters by JWT user

### Pattern: Dependency Injection (NOT Path Parameters)

**Decision**: Use dependency injection for user_id verification

**Implementation**:
```python
# app/routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.middleware.auth import get_current_user_id
from app.db import get_session
from app.models.task import Task

router = APIRouter()

@router.get("/api/tasks")
async def list_tasks(
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
    status: str | None = None,
):
    """List all tasks for authenticated user"""
    query = select(Task).where(Task.user_id == user_id)

    if status == "completed":
        query = query.where(Task.completed == True)
    elif status == "pending":
        query = query.where(Task.completed == False)

    tasks = session.exec(query.order_by(Task.created_at.desc())).all()
    return tasks

@router.get("/api/tasks/{task_id}")
async def get_task(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session),
):
    """Get single task, verify ownership"""
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Authorization check: task belongs to authenticated user
    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this task")

    return task
```

**Alternative Considered**: Path parameters `/api/{user_id}/tasks`
**Rejected Because**:
- User could manipulate URL to access other users' data
- Requires redundant verification (URL user_id vs JWT user_id)
- Violates principle of least privilege

### Query Filtering Pattern
**Mandatory**: All queries MUST include `.where(Task.user_id == user_id)`
- Create: Set task.user_id = user_id before insert
- Read: Filter by user_id in WHERE clause
- Update: Verify task.user_id == user_id before update
- Delete: Verify task.user_id == user_id before delete

### Error Handling
- 401 Unauthorized: Invalid/missing JWT token
- 403 Forbidden: Valid token but task belongs to different user
- 404 Not Found: Task doesn't exist OR not owned by user (don't leak existence)

## 5. Next.js App Router Server/Client Component Patterns

### Decision
Use server components for initial page loads, client components for interactivity.

### Rationale
- Server components enable faster initial page load (constitution <2s requirement)
- Client components needed for state management (filters, forms)
- Reduces JavaScript bundle size sent to browser
- Better SEO and performance with server rendering

### Pattern: Tasks Page Architecture

**Server Component** (`app/tasks/page.tsx`):
```typescript
// Server Component - handles initial data fetch
import { TaskList } from '@/components/TaskList';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function TasksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  // Fetch initial tasks on server
  const initialTasks = await fetchTasks(session.token);

  return <TaskList initialTasks={initialTasks} />;
}
```

**Client Component** (`components/TaskList.tsx`):
```typescript
'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Client-side filtering and interactions
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      {filteredTasks.map(task => <TaskItem key={task.id} task={task} />)}
    </div>
  );
}
```

### Data Passing Pattern
- Server component fetches initial data
- Pass as props to client component
- Client component manages state changes
- Use React Query or SWR for subsequent fetches (optional)

### Loading and Error Boundaries
```typescript
// app/tasks/loading.tsx
export default function Loading() {
  return <div>Loading tasks...</div>;
}

// app/tasks/error.tsx
'use client';

export default function Error({ error }: { error: Error }) {
  return <div>Error loading tasks: {error.message}</div>;
}
```

## 6. CORS Configuration for FastAPI + Next.js

### Decision
Use FastAPI CORSMiddleware with specific frontend origin, credentials enabled.

### Rationale
- CORS required for browser to allow API calls from different origin
- Constitution requires specific domain (NOT wildcard *)
- Credentials needed for httpOnly cookie transmission
- Different configuration for development vs production

### Implementation Pattern
```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],  # Specific origin, NOT ["*"]
    allow_credentials=True,  # Required for httpOnly cookies
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],  # Allow all headers (includes Authorization)
)
```

### Environment Variables
**Development**:
- Frontend: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Backend: `FRONTEND_URL=http://localhost:3000`

**Production**:
- Frontend: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
- Backend: `FRONTEND_URL=https://yourdomain.vercel.app`

### Credentials Handling
When using httpOnly cookies with CORS:
- Backend: `allow_credentials=True`
- Frontend fetch: `credentials: 'include'`

```typescript
// lib/api.ts
export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',  // Send cookies with request
  });
  return response.json();
}
```

---

## Summary of Key Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Auth Library | Better Auth v1.0+ | App Router native, JWT built-in, Neon adapter |
| Token Storage | httpOnly cookies | XSS protection, auto-send, secure |
| JWT Library | PyJWT (python-jose) | Standard Python JWT, FastAPI compatible |
| ORM | SQLModel | Combines SQLAlchemy + Pydantic, type safe |
| Database | Neon Serverless PostgreSQL | Auto-scaling, built-in pooling, SSL default |
| Migrations | Alembic | Industry standard, SQLModel compatible |
| User Isolation | JWT dependency injection | Secure, prevents URL manipulation |
| Component Pattern | Server + Client components | Performance, SEO, interactivity balance |
| CORS | Specific origin + credentials | Security (no wildcard), cookie support |

All decisions align with constitution requirements and support the performance, security, and type safety goals.
