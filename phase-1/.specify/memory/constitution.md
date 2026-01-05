<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial) → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (6 principles)
  - Quality Standards
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no changes needed (generic)
  - .specify/templates/spec-template.md — ✅ no changes needed (generic)
  - .specify/templates/tasks-template.md — ✅ no changes needed (generic)
Follow-up TODOs: None
-->

# Todo CLI Application Constitution

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)

Every feature MUST be specified before implementation begins. No code is written without a corresponding specification document that has been reviewed and approved.

- Specifications MUST precede all implementation work
- Each specification MUST define clear acceptance criteria
- Changes to requirements MUST be reflected in spec updates before code changes
- Rationale: Prevents scope creep, ensures shared understanding, and creates auditable decision trails

### II. Clean Code and Python Best Practices

All code MUST adhere to Python community standards and clean code principles.

- PEP 8 compliance is MANDATORY for all Python code
- Type hints MUST be used for all function signatures and class attributes
- Docstrings MUST be provided for all public modules, classes, and functions
- Meaningful names MUST be used for all identifiers (no single-letter variables except loop counters)
- Rationale: Ensures maintainability, readability, and reduces cognitive load for future developers

### III. Simplicity Over Cleverness

Favor simple, readable solutions over clever or overly abstracted ones.

- The simplest solution that meets requirements MUST be chosen
- YAGNI (You Aren't Gonna Need It): Do not implement features "just in case"
- Avoid premature optimization; optimize only when measurements indicate need
- Each abstraction MUST justify its existence with a concrete, current use case
- Rationale: Simple code is easier to understand, test, debug, and maintain

### IV. In-Memory Storage Architecture

All data storage MUST be in-memory only for Phase 1.

- No persistence layer (no files, no databases) is permitted in Phase 1
- Data structures MUST be simple Python collections (lists, dicts)
- Application state MUST be clearly encapsulated in a single, identifiable location
- Rationale: Reduces complexity, focuses development on core functionality, and enables rapid iteration

### V. CLI Interface Contract

The application MUST provide a text-based command-line interface.

- All user interaction MUST occur via stdin/stdout
- Error messages MUST be sent to stderr
- Commands MUST be intuitive and follow common CLI conventions
- Output MUST be human-readable with clear formatting
- Rationale: Ensures accessibility, scriptability, and testability

### VI. Auditability and Traceability

Every development phase MUST be reviewable and traceable.

- All specifications, plans, and tasks MUST be version-controlled
- Prompt History Records (PHRs) MUST be created for significant interactions
- Architectural decisions MUST be documented when they meet significance criteria
- Changes MUST be traceable from requirement to implementation
- Rationale: Enables accountability, learning from past decisions, and compliance verification

## Quality Standards

### Code Quality Gates

- All code MUST pass linting (pylint or ruff) with no errors
- All code MUST pass type checking (mypy) with no errors
- All public interfaces MUST have docstrings
- Cyclomatic complexity MUST NOT exceed 10 per function
- Functions MUST NOT exceed 50 lines of code

### Testing Requirements

- Unit tests are RECOMMENDED but not mandatory for Phase 1 basic features
- Integration tests MAY be added for complex interactions
- All acceptance criteria from specs MUST be manually verifiable

### Error Handling Standards

- All user-facing errors MUST provide actionable feedback
- Internal errors MUST NOT expose implementation details to users
- Invalid input MUST be handled gracefully with clear error messages

## Development Workflow

### Phase Sequence (MANDATORY)

1. **Specification**: Create feature spec via `/sp.specify`
2. **Planning**: Generate implementation plan via `/sp.plan`
3. **Task Generation**: Create actionable tasks via `/sp.tasks`
4. **Implementation**: Execute tasks via `/sp.implement`
5. **Review**: Validate against acceptance criteria

### Commit Standards

- Commits MUST reference the task or spec being addressed
- Commit messages MUST be clear and descriptive
- Each commit SHOULD represent a single logical change

### Branch Strategy

- Feature work MUST occur on feature branches
- Branch names MUST follow pattern: `feature/<feature-name>`
- Main branch MUST always be in a working state

## Governance

### Constitution Authority

This constitution supersedes all other development practices for this project. All contributors and agents MUST verify compliance with these principles before approving changes.

### Amendment Process

1. Proposed amendments MUST be documented with rationale
2. Amendments MUST be reviewed for impact on existing specifications and plans
3. Version number MUST be incremented according to semantic versioning:
   - MAJOR: Incompatible principle changes or removals
   - MINOR: New principles or significant expansions
   - PATCH: Clarifications and minor refinements
4. All dependent templates MUST be reviewed for consistency after amendments

### Compliance Review

- All pull requests MUST verify compliance with Core Principles
- Complexity additions MUST be justified against Principle III (Simplicity)
- Deviations from constitution MUST be documented and approved

### Runtime Guidance

For development guidance and agent instructions, refer to `CLAUDE.md` in the project root.

**Version**: 1.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
