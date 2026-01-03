'use client';

import { STORY_POINT_VALUES } from '@/types';

interface StoryPointsSelectProps {
  value: number | null;
  onChange: (points: number | null) => void;
  disabled?: boolean;
  className?: string;
}

export default function StoryPointsSelect({
  value,
  onChange,
  disabled = false,
  className = '',
}: StoryPointsSelectProps) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === '' ? null : parseInt(val, 10));
      }}
      disabled={disabled}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">No estimate</option>
      {STORY_POINT_VALUES.map((points) => (
        <option key={points} value={points}>
          {points} {points === 1 ? 'point' : 'points'}
        </option>
      ))}
    </select>
  );
}
