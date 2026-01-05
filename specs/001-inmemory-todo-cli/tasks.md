# Tasks: In-Memory Todo CLI Application

**Input**: Design documents from `/specs/001-inmemory-todo-cli/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md, quickstart.md

**Tests**: Not explicitly requested in specification. Manual verification against acceptance criteria.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below follow the plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create src/ directory and src/__init__.py package marker
- [x] T002 [P] Create empty src/models.py with module docstring
- [x] T003 [P] Create empty src/storage.py with module docstring
- [x] T004 [P] Create empty src/validators.py with module docstring
- [x] T005 [P] Create empty src/cli.py with module docstring
- [x] T006 [P] Create empty src/main.py with module docstring

**Checkpoint**: Project skeleton ready - all module files exist with proper structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement Task dataclass with id, title, description, completed fields in src/models.py
- [x] T008 Implement validate_title function (1-200 chars) in src/validators.py
- [x] T009 [P] Implement validate_description function (0-1000 chars) in src/validators.py
- [x] T010 [P] Implement validate_task_id function (positive int parsing) in src/validators.py
- [x] T011 Implement TaskStore class with __init__, _tasks dict, _next_id counter in src/storage.py
- [x] T012 Implement display_message function (stdout/stderr routing) in src/cli.py
- [x] T013 [P] Implement get_input function (safe input with KeyboardInterrupt handling) in src/cli.py
- [x] T014 [P] Implement display_menu function (main menu options) in src/cli.py

**Checkpoint**: Foundation ready - Task model, validators, and base CLI utilities complete

---

## Phase 3: User Story 1 - Add a Task (Priority: P1)

**Goal**: Enable users to add new tasks with title and optional description

**Independent Test**: Launch app, select "Add Task", enter title and description, verify confirmation with valid ID

### Implementation for User Story 1

- [x] T015 [US1] Implement TaskStore.add method (create task, assign ID, increment counter) in src/storage.py
- [x] T016 [US1] Implement handle_add function (prompt for title/description, validate, call store.add, display confirmation) in src/cli.py

**Checkpoint**: User Story 1 complete - users can add tasks and see confirmation with ID

---

## Phase 4: User Story 2 - List All Tasks (Priority: P1)

**Goal**: Enable users to view all tasks with status indicators

**Independent Test**: Add tasks, select "List Tasks", verify all appear with ID, title, status indicator, description preview

### Implementation for User Story 2

- [x] T017 [US2] Implement TaskStore.get_all method (return sorted list of tasks) in src/storage.py
- [x] T018 [US2] Implement display_tasks function (format task list with status indicators) in src/cli.py
- [x] T019 [US2] Implement handle_list function (call store.get_all, display tasks or empty message) in src/cli.py

**Checkpoint**: User Stories 1 AND 2 complete - users can add and view tasks

---

## Phase 5: User Story 6 - Exit Application (Priority: P1)

**Goal**: Enable users to exit the application cleanly

**Independent Test**: Select "Exit" from menu, verify farewell message and clean termination

### Implementation for User Story 6

- [x] T020 [US6] Implement main function with menu loop and exit handling in src/main.py
- [x] T021 [US6] Add menu dispatch to handle_add and handle_list in src/main.py
- [x] T022 [US6] Add invalid menu choice handling with error message in src/main.py

**Checkpoint**: MVP Complete - Add, List, and Exit functionality working. Application is usable.

---

## Phase 6: User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: Enable users to toggle task completion status

**Independent Test**: Add task, toggle to complete, verify status change, toggle back to incomplete

### Implementation for User Story 3

- [x] T023 [US3] Implement TaskStore.get method (lookup by ID) in src/storage.py
- [x] T024 [US3] Implement TaskStore.toggle method (flip completed status) in src/storage.py
- [x] T025 [US3] Implement handle_toggle function (prompt for ID, validate, toggle, display result) in src/cli.py
- [x] T026 [US3] Add menu dispatch for toggle option in src/main.py

**Checkpoint**: User Story 3 complete - users can mark tasks complete/incomplete

---

## Phase 7: User Story 4 - Update a Task (Priority: P3)

**Goal**: Enable users to update task title and/or description

**Independent Test**: Add task, update title and description, verify changes persist in list

### Implementation for User Story 4

- [x] T027 [US4] Implement TaskStore.update method (partial update of title/description) in src/storage.py
- [x] T028 [US4] Implement handle_update function (prompt for ID, field selection, new values, validate, update) in src/cli.py
- [x] T029 [US4] Add menu dispatch for update option in src/main.py

**Checkpoint**: User Story 4 complete - users can update task details

---

## Phase 8: User Story 5 - Delete a Task (Priority: P3)

**Goal**: Enable users to delete tasks by ID

**Independent Test**: Add task, delete by ID, verify no longer appears in list

### Implementation for User Story 5

- [x] T030 [US5] Implement TaskStore.delete method (remove task by ID) in src/storage.py
- [x] T031 [US5] Implement handle_delete function (prompt for ID, validate, delete, display result) in src/cli.py
- [x] T032 [US5] Add menu dispatch for delete option in src/main.py

**Checkpoint**: All user stories complete - full CRUD + toggle functionality working

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and edge case handling

- [x] T033 Add empty task list check before update/delete/toggle operations in src/cli.py
- [x] T034 [P] Add KeyboardInterrupt handling to return to menu gracefully in src/main.py
- [x] T035 [P] Verify all error messages match spec requirements in src/cli.py
- [x] T036 Run manual verification of all acceptance scenarios from spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2), benefits from US1 for testing
- **User Story 6 (Phase 5)**: Depends on US1 and US2 for menu dispatch
- **User Story 3 (Phase 6)**: Depends on US6 (needs menu loop working)
- **User Story 4 (Phase 7)**: Depends on US6 (needs menu loop working)
- **User Story 5 (Phase 8)**: Depends on US6 (needs menu loop working)
- **Polish (Phase 9)**: Depends on all user stories complete

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ─────────────────────────┐
    ↓                                           │
Phase 3 (US1: Add) ←──────────────┐             │
    ↓                             │             │
Phase 4 (US2: List) ←─────────────┤             │
    ↓                             │             │
Phase 5 (US6: Exit/Menu) ←────────┘             │
    ↓                                           │
┌───┴───┬───────────┐                           │
↓       ↓           ↓                           │
Phase 6 Phase 7   Phase 8                       │
(US3)   (US4)     (US5)                         │
Toggle  Update    Delete                        │
    └───────┴───────────┘                       │
            ↓                                   │
        Phase 9 (Polish) ←──────────────────────┘
```

