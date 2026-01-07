'use client'

import { useState } from 'react'
import { Issue, IssueStatus, IssuePriority, STORY_POINT_VALUES } from '@/types'
import { VALID_STATUS_TRANSITIONS } from '@/lib/validations'

interface IssueCardProps {
  issue: Issue
  isEditing: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onUpdate: (id: string, data: Partial<Issue>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const statusLabels: Record<IssueStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const priorityLabels: Record<IssuePriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export function IssueCard({
  issue,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: IssueCardProps) {
  const [title, setTitle] = useState(issue.title)
  const [description, setDescription] = useState(issue.description)
  const [priority, setPriority] = useState<IssuePriority>(issue.priority as IssuePriority)
  const [storyPoints, setStoryPoints] = useState<number | null>(issue.storyPoints ?? null)
  const [saving, setSaving] = useState(false)

  const getNextStatus = (): IssueStatus | null => {
    const transitions = VALID_STATUS_TRANSITIONS[issue.status as IssueStatus]
    return transitions?.[0] as IssueStatus | null
  }

  const handleStatusChange = async () => {
    const nextStatus = getNextStatus()
    if (!nextStatus) return

    setSaving(true)
    await onUpdate(issue.id, { status: nextStatus })
    setSaving(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(issue.id, { title, description, priority, storyPoints })
    setSaving(false)
  }

  const handleCancel = () => {
    setTitle(issue.title)
    setDescription(issue.description)
    setPriority(issue.priority as IssuePriority)
    setStoryPoints(issue.storyPoints ?? null)
    onCancelEdit()
  }

  if (isEditing) {
    return (
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select
                className="input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="label">Story Points</label>
              <select
                className="input"
                value={storyPoints ?? ''}
                onChange={(e) => setStoryPoints(e.target.value ? parseInt(e.target.value, 10) : null)}
              >
                <option value="">No estimate</option>
                {STORY_POINT_VALUES.map((points) => (
                  <option key={points} value={points}>
                    {points} {points === 1 ? 'point' : 'points'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 truncate">{issue.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`badge-${issue.priority.toLowerCase()}`}>
                {priorityLabels[issue.priority as IssuePriority]}
              </span>
              {issue.storyPoints && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {issue.storyPoints} {issue.storyPoints === 1 ? 'pt' : 'pts'}
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-3">{issue.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span
              className={`badge-${issue.status === 'IN_PROGRESS' ? 'in-progress' : issue.status.toLowerCase()}`}
            >
              {statusLabels[issue.status as IssueStatus]}
            </span>
            <span className="text-gray-400">
              Created {new Date(issue.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
          {getNextStatus() && (
            <button
              onClick={handleStatusChange}
              disabled={saving}
              className="btn-primary text-sm"
              title={`Move to ${statusLabels[getNextStatus()!]}`}
            >
              {saving ? '...' : `→ ${statusLabels[getNextStatus()!]}`}
            </button>
          )}
          <button onClick={onEdit} className="btn-secondary text-sm">
            Edit
          </button>
          <button
            onClick={() => onDelete(issue.id)}
            className="btn-danger text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
