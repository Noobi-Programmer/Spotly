'use client';

import React from 'react';
import { getCrowdColor, getOccupancyTier } from '@/lib/engine/recommendation';
import { cn } from '@/lib/utils/cn';
import { CrowdTrend } from '@/types';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface OccupancyBadgeProps {
  currentOccupancy: number;
  capacity: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  trend?: CrowdTrend;
}

export const OccupancyBadge: React.FC<OccupancyBadgeProps> = ({
  currentOccupancy,
  capacity,
  showDetails = true,
  size = 'md',
  trend,
}) => {
  const percentage = Math.round((currentOccupancy / Math.max(1, capacity)) * 100);
  const tier = getOccupancyTier(percentage);
  const colors = getCrowdColor(percentage);
  const availableSeats = Math.max(0, capacity - currentOccupancy);

  const statusLabel = {
    low: 'LOW CROWD',
    moderate: 'MODERATE',
    high: 'HIGH CROWD',
    full: 'FULL',
  }[tier];

  const renderTrendPill = () => {
    if (!trend) return null;
    if (trend === 'getting_busier') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          <TrendingUp className="w-3 h-3" />
          <span>Getting busier</span>
        </span>
      );
    }
    if (trend === 'clearing_up') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <TrendingDown className="w-3 h-3" />
          <span>Clearing up</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/40">
        <ArrowRight className="w-3 h-3" />
        <span>Steady</span>
      </span>
    );
  };

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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wider',
              colors.badge
            )}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.hex }}
            />
            {statusLabel} • {percentage}%
          </span>
          {renderTrendPill()}
        </div>

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
