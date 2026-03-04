'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';

interface BurndownData {
  sprint: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    totalPoints: number;
  };
  data: Array<{
    date: string;
    day: number;
    idealRemaining: number;
    actualRemaining: number;
    completed: number;
  }>;
  summary: {
    totalPoints: number;
    completedPoints: number;
    remainingPoints: number;
    percentComplete: number;
    onTrack: boolean;
  };
}

interface BurndownChartProps {
  sprintId: string;
}

export default function BurndownChart({ sprintId }: BurndownChartProps) {
  const [data, setData] = useState<BurndownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBurndown() {
      try {
        const res = await fetch(`/api/sprints/${sprintId}/burndown`);
        if (!res.ok) throw new Error('Failed to fetch burndown data');
        const burndownData = await res.json();
        setData(burndownData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (sprintId) {
      fetchBurndown();
    }
  }, [sprintId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-gray-500 dark:text-gray-400">Loading burndown chart...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-red-500">{error || 'No data available'}</div>
      </div>
    );
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayIndex = data.data.findIndex((d) => d.date === today);

  // Filter out future data points for actual line
  const chartData = data.data.map((point) => ({
    ...point,
    actual: point.actualRemaining >= 0 ? point.actualRemaining : undefined,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Sprint Burndown: {data.sprint.name}
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.summary.onTrack
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {data.summary.onTrack ? '✓ On Track' : '⚠ Behind Schedule'}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {data.summary.totalPoints}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Points</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.summary.completedPoints}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.summary.remainingPoints}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.summary.percentComplete}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
            label={{ value: 'Day', position: 'insideBottom', offset: -5 }}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            label={{ value: 'Story Points', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const point = chartData.find((d) => d.day === label);
                return (
                  <div className="bg-gray-800 text-gray-100 p-3 border border-gray-700 rounded shadow-lg">
                    <p className="font-semibold">Day {label}</p>
                    <p className="text-sm text-gray-400">{point?.date}</p>
                    <p className="text-gray-300">
                      Ideal: {payload[0]?.value?.toFixed(1)} pts
                    </p>
                    {payload[1]?.value !== undefined && (
                      <p className="text-blue-400">
                        Actual: {payload[1]?.value} pts
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="idealRemaining"
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            name="Ideal Burndown"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Actual Burndown"
            dot={{ fill: '#3B82F6' }}
            connectNulls={false}
          />
          {todayIndex >= 0 && (
            <ReferenceLine
              x={todayIndex}
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{ value: 'Today', fill: '#EF4444', fontSize: 12 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        {data.sprint.startDate} to {data.sprint.endDate}
      </div>
    </div>
  );
}
