# Story 1.2: Story Points Field

Status: done

## Story

As a team member,
I want to assign story points to issues,
so that work can be estimated and tracked.

## Acceptance Criteria

1. Issue model has optional storyPoints field
2. StoryPointsSelect component with Fibonacci values (1,2,3,5,8,13)
3. IssueForm includes story points selection
4. IssueCard displays story points badge
5. API accepts storyPoints in create/update

## Tasks / Subtasks

- [x] Task 1: Update Issue model (AC: 1)
  - [x] Add storyPoints field (optional Int)
  - [x] Run prisma db push
- [x] Task 2: Create StoryPointsSelect component (AC: 2)
  - [x] Dropdown with Fibonacci values
  - [x] Support controlled/uncontrolled usage
- [x] Task 3: Integrate into IssueForm (AC: 3, 5)
  - [x] Add StoryPointsSelect to form
  - [x] Update form submission to include points
- [x] Task 4: Update IssueCard display (AC: 4)
  - [x] Show story points badge
  - [x] Style consistent with priority badge

## Dev Notes

- Fibonacci sequence widely used for estimation
- Keep field optional for backwards compatibility
- Use STORY_POINTS constant array for values

### References

- [Source: architecture.md#Data-Model]
- [Source: prd.md#FR-2]

## Dev Agent Record

### Agent Model Used
Claude Sonnet 4 (claude-sonnet-4-20250514)

### Completion Notes List
- Added storyPoints to Issue model
- Created StoryPointsSelect.tsx component
- Updated IssueForm.tsx with story points field
- Updated IssueCard.tsx with points display

### File List
- prisma/schema.prisma
- src/components/StoryPointsSelect.tsx
- src/components/IssueForm.tsx
- src/components/IssueCard.tsx
- src/types/index.ts
