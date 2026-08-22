'use client';

import React, { useState } from 'react';
import { CampusLocation, HourlyTrafficPoint } from '@/types';
import { Clock, TrendingUp, Sparkles, AlertTriangle, Users, Trophy, UtensilsCrossed, BookOpen } from 'lucide-react';

interface HourlyTrafficChartProps {
  location: CampusLocation;
  compact?: boolean;
}

export const HourlyTrafficChart: React.FC<HourlyTrafficChartProps> = ({
  location,
  compact = false,
}) => {
  // Current real-time hour
  const currentHour = new Date().getHours();
  const [hoveredPoint, setHoveredPoint] = useState<HourlyTrafficPoint | null>(null);

  // Realistic default hourly profile based on space category
  const defaultTraffic: HourlyTrafficPoint[] =
    location.hourly_traffic && location.hourly_traffic.length > 0
      ? location.hourly_traffic
      : location.category === 'food'
      ? [
          { hour: '8 AM', hourNum: 8, occupancyPercentage: 30 },
          { hour: '10 AM', hourNum: 10, occupancyPercentage: 15 },
          { hour: '12 PM', hourNum: 12, occupancyPercentage: 65 },
          { hour: '1 PM', hourNum: 13, occupancyPercentage: 95 },
          { hour: '2 PM', hourNum: 14, occupancyPercentage: 75 },
          { hour: '4 PM', hourNum: 16, occupancyPercentage: 20 },
          { hour: '6 PM', hourNum: 18, occupancyPercentage: 35 },
          { hour: '8 PM', hourNum: 20, occupancyPercentage: 90 },
          { hour: '10 PM', hourNum: 22, occupancyPercentage: 20 },
        ]
      : location.category === 'sports'
      ? [
          { hour: '8 AM', hourNum: 8, occupancyPercentage: 30 },
          { hour: '10 AM', hourNum: 10, occupancyPercentage: 10 },
          { hour: '12 PM', hourNum: 12, occupancyPercentage: 5 },
          { hour: '1 PM', hourNum: 13, occupancyPercentage: 5 },
          { hour: '2 PM', hourNum: 14, occupancyPercentage: 10 },
          { hour: '4 PM', hourNum: 16, occupancyPercentage: 40 },
          { hour: '6 PM', hourNum: 18, occupancyPercentage: 95 },
          { hour: '8 PM', hourNum: 20, occupancyPercentage: 90 },
          { hour: '10 PM', hourNum: 22, occupancyPercentage: 30 },
        ]
      : [
          { hour: '8 AM', hourNum: 8, occupancyPercentage: 20 },
          { hour: '10 AM', hourNum: 10, occupancyPercentage: 70 },
          { hour: '12 PM', hourNum: 12, occupancyPercentage: 80 },
          { hour: '1 PM', hourNum: 13, occupancyPercentage: 50 },
          { hour: '2 PM', hourNum: 14, occupancyPercentage: 85 },
          { hour: '4 PM', hourNum: 16, occupancyPercentage: 70 },
          { hour: '6 PM', hourNum: 18, occupancyPercentage: 45 },
          { hour: '8 PM', hourNum: 20, occupancyPercentage: 35 },
          { hour: '10 PM', hourNum: 22, occupancyPercentage: 15 },
        ];

  // Get specific contextual insight label
  const getSpaceInsight = () => {
    if (location.category === 'food') {
      return {
        best: '3:00 PM – 5:30 PM (Fast service, zero token queue)',
        peak: '1:00 PM – 2:15 PM & 8:00 PM – 9:15 PM (Meal rush)',
        tag: '🍛 Daily Mess Schedule',
      };
    }
    if (location.category === 'sports') {
      return {
        best: 'Early morning (6:30 AM – 9:00 AM, court open)',
        peak: '5:30 PM – 9:00 PM (Floodlights on, team matches)',
        tag: '⚽ Match Primetime',
      };
    }
    if (location.type === 'lab') {
      return {
        best: 'After 6:30 PM (Evening hacking, open developer desks)',
        peak: '11:00 AM – 4:30 PM (Classroom labs & sprints)',
        tag: '💻 Dev Sprint Schedule',
      };
    }
    return {
      best: '8:00 AM – 11:30 AM (Silent deep work golden hour)',
      peak: '2:00 PM – 5:00 PM (Post-lecture study wave)',
      tag: '🤫 Focus Hours',
    };
  };

  const insights = getSpaceInsight();

  // Find closest point to current hour
  const isCurrentHourPoint = (point: HourlyTrafficPoint) => {
    return Math.abs(point.hourNum - currentHour) <= 1;
  };

  return (
    <div className={`rounded-2xl bg-surface-container border border-primary-container/80 ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-tertiary" />
          <h4 className="font-sora text-xs sm:text-sm font-bold text-on-surface">
            Hourly Rush &amp; Traffic Heatmap
          </h4>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-primary-container/40 text-primary border border-primary-container">
          {insights.tag}
        </span>
      </div>

      {/* Hourly Histogram Bars */}
      <div className="relative pt-6 pb-1">
        {/* Bars Container */}
        <div className="grid grid-flow-col auto-cols-fr gap-1.5 sm:gap-2 items-end h-28 px-1">
          {defaultTraffic.map((point, index) => {
            const isNow = isCurrentHourPoint(point);
            const pct = point.occupancyPercentage;

            // Heat Color
            const barColor =
              pct >= 75
                ? 'bg-[#ffb4ab]' // Crowded Coral
                : pct >= 45
                ? 'bg-[#c5cc7b]' // Moderate Olive
                : 'bg-[#a6d29b]'; // Calm Sage

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer relative"
              >
                {/* NOW Floating Needle Indicator */}
                {isNow && (
                  <div className="absolute -top-6 flex flex-col items-center animate-bounce z-10">
                    <span className="text-[9px] font-mono font-black text-on-tertiary bg-tertiary px-1.5 py-0.2 rounded-md shadow-sm">
                      NOW
                    </span>
                    <div className="w-1.5 h-1.5 rotate-45 bg-tertiary -mt-1" />
                  </div>
                )}

                {/* Bar */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 relative ${barColor} ${
                    isNow ? 'ring-2 ring-tertiary ring-offset-1 ring-offset-surface' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ height: `${Math.max(14, pct)}%` }}
                >
                  {/* Subtle inner top glow */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/30 rounded-t-lg" />
                </div>

                {/* Hour Label */}
                <span
                  className={`text-[9.5px] sm:text-[10px] font-mono whitespace-nowrap ${
                    isNow ? 'text-tertiary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {point.hour}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip Details */}
        {hoveredPoint && (
          <div className="mt-3 p-2.5 rounded-xl bg-surface-container-high border border-primary-container flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-on-surface">{hoveredPoint.hour}:</span>
              <span
                className={`font-sora font-bold ${
                  hoveredPoint.occupancyPercentage >= 75
                    ? 'text-error'
                    : hoveredPoint.occupancyPercentage >= 45
                    ? 'text-tertiary'
                    : 'text-primary'
                }`}
              >
                {hoveredPoint.occupancyPercentage}% Typical Occupancy
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-inter">
              {hoveredPoint.occupancyPercentage >= 75
                ? '🔥 Peak crowd rush'
                : hoveredPoint.occupancyPercentage >= 45
                ? '🟡 Moderate activity'
                : '🟢 Plenty of free space'}
            </span>
          </div>
        )}
      </div>

      {/* Smart Predictive Insights */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-surface-variant text-xs">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-primary-container/20 border border-primary-container/60">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-sora font-bold text-primary block text-[11px]">BEST TIME TO VISIT</span>
              <p className="text-on-surface-variant text-[11px] font-inter mt-0.5 leading-snug">
                {insights.best}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-tertiary-container/20 border border-tertiary-container/60">
            <AlertTriangle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
            <div>
              <span className="font-sora font-bold text-tertiary block text-[11px]">TYPICAL PEAK HOURS</span>
              <p className="text-on-surface-variant text-[11px] font-inter mt-0.5 leading-snug">
                {insights.peak}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
