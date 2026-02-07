# Quickstart: Todo AI Chatbot (Modern UI Edition)

## Prerequisites

- Python 3.11+ with `uv` package manager
- Node.js 18+ with `npm`
- PostgreSQL database (Neon recommended, or local)
- Groq API key (free at https://console.groq.com)
- OpenAI domain key (for ChatKit, optional for development)

## 1. Clone and Navigate

```bash
cd phase-3
git checkout 003-todo-ai-chatbot
```

## 2. Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Create environment file
cp .env.example .env
# Edit .env with your values:
#   DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
#   GROQ_API_KEY=gsk_your_key_here
#   FRONTEND_URL=http://localhost:3000
#   ENVIRONMENT=development

# Run database migrations
uv run alembic upgrade head

# Start the backend server
uv run uvicorn app.main:app --reload --port 8000
```

## 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your values:
#   NEXT_PUBLIC_API_URL=http://localhost:8000
#   NEXT_PUBLIC_OPENAI_DOMAIN_KEY=odk_xxx (optional for dev)

# Start the development server
npm run dev
```

## 4. Verify

1. Backend health: `curl http://localhost:8000/health`
   - Expected: `{"status": "ok"}`

2. Open frontend: http://localhost:3000
   - You should see the landing page

3. Sign up: Navigate to /signup and create an account

4. Test chat: Navigate to /chat and type "Add buy groceries"
   - Expected: Confirmation message with task title

5. Test dark mode: Navigate to /settings and toggle the theme

## One-Command Setup (via Makefile)

```bash
make dev
# Starts both backend (port 8000) and frontend (port 3000)
```

## Environment Variables

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (asyncpg) |
| `GROQ_API_KEY` | Yes | Groq API key for AI inference |
| `FRONTEND_URL` | Yes | Frontend origin for CORS (e.g., http://localhost:3000) |
| `ENVIRONMENT` | No | `development` or `production` (default: development) |

### Frontend (.env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g., http://localhost:8000) |
| `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` | No | OpenAI domain key for ChatKit (prod only) |

## OpenAI ChatKit Domain Setup (Production)

1. Deploy frontend to Vercel to get the production URL.
2. Go to https://platform.openai.com/settings/organization/security/domain-allowlist
3. Add your Vercel domain (e.g., `your-app.vercel.app`).
4. Copy the domain key displayed after adding.
5. Set `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` in Vercel environment variables.
6. Without this key, the app falls back to the custom chat UI.

## Common Issues

**Database connection fails**:
- Verify `DATABASE_URL` uses `postgresql+asyncpg://` scheme
- Ensure Neon database is active (paused databases need a wake-up request)

**Groq API returns 429**:
- Free tier rate limits are aggressive. Wait 60 seconds and retry.
- The backend implements automatic exponential backoff.

**CORS errors in browser**:
- Ensure `FRONTEND_URL` in backend `.env` matches exactly
  (including port, no trailing slash)

**Frontend can't reach backend**:
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running on the specified port

**ChatKit shows blank/error**:
- Without `NEXT_PUBLIC_OPENAI_DOMAIN_KEY`, app uses custom chat UI
- If key is set but not working, verify domain is allowlisted

**Dark mode flickers on load**:
- Ensure `suppressHydrationWarning` is on the `<html>` tag
- Verify `next-themes` ThemeProvider wraps the app
