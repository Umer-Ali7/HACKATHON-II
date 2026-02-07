# Feature Specification: Todo AI Chatbot - Critical Fixes

**Feature Branch**: `004-todo-ai-chatbot-fixes`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Fix database insertion, broken password verification, frontend 404 errors, and integrate OpenAI Agents SDK with Groq for the Todo AI Chatbot"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Database Persistence Works Reliably (Priority: P1)

As a user, when I sign up or create tasks through the application, my data must be saved to the Neon PostgreSQL database and persist across server restarts. Currently, data is not being inserted into the database, making the entire application non-functional.

**Why this priority**: Without working database persistence, no other feature (auth, tasks, chat) can function. This is the foundational fix that unblocks everything else.

**Independent Test**: Can be fully tested by inserting a record via the API and querying the Neon database directly to confirm it exists. Delivers reliable data storage.

**Acceptance Scenarios**:

1. **Given** the backend is running with the Neon connection string configured, **When** a user signs up with valid credentials, **Then** a new user record appears in the Neon PostgreSQL `user` table with all fields populated.
2. **Given** the backend is connected to Neon, **When** the application starts up, **Then** all required database tables are created automatically if they don't exist.
3. **Given** the database connection uses the sync driver (`psycopg2`), **When** the backend makes a database call, **Then** the call completes without `asyncpg` driver errors.
4. **Given** the Neon database requires SSL, **When** the backend connects, **Then** the connection uses `sslmode=require` and succeeds without SSL handshake errors.

---

### User Story 2 - Password Verification Rejects Wrong Passwords (Priority: P1)

As a user, when I log in with my correct password, I should be authenticated. When I (or anyone else) enters a wrong password, login must fail. Currently, any password allows login, which is a critical security vulnerability.

**Why this priority**: Broken authentication is a security-critical defect. Any user can access any account, rendering the system unsafe for any use.

**Independent Test**: Can be fully tested by signing up a user, then attempting login with the correct password (succeeds) and a wrong password (fails with 401). Delivers secure account access.

**Acceptance Scenarios**:

1. **Given** a user has signed up with email "test@test.com" and password "pass123", **When** they log in with email "test@test.com" and password "pass123", **Then** the system returns a successful authentication response with user details.
2. **Given** a user has signed up with email "test@test.com" and password "pass123", **When** someone attempts login with email "test@test.com" and password "wrongpass", **Then** the system returns a 401 Unauthorized error with message "Invalid email or password".
3. **Given** a new user signs up, **When** the system stores their password, **Then** it stores a bcrypt hash (not plaintext) in the `password_hash` column.
4. **Given** a user does not exist in the system, **When** someone attempts login with that email, **Then** the system returns a 401 Unauthorized error (same message as wrong password to prevent user enumeration).

---

### User Story 3 - Dashboard Pages Are Accessible (Priority: P1)

As a user, when I navigate to `/dashboard`, `/chat`, `/tasks`, or `/settings`, I should see the corresponding page content instead of a 404 error. Currently, these routes return "page not found".

**Why this priority**: Users cannot access any application functionality beyond the landing page. This blocks all post-login user journeys.

**Independent Test**: Can be fully tested by navigating to each route in a browser and verifying the page renders with appropriate content. Delivers navigable application structure.

**Acceptance Scenarios**:

1. **Given** the frontend is running, **When** a user navigates to `/dashboard`, **Then** they see a dashboard page with task statistics (total, pending, completed).
2. **Given** the frontend is running, **When** a user navigates to `/chat`, **Then** they see the AI chat interface page.
3. **Given** the frontend is running, **When** a user navigates to `/tasks`, **Then** they see a task list page.
4. **Given** the frontend is running, **When** a user navigates to `/settings`, **Then** they see a settings page with user preferences.
5. **Given** the dashboard pages exist, **When** a user navigates between them, **Then** a shared sidebar navigation with links to all sections is visible.

---

### User Story 4 - AI Chat Responds via OpenAI Agents SDK (Priority: P2)

As a user, when I type a message in the chat interface, the system should process it through the OpenAI Agents SDK (connected to Groq) and return an intelligent response. The agent should be able to manage tasks through natural language.

**Why this priority**: This is the core differentiating feature of the application but requires database and auth to be working first. Using the correct SDK (OpenAI Agents SDK, not the generic OpenAI client) is critical for proper tool-calling support.

