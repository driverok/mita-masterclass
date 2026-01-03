import { addDays, differenceInDays, format, isBefore, isAfter, startOfDay } from 'date-fns';

export interface BurndownDataPoint {
  date: string;
  day: number;
  idealRemaining: number;
  actualRemaining: number;
  completed: number;
}

export interface SprintWithIssues {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  issues: Array<{
    id: string;
    storyPoints: number | null;
    status: string;
    completedAt: Date | null;
  }>;
}

export interface BurndownResponse {
  sprint: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    totalPoints: number;
  };
  data: BurndownDataPoint[];
  summary: {
    totalPoints: number;
    completedPoints: number;
    remainingPoints: number;
    percentComplete: number;
    onTrack: boolean;
  };
}

export interface VelocityDataPoint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  committedPoints: number;
  completedPoints: number;
  velocity: number;
}

export interface VelocityResponse {
  sprints: VelocityDataPoint[];
  averageVelocity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Calculate burndown chart data for a sprint
 */
export function calculateBurndown(sprint: SprintWithIssues): BurndownResponse {
  const startDate = startOfDay(new Date(sprint.startDate));
  const endDate = startOfDay(new Date(sprint.endDate));
  const today = startOfDay(new Date());

  // Calculate total story points
  const totalPoints = sprint.issues.reduce(
    (sum, issue) => sum + (issue.storyPoints || 0),
    0
  );

  // Sprint duration in days
  const sprintDays = differenceInDays(endDate, startDate);
  const dailyBurn = totalPoints / sprintDays;

  const data: BurndownDataPoint[] = [];

  // Generate data for each day of the sprint
  for (let day = 0; day <= sprintDays; day++) {
    const currentDate = addDays(startDate, day);
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    // Ideal burndown: linear decrease from total to 0
    const idealRemaining = Math.max(0, totalPoints - dailyBurn * day);

    // Only calculate actual if date is in the past or today
    let actualRemaining = totalPoints;
    let completedByDate = 0;

    if (isBefore(currentDate, today) || format(currentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      // Calculate completed points up to this date
      completedByDate = sprint.issues
        .filter((issue) => {
          if (!issue.completedAt) return false;
          const completedDate = startOfDay(new Date(issue.completedAt));
          return isBefore(completedDate, addDays(currentDate, 1));
        })
        .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

      actualRemaining = totalPoints - completedByDate;
    } else {
      // Future dates: no actual data yet
      actualRemaining = -1; // Indicates no data
    }

    data.push({
      date: dateStr,
      day,
      idealRemaining: Math.round(idealRemaining * 10) / 10,
      actualRemaining: actualRemaining === -1 ? -1 : actualRemaining,
      completed: completedByDate,
    });
  }

  // Calculate summary
  const completedPoints = sprint.issues
    .filter((issue) => issue.status === 'DONE')
    .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

  const remainingPoints = totalPoints - completedPoints;
  const percentComplete = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  // Determine if on track (actual <= ideal for today)
  const todayData = data.find(
    (d) => d.date === format(today, 'yyyy-MM-dd')
  );
  const onTrack = todayData
    ? todayData.actualRemaining <= todayData.idealRemaining
    : true;

  return {
    sprint: {
      id: sprint.id,
      name: sprint.name,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      totalPoints,
    },
    data,
    summary: {
      totalPoints,
      completedPoints,
      remainingPoints,
      percentComplete,
      onTrack,
    },
  };
}

/**
 * Calculate velocity data across multiple sprints
 */
export function calculateVelocity(sprints: SprintWithIssues[]): VelocityResponse {
  const velocityData: VelocityDataPoint[] = sprints.map((sprint) => {
    const committedPoints = sprint.issues.reduce(
      (sum, issue) => sum + (issue.storyPoints || 0),
      0
    );

    const completedPoints = sprint.issues
      .filter((issue) => issue.status === 'DONE')
      .reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

    return {
      id: sprint.id,
      name: sprint.name,
      startDate: format(new Date(sprint.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(sprint.endDate), 'yyyy-MM-dd'),
      committedPoints,
      completedPoints,
      velocity: completedPoints,
    };
  });

  // Calculate average velocity
  const totalVelocity = velocityData.reduce((sum, s) => sum + s.velocity, 0);
  const averageVelocity =
    velocityData.length > 0
      ? Math.round((totalVelocity / velocityData.length) * 10) / 10
      : 0;

  // Calculate trend (compare last half to first half)
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (velocityData.length >= 4) {
    const midPoint = Math.floor(velocityData.length / 2);
    const firstHalfAvg =
      velocityData.slice(0, midPoint).reduce((sum, s) => sum + s.velocity, 0) /
      midPoint;
    const secondHalfAvg =
      velocityData.slice(midPoint).reduce((sum, s) => sum + s.velocity, 0) /
      (velocityData.length - midPoint);

    if (secondHalfAvg > firstHalfAvg * 1.1) {
      trend = 'increasing';
    } else if (secondHalfAvg < firstHalfAvg * 0.9) {
      trend = 'decreasing';
    }
  }

  return {
    sprints: velocityData,
    averageVelocity,
    trend,
  };
}
