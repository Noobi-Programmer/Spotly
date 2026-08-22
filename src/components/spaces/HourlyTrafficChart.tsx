'use client';

import React, { useState } from 'react';
import { HourlyTrafficPoint, CampusLocation } from '@/types';
import { Clock, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

interface HourlyTrafficChartProps {
  location: CampusLocation;
  compact?: boolean;
}

// Generate realistic default hourly traffic pattern if not explicitly provided
export const getOrGenerateHourlyTraffic = (loc: CampusLocation): HourlyTrafficPoint[] => {
  if (loc.hourly_traffic && loc.hourly_traffic.length > 0) {
    return loc.hourly_traffic;
  }

  const currentHour = new Date().getHours(); // e.g. 14 for 2 PM

  const hoursConfig = [
    { hour: '8 AM', num: 8 },
    { hour: '10 AM', num: 10 },
    { hour: '12 PM', num: 12 },
    { hour: '1 PM', num: 13 },
    { hour: '2 PM', num: 14 },
    { hour: '4 PM', num: 16 },
    { hour: '6 PM', num: 18 },
    { hour: '8 PM', num: 20 },
    { hour: '10 PM', num: 22 },
  ];

  return hoursConfig.map(({ hour, num }) => {
    let pct = 20;

    if (loc.category === 'food') {
      // Mess peak at lunch (12-2 PM) and dinner (8-9 PM)
      if (num === 13 || num === 14) pct = 85;
      else if (num === 12) pct = 65;
      else if (num === 20) pct = 80;
      else if (num === 18) pct = 45;
      else pct = 25;
    } else if (loc.category === 'sports') {
      // Sports peak in late afternoon / evening (5-9 PM)
      if (num === 18 || num === 20) pct = 75;
      else if (num === 16) pct = 50;
      else if (num === 8) pct = 35;
      else pct = 15;
    } else {
      // Study spaces peak during afternoon & sprint hours (11 AM - 5 PM)
      if (num === 12 || num === 13 || num === 14) pct = 78;
      else if (num === 16 || num === 18) pct = 60;
      else if (num === 20 || num === 22) pct = 45;
      else pct = 30;
    }

    // Adjust active hour to match current live occupancy closely
    const isCurrent = Math.abs(currentHour - num) <= 1;
    if (isCurrent) {
      pct = Math.round((loc.current_occupancy / Math.max(1, loc.capacity)) * 100);
    }

    return {
      hour,
      hourNum: num,
      occupancyPercentage: pct,
      isCurrentHour: isCurrent,
    };
  });
};

export const HourlyTrafficChart: React.FC<HourlyTrafficChartProps> = ({
  location,
  compact = false,
}) => {
  const traffic = getOrGenerateHourlyTraffic(location);
  const [hoveredPoint, setHoveredPoint] = useState<HourlyTrafficPoint | null>(null);

  const getBarColor = (pct: number, isCurrent?: boolean) => {
    if (isCurrent) return 'bg-tertiary';
    if (pct < 40) return 'bg-primary/80';
    if (pct < 70) return 'bg-tertiary/70';
    return 'bg-error/80';
  };

  return (
    <div className="rounded-2xl bg-surface-container border border-primary-container p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-tertiary" />
          <h4 className="font-sora text-xs font-bold uppercase tracking-wider text-on-surface">
            Hourly Traffic &amp; Rush Pattern
          </h4>
        </div>
        <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded border border-primary-container/60">
          Google Popular Times Engine
        </span>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        {/* Hover / Active Tooltip */}
        {hoveredPoint ? (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-surface-container-highest border border-primary-container text-xs font-sora font-bold text-tertiary shadow-lg animate-in fade-in flex items-center gap-1.5 whitespace-nowrap">
            <span>{hoveredPoint.hour}:</span>
            <span className="font-mono text-on-surface font-black">
              {hoveredPoint.occupancyPercentage}% full
            </span>
            <span className="text-[10px] text-on-surface-variant font-inter">
              ({hoveredPoint.occupancyPercentage < 40 ? 'Calm & Free' : hoveredPoint.occupancyPercentage < 70 ? 'Moderate' : 'Peak Rush'})
            </span>
          </div>
        ) : (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[11px] text-on-surface-variant font-inter">
            Hover or tap any bar to inspect hourly crowd
          </div>
        )}

        {/* The Bars */}
        <div className="grid grid-cols-9 items-end gap-1.5 sm:gap-2.5 h-28 border-b border-surface-variant pb-1.5">
          {traffic.map((point) => {
            const barHeight = Math.max(12, point.occupancyPercentage);
            const isCurrent = point.isCurrentHour;
            const barColor = getBarColor(point.occupancyPercentage, isCurrent);

            return (
              <div
                key={point.hour}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => setHoveredPoint(point)}
                className="group relative flex flex-col items-center justify-end h-full cursor-pointer"
              >
                {/* Current Hour Indicator Tag */}
                {isCurrent && (
                  <span className="absolute -top-4 text-[9px] font-sora font-bold uppercase text-tertiary animate-pulse font-mono">
                    NOW
                  </span>
                )}

                {/* The Bar */}
                <div
                  style={{ height: `${barHeight}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 group-hover:brightness-125 group-hover:scale-y-105 ${barColor} ${
                    isCurrent ? 'ring-2 ring-tertiary-fixed shadow-md shadow-tertiary/20' : ''
                  }`}
                />

                {/* Hour Label */}
                <span className="text-[10px] font-inter text-on-surface-variant group-hover:text-on-surface transition-colors mt-2 text-center whitespace-nowrap">
                  {point.hour.replace(' ', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic Summary Advice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-inter">
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-primary-container/20 border border-primary-container text-primary">
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong>Best Time:</strong> {location.best_time_to_go || 'Early mornings & post 4 PM'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-tertiary-container/20 border border-tertiary/40 text-tertiary">
          <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong>Peak Rush:</strong> {location.peak_hours || '12:30 PM – 2:30 PM'}
          </span>
        </div>
      </div>
    </div>
  );
};
