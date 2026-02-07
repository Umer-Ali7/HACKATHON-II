---
id: 2
title: Amend Constitution Modern UI
stage: constitution
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: none
branch: 003-todo-ai-chatbot
user: architect
command: /sp.constitution
labels: ["constitution", "ui-ux", "amendment", "modern-ui"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - n/a
---

## Prompt

# Todo AI Chatbot - Project Constitution (Modern UI Edition)

## Project Overview
Build a **production-grade** AI-powered todo management chatbot with:
- **Stunning modern UI** with dark/light mode
- **Multiple polished pages** (Home, Login, Signup, Dashboard, Chat, Settings)
- **OpenAI ChatKit** for chat interface with streaming responses
- **Groq AI** for lightning-fast inference
- **MCP architecture** for scalable tool-based interactions

## Core Design Philosophy

### 1. UI/UX Excellence
- **Design System**: Custom design language with consistent spacing, colors, and typography
- **Component Library**: shadcn/ui + custom components (NOT generic templates)
- **Animations**: Framer Motion for smooth transitions
- **Responsiveness**: Mobile-first, works flawlessly on all devices
- **Accessibility**: WCAG 2.1 AA compliant (keyboard nav, screen readers)
- **Dark/Light Mode**: System preference detection + manual toggle

### 2. Page Structure
```
/ (Home)           -> Landing page with hero, features, CTA
/login             -> Clean login form with Better Auth
/signup            -> Signup with email verification
/dashboard         -> User's task overview (stats, recent tasks)
/chat              -> OpenAI ChatKit interface (main feature)
/settings          -> Profile, preferences, theme toggle
/tasks             -> Full task list view (filterable, sortable)
```

### 3. Modern UI Requirements

#### Color Palette (Dark + Light Modes)
Light Mode: white bg, blue primary hsl(221.2, 83.2%, 53.3%)
Dark Mode: near-black bg hsl(222.2, 84%, 4.9%), lighter blue primary hsl(217.2, 91.2%, 59.8%)

#### Typography
- Font: Inter (body), Space Grotesk (headings)
- Sizes: Fluid typography with clamp()
- Line heights: 1.5 (body), 1.2 (headings)

#### Components Style Guide
- Cards: Subtle shadows, rounded corners (12px), hover effects
- Buttons: Primary (gradient), Secondary (outline), Ghost
- Inputs: Focus rings, error states, inline validation
- Chat Bubbles: User (right, gradient), AI (left, muted)
- Loading States: Skeleton screens (NOT spinners)

### 4. Frontend Stack additions
Framer Motion, Lucide React, React Hook Form + Zod, Zustand, Recharts

### Backend Stack (UNCHANGED)
FastAPI + Groq + MCP + SQLModel + Neon + Better Auth + uv

## Non-Negotiables
1. No Generic Templates
2. Dark Mode fully functional
3. Responsive (mobile, tablet, desktop)
4. Fast: Lighthouse >90
5. Accessible: WCAG 2.1 AA
6. ChatKit Integration (official OpenAI ChatKit)
7. Skeleton loading screens
8. TypeScript strict mode
9. Error Boundaries
10. No hardcoded API keys
11. SEO metadata on all pages

## Success Criteria
Visual Excellence, Functional Requirements (7 pages, streaming chat, CRUD),
Quality Metrics (Lighthouse >90 perf, >95 accessibility)

## Out of Scope
Real-time collaboration, task due dates/reminders, OAuth social login,
mobile native app

## Response snapshot

Amended constitution from v1.0.0 to v1.1.0 (MINOR bump). Added Principle VII: UI/UX Excellence codifying custom design language, dark/light mode, WCAG 2.1 AA, Framer Motion animations, skeleton loading, ChatKit mandate, error boundaries, and SEO metadata. Expanded Frontend Stack table with 6 new entries (Framer Motion, Lucide React, React Hook Form + Zod, Zustand, Recharts, Inter/Space Grotesk). Added Page Structure table mandating 7 routes. Added Component Style Guide. Added Lighthouse Accessibility >95 to Performance Targets. Added Visual Excellence to Success Criteria. All three templates validated as needing no updates. No placeholders remain. No follow-up TODOs.

## Outcome

- ✅ Impact: Constitution amended to v1.1.0 with new UI/UX principle and expanded frontend guidance
- 🧪 Tests: n/a (governance document)
- 📁 Files: .specify/memory/constitution.md updated
- 🔁 Next prompts: /sp.specify to create feature spec, /sp.plan to create implementation plan
- 🧠 Reflection: Clean MINOR bump; all six existing principles preserved verbatim; new principle VII fills the UI/UX gap that was implicit before

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): manual validation PASS - no unresolved placeholders, version matches report, dates ISO format
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
