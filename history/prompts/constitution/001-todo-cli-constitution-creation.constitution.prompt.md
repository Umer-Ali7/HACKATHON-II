---
id: 001
title: Todo CLI Constitution Creation
stage: constitution
date: 2026-01-03
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: anzal
command: /sp.constitution
labels: ["constitution", "governance", "phase-1", "todo-cli"]
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

You are Claude Code operating as a senior Python engineer and spec-driven development agent.

Your mission is to design and implement a basic-level, in-memory Python console application using a strict Spec-Driven Development workflow powered by Spec-Kit Plus.

==================================== PROJECT OBJECTIVE
Build a command-line Todo application that:

* Stores all data in memory (no persistence)

* Demonstrates clean architecture and code quality

* Implements all required basic features

* Is developed entirely through specs, plans, tasks, and agentic execution

No manual coding is allowed outside of Claude Code execution.

==================================== CORE PRINCIPLES

* Spec-first development is mandatory

* No implementation before specification

* Each phase must be reviewable and auditable

* Favor clarity and simplicity over cleverness

* Follow clean code and Python best practices (PEP 8, type hints, docstrings, meaningful names)

==================================== REQUIRED FEATURES
The application must support:

1. Add a task (title + description)

2. View all tasks with status indicators

3. Update task details

4. Delete a task by ID

5. Mark tasks as complete or incomplete

==================================== FINAL DELIVERABLE
A working Python console application that:

* Runs via CLI

* Uses in-memory storage

* Has proper project structure

This constitution establishes the governance framework for Phase 1 development. Include quality standards, workflow rules, and compliance requirements.

## Response snapshot

Created the Todo CLI Application Constitution v1.0.0 with six core principles:

1. **Spec-First Development** (NON-NEGOTIABLE) - Specifications must precede all implementation
2. **Clean Code and Python Best Practices** - PEP 8, type hints, docstrings mandatory
3. **Simplicity Over Cleverness** - YAGNI, avoid premature optimization
4. **In-Memory Storage Architecture** - No persistence for Phase 1
5. **CLI Interface Contract** - Text-based stdin/stdout interaction
6. **Auditability and Traceability** - PHRs and version control required

Added Quality Standards (linting, type checking, complexity limits), Development Workflow (5-phase sequence), and Governance sections (amendment process, compliance review).

## Outcome

- Impact: Established governance framework for Phase 1 Todo CLI development
- Tests: N/A (governance document)
- Files: Created/updated .specify/memory/constitution.md
- Next prompts: /sp.specify to create feature specification for Todo CLI
- Reflection: Constitution provides clear, testable constraints for development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard constitution creation
- Next experiment (smallest change to try): Validate constitution gates during /sp.plan execution
