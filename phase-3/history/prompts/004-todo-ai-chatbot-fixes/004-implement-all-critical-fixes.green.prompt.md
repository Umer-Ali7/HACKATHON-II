---
id: 004
title: Implement All Critical Fixes and Agent SDK Migration
stage: green
date: 2026-02-08
surface: agent
model: claude-opus-4-6
feature: 004-todo-ai-chatbot-fixes
branch: 004-todo-ai-chatbot-fixes
user: architect
command: /sp.implement
labels: ["implementation", "database", "auth", "frontend", "agents-sdk", "groq"]
links:
  spec: specs/004-todo-ai-chatbot-fixes/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/core/config.py
  - backend/app/core/database.py
  - backend/app/main.py
  - backend/app/api/schemas.py
  - backend/app/api/routes/auth.py
  - backend/app/agents/todo_agent.py
  - backend/.env
  - frontend/.env.local
  - frontend/lib/api.ts
  - frontend/lib/store.ts
  - frontend/hooks/useAuth.ts
  - frontend/app/(auth)/login/page.tsx
  - frontend/app/(auth)/signup/page.tsx
  - specs/004-todo-ai-chatbot-fixes/tasks.md
tests:
  - "T007: Backend startup creates database tables (PASS)"
  - "T011: Signup returns 200, Login correct 200, Login wrong 401, Duplicate 400 (ALL PASS)"
  - "T017: Frontend build succeeds with zero TypeScript errors (PASS)"
  - "T021: Agent SDK + Groq creates task via chat endpoint (PASS)"
  - "T022: Full-stack smoke test - all 7 endpoints verified (PASS)"
---

## Prompt

/sp.implement

## Response snapshot

Executed all 24 tasks across 6 phases from tasks.md:

**Phase 1 (Setup - T001-T004):** Installed passlib[bcrypt] (pinned bcrypt<5 for compatibility), added AUTH_SECRET to config.py and .env, created frontend/.env.local.

**Phase 2 (Database - T005-T007):** Added `create_db_and_tables()` async function to database.py using `SQLModel.metadata.create_all`. Added lifespan handler to main.py that calls it on startup. Verified tables auto-create in Neon PostgreSQL.

**Phase 3 (Auth - T008-T011):** Added SignupRequest/LoginRequest/AuthResponse schemas. Created auth.py with POST /api/auth/signup (bcrypt hash, email uniqueness) and POST /api/auth/login (password verification). Verified all 4 test scenarios pass.

**Phase 4 (Frontend - T012-T017):** Cleared .next cache. Added signup/login API functions to api.ts. Updated store.ts and useAuth.ts to include token. Updated login and signup pages to call backend API instead of client-side-only slug generation. Frontend build passes with all routes present.

**Phase 5 (Agent SDK - T018-T021):** Rewrote todo_agent.py to use OpenAI Agents SDK. Created 5 @function_tool wrappers for MCP tools. Used OpenAIChatCompletionsModel with AsyncOpenAI client pointing to Groq. Used Runner.run() for agent execution. Disabled tracing (no OpenAI key). Fixed Groq schema validation issue (list_tasks_tool needed parameters).

**Phase 6 (Polish - T022-T024):** Ran full-stack integration smoke test - all 7 API endpoints verified working. Database persistence confirmed in Neon.

**Key fix discovered during implementation:** bcrypt 5.0.0 is incompatible with passlib - downgraded to bcrypt 4.3.0.

## Outcome

- ✅ Impact: All 4 user stories implemented. 3 P1 bugs fixed + P2 Agent SDK migration complete. 24/24 tasks done.
- 🧪 Tests: 5 checkpoint verifications passed (database startup, auth endpoints, frontend build, agent SDK, full-stack smoke)
- 📁 Files: 14 files created/modified (6 backend, 1 new route, 5 frontend, 2 env files)
- 🔁 Next prompts: /sp.git.commit_pr to commit and create PR
- 🧠 Reflection: bcrypt 5.x/passlib incompatibility was the only unexpected blocker. The Groq schema validation for parameterless tools was a second issue. Both resolved quickly.

## Evaluation notes (flywheel)

- Failure modes observed: bcrypt 5.0 broke passlib (AttributeError on __about__); Groq rejects tools with empty parameters schema
- Graders run and results (PASS/FAIL): All 5 phase checkpoints PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add JWT token generation instead of temp_token placeholder
