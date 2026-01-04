---
title: 'Sprint Assignment UI'
slug: 'sprint-assignment-ui'
created: '2026-01-04'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 14', 'React 18', 'TypeScript', 'Prisma ORM', 'Tailwind CSS', 'Zod validation']
files_to_modify: ['src/components/SprintSelect.tsx', 'src/components/IssueForm.tsx', 'src/components/IssueCard.tsx', 'src/app/api/issues/route.ts', 'src/lib/validations.ts']
code_patterns: ['Controlled component pattern', 'useEffect for data fetching', 'Zod schema validation', 'Tailwind utility classes']
test_patterns: ['Vitest for unit tests', 'Tests in src/tests/']
---

# Tech-Spec: Sprint Assignment UI

**Created:** 2026-01-04

## Overview

### Problem Statement

PRD requirement FR-2.4 specifies "Assign issues to a sprint" as a Must Have feature. The backend implementation is complete (database schema has `sprintId` on Issue, PATCH API accepts it), but the UI has no way for users to assign issues to sprints. Users cannot currently assign issues to sprints when creating or editing them.

### Solution

Create a reusable `SprintSelect` dropdown component that fetches available sprints and allows selection. Integrate this component into both `IssueForm` (for new issues) and `IssueCard` (for editing existing issues). Update the POST `/api/issues` endpoint to accept `sprintId` during issue creation.

### Scope

**In Scope:**
- New `SprintSelect.tsx` component (self-contained, fetches own data)
- Sprint dropdown in `IssueForm.tsx` for issue creation
- Sprint dropdown in `IssueCard.tsx` edit mode for issue updates
- Update POST `/api/issues` to accept `sprintId` parameter
- Update Zod `issueCreateSchema` to include `sprintId`

**Out of Scope:**
- Bulk assignment of multiple issues to a sprint
- Auto-assignment to active sprint
- Drag-and-drop sprint planning board
- Sprint backlog view with filtering

## Context for Development

### Codebase Patterns

1. **Component Pattern**:
   - Use `'use client'` directive for client components
   - Controlled components with `value` + `onChange` props
   - Reference: `StoryPointsSelect.tsx` (36 lines, simple dropdown)

2. **Data Fetching**:
   - Use `useEffect` + `useState` for API calls
   - Fetch from `/api/sprints` which returns `{ id, name, startDate, endDate, isActive }`

3. **Styling**:
   - Tailwind utility classes: `rounded-md border-gray-300 shadow-sm focus:border-blue-500`
   - Existing CSS classes: `.input`, `.label` from globals.css

4. **Validation**:
   - Zod schemas in `src/lib/validations.ts`
   - `issueUpdateSchema` already has `sprintId` (line 47)
   - `issueCreateSchema` is **missing** `sprintId` (needs update)

5. **API Pattern**:
   - RESTful endpoints in `src/app/api/`
   - Use `NextRequest`, `NextResponse`, `getServerSession`

### Files to Reference

| File | Purpose | Key Lines |
| ---- | ------- | --------- |
| `src/components/StoryPointsSelect.tsx` | Pattern for dropdown component | Full file (36 lines) |
| `src/components/IssueForm.tsx` | Add sprint dropdown after story points | Lines 96-114 (story points section) |
| `src/components/IssueCard.tsx` | Add sprint dropdown in edit mode | Lines 104-118 (story points in edit) |
| `src/app/api/issues/route.ts` | Update POST to accept sprintId | Lines 84-94 (issue creation) |
| `src/app/api/issues/[id]/route.ts` | Reference for PATCH with sprintId | Line 94, 153 |
| `src/lib/validations.ts` | Add sprintId to issueCreateSchema | Lines 20-31 |
| `src/app/api/sprints/route.ts` | Existing API to fetch sprints | Full file (95 lines) |

### Technical Decisions

1. **Self-contained fetching**: `SprintSelect` fetches sprints via `/api/sprints` on mount
2. **Loading state**: Show "Loading..." while fetching sprints
3. **Default value**: `null` (no sprint selected, displayed as "No sprint")
4. **Optional field**: Sprint is not required for issue creation/update
5. **Consistent styling**: Match `StoryPointsSelect` visual appearance
6. **Active sprint indicator**: Show "(Active)" badge next to active sprint in dropdown

## Implementation Plan

### Tasks

- [ ] **Task 1: Update validation schema**
  - File: `src/lib/validations.ts`
  - Action: Add `sprintId: z.string().nullable().optional()` to `issueCreateSchema` (after line 30)
  - Notes: Match the existing pattern in `issueUpdateSchema` line 47

