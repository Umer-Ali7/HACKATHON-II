# Implementation Plan: In-Memory Todo CLI Application

**Branch**: `001-inmemory-todo-cli` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-inmemory-todo-cli/spec.md`

## Summary

Build a command-line Todo application in Python that stores tasks in memory. The application provides a menu-driven interface for adding, listing, updating, deleting, and toggling completion status of tasks. Architecture follows clean separation of concerns with models, storage, and CLI layers.

## Technical Context

**Language/Version**: Python 3.10+ (for modern type hint syntax including `|` union operator)
**Primary Dependencies**: None (standard library only)
**Storage**: In-memory (Python dict keyed by task ID)
**Testing**: Manual verification against acceptance criteria (pytest optional)
**Target Platform**: Cross-platform CLI (Linux, macOS, Windows)
**Project Type**: Single project
**Performance Goals**: Sub-second response for all operations
**Constraints**: No persistence, single user, <100MB memory
**Scale/Scope**: Single user, <1000 tasks per session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Spec-First Development | Spec must exist before implementation | PASS | spec.md created and validated |
| II. Clean Code & Python Best Practices | PEP 8, type hints, docstrings | PASS | Will be enforced during implementation |
| III. Simplicity Over Cleverness | Simplest solution that meets requirements | PASS | Standard library only, simple data structures |
| IV. In-Memory Storage Architecture | No persistence layer | PASS | Dict-based storage, no files/DB |
| V. CLI Interface Contract | stdin/stdout interaction, stderr for errors | PASS | Menu-driven CLI planned |
| VI. Auditability and Traceability | PHRs, version control | PASS | All artifacts tracked |

**Gate Result**: PASS - All constitution principles satisfied. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-inmemory-todo-cli/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (repository root)

```text
src/
├── __init__.py          # Package marker
├── main.py              # Entry point with CLI loop
├── models.py            # Task dataclass
├── storage.py           # TaskStore class (in-memory)
├── cli.py               # Menu display and user input handlers
└── validators.py        # Input validation functions
```

**Structure Decision**: Single project structure selected. This is the simplest architecture for a standalone CLI application with no external integrations. The `src/` directory contains all Python modules with clear separation:
- `models.py` - Data structures only
- `storage.py` - State management only
- `cli.py` - User interaction only
- `validators.py` - Input validation only
- `main.py` - Application orchestration only

## Complexity Tracking

> No violations to justify - design follows simplest path.

| Aspect | Decision | Justification |
|--------|----------|---------------|
| No external deps | Standard library only | Matches Principle III (Simplicity) |
| No persistence | In-memory dict | Matches Principle IV (In-Memory) |
| No ORM/Repository | Direct dict operations | YAGNI - no need for abstraction layer |
| No config files | Hardcoded constants | Single-user CLI needs no configuration |

## Component Design

### 1. Task Model (`src/models.py`)

```python
@dataclass
class Task:
    id: int
    title: str
    description: str
    completed: bool = False
```

**Design Rationale**: Using `dataclass` for automatic `__init__`, `__repr__`, and `__eq__`. No methods on the model - it's a pure data container.

### 2. TaskStore (`src/storage.py`)

**State**:
- `_tasks: dict[int, Task]` - Tasks keyed by ID for O(1) lookup
- `_next_id: int` - Counter for ID generation (starts at 1)

**Operations**:
| Method | Signature | Returns | Notes |
|--------|-----------|---------|-------|
| `add` | `(title: str, description: str) -> int` | New task ID | Validates inputs, increments counter |
| `get` | `(task_id: int) -> Task \| None` | Task or None | O(1) lookup |
| `get_all` | `() -> list[Task]` | All tasks | Sorted by ID |
| `update` | `(task_id: int, title: str \| None, description: str \| None) -> bool` | Success flag | Partial update support |
| `delete` | `(task_id: int) -> bool` | Success flag | Returns False if not found |
| `toggle` | `(task_id: int) -> bool \| None` | New status or None | None if not found |

**Design Rationale**: Single class encapsulates all storage operations. Dict provides O(1) access. No singleton pattern - instance created in main and passed to CLI handlers.

### 3. Validators (`src/validators.py`)

| Function | Signature | Returns | Notes |
|----------|-----------|---------|-------|
| `validate_title` | `(title: str) -> tuple[bool, str]` | (valid, error_msg) | 1-200 chars |
| `validate_description` | `(desc: str) -> tuple[bool, str]` | (valid, error_msg) | 0-1000 chars |
| `validate_task_id` | `(input_str: str) -> tuple[int \| None, str]` | (id, error_msg) | Positive int |

**Design Rationale**: Separate validation module keeps CLI code clean and makes validation rules testable in isolation.

### 4. CLI Module (`src/cli.py`)

**Functions**:
| Function | Purpose |
|----------|---------|
| `display_menu()` | Print main menu options |
| `display_tasks(tasks: list[Task])` | Format and print task list |
| `display_message(msg: str, is_error: bool)` | Print to stdout or stderr |
| `get_input(prompt: str) -> str` | Safe input with KeyboardInterrupt handling |
| `handle_add(store: TaskStore)` | Add task flow |
| `handle_list(store: TaskStore)` | List tasks flow |
| `handle_update(store: TaskStore)` | Update task flow |
| `handle_delete(store: TaskStore)` | Delete task flow |
| `handle_toggle(store: TaskStore)` | Toggle status flow |

**Design Rationale**: Each user story maps to one handler function. Display functions separated from logic for clarity.

### 5. Main Entry Point (`src/main.py`)

```python
def main() -> None:
    """Application entry point with main menu loop."""
    store = TaskStore()
    # Menu loop with dispatch to handlers
