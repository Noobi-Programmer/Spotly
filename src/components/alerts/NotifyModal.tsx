'use client';

import React, { useState } from 'react';
import { CampusLocation } from '@/types';
import { X, Bell, Zap, ShieldCheck, Check } from 'lucide-react';
import { OccupancyBadge } from '../spaces/OccupancyBadge';

interface NotifyModalProps {
  location: CampusLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateAlert: (locationId: string, threshold: number) => void;
}

export const NotifyModal: React.FC<NotifyModalProps> = ({
  location,
  isOpen,
  onClose,
  onCreateAlert,
}) => {
  const [threshold, setThreshold] = useState<number>(50);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !location) return null;

  const currentPercentage = Math.round(
    (location.current_occupancy / Math.max(1, location.capacity)) * 100
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAlert(location.id, threshold);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Set Availability Alert
            </h3>
            <p className="text-xs text-slate-400">
              Get notified the instant this space frees up.
            </p>
          </div>
        </div>

        {/* Target Space Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-200">{location.name}</h4>
            <span className="text-xs text-slate-400">{location.building}</span>
          </div>
          <OccupancyBadge
            currentOccupancy={location.current_occupancy}
            capacity={location.capacity}
          />
        </div>

        {/* Alert Threshold Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Notify me when occupancy falls below:
              </label>
              <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30 font-mono">
                {threshold}%
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={15}
              max={80}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              aria-label="Occupancy Threshold Percentage"
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            {/* Preset chips */}
            <div className="flex items-center justify-between gap-2 mt-3">
              {[30, 45, 50, 60].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setThreshold(val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    threshold === val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  &le; {val}%
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Real-time monitoring is active. You will receive an instant audio chime and screen alert
              when occupancy drops to <strong>{threshold}%</strong> or below.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={savedSuccess}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
                savedSuccess
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Alert Activated!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Save Notification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
