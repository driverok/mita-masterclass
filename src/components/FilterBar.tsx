'use client'

import { IssueStatus, IssuePriority } from '@/types'

interface FilterBarProps {
  statusFilter: IssueStatus | ''
  priorityFilter: IssuePriority | ''
  onStatusChange: (status: IssueStatus | '') => void
  onPriorityChange: (priority: IssuePriority | '') => void
}

export function FilterBar({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
}: FilterBarProps) {
  const hasFilters = statusFilter || priorityFilter

  return (
    <div className="card mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Filter by:</span>

        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600">
            Status:
          </label>
          <select
            id="status-filter"
            className="input py-1 px-2 w-auto"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as IssueStatus | '')}
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm text-gray-600">
            Priority:
          </label>
          <select
            id="priority-filter"
            className="input py-1 px-2 w-auto"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as IssuePriority | '')}
          >
            <option value="">All</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              onStatusChange('')
              onPriorityChange('')
            }}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
