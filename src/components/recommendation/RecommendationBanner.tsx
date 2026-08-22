'use client';

import React from 'react';
import { RecommendationResult, CampusLocation } from '@/types';
import { Sparkles, Navigation, Eye, CheckCircle2 } from 'lucide-react';
import { OccupancyBadge } from '../spaces/OccupancyBadge';

interface RecommendationBannerProps {
  recommendation: RecommendationResult | null;
  onSelect: (loc: CampusLocation) => void;
  onNotify: (loc: CampusLocation) => void;
  onOpenFinder: () => void;
}

export const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  recommendation,
  onSelect,
  onNotify,
  onOpenFinder,
}) => {
  if (!recommendation) return null;

  const { location, matchScore, reasons, occupancyPercentage, isAvailable } =
    recommendation;
  const isCrowded = !isAvailable || occupancyPercentage >= 71;

  return (
    <div className="relative rounded-2xl p-6 sm:p-7 bg-surface-container-high border-2 border-primary-container shadow-2xl mb-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-primary-container text-tertiary text-xs font-bold tracking-wide font-sora">
              <Sparkles className="w-3.5 h-3.5 text-tertiary" />
              TOP RECOMMENDATION FOR YOU RIGHT NOW
            </span>
            <span className="text-xs font-black text-on-tertiary-fixed bg-tertiary-fixed px-2.5 py-0.5 rounded-full font-sora">
              {matchScore}% Match
            </span>
          </div>

          <h2
            onClick={() => onSelect(location)}
            className="font-sora text-xl sm:text-2xl font-bold text-on-surface hover:text-primary cursor-pointer transition-colors tracking-tight mb-2"
          >
            {location.name}
          </h2>

          <p className="font-inter text-xs sm:text-sm text-on-surface-variant mb-4 max-w-2xl leading-relaxed">
            {location.description}
          </p>

          {/* Explainability Breakdown: "Why Spotly recommends this spot:" */}
          <div className="p-3.5 rounded-xl bg-surface-container border border-primary-container/60 mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5 font-sora">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Why Spotly recommends this spot:
            </div>
            <div className="flex flex-wrap gap-2">
              {reasons.map((reason, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface border border-outline-variant/40 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {reason}
                </span>
              ))}
            </div>
          </div>

          {/* Location details */}
          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <span>
              Building: <strong className="text-on-surface">{location.building}</strong>
            </span>
            <span>•</span>
            <span>
              Floor: <strong className="text-on-surface">{location.floor}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary font-medium">
              <Navigation className="w-3 h-3" />
              {location.distance_minutes} min walk
            </span>
          </div>
        </div>

        {/* Right Action Column */}
        <div className="w-full lg:w-72 flex flex-col justify-between gap-4 p-5 rounded-xl bg-surface-container border border-primary-container">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-sora">
              Current Availability
            </div>
            <OccupancyBadge
              currentOccupancy={location.current_occupancy}
              capacity={location.capacity}
              trend={location.trend}
            />
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-surface-variant">
            {isCrowded ? (
              <button
                onClick={() => onNotify(location)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface border border-outline-variant font-sora font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-tertiary" />
                <span>Watch This Space</span>
              </button>
            ) : (
              <button
                onClick={() => onSelect(location)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs sm:text-sm shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Go Here Now</span>
              </button>
            )}

            <button
              onClick={onOpenFinder}
              className="w-full text-center text-xs text-on-surface-variant hover:text-on-surface py-1 transition-colors cursor-pointer"
            >
              Adjust study preferences →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
