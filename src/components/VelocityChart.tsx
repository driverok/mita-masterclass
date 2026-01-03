'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface VelocityData {
  sprints: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    committedPoints: number;
    completedPoints: number;
    velocity: number;
  }>;
  averageVelocity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export default function VelocityChart() {
  const [data, setData] = useState<VelocityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVelocity() {
      try {
        const res = await fetch('/api/sprints/velocity');
        if (!res.ok) throw new Error('Failed to fetch velocity data');
        const velocityData = await res.json();
        setData(velocityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchVelocity();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <div className="text-gray-500">Loading velocity data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data || data.sprints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Velocity Trend
        </h2>
        <div className="flex items-center justify-center h-48 text-gray-500">
          No completed sprints yet. Complete a sprint to see velocity data.
        </div>
      </div>
    );
  }

  const trendIcon =
    data.trend === 'increasing' ? '📈' : data.trend === 'decreasing' ? '📉' : '➡️';
  const trendColor =
    data.trend === 'increasing'
      ? 'text-green-600'
      : data.trend === 'decreasing'
      ? 'text-red-600'
      : 'text-gray-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Velocity Trend</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.averageVelocity}
            </div>
            <div className="text-sm text-gray-500">Avg Velocity</div>
          </div>
          <div className={`text-2xl ${trendColor}`}>{trendIcon}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data.sprints}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const sprint = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{sprint.name}</p>
                    <p className="text-sm text-gray-500">
                      {sprint.startDate} - {sprint.endDate}
                    </p>
                    <p className="text-gray-600">
                      Committed: {sprint.committedPoints} pts
                    </p>
                    <p className="text-green-600">
                      Completed: {sprint.completedPoints} pts
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <ReferenceLine
            y={data.averageVelocity}
            stroke="#EF4444"
            strokeDasharray="3 3"
            label={{ value: 'Avg', fill: '#EF4444', fontSize: 12 }}
          />
          <Bar
            dataKey="velocity"
            fill="#3B82F6"
            name="Velocity (Completed Points)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