**Independent Test**: Can be fully tested by sending a chat message like "Add a task called Buy groceries" and verifying the agent responds with a confirmation and the task appears in the database.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the chat page, **When** they send the message "Add a task: Buy groceries", **Then** the AI agent processes the request using the OpenAI Agents SDK, creates a task in the database, and returns a confirmation message.
2. **Given** a logged-in user with existing tasks, **When** they send "Show my tasks", **Then** the agent lists their tasks with titles and statuses.
3. **Given** the Groq API key is configured, **When** the agent processes a request, **Then** it uses the Groq endpoint (`api.groq.com/openai/v1`) with the `llama-3.3-70b-versatile` model.
4. **Given** the agent has MCP tools registered (add_task, list_tasks, complete_task, delete_task), **When** a user makes a task-related request, **Then** the agent invokes the appropriate MCP tool and returns the result.

---

### Edge Cases

- What happens when the Neon database is temporarily unreachable? The application should return a clear error message rather than an unhandled exception.
- What happens when a user tries to sign up with an email that already exists? The system should return a 400 error with "Email already registered".
- What happens when the Groq API returns a 429 rate limit error? The system should implement exponential backoff and retry.
- What happens when a user navigates to a dashboard page without being authenticated? The system should redirect to the login page (or show appropriate messaging).
- What happens when the chat message is empty or exceeds maximum length? The system should validate input and return a helpful error.
- What happens when the database connection string has an incorrect driver prefix (e.g., `asyncpg` instead of `psycopg2`)? The system should fail fast with a clear configuration error on startup.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST connect to Neon PostgreSQL using the synchronous `psycopg2` driver with `sslmode=require`.
- **FR-002**: System MUST auto-create all database tables on application startup via SQLModel metadata.
- **FR-003**: System MUST hash user passwords with bcrypt before storing them in the database.
- **FR-004**: System MUST verify passwords using bcrypt comparison during login, rejecting mismatches with a 401 response.
- **FR-005**: System MUST never store plaintext passwords in any database column or log output.
- **FR-006**: System MUST serve pages at `/dashboard`, `/chat`, `/tasks`, and `/settings` routes without 404 errors.
- **FR-007**: Dashboard pages MUST share a sidebar layout with navigation links to all sections.
- **FR-008**: System MUST integrate the OpenAI Agents SDK (not the generic OpenAI Python client) for AI chat functionality.
- **FR-009**: The AI agent MUST connect to Groq as the inference provider using the Groq-compatible endpoint.
- **FR-010**: The AI agent MUST have MCP tools registered for task CRUD operations (add, list, complete, delete, update).
- **FR-011**: System MUST prevent duplicate user registration by checking email uniqueness before signup.
- **FR-012**: System MUST return consistent error messages that do not reveal whether an email exists in the system (for login failures).
- **FR-013**: System MUST configure CORS to allow requests from the frontend origin (`localhost:3000` in development).
- **FR-014**: System MUST load all secrets and configuration from environment variables (`.env` file), never hardcoded.

### Key Entities

- **User**: Represents a registered user. Key attributes: unique email, hashed password, optional display name, creation timestamp.
- **Task**: Represents a todo item. Key attributes: title, optional description, status (pending/completed), owner (linked to User), creation and update timestamps.
- **Conversation**: Represents a chat session. Key attributes: owner (linked to User), message history, creation timestamp.

## Assumptions

- The Neon PostgreSQL database is accessible from the development environment and the connection string provided in the spec is valid.
- The Groq API key will be provided by the developer and stored in the `.env` file.
- The OpenAI Agents SDK supports Groq as a provider via its OpenAI-compatible API endpoint.
- The frontend uses Next.js App Router with route groups (parenthesized directories like `(dashboard)`) for layout organization.
- `psycopg2-binary` is the appropriate sync PostgreSQL driver for the development environment.
- Better Auth integration (per constitution) will be addressed in a future iteration; this fix uses simple bcrypt password hashing as a working foundation.

## Out of Scope

- JWT token-based session management (placeholder tokens are acceptable for now).
- Email verification during signup.
- Password reset flow.
- Rate limiting implementation.
- Frontend state management (Zustand) integration.
- Chat streaming responses.
- Mobile-responsive sidebar (basic layout only).
- Alembic migration setup (using auto-create tables for now).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A test script can insert a record into Neon PostgreSQL and read it back successfully, confirming database connectivity and persistence.
- **SC-002**: User signup creates a new record with a bcrypt-hashed password (verifiable by inspecting the stored hash format `$2b$...`).
- **SC-003**: Login with the correct password returns a 200 response with user details; login with an incorrect password returns a 401 response, every time without exception.
- **SC-004**: Navigating to `/dashboard`, `/chat`, `/tasks`, and `/settings` in a browser returns HTTP 200 with rendered page content (not 404).
- **SC-005**: Sending a natural language task command through the chat API (e.g., "Add a task: Buy milk") results in a new task record in the database and a confirmation response from the agent.
- **SC-006**: The backend starts without errors and the `/health` endpoint returns `{"status": "healthy"}`.
