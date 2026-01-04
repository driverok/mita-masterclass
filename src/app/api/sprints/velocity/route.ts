import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateVelocity } from '@/lib/burndown';

// GET /api/sprints/velocity - Get velocity data for recent sprints
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get last 5 completed sprints
    const sprints = await prisma.sprint.findMany({
      where: {
        userId: session.user.id,
        endDate: { lt: new Date() }, // Only completed sprints
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
      orderBy: { startDate: 'asc' },
      take: 5,
    });

    const velocityData = calculateVelocity(
      sprints.map((s) => ({
        id: s.id,
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
        issues: s.issues,
      }))
    );

    return NextResponse.json(velocityData);
  } catch (error) {
    console.error('Error calculating velocity:', error);
    return NextResponse.json(
      { error: 'Failed to calculate velocity' },
      { status: 500 }
    );
  }
}
