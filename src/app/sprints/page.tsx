'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BurndownChart from '@/components/BurndownChart';
import VelocityChart from '@/components/VelocityChart';
import SprintSummary from '@/components/SprintSummary';

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  issues: Array<{
    id: string;
    storyPoints: number | null;
    status: string;
  }>;
}

export default function SprintsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchSprints() {
      try {
        const res = await fetch('/api/sprints');
        if (res.ok) {
          const data = await res.json();
          setSprints(data);
          // Auto-select active sprint
          const activeSprint = data.find((s: Sprint) => s.isActive);
          if (activeSprint) {
            setSelectedSprintId(activeSprint.id);
          } else if (data.length > 0) {
            setSelectedSprintId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch sprints:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchSprints();
    }
  }, [session]);

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSprintName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSprintName }),
      });

      if (res.ok) {
        const newSprint = await res.json();
        setSprints((prev) => [{ ...newSprint, issues: [] }, ...prev]);
        setSelectedSprintId(newSprint.id);
        setNewSprintName('');
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Failed to create sprint:', error);
    } finally {
      setCreating(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Track your sprint progress and team velocity
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/issues')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back to Issues
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Sprint
            </button>
          </div>
        </div>

        {/* Create Sprint Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Create New Sprint</h2>
            <form onSubmit={handleCreateSprint} className="flex gap-4">
              <input
                type="text"
                value={newSprintName}
                onChange={(e) => setNewSprintName(e.target.value)}
                placeholder="Sprint name (e.g., Sprint 1)"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={creating || !newSprintName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Sprint'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewSprintName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-2">
              Sprint will be 14 days starting from today.
            </p>
          </div>
        )}

        {sprints.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Sprints Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first sprint to start tracking progress
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Sprint
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sprint List (Sidebar) */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Sprints</h2>
              {sprints.map((sprint) => (
                <SprintSummary
                  key={sprint.id}
                  sprint={sprint}
                  selected={sprint.id === selectedSprintId}
                  onSelect={() => setSelectedSprintId(sprint.id)}
                />
              ))}
            </div>

            {/* Charts (Main Content) */}
            <div className="lg:col-span-3 space-y-6">
              {selectedSprintId && (
                <BurndownChart sprintId={selectedSprintId} />
              )}
              <VelocityChart />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
