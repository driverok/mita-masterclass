import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/sprints/[id] - Get sprint details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        issues: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            storyPoints: true,
            completedAt: true,
          },
        },
      },
    });

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Error fetching sprint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprint' },
      { status: 500 }
    );
  }
}

// PATCH /api/sprints/[id] - Update sprint
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Verify ownership
    const existing = await prisma.sprint.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    const sprint = await prisma.sprint.update({
      where: { id: params.id },
      data: {
        name: body.name,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Error updating sprint:', error);
    return NextResponse.json(
      { error: 'Failed to update sprint' },
      { status: 500 }
    );
  }
}

// DELETE /api/sprints/[id] - Delete sprint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.sprint.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    // Unassign issues from sprint before deleting
    await prisma.issue.updateMany({
      where: { sprintId: params.id },
      data: { sprintId: null },
    });

    await prisma.sprint.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sprint:', error);
    return NextResponse.json(
      { error: 'Failed to delete sprint' },
      { status: 500 }
    );
  }
}
