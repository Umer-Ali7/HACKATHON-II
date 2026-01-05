# Feature Specification: In-Memory Todo CLI Application

**Feature Branch**: `001-inmemory-todo-cli`
**Created**: 2026-01-03
**Status**: Draft
**Input**: Phase 1 of Hackathon II "Evolution of Todo" - Build a command-line Todo application with in-memory storage

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a Task (Priority: P1)

As a user, I want to add a new task with a title and optional description so that I can record things I need to do.

**Why this priority**: This is the foundational operation. Without the ability to add tasks, no other functionality is meaningful. This is the absolute MVP.

**Independent Test**: Can be fully tested by launching the application, selecting "Add Task", entering a title and description, and verifying the confirmation message appears with a valid ID.

**Acceptance Scenarios**:

1. **Given** the application is running and showing the main menu, **When** the user selects "Add Task" and enters a valid title (1-200 characters), **Then** the system assigns a unique incremental ID (starting from 1) and displays "Task added successfully (ID: X)"

2. **Given** the user is adding a task, **When** they provide an optional description (up to 1000 characters), **Then** the description is stored with the task

3. **Given** the user is adding a task, **When** they leave the description empty, **Then** the task is created with an empty description

4. **Given** the user enters an empty title, **When** they attempt to save, **Then** the system displays an error message and prompts for a valid title

5. **Given** the user enters a title exceeding 200 characters, **When** they attempt to save, **Then** the system displays an error message about the character limit

---

### User Story 2 - List All Tasks (Priority: P1)

As a user, I want to view all tasks so that I can see what I have to do and their current status.

**Why this priority**: Viewing tasks is essential for using the application. Users need to see their tasks to interact with them (update, delete, mark complete). Tied with Add Task as MVP.

**Independent Test**: Can be fully tested by adding one or more tasks, then selecting "List Tasks" and verifying all tasks appear with correct ID, title, status indicator, and description preview.

**Acceptance Scenarios**:

1. **Given** tasks exist in memory, **When** the user selects "List Tasks", **Then** a numbered list displays showing ID, title, completion status, and description preview (first 50 characters)

2. **Given** no tasks exist in memory, **When** the user selects "List Tasks", **Then** the system displays "No tasks yet. Add one!"

3. **Given** tasks exist with varying completion statuses, **When** viewing the list, **Then** completed tasks show a checkmark indicator and pending tasks show a cross indicator

---

### User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

As a user, I want to toggle a task's completion status so that I can track my progress.

**Why this priority**: Tracking completion is the core value proposition of a todo application. This enables the fundamental workflow of marking work as done.

**Independent Test**: Can be fully tested by adding a task, noting its initial incomplete status, toggling it to complete, verifying the status change, then toggling back to incomplete.

**Acceptance Scenarios**:

1. **Given** a task exists with status "incomplete", **When** the user selects "Toggle Status" and enters the task ID, **Then** the status changes to "complete" and displays "Task X marked as complete"

2. **Given** a task exists with status "complete", **When** the user selects "Toggle Status" and enters the task ID, **Then** the status changes to "incomplete" and displays "Task X marked as incomplete"

3. **Given** the user enters a non-existent task ID, **When** attempting to toggle status, **Then** the system displays "Task not found. Please enter a valid ID."

4. **Given** the user enters an invalid input (non-numeric), **When** attempting to toggle status, **Then** the system displays "Invalid input. Please enter a numeric task ID."

---

### User Story 4 - Update a Task (Priority: P3)

As a user, I want to update an existing task's title or description so that I can correct or modify details.

**Why this priority**: Editing is important but not critical for MVP. Users can work around this by deleting and re-adding tasks.

**Independent Test**: Can be fully tested by adding a task, selecting "Update Task", modifying the title and/or description, and verifying the changes persist when listing tasks.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user selects "Update Task" and enters a valid ID, **Then** the system prompts for which field to update (title, description, or both)

2. **Given** the user chooses to update the title, **When** they enter a new valid title (1-200 characters), **Then** the title is updated and displays "Task X updated successfully"

3. **Given** the user chooses to update the description, **When** they enter a new description (0-1000 characters), **Then** the description is updated and displays "Task X updated successfully"

4. **Given** the user enters a non-existent task ID, **When** attempting to update, **Then** the system displays "Task not found. Please enter a valid ID."

