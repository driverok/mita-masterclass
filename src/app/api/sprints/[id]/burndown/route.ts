import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateBurndown } from '@/lib/burndown';

// GET /api/sprints/[id]/burndown - Get burndown chart data
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
            storyPoints: true,
            status: true,
            completedAt: true,
          },
        },
      },
    });

    if (!sprint) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }

    const burndownData = calculateBurndown({
      id: sprint.id,
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      issues: sprint.issues,
    });

    return NextResponse.json(burndownData);
  } catch (error) {
    console.error('Error calculating burndown:', error);
    return NextResponse.json(
      { error: 'Failed to calculate burndown' },
      { status: 500 }
    );
  }
}
