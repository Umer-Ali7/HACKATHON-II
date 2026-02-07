---
id: 2
title: Implementation Plan Emergency Fixes
stage: plan
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 004-todo-ai-chatbot-fixes
branch: 004-todo-ai-chatbot-fixes
user: architect
command: /sp.plan
labels: ["plan", "database-fix", "auth-fix", "frontend-404", "agents-sdk", "emergency"]
links:
  spec: specs/004-todo-ai-chatbot-fixes/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-todo-ai-chatbot-fixes/plan.md
  - specs/004-todo-ai-chatbot-fixes/research.md
  - specs/004-todo-ai-chatbot-fixes/data-model.md
  - specs/004-todo-ai-chatbot-fixes/quickstart.md
  - specs/004-todo-ai-chatbot-fixes/contracts/auth-api.yaml
tests:
  - none
---

## Prompt

User requested /sp.plan with a detailed emergency fix implementation plan targeting a 10 PM deadline. The plan covered 6 phases: database fix, auth fix, frontend 404 fix, OpenAI Agents SDK integration, integration testing, and final polish. User provided specific bash commands, code snippets, and success checklists.

## Response snapshot

Generated comprehensive implementation plan with 5 key artifacts:

1. **plan.md** - Full implementation plan with 5 phases, constitution check, risk analysis, and emergency shortcuts. Key architectural decisions:
   - Keep asyncpg (NOT switch to psycopg2) - entire codebase is async, switching would require 12+ file rewrites
   - Use passlib bcrypt (NOT Better Auth) for emergency auth fix
   - Use OpenAIChatCompletionsModel for Groq integration (Groq doesn't support Responses API)
   - Frontend 404 is likely auth guard redirect + build cache, NOT missing files

2. **research.md** - 5 research tasks resolving all unknowns (async vs sync driver, Agents SDK Groq config, bcrypt on Windows, 404 root cause, User ID strategy)

3. **data-model.md** - Entity documentation, state transitions, validation rules. No schema changes needed - hashed_password field exists but was unused.

4. **contracts/auth-api.yaml** - OpenAPI 3.1 spec for new POST /api/auth/signup and POST /api/auth/login endpoints

5. **quickstart.md** - Developer setup guide with verification steps and troubleshooting

## Outcome

- Impact: Created complete implementation plan for 3 P1 bug fixes + 1 P2 SDK migration
- Tests: none (plan phase)
- Files: plan.md, research.md, data-model.md, quickstart.md, contracts/auth-api.yaml
- Next prompts: /sp.tasks to generate implementation tasks, then /sp.implement to execute
- Reflection: Critical discovery that async->sync driver switch would be a scope explosion; existing code is 100% async. The user's spec assumed sync was needed but the real fix is adding table auto-creation.

## Evaluation notes (flywheel)

- Failure modes observed: setup-plan.ps1 resolved paths to parent repo root; update-agent-context.ps1 failed for same reason
- Graders run and results (PASS/FAIL): Constitution check - PASS with 1 justified deviation (passlib instead of Better Auth)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
