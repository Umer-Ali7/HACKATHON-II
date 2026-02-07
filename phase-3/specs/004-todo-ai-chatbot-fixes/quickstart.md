# Quickstart: Todo AI Chatbot Fixes

**Branch**: `004-todo-ai-chatbot-fixes`

## Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- Neon PostgreSQL account (connection string provided)
- Groq API key

## Backend Setup

```bash
cd backend

# Create/activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies (already in pyproject.toml)
pip install -e .
# OR if using uv:
uv sync

# Ensure passlib is installed
pip install "passlib[bcrypt]"

# Configure environment
# Edit .env with your credentials:
# DATABASE_URL=postgresql+asyncpg://...?ssl=require
# GROQ_API_KEY=gsk_...
# FRONTEND_URL=http://localhost:3000
# ENVIRONMENT=development
# AUTH_SECRET=your-secret-key-at-least-32-chars

# Start the backend
uvicorn app.main:app --reload --port 8000
```

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Clear build cache (important for fixing 404s)
rm -rf .next

# Start the frontend
npm run dev
```

## Verification Steps

### 1. Backend Health
```bash
curl http://localhost:8000/health
# Expected: {"status":"ok"}
```

### 2. Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Test User"}'
```

### 3. Login (correct password)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
# Expected: 200 with user data
```

### 4. Login (wrong password)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
# Expected: 401
```

### 5. Frontend Pages
Navigate to:
- http://localhost:3000/login - Login form
- http://localhost:3000/signup - Signup form
- http://localhost:3000/dashboard - Stats (after login)
- http://localhost:3000/chat - AI Chat (after login)
- http://localhost:3000/tasks - Task list (after login)
- http://localhost:3000/settings - Settings (after login)

## Troubleshooting

### "Tables not found" errors
- Ensure backend starts without errors (tables auto-create on startup)
- Check Neon dashboard for table existence

### Frontend 404s persist
```bash
cd frontend
rm -rf .next node_modules/.cache
npm run dev
```

### Password hashing errors
```bash
pip install "passlib[bcrypt]" bcrypt
```

### Groq API errors
- Verify `GROQ_API_KEY` in `.env`
- Check rate limits (100 req/min)
