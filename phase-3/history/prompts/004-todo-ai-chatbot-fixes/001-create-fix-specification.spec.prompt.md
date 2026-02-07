---
id: 1
title: Create Fix Specification
stage: spec
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 004-todo-ai-chatbot-fixes
branch: 004-todo-ai-chatbot-fixes
user: architect
command: /sp.specify
labels: ["spec", "fix", "database", "auth", "frontend", "agents-sdk"]
links:
  spec: specs/004-todo-ai-chatbot-fixes/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-todo-ai-chatbot-fixes/spec.md
  - specs/004-todo-ai-chatbot-fixes/checklists/requirements.md
tests:
  - none
---

## Prompt

# Todo AI Chatbot - Technical Specification (Fix Mode)

## Current Issues to Fix

1. **Database Issue**: Data not being inserted into Neon PostgreSQL
2. **Auth Issue**: Any password allows login (password verification broken)
3. **Frontend 404**: `/chat`, `/tasks`, `/settings` pages not found

## CRITICAL: OpenAI Agents SDK Integration

We are using the **official OpenAI Agents SDK** (https://openai.github.io/openai-agents-python/), NOT the generic OpenAI Python client.

The user provided a detailed technical specification with code examples for fixing 3 critical bugs (database connectivity with sync driver, bcrypt password hashing/verification, Next.js route group pages) and integrating the OpenAI Agents SDK with Groq as the AI provider.

## Response snapshot

Created feature branch `004-todo-ai-chatbot-fixes` and wrote a comprehensive fix specification at `specs/004-todo-ai-chatbot-fixes/spec.md` with:

- 4 user stories (P1: database persistence, P1: password verification, P1: frontend 404 fixes, P2: OpenAI Agents SDK integration)
- 14 functional requirements covering database, auth, frontend routing, and agent integration
- 6 measurable success criteria
- 6 edge cases identified
- Clear assumptions and out-of-scope boundaries
- Quality checklist created and validated (all items pass)

## Outcome

- Impact: Created fix specification for 3 critical bugs + 1 integration feature
- Tests: none (spec phase)
- Files: spec.md, checklists/requirements.md
- Next prompts: /sp.clarify or /sp.plan to proceed with implementation planning
- Reflection: Fix specs benefit from technology-specific language since they target known implementation bugs

## Evaluation notes (flywheel)

- Failure modes observed: create-new-feature.ps1 script failed on positional parameter but branch was created successfully; manual directory creation was needed as fallback
- Graders run and results (PASS/FAIL): Spec quality checklist - PASS (all items checked)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
