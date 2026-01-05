# Data Model: In-Memory Todo CLI Application

**Feature**: 001-inmemory-todo-cli
**Date**: 2026-01-03
**Source**: spec.md Key Entities section

## Entities

### Task

Represents a single todo item.

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | `int` | Positive, unique, immutable | Auto-assigned | Unique identifier |
| `title` | `str` | 1-200 characters, required | - | Task title |
| `description` | `str` | 0-1000 characters | `""` | Optional details |
| `completed` | `bool` | - | `False` | Completion status |

**Validation Rules**:
- `id`: Must be positive integer, assigned by system, never modified after creation
- `title`: Must be non-empty string, max 200 characters, leading/trailing whitespace trimmed
- `description`: May be empty string, max 1000 characters
- `completed`: Boolean only, no tri-state

**State Transitions**:
```
[New Task] → completed=False
     ↓
[Toggle] → completed=True
     ↓
[Toggle] → completed=False
     ↓
    ...
```

### TaskStore

In-memory collection managing tasks and ID generation.

| Field | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `_tasks` | `dict[int, Task]` | `{}` | Tasks keyed by ID |
| `_next_id` | `int` | `1` | Counter for next ID |

**Invariants**:
- `_next_id` always greater than any existing task ID
- `_tasks` keys always match corresponding `Task.id`
- No duplicate IDs can exist

## Operations

### TaskStore Methods

| Operation | Input | Output | Side Effects |
|-----------|-------|--------|--------------|
| `add(title, description)` | str, str | int (new ID) | Creates task, increments counter |
| `get(task_id)` | int | Task \| None | None |
| `get_all()` | - | list[Task] | None |
| `update(task_id, title, description)` | int, str\|None, str\|None | bool | Updates task fields if found |
| `delete(task_id)` | int | bool | Removes task if found |
| `toggle(task_id)` | int | bool \| None | Flips completed status if found |

**Return Value Conventions**:
- `bool` return: `True` = success, `False` = task not found
- `T | None` return: `None` = task not found
- `int` return: Always the new task ID (add operation)

## Data Examples

### Single Task

```python
Task(
    id=1,
    title="Buy groceries",
    description="Milk, eggs, bread",
    completed=False
)
```

### Task List Display

```
ID  Status  Title              Description Preview
--  ------  -----------------  -------------------
1   ✗       Buy groceries      Milk, eggs, bread
2   ✓       Call mom           Wish her happy bi...
3   ✗       Finish report      Q4 financial summ...
```

## Relationships

```
TaskStore (1) ──contains──> (*) Task
```

- One TaskStore instance holds zero or more Tasks
- Tasks are independent (no references to other tasks)
- No circular dependencies

## No Persistence

Per Constitution Principle IV, no persistence layer exists:
- Data exists only in memory during runtime
- All data lost on application exit
- No serialization/deserialization required
