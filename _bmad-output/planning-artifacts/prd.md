---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments: ['README.md', 'CLAUDE.md']
workflowType: 'prd'
lastStep: 11
documentCounts:
  briefs: 0
  research: 0
  projectDocs: 2
---

# Product Requirements Document - MITA Sprint Burndown Chart

**Author:** Aleh
**Date:** 2026-01-04
**Version:** 1.0

---

## Executive Summary

MITA (Mini Issue Tracker Application) is an existing issue tracking system built with Next.js 14, TypeScript, and Prisma. This PRD defines a new **Sprint Burndown Chart** feature that transforms MITA from a basic issue tracker into a sprint planning and velocity tracking tool.

**The Problem:** Teams using MITA can track issues and their status, but have no visibility into sprint progress or team velocity. They cannot answer "Are we on track?" without manually counting completed vs remaining work.

**The Solution:** Add a sprint burndown chart that visualizes completed vs remaining story points over a two-week sprint duration, with an ideal burndown line for comparison. Include velocity trends across sprints to enable data-driven planning.

### What Makes This Special

- **At-a-glance sprint health** - Instantly see if the team is ahead, on track, or behind
- **Early warning system** - Divergence from ideal line signals scope creep or blockers
- **Velocity intelligence** - Historical velocity data enables realistic sprint commitments
- **Minimal friction** - Integrates naturally with existing issue workflow

## Project Classification

**Technical Type:** web_app
**Domain:** general (project management)
**Complexity:** low
**Project Context:** Brownfield - extending existing Next.js/Prisma system

---

## Success Criteria

### Primary Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Feature Adoption | 80% of active users view burndown within first week | Analytics tracking |
| Data Accuracy | 100% match between chart data and actual issue states | Automated validation |
| Page Load Time | Burndown page loads in < 2 seconds | Performance monitoring |
| User Satisfaction | Positive feedback from demo audience | Qualitative feedback |

### Definition of Done

- [ ] Sprint burndown chart displays correctly with real data
- [ ] Story points field added to issue creation/editing
- [ ] Ideal burndown line calculated and displayed
- [ ] Velocity trend chart shows last 3+ sprints
- [ ] All existing tests pass
- [ ] New functionality has test coverage
- [ ] Responsive design works on mobile

---

## User Journeys

### Journey 1: Sprint Progress Check (Primary)

**Persona:** Team Lead / Scrum Master
**Goal:** Quickly assess if sprint is on track

```
1. User navigates to Sprint Dashboard (new route: /sprints)
2. Current sprint burndown chart is prominently displayed
3. User sees:
   - Ideal burndown line (diagonal from total points to zero)
   - Actual burndown line (based on completed issues)
   - Today marker
   - Remaining story points
4. User immediately knows if team is ahead/behind schedule
5. User can click on data points to see which issues were completed
```

### Journey 2: Story Point Assignment

**Persona:** Developer / Team Member
**Goal:** Assign story points to an issue

```
1. User creates new issue or edits existing issue
2. New "Story Points" field is visible (dropdown: 1, 2, 3, 5, 8, 13)
3. User selects appropriate story point value
4. Issue is saved with story points
5. Burndown chart automatically updates to reflect new total
```

### Journey 3: Velocity Analysis

**Persona:** Team Lead / Product Manager
**Goal:** Plan next sprint capacity

```
1. User navigates to Sprint Dashboard
2. User scrolls to Velocity Trends section
3. Chart shows completed story points per sprint (last 5 sprints)
4. Average velocity is calculated and displayed
5. User uses this data to plan next sprint's commitment
```

---

## Functional Requirements

### FR-1: Story Points Field

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Add `storyPoints` field to Issue model (nullable integer) | Must Have |
| FR-1.2 | Story points dropdown in issue create form (values: 1, 2, 3, 5, 8, 13, 21) | Must Have |
| FR-1.3 | Story points dropdown in issue edit form | Must Have |
| FR-1.4 | Story points displayed on issue cards in list view | Should Have |
| FR-1.5 | Filter issues by story point range | Could Have |

### FR-2: Sprint Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Add Sprint model (id, name, startDate, endDate, userId) | Must Have |
| FR-2.2 | Sprint duration defaults to 14 days | Must Have |
| FR-2.3 | Create new sprint with start/end dates | Must Have |
| FR-2.4 | Assign issues to a sprint | Must Have |
| FR-2.5 | View list of sprints (current, past, future) | Should Have |
| FR-2.6 | Mark sprint as complete | Should Have |

