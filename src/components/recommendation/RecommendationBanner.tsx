'use client';

import React from 'react';
import { RecommendationResult, CampusLocation } from '@/types';
import { Sparkles, Navigation, Bell, CheckCircle2, ChevronRight, Zap, VolumeX } from 'lucide-react';
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

  const { location, matchScore, reasons, occupancyPercentage } = recommendation;
  const isCrowded = occupancyPercentage >= 75;

  return (
    <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-teal-950/70 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 mb-8 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              RECOMMENDED FOR YOU RIGHT NOW
            </span>
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              {matchScore}% Match
            </span>
          </div>

          <h2
            onClick={() => onSelect(location)}
            className="text-xl sm:text-2xl font-black text-white hover:text-emerald-300 cursor-pointer transition-colors tracking-tight mb-2"
          >
            {location.name}
          </h2>

          <p className="text-xs text-slate-300 mb-4 max-w-2xl leading-relaxed">
            {location.description}
          </p>

          {/* Explainability Breakdown: "Why this space?" */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/25 mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Why Spotly recommends this spot:
            </div>
            <div className="flex flex-wrap gap-2">
              {reasons.map((reason, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-200 border border-emerald-500/30 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {reason}
                </span>
              ))}
            </div>
          </div>

          {/* Location details */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              Building: <strong className="text-slate-200">{location.building}</strong>
            </span>
            <span>•</span>
            <span>
              Floor: <strong className="text-slate-200">{location.floor}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <Navigation className="w-3 h-3" />
              {location.distance_minutes} min walk
            </span>
          </div>
        </div>

        {/* Right Action Column */}
        <div className="w-full lg:w-72 flex flex-col justify-between gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Current Availability
            </div>
            <OccupancyBadge
              currentOccupancy={location.current_occupancy}
              capacity={location.capacity}
            />
          </div>

          <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/80">
            {isCrowded ? (
              <button
                onClick={() => onNotify(location)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Bell className="w-4 h-4" />
                <span>Notify Me When Below 50%</span>
              </button>
            ) : (
              <button
                onClick={() => onSelect(location)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Go Here Now</span>
              </button>
            )}

            <button
              onClick={onOpenFinder}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
            >
              Adjust my study preferences →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
