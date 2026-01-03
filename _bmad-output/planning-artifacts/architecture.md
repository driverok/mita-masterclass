---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md', 'README.md', 'CLAUDE.md']
workflowType: 'architecture'
lastStep: 8
---

# Architecture Decision Document - MITA Sprint Burndown Chart

**Author:** Winston (Architect Agent)
**Date:** 2026-01-04
**Version:** 1.0
**PRD Reference:** prd.md

---

## 1. Executive Summary

This document defines the technical architecture for adding Sprint Burndown Chart functionality to MITA. The solution extends the existing Next.js 14 / Prisma / SQLite stack with new data models, API endpoints, and React components for sprint management and burndown visualization.

**Key Architectural Decisions:**
- Extend existing Prisma schema (no database migration complexity)
- Use Recharts for visualization (React-native, lightweight)
- Server-side data aggregation for burndown calculations
- Maintain existing authentication and authorization patterns

---

## 2. System Context

### 2.1 Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MITA Application                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Next.js   │  │   Prisma    │  │      SQLite         │ │
│  │  App Router │──│    ORM      │──│     Database        │ │
│  │  (Frontend) │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│         │                                                    │
│  ┌──────┴──────────────────────────────────────────────┐   │
│  │                  API Routes                          │   │
│  │  /api/auth/*  │  /api/issues/*  │  /api/sprints/*   │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Authentication: NextAuth.js (Credentials Provider)         │
│  Styling: Tailwind CSS                                       │
│  Testing: Vitest                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Extended Architecture (with Sprint Burndown)

```
┌─────────────────────────────────────────────────────────────┐
│                    MITA + Sprint Burndown                    │
├─────────────────────────────────────────────────────────────┤
│  Pages                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │  /login  │ │ /issues  │ │/register │ │  /sprints    │   │
│  └──────────┘ └──────────┘ └──────────┘ │  (NEW)       │   │
│                                          └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Components                                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │ BurndownChart  │ │ VelocityChart  │ │ SprintSummary  │  │
│  │    (NEW)       │ │    (NEW)       │ │    (NEW)       │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│  ┌────────────────┐ ┌────────────────┐                     │
│  │StoryPointSelect│ │  SprintSelect  │                     │
│  │    (NEW)       │ │    (NEW)       │                     │
│  └────────────────┘ └────────────────┘                     │
├─────────────────────────────────────────────────────────────┤
│  API Routes                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ /api/sprints         - CRUD for sprints (NEW)       │   │
│  │ /api/sprints/[id]/burndown - Burndown data (NEW)    │   │
│  │ /api/sprints/velocity - Velocity trends (NEW)       │   │
│  │ /api/issues          - Extended with storyPoints    │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (Prisma)                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │   User   │ │  Issue   │ │ Activity │ │   Sprint     │   │
│  │          │ │(extended)│ │   Log    │ │   (NEW)      │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Data Architecture

### 3.1 Database Schema Changes

#### New Sprint Model

```prisma
model Sprint {
  id          String    @id @default(cuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(true)

  // Relations
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  issues      Issue[]

  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([startDate, endDate])
}
```

#### Extended Issue Model

```prisma
model Issue {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      Status    @default(OPEN)
  priority    Priority  @default(MEDIUM)

  // NEW FIELDS
  storyPoints Int?
  completedAt DateTime? // Set when status changes to DONE

  // Relations
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  sprintId    String?   // NEW
  sprint      Sprint?   @relation(fields: [sprintId], references: [id]) // NEW
  activityLog ActivityLog[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([sprintId]) // NEW
  @@index([status])
}
```

### 3.2 Data Flow

```
User Action                    API Route                      Database
───────────────────────────────────────────────────────────────────────

Create Sprint      ──────►  POST /api/sprints      ──────►  Sprint.create()
                                   │
                                   ▼
                           Validate dates (14 days)
                           Check no overlapping sprints

Assign Issue       ──────►  PATCH /api/issues/[id] ──────►  Issue.update()
to Sprint                          │                        { sprintId }
                                   ▼
                           Validate sprint exists
                           Validate sprint is active

Complete Issue     ──────►  PATCH /api/issues/[id] ──────►  Issue.update()
                                   │                        { status: DONE,
                                   ▼                          completedAt: now }
                           Auto-set completedAt
                           Create ActivityLog

Get Burndown       ──────►  GET /api/sprints/[id]  ──────►  Aggregate query
Data                        /burndown                       Group by date
                                   │
                                   ▼
                           Calculate ideal line
                           Calculate actual line
                           Return chart data
```

---

## 4. API Architecture

### 4.1 New Endpoints

#### Sprint Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/sprints` | List user's sprints | Required |
| POST | `/api/sprints` | Create new sprint | Required |
| GET | `/api/sprints/[id]` | Get sprint details | Required |
| PATCH | `/api/sprints/[id]` | Update sprint | Required |
| DELETE | `/api/sprints/[id]` | Delete sprint | Required |

#### Burndown & Velocity

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/sprints/[id]/burndown` | Get burndown chart data | Required |
| GET | `/api/sprints/velocity` | Get velocity for last N sprints | Required |

### 4.2 API Response Schemas

#### Burndown Data Response

```typescript
interface BurndownResponse {
  sprint: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    totalPoints: number;
  };
  data: Array<{
    date: string;           // YYYY-MM-DD
    day: number;            // 1-14
    idealRemaining: number; // Linear burndown
    actualRemaining: number; // Based on completions
    completed: number;      // Points completed this day
  }>;
  summary: {
    totalPoints: number;
    completedPoints: number;
    remainingPoints: number;
    percentComplete: number;
    onTrack: boolean;
  };
}
```

#### Velocity Data Response

```typescript
interface VelocityResponse {
  sprints: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    committedPoints: number;
    completedPoints: number;
    velocity: number;
  }>;
  averageVelocity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
/sprints (page.tsx)
├── SprintSummary
│   ├── Sprint name, dates
│   ├── Progress percentage
│   └── Quick stats (total, completed, remaining)
├── BurndownChart
│   ├── Recharts LineChart
│   ├── Ideal line (dashed)
│   ├── Actual line (solid)
│   ├── Today marker
│   └── Tooltip on hover
├── VelocityChart
│   ├── Recharts BarChart
│   ├── Velocity bars per sprint
│   └── Average velocity line
└── SprintBacklog (optional)
    └── Filtered issue list for current sprint
```

### 5.2 Component Specifications

#### BurndownChart.tsx

```typescript
interface BurndownChartProps {
  sprintId: string;
  data?: BurndownResponse; // Can be passed or fetched
}

// Features:
// - Responsive container
// - Two lines: ideal (dashed gray) and actual (solid blue)
// - X-axis: Days 1-14
// - Y-axis: Story points
// - Today marker (vertical dashed line)
// - Tooltip showing date, ideal, actual, delta
// - Legend
```

#### VelocityChart.tsx

```typescript
interface VelocityChartProps {
  sprintCount?: number; // Default 5
}

// Features:
// - Bar chart with sprint velocity
// - Horizontal line for average velocity
// - X-axis: Sprint names
// - Y-axis: Story points
// - Color coding: green if above average, gray if below
```

#### StoryPointsSelect.tsx

```typescript
interface StoryPointsSelectProps {
  value: number | null;
  onChange: (points: number | null) => void;
  disabled?: boolean;
}

// Features:
// - Dropdown with Fibonacci values: 1, 2, 3, 5, 8, 13, 21
// - "No estimate" option (null)
// - Consistent styling with existing form elements
```

---

## 6. Key Algorithms

### 6.1 Burndown Calculation

```typescript
function calculateBurndown(sprint: Sprint, issues: Issue[]): BurndownData[] {
  const totalPoints = issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  const sprintDays = 14; // Fixed 2-week sprint
  const dailyBurn = totalPoints / sprintDays;

  const result: BurndownData[] = [];

  for (let day = 0; day <= sprintDays; day++) {
    const date = addDays(sprint.startDate, day);

    // Ideal: Linear decrease
    const idealRemaining = Math.max(0, totalPoints - (dailyBurn * day));

    // Actual: Based on completions up to this date
    const completedByDate = issues
      .filter(i => i.completedAt && i.completedAt <= date)
      .reduce((sum, i) => sum + (i.storyPoints || 0), 0);

    const actualRemaining = totalPoints - completedByDate;

    result.push({
      date: format(date, 'yyyy-MM-dd'),
      day,
      idealRemaining: Math.round(idealRemaining * 10) / 10,
      actualRemaining,
      completed: completedByDate,
    });
  }

  return result;
}
```

### 6.2 Velocity Calculation

```typescript
function calculateVelocity(sprints: SprintWithIssues[]): VelocityData {
  const sprintVelocities = sprints.map(sprint => {
    const completedPoints = sprint.issues
      .filter(i => i.status === 'DONE')
      .reduce((sum, i) => sum + (i.storyPoints || 0), 0);

    return {
      sprintId: sprint.id,
      name: sprint.name,
      velocity: completedPoints,
    };
  });

  const avgVelocity = sprintVelocities.reduce((sum, s) => sum + s.velocity, 0)
                      / sprintVelocities.length;

  // Trend: compare last 3 sprints average to previous 3
  const trend = calculateTrend(sprintVelocities);

  return { sprints: sprintVelocities, averageVelocity: avgVelocity, trend };
}
```

---

## 7. File Structure

```
src/
├── app/
│   ├── sprints/
│   │   └── page.tsx              # Sprint dashboard (NEW)
│   ├── api/
│   │   ├── sprints/
│   │   │   ├── route.ts          # GET/POST sprints (NEW)
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts      # GET/PATCH/DELETE sprint (NEW)
│   │   │   │   └── burndown/
│   │   │   │       └── route.ts  # GET burndown data (NEW)
│   │   │   └── velocity/
│   │   │       └── route.ts      # GET velocity data (NEW)
│   │   └── issues/
│   │       ├── route.ts          # Extended with storyPoints
│   │       └── [id]/
│   │           └── route.ts      # Extended with completedAt
├── components/
│   ├── BurndownChart.tsx         # (NEW)
│   ├── VelocityChart.tsx         # (NEW)
│   ├── SprintSummary.tsx         # (NEW)
│   ├── SprintSelect.tsx          # (NEW)
│   ├── StoryPointsSelect.tsx     # (NEW)
│   ├── IssueForm.tsx             # Modified - add storyPoints
│   └── IssueCard.tsx             # Modified - show storyPoints
├── lib/
│   ├── burndown.ts               # Burndown calculations (NEW)
│   ├── validations.ts            # Extended with sprint schemas
│   └── prisma.ts                 # Existing
├── types/
│   └── index.ts                  # Extended with Sprint types
└── tests/
    ├── burndown.test.ts          # (NEW)
    └── sprints.test.ts           # (NEW)
```

---

## 8. Technical Decisions

### 8.1 Why Recharts?

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **Recharts** | React-native, lightweight, good docs, MIT license | Less fancy animations | ✅ Selected |
| Chart.js | Feature-rich, widely used | Requires wrapper, larger bundle | ❌ |
| D3.js | Maximum flexibility | Steep learning curve, overkill | ❌ |
| Victory | Good React integration | Larger bundle size | ❌ |

### 8.2 Why Server-Side Aggregation?

- **Data integrity**: Calculations happen where data lives
- **Performance**: Single query with grouping vs multiple round trips
- **Caching potential**: Server can cache burndown data
- **Consistency**: Same calculation logic for all clients

### 8.3 Why Fixed 2-Week Sprints?

- **Simplicity**: Reduces edge cases and UI complexity
- **Standard practice**: Most teams use 2-week sprints
- **Out of scope**: Custom durations are explicitly out of scope per PRD
- **Future**: Can be extended later if needed

---

## 9. Security Considerations

### 9.1 Authorization

- All sprint endpoints require authentication (NextAuth session)
- Users can only access their own sprints (userId filter)
- Issues assigned to sprints must belong to same user
- No cross-user data leakage in burndown calculations

### 9.2 Input Validation

```typescript
// Sprint creation validation (Zod)
const createSprintSchema = z.object({
  name: z.string().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays === 14;
}, { message: "Sprint must be exactly 14 days" });

// Story points validation
const storyPointsSchema = z.number().int().min(1).max(21).nullable();
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

| Component | Test Cases |
|-----------|------------|
| `burndown.ts` | Calculation accuracy, edge cases (no points, all completed, mid-sprint changes) |
| `BurndownChart` | Renders with data, handles empty state, tooltip displays |
| `VelocityChart` | Renders bars, calculates average, shows trend |

### 10.2 Integration Tests

| API Route | Test Cases |
|-----------|------------|
| POST /api/sprints | Creates sprint, validates dates, rejects invalid |
| GET /api/sprints/[id]/burndown | Returns correct data, handles no issues |
| PATCH /api/issues/[id] | Sets completedAt when status=DONE |

### 10.3 E2E Tests (Optional)

- User creates sprint → assigns issues → completes issues → sees burndown update
- Velocity chart shows historical data correctly

---

## 11. Migration Plan

### Step 1: Schema Migration

```bash
# Add new fields and Sprint model
npx prisma migrate dev --name add_sprint_burndown
```

### Step 2: Seed Data (Optional)

```typescript
// Create sample sprint with issues for demo
const demoSprint = await prisma.sprint.create({
  data: {
    name: "Sprint 1",
    startDate: subDays(new Date(), 7),
    endDate: addDays(new Date(), 7),
    userId: demoUser.id,
  }
});
```

### Step 3: Gradual Rollout

1. Deploy schema changes (backward compatible - new fields nullable)
2. Deploy API endpoints
3. Deploy UI components
4. Update issue forms to include story points
5. Announce feature to users

---

## 12. Performance Considerations

### 12.1 Query Optimization

```sql
-- Burndown query (Prisma will generate similar)
SELECT
  DATE(completedAt) as completion_date,
  SUM(storyPoints) as points_completed
FROM Issue
WHERE sprintId = ? AND completedAt IS NOT NULL
GROUP BY DATE(completedAt)
ORDER BY completion_date;
```

### 12.2 Caching Strategy

- Burndown data for completed sprints: Cache indefinitely
- Current sprint burndown: Cache for 5 minutes
- Velocity data: Cache for 1 hour

---

*Architecture Document Generated via BMAD Method - Architect Agent (Winston)*
