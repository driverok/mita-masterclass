import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { addDays } from 'date-fns';

const createSprintSchema = z.object({
  name: z.string().min(1).max(100),
  startDate: z.string().datetime().optional(),
});

// GET /api/sprints - List user's sprints
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sprints = await prisma.sprint.findMany({
      where: { userId: session.user.id },
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
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(sprints);
  } catch (error) {
    console.error('Error fetching sprints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    );
  }
}

// POST /api/sprints - Create a new sprint
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createSprintSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, startDate: startDateStr } = parsed.data;

    // Default to today if no start date provided
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    // Fixed 14-day sprint
    const endDate = addDays(startDate, 14);

    // Deactivate any currently active sprints
    await prisma.sprint.updateMany({
      where: { userId: session.user.id, isActive: true },
      data: { isActive: false },
    });

    const sprint = await prisma.sprint.create({
      data: {
        name,
        startDate,
        endDate,
        userId: session.user.id,
        isActive: true,
      },
    });

    return NextResponse.json(sprint, { status: 201 });
  } catch (error) {
    console.error('Error creating sprint:', error);
    return NextResponse.json(
      { error: 'Failed to create sprint' },
      { status: 500 }
    );
  }
}
