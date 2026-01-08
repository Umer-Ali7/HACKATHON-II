---
id: 0001
title: Initial constitution creation
stage: constitution
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: anzal
command: /sp.constitution
labels: ["constitution", "setup", "architecture", "standards"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

ARCHITECTURE PRINCIPLES:
- Separation of Concerns: Frontend (Next.js) and backend (FastAPI) are independent services
- API-First Design: Backend exposes RESTful API, frontend consumes it
- Stateless Authentication: JWT tokens, no server-side sessions
- Type Safety: TypeScript in frontend, Pydantic models in backend
- Database as Single Source of Truth: All state persists to Neon PostgreSQL

TECHNOLOGY CONSTRAINTS:
- Python 3.13+ with uv for backend dependency management
- Next.js 16+ App Router (NOT Pages Router)
- SQLModel for ORM (NOT raw SQL or other ORMs)
- Better Auth for authentication (NOT NextAuth or custom)
- Neon Serverless PostgreSQL (NOT local Postgres)
- FastAPI for REST API (NOT Flask or Django)

CODE STANDARDS:
- No manual code until specs are validated
- All API endpoints MUST filter by authenticated user_id
- All database queries MUST use SQLModel
- All components MUST use TypeScript with proper types
- All API responses MUST use Pydantic models for validation
- Error handling with proper HTTP status codes

SECURITY RULES:
- All API endpoints require JWT authentication
- User data isolation (users can only see their own tasks)
- JWT secret must match between frontend and backend
- Environment variables for all secrets (never hardcoded)
- CORS configured to allow frontend domain only

PERFORMANCE REQUIREMENTS:
- API response time < 200ms for CRUD operations
- Frontend initial load < 2 seconds
- Database queries must use proper indexes
- Use database connection pooling

TESTING STANDARDS:
- Unit tests for all business logic
- Integration tests for API endpoints
- Test user isolation thoroughly
- Test authentication flow end-to-end

## Response snapshot

Created comprehensive constitution v1.0.0 for Hackathon Todo Phase II with:

1. **Core Principles (5 principles)**:
   - Separation of Concerns (frontend/backend independence)
   - API-First Design (REST API as primary interface)
   - Stateless Authentication (JWT-based)
   - Type Safety Everywhere (TypeScript + Pydantic)
   - Database as Single Source of Truth (Neon PostgreSQL)

2. **Technology Stack Constraints**:
   - Mandatory technologies defined (Python 3.13+, FastAPI, SQLModel, Next.js 16+, Better Auth)
   - Forbidden patterns listed (raw SQL, session auth, Pages Router, hardcoded secrets)

3. **Code Quality Standards**:
   - API implementation standards (user filtering, Pydantic validation, HTTP status codes)
   - Frontend implementation standards (TypeScript strict mode, proper types, error handling)
   - Multi-layer validation requirements

4. **Security Standards**:
   - Authentication & authorization rules (JWT verification, user isolation)
   - Data protection requirements (environment variables, no hardcoded secrets)
   - CORS configuration guidelines

5. **Performance Standards**:
   - Response time requirements (< 200ms API, < 2s frontend load)
   - Optimization requirements (indexes, connection pooling, efficient queries)

6. **Testing Standards**:
   - Unit testing requirements (80% coverage for business logic)
   - Integration testing requirements (API endpoints, user isolation)
   - E2E testing requirements (auth flow, critical paths)
   - Test execution standards (test-first, automated, isolated, repeatable)

7. **Governance**:
   - Constitution authority and amendment process
   - Compliance verification requirements
   - Complexity justification process

All principles are declarative with clear MUST/MUST NOT requirements and rationale for each.

## Outcome

- ✅ Impact: Established foundational governance document that defines all architectural, technical, security, and quality standards for the project
- 🧪 Tests: none - constitution is a governance document
- 📁 Files: 1 file created (.specify/memory/constitution.md)
- 🔁 Next prompts: /sp.specify to create feature specifications aligned with constitution principles
- 🧠 Reflection: Constitution provides clear, measurable standards. All principles are testable and enforceable. Ready to guide feature specifications and implementation planning.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - all placeholders filled, principles are declarative and testable, includes rationale
- Prompt variant (if applicable): standard-constitution-v1
- Next experiment (smallest change to try): Create first feature spec to validate constitution applies cleanly to real features