```

**Design Rationale**: Main function only orchestrates. All logic delegated to appropriate modules.

## Data Flow

```
User Input → main.py (dispatch) → cli.py (handler)
                                      ↓
                              validators.py (validate)
                                      ↓
                              storage.py (operate)
                                      ↓
                              cli.py (display result)
```

## Error Handling Strategy

| Error Type | Handling | User Message |
|------------|----------|--------------|
| Empty title | Validation fails | "Title is required (1-200 characters)" |
| Title too long | Validation fails | "Title must not exceed 200 characters" |
| Description too long | Validation fails | "Description must not exceed 1000 characters" |
| Invalid ID format | Parse fails | "Invalid input. Please enter a numeric task ID." |
| Task not found | Lookup fails | "Task not found. Please enter a valid ID." |
| No tasks exist | List empty | "No tasks yet. Add one!" |
| Invalid menu choice | Not in options | "Invalid option. Please choose 1-6." |
| Ctrl+C interrupt | KeyboardInterrupt | Return to menu or exit gracefully |

## Menu Structure

```
=== Todo Application ===

1. Add Task
2. List Tasks
3. Update Task
4. Delete Task
5. Toggle Complete
6. Exit

Enter choice (1-6): _
```

## Task Display Format

```
=== Your Tasks ===

[1] ✗ Buy groceries
    Get milk, eggs, and bread...

[2] ✓ Call mom
    Wish her happy birthday

[3] ✗ Finish report
    Q4 financial summary for...

Total: 3 tasks (1 complete, 2 pending)
```

## Implementation Sequence

1. **Setup**: Create `src/` directory structure with `__init__.py`
2. **Models**: Implement `Task` dataclass
3. **Validators**: Implement validation functions
4. **Storage**: Implement `TaskStore` class
5. **CLI Display**: Implement display functions
6. **CLI Handlers**: Implement operation handlers
7. **Main**: Implement entry point with menu loop
8. **Integration**: Test full application flow

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| UTF-8 display issues on Windows | Medium | Low | Fallback to ASCII indicators [x]/[ ] |
| KeyboardInterrupt crash | Low | Medium | Wrap input() in try/except |
| ID overflow | Very Low | Low | Python int has no practical limit |

## Dependencies

- Python 3.10+ (for `X | Y` type union syntax)
- No external packages required
- Standard library: `dataclasses`, `sys`

## Post-Design Constitution Re-Check

| Principle | Pre-Design | Post-Design | Notes |
|-----------|------------|-------------|-------|
| I. Spec-First | PASS | PASS | Plan derived from spec |
| II. Clean Code | PASS | PASS | Type hints, docstrings planned |
| III. Simplicity | PASS | PASS | No unnecessary abstractions |
| IV. In-Memory | PASS | PASS | Dict storage confirmed |
| V. CLI Contract | PASS | PASS | stdin/stdout/stderr defined |
| VI. Auditability | PASS | PASS | All decisions documented |

**Final Gate Result**: PASS - Ready for task generation (`/sp.tasks`)