### Within Each User Story

- Foundation tasks MUST complete before user story tasks
- Storage methods before CLI handlers
- CLI handlers before menu dispatch integration

### Parallel Opportunities

- All Setup tasks T002-T006 marked [P] can run in parallel (after T001)
- Foundational tasks T009, T010 can run parallel with T008
- Foundational tasks T013, T014 can run parallel with T012
- After Phase 5, US3/US4/US5 can proceed in parallel (if team capacity allows)
- Polish tasks T034, T035 can run in parallel

---

## Parallel Example: Setup Phase

```bash
# After T001 completes, launch all module files in parallel:
Task T002: "Create empty src/models.py with module docstring"
Task T003: "Create empty src/storage.py with module docstring"
Task T004: "Create empty src/validators.py with module docstring"
Task T005: "Create empty src/cli.py with module docstring"
Task T006: "Create empty src/main.py with module docstring"
```

---

## Implementation Strategy

### MVP First (Phase 1-5)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add Task)
4. Complete Phase 4: User Story 2 (List Tasks)
5. Complete Phase 5: User Story 6 (Exit/Menu Loop)
6. **STOP and VALIDATE**: Test Add, List, Exit independently
7. Deploy/demo if ready - this is the MVP!

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently (can add tasks)
3. Add User Story 2 → Test independently (can see tasks)
4. Add User Story 6 → Test independently (full menu loop works) → **MVP Complete!**
5. Add User Story 3 → Test independently (can toggle status)
6. Add User Story 4 → Test independently (can update tasks)
7. Add User Story 5 → Test independently (can delete tasks)
8. Each story adds value without breaking previous stories

### Suggested MVP Scope

- Phase 1: Setup (T001-T006)
- Phase 2: Foundational (T007-T014)
- Phase 3: User Story 1 - Add Task (T015-T016)
- Phase 4: User Story 2 - List Tasks (T017-T019)
- Phase 5: User Story 6 - Exit/Menu (T020-T022)

**Total MVP Tasks**: 22 tasks

---

## Summary

| Phase | User Story | Tasks | Parallel Opportunities |
|-------|------------|-------|------------------------|
| 1 | Setup | 6 | 5 parallel after T001 |
| 2 | Foundational | 8 | 4 parallel groups |
| 3 | US1: Add Task | 2 | 0 (sequential) |
| 4 | US2: List Tasks | 3 | 0 (sequential) |
| 5 | US6: Exit/Menu | 3 | 0 (sequential) |
| 6 | US3: Toggle | 4 | 0 (sequential) |
| 7 | US4: Update | 3 | 0 (sequential) |
| 8 | US5: Delete | 3 | 0 (sequential) |
| 9 | Polish | 4 | 2 parallel |
| **Total** | | **36** | **11 parallel opportunities** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
