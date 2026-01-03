# MITA - Mini Issue Tracker Application

A simple issue tracking application built for Claude Code Masterclass demos.

## Features

- User authentication (register, login, logout)
- Issue CRUD operations
- Status workflow: Open → In Progress → Done → Open
- Priority levels: Low, Medium, High
- Filtering by status and priority
- Activity tracking for status/priority changes

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma db push

# Seed demo data (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- **Username**: demo
- **Password**: demo123

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo data |

## Project Structure

```
mita/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data script
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── issues/       # Issues page
│   │   ├── login/        # Login page
│   │   └── register/     # Register page
│   ├── components/       # React components
│   ├── lib/              # Utilities and config
│   ├── tests/            # Test files
│   └── types/            # TypeScript types
└── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Issues

- `GET /api/issues` - List user's issues (with filters)
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get single issue
- `PATCH /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

## Status Workflow

Valid status transitions:
- `OPEN` → `IN_PROGRESS`
- `IN_PROGRESS` → `DONE`
- `DONE` → `OPEN`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `NEXTAUTH_URL`: Your production URL
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
4. Deploy

For SQLite in production, consider using Turso or switching to PostgreSQL.

## Masterclass Demo Scenarios

This app is designed for these demo scenarios:

### MC5: BMAD Method
- Add sprint burndown chart feature
- Add issue comments feature
- Add due dates with overdue highlighting

### MC6: CI/CD Automation
- `@claude add priority badges` - Visual priority indicators
- `@claude fix login bug` - Authentication improvements
- Intentionally break tests to demo auto-fix

---

Built for Claude Code Masterclass - December 2025
