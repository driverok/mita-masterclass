'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { IssueCard } from '@/components/IssueCard'
import { IssueForm } from '@/components/IssueForm'
import { FilterBar } from '@/components/FilterBar'
import { Issue, IssueStatus, IssuePriority } from '@/types'

export default function IssuesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [statusFilter, setStatusFilter] = useState<IssueStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | ''>('')

  const fetchIssues = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (priorityFilter) params.set('priority', priorityFilter)

      const response = await fetch(`/api/issues?${params}`)
      const data = await response.json()

      if (data.success) {
        setIssues(data.data)
      }
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchIssues()
    }
  }, [session, fetchIssues])

  const handleCreateIssue = async (data: { title: string; description: string; priority: IssuePriority }) => {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setShowForm(false)
        fetchIssues()
      }
    } catch (error) {
      console.error('Error creating issue:', error)
    }
  }

  const handleUpdateIssue = async (id: string, data: Partial<Issue>) => {
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setEditingIssue(null)
        fetchIssues()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error updating issue:', error)
    }
  }

  const handleDeleteIssue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this issue?')) return

    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        fetchIssues()
      }
    } catch (error) {
      console.error('Error deleting issue:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MITA</h1>
            <p className="text-sm text-gray-500">Mini Issue Tracker</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {session.user.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="btn-secondary text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Issues</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            + New Issue
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />

        {/* Create Issue Form */}
        {showForm && (
          <div className="mb-6">
            <IssueForm
              onSubmit={handleCreateIssue}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Issues List */}
        {issues.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No issues found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-primary-600 hover:text-primary-500"
            >
              Create your first issue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isEditing={editingIssue?.id === issue.id}
                onEdit={() => setEditingIssue(issue)}
                onCancelEdit={() => setEditingIssue(null)}
                onUpdate={handleUpdateIssue}
                onDelete={handleDeleteIssue}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">
              {issues.filter((i) => i.status === 'OPEN').length}
            </div>
            <div className="text-sm text-gray-500">Open</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">
              {issues.filter((i) => i.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {issues.filter((i) => i.status === 'DONE').length}
            </div>
            <div className="text-sm text-gray-500">Done</div>
          </div>
        </div>
      </main>
    </div>
  )
}
