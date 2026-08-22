'use client';

import React, { useState } from 'react';
import { UserPreferences, CampusLocation, RecommendationResult } from '@/types';
import { rankSpaces } from '@/lib/engine/recommendation';
import {
  X,
  Sparkles,
  VolumeX,
  Volume2,
  Zap,
  Wifi,
  Users,
  Navigation,
  ArrowRight,
  Check,
} from 'lucide-react';

interface FindSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: CampusLocation[];
  onApplyPreferences: (prefs: UserPreferences) => void;
  onSelectRecommendedLocation: (loc: CampusLocation) => void;
}

export const FindSpaceModal: React.FC<FindSpaceModalProps> = ({
  isOpen,
  onClose,
  locations,
  onApplyPreferences,
  onSelectRecommendedLocation,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    quiet: true,
    charging: true,
    wifi: true,
    low_crowd: true,
    max_distance: 5,
    type: 'all',
  });

  if (!isOpen) return null;

  // Run deterministic ranking in real-time
  const ranked = rankSpaces(locations, preferences);
  const topMatch = ranked[0];

  const handleApply = () => {
    onApplyPreferences(preferences);
    onClose();
  };

  const handleGoToTopMatch = () => {
    onApplyPreferences(preferences);
    if (topMatch) {
      onSelectRecommendedLocation(topMatch.location);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Find My Ideal Campus Space
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Tell Spotly what you need right now. We rank available spots in under 2ms.
          </p>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 no-scrollbar">
          {/* Section 1: Study Vibe / Sound Environment */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
              1. Acoustic &amp; Noise Environment
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, quiet: true })}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  preferences.quiet
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    preferences.quiet ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <VolumeX className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Silent / Quiet Study</div>
                  <div className="text-[11px] text-slate-400">Libraries, private booths, study nooks</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreferences({ ...preferences, quiet: false })}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  !preferences.quiet
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    !preferences.quiet ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Collaborative / Lively</div>
                  <div className="text-[11px] text-slate-400">Group pods, cafes, lounge spaces</div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Essential Amenities */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
              2. Power &amp; Connectivity Requirements
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setPreferences({ ...preferences, charging: !preferences.charging })
                }
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  preferences.charging
                    ? 'bg-emerald-500/15 border-emerald-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className={`w-4 h-4 ${preferences.charging ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">Charging Outlets</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    preferences.charging
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700'
                  }`}
                >
                  {preferences.charging && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setPreferences({ ...preferences, wifi: !preferences.wifi })
                }
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  preferences.wifi
                    ? 'bg-cyan-500/15 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wifi className={`w-4 h-4 ${preferences.wifi ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">Fast Wi-Fi</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    preferences.wifi
                      ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                      : 'border-slate-700'
                  }`}
                >
                  {preferences.wifi && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Crowd & Proximity */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5">
              3. Crowd Level &amp; Walking Distance
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setPreferences({ ...preferences, low_crowd: !preferences.low_crowd })
                }
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  preferences.low_crowd
                    ? 'bg-emerald-500/15 border-emerald-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className={`w-4 h-4 ${preferences.low_crowd ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">Prioritize Low Crowd</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    preferences.low_crowd
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700'
                  }`}
                >
                  {preferences.low_crowd && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-300">Max Walk:</span>
                </div>
                <select
                  value={preferences.max_distance || 5}
                  onChange={(e) =>
                    setPreferences({ ...preferences, max_distance: Number(e.target.value) })
                  }
                  aria-label="Maximum Walking Distance"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option value={3}>&lt; 3 mins</option>
                  <option value={5}>&lt; 5 mins</option>
                  <option value={10}>&lt; 10 mins</option>
                  <option value={15}>Any distance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Top Recommendation Preview inside modal */}
          {topMatch && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/40 mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Top Match Preview
                </span>
                <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {topMatch.matchScore}% Match
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{topMatch.location.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {topMatch.location.building} • {topMatch.location.distance_minutes} min walk
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {topMatch.location.capacity - topMatch.location.current_occupancy} seats open
                </span>
              </div>

              {/* Explainability bullets */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {topMatch.reasons.map((r, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    ✓ {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            Apply Filters
          </button>

          <button
            onClick={handleGoToTopMatch}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <span>Take Me There</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
