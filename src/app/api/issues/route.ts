import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { issueCreateSchema } from '@/lib/validations'
import { IssueStatus, IssuePriority } from '@prisma/client'

// GET /api/issues - List issues for current user with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as IssueStatus | null
    const priority = searchParams.get('priority') as IssuePriority | null

    const where: {
      userId: string
      status?: IssueStatus
      priority?: IssuePriority
    } = {
      userId: session.user.id,
    }

    if (status && Object.values(IssueStatus).includes(status)) {
      where.status = status
    }

    if (priority && Object.values(IssuePriority).includes(priority)) {
      where.priority = priority
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    return NextResponse.json({ success: true, data: issues })
  } catch (error) {
    console.error('Error fetching issues:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}

// POST /api/issues - Create a new issue
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const result = issueCreateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { title, description, priority, storyPoints } = result.data

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        priority: priority as IssuePriority,
        storyPoints: storyPoints ?? null,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true, data: issue }, { status: 201 })
  } catch (error) {
    console.error('Error creating issue:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create issue' },
      { status: 500 }
    )
  }
}
