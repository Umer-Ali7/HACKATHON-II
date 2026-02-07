---
id: 1
title: Todo AI Chatbot Constitution Ratified
stage: constitution
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: none
branch: main
user: Administrator
command: /sp.constitution
labels: ["constitution", "governance", "project-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

# Todo AI Chatbot - Project Constitution

## Project Overview
Build a production-ready AI-powered todo management chatbot with natural language interface using MCP (Model Context Protocol) architecture, Groq AI for fast inference, and modern UI components.

## Core Principles

### 1. Stateless Architecture
- Zero server-side session state
- All conversation history stored in PostgreSQL
- Each request is independent and reproducible
- Horizontally scalable by design

### 2. MCP-First Design
- All task operations exposed as MCP tools
- AI agent uses only MCP tools (no direct DB access)
- Tools are atomic, idempotent, and well-documented
- Clear separation: UI → API → Agent → MCP Tools → Database

### 3. Modern Developer Experience
- Type-safe throughout (TypeScript frontend, Python with SQLModel)
- Environment-based configuration (no hardcoded secrets)
- Comprehensive error handling and logging
- Easy local development setup

### 4. Production Quality
- Proper authentication (Better Auth)
- Database migrations with Alembic
- CORS configuration for security
- Rate limiting on API endpoints
- Input validation and sanitization

## Technology Mandates

### Frontend Stack
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: OpenAI ChatKit (domain-allowlisted)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Server Components + Client hooks
- **Type Safety**: TypeScript strict mode

### Backend Stack
- **Framework**: FastAPI (async/await)
- **AI SDK**: OpenAI Agents SDK with **Groq** as provider
- **MCP**: Official Python MCP SDK
- **ORM**: SQLModel (Pydantic + SQLAlchemy)
- **Database**: Neon Serverless PostgreSQL
- **Auth**: Better Auth
- **Package Manager**: uv (for fast dependency management)

### Deployment
- **Frontend**: Vercel (with OpenAI domain allowlist)
- **Backend**: Railway/Render/Fly.io
- **Database**: Neon (serverless Postgres)

## Non-Negotiables

1. **No Manual State Management**: Server must be stateless
2. **Groq for AI**: Use Groq API with OpenAI-compatible interface for 10x faster responses
3. **MCP Tools Only**: Agent cannot directly access database
4. **Type Safety**: All data structures must be typed
5. **Error Messages**: User-friendly, never expose internals
6. **Migrations**: All schema changes via Alembic
7. **Environment Vars**: All secrets in .env files
8. **README Quality**: Must include setup, deployment, and troubleshooting

## Success Criteria

### Functional Requirements
- Natural language task management (CRUD operations)
- Persistent conversation history across sessions
- Multi-user support with user_id isolation
- Real-time streaming responses (via ChatKit)
- Graceful error handling with helpful messages

### Quality Requirements
- Response time <2s for simple queries (Groq advantage)
- Mobile-responsive UI
- Accessible (WCAG 2.1 AA)
- 100% type coverage
- Zero runtime errors on happy path

### Developer Experience
- One-command local setup (`make dev`)
- Clear project structure
- Inline code documentation
- Deployment guide in README

## Out of Scope (Phase III)
- Real-time collaboration
- Task prioritization/sorting
- Due dates and reminders
- File attachments
- Mobile native app
- OAuth social login (only email/password via Better Auth)

## Architectural Constraints

1. **Single Chat Endpoint**: POST /api/{user_id}/chat handles everything
2. **Tool Call Transparency**: API response includes which MCP tools were invoked
3. **Conversation Resume**: Server restart must not lose history
4. **User Isolation**: Tasks and conversations strictly scoped to user_id
5. **Groq Rate Limits**: Implement exponential backoff for 429 errors

## Code Style Guidelines

### Python
- Black formatter (line length 100)
- isort for imports
- Type hints required
- Docstrings for all public functions
- Async/await for I/O operations

### TypeScript/React
- ESLint with Airbnb config
- Prettier formatting
- Functional components only
- Custom hooks for reusable logic
- Error boundaries for resilience

## Security Requirements

1. **Authentication**: Better Auth with session tokens
2. **Authorization**: User can only access their own tasks/conversations
3. **Input Validation**: Pydantic models validate all inputs
4. **SQL Injection**: SQLModel/SQLAlchemy prevents this
5. **CORS**: Whitelist only frontend domain
6. **Secrets**: Never commit .env files
7. **Rate Limiting**: 100 requests/minute per user

## Performance Targets

- **Time to First Byte (TTFB)**: <500ms
- **AI Response Stream Start**: <1s (Groq)
- **Database Query Time**: <100ms
- **Frontend Bundle Size**: <200KB (gzipped)
- **Lighthouse Score**: >90 (all categories)

## Monitoring & Observability

- Log all MCP tool calls with timestamps
- Track Groq API latency and token usage
- Database query performance metrics
- Frontend error tracking (e.g., Sentry)

This constitution serves as the north star for all implementation decisions.

## Response snapshot

Created and ratified the Todo AI Chatbot constitution at version 1.0.0. Mapped 4 user-provided core principles into 6 declarative, testable principles: (I) Stateless Architecture, (II) MCP-First Design, (III) Modern Developer Experience, (IV) Production Quality, (V) Type Safety & Validation, (VI) Security by Default. Added Technology Mandates tables, Architectural Constraints, Code Style, Performance Targets, Monitoring, Success Criteria, Out of Scope, and Governance sections. All placeholder tokens replaced. Sync Impact Report embedded as HTML comment. All 3 dependent templates verified as compatible (no updates needed).

## Outcome

- ✅ Impact: Constitution ratified at v1.0.0 — establishes project governance
- 🧪 Tests: N/A (governance document, not code)
- 📁 Files: .specify/memory/constitution.md (created)
- 🔁 Next prompts: /sp.specify to create feature spec, /sp.plan for implementation plan
- 🧠 Reflection: User's 4 principles expanded to 6 to cover type safety and security as first-class principles; all sections use MUST/MUST NOT for testability

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual validation PASS — no unresolved placeholders, version matches report, dates ISO format
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
