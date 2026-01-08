# Hackathon Todo Phase II Constitution

<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- Added sections: Architecture Principles (5 principles), Technology Stack, Code Quality Standards, Security Standards, Performance Standards, Testing Standards
- Templates requiring updates:
  ✅ plan-template.md - Constitution Check section will reference these principles
  ✅ spec-template.md - Requirements align with security and testing standards
  ✅ tasks-template.md - Task organization reflects testing and implementation standards
- Follow-up TODOs: None - all placeholders filled
-->

## Core Principles

### I. Separation of Concerns

Frontend (Next.js) and backend (FastAPI) MUST operate as independent services communicating exclusively through a well-defined REST API. No direct database access from frontend; no business logic in frontend beyond presentation and user interaction. Backend owns all data persistence and business rules.

**Rationale**: Enables independent scaling, testing, and deployment of each layer. Prevents tight coupling that makes maintenance and future migrations difficult.

### II. API-First Design

All data operations MUST flow through the backend REST API. The API contract is the primary interface specification. Backend exposes RESTful endpoints with proper HTTP verbs (GET, POST, PUT, DELETE); frontend consumes these endpoints as a client. API changes require versioning or backward compatibility.

**Rationale**: API-first ensures frontend and backend can evolve independently. Clear contracts prevent integration issues and enable parallel development.

### III. Stateless Authentication

Authentication MUST use JWT (JSON Web Tokens) with no server-side session storage. All user context is carried in the token payload. JWT secret MUST match between frontend and backend for token verification. Token expiration and refresh handled through standard JWT claims.

**Rationale**: Stateless auth enables horizontal scaling of backend services without shared session state. Simplifies deployment and reduces infrastructure complexity.

### IV. Type Safety Everywhere

TypeScript MUST be used in frontend with strict mode enabled and proper type definitions for all API responses. Pydantic models MUST be used in backend for all request/response validation. No `any` types in TypeScript; no unvalidated data in Python.

**Rationale**: Type safety catches errors at compile time, provides IDE autocompletion, serves as living documentation, and prevents runtime type errors.

### V. Database as Single Source of Truth

All application state MUST persist to Neon PostgreSQL. No critical data in memory, local storage, or session storage that isn't synced to database. SQLModel MUST be used for all database operations with proper schema migrations.

**Rationale**: Ensures data consistency, enables disaster recovery, supports auditing, and prevents data loss from server restarts or crashes.

## Technology Stack Constraints

### Mandatory Technologies

These technologies are NON-NEGOTIABLE and MUST be used:

- **Backend Runtime**: Python 3.13+ with `uv` for dependency management
- **Backend Framework**: FastAPI for REST API (NOT Flask, Django, or alternatives)
- **ORM**: SQLModel for database operations (NOT raw SQL, SQLAlchemy alone, or other ORMs)
- **Database**: Neon Serverless PostgreSQL (NOT local Postgres, MySQL, or other databases)
- **Frontend Framework**: Next.js 16+ App Router (NOT Pages Router, Create React App, or other frameworks)
- **Authentication Library**: Better Auth (NOT NextAuth, Clerk, Auth0, or custom implementations)

### Forbidden Patterns

These patterns are PROHIBITED:

- Manual raw SQL queries bypassing SQLModel
- Server-side sessions or cookies for authentication
- Next.js Pages Router for new code
- Client-side only state for critical data
- Hardcoded credentials or secrets in code

## Code Quality Standards

### API Implementation Standards

All API endpoints MUST:

- Filter data by authenticated `user_id` to enforce user isolation
- Use Pydantic models for request/response validation
- Return proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Include error messages in consistent format: `{"error": "message"}`
- Use SQLModel for all database queries with explicit user filtering

### Frontend Implementation Standards

All React components MUST:

- Be written in TypeScript with explicit types (no `any`)
- Use proper TypeScript interfaces for all API response data
- Handle loading and error states explicitly
- Validate user input before sending to API
- Use Next.js App Router conventions (app directory, not pages)

### Validation Requirements

Validation MUST occur at multiple layers:

