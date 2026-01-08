# Hackathon Todo - Multi-User Task Management Application

A full-stack multi-user todo application built with Next.js, FastAPI, and Neon PostgreSQL.

## 🏗️ Architecture

- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind CSS, Better Auth
- **Backend**: Python FastAPI, SQLModel ORM, PyJWT authentication
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens in httpOnly cookies

## 📋 Features

- ✅ User registration and authentication (email/password)
- ✅ Create, read, update, delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Filter tasks by status (All/Pending/Completed)
- ✅ User isolation - users only see their own tasks
- ✅ Secure JWT authentication with 7-day sessions
- ✅ Responsive UI with Tailwind CSS
- ✅ Real-time validation and error handling

## 🚀 Quick Start

### Prerequisites

- Python 3.12+ installed
- Node.js 20+ installed
- uv package manager installed
- Neon PostgreSQL database (already configured)

### 1. Start the Backend API

Open a terminal and run:

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

The backend API will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 2. Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend will be available at:
- **App**: http://localhost:3000

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Click **"Sign up"** to create a new account
3. Enter your email (e.g., `test@example.com`) and password (min 8 characters)
4. You'll be redirected to the `/tasks` page
5. Create, edit, complete, filter, and delete tasks!

### 4. Verify User Isolation

To test that users can only see their own tasks:

1. Create a task with User 1
2. Open an **incognito/private window**
3. Go to http://localhost:3000
4. Sign up as User 2 with a different email
5. Verify User 2 cannot see User 1's tasks ✅

## 📁 Project Structure

```
phase-2/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI app with CORS
│   │   ├── config.py          # Environment settings
│   │   ├── db.py              # Database connection
│   │   ├── models/            # SQLModel entities
│   │   ├── schemas/           # Pydantic validation
│   │   ├── routes/            # API endpoints
│   │   └── middleware/        # JWT authentication
│   ├── alembic/               # Database migrations
│   ├── .env                   # Environment variables
│   └── pyproject.toml         # Python dependencies
│
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── tasks/             # Tasks management page
│   │   └── api/auth/          # Better Auth API routes
│   ├── lib/
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── auth.ts            # Better Auth config
│   │   └── api.ts             # API client
│   ├── .env.local             # Environment variables
│   └── package.json           # Node dependencies
│
└── specs/                      # Feature specifications
    └── 001-multi-user-todo-app/
        ├── spec.md            # Requirements
        ├── plan.md            # Architecture
        ├── tasks.md           # Implementation tasks
        └── contracts/         # API contracts
```

## 🔐 Security Features

- **JWT Authentication**: Stateless tokens with 7-day expiry
- **httpOnly Cookies**: Prevents XSS attacks
- **User Isolation**: API-level enforcement via dependency injection
- **Password Validation**: Minimum 8 characters
- **CORS Protection**: Only allows requests from frontend URL
- **SSL Required**: Database connections use SSL

## 🛠️ API Endpoints

All endpoints require JWT authentication in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks?status={filter}` | List tasks (filter: all/pending/completed) |
| GET | `/api/tasks/{id}` | Get single task |
| PUT | `/api/tasks/{id}` | Update task title/description |
| PATCH | `/api/tasks/{id}/complete` | Toggle task completion |
| DELETE | `/api/tasks/{id}` | Delete task |

## 📊 Database Schema

### users
- `id` (TEXT, PK) - User UUID
- `email` (TEXT, UNIQUE) - User email
- `email_verified` (BOOLEAN) - Email verification status
- `name` (TEXT, NULLABLE) - User display name
- `created_at`, `updated_at` (TIMESTAMP)

### tasks
- `id` (SERIAL, PK) - Task ID
- `user_id` (TEXT, FK → users.id) - Owner
- `title` (VARCHAR(200)) - Task title
- `description` (TEXT, NULLABLE) - Task description
- `completed` (BOOLEAN, DEFAULT FALSE) - Completion status
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes**: `user_id`, `completed`, `(user_id, completed)` composite

## 🧪 Testing

### Manual Testing via UI
1. Start both servers (see Quick Start)
2. Open http://localhost:3000
3. Test signup, login, CRUD operations, filtering

### Manual Testing via API Docs
1. Start backend server
2. Open http://localhost:8000/docs
3. Click "Authorize" and enter JWT token
4. Test individual endpoints

### Get JWT Token for Testing
1. Sign up/login via frontend
2. Open browser DevTools → Network tab
3. Look for requests to `/api/auth/`
4. Copy the JWT token from the response

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=L69lniT8/KwPvktLcQton7pJmioGOQHCQdEdKGKToiQ=
FRONTEND_URL=http://localhost:3000
DEBUG=False
```

### Frontend (.env.local)
```env
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=L69lniT8/KwPvktLcQton7pJmioGOQHCQdEdKGKToiQ=
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important**: Both frontend and backend must use the **same** `BETTER_AUTH_SECRET` for JWT verification to work.

## 📝 Development

### Add a New Migration
```bash
cd backend
uv run alembic revision --autogenerate -m "Description"
uv run alembic upgrade head
```

### Install New Dependencies

Backend:
```bash
cd backend
# Add to pyproject.toml dependencies array
uv sync
```

Frontend:
```bash
cd frontend
npm install <package-name>
```

## 🐛 Troubleshooting

### Backend won't start
- Check that `.env` file exists in `backend/`
- Verify `DATABASE_URL` is correct
- Try: `cd backend && uv sync` to reinstall dependencies

### Frontend won't start
- Check that `.env.local` file exists in `frontend/`
- Verify same `BETTER_AUTH_SECRET` as backend
- Try: `cd frontend && npm install` to reinstall dependencies

### Can't create tasks (401 Unauthorized)
- Verify both servers are running
- Check that `BETTER_AUTH_SECRET` matches in both .env files
- Try logging out and logging back in

### CORS errors in browser console
- Verify `FRONTEND_URL=http://localhost:3000` in backend `.env`
- Make sure frontend is running on port 3000

## 📚 Next Steps

From the specification (specs/001-multi-user-todo-app/spec.md), the following user stories are implemented:

- ✅ **P1 (US1)**: Account Creation and Authentication
- ✅ **P2 (US2)**: Create and View Tasks
- ✅ **P3 (US3)**: Mark Tasks Complete/Incomplete
- ✅ **P4 (US4)**: Filter Tasks by Status
- ✅ **P5 (US5)**: Edit Task Details
- ✅ **P6 (US6)**: Delete Tasks

**MVP is complete!** 🎉

Consider adding:
- Automated tests (pytest for backend, Jest for frontend)
- Task due dates and priorities
- Task categories/tags
- Search functionality
- Task sharing between users
- Email notifications
- Dark mode toggle

## 📄 License

This project was created for Hackathon Phase II.
