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

async function main() {
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

  console.log('Created demo user:', demoUser.username)

  // Create sample issues
  const issues = [
    {
      title: 'Implement user authentication',
      description: 'Add login and registration functionality with secure password hashing',
      status: IssueStatus.DONE,
      priority: IssuePriority.HIGH,
    },
    {
      title: 'Add issue filtering by status',
      description: 'Users should be able to filter issues by Open, In Progress, and Done statuses',
      status: IssueStatus.IN_PROGRESS,
      priority: IssuePriority.MEDIUM,
    },
    {
      title: 'Create priority badges',
      description: 'Add visual indicators for issue priority levels (High, Medium, Low)',
      status: IssueStatus.OPEN,
      priority: IssuePriority.HIGH,
    },
    {
      title: 'Add activity log display',
      description: 'Show history of status and priority changes on issue detail page',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
    },
    {
      title: 'Implement issue search',
      description: 'Allow users to search issues by title and description',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
    },
  ]

  for (const issue of issues) {
    await prisma.issue.create({
      data: {
        ...issue,
        userId: demoUser.id,
      },
    })
  }

  console.log('Created', issues.length, 'sample issues')
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
