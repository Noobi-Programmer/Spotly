'use client';

import React, { useState } from 'react';
import { CampusLocation } from '@/types';
import { Sliders, X, Sparkles, RefreshCw, Zap, Moon, Sun, Flame, ChevronDown } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

interface SimulatorControlTrayProps {
  isOpen: boolean;
  onClose: () => void;
  locations: CampusLocation[];
  onUpdateOccupancy: (locationId: string, newOccupancy: number) => void;
  onRunPreset: (preset: 'hero_alert' | 'rush_hour' | 'quiet_night' | 'reset') => void;
}

export const SimulatorControlTray: React.FC<SimulatorControlTrayProps> = ({
  isOpen,
  onClose,
  locations,
  onUpdateOccupancy,
  onRunPreset,
}) => {
  const [selectedLocId, setSelectedLocId] = useState<string>(
    locations.find((l) => l.code === 'SR-B')?.id || locations[0]?.id || ''
  );

  if (!isOpen) return null;

  const currentSelectedLoc = locations.find((l) => l.id === selectedLocId) || locations[0];
  if (!currentSelectedLoc) return null;

  const currentPct = Math.round(
    (currentSelectedLoc.current_occupancy / Math.max(1, currentSelectedLoc.capacity)) * 100
  );

  const handleStep = (deltaPct: number) => {
    const deltaCount = Math.round((deltaPct / 100) * currentSelectedLoc.capacity);
    const newCount = Math.max(
      0,
      Math.min(currentSelectedLoc.capacity, currentSelectedLoc.current_occupancy + deltaCount)
    );
    onUpdateOccupancy(currentSelectedLoc.id, newCount);
  };

  const handleSliderChange = (newPct: number) => {
    const newCount = Math.round((newPct / 100) * currentSelectedLoc.capacity);
    onUpdateOccupancy(currentSelectedLoc.id, newCount);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-6 flex justify-center animate-in slide-in-from-bottom duration-300 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-4xl rounded-3xl glass-panel bg-slate-950/95 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/20 p-5 sm:p-6 overflow-hidden">
        {/* Tray Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Live Occupancy Simulator (Admin/Demo)</h4>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isSupabaseConfigured() ? 'Supabase Realtime Synced' : 'Multi-Tab Broadcast Synced'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Simulate crowd changes to test real-time threshold notifications and recommendation reranking.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Column 1: Target Room Selector & Slider (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedLocId}
                  onChange={(e) => setSelectedLocId(e.target.value)}
                  aria-label="Select target campus room for simulation"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.building})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Occupancy: </span>
                <span className="text-sm font-black text-amber-400 font-mono">
                  {currentSelectedLoc.current_occupancy}/{currentSelectedLoc.capacity} ({currentPct}%)
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">0%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={currentPct}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                aria-label="Occupancy simulation slider"
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-xs font-mono text-slate-400">100%</span>
            </div>

            {/* Step adjustment buttons */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleStep(-10)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                -10%
              </button>
              <button
                type="button"
                onClick={() => handleStep(-5)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                -5%
              </button>
              <button
                type="button"
                onClick={() => handleStep(5)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                +5%
              </button>
              <button
                type="button"
                onClick={() => handleStep(10)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-colors"
              >
                +10%
              </button>
            </div>
          </div>

          {/* Column 2: One-Click Demo Presets (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2 pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-0.5">
              1-Click Demo Scenarios
            </div>

            {/* Hero Alert Preset */}
            <button
              type="button"
              onClick={() => onRunPreset('hero_alert')}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 text-amber-200 text-xs font-bold transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                🔥 Trigger Study Room B Alert (&le;46%)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                HERO DEMO
              </span>
            </button>

            {/* Rush Hour & Quiet Night Presets */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onRunPreset('rush_hour')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium border border-slate-700"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                Midday Peak (88%)
              </button>

              <button
                type="button"
                onClick={() => onRunPreset('quiet_night')}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium border border-slate-700"
              >
                <Moon className="w-3 h-3 text-cyan-400" />
                Late Study (22%)
              </button>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={() => onRunPreset('reset')}
              className="flex items-center justify-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 py-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset all to initial values
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
