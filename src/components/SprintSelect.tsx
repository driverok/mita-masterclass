'use client';

import { useEffect, useState } from 'react';

interface Sprint {
  id: string;
  name: string;
  isActive: boolean;
}

interface SprintSelectProps {
  value: string | null;
  onChange: (sprintId: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export default function SprintSelect({
  value,
  onChange,
  disabled = false,
  className = '',
}: SprintSelectProps) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSprints() {
      try {
        const res = await fetch('/api/sprints');
        if (res.ok) {
          const data = await res.json();
          setSprints(data);
        }
      } catch (error) {
        console.error('Failed to fetch sprints:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSprints();
  }, []);

  if (loading) {
    return (
      <select
        disabled
        className={`block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed ${className}`}
      >
        <option>Loading...</option>
      </select>
    );
  }

  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === '' ? null : val);
      }}
      disabled={disabled}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">No sprint</option>
      {sprints.map((sprint) => (
        <option key={sprint.id} value={sprint.id}>
          {sprint.name}{sprint.isActive ? ' (Active)' : ''}
        </option>
      ))}
    </select>
  );
}
