'use client'

import { useState } from 'react'
import { IssuePriority } from '@/types'

interface IssueFormProps {
  onSubmit: (data: { title: string; description: string; priority: IssuePriority }) => Promise<void>
  onCancel: () => void
}

export function IssueForm({ onSubmit, onCancel }: IssueFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!description.trim()) {
      setError('Description is required')
      return
    }

    setSaving(true)
    try {
      await onSubmit({ title, description, priority })
    } catch {
      setError('Failed to create issue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Issue</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="input"
            placeholder="Enter issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            className="input min-h-[100px]"
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="priority" className="label">
            Priority
          </label>
          <select
            id="priority"
            className="input"
            value={priority}
            onChange={(e) => setPriority(e.target.value as IssuePriority)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Creating...' : 'Create Issue'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