- **Frontend**: User input validation for UX (fast feedback)
- **Backend**: Request validation with Pydantic (security boundary)
- **Database**: Schema constraints via SQLModel (data integrity)

No manual code MUST be written until specifications are validated and approved.

## Security Standards

### Authentication & Authorization

Security MUST be enforced through:

- **JWT Authentication**: All API endpoints MUST verify JWT token validity
- **User Isolation**: All database queries MUST filter by authenticated user_id
- **Token Matching**: JWT secret MUST be identical in frontend and backend
- **Secure Storage**: JWT tokens stored in httpOnly cookies (NOT localStorage)

### Data Protection

Data security MUST follow:

- **User Data Isolation**: Users MUST only access their own tasks/data
- **No Shared Data**: No endpoints returning data across users
- **Environment Variables**: All secrets (JWT secret, DB credentials) MUST use env vars
- **No Hardcoding**: NEVER commit secrets to version control

### CORS Configuration

CORS MUST:

- Allow only the specific frontend domain (NOT wildcard `*`)
- Restrict allowed methods to only what's needed (GET, POST, PUT, DELETE)
- Include credentials in CORS headers for cookie-based auth

## Performance Standards

### Response Time Requirements

All operations MUST meet:

- **API Endpoints**: < 200ms response time for CRUD operations (p95)
- **Frontend Load**: < 2 seconds for initial page load
- **Database Queries**: Use proper indexes on user_id and frequently queried fields
- **Connection Pooling**: Use database connection pooling (configured in SQLModel)

### Optimization Requirements

Performance MUST be maintained through:

- **Indexed Queries**: All foreign keys and filter columns must have indexes
- **Efficient Queries**: Use SELECT only needed columns (avoid SELECT *)
- **Connection Management**: Reuse database connections via pooling
- **Caching**: Use HTTP caching headers for static assets

## Testing Standards

### Unit Testing

Unit tests MUST cover:

- **Business Logic**: All service layer functions
- **Validation**: All Pydantic model validations
- **Utilities**: All helper functions and utilities
- **Coverage**: Minimum 80% code coverage for business logic

### Integration Testing

Integration tests MUST verify:

- **API Endpoints**: All REST endpoints with authentication
- **User Isolation**: Users cannot access other users' data
- **Error Handling**: Proper HTTP status codes and error messages
- **Database Operations**: CRUD operations persist correctly

### End-to-End Testing

E2E tests MUST validate:

- **Authentication Flow**: User login, token issuance, token validation
- **Critical Paths**: Core user journeys (create task, complete task, delete task)
- **User Isolation**: Complete flows verify data isolation between users
- **Error Scenarios**: Proper error handling for invalid auth, missing data

### Test Execution Standards

Testing MUST follow:

- **Test-First**: Tests written and failing before implementation
- **Automated**: All tests run in CI/CD pipeline
- **Isolated**: Tests use dedicated test database (NOT production data)
- **Repeatable**: Tests can run multiple times with same results

## Governance

### Constitution Authority

This Constitution supersedes all other development practices and conventions. When conflicts arise between this document and other guidance, this Constitution takes precedence.

### Amendment Process

Amendments to this Constitution require:

1. **Documentation**: Proposed changes documented with rationale
2. **Impact Analysis**: Assessment of affected code and templates
3. **Migration Plan**: Strategy for updating existing code to comply
4. **Approval**: Explicit approval from project stakeholders
5. **Version Increment**: Semantic version bump based on change impact

### Compliance Verification

All code changes MUST:

- **Pass Constitution Check**: Verify compliance before merge
- **Document Exceptions**: Any justified deviations must be documented in ADR
- **Review Gate**: Code reviews must verify constitutional compliance
- **Automated Checks**: Linting and type checking enforced in CI/CD

### Complexity Justification

Any violation of constitutional principles MUST be justified with:

- **Business Requirement**: Clear need that cannot be met otherwise
- **Alternatives Considered**: Documentation of simpler options rejected
- **Migration Path**: Plan to remove complexity when requirement changes
- **Review**: Architectural decision recorded in ADR

**Version**: 1.0.0 | **Ratified**: 2026-01-06 | **Last Amended**: 2026-01-06
