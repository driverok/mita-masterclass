# Story 2.3: Sprint Dashboard Page

Status: done

## Story

As a team lead,
I want a Sprint Dashboard page,
so that I can view all sprint metrics in one place.

## Acceptance Criteria

1. Route /sprints accessible from navigation
2. Current/active sprint displayed by default
3. Sprint selector for switching sprints
4. Burndown chart prominently displayed
5. Navigation link from issues page
6. Page loads in < 2 seconds

## Tasks / Subtasks

- [x] Task 1: Create sprint dashboard route (AC: 1)
  - [x] Create src/app/sprints/page.tsx
  - [x] Set up page layout
- [x] Task 2: Implement sprint selection (AC: 2, 3)
  - [x] Fetch all sprints
  - [x] Default to active sprint
  - [x] Dropdown for sprint switching
- [x] Task 3: Integrate BurndownChart (AC: 4)
  - [x] Fetch burndown data for selected sprint
  - [x] Display chart component
- [x] Task 4: Add navigation (AC: 5)
  - [x] Link from issues page header
  - [x] Breadcrumb navigation
- [x] Task 5: Performance optimization (AC: 6)
  - [x] Efficient data fetching
  - [x] Loading states

## Dev Notes

- Follow existing page patterns in src/app/
- Use same layout as issues page
- Consider adding to main nav in future

### References

- [Source: architecture.md#Page-Structure]
- [Source: prd.md#FR-6]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Created /sprints route and page
- Implemented sprint selection logic
- Integrated BurndownChart component
- Added navigation from issues page

### File List
- src/app/sprints/page.tsx
- src/app/issues/page.tsx (nav link added)
