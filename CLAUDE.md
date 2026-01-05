
# MITA Development Guidelines

## Project Overview
MITA (Mini Issue Tracker Application) is a demo app for Claude Code Masterclass.

## Tech Stack
- Next.js 14 with App Router
- TypeScript strict mode
- Prisma ORM with SQLite
- NextAuth.js for authentication
- Tailwind CSS for styling
- Vitest for testing

## Build & Test Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint`
- DB Push: `npm run db:push`
- DB Seed: `npm run db:seed`

## Code Conventions
- Use TypeScript strict mode
- Follow existing component patterns in src/components/
- API routes in src/app/api/ follow RESTful conventions
- Use Zod for validation (see src/lib/validations.ts)
- Prefer Tailwind utility classes defined in globals.css

## Database Schema
- User: id, username, passwordHash
- Issue: id, title, description, status, priority, userId
- ActivityLog: id, changeType, oldValue, newValue, issueId, userId

## Status Workflow
Valid transitions only:
- OPEN → IN_PROGRESS
- IN_PROGRESS → DONE
- DONE → OPEN

## Testing
- Unit tests in src/tests/
- Run with `npm test`
- Use Vitest syntax (describe, it, expect)

## Important Patterns
- All API routes check authentication first
- Issues are scoped to the authenticated user
- Activity logs created for status/priority changes
- Client components use 'use client' directive
