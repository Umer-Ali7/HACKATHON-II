---
name: speckit-plus-phase2
description: Phase II Full-Stack Development using SpecKit Plus commands (sp.constitution, sp.specify, sp.plan, sp.tasks, sp.implement). Use when building Phase II of Hackathon Todo with Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, and Better Auth. Enforces the SpecKit Plus workflow where the first 3 commands require detailed prompts.
---

# SpecKit Plus Phase II Development

This skill guides you through Phase II of the Hackathon Todo Evolution project using the **SpecKit Plus** workflow with its 5 core commands.

## ⚡ Quick Start Checklist

Before starting, ensure:
- [ ] SpecKit Plus installed: `pip install specifyplus` or `uv tool install specifyplus`
- [ ] Project initialized: `sp init hackathon-todo`
- [ ] Claude Code running in project directory
- [ ] Slash commands available: `/sp.constitution`, `/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.implement`

## 🎯 Phase II Requirements

**Goal**: Build a multi-user full-stack web application with:
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens

**Core Features** (Basic Level):
1. Add Task – Create new todo items
2. Delete Task – Remove tasks
3. Update Task – Modify task details
4. View Task List – Display all tasks
5. Mark as Complete – Toggle completion status
6. **Multi-user support** – User signup/signin with Better Auth
7. **RESTful API** – All CRUD operations via API
8. **User isolation** – Each user sees only their tasks

## 📋 The SpecKit Plus Workflow

SpecKit Plus uses **5 commands** in strict order. The first 3 require detailed prompts:

```
1. /sp.constitution  [PROMPT REQUIRED] → Project principles
2. /sp.specify       [PROMPT REQUIRED] → What to build
3. /sp.plan          [PROMPT REQUIRED] → How to build (tech stack)
4. /sp.tasks         [AUTO] → Break into tasks
5. /sp.implement     [AUTO] → Build it
```

## 🏛️ STEP 1: Constitution (Project Principles)

**Command**: `/sp.constitution`

**What it does**: Creates `.specify/memory/constitution.md` with your project's governing principles that guide all development decisions.

**Prompt Template**:
```
/sp.constitution

Create constitution for Hackathon Todo Phase II with these principles:

ARCHITECTURE PRINCIPLES:
- Separation of Concerns: Frontend (Next.js) and backend (FastAPI) are independent services
- API-First Design: Backend exposes RESTful API, frontend consumes it
- Stateless Authentication: JWT tokens, no server-side sessions
- Type Safety: TypeScript in frontend, Pydantic models in backend
- Database as Single Source of Truth: All state persists to Neon PostgreSQL

TECHNOLOGY CONSTRAINTS:
- Python 3.13+ with uv for backend dependency management
- Next.js 16+ App Router (NOT Pages Router)
- SQLModel for ORM (NOT raw SQL or other ORMs)
- Better Auth for authentication (NOT NextAuth or custom)
- Neon Serverless PostgreSQL (NOT local Postgres)
- FastAPI for REST API (NOT Flask or Django)

CODE STANDARDS:
- No manual code until specs are validated
- All API endpoints MUST filter by authenticated user_id
- All database queries MUST use SQLModel
- All components MUST use TypeScript with proper types
- All API responses MUST use Pydantic models for validation
- Error handling with proper HTTP status codes

SECURITY RULES:
- All API endpoints require JWT authentication
- User data isolation (users can only see their own tasks)
- JWT secret must match between frontend and backend
- Environment variables for all secrets (never hardcoded)
- CORS configured to allow frontend domain only

PERFORMANCE REQUIREMENTS:
- API response time < 200ms for CRUD operations
- Frontend initial load < 2 seconds
- Database queries must use proper indexes
- Use database connection pooling

TESTING STANDARDS:
- Unit tests for all business logic
- Integration tests for API endpoints
- Test user isolation thoroughly
- Test authentication flow end-to-end
```

**Expected Output**: File `.specify/memory/constitution.md` created with project principles.

## 📝 STEP 2: Specify (What to Build)

**Command**: `/sp.specify`

**What it does**: Creates `specs/001-todo-fullstack/spec.md` with functional requirements and user stories.

**Important**: Focus on WHAT and WHY, NOT the tech stack (that comes in Step 3).

