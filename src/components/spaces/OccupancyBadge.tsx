'use client';

import React from 'react';
import { getCrowdColor, getCrowdStatus } from '@/lib/engine/recommendation';
import { cn } from '@/lib/utils/cn';

interface OccupancyBadgeProps {
  currentOccupancy: number;
  capacity: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const OccupancyBadge: React.FC<OccupancyBadgeProps> = ({
  currentOccupancy,
  capacity,
  showDetails = true,
  size = 'md',
}) => {
  const percentage = Math.round((currentOccupancy / Math.max(1, capacity)) * 100);
  const status = getCrowdStatus(percentage);
  const colors = getCrowdColor(percentage);
  const availableSeats = Math.max(0, capacity - currentOccupancy);

  const statusLabel = {
    spacious: 'Spacious',
    moderate: 'Moderate',
    full: 'High Crowd',
  }[status];

  if (size === 'sm') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
          colors.badge
        )}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: colors.hex }}
        />
        {percentage}% ({availableSeats} free)
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
            colors.badge
          )}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.hex }}
          />
          {statusLabel} • {percentage}%
        </span>
        {showDetails && (
          <span className="text-xs text-slate-400 font-medium">
            <strong className="text-slate-200">{availableSeats}</strong> / {capacity} seats open
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(100, percentage)}%`,
            backgroundColor: colors.hex,
          }}
        />
      </div>
    </div>
  );
};
