import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { issueUpdateSchema, isValidStatusTransition } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/issues/[id] - Get a single issue
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const issue = await prisma.issue.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!issue) {
      return NextResponse.json(
        { success: false, error: 'Issue not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: issue })
  } catch (error) {
    console.error('Error fetching issue:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch issue' },
      { status: 500 }
    )
  }
}

// PATCH /api/issues/[id] - Update an issue
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const result = issueUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    // Find existing issue
    const existingIssue = await prisma.issue.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingIssue) {
      return NextResponse.json(
        { success: false, error: 'Issue not found' },
        { status: 404 }
      )
    }

    const { title, description, status, priority, storyPoints, sprintId } = result.data

    // Validate status transition
    if (status && !isValidStatusTransition(existingIssue.status, status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status transition from ${existingIssue.status} to ${status}. Allowed transitions: Open → In Progress → Done → Open`,
        },
        { status: 400 }
      )
    }

    // Track activities for status and priority changes
    const activities: Array<{
      changeType: string
      oldValue: string
      newValue: string
      issueId: string
      userId: string
    }> = []

    if (status && status !== existingIssue.status) {
      activities.push({
        changeType: 'STATUS_CHANGE',
        oldValue: existingIssue.status,
        newValue: status,
        issueId: id,
        userId: session.user.id,
      })
    }

    if (priority && priority !== existingIssue.priority) {
      activities.push({
        changeType: 'PRIORITY_CHANGE',
        oldValue: existingIssue.priority,
        newValue: priority,
        issueId: id,
        userId: session.user.id,
      })
    }

    // Track completedAt when status changes to DONE
    const completedAt = status === 'DONE' && existingIssue.status !== 'DONE'
      ? new Date()
      : status !== 'DONE' && existingIssue.status === 'DONE'
        ? null
        : undefined

    // Update issue and create activity logs in a transaction
    const [updatedIssue] = await prisma.$transaction([
      prisma.issue.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          ...(priority && { priority }),
          ...(storyPoints !== undefined && { storyPoints }),
          ...(sprintId !== undefined && { sprintId }),
          ...(completedAt !== undefined && { completedAt }),
        },
        include: {
          activities: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      ...activities.map((activity) => prisma.activityLog.create({ data: activity })),
    ])

    return NextResponse.json({ success: true, data: updatedIssue })
  } catch (error) {
    console.error('Error updating issue:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update issue' },
      { status: 500 }
    )
  }
}

// DELETE /api/issues/[id] - Delete an issue
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find existing issue
    const existingIssue = await prisma.issue.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingIssue) {
      return NextResponse.json(
        { success: false, error: 'Issue not found' },
        { status: 404 }
      )
    }

    await prisma.issue.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Error deleting issue:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete issue' },
      { status: 500 }
    )
  }
}
