import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Status and Priority values (strings for SQLite compatibility)
const IssueStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const

const IssuePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const

// Helper to create dates
function createDate(dateStr: string): Date {
  return new Date(dateStr + 'T09:00:00.000Z')
}

async function main() {
  // Clear existing data
  await prisma.activityLog.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.sprint.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 10)

  const demoUser = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      passwordHash,
    },
  })

  console.log('👤 Created demo user:', demoUser.username)

  // ============================================
  // CREATE SPRINTS (8 sprints for velocity demo)
  // ============================================
  const sprints = await Promise.all([
    prisma.sprint.create({
      data: {
        name: 'Sprint 1 - Foundation',
        startDate: createDate('2025-01-06'),
        endDate: createDate('2025-01-17'),
        isActive: false,
        userId: demoUser.id,
      },
    }),
    prisma.sprint.create({
      data: {
        name: 'Sprint 2 - User Management',
        startDate: createDate('2025-01-20'),
        endDate: createDate('2025-01-31'),
        isActive: false,
        userId: demoUser.id,
      },
    }),
    prisma.sprint.create({
      data: {
        name: 'Sprint 3 - Dashboard',
        startDate: createDate('2025-02-03'),
        endDate: createDate('2025-02-14'),
        isActive: false,
        userId: demoUser.id,
      },
    }),
    prisma.sprint.create({
      data: {
        name: 'Sprint 4 - Notifications',
        startDate: createDate('2025-02-17'),
        endDate: createDate('2025-02-28'),
        isActive: false,
        userId: demoUser.id,
      },
    }),
    prisma.sprint.create({
      data: {
        name: 'Sprint 5 - Reporting',
        startDate: createDate('2025-03-03'),
        endDate: createDate('2025-03-14'),
        isActive: false,
        userId: demoUser.id,
      },
    }),
    prisma.sprint.create({
      data: {
        name: 'Sprint 6 - API Integration',
        startDate: createDate('2025-03-17'),
        endDate: createDate('2025-03-28'),
        isActive: false,
        userId: demoUser.id,
      },
    }),
    prisma.sprint.create({
      data: {
        name: 'Sprint 7 - Mobile Optimization',
        startDate: createDate('2025-03-31'),
        endDate: createDate('2025-04-11'),
        isActive: false,
        userId: demoUser.id,
      },
    }),
    prisma.sprint.create({
      data: {
        name: 'Sprint 8 - Performance',
        startDate: createDate('2025-04-14'),
        endDate: createDate('2025-04-25'),
        isActive: true, // Current active sprint
        userId: demoUser.id,
      },
    }),
  ])

  console.log('🏃 Created', sprints.length, 'sprints')

  // ============================================
  // CREATE ISSUES FOR EACH SPRINT
  // ============================================

  // Sprint 1 - Foundation (31 points completed, 3 not done)
  const sprint1Issues = [
    { title: 'Set up Next.js project structure', description: 'Initialize project with TypeScript, Tailwind, and Prisma', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 3, completedAt: createDate('2025-01-07') },
    { title: 'Configure CI/CD pipeline', description: 'Set up GitHub Actions for automated testing and deployment', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-01-08') },
    { title: 'Implement user authentication', description: 'Add login and registration with NextAuth.js', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-01-10') },
    { title: 'Create database schema', description: 'Design and implement Prisma schema for users and issues', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-01-09') },
    { title: 'Set up design system', description: 'Create reusable Tailwind components and themes', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 5, completedAt: createDate('2025-01-13') },
    { title: 'Implement API gateway', description: 'Configure API routes with proper error handling', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 5, completedAt: createDate('2025-01-15') },
    { title: 'Add password reset flow', description: 'Email-based password reset functionality', status: IssueStatus.OPEN, priority: IssuePriority.MEDIUM, storyPoints: 3, completedAt: null },
  ]

  // Sprint 2 - User Management (36 points completed)
  const sprint2Issues = [
    { title: 'User profile management', description: 'Allow users to update their profile information', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-01-24') },
    { title: 'Role-based access control', description: 'Implement RBAC for admin and regular users', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 13, completedAt: createDate('2025-01-28') },
    { title: 'User invitation system', description: 'Allow admins to invite new users via email', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 8, completedAt: createDate('2025-01-29') },
    { title: 'Bulk user import', description: 'CSV import functionality for user accounts', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 5, completedAt: createDate('2025-01-30') },
    { title: 'User activity logging', description: 'Track and display user activity history', status: IssueStatus.OPEN, priority: IssuePriority.LOW, storyPoints: 2, completedAt: null },
    { title: 'Two-factor authentication', description: 'Add optional 2FA for enhanced security', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 2, completedAt: createDate('2025-01-31') },
  ]

  // Sprint 3 - Dashboard (40 points completed)
  const sprint3Issues = [
    { title: 'Main dashboard layout', description: 'Create responsive dashboard with sidebar navigation', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-02-05') },
    { title: 'Issue statistics widgets', description: 'Display issue counts by status and priority', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-02-06') },
    { title: 'Activity feed component', description: 'Show recent activity across all issues', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 8, completedAt: createDate('2025-02-07') },
    { title: 'Quick action buttons', description: 'Add shortcuts for common actions', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 3, completedAt: createDate('2025-02-10') },
    { title: 'Dashboard customization', description: 'Allow users to rearrange widgets', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 8, completedAt: createDate('2025-02-12') },
    { title: 'Performance metrics chart', description: 'Add charts for team velocity and burndown', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-02-14') },
    { title: 'Dashboard dark mode', description: 'Implement dark theme for dashboard', status: IssueStatus.OPEN, priority: IssuePriority.LOW, storyPoints: 2, completedAt: null },
  ]

  // Sprint 4 - Notifications (38 points completed - exceeded!)
  const sprint4Issues = [
    { title: 'Email notification service', description: 'Set up email sending with templates', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-02-19') },
    { title: 'In-app notification center', description: 'Real-time notification dropdown', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-02-21') },
    { title: 'Notification preferences', description: 'User settings for notification types', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 5, completedAt: createDate('2025-02-24') },
    { title: 'Issue assignment notifications', description: 'Notify when assigned to issues', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-02-25') },
    { title: 'Status change alerts', description: 'Notify watchers on status updates', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 5, completedAt: createDate('2025-02-26') },
    { title: 'Digest email summary', description: 'Daily/weekly summary emails', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 5, completedAt: createDate('2025-02-27') },
    { title: 'Push notifications', description: 'Browser push notification support', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 2, completedAt: createDate('2025-02-28') },
  ]

  // Sprint 5 - Reporting (42 points completed - exceeded!)
  const sprint5Issues = [
    { title: 'Report builder interface', description: 'Drag-and-drop report creation', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 13, completedAt: createDate('2025-03-07') },
    { title: 'PDF export functionality', description: 'Generate PDF reports', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-03-10') },
    { title: 'CSV data export', description: 'Export issue data to CSV', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 5, completedAt: createDate('2025-03-11') },
    { title: 'Scheduled reports', description: 'Automatic report generation and delivery', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 8, completedAt: createDate('2025-03-12') },
    { title: 'Report templates', description: 'Pre-built report templates', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 5, completedAt: createDate('2025-03-13') },
    { title: 'Custom chart widgets', description: 'Add pie/bar charts to reports', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 3, completedAt: createDate('2025-03-14') },
  ]

  // Sprint 6 - API Integration (41 points completed)
  const sprint6Issues = [
    { title: 'REST API documentation', description: 'OpenAPI/Swagger documentation', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-03-19') },
    { title: 'Webhook system', description: 'Outgoing webhooks for integrations', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-03-21') },
    { title: 'GitHub integration', description: 'Link issues with GitHub PRs', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 13, completedAt: createDate('2025-03-24') },
    { title: 'Slack integration', description: 'Send notifications to Slack', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 8, completedAt: createDate('2025-03-26') },
    { title: 'API rate limiting', description: 'Implement rate limiting for API', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 5, completedAt: createDate('2025-03-27') },
    { title: 'OAuth2 provider', description: 'Allow third-party OAuth login', status: IssueStatus.OPEN, priority: IssuePriority.LOW, storyPoints: 3, completedAt: null },
    { title: 'Jira sync', description: 'Two-way sync with Jira', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 2, completedAt: createDate('2025-03-28') },
  ]

  // Sprint 7 - Mobile Optimization (38 points - perfect sprint!)
  const sprint7Issues = [
    { title: 'Responsive navigation', description: 'Mobile-friendly hamburger menu', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-04-02') },
    { title: 'Touch-friendly UI', description: 'Larger touch targets for mobile', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-04-04') },
    { title: 'PWA configuration', description: 'Service worker and manifest', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-04-07') },
    { title: 'Offline support', description: 'Cache data for offline viewing', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 8, completedAt: createDate('2025-04-09') },
    { title: 'Mobile gestures', description: 'Swipe actions for issue cards', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 5, completedAt: createDate('2025-04-10') },
    { title: 'App icon and splash', description: 'Custom icons for installed app', status: IssueStatus.DONE, priority: IssuePriority.LOW, storyPoints: 2, completedAt: createDate('2025-04-11') },
    { title: 'Bottom navigation', description: 'Mobile-style bottom nav bar', status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, storyPoints: 2, completedAt: createDate('2025-04-11') },
  ]

  // Sprint 8 - Performance (Active sprint - partial completion)
  const sprint8Issues = [
    { title: 'Database query optimization', description: 'Add indexes and optimize queries', status: IssueStatus.IN_PROGRESS, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: null },
    { title: 'Implement Redis caching', description: 'Cache frequently accessed data', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 8, completedAt: createDate('2025-04-16') },
    { title: 'Frontend bundle optimization', description: 'Code splitting and tree shaking', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-04-17') },
    { title: 'Image lazy loading', description: 'Lazy load images and assets', status: IssueStatus.IN_PROGRESS, priority: IssuePriority.MEDIUM, storyPoints: 3, completedAt: null },
    { title: 'API response compression', description: 'Enable gzip compression', status: IssueStatus.OPEN, priority: IssuePriority.MEDIUM, storyPoints: 5, completedAt: null },
    { title: 'CDN integration', description: 'Serve static assets via CDN', status: IssueStatus.OPEN, priority: IssuePriority.MEDIUM, storyPoints: 8, completedAt: null },
    { title: 'Performance monitoring', description: 'Set up metrics and alerting', status: IssueStatus.DONE, priority: IssuePriority.HIGH, storyPoints: 5, completedAt: createDate('2025-04-18') },
  ]

  // Create all issues
  const allIssues = [
    { sprintId: sprints[0].id, issues: sprint1Issues },
    { sprintId: sprints[1].id, issues: sprint2Issues },
    { sprintId: sprints[2].id, issues: sprint3Issues },
    { sprintId: sprints[3].id, issues: sprint4Issues },
    { sprintId: sprints[4].id, issues: sprint5Issues },
    { sprintId: sprints[5].id, issues: sprint6Issues },
    { sprintId: sprints[6].id, issues: sprint7Issues },
    { sprintId: sprints[7].id, issues: sprint8Issues },
  ]

  let totalIssues = 0
  for (const { sprintId, issues } of allIssues) {
    for (const issue of issues) {
      await prisma.issue.create({
        data: {
          ...issue,
          userId: demoUser.id,
          sprintId,
        },
      })
      totalIssues++
    }
  }

  console.log('📝 Created', totalIssues, 'issues across sprints')

  // Summary statistics
  const stats = {
    sprint1: { committed: 34, completed: 31 },
    sprint2: { committed: 38, completed: 36 },
    sprint3: { committed: 42, completed: 40 },
    sprint4: { committed: 36, completed: 38 },
    sprint5: { committed: 40, completed: 42 },
    sprint6: { committed: 44, completed: 41 },
    sprint7: { committed: 38, completed: 38 },
    sprint8: { committed: 42, completed: 18 },
  }

  console.log('\n📊 Velocity Summary:')
  console.log('━'.repeat(50))
  Object.entries(stats).forEach(([sprint, data]) => {
    const pct = Math.round((data.completed / data.committed) * 100)
    console.log(`   ${sprint}: ${data.completed}/${data.committed} pts (${pct}%)`)
  })
  console.log('━'.repeat(50))
  console.log('   Average Velocity: ~38 points/sprint')
  console.log('\n✅ Database seeded successfully!')
  console.log('\n🔐 Login credentials:')
  console.log('   Username: demo')
  console.log('   Password: demo123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
