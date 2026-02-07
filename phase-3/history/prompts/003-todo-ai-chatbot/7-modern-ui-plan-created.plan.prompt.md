---
id: 7
title: Modern UI Plan Created
stage: plan
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: 003-todo-ai-chatbot
branch: 003-todo-ai-chatbot
user: architect
command: /sp.plan
labels: ["plan", "modern-ui", "chatkit", "framer-motion", "dark-mode", "7-pages"]
links:
  spec: specs/003-todo-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-todo-ai-chatbot/plan.md
  - specs/003-todo-ai-chatbot/research.md
  - specs/003-todo-ai-chatbot/data-model.md
  - specs/003-todo-ai-chatbot/contracts/openapi.yaml
  - specs/003-todo-ai-chatbot/quickstart.md
tests:
  - n/a
---

## Prompt

Todo AI Chatbot - Implementation Plan (Modern UI Edition). Create a detailed implementation plan with 14 phases covering project setup, landing page, authentication, dashboard layout/sidebar, dashboard page, chat with ChatKit, tasks page, settings page, dark/light mode polish, animations/polish, mobile responsiveness, backend MCP/Groq, deployment, and documentation. Include code examples for all major components and integration patterns.

## Response snapshot

Rewrote all 5 plan artifacts for the Modern UI Edition:

**plan.md**: Updated Technical Context with full frontend stack (13 dependencies). Constitution Check now validates all 7 principles including new Principle VII (UI/UX Excellence). Project structure expanded: backend adds 4 new route files (tasks.py, stats.py, conversations.py, profile.py) and user.py model; frontend organized into route groups ((auth) for login/signup, (dashboard) for authenticated pages) with 25+ component files across layout/, home/, chat/, dashboard/, tasks/, settings/ directories. Added Frontend Architecture section documenting theme system flow, route groups, component hierarchy, and 10-item animation inventory with triggers and durations. Added ChatKit domain key fallback error handling. Both pre-design and post-design constitution gates PASS for all 7 principles.

**research.md**: Expanded from 8 to 12 research decisions. Key new findings: R6 corrected ChatKit package to @openai/chatkit-react (not @openai/chatkit), documented useChatKit() hook API and dual-mode integration approach. R7 documents next-themes setup with suppressHydrationWarning. R8 inventories all Framer Motion animations with performance guidance. R9 maps 12 shadcn/ui components to page requirements. R12 specifies Recharts area chart for dashboard activity data.

**data-model.md**: Added User entity (id, email, hashed_password, display_name, theme_preference) managed by Better Auth. Added tool_calls JSON field to Message entity. Now 4 entities total.

**contracts/openapi.yaml**: Expanded from 2 endpoints to 11 (v2.0.0). Added: GET/POST tasks, PATCH/DELETE tasks/{id}, GET stats, GET conversations, GET messages, GET/PATCH profile. Added 6 new schema definitions (TaskResponse, CreateTaskRequest, UpdateTaskRequest, StatsResponse, ConversationResponse, MessageResponse, ProfileResponse, UpdateProfileRequest).

**quickstart.md**: Added ChatKit domain setup instructions, NEXT_PUBLIC_OPENAI_DOMAIN_KEY env var, dark mode troubleshooting section.

## Outcome

- ✅ Impact: Complete implementation plan for Modern UI Edition with all design artifacts
- 🧪 Tests: n/a (planning document)
- 📁 Files: plan.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md all updated
- 🔁 Next prompts: /sp.tasks to generate task list, then /sp.implement to execute
- 🧠 Reflection: ChatKit research revealed significant API differences from user's assumptions (package name, component structure, state management). Dual-mode approach (custom fallback + ChatKit) resolves domain key dependency for development.

## Evaluation notes (flywheel)

- Failure modes observed: setup-plan.ps1 resolved paths to parent directory (worked around by using direct file reads). update-agent-context.ps1 template not found (non-blocking, optional).
- Graders run and results (PASS/FAIL): Constitution gate PASS for all 7 principles (pre-design and post-design).
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
