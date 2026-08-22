'use client';

import React from 'react';
import { RecommendationResult, CampusLocation } from '@/types';
import { Sparkles, Navigation, Eye, CheckCircle2, Armchair, SlidersHorizontal } from 'lucide-react';
import { OccupancyBadge } from '../spaces/OccupancyBadge';

interface RecommendationBannerProps {
  recommendation: RecommendationResult | null;
  onSelect: (loc: CampusLocation) => void;
  onNotify: (loc: CampusLocation) => void;
  onBookSeat?: (loc: CampusLocation) => void;
  onOpenFinder: () => void;
}

export const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  recommendation,
  onSelect,
  onNotify,
  onBookSeat,
  onOpenFinder,
}) => {
  if (!recommendation) return null;

  const { location, matchScore, reasons, occupancyPercentage, isAvailable } =
    recommendation;
  const isCrowded = !isAvailable || occupancyPercentage >= 71;
  const freeSeats = Math.max(0, location.capacity - location.current_occupancy);

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-surface-container-high border-2 border-primary-container shadow-2xl mb-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-primary-container text-tertiary text-xs font-bold tracking-wide font-sora shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-tertiary" />
              #1 TOP MATCH FOR YOU
            </span>
            <span className="text-xs font-black text-on-tertiary-fixed bg-tertiary-fixed px-3 py-0.5 rounded-full font-sora shadow-sm">
              {matchScore}% Match
            </span>
          </div>

          <h2
            onClick={() => onSelect(location)}
            className="font-sora text-xl sm:text-2xl font-bold text-on-surface hover:text-tertiary cursor-pointer transition-colors tracking-tight mb-2"
          >
            {location.name}
          </h2>

          <p className="font-inter text-xs sm:text-sm text-on-surface-variant mb-4 max-w-2xl leading-relaxed">
            {location.description}
          </p>

          {/* Explainability Breakdown: "Why Spotly recommends this spot:" */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-primary-container/60 mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5 font-sora">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Why Spotly recommends this space:
            </div>
            <div className="flex flex-wrap gap-2">
              {reasons.map((reason, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-surface-container-highest text-on-surface border border-outline-variant/40 flex items-center gap-1.5 font-inter"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {reason}
                </span>
              ))}
            </div>
          </div>

          {/* Location details */}
          <div className="flex items-center gap-3.5 text-xs text-on-surface-variant font-inter flex-wrap">
            <span className="flex items-center gap-1">
              <Armchair className="w-3.5 h-3.5 text-tertiary" />
              <strong>{location.table_count || 10}</strong> Tables
            </span>
            <span>•</span>
            <span>
              <strong>{location.capacity}</strong> Total Seats (
              <strong className="text-primary">{freeSeats} free</strong>)
            </span>
            <span>•</span>
            <span>
              Floor: <strong className="text-on-surface font-semibold">{location.floor}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary font-semibold">
              <Navigation className="w-3 h-3" />
              {location.distance_minutes} min walk
            </span>
          </div>
        </div>

        {/* Right Action Column */}
        <div className="w-full lg:w-72 flex flex-col justify-between gap-4 p-5 rounded-2xl bg-surface-container border border-primary-container shadow-inner">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-sora">
              Live Crowd Telemetry
            </div>
            <OccupancyBadge
              currentOccupancy={location.current_occupancy}
              capacity={location.capacity}
              trend={location.trend}
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* Book Seat CTA */}
            <button
              onClick={() => (onBookSeat ? onBookSeat(location) : onSelect(location))}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-sora font-bold border border-primary-container transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Armchair className="w-3.5 h-3.5 text-tertiary" />
              <span>Book Seat (Serial No.)</span>
            </button>

            {isCrowded ? (
              <button
                onClick={() => onNotify(location)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface border border-outline-variant text-xs font-sora font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <Eye className="w-3.5 h-3.5 text-tertiary" />
                <span>Watch Space</span>
              </button>
            ) : (
              <button
                onClick={() => onSelect(location)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Go to Space Now</span>
              </button>
            )}

            <button
              onClick={onOpenFinder}
              className="text-[11px] text-on-surface-variant hover:text-primary transition-colors text-center py-1 font-inter flex items-center justify-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Adjust My Space Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