5. **Given** the user enters an invalid new title (empty or >200 chars), **When** attempting to save, **Then** the system displays an appropriate error message

---

### User Story 5 - Delete a Task (Priority: P3)

As a user, I want to delete a task by ID so that I can remove completed or irrelevant items.

**Why this priority**: Deletion is a cleanup operation. Important for long-term use but not critical for demonstrating core functionality.

**Independent Test**: Can be fully tested by adding a task, noting its ID, deleting it, and verifying it no longer appears in the task list.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user selects "Delete Task" and enters the task ID, **Then** the task is removed from memory and displays "Task X deleted successfully"

2. **Given** the user enters a non-existent task ID, **When** attempting to delete, **Then** the system displays "Task not found. Please enter a valid ID."

3. **Given** the user enters an invalid input (non-numeric), **When** attempting to delete, **Then** the system displays "Invalid input. Please enter a numeric task ID."

---

### User Story 6 - Exit Application (Priority: P1)

As a user, I want to exit the application cleanly so that I can end my session.

**Why this priority**: Essential for basic usability. Users must be able to quit the application.

**Independent Test**: Can be fully tested by selecting "Exit" from the menu and verifying the application terminates with a goodbye message.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** the user selects "Exit", **Then** the application displays a farewell message and terminates gracefully

---

### Edge Cases

- What happens when user enters non-numeric input where a number is expected? System displays "Invalid input. Please enter a numeric value." and re-prompts
- What happens when the task list is empty and user tries to update/delete/toggle? System displays "No tasks available." before prompting for ID
- What happens when user enters negative task ID? System displays "Invalid ID. Task IDs are positive numbers."
- What happens when description contains special characters or newlines? System accepts and stores them correctly
- What happens when user presses Ctrl+C during input? Application handles interrupt gracefully and returns to main menu or exits cleanly

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a menu-driven command-line interface with options: Add Task, List Tasks, Update Task, Delete Task, Toggle Status, Exit
- **FR-002**: System MUST validate task titles are between 1 and 200 characters inclusive
- **FR-003**: System MUST validate task descriptions do not exceed 1000 characters
- **FR-004**: System MUST assign unique incremental IDs to tasks starting from 1
- **FR-005**: System MUST store all tasks in memory only (no file or database persistence)
- **FR-006**: System MUST initialize new tasks with completed status set to False
- **FR-007**: System MUST display clear confirmation messages after successful operations
- **FR-008**: System MUST display clear error messages for invalid inputs or operations
- **FR-009**: System MUST display task status using visual indicators (checkmark for complete, cross for incomplete)
- **FR-010**: System MUST handle invalid menu selections gracefully by re-displaying the menu
- **FR-011**: System MUST continue running in a loop until user explicitly selects Exit

### Key Entities

- **Task**: Represents a single todo item with the following attributes:
  - ID: Unique positive integer identifier (auto-assigned, immutable)
  - Title: Required string (1-200 characters)
  - Description: Optional string (0-1000 characters)
  - Completed: Boolean status flag (default: False)

- **TaskStore**: In-memory collection that holds all tasks and manages ID generation
  - Maintains a counter for next available ID
  - Provides lookup by ID
  - Supports add, update, delete, and list operations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new task in under 30 seconds (title + description entry)
- **SC-002**: Users can view all tasks and identify completion status within 2 seconds of selecting "List"
- **SC-003**: Users can mark a task complete/incomplete in under 10 seconds
- **SC-004**: Users can update any task field in under 30 seconds
- **SC-005**: Users can delete a task in under 10 seconds
- **SC-006**: All error messages are actionable (tell user what to do differently)
- **SC-007**: Application responds to all user inputs within 1 second
- **SC-008**: 100% of acceptance scenarios pass manual verification

## Assumptions

- Single user application (no concurrent access considerations)
- Terminal supports UTF-8 for status indicators (checkmark/cross symbols)
- User has basic familiarity with command-line interfaces
- Session data loss on exit is acceptable (in-memory only, no persistence)
- English language interface only

## Out of Scope

- Data persistence (files, databases)
- Multiple users or authentication
- Task priorities, due dates, or tags
- Search or filter functionality
- Undo/redo operations
- Import/export functionality
- GUI or web interface
