'use client';

import { format, differenceInDays, isAfter, isBefore } from 'date-fns';

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  issues?: Array<{
    id: string;
    storyPoints: number | null;
    status: string;
  }>;
}

interface SprintSummaryProps {
  sprint: Sprint;
  onSelect?: () => void;
  selected?: boolean;
}

export default function SprintSummary({
  sprint,
  onSelect,
  selected = false,
}: SprintSummaryProps) {
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const today = new Date();

  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = Math.max(0, Math.min(totalDays, differenceInDays(today, startDate)));
  const daysRemaining = Math.max(0, differenceInDays(endDate, today));

  const issues = sprint.issues || [];
  const totalPoints = issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  const completedPoints = issues
    .filter((i) => i.status === 'DONE')
    .reduce((sum, i) => sum + (i.storyPoints || 0), 0);

  const progressPercent = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const sprintStatus = isBefore(today, startDate)
    ? 'upcoming'
    : isAfter(today, endDate)
    ? 'completed'
    : 'active';

  const statusBadge = {
    upcoming: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Upcoming' },
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completed' },
  }[sprintStatus];

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800">{sprint.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
        >
          {statusBadge.label}
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-3">
        {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">
            {completedPoints} / {totalPoints} pts ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 rounded-full h-2 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="font-semibold text-gray-800">{issues.length}</div>
          <div className="text-gray-500">Issues</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800">{daysElapsed}</div>
          <div className="text-gray-500">Days In</div>
        </div>
        <div>
          <div className="font-semibold text-gray-800">{daysRemaining}</div>
          <div className="text-gray-500">Days Left</div>
        </div>
      </div>
    </div>
  );
}
