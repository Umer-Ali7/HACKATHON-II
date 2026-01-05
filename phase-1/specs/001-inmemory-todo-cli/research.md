# Research: In-Memory Todo CLI Application

**Feature**: 001-inmemory-todo-cli
**Date**: 2026-01-03
**Status**: Complete

## Overview

This document captures research decisions for the In-Memory Todo CLI Application. Given the simplicity of the requirements and the constraint to use only Python standard library, research was minimal.

## Technology Decisions

### 1. Python Version

**Decision**: Python 3.10+

**Rationale**:
- Modern type hint syntax (`X | Y` instead of `Union[X, Y]`)
- `dataclasses` module available (introduced in 3.7)
- Widespread availability on Linux, macOS, Windows
- No need for newer features from 3.11/3.12

**Alternatives Considered**:
- Python 3.8/3.9: Would require `from __future__ import annotations` or `typing.Union`
- Python 3.11+: Unnecessary; no performance-critical code

### 2. Data Structure for Task Storage

**Decision**: `dict[int, Task]` keyed by task ID

**Rationale**:
- O(1) lookup by ID (required for update, delete, toggle operations)
- O(n) for listing all tasks (acceptable given <1000 task constraint)
- Simple iteration with `.values()`
- Native Python, no external dependencies

**Alternatives Considered**:
- `list[Task]`: O(n) lookup by ID - rejected for inefficiency
- `sqlite3 :memory:`: Overkill for simple CRUD - rejected for complexity
- Third-party like `tinydb`: External dependency - rejected per constitution

### 3. Task Model Implementation

**Decision**: `@dataclass` from standard library

**Rationale**:
- Automatic `__init__`, `__repr__`, `__eq__` generation
- Clean, declarative syntax
- Type hints built-in
- No boilerplate

**Alternatives Considered**:
- Plain class: More boilerplate for same result
- `NamedTuple`: Immutable, which complicates updates
- `attrs` / `pydantic`: External dependencies

### 4. CLI Input/Output

**Decision**: Built-in `input()` and `print()` functions

**Rationale**:
- Standard library, no dependencies
- Sufficient for menu-driven interface
- Cross-platform compatible

**Alternatives Considered**:
- `click` / `argparse`: Overkill for interactive menu app
- `rich`: External dependency, visual enhancement not required
- `curses`: Platform-specific, complex for simple menus

### 5. Error Output

**Decision**: `sys.stderr` for error messages

**Rationale**:
- Follows CLI convention (stdout for data, stderr for errors)
- Matches constitution requirement (Principle V)
- Allows output redirection without mixing errors

**Alternatives Considered**:
- All to stdout: Violates CLI convention
- Logging module: Overkill for user-facing errors

### 6. Status Indicators

**Decision**: UTF-8 checkmark (✓) and cross (✗) symbols

**Rationale**:
- Visually distinct and intuitive
- Most modern terminals support UTF-8
- Spec explicitly mentions these symbols

**Alternatives Considered**:
- ASCII `[x]`/`[ ]`: Less visual but safer fallback
- Emoji: Inconsistent rendering across terminals
- Color codes: Not all terminals support ANSI colors

**Fallback Plan**: If UTF-8 causes issues, can easily switch to ASCII `[x]`/`[ ]` without architectural changes.

## Unknowns Resolved

| Unknown | Resolution | Source |
|---------|------------|--------|
| Python version | 3.10+ | Modern type hints needed |
| External dependencies | None | Constitution Principle III |
| Storage mechanism | In-memory dict | Constitution Principle IV |
| Input validation approach | Separate validators module | Clean code principle |
| Error display | stderr via sys.stderr | Constitution Principle V |

## No Further Research Required

All technical decisions are straightforward given:
1. Standard library only constraint
2. In-memory storage requirement
3. Simple CLI interaction pattern
4. No persistence or external integrations

Proceeding to Phase 1 design artifacts.
