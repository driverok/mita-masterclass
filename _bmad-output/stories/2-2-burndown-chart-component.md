# Story 2.2: Burndown Chart Component

Status: done

## Story

As a user,
I want to see a burndown chart,
so that I can visualize sprint progress.

## Acceptance Criteria

1. BurndownChart component renders line chart
2. Ideal burndown shown as dashed line
3. Actual burndown shown as solid line
4. Today marker indicates current position
5. Hover tooltips show date and remaining points
6. Responsive design for mobile

## Tasks / Subtasks

- [x] Task 1: Set up chart library (AC: 1)
  - [x] Install recharts (or similar)
  - [x] Create base chart wrapper
- [x] Task 2: Implement BurndownChart (AC: 1, 2, 3, 4)
  - [x] Line chart with dual series
  - [x] Ideal line styling (dashed, gray)
  - [x] Actual line styling (solid, blue)
  - [x] Today reference line
- [x] Task 3: Add interactivity (AC: 5)
  - [x] Tooltip on hover
  - [x] Format date and points
- [x] Task 4: Responsive design (AC: 6)
  - [x] Container query for sizing
  - [x] Mobile-friendly labels

## Dev Notes

- Use recharts for React compatibility
- Match MITA color scheme
- Consider loading state while fetching data

### References

- [Source: architecture.md#Component-Architecture]
- [Source: prd.md#FR-5]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Installed recharts library
- Created BurndownChart.tsx component
- Implemented dual-line visualization
- Added responsive container wrapper

### File List
- package.json (recharts dependency)
- src/components/BurndownChart.tsx