- [ ] **Task 2: Create SprintSelect component**
  - File: `src/components/SprintSelect.tsx` (NEW)
  - Action: Create controlled dropdown component that:
    - Accepts `value: string | null` and `onChange: (id: string | null) => void` props
    - Fetches sprints from `/api/sprints` on mount using `useEffect`
    - Shows loading state while fetching
    - Displays "No sprint" as first option (value="")
    - Shows sprint name with "(Active)" suffix for active sprint
    - Uses same Tailwind classes as `StoryPointsSelect.tsx`
  - Notes: Follow exact pattern of `StoryPointsSelect.tsx`

- [ ] **Task 3: Update IssueForm to include sprint selection**
  - File: `src/components/IssueForm.tsx`
  - Action:
    - Import `SprintSelect` component
    - Add `sprintId` state: `const [sprintId, setSprintId] = useState<string | null>(null)`
    - Add SprintSelect in the form grid (after story points, line ~115)
    - Include `sprintId` in the `onSubmit` data object
  - Notes: Update `IssueFormProps` interface to include `sprintId` in submit data

- [ ] **Task 4: Update IssueCard edit mode to include sprint selection**
  - File: `src/components/IssueCard.tsx`
  - Action:
    - Import `SprintSelect` component
    - Add `sprintId` state initialized from `issue.sprintId` (around line 39)
    - Add SprintSelect in edit mode form (after story points dropdown, line ~118)
    - Include `sprintId` in `handleSave` update data
    - Reset `sprintId` state in `handleCancel`
  - Notes: Follow same pattern as `storyPoints` state handling

- [ ] **Task 5: Update POST /api/issues to accept sprintId**
  - File: `src/app/api/issues/route.ts`
  - Action:
    - Extract `sprintId` from `result.data` (line 84)
    - Add `sprintId: sprintId ?? null` to `prisma.issue.create()` data object (line 91)
  - Notes: Follow same pattern as `storyPoints` handling

### Acceptance Criteria

- [ ] **AC1**: Given the user is on the create issue form, when they click the Sprint dropdown, then they see a list of their sprints with the active sprint marked "(Active)"

- [ ] **AC2**: Given the user creates a new issue with a sprint selected, when they submit the form, then the issue is created with the correct `sprintId` in the database

- [ ] **AC3**: Given the user creates a new issue without selecting a sprint, when they submit the form, then the issue is created with `sprintId: null`

- [ ] **AC4**: Given the user edits an existing issue, when they view the edit form, then the current sprint (if any) is pre-selected in the dropdown

- [ ] **AC5**: Given the user edits an issue and changes the sprint, when they save, then the issue's `sprintId` is updated in the database

- [ ] **AC6**: Given the user edits an issue and removes the sprint (selects "No sprint"), when they save, then the issue's `sprintId` is set to `null`

- [ ] **AC7**: Given there are no sprints created yet, when the user views the sprint dropdown, then they see only "No sprint" option and can still create/edit issues

- [ ] **AC8**: Given the sprint dropdown is loading, when the user views the form, then they see a "Loading..." indicator

## Additional Context

### Dependencies

- No new npm dependencies required
- Depends on existing `/api/sprints` endpoint (already implemented)
- Depends on existing database schema with `sprintId` on Issue model (already implemented)
- Depends on existing `Sprint` type from Prisma (already exported in `src/types/index.ts`)

### Testing Strategy

**Manual Testing:**
1. Create a new issue without sprint → Verify saves with null sprintId
2. Create a new issue with sprint → Verify saves with correct sprintId
3. Edit issue to add sprint → Verify updates correctly
4. Edit issue to remove sprint → Verify sets to null
5. Check sprint dashboard → Verify assigned issues appear in burndown

**Unit Tests (Optional):**
- `SprintSelect.test.tsx`: Render with sprints, selection changes, loading state
- Integration: Full create/edit flow with sprint assignment

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API fetch fails | Low | Medium | SprintSelect shows error state, form still works |
| No sprints exist | Medium | Low | Graceful handling with "No sprint" only option |
| Sprint deleted while editing | Low | Low | API handles gracefully, orphaned sprintId acceptable |

### Notes

- This is a gap discovered during implementation phase (PRD FR-2.4 was not implemented)
- Backend is fully ready - only frontend and POST API need updates
- The PATCH API already supports sprintId (no changes needed)
- Consider future enhancement: filter issues by sprint on the issues page
