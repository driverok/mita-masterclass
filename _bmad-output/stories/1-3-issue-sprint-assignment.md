# Story 1.3: Issue Sprint Assignment

Status: done

## Story

As a team lead,
I want to assign issues to sprints,
so that sprint scope is defined.

## Acceptance Criteria

1. Issue model has optional sprintId foreign key
2. Sprint selector dropdown in IssueForm
3. Sprint selector in IssueCard for quick assignment
4. API supports sprintId in issue create/update
5. Sprint badge visible on assigned issues

## Tasks / Subtasks

- [x] Task 1: Update Issue model relation (AC: 1)
  - [x] Add sprintId field with relation to Sprint
  - [x] Run prisma db push
- [x] Task 2: Create SprintSelect component (AC: 2)
  - [x] Fetch available sprints
  - [x] Dropdown selection UI
- [x] Task 3: Add to IssueForm (AC: 2, 4)
  - [x] Include SprintSelect in form
  - [x] Update submission logic
- [x] Task 4: Update IssueCard (AC: 3, 5)
  - [x] Add inline sprint selector
  - [x] Show sprint name badge

## Dev Notes

- Only PLANNING and ACTIVE sprints should be assignable
- Consider sprint capacity when assigning
- Update completedAt when issue moves to DONE

### References

- [Source: architecture.md#Data-Model]
- [Source: prd.md#FR-3]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Added sprintId relation to Issue model
- Updated IssueForm with sprint selection
- Updated IssueCard with sprint display/edit
- Added completedAt tracking for burndown

### File List
- prisma/schema.prisma
- src/components/IssueForm.tsx
- src/components/IssueCard.tsx
- src/app/api/issues/route.ts
- src/app/api/issues/[id]/route.ts
