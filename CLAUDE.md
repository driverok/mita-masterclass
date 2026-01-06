# MITA Development Guidelines

## Project Overview
MITA (Mini Issue Tracker Application) is a demo app for Claude Code Masterclass Series.

> **📁 Additional CLAUDE.md files:**
> - `.claude/CLAUDE.md` - CI/CD specific rules (issue handling, PR review, CI failures)

---

## Tech Stack
- Next.js 14 with App Router
- TypeScript strict mode
- Prisma ORM with SQLite
- NextAuth.js for authentication
- Tailwind CSS for styling
- Vitest for testing

## Build & Test Commands
```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Run linter
npm run db:push  # Push schema to DB
npm run db:seed  # Seed database
```

## Code Conventions
- Use TypeScript strict mode
- Follow existing component patterns in `src/components/`
- API routes in `src/app/api/` follow RESTful conventions
- Use Zod for validation (see `src/lib/validations.ts`)
- Prefer Tailwind utility classes defined in `globals.css`

## Database Schema
```
User: id, username, passwordHash
Issue: id, title, description, status, priority, userId
ActivityLog: id, changeType, oldValue, newValue, issueId, userId
```

## Status Workflow
Valid transitions only:
```
OPEN → IN_PROGRESS → DONE
                ↑       ↓
                └───────┘
```
- OPEN → IN_PROGRESS ✅
- IN_PROGRESS → DONE ✅
- DONE → OPEN ✅ (reopen)

## Project Structure
```
src/
├── app/
│   ├── api/          # API routes (RESTful)
│   ├── dashboard/    # Main dashboard pages
│   └── auth/         # Auth pages
├── components/       # Reusable UI components
├── lib/              # Utilities, validations, db
└── tests/            # Vitest unit tests
```

## Key Components
- `IssueCard.tsx` - Displays individual issue with status/priority
- `IssueList.tsx` - List of issues with filtering
- `SprintBoard.tsx` - Kanban-style sprint view
- `BurndownChart.tsx` - Sprint burndown visualization

## Testing
- Unit tests in `src/tests/`
- Run with `npm test`
- Use Vitest syntax (describe, it, expect)
- Test files: `*.test.ts` or `*.test.tsx`

## Important Patterns
- All API routes check authentication first
- Issues are scoped to the authenticated user
- Activity logs created for status/priority changes
- Client components use `'use client'` directive
- Server components are default (no directive needed)

## Authentication
- NextAuth.js with credentials provider
- Session stored in JWT
- Protected routes check session server-side
- Demo users seeded via `npm run db:seed`
