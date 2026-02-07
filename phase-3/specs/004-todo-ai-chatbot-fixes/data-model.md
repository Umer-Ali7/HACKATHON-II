# Data Model: Todo AI Chatbot - Critical Fixes

**Branch**: `004-todo-ai-chatbot-fixes` | **Date**: 2026-02-07

## Existing Models (No Changes)

### Task
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | int | PK, auto-increment | |
| user_id | str | FK -> User.id, indexed | Isolation key |
| title | str | max 255, required | |
| description | str | nullable | |
| completed | bool | default False | |
| created_at | datetime(tz) | UTC, not null | |
| updated_at | datetime(tz) | UTC, not null | |

### Conversation
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | int | PK, auto-increment | |
| user_id | str | FK -> User.id, indexed | |
| created_at | datetime(tz) | UTC, not null | |
| updated_at | datetime(tz) | UTC, not null | |

### Message
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | int | PK, auto-increment | |
| conversation_id | int | FK -> Conversation.id | |
| user_id | str | indexed | |
| role | str | "user" or "assistant" | |
| content | str | required | |
| tool_calls | JSON | nullable | Array of tool call records |
| created_at | datetime(tz) | UTC, not null | Immutable |

## Modified Model

### User (existing - field clarification)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | str | PK | UUID or email-derived slug |
| email | str | unique, indexed, max 255 | Login identifier |
| hashed_password | str | not null | **FIX**: Must contain bcrypt hash (`$2b$...`) |
| display_name | str | nullable, max 100 | |
| theme_preference | str | nullable, max 10 | "light", "dark", "system" |
| created_at | datetime(tz) | UTC, not null | |
| updated_at | datetime(tz) | UTC, not null | |

**Change**: The `hashed_password` field already exists in `user.py:14` but was never written to with actual hashed values. The auth route will now:
1. On signup: Hash the plain password with bcrypt and store in `hashed_password`
2. On login: Retrieve `hashed_password` and verify with `passlib.verify()`

No schema migration needed - the field exists, just unused.

## Entity Relationships

```
User (1) ──── (N) Task
  │
  └──── (N) Conversation (1) ──── (N) Message
```

## State Transitions

### Task States
```
[created] ──complete_task──> [completed]
    │                            │
    └──delete_task──> [deleted]  └──delete_task──> [deleted]
```

### User Authentication States
```
[anonymous] ──signup──> [registered]
[registered] ──login(correct pw)──> [authenticated]
[registered] ──login(wrong pw)──> [rejected: 401]
[authenticated] ──logout──> [anonymous]
```

## Validation Rules

### Signup
- `email`: Valid email format (Pydantic EmailStr), unique in database
- `password`: String, minimum 6 characters
- `name`: Optional string, max 100 characters

### Login
- `email`: Valid email format
- `password`: String, any length (compared against stored hash)

### Task Creation (via MCP tool)
- `title`: Non-empty string after strip(), max 255 characters
- `description`: Optional string
- `user_id`: Must be a valid, existing user ID
