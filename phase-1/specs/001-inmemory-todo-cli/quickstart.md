# Quickstart: In-Memory Todo CLI Application

**Feature**: 001-inmemory-todo-cli
**Date**: 2026-01-03

## Prerequisites

- Python 3.10 or higher
- Terminal with UTF-8 support (recommended)

## Installation

No installation required. The application uses only Python standard library.

```bash
# Verify Python version
python3 --version  # Should be 3.10+
```

## Running the Application

From the repository root:

```bash
# Option 1: Run as module
python3 -m src.main

# Option 2: Run directly
python3 src/main.py
```

## Usage

### Main Menu

When you start the application, you'll see:

```
=== Todo Application ===

1. Add Task
2. List Tasks
3. Update Task
4. Delete Task
5. Toggle Complete
6. Exit

Enter choice (1-6):
```

### Adding a Task

1. Select option `1`
2. Enter a title (1-200 characters, required)
3. Enter a description (optional, max 1000 characters)
4. See confirmation with assigned ID

```
Enter choice (1-6): 1

Enter task title: Buy groceries
Enter description (optional): Milk, eggs, and bread

Task added successfully (ID: 1)
```

### Listing Tasks

Select option `2` to see all tasks:

```
=== Your Tasks ===

[1] ✗ Buy groceries
    Milk, eggs, and bread

[2] ✓ Call mom
    Already done!

Total: 2 tasks (1 complete, 1 pending)
```

### Toggling Completion

1. Select option `5`
2. Enter the task ID
3. Status will flip (complete ↔ incomplete)

```
Enter choice (1-6): 5
Enter task ID to toggle: 1

Task 1 marked as complete
```

### Updating a Task

1. Select option `3`
2. Enter the task ID
3. Choose what to update (title/description/both)
4. Enter new value(s)

```
Enter choice (1-6): 3
Enter task ID to update: 1

What to update?
1. Title
2. Description
3. Both

Enter choice: 1
Enter new title: Buy groceries and snacks

Task 1 updated successfully
```

### Deleting a Task

1. Select option `4`
2. Enter the task ID
3. Task is permanently removed

```
Enter choice (1-6): 4
Enter task ID to delete: 2

Task 2 deleted successfully
```

### Exiting

Select option `6` to exit:

```
Enter choice (1-6): 6

Goodbye! Your tasks were not saved (in-memory only).
```

## Important Notes

- **No persistence**: All tasks are lost when you exit the application
- **IDs are not reused**: Deleted task IDs are not reassigned
- **Single session**: This is a single-user, single-session application

## Troubleshooting

### Status symbols not displaying correctly

If you see `?` or garbled characters instead of ✓ and ✗:
- Ensure your terminal supports UTF-8
- On Windows, use Windows Terminal or set `chcp 65001`

### Invalid input errors

- Task IDs must be positive integers
- Titles cannot be empty or exceed 200 characters
- Descriptions cannot exceed 1000 characters

## Project Structure

```
src/
├── __init__.py      # Package marker
├── main.py          # Entry point
├── models.py        # Task dataclass
├── storage.py       # TaskStore class
├── cli.py           # User interface
└── validators.py    # Input validation
```

## Next Steps

After implementation:
1. Run the application with `python3 -m src.main`
2. Test each user story from the specification
3. Verify all acceptance criteria pass
