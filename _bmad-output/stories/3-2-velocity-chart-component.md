# Story 3.2: Velocity Chart Component

Status: done

## Story

As a team lead,
I want to see velocity trends,
so that I can plan future sprints based on capacity.

## Acceptance Criteria

1. VelocityChart component renders bar chart
2. Each bar represents one sprint's completed points
3. Average velocity line overlaid on chart
4. Hover shows sprint name and points
5. Responsive design for mobile
6. Integrated into Sprint Dashboard

## Tasks / Subtasks

- [x] Task 1: Create VelocityChart component (AC: 1, 2)
  - [x] Bar chart using recharts
  - [x] Sprint labels on x-axis
  - [x] Points on y-axis
- [x] Task 2: Add average line (AC: 3)
  - [x] Calculate running average
  - [x] Overlay as reference line
- [x] Task 3: Add interactivity (AC: 4)
  - [x] Tooltip on hover
  - [x] Show sprint details
- [x] Task 4: Responsive and integration (AC: 5, 6)
  - [x] Mobile-friendly sizing
  - [x] Add to Sprint Dashboard page

## Dev Notes

- Use same recharts library as BurndownChart
- Consistent styling with other charts
- Bar color should indicate trend (up/down)

### References

- [Source: architecture.md#Component-Architecture]
- [Source: prd.md#FR-8]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Created VelocityChart.tsx component
- Implemented bar chart with average line
- Added to Sprint Dashboard
- Styled to match BurndownChart

### File List
- src/components/VelocityChart.tsx
- src/app/sprints/page.tsx (integration)
