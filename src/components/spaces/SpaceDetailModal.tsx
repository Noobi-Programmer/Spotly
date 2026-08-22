'use client';

import React from 'react';
import { CampusLocation } from '@/types';
import { OccupancyBadge } from './OccupancyBadge';
import {
  X,
  Navigation,
  Bell,
  Volume2,
  VolumeX,
  Zap,
  Wifi,
  Clock,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface SpaceDetailModalProps {
  location: CampusLocation | null;
  onClose: () => void;
  onNotify: (loc: CampusLocation) => void;
}

export const SpaceDetailModal: React.FC<SpaceDetailModalProps> = ({
  location,
  onClose,
  onNotify,
}) => {
  if (!location) return null;

  const percentage = Math.round((location.current_occupancy / Math.max(1, location.capacity)) * 100);
  const availableSeats = Math.max(0, location.capacity - location.current_occupancy);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 sm:p-8 overflow-hidden">
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

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {location.description}
        </p>

        {/* Occupancy Status Section */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Occupancy Telemetry
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Sensor Feed
            </span>
          </div>

          <OccupancyBadge
            currentOccupancy={location.current_occupancy}
            capacity={location.capacity}
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

        {/* Amenities Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Space Amenities & Environment
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

        {/* Typical Daily Pattern Sparkline */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Typical Daily Occupancy Pattern
            </span>
            <span className="text-[11px] text-slate-400">Peak: 1:00 PM - 4:00 PM</span>
          </div>

          <div className="flex items-end gap-1.5 h-10 pt-2">
            {[20, 35, 60, 85, 92, 88, 70, 45, 25].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-slate-800 to-slate-600 transition-all hover:to-emerald-400"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 px-1">
            <span>8 AM</span>
            <span>12 PM</span>
            <span>4 PM</span>
            <span>8 PM</span>
            <span>11 PM</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onNotify(location);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Bell className="w-4 h-4" />
            <span>Set Availability Alert</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText?.(
                `${location.name} in ${location.building}, ${location.floor}`
              );
              alert('Directions copied to clipboard!');
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
