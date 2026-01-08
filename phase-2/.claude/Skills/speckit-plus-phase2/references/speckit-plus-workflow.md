# SpecKit Plus Complete Workflow Reference

## Installation

```bash
# Install SpecKit Plus globally
pip install specifyplus
# or with uv
uv tool install specifyplus

# Verify installation
sp --help
```

## Project Initialization

```bash
# Create new project with Claude Code
sp init hackathon-todo --ai claude

# Or initialize in current directory
sp init . --ai claude

# Or use --here flag
sp init --here --ai claude
```

## The 5 Commands Workflow

### 1. `/sp.constitution` - Project Principles [PROMPT REQUIRED]

**Purpose**: Define project's governing principles that guide all development decisions.

**When to use**: First step, before any other command.

**Output**: `.specify/memory/constitution.md`

**Prompt structure**:
```
/sp.constitution

Create constitution with these sections:

ARCHITECTURE PRINCIPLES:
- [List your architecture principles]

TECHNOLOGY CONSTRAINTS:
- [List required/forbidden technologies]

CODE STANDARDS:
- [List coding standards]

SECURITY RULES:
- [List security requirements]

PERFORMANCE REQUIREMENTS:
- [List performance targets]

TESTING STANDARDS:
- [List testing requirements]
```

**Example**:
```
/sp.constitution

Create constitution for Todo app with these principles:

ARCHITECTURE PRINCIPLES:
- API-First Design
- Stateless Authentication
- Separation of Concerns

TECHNOLOGY CONSTRAINTS:
- Next.js 16+ App Router only
- SQLModel for ORM only
- Better Auth for authentication only

CODE STANDARDS:
- TypeScript with strict mode
- All API responses use Pydantic models
- User isolation enforced at API level

SECURITY RULES:
- JWT authentication required for all endpoints
- User data isolation (filter by user_id)
- Environment variables for secrets

PERFORMANCE REQUIREMENTS:
- API response < 200ms
- Frontend load < 2 seconds
- Database indexes on foreign keys

TESTING STANDARDS:
- Unit tests for business logic
- Integration tests for API endpoints
- Test user isolation thoroughly
```

---

### 2. `/sp.specify` - What to Build [PROMPT REQUIRED]

**Purpose**: Define functional requirements and user stories (WHAT and WHY, not HOW).

**When to use**: After constitution is created.

**Output**: `specs/001-<feature-name>/spec.md`

**Prompt structure**:
```
/sp.specify

Build [application name] with these requirements:

[SECTION 1]: [Feature category]
- [Detailed requirement 1]
- [Detailed requirement 2]

[SECTION 2]: [Feature category]
- [Detailed requirement 1]
- [Detailed requirement 2]

USER STORIES:
1. As a [user type], I can [action]
2. As a [user type], I can [action]

ACCEPTANCE CRITERIA:
- [Criterion 1]
- [Criterion 2]
```

**Important**: 
- Focus on WHAT the app should do
- Don't mention tech stack (that comes in /sp.plan)
- Be specific about requirements
- Include user stories
- Define acceptance criteria

**Example**:
```
/sp.specify

Build a Todo application with these requirements:

USER MANAGEMENT:
- Users can sign up with email and password
- Users can sign in with credentials
- Password minimum 8 characters

TASK MANAGEMENT:
- Users can create tasks with title (required) and description (optional)
- Users can view all their tasks
- Users can filter by status (all/pending/completed)
- Users can edit task title and description
- Users can delete tasks
- Users can mark tasks as complete/incomplete

USER INTERFACE:
- Login page
- Signup page
- Main page with task list and filters
- Responsive design

SECURITY:
- Users can only see their own tasks
- All API requests require authentication

USER STORIES:
1. As a new user, I can sign up
2. As a user, I can sign in
3. As a user, I can create tasks
4. As a user, I can view my tasks
5. As a user, I can edit my tasks
6. As a user, I can delete my tasks
7. As a user, I cannot see other users' tasks

ACCEPTANCE CRITERIA:
- Each task belongs to exactly one user
- Task creation is fast (< 200ms)
- UI updates immediately
- No data loss between sessions
- User isolation enforced
```