**Prompt Template**:
```
/sp.specify

Build a multi-user Todo web application called "Hackathon Todo" with the following requirements:

USER MANAGEMENT:
- Users can sign up with email and password
- Users can sign in with email and password
- Passwords must be at least 8 characters
- Each user has a unique account
- No email verification required (for Phase II)

TASK MANAGEMENT (per user):
- Users can create a new task with:
  * Title (required, max 200 characters)
  * Description (optional, max 1000 characters)
  * Status (defaults to incomplete)
  * Created timestamp (auto-generated)
  * Updated timestamp (auto-generated)

- Users can view all their tasks:
  * Display title, description, status, and created date
  * Filter by status (all/pending/completed)
  * Sort by creation date (newest first)
  * Only show tasks belonging to logged-in user

- Users can update a task:
  * Modify title and/or description
  * Cannot change task owner
  * Cannot change created timestamp
  * Updated timestamp auto-updates

- Users can delete a task:
  * Permanently removes from database
  * Confirmation required before deletion
  * Only task owner can delete

- Users can mark task as complete/incomplete:
  * Toggle completion status with one click
  * Visual indicator shows completion state
  * Updated timestamp changes when toggled

USER INTERFACE:
- Login page for authentication
- Signup page for new users
- Main page shows task list with:
  * Create new task form at top
  * Filter buttons (All/Pending/Completed)
  * Task cards showing title, description, status, date
  * Edit and Delete buttons on each task
  * Checkbox to mark complete/incomplete
- Responsive design (works on mobile and desktop)
- Loading indicators during API calls
- Error messages for failed operations

SECURITY:
- Users can only see their own tasks
- Users cannot access other users' tasks
- All API requests require authentication
- Invalid tokens are rejected

USER STORIES:
1. As a new user, I can sign up with email and password
2. As a registered user, I can sign in with my credentials
3. As a logged-in user, I can create a new task with title and description
4. As a logged-in user, I can view all my tasks
5. As a logged-in user, I can filter tasks by completion status
6. As a logged-in user, I can edit my task's title or description
7. As a logged-in user, I can delete my tasks
8. As a logged-in user, I can mark tasks as complete or incomplete
9. As a logged-in user, I cannot see other users' tasks
10. As a logged-in user, I stay signed in until I log out

ACCEPTANCE CRITERIA:
- Each task is associated with exactly one user
- Task creation is fast (< 200ms)
- UI updates immediately after actions
- No data loss between sessions
- Multiple users can use the app simultaneously
- User isolation is enforced at API level
```

**Expected Output**: File `specs/001-todo-fullstack/spec.md` with complete specifications.

**After this step**: Review the spec and use `/sp.clarify` if anything is unclear before proceeding to planning.

## 🏗️ STEP 3: Plan (How to Build)

**Command**: `/sp.plan`

**What it does**: Creates technical implementation plan with architecture, tech stack, and file structure.

**Important**: NOW you specify the tech stack and HOW to build it.

