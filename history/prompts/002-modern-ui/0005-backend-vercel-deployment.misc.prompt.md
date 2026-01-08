---
id: 0005
title: Backend Vercel Deployment
stage: misc
date: 2026-01-08
surface: agent
model: claude-opus-4-5-20251101
feature: 002-modern-ui
branch: 002-modern-ui
user: Umer-Ali7
command: general
labels: ["deployment", "vercel", "backend", "fastapi", "serverless"]
links:
  spec: specs/002-modern-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/vercel.json
  - backend/api/index.py
  - backend/requirements.txt
  - backend/app/config.py
  - backend/app/main.py
tests:
  - curl https://backend-three-cyan-25.vercel.app/ (passed)
  - curl https://backend-three-cyan-25.vercel.app/health (passed)
  - curl https://backend-three-cyan-25.vercel.app/docs (passed)
---

## Prompt

User requested to deploy the backend to Vercel and create history records for both frontend and backend deployments.

## Response snapshot

### Backend Vercel Configuration

Created the following files for Vercel Python serverless deployment:

1. **vercel.json** - Vercel configuration
```json
{
  "version": 2,
  "builds": [{ "src": "api/index.py", "use": "@vercel/python" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.py" }]
}
```

2. **api/index.py** - Entry point for serverless function
```python
import sys, os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
os.chdir(parent_dir)
from app.main import app
app = app
```

3. **requirements.txt** - Dependencies for Vercel

### Code Changes

1. **backend/app/config.py**: Fixed pydantic-settings to handle missing .env file:
   - Changed `env_file=".env"` to `env_file=".env" if os.path.exists(".env") else None`

2. **backend/app/main.py**: Updated CORS to support multiple origins:
   - Added `allowed_origins` setting (comma-separated list)
   - Parse origins from environment variable

### Environment Variables Set on Vercel

| Variable | Value |
|----------|-------|
| DATABASE_URL | (Neon PostgreSQL connection string) |
| BETTER_AUTH_SECRET | (Auth secret key) |
| ALLOWED_ORIGINS | http://localhost:3000,https://frontend-theta-flax-97.vercel.app |

### Deployed URLs

- **Backend**: https://backend-three-cyan-25.vercel.app
- **Frontend**: https://frontend-theta-flax-97.vercel.app

### API Endpoints Verified

| Endpoint | Response |
|----------|----------|
| GET / | `{"status":"healthy","app":"Hackathon Todo API","version":"1.0.0"}` |
| GET /health | `{"status":"ok"}` |
| GET /docs | Swagger UI |

## Outcome

- Impact: Full-stack application now deployed to Vercel
- Tests: All health check endpoints passed
- Files: 5 files created/modified
- Next prompts: Test authentication flow, test task CRUD operations
- Reflection: Vercel Python serverless requires careful path management for imports

## Evaluation notes (flywheel)

- Failure modes observed: Initial FUNCTION_INVOCATION_FAILED due to import path issues and .env file handling
- Graders run and results (PASS/FAIL): curl health checks - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add proper error handling for database connection failures