### FR-3: Burndown Chart

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Display burndown chart for current sprint | Must Have |
| FR-3.2 | X-axis: Days of sprint (Day 1 to Day 14) | Must Have |
| FR-3.3 | Y-axis: Story points (0 to total committed) | Must Have |
| FR-3.4 | Ideal burndown line (linear from total to 0) | Must Have |
| FR-3.5 | Actual burndown line (based on issue completion dates) | Must Have |
| FR-3.6 | Today marker (vertical line) | Should Have |
| FR-3.7 | Tooltip showing details on hover | Should Have |
| FR-3.8 | Scope change indicators (when points added mid-sprint) | Could Have |

### FR-4: Velocity Tracking

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Calculate velocity as completed story points per sprint | Must Have |
| FR-4.2 | Display velocity bar chart for last 5 sprints | Must Have |
| FR-4.3 | Show average velocity line | Should Have |
| FR-4.4 | Display velocity trend (increasing/decreasing) | Could Have |

### FR-5: Sprint Dashboard Page

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | New route: `/sprints` for sprint dashboard | Must Have |
| FR-5.2 | Current sprint summary (name, dates, progress %) | Must Have |
| FR-5.3 | Burndown chart component | Must Have |
| FR-5.4 | Velocity trend component | Must Have |
| FR-5.5 | Quick stats: total points, completed, remaining | Should Have |
| FR-5.6 | Link to sprint backlog (filtered issue list) | Should Have |

---

## Non-Functional Requirements

### NFR-1: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | Sprint dashboard page load time | < 2 seconds |
| NFR-1.2 | Chart rendering time | < 500ms |
| NFR-1.3 | Data aggregation query time | < 200ms |

### NFR-2: Compatibility

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-2.1 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-2.2 | Responsive design | Mobile-friendly (320px+) |
| NFR-2.3 | Chart library | Recharts (React-native, lightweight) |

### NFR-3: Data Integrity

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-3.1 | Burndown data accuracy | 100% match with issue states |
| NFR-3.2 | Historical data preservation | Maintain burndown history even if issues modified |
| NFR-3.3 | Timezone handling | Use user's local timezone for date displays |

### NFR-4: Usability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-4.1 | Chart accessibility | WCAG 2.1 AA compliant |
| NFR-4.2 | Color blind friendly | Use patterns in addition to colors |
| NFR-4.3 | Keyboard navigation | Full keyboard support for chart interactions |

---

## Technical Considerations

### Database Changes

```prisma
model Sprint {
  id        String   @id @default(cuid())
  name      String
  startDate DateTime
  endDate   DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  issues    Issue[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Issue {
  // ... existing fields ...
  storyPoints Int?
  sprintId    String?
  sprint      Sprint?  @relation(fields: [sprintId], references: [id])
  completedAt DateTime? // Track when issue moved to DONE
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sprints` | List user's sprints |
| POST | `/api/sprints` | Create new sprint |
| GET | `/api/sprints/[id]` | Get sprint details |
| PATCH | `/api/sprints/[id]` | Update sprint |
| GET | `/api/sprints/[id]/burndown` | Get burndown data |
| GET | `/api/sprints/velocity` | Get velocity data |

### Component Structure

```
src/
├── app/
│   └── sprints/
│       └── page.tsx          # Sprint dashboard
├── components/
│   ├── BurndownChart.tsx     # Main burndown visualization
│   ├── VelocityChart.tsx     # Velocity trend chart
│   ├── SprintSummary.tsx     # Sprint stats card
│   └── StoryPointsSelect.tsx # Reusable story points dropdown
└── lib/
    └── burndown.ts           # Burndown calculation utilities
```

---

## Out of Scope

The following are explicitly **not** included in this release:

- Sprint planning poker / estimation sessions
- Team member assignment to sprints
- Sprint retrospective features
- Burnup charts (only burndown)
- Custom sprint durations (fixed at 2 weeks)
- Sprint goals or descriptions
- Integration with external tools (Jira, GitHub Issues)

---

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Chart library performance with large datasets | Medium | Low | Limit visible sprints, lazy load historical data |
| Users don't assign story points | High | Medium | Default story points, gentle reminders |
| Timezone confusion in burndown | Medium | Medium | Clear timezone display, use UTC internally |
| Scope creep during sprint | Low | High | Track and visualize scope changes |

---

## Appendix

### Story Point Reference (Fibonacci)

| Points | Meaning | Example |
|--------|---------|---------|
| 1 | Trivial | Fix typo, update copy |
| 2 | Small | Add simple validation |
| 3 | Medium-small | New API endpoint |
| 5 | Medium | New component with logic |
| 8 | Large | Full feature slice |
| 13 | Very large | Complex feature |
| 21 | Epic-sized | Should be broken down |

---

*PRD Generated via BMAD Method - PM Agent (John)*
