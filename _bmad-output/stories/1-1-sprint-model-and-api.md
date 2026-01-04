# Story 1.1: Sprint Model and API

Status: done

## Story

As a developer,
I want Sprint CRUD API endpoints with proper data models,
so that sprints can be created, read, updated, and deleted.

## Acceptance Criteria

1. Prisma schema includes Sprint model with id, name, startDate, endDate, status
2. API routes at /api/sprints support GET, POST methods
3. API routes at /api/sprints/[id] support GET, PUT, DELETE methods
4. Validation using Zod schemas
5. Authentication required for all endpoints

## Tasks / Subtasks

- [x] Task 1: Add Sprint model to Prisma schema (AC: 1)
  - [x] Define Sprint model fields
  - [x] Add relation to Issue model
  - [x] Run prisma db push
- [x] Task 2: Create /api/sprints route (AC: 2, 4, 5)
  - [x] GET handler for listing sprints
  - [x] POST handler for creating sprints
  - [x] Add Zod validation schema
- [x] Task 3: Create /api/sprints/[id] route (AC: 3, 4, 5)
  - [x] GET handler for single sprint
  - [x] PUT handler for updating sprint
  - [x] DELETE handler for removing sprint

## Dev Notes

- Follow existing API patterns in src/app/api/issues/
- Use NextAuth session check for authentication
- Sprint status enum: PLANNING, ACTIVE, COMPLETED

### References

- [Source: architecture.md#API-Design]
- [Source: prd.md#FR-1]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Sprint model added to prisma/schema.prisma
- Created src/app/api/sprints/route.ts
- Created src/app/api/sprints/[id]/route.ts
- Added sprint validation schemas to src/lib/validations.ts

### File List
- prisma/schema.prisma
- src/app/api/sprints/route.ts
- src/app/api/sprints/[id]/route.ts
- src/lib/validations.ts
- src/types/index.ts
