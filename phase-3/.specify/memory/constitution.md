<!--
  Sync Impact Report
  ==================
  Version change: 1.0.0 → 1.1.0 (MINOR - new principle + expanded guidance)
  Modified principles:
    - None renamed or removed; all six originals preserved verbatim.
  Added sections:
    - Principle VII: UI/UX Excellence (new)
    - Page Structure (under Architectural Constraints)
    - Component Style Guide (under Architectural Constraints)
    - Frontend Stack expanded (Framer Motion, Zustand, Recharts,
      React Hook Form + Zod, Lucide React, Inter + Space Grotesk)
    - Visual Excellence success criteria
  Removed sections:
    - None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no update needed
      (Constitution Check is dynamic; new principle VII will be
      evaluated at plan time automatically)
    - .specify/templates/spec-template.md ✅ no update needed
      (spec template is generic; no constitution-specific tokens)
    - .specify/templates/tasks-template.md ✅ no update needed
      (task phases and categories are filled at task-generation time;
      UI/UX tasks will be generated under user story phases)
  Follow-up TODOs: none
-->

# Todo AI Chatbot Constitution

## Core Principles

### I. Stateless Architecture

- The server MUST maintain zero server-side session state.
- All conversation history MUST be stored in PostgreSQL (Neon).
- Each HTTP request MUST be independent and reproducible.
- The system MUST be horizontally scalable by design; adding
  instances MUST NOT require shared in-memory state.

**Rationale**: Statelessness enables horizontal scaling, simplifies
deployment, and eliminates a class of session-related bugs. Groq's
fast inference makes per-request context reconstruction viable.

### II. MCP-First Design

- All task operations MUST be exposed as MCP (Model Context
  Protocol) tools.
- The AI agent MUST use only MCP tools for data access; direct
  database queries from the agent layer are prohibited.
- Every MCP tool MUST be atomic, idempotent, and documented with
  input/output schemas.
- The data flow MUST follow: UI -> API -> Agent -> MCP Tools -> Database.

**Rationale**: MCP-first enforces a clean separation of concerns,
makes tool calls auditable, and allows swapping the AI provider
without touching data access logic.

### III. Modern Developer Experience

- Environment-based configuration MUST be used for all secrets and
  deployment-specific values (no hardcoded secrets).
- Local development MUST be achievable with a single command
  (`make dev` or equivalent).
- Comprehensive error handling and structured logging MUST be
  present on every API path.
- Inline code documentation MUST accompany all public functions.

**Rationale**: Low friction onboarding and clear conventions reduce
defect rates and accelerate feature delivery.

### IV. Production Quality

- Authentication MUST use Better Auth with session tokens.
- All database schema changes MUST go through Alembic migrations.
- CORS MUST be configured to whitelist only the frontend domain.
- Rate limiting MUST be enforced at 100 requests/minute per user.
- Input validation MUST use Pydantic models for all API inputs.

**Rationale**: Production quality is non-negotiable even in early
phases; retrofitting auth, migrations, and rate limiting is costly.

### V. Type Safety & Validation

- All data structures MUST be typed (TypeScript strict mode on the
  frontend, Python type hints + SQLModel on the backend).
- API request and response bodies MUST be validated by Pydantic
  models before processing.
- User-facing error messages MUST be friendly and MUST NOT expose
  internal details (stack traces, SQL, file paths).

**Rationale**: Type safety catches defects at build time, and
validated boundaries prevent malformed data from propagating.

### VI. Security by Default

- Users MUST only access their own tasks and conversations
  (user_id isolation enforced at the query layer).
- SQL injection MUST be prevented via SQLModel/SQLAlchemy
  parameterized queries; raw SQL is prohibited.
- Secrets MUST reside in `.env` files and MUST NOT be committed
  to version control.
- Exponential backoff MUST be implemented for Groq 429 (rate
  limit) errors.

**Rationale**: Security is a constraint, not a feature. Defaults
must be secure so that the fast path is also the safe path.

### VII. UI/UX Excellence

- The frontend MUST implement a custom design language with
  consistent spacing, colors, and typography; generic templates
  are prohibited.
- Dark mode and light mode MUST both be fully functional with
  system preference detection and a manual toggle.
- All pages MUST be mobile-first and responsive across phone,
  tablet, and desktop breakpoints.
- The UI MUST comply with WCAG 2.1 AA: keyboard navigation,
  visible focus indicators, and ARIA labels on all interactive
  elements.
- Page transitions and interactive elements MUST use Framer
  Motion animations for a polished feel.
- Async content MUST display skeleton loading screens; spinners
  are prohibited as the primary loading indicator.
- The chat interface MUST use OpenAI ChatKit, styled to match
  the application's design system.
- Error boundaries MUST wrap all React component trees to catch
  and display errors gracefully.
- All pages MUST include SEO metadata (title, description,
  Open Graph).

**Rationale**: A production-grade product demands visual polish
equal to its technical quality. Users form trust through
consistent, accessible, and responsive interfaces. Mandating
ChatKit prevents custom chat UI drift and ensures a maintained,
tested component library powers the core feature.

## Technology Mandates

### Frontend Stack

