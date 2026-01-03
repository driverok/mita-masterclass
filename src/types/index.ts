import { Issue, ActivityLog, Sprint } from '@prisma/client'

export type { Issue, ActivityLog, Sprint }

export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IssueWithActivities extends Issue {
  activities: ActivityLog[]
}

export interface IssueFilters {
  status?: IssueStatus
  priority?: IssuePriority
  sprintId?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface SprintWithIssues extends Sprint {
  issues: Issue[]
}

// Valid status transitions
export const VALID_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['DONE'],
  DONE: ['OPEN'],
};

// Story point values (Fibonacci)
export const STORY_POINT_VALUES = [1, 2, 3, 5, 8, 13, 21] as const;
export type StoryPointValue = typeof STORY_POINT_VALUES[number];
