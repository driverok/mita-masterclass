# Story 3.1: Velocity Calculation

Status: done

## Story

As a developer,
I want velocity calculation utilities,
so that team capacity can be measured.

## Acceptance Criteria

1. calculateVelocity returns points per completed sprint
2. Average velocity calculated across sprints
3. API endpoint /api/sprints/velocity returns data
4. Only COMPLETED sprints included in calculations
5. Returns empty array if no completed sprints

## Tasks / Subtasks

- [x] Task 1: Create velocity utility functions (AC: 1, 2)
  - [x] getSprintVelocity for single sprint
  - [x] calculateAverageVelocity for trend
- [x] Task 2: Create velocity API endpoint (AC: 3, 4)
  - [x] GET /api/sprints/velocity
  - [x] Filter to completed sprints only
  - [x] Return velocity data array
- [x] Task 3: Handle edge cases (AC: 5)
  - [x] No completed sprints
  - [x] Single sprint average

## Dev Notes

- Velocity = sum of completed story points in sprint
- Average useful for capacity planning
- Consider weighted average for recent sprints

### References

- [Source: architecture.md#Velocity-Calculation]
- [Source: prd.md#FR-7]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Added velocity functions to burndown.ts
- Created velocity API endpoint
- Returns array with sprint name, points, and running average

### File List
- src/lib/burndown.ts
- src/app/api/sprints/velocity/route.ts