**Prompt Template**:
```
/sp.plan

TECHNOLOGY STACK:
- Frontend: Next.js 16+ with App Router, TypeScript, Tailwind CSS
- Backend: Python FastAPI with SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (frontend) with JWT tokens (backend)
- Package Manager: npm (frontend), uv (backend)

MONOREPO STRUCTURE:
hackathon-todo/
├── frontend/              # Next.js 16+ App Router
│   ├── app/
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home/redirect
│   │   ├── login/
│   │   │   └── page.tsx   # Login page
│   │   ├── signup/
│   │   │   └── page.tsx   # Signup page
│   │   └── tasks/
│   │       └── page.tsx   # Main tasks page
│   ├── components/
│   │   ├── TaskList.tsx   # Task list with filters
│   │   ├── TaskItem.tsx   # Individual task card
│   │   └── TaskForm.tsx   # Create task form
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   ├── auth.ts        # Better Auth config
│   │   └── types.ts       # TypeScript types
│   └── package.json
│
└── backend/               # FastAPI
    ├── main.py            # FastAPI app entry
    ├── models.py          # SQLModel database models
    ├── auth.py            # JWT verification
    ├── db.py              # Database connection
    ├── routes/
    │   └── tasks.py       # Task CRUD endpoints
    └── pyproject.toml

FRONTEND IMPLEMENTATION:
1. Better Auth Setup:
   - Install better-auth package
   - Configure with Neon PostgreSQL
   - Enable email/password authentication
   - Enable JWT token generation
   - Set token expiry to 7 days

2. API Client (lib/api.ts):
   - Fetch JWT token from localStorage
   - Add Authorization header to all requests
   - Handle 401 errors (redirect to login)
   - Implement all CRUD operations

3. Pages:
   - Login page: Email/password form, calls Better Auth
   - Signup page: Email/password/name form, calls Better Auth
   - Tasks page: Server component fetches tasks, client components for interactivity

4. Components:
   - TaskForm: Client component for creating tasks
   - TaskList: Client component with filter state
   - TaskItem: Client component with edit/delete actions

BACKEND IMPLEMENTATION:
1. Database Setup (db.py):
   - Create SQLModel engine with Neon connection string
   - Enable SSL mode (required by Neon)
   - Create get_session dependency for FastAPI

2. Models (models.py):
   - Task model with SQLModel (table=True)
   - TaskCreate Pydantic model (request)
   - TaskUpdate Pydantic model (request)
   - TaskResponse Pydantic model (response)

3. Authentication (auth.py):
   - verify_jwt function that decodes JWT token
   - Extract user_id from token payload
   - Raise HTTPException for invalid/expired tokens

4. API Endpoints (routes/tasks.py):
   - POST /api/{user_id}/tasks - Create task
   - GET /api/{user_id}/tasks - List tasks (with status filter)
   - GET /api/{user_id}/tasks/{id} - Get single task
   - PUT /api/{user_id}/tasks/{id} - Update task
   - DELETE /api/{user_id}/tasks/{id} - Delete task
   - PATCH /api/{user_id}/tasks/{id}/complete - Toggle complete

5. Security:
   - All endpoints use Depends(verify_jwt)
   - Verify user_id in URL matches authenticated user
   - Filter all queries by user_id
   - Configure CORS to allow frontend domain

DATABASE SCHEMA:
users table (managed by Better Auth):
  - id (TEXT, PRIMARY KEY)
  - email (TEXT, UNIQUE)
  - name (TEXT)
  - created_at (TIMESTAMP)

tasks table:
  - id (SERIAL, PRIMARY KEY)
  - user_id (TEXT, FOREIGN KEY -> users.id)
  - title (VARCHAR(200), NOT NULL)
  - description (TEXT)
  - completed (BOOLEAN, DEFAULT FALSE)
  - created_at (TIMESTAMP, DEFAULT NOW())
  - updated_at (TIMESTAMP, DEFAULT NOW())
  - INDEX on user_id
  - INDEX on completed

AUTHENTICATION FLOW:
1. User signs up via Better Auth (frontend)
2. Better Auth creates user in database
3. User signs in via Better Auth
4. Better Auth generates JWT token
5. Frontend stores JWT in localStorage
6. Frontend sends JWT in Authorization header with every API request
7. Backend verifies JWT and extracts user_id
8. Backend filters all queries by user_id

ENVIRONMENT VARIABLES:
Frontend (.env.local):
  - DATABASE_URL=<neon-connection-string>
  - BETTER_AUTH_SECRET=<min-32-char-secret>
  - NEXT_PUBLIC_API_URL=http://localhost:8000

Backend (.env):
  - DATABASE_URL=<neon-connection-string>
  - BETTER_AUTH_SECRET=<same-as-frontend>

DEPLOYMENT:
- Frontend: Deploy to Vercel
- Backend: Deploy with API URL exposed
- Database: Neon Serverless PostgreSQL (already managed)

DEVELOPMENT WORKFLOW:
1. Set up monorepo structure
2. Initialize frontend with Next.js
3. Initialize backend with FastAPI
4. Set up database connection
5. Implement backend models and endpoints
6. Implement Better Auth in frontend
7. Implement API client in frontend
8. Build UI components
9. Test authentication flow
10. Test user isolation
11. Deploy to production
```

**Expected Output**: Files in `specs/001-todo-fullstack/`:
- `plan.md` - Implementation plan
- `data-model.md` - Database schema
- `api-spec.json` - API endpoints
- `research.md` - Tech stack research

**After this step**: Review the plan and ask Claude to validate it before proceeding.

## ✅ STEP 4: Tasks (Break Into Tasks)

**Command**: `/sp.tasks`

**What it does**: Automatically generates `tasks.md` with atomic, testable work units.

**No prompt required** - just run:
```
/sp.tasks
```

**Expected Output**: File `specs/001-todo-fullstack/tasks.md` with tasks like:
```
T-001: Set up monorepo structure
T-002: Initialize Next.js frontend
T-003: Initialize FastAPI backend
T-004: Configure Neon PostgreSQL connection
T-005: Create SQLModel Task model
T-006: Implement database migrations
T-007: Create GET /api/{user_id}/tasks endpoint
T-008: Create POST /api/{user_id}/tasks endpoint
...
T-025: Deploy frontend to Vercel
T-026: Deploy backend with API URL
```

