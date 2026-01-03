import { Issue, ActivityLog, IssueStatus, IssuePriority } from '@prisma/client'

export type { Issue, ActivityLog, IssueStatus, IssuePriority }

export interface IssueWithActivities extends Issue {
  activities: ActivityLog[]
}

export interface IssueFilters {
  status?: IssueStatus
  priority?: IssuePriority
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
