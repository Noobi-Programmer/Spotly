'use client';

import React from 'react';
import { RecommendationResult, CampusLocation } from '@/types';
import {
  Sparkles,
  Navigation,
  Eye,
  CheckCircle2,
  Armchair,
  ArrowRight,
  Zap,
  VolumeX,
  Wifi,
  Trophy,
} from 'lucide-react';

interface RecommendationBannerProps {
  recommendation: RecommendationResult | null;
  onSelect: (loc: CampusLocation) => void;
  onNotify: (loc: CampusLocation) => void;
  onBookSeat?: (loc: CampusLocation) => void;
  onOpenFinder: () => void;
  onQuickPrefToggle?: (pref: 'quiet' | 'charging' | 'wifi' | 'lowCrowd') => void;
}

export const RecommendationBanner: React.FC<RecommendationBannerProps> = ({
  recommendation,
  onSelect,
  onNotify,
  onBookSeat,
  onOpenFinder,
  onQuickPrefToggle,
}) => {
  if (!recommendation) return null;

  const { location, matchScore, reasons, occupancyPercentage, isAvailable } =
    recommendation;
  const isFull = !isAvailable;
  const freeSeats = Math.max(0, location.capacity - location.current_occupancy);
  const isSports = location.category === 'sports';

  // Density Bar calculation: 10 segments
  const filledBlocks = Math.round((occupancyPercentage / 100) * 10);

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-surface-container-high border-2 border-primary-container shadow-2xl mb-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-primary-container text-tertiary text-xs font-bold tracking-wide font-sora shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-tertiary" />
              SPOTLY DECISION ENGINE
            </span>
            <span className="text-xs font-black text-on-tertiary-fixed bg-tertiary-fixed px-3 py-0.5 rounded-full font-sora shadow-sm">
              {matchScore}% Match
            </span>
          </div>

          <h2
            onClick={() => onSelect(location)}
            className="font-sora text-2xl sm:text-3xl font-bold text-on-surface hover:text-tertiary cursor-pointer transition-colors tracking-tight mb-2 flex items-center gap-2"
          >
            <span>{location.name}</span>
            <ArrowRight className="w-5 h-5 text-tertiary" />
          </h2>

          <p className="font-inter text-xs sm:text-sm text-on-surface-variant mb-4 max-w-2xl leading-relaxed">
            {location.description}
          </p>

          {/* Explainability Breakdown: "Why Spotly recommends this spot" */}
          <div className="p-3.5 rounded-2xl bg-surface-container border border-primary-container/60 mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5 font-sora">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Why this is your best match right now:
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

          {/* Location Amenities & Specs */}
          <div className="flex items-center gap-3.5 text-xs text-on-surface-variant font-inter flex-wrap">
            {isSports ? (
              <span className="flex items-center gap-1 text-secondary font-bold font-sora">
                <Trophy className="w-3.5 h-3.5" />
                <span>Court Open • Locker Gear Free</span>
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1">
                  <Armchair className="w-3.5 h-3.5 text-tertiary" />
                  <strong>{location.table_count || 10}</strong> Tables
                </span>
                <span>•</span>
                <span>
                  <strong>{location.capacity}</strong> Total Seats (
                  <strong className="text-primary">{freeSeats} free</strong>)
                </span>
              </>
            )}
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
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-sora">
              <span>Live Density</span>
              <span className="font-mono text-on-surface">{occupancyPercentage}% full</span>
            </div>

            {/* Segmented Density Bar */}
            <div className="flex items-center gap-1 h-2.5 w-full my-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    i < filledBlocks
                      ? occupancyPercentage >= 75
                        ? 'bg-error'
                        : occupancyPercentage >= 40
                        ? 'bg-tertiary'
                        : 'bg-primary'
                      : 'bg-surface-variant/40'
                  }`}
                />
              ))}
            </div>

            <div className="text-[11px] text-primary font-inter font-semibold">
              🟢 {freeSeats} seats free right now
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Primary Action Button */}
            <button
              onClick={() => (onBookSeat ? onBookSeat(location) : onSelect(location))}
              disabled={isFull}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary text-xs font-sora font-bold shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSports ? (
                <>
                  <Trophy className="w-4 h-4" />
                  <span>Book Court Slot &amp; Gear</span>
                </>
              ) : (
                <>
                  <Armchair className="w-4 h-4" />
                  <span>Go There &amp; Pick Seat</span>
                </>
              )}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Actions Row */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelect(location)}
                className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-sora font-semibold border border-primary-container transition-colors cursor-pointer text-center"
              >
                View Details
              </button>
              <button
                onClick={() => onNotify(location)}
                className="p-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface border border-primary-container transition-colors cursor-pointer"
                title="Watch this space"
              >
                <Eye className="w-4 h-4 text-tertiary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
