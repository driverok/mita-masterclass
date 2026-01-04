# Story 2.1: Burndown Calculation Logic

Status: done

## Story

As a developer,
I want burndown calculation utilities,
so that chart data is computed accurately.

## Acceptance Criteria

1. calculateBurndown function returns daily data points
2. Ideal burndown line calculated from total points / sprint days
3. Actual burndown reflects issue completions by date
4. API endpoint /api/sprints/[id]/burndown returns chart data
5. Handles edge cases (no issues, mid-sprint start)

## Tasks / Subtasks

- [x] Task 1: Create burndown utility module (AC: 1, 2, 3)
  - [x] calculateIdealBurndown function
  - [x] calculateActualBurndown function
  - [x] generateBurndownData combining both
- [x] Task 2: Create burndown API endpoint (AC: 4)
  - [x] GET /api/sprints/[id]/burndown
  - [x] Return formatted chart data
- [x] Task 3: Handle edge cases (AC: 5)
  - [x] Empty sprint handling
  - [x] Future date handling
  - [x] Sprint not started handling

## Dev Notes

- Use completedAt timestamp for actual burndown
- Ideal line: straight diagonal from total to zero
- Return data in format suitable for chart library

### References

- [Source: architecture.md#Burndown-Calculation]
- [Source: prd.md#FR-4]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Created src/lib/burndown.ts utility module
- Implemented ideal and actual calculation functions
- Created burndown API endpoint
- Added comprehensive date handling

### File List
- src/lib/burndown.ts
- src/app/api/sprints/[id]/burndown/route.ts