| Concern           | Choice                                    |
|-------------------|-------------------------------------------|
| Framework         | Next.js 14+ (App Router)                  |
| UI Library        | OpenAI ChatKit (domain-allowlisted)       |
| Component Library | shadcn/ui + custom components             |
| Styling           | Tailwind CSS                              |
| Animations        | Framer Motion                             |
| Icons             | Lucide React                              |
| Forms             | React Hook Form + Zod validation          |
| State Management  | Zustand (theme, user preferences)         |
| Charts            | Recharts (dashboard statistics)           |
| Typography        | Inter (body), Space Grotesk (headings)    |
| Type Safety       | TypeScript strict mode                    |

### Backend Stack

| Concern           | Choice                                    |
|-------------------|-------------------------------------------|
| Framework         | FastAPI (async/await)                     |
| AI SDK            | OpenAI Agents SDK with Groq as provider   |
| MCP               | Official Python MCP SDK                   |
| ORM               | SQLModel (Pydantic + SQLAlchemy)          |
| Database          | Neon Serverless PostgreSQL                |
| Auth              | Better Auth                               |
| Package Manager   | uv                                        |

### Deployment

| Concern           | Choice                                    |
|-------------------|-------------------------------------------|
| Frontend          | Vercel (OpenAI domain allowlist)          |
| Backend           | Railway / Render / Fly.io                 |
| Database          | Neon (serverless Postgres)                |

## Architectural Constraints & Code Style

### Page Structure

The application MUST implement the following seven pages:

| Route        | Purpose                                       |
|--------------|-----------------------------------------------|
| `/`          | Landing page with hero section, features, CTA |
| `/login`     | Login form with Better Auth                   |
| `/signup`    | Signup with email verification                |
| `/dashboard` | User task overview (stats, recent tasks)      |
| `/chat`      | OpenAI ChatKit interface (main feature)       |
| `/settings`  | Profile, preferences, theme toggle            |
| `/tasks`     | Full task list view (filterable, sortable)    |

### Component Style Guide

- **Color Palette**: Light mode (white background, blue primary
  `hsl(221.2, 83.2%, 53.3%)`) and dark mode (near-black background
  `hsl(222.2, 84%, 4.9%)`, lighter blue primary
  `hsl(217.2, 91.2%, 59.8%)`).
- **Cards**: Subtle shadows, 12px border-radius, hover effects.
- **Buttons**: Primary (gradient), Secondary (outline), Ghost.
- **Inputs**: Focus rings, error states, inline validation.
- **Chat Bubbles**: User messages right-aligned with gradient
  background; AI messages left-aligned with muted background.
- **Typography**: Fluid sizing with `clamp()`; line-height 1.5
  for body, 1.2 for headings.

### Architectural Constraints

1. **Single Chat Endpoint**: `POST /api/{user_id}/chat` handles
   all interactions.
2. **Tool Call Transparency**: API responses MUST include which
   MCP tools were invoked.
3. **Conversation Resume**: Server restarts MUST NOT lose
   conversation history.
4. **User Isolation**: Tasks and conversations MUST be strictly
   scoped to `user_id`.
5. **Groq Rate Limits**: Implement exponential backoff for 429
   errors.

### Code Style - Python

- Black formatter (line length 100)
- isort for import ordering
- Type hints required on all functions
- Docstrings required on all public functions
- Async/await for all I/O operations

### Code Style - TypeScript / React

- ESLint with Airbnb config
- Prettier formatting
- Functional components only (no class components)
- Custom hooks for reusable logic
- Error boundaries for resilience

### Performance Targets

| Metric                     | Budget       |
|----------------------------|-------------|
| Time to First Byte (TTFB)  | < 500 ms    |
| AI Response Stream Start    | < 1 s (Groq)|
| Database Query Time         | < 100 ms    |
| Frontend Bundle (gzipped)   | < 200 KB    |
| Lighthouse Performance      | > 90        |
| Lighthouse Accessibility    | > 95        |

### Monitoring & Observability

- Log all MCP tool calls with timestamps.
- Track Groq API latency and token usage.
- Capture database query performance metrics.
- Frontend error tracking (e.g., Sentry).

### Success Criteria

**Visual Excellence**: Unique design (not recognizable as a
template), smooth Framer Motion animations on page transitions and
hover states, seamless dark/light mode toggle, ChatKit styled to
match the app theme, mobile hamburger navigation.

**Functional**: Natural language CRUD, persistent conversation
history, multi-user isolation, streaming responses (ChatKit),
graceful error handling, all seven pages working.

**Quality**: < 2 s response for simple queries, mobile-responsive
UI, WCAG 2.1 AA accessible, 100 % type coverage, zero runtime
errors on the happy path, Lighthouse Performance > 90 and
Accessibility > 95, works on Chrome/Firefox/Safari.

**DX**: One-command local setup, clear project structure, inline
docs, deployment guide in README.

### Out of Scope (Phase III)

- Real-time collaboration
- Task due dates and reminders
- File attachments
- Mobile native app
- OAuth social login (email/password via Better Auth only)

## Governance

- This constitution is the authoritative source for all
  implementation decisions in the Todo AI Chatbot project.
- Amendments MUST be documented with a rationale, approved by
  the project lead, and accompanied by a migration plan for any
  affected artifacts.
- All pull requests and code reviews MUST verify compliance with
  the principles above.
- Complexity beyond what is described here MUST be justified in
  an Architecture Decision Record (ADR).
- Version increments follow semantic versioning:
  - **MAJOR**: Principle removal or backward-incompatible
    redefinition.
  - **MINOR**: New principle or materially expanded guidance.
  - **PATCH**: Clarification, wording, or typo fix.

**Version**: 1.1.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-06
