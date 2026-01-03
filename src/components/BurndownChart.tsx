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
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <div className="text-gray-500">Loading burndown chart...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Sprint Burndown: {data.sprint.name}
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.summary.onTrack
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {data.summary.onTrack ? '✓ On Track' : '⚠ Behind Schedule'}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {data.summary.totalPoints}
          </div>
          <div className="text-sm text-gray-500">Total Points</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.summary.completedPoints}
          </div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.summary.remainingPoints}
          </div>
          <div className="text-sm text-gray-500">Remaining</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.summary.percentComplete}%
          </div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            label={{ value: 'Day', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Story Points', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const point = chartData.find((d) => d.day === label);
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">Day {label}</p>
                    <p className="text-sm text-gray-500">{point?.date}</p>
                    <p className="text-gray-600">
                      Ideal: {payload[0]?.value?.toFixed(1)} pts
                    </p>
                    {payload[1]?.value !== undefined && (
                      <p className="text-blue-600">
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

      <div className="mt-4 text-sm text-gray-500 text-center">
        {data.sprint.startDate} to {data.sprint.endDate}
      </div>
    </div>
  );
}