---

### 3. `/sp.plan` - How to Build [PROMPT REQUIRED]

**Purpose**: Define technical implementation plan with tech stack and architecture.

**When to use**: After spec is created and reviewed.

**Output**: 
- `specs/001-<feature-name>/plan.md`
- `specs/001-<feature-name>/data-model.md`
- `specs/001-<feature-name>/api-spec.json`

**Prompt structure**:
```
/sp.plan

TECHNOLOGY STACK:
- Frontend: [framework + version]
- Backend: [framework + version]
- Database: [database + version]
- Authentication: [auth method]

MONOREPO STRUCTURE:
[Show complete directory structure]

FRONTEND IMPLEMENTATION:
1. [Component/feature 1]
   - [Implementation detail]
2. [Component/feature 2]
   - [Implementation detail]

BACKEND IMPLEMENTATION:
1. [Component/feature 1]
   - [Implementation detail]
2. [Component/feature 2]
   - [Implementation detail]

DATABASE SCHEMA:
[Table definitions with fields]

AUTHENTICATION FLOW:
[Step-by-step flow]

ENVIRONMENT VARIABLES:
[List all required env vars]

DEPLOYMENT:
[Deployment instructions]

DEVELOPMENT WORKFLOW:
[Step-by-step development order]
```

**Example**:
```
/sp.plan

TECHNOLOGY STACK:
- Frontend: Next.js 16+ with App Router, TypeScript, Tailwind
- Backend: Python FastAPI with SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT

MONOREPO STRUCTURE:
hackathon-todo/
├── frontend/
│   ├── app/
│   │   ├── login/page.tsx
│   │   └── tasks/page.tsx
│   ├── components/
│   │   ├── TaskList.tsx
│   │   └── TaskForm.tsx
│   └── lib/
│       ├── api.ts
│       └── auth.ts
└── backend/
    ├── main.py
    ├── models.py
    ├── auth.py
    └── routes/
        └── tasks.py

FRONTEND IMPLEMENTATION:
1. Better Auth Setup
   - Install better-auth
   - Configure with Neon DB
   - Enable JWT generation

2. API Client
   - Fetch token from localStorage
   - Add Authorization header
   - Implement CRUD operations

BACKEND IMPLEMENTATION:
1. Database Setup
   - SQLModel engine with Neon
   - Enable SSL mode

2. Authentication
   - JWT verification function
   - Extract user_id from token

3. API Endpoints
   - POST /api/{user_id}/tasks
   - GET /api/{user_id}/tasks
   - PUT /api/{user_id}/tasks/{id}
   - DELETE /api/{user_id}/tasks/{id}

DATABASE SCHEMA:
users:
  - id (TEXT, PRIMARY KEY)
  - email (TEXT, UNIQUE)
  - created_at (TIMESTAMP)

tasks:
  - id (SERIAL, PRIMARY KEY)
  - user_id (TEXT, FK -> users.id)
  - title (VARCHAR(200))
  - description (TEXT)
  - completed (BOOLEAN)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

AUTHENTICATION FLOW:
1. User signs up via Better Auth
2. Better Auth generates JWT
3. Frontend stores JWT in localStorage
4. Frontend sends JWT in Authorization header
5. Backend verifies JWT and extracts user_id
6. Backend filters queries by user_id

ENVIRONMENT VARIABLES:
Frontend:
  - DATABASE_URL
  - BETTER_AUTH_SECRET
  - NEXT_PUBLIC_API_URL

Backend:
  - DATABASE_URL
  - BETTER_AUTH_SECRET

DEPLOYMENT:
- Frontend: Vercel
- Backend: API with public URL

DEVELOPMENT WORKFLOW:
1. Set up monorepo
2. Initialize frontend
3. Initialize backend
4. Implement models
5. Implement endpoints
6. Implement Better Auth
7. Build UI components
8. Test and deploy
```

