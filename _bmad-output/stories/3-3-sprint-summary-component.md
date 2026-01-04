# Story 3.3: Sprint Summary Component

Status: done

## Story

As a user,
I want a sprint summary card,
so that I can see key metrics at a glance.

## Acceptance Criteria

1. SprintSummary component displays key metrics
2. Shows total story points in sprint
3. Shows completed points with percentage
4. Shows remaining points
5. Shows days remaining (if sprint active)
6. Integrated into Sprint Dashboard

## Tasks / Subtasks

- [x] Task 1: Create SprintSummary component (AC: 1, 2, 3, 4)
  - [x] Card layout with metrics
  - [x] Total points display
  - [x] Completed points with progress bar
  - [x] Remaining points calculation
- [x] Task 2: Add time tracking (AC: 5)
  - [x] Calculate days remaining
  - [x] Show sprint date range
  - [x] Different display for completed sprints
- [x] Task 3: Integration (AC: 6)
  - [x] Add to Sprint Dashboard
  - [x] Position above charts

## Dev Notes

- Use card styling consistent with MITA
- Progress bar should be visually prominent
- Consider color coding (green/yellow/red) for status

### References

- [Source: architecture.md#Component-Architecture]
- [Source: prd.md#FR-9]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Created SprintSummary.tsx component
- Implemented metrics calculation
- Added progress bar visualization
- Integrated at top of Sprint Dashboard

### File List
- src/components/SprintSummary.tsx
- src/app/sprints/page.tsx (integration)
