'use client';

import React, { useState } from 'react';
import { CampusLocation } from '@/types';
import { OccupancyBadge } from './OccupancyBadge';
import {
  X,
  Navigation,
  Eye,
  Volume2,
  VolumeX,
  Zap,
  Wifi,
  Clock,
  Share2,
  CheckCircle2,
  Sparkles,
  Users,
  Dumbbell,
  Utensils,
  Check,
} from 'lucide-react';

interface SpaceDetailModalProps {
  location: CampusLocation | null;
  onClose: () => void;
  onNotify: (loc: CampusLocation) => void;
  onSubmitReport?: (locationId: string, level: 'empty' | 'moderate' | 'full') => void;
}

export const SpaceDetailModal: React.FC<SpaceDetailModalProps> = ({
  location,
  onClose,
  onNotify,
  onSubmitReport,
}) => {
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!location) return null;

  const percentage = Math.round(
    (location.current_occupancy / Math.max(1, location.capacity)) * 100
  );
  const availableSeats = Math.max(0, location.capacity - location.current_occupancy);

  const handleQuickReport = (level: 'empty' | 'moderate' | 'full') => {
    onSubmitReport?.(location.id, level);
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 sm:p-8 no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
            {location.type.replace('_', ' ')}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {location.building} • {location.floor}
          </span>
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 ml-auto mr-8">
            <Navigation className="w-3.5 h-3.5" />
            {location.distance_minutes} min walk
          </span>
        </div>

        {/* Space Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          {location.name}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          {location.description}
        </p>

        {/* Occupancy Status Section */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Crowd Telemetry
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Signal Stream
            </span>
          </div>

          <OccupancyBadge
            currentOccupancy={location.current_occupancy}
            capacity={location.capacity}
            trend={location.trend}
            size="lg"
          />

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
            <div>
              <div className="text-xs text-slate-400">Occupied</div>
              <div className="text-base font-bold text-white">{location.current_occupancy}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Available</div>
              <div className="text-base font-bold text-emerald-400">{availableSeats}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Total Capacity</div>
              <div className="text-base font-bold text-slate-300">{location.capacity}</div>
            </div>
          </div>
        </div>

        {/* P1: Best Time to Go & Peak Hours Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Best Time to Go (Predictive Insight)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <div className="text-slate-200 font-bold text-sm">
                {location.best_time_to_go || 'Around 6:15 PM'}
              </div>
              <div className="text-[11px] text-slate-400">
                Peak hours usually: {location.peak_hours || '1:00 PM – 4:00 PM'}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold self-start sm:self-auto">
              Expected ~40% crowd
            </span>
          </div>
        </div>

        {/* P1: Community Crowd Validation & 1-Tap Quick Report */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Community Crowd Validation
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              🟢 {location.confidence === 'high' ? 'High Confidence' : 'Medium Confidence'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-3">
            Reported by <strong>{location.report_count || 8} students</strong> • Last updated{' '}
            <strong>{location.last_reported_minutes_ago || 2}m ago</strong>. Help fellow students:
          </p>

          {/* 1-Tap Quick Report Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickReport('empty')}
              className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-emerald-950/50 hover:border-emerald-500/50 border border-slate-800 text-[11px] font-bold text-emerald-300 transition-all flex items-center justify-center gap-1"
            >
              <span>🟢 Empty</span>
            </button>
            <button
              onClick={() => handleQuickReport('moderate')}
              className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-amber-950/50 hover:border-amber-500/50 border border-slate-800 text-[11px] font-bold text-amber-300 transition-all flex items-center justify-center gap-1"
            >
              <span>🟡 Moderate</span>
            </button>
            <button
              onClick={() => handleQuickReport('full')}
              className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 hover:border-rose-500/50 border border-slate-800 text-[11px] font-bold text-rose-300 transition-all flex items-center justify-center gap-1"
            >
              <span>🔴 Full</span>
            </button>
          </div>

          {reportSubmitted && (
            <div className="mt-2 text-center text-xs font-bold text-emerald-400 animate-in fade-in flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Thanks! Crowd report updated instantly.</span>
            </div>
          )}
        </div>

        {/* P2: Sports Equipment Inventory (if sports) */}
        {location.equipment_items && location.equipment_items.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Equipment Available to Borrow</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {location.equipment_items.map((eq, i) => (
                <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">{eq.name}</span>
                  <span className="font-bold text-emerald-400">{eq.available} / {eq.total} free</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities Grid */}
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Facilities &amp; Environment
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              {location.is_quiet ? (
                <VolumeX className="w-4 h-4 text-blue-400 shrink-0" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <div className="font-semibold text-slate-200 capitalize">{location.noise_level}</div>
                <div className="text-[10px] text-slate-400">Acoustic Zone</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-200">
                  {location.has_charging ? 'Outlets Available' : 'Limited Outlets'}
                </div>
                <div className="text-[10px] text-slate-400">Desk Power</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <Wifi className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="font-semibold text-slate-200">Gigabit Mesh</div>
                <div className="text-[10px] text-slate-400">&gt; 350 Mbps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onNotify(location);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>Watch This Space</span>
          </button>

          <button
            onClick={() => {
              window.open(`https://maps.google.com/?q=${location.latitude},${location.longitude}`, '_blank');
            }}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Open in Maps"
          >
            <Navigation className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText?.(
                `${location.name} in ${location.building}, ${location.floor}`
              );
              alert('Location info copied to clipboard!');
            }}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Share or Copy Location"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
