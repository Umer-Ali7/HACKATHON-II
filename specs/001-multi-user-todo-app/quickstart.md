# Quickstart Guide: Hackathon Todo

**Feature**: 001-multi-user-todo-app
**Date**: 2026-01-06
**Purpose**: Get the application running locally in under 15 minutes

## Prerequisites

Ensure you have the following installed:

- **Python**: 3.13 or higher ([download](https://www.python.org/downloads/))
- **Node.js**: 20.x or higher ([download](https://nodejs.org/))
- **uv**: Python package manager ([install](https://docs.astral.sh/uv/))
- **Neon Account**: Free tier sufficient ([signup](https://neon.tech/))
- **Git**: For version control

Verify installations:
```bash
python --version  # Should be 3.13+
node --version    # Should be v20.x+
uv --version      # Should be 0.1.0+
```

## Step 1: Clone and Setup Repository

```bash
# Navigate to project root
cd /path/to/Hackathon-II/phase-2

# Verify monorepo structure
ls -la
# Should see: frontend/ backend/ .specify/ specs/
```

## Step 2: Create Neon Database

1. Log in to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Name it "hackathon-todo"
4. Select region (closest to you)
5. Click "Create Project"
6. Copy the connection string:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

**Important**: Save this connection string - you'll need it for both services.

## Step 3: Generate JWT Secret

Generate a secure random secret (minimum 32 characters):

```bash
openssl rand -base64 32
```

Copy the output - this MUST be identical in both frontend and backend.

## Step 4: Backend Setup

### 4.1 Navigate to Backend

```bash
cd backend
```

### 4.2 Create Environment File

Create `.env` file:
```bash
cat > .env << EOF
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Auth (MUST match frontend)
BETTER_AUTH_SECRET=<paste-your-generated-secret-here>

# CORS
FRONTEND_URL=http://localhost:3000
EOF
```

**Replace**:
- `DATABASE_URL` with your Neon connection string
- `BETTER_AUTH_SECRET` with the secret from Step 3

### 4.3 Install Dependencies

```bash
uv sync
```

This reads `pyproject.toml` and installs:
- FastAPI
- SQLModel
- PyJWT (python-jose)
- Uvicorn
- Alembic
- Other dependencies

### 4.4 Initialize Database

```bash
# Run Alembic migrations to create tasks table
uv run alembic upgrade head
```

**Note**: Better Auth will create the `users` table automatically on first run.

### 4.5 Start Backend Server

```bash
uv run uvicorn app.main:app --reload --port 8000
```

Server should start on `http://localhost:8000`

Verify it's running:
```bash
curl http://localhost:8000/docs
# Should return OpenAPI documentation
```

**Keep this terminal open** (backend running).

## Step 5: Frontend Setup

### 5.1 Navigate to Frontend (New Terminal)

```bash
cd frontend  # From repo root
```

### 5.2 Create Environment File

Create `.env.local` file:
```bash
cat > .env.local << EOF
# Database (for Better Auth)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Auth (MUST match backend)
BETTER_AUTH_SECRET=<paste-your-generated-secret-here>

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

**Critical**: Use the SAME values as backend:
- Same `DATABASE_URL`
- Same `BETTER_AUTH_SECRET`

### 5.3 Install Dependencies

```bash
npm install
```

This installs:
- Next.js 16+
- Better Auth
- Tailwind CSS
- TypeScript
- Other dependencies

### 5.4 Start Frontend Server

```bash
npm run dev
```

Server should start on `http://localhost:3000`

**Keep this terminal open** (frontend running).

## Step 6: Verify Installation

Open your browser to `http://localhost:3000`

You should see:
- Home page with login/signup options
- No errors in browser console
- No errors in backend terminal

## Step 7: Create First User and Task

### 7.1 Sign Up

1. Navigate to `http://localhost:3000/signup`
2. Enter:
   - **Email**: `test@example.com`
   - **Password**: `password123` (min 8 chars)
3. Click "Sign Up"
4. Should redirect to `/tasks` page

### 7.2 Create First Task

1. On `/tasks` page, enter in the form:
   - **Title**: `Test my first task`
   - **Description**: `This is a test` (optional)
2. Click "Create Task"
3. Task should appear in the list below

### 7.3 Verify Task Operations

**Toggle Completion**:
- Click the checkbox next to the task
- Status should change to "Completed"
- Visual indicator should update

**Filter Tasks**:
- Click "Pending" button - task should disappear (it's completed)
- Click "Completed" button - task should appear
- Click "All" button - task should appear

**Edit Task**:
- Click "Edit" button on task card
- Change title to `Updated task title`
- Click "Save"
- Title should update in the list

**Delete Task**:
- Click "Delete" button on task card
- Confirm deletion in prompt
- Task should disappear from list

## Step 8: Verify User Isolation

### 8.1 Create Second User

1. Click "Logout" (if logout button exists) OR open incognito window
2. Navigate to `http://localhost:3000/signup`
3. Sign up with different email: `user2@example.com`
4. Create a task: `User 2's private task`

### 8.2 Verify Isolation

**Confirm**:
- User 2 can only see their own task
- User 2 cannot see User 1's tasks

**Test API Isolation** (Advanced):
```bash
# Get User 1's JWT token from browser DevTools > Application > Cookies
# Look for "better-auth-session" cookie value

# Try to access tasks (should only see User 1's tasks)
curl -H "Authorization: Bearer <user1-token>" http://localhost:8000/api/tasks

# Try with User 2's token (should only see User 2's tasks)
curl -H "Authorization: Bearer <user2-token>" http://localhost:8000/api/tasks
```

Each user should only see their own tasks - confirming isolation works correctly.

## Troubleshooting

### Backend won't start

**Error**: `DATABASE_URL not set`
**Fix**: Ensure `.env` file exists in `backend/` with correct connection string

**Error**: `Connection refused`
**Fix**: Check Neon database is accessible, verify SSL mode in connection string

**Error**: `Table 'users' does not exist`
**Fix**: Restart backend - Better Auth creates table on first startup

### Frontend won't start

**Error**: `BETTER_AUTH_SECRET not set`
**Fix**: Ensure `.env.local` file exists in `frontend/` with secret

**Error**: `Failed to fetch`
**Fix**: Verify backend is running on `http://localhost:8000`

**Error**: `CORS policy error`
**Fix**: Check `FRONTEND_URL=http://localhost:3000` in backend `.env`

### Cannot create account

**Error**: `Email already exists`
**Fix**: Use different email OR delete user from database:
```sql
-- Connect to Neon database and run:
DELETE FROM users WHERE email = 'test@example.com';
```

**Error**: `Password too short`
**Fix**: Use password with minimum 8 characters

### Tasks not appearing

**Error**: Blank task list after creating task
**Fix**: Check browser console for errors, verify API calls succeed

**Error**: 401 Unauthorized
**Fix**: Token expired - logout and login again

### Secrets don't match

**Symptom**: Can create account but API calls fail with 401
**Fix**: Ensure `BETTER_AUTH_SECRET` is IDENTICAL in both `.env` files

Compare:
```bash
grep BETTER_AUTH_SECRET backend/.env
grep BETTER_AUTH_SECRET frontend/.env.local
# Both should show exactly the same value
```

## Next Steps

### Development Workflow

1. **Make changes to code**
2. **Backend auto-reloads** (--reload flag)
3. **Frontend auto-reloads** (Fast Refresh)
4. **Test in browser**

### Database Changes

When modifying models:

```bash
# Generate migration
cd backend
uv run alembic revision --autogenerate -m "description"

# Review migration file in alembic/versions/

# Apply migration
uv run alembic upgrade head
```

### Testing

**Backend**:
```bash
cd backend
uv run pytest
```

**Frontend**:
```bash
cd frontend
npm test
```

### Viewing Database

**Option 1**: Neon Console
1. Go to https://console.neon.tech/
2. Select your project
3. Click "SQL Editor"
4. Run queries:
```sql
SELECT * FROM users;
SELECT * FROM tasks;
```

**Option 2**: psql
```bash
psql "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"

\dt          -- List tables
SELECT * FROM tasks;
```

## Summary

You now have:
- ✅ Backend running on port 8000
- ✅ Frontend running on port 3000
- ✅ Neon PostgreSQL database connected
- ✅ Better Auth configured
- ✅ User signup/login working
- ✅ Task CRUD operations functional
- ✅ User isolation verified

**Time to complete**: ~10-15 minutes

Ready to build! Proceed to `/sp.tasks` to generate implementation tasks.
