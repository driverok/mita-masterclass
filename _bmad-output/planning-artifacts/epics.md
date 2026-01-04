---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['prd.md', 'architecture.md']
---

# MITA Sprint Burndown Chart - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Sprint Burndown Chart feature, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

| ID | Requirement | Epic |
|----|-------------|------|
| FR-1 | Sprint model with start/end dates | Epic 1 |
| FR-2 | Story points field on issues (Fibonacci: 1,2,3,5,8,13) | Epic 1 |
| FR-3 | Assign issues to sprints | Epic 1 |
| FR-4 | Burndown calculation (ideal vs actual) | Epic 2 |
| FR-5 | Burndown chart visualization | Epic 2 |
| FR-6 | Sprint Dashboard page | Epic 2 |
| FR-7 | Velocity calculation across sprints | Epic 3 |
| FR-8 | Velocity trend chart | Epic 3 |
| FR-9 | Sprint summary with progress stats | Epic 3 |

### Non-Functional Requirements

| ID | Requirement | Epic |
|----|-------------|------|
| NFR-1 | Page load < 2 seconds | All |
| NFR-2 | Responsive design (mobile-friendly) | Epic 2, 3 |
| NFR-3 | Consistent with existing MITA styling | All |

## Epic List

1. **Epic 1: Sprint Data Foundation** - Database models and API endpoints
2. **Epic 2: Burndown Visualization** - Chart components and dashboard
3. **Epic 3: Velocity Tracking** - Velocity metrics and trends

---

## Epic 1: Sprint Data Foundation

**Goal:** Establish the data layer for sprint tracking, including database models, API endpoints, and story point integration.

### Story 1.1: Sprint Model and API

As a developer,
I want Sprint CRUD API endpoints with proper data models,
So that sprints can be created, read, updated, and deleted.

**Acceptance Criteria:**

- **Given** the Prisma schema
- **When** I add Sprint model with id, name, startDate, endDate, status
- **Then** migrations run successfully and model is queryable

- **Given** API routes exist at /api/sprints
- **When** I call GET, POST, PUT, DELETE methods
- **Then** proper CRUD operations are performed with validation

### Story 1.2: Story Points Field

As a team member,
I want to assign story points to issues,
So that work can be estimated and tracked.

**Acceptance Criteria:**

- **Given** the Issue model
- **When** I add storyPoints field (optional, Fibonacci values)
- **Then** existing issues are unaffected and new issues accept points

- **Given** the IssueForm component
- **When** I add StoryPointsSelect dropdown
- **Then** users can select 1, 2, 3, 5, 8, or 13 points

### Story 1.3: Issue Sprint Assignment

As a team lead,
I want to assign issues to sprints,
So that sprint scope is defined.

**Acceptance Criteria:**

- **Given** an issue exists
- **When** I select a sprint from dropdown
- **Then** issue.sprintId is updated

- **Given** IssueCard displays an issue
- **When** the issue has a sprint assigned
- **Then** sprint name badge is visible

---

## Epic 2: Burndown Visualization

**Goal:** Create the burndown chart component and Sprint Dashboard page showing sprint progress.

### Story 2.1: Burndown Calculation Logic

As a developer,
I want burndown calculation utilities,
So that chart data is computed accurately.

**Acceptance Criteria:**

- **Given** a sprint with issues
- **When** I call calculateBurndown(sprintId)
- **Then** returns daily data points with ideal vs actual remaining points

- **Given** issues are completed during sprint
- **When** burndown is recalculated
- **Then** actual line reflects completions on correct dates

### Story 2.2: Burndown Chart Component

As a user,
I want to see a burndown chart,
So that I can visualize sprint progress.

**Acceptance Criteria:**

- **Given** burndown data exists
- **When** BurndownChart component renders
- **Then** shows line chart with ideal (dashed) and actual (solid) lines

- **Given** the chart is displayed
- **When** I hover over data points
- **Then** tooltip shows date and remaining points

### Story 2.3: Sprint Dashboard Page

As a team lead,
I want a Sprint Dashboard page,
So that I can view all sprint metrics in one place.

**Acceptance Criteria:**

- **Given** route /sprints exists
- **When** user navigates to it
- **Then** current sprint burndown is prominently displayed

- **Given** multiple sprints exist
- **When** dashboard loads
- **Then** sprint selector allows switching between sprints

---

## Epic 3: Velocity Tracking

**Goal:** Add velocity calculations and visualizations for sprint-over-sprint analysis.

### Story 3.1: Velocity Calculation

As a developer,
I want velocity calculation utilities,
So that team capacity can be measured.

**Acceptance Criteria:**

- **Given** completed sprints exist
- **When** I call calculateVelocity()
- **Then** returns points completed per sprint with average

- **Given** API endpoint /api/sprints/velocity
- **When** called with GET
- **Then** returns velocity data for all completed sprints

### Story 3.2: Velocity Chart Component

As a team lead,
I want to see velocity trends,
So that I can plan future sprints based on capacity.

**Acceptance Criteria:**

- **Given** velocity data exists
- **When** VelocityChart component renders
- **Then** shows bar chart with points per sprint

- **Given** multiple sprints displayed
- **When** chart renders
- **Then** average velocity line is overlaid

### Story 3.3: Sprint Summary Component

As a user,
I want a sprint summary card,
So that I can see key metrics at a glance.

**Acceptance Criteria:**

- **Given** a sprint is selected
- **When** SprintSummary renders
- **Then** shows total points, completed, remaining, % complete

- **Given** sprint is in progress
- **When** summary displays
- **Then** shows days remaining and projected completion
