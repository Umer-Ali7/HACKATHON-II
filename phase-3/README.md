# Todo AI Chatbot

An AI-powered todo management chatbot that lets you create, list, complete, update, and delete tasks using natural language.

## Architecture

```
┌──────────────────┐     HTTP     ┌──────────────────┐     SQL     ┌──────────────┐
│  Next.js 16      │────────────▶│  FastAPI          │───────────▶│  Neon         │
│  (Chat UI)       │◀────────────│  (API + Agent)    │◀───────────│  PostgreSQL   │
└──────────────────┘             └──────┬───────────┘             └──────────────┘
                                       │
                                       │ OpenAI-compat
                                       ▼
                                ┌──────────────────┐
                                │  Groq             │
                                │  (Llama 3.3 70B)  │
                                └──────────────────┘
```

**Request flow**: User message → FastAPI endpoint → Groq AI agent → MCP tools (CRUD) → PostgreSQL → Response with tool call transparency

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | FastAPI, Python 3.11+, SQLModel |
| AI | Groq (Llama 3.3 70B Versatile) via OpenAI SDK |
| Database | Neon PostgreSQL (asyncpg) |
| Migrations | Alembic |
| Rate Limiting | slowapi (100 req/min per user) |
| Retry | tenacity (exponential backoff for Groq 429s) |

## Setup

See [quickstart.md](specs/003-todo-ai-chatbot/quickstart.md) for detailed instructions.

### Quick Start

```bash
# Backend
cd backend
uv sync
cp .env.example .env   # Edit with your credentials
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env.local   # Set NEXT_PUBLIC_API_URL
npm run dev
```

Or use the Makefile:

```bash
make dev   # Starts both backend and frontend
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `postgresql+asyncpg://user:pass@host/db` |
| `GROQ_API_KEY` | Yes | Groq API key |
| `FRONTEND_URL` | Yes | Frontend origin for CORS |
| `ENVIRONMENT` | No | `development` or `production` |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |

## API

### `POST /api/{user_id}/chat`

Send a natural language message to manage tasks.

**Request:**
```json
{
  "message": "Add buy groceries to my list",
  "conversation_id": null
}
```

**Response:**
```json
{
  "conversation_id": 1,
  "response": "I've added 'buy groceries' to your list!",
  "tool_calls": [
    {
      "tool": "add_task_tool",
      "parameters": {"user_id": "demo-user", "title": "buy groceries"},
      "result": {"task_id": 1, "status": "created", "title": "buy groceries"}
    }
  ]
}
```

### `GET /health`

Returns `{"status": "ok"}` when the service is running.

## MCP Tools

| Tool | Description |
|------|-------------|
| `add_task_tool` | Create a new task |
| `list_tasks_tool` | List all user tasks |
| `complete_task_tool` | Mark a task as done |
| `delete_task_tool` | Remove a task |
| `update_task_tool` | Update title/description |

## Project Structure

```
phase-3/
├── backend/
│   ├── app/
│   │   ├── agents/todo_agent.py    # Groq AI agent with tool calling
│   │   ├── api/routes/chat.py      # Chat endpoint
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic settings
│   │   │   └── database.py         # Async SQLAlchemy engine
│   │   ├── mcp/
│   │   │   ├── server.py           # MCP server with tool registrations
│   │   │   └── tools/              # Individual CRUD tool implementations
│   │   ├── models/                 # SQLModel entities (Task, Conversation, Message)
│   │   └── main.py                 # FastAPI app entry point
│   ├── alembic/                    # Database migrations
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   │   ├── chat/page.tsx           # Main chat page
│   │   ├── (auth)/login/page.tsx   # Login placeholder
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Redirect to /chat
│   ├── components/chat/
│   │   └── ChatInterface.tsx       # Chat UI component
│   ├── lib/api.ts                  # Backend API client
│   └── package.json
├── specs/                          # Feature specifications
├── Makefile
└── README.md
```

## Troubleshooting

**Database connection fails**: Verify `DATABASE_URL` uses `postgresql+asyncpg://` scheme.

**Groq API returns 429**: Free tier rate limits apply. Backend auto-retries with exponential backoff (1s/2s/4s).

**CORS errors**: Ensure `FRONTEND_URL` matches the frontend origin exactly (including port).

**Frontend can't reach backend**: Check `NEXT_PUBLIC_API_URL` in `.env.local` and confirm the backend is running.