**After this step**: Review tasks and ask Claude to refine if needed before implementation.

## 🚀 STEP 5: Implement (Build It)

**Command**: `/sp.implement`

**What it does**: Executes all tasks in `tasks.md` to build the complete application.

**No prompt required** - just run:
```
/sp.implement
```

**What happens**:
1. Claude validates prerequisites (constitution, spec, plan, tasks)
2. Parses task breakdown from tasks.md
3. Executes tasks in order:
   - Creates files and directories
   - Installs dependencies (npm, uv)
   - Writes code following the plan
   - Runs build/test commands
4. Reports progress and handles errors

**Important**: Claude will run local commands like `npm install`, `uv add`, etc. Make sure you have:
- Node.js and npm installed
- Python 3.13+ installed
- uv installed (`pip install uv`)

**Expected Output**: Complete working application with:
- Frontend running on `http://localhost:3000`
- Backend running on `http://localhost:8000`
- Database connected to Neon
- Authentication working
- All CRUD operations functional

## 🔍 Validation After Implementation

After `/sp.implement` completes, test the application:

1. **Start Frontend**:
```bash
cd frontend
npm run dev
```

2. **Start Backend**:
```bash
cd backend
uvicorn main:app --reload
```

3. **Test Authentication**:
   - Sign up with email/password
   - Sign in with credentials
   - Verify JWT token in localStorage

4. **Test Task Operations**:
   - Create new task
   - View task list
   - Filter by status
   - Edit task
   - Delete task
   - Mark as complete/incomplete

5. **Test User Isolation**:
   - Sign in as User A, create tasks
   - Sign out
   - Sign in as User B
   - Verify User B cannot see User A's tasks

## 🐛 Common Issues and Solutions

### Issue: SpecKit Plus commands not showing up
**Solution**: 
```bash
cd hackathon-todo
# Make sure you're in the project directory initialized with sp init
```

### Issue: "Constitution not found" error
**Solution**: Run `/sp.constitution` first before other commands

### Issue: "Spec not found" error  
**Solution**: Run `/sp.specify` before `/sp.plan`

### Issue: JWT verification fails
**Solution**: Ensure BETTER_AUTH_SECRET matches in both frontend and backend `.env` files

### Issue: CORS errors
**Solution**: Add CORS middleware in FastAPI `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Database connection fails
**Solution**: Check Neon connection string format and ensure SSL mode is enabled

### Issue: User sees other users' tasks
**Solution**: All database queries must filter by `user_id` from JWT token

## 📁 Final Project Structure

After successful implementation:

```
hackathon-todo/
├── .specify/
│   ├── memory/
│   │   └── constitution.md
│   └── specs/
│       └── 001-todo-fullstack/
│           ├── spec.md
│           ├── plan.md
│           ├── tasks.md
│           ├── data-model.md
│           └── api-spec.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.local
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── auth.py
│   ├── db.py
│   ├── routes/
│   ├── pyproject.toml
│   └── .env
└── README.md
```

## 🎯 Success Criteria

Phase II is complete when:
- [ ] All 5 SpecKit Plus commands executed successfully
- [ ] Constitution defines clear project principles
- [ ] Spec covers all required features
- [ ] Plan details complete tech stack and architecture
- [ ] Tasks break down implementation into atomic units
- [ ] Implementation builds working application
- [ ] Users can sign up and sign in
- [ ] Users can perform all CRUD operations on tasks
- [ ] User isolation is enforced
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed with public API
- [ ] Demo video (90 seconds) recorded

## 📚 References

For detailed patterns, see the reference files:
- `references/speckit-plus-workflow.md` - Complete workflow guide
- `references/better-auth-setup.md` - Authentication integration
- `references/sqlmodel-crud.md` - Database operations
- `references/nextjs-components.md` - Frontend patterns
- `references/fastapi-security.md` - API security

## 🎓 Key Learnings

Using SpecKit Plus teaches you:
1. **Spec-Driven Development** - Specs before code
2. **Structured Thinking** - Breaking problems into phases
3. **AI Collaboration** - Guiding AI with clear instructions
4. **Professional Workflow** - Constitution → Spec → Plan → Tasks → Implement
5. **Quality Standards** - Following consistent principles throughout

Good luck with Phase II! 🚀
