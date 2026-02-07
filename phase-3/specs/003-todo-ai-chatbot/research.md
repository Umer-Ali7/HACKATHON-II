# Research: Todo AI Chatbot (Modern UI Edition)

**Feature**: 003-todo-ai-chatbot
**Date**: 2026-02-06

## R1: Groq Model Selection

**Decision**: Use `llama-3.3-70b-versatile`

**Rationale**: This model offers the best balance of speed
(< 1 s time-to-first-token on Groq's inference engine) and
tool-calling accuracy. It reliably follows structured function
calling schemas, which is critical for our MCP tool integration.
The 70B parameter size provides sufficient reasoning capability
to interpret natural language task management commands.

**Alternatives considered**:
- `mixtral-8x7b-32768`: Faster but less reliable at complex
  tool-calling sequences (e.g., "list tasks then complete the
  first one").
- `llama-3.1-8b-instant`: Ultra-fast but too small for
  reliable intent disambiguation.

---

## R2: MCP Integration Pattern

**Decision**: Use stdio transport with in-process MCP server

**Rationale**: The OpenAI Agents SDK supports MCP servers via
stdio transport. Running the MCP server in-process (same Python
process as FastAPI) eliminates network latency between the agent
and the tools. For a single-backend deployment this is the simplest
and fastest approach.

**Alternatives considered**:
- SSE (Server-Sent Events) transport: Adds complexity with a
  separate MCP server process. Beneficial for multi-service
  architectures but overkill here.
- Direct function calls (no MCP): Violates constitution
  principle II (MCP-First Design). Rejected.

---

## R3: Database Driver

**Decision**: Use `asyncpg` via SQLAlchemy async engine

**Rationale**: Constitution principle I requires async/await for
all I/O operations. `asyncpg` is the fastest async PostgreSQL
driver for Python, with connection pooling built in. SQLModel
sits on top of SQLAlchemy, which supports async sessions natively.

**Alternatives considered**:
- `psycopg2` (sync): Violates async requirement. Would block
  the event loop.
- `psycopg3` (async): Viable, but less mature async ecosystem
  compared to asyncpg + SQLAlchemy.

**Dependencies to add**: `asyncpg`, `sqlalchemy[asyncio]`

---

## R4: Authentication Approach

**Decision**: Better Auth with session tokens

**Rationale**: Constitution mandates Better Auth. Session tokens
are the simplest approach for a chat UI where the user stays
logged in during a session. The backend validates the session
token on each request and extracts the `user_id`.

**Implementation notes**:
- For MVP/development, use a simple `user_id` path parameter
  (as specified in the API contract: `POST /api/{user_id}/chat`).
- Better Auth integration adds proper login/signup flow and
  session management.
- Phase order: Build with path-parameter user_id first, then
  layer Better Auth on top.

---

## R5: Rate Limiting

**Decision**: Use `slowapi` middleware

**Rationale**: `slowapi` is a lightweight rate-limiting library
built specifically for FastAPI/Starlette. It supports per-user
limits (using `user_id` as the key), returns standard 429
responses with `Retry-After` headers, and requires minimal
configuration.

**Configuration**: 100 requests/minute per `user_id`, as
specified in the constitution.

**Alternatives considered**:
- Redis-backed rate limiting: More scalable but adds an
  infrastructure dependency. Overkill for 50 concurrent users.
- Custom middleware: More work, less tested. No benefit over
  slowapi for our scale.

---

## R6: OpenAI ChatKit Integration

**Decision**: Use `@openai/chatkit-react` v1.4.0 with domain
key and `useChatKit()` hook

**Rationale**: ChatKit is a single all-in-one web component
(`<openai-chatkit>`) with a React wrapper. It manages its own
message state internally. The `useChatKit()` hook provides a
`control` object for programmatic access (set threads, send
messages, focus composer). ChatKit requires a domain key from
the OpenAI domain allowlist for production deployments.

**Key findings from research**:
- Package name is `@openai/chatkit-react` (NOT `@openai/chatkit`)
- It exports `<ChatKit>` component and `useChatKit()` hook
- NOT a component library with separate Thread/Message parts
- Manages its own state; provides imperative control API
- Theming via configuration object with colorScheme, accentColor,
  grayscale, and surface color overrides
- Domain key MUST be configured via `api.domainKey` in
  `useChatKit()` options

**Integration approach**:
1. Build a custom chat component with shadcn/ui for development
   (no domain key needed).
2. Create a ChatKit wrapper component that uses `useChatKit()`.
3. Support both modes: custom component (dev) and ChatKit (prod)
   based on whether `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` is set.

**ChatKit usage pattern**:
```typescript
import { ChatKit, useChatKit } from '@openai/chatkit-react';

function ChatPage() {
  const { control } = useChatKit({
    api: {
      url: process.env.NEXT_PUBLIC_API_URL + '/api/chatkit',
      domainKey: process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY,
    },
    theme: {
      colorScheme: resolvedTheme, // 'dark' or 'light'
      accentColor: '#2563eb',
    },
  });

  return <ChatKit control={control} className="h-full w-full" />;
}
```

**Alternatives considered**:
- Build custom chat UI only: Loses the polish and accessibility
  that ChatKit provides out of the box. Constitution mandates
  ChatKit (Principle VII).
- Start with ChatKit from day one: Blocked until domain key is
  available. Dual-mode approach unblocks development.

---

## R7: Frontend Theme System

**Decision**: Use `next-themes` with `attribute="class"` and
Tailwind CSS `darkMode: 'selector'`

**Rationale**: `next-themes` is the de facto standard for
theming in Next.js App Router applications. It handles system
preference detection, localStorage persistence, and prevents
flash of unstyled content. Combined with Tailwind's class-based
dark mode and CSS custom properties, it provides the exact
color system mandated by the constitution.

**Key implementation details**:
- ThemeProvider wraps the app in `app/providers.tsx` (client
  component)
- `<html suppressHydrationWarning>` prevents hydration warnings
- `useTheme()` hook for components that need theme-aware logic
- Zustand store NOT needed for theme (next-themes handles
  persistence); Zustand reserved for user preferences only
- Tailwind 4.x uses `darkMode: 'selector'` instead of `'class'`

**CSS custom properties approach**:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
}
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
}
```

**Alternatives considered**:
- Zustand-based theming: Extra complexity for no benefit when
  next-themes already persists in localStorage.
- CSS-only prefers-color-scheme: No manual toggle support.

---

## R8: Framer Motion for Animations

**Decision**: Use `framer-motion` for page transitions, scroll
animations, and micro-interactions

**Rationale**: Framer Motion is the most mature React animation
library with first-class support for layout animations, exit
animations, and scroll-triggered effects. Constitution mandates
Framer Motion (Principle VII, Technology Mandates).

**Animation inventory**:
- Page transitions: fade + slide-up (opacity 0→1, y 20→0)
- Feature cards: stagger animation on scroll (IntersectionObserver)
- Demo preview: typing effect (character-by-character with cursor)
- Stat cards: animated number counter (useMotionValue + animate)
- Button hovers: scale 1.02 + shadow lift
- Card hovers: translateY -4px + shadow increase
- Sidebar: slide-in/out on mobile (x -100% → 0)

**Performance considerations**:
- Use `motion.div` only on animated elements (not wrappers)
- Prefer `transform` and `opacity` (GPU-accelerated)
- Use `layout` prop sparingly (triggers layout recalculations)
- Set `will-change: transform` on frequently animated elements

---

## R9: shadcn/ui Component Selection

**Decision**: Install the following shadcn/ui components

**Components needed** (mapped to page requirements):
- `button` — Primary, secondary, ghost variants (all pages)
- `input` — Login, signup, search, settings forms
- `card` — Stat cards, feature cards, form containers
- `dialog` — Delete confirmation, new task modal
- `dropdown-menu` — Task filter dropdown
- `avatar` — User avatar in sidebar and settings
- `badge` — Tool call indicators, task status badges
- `skeleton` — Loading placeholders (all async content)
- `toast` — Success/error notifications
- `sheet` — Mobile sidebar overlay
- `tabs` — Settings page tab navigation
- `checkbox` — Task completion toggle

**Custom components to build on top**:
- `Navbar.tsx` — Sticky blur header for landing page
- `Sidebar.tsx` — Collapsible nav for authenticated pages
- `StatCard.tsx` — Animated stat display for dashboard
- `TaskItem.tsx` — Checkbox + inline edit + actions
- `ErrorBoundary.tsx` — React error boundary wrapper
- `PageTransition.tsx` — Framer Motion page wrapper

---

## R10: Conversation History Management

**Decision**: Load last 50 messages per request

**Rationale**: Groq's llama-3.3-70b-versatile supports a
128K token context window, but loading excessive history
increases latency and cost. 50 messages (approximately
25 user-assistant pairs) provide sufficient context for
a todo management conversation. This aligns with the
spec assumption of 50 messages max.

**Implementation**: Query `Message` table filtered by
`conversation_id`, ordered by `created_at DESC`, limit 50,
then reverse for chronological order.

---

## R11: Exponential Backoff Strategy

**Decision**: 3 retries with 1s, 2s, 4s delays for Groq 429 errors

**Rationale**: Groq's free tier has aggressive rate limits.
Exponential backoff with a maximum of 3 retries (total max
wait: 7 seconds) keeps the user experience within the
5-second error response threshold (SC-011) while giving
the rate limit time to reset.

**Implementation**: Use `tenacity` library or manual retry
loop in the agent runner function. Only retry on 429 and
5xx errors; fail immediately on 4xx client errors.

---

## R12: Dashboard Charts

**Decision**: Use `recharts` for activity chart

**Rationale**: Constitution mandates Recharts. It is the most
popular React charting library, supports responsive containers,
and integrates well with Tailwind's color system via CSS custom
properties.

**Chart specification**:
- Type: Area chart (line with gradient fill)
- X-axis: Last 7 days (date labels)
- Y-axis: Tasks completed per day
- Colors: Use `--primary` CSS variable for fill/stroke
- Responsive: Use `<ResponsiveContainer>` wrapper
- Dark mode: Axis text color from `--foreground`

**Data source**: New backend endpoint
`GET /api/{user_id}/stats` returns daily completion counts.