---

### 4. `/sp.tasks` - Break Into Tasks [AUTO]

**Purpose**: Generate atomic, testable work units from the plan.

**When to use**: After plan is created and validated.

**Output**: `specs/001-<feature-name>/tasks.md`

**No prompt required** - just run:
```
/sp.tasks
```

**What it generates**:
- Numbered task list (T-001, T-002, etc.)
- Dependencies between tasks
- File paths for implementation
- Test requirements
- Validation checkpoints

**Example output**:
```
T-001: Set up monorepo structure
  - Create frontend/ and backend/ directories

T-002: Initialize Next.js frontend
  - Run: npx create-next-app@latest frontend
  - Configure TypeScript and Tailwind

T-003: Initialize FastAPI backend
  - Create pyproject.toml
  - Run: uv add fastapi sqlmodel
  
[... more tasks ...]
```

---

### 5. `/sp.implement` - Build It [AUTO]

**Purpose**: Execute all tasks to build the complete application.

**When to use**: After tasks are generated and reviewed.

**Output**: Complete working application

**No prompt required** - just run:
```
/sp.implement
```

**What it does**:
1. Validates prerequisites (constitution, spec, plan, tasks)
2. Parses tasks from tasks.md
3. Executes tasks in order:
   - Creates files and directories
   - Installs dependencies
   - Writes code
   - Runs commands (npm, uv, etc.)
4. Reports progress
5. Handles errors

**Important**: Make sure you have:
- Node.js and npm installed
- Python 3.13+ installed
- uv installed
- Required tools available

---

## Optional Commands

### `/sp.clarify` - Clarify Requirements

Use AFTER `/sp.specify` and BEFORE `/sp.plan` to clarify underspecified areas.

```
/sp.clarify
```

Claude will ask structured questions to clarify the spec.

### `/sp.analyze` - Validate Consistency

Use AFTER `/sp.tasks` and BEFORE `/sp.implement` to validate consistency.

```
/sp.analyze
```

Checks that spec, plan, and tasks are aligned.

---

## Complete Workflow Example

```bash
# 1. Install SpecKit Plus
pip install specifyplus

# 2. Initialize project
sp init hackathon-todo --ai claude
cd hackathon-todo

# 3. Start Claude Code
claude

# 4. Create constitution
/sp.constitution
[Provide detailed prompt]

# 5. Create specification
/sp.specify
[Provide detailed prompt]

# 6. (Optional) Clarify specification
/sp.clarify

# 7. Create plan
/sp.plan
[Provide detailed prompt]

# 8. (Optional) Analyze consistency
/sp.analyze

# 9. Generate tasks
/sp.tasks

# 10. Implement
/sp.implement

# 11. Test application
cd frontend && npm run dev
cd backend && uvicorn main:app --reload
```

---

## Key Principles

1. **Never skip steps** - Follow the order: constitution → specify → plan → tasks → implement
2. **First 3 require prompts** - Constitution, Specify, Plan need detailed instructions
3. **Last 2 are automatic** - Tasks and Implement run without prompts
4. **Constitution is foundational** - All subsequent commands reference it
5. **Spec is WHAT, Plan is HOW** - Don't mix tech stack into spec
6. **Review before proceeding** - Validate each output before next command
7. **Use optional commands** - /sp.clarify and /sp.analyze improve quality

---

## Troubleshooting

### Commands not available
- Ensure you're in a SpecKit Plus initialized project
- Check that Claude Code is running in the project directory

### "Constitution not found"
- Run `/sp.constitution` first

### "Spec not found"
- Run `/sp.specify` after constitution

### "Plan not found"
- Run `/sp.plan` after spec

### Implementation fails
- Check that all required tools are installed (node, python, uv)
- Verify environment variables are set
- Review tasks.md for any manual steps needed
