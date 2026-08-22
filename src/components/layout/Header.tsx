'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { CampusId } from '@/types';
import { Sparkles, Bell, Sliders, Layout, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenActiveAlerts: () => void;
  showLanding?: boolean;
  onToggleLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenActiveAlerts,
  showLanding = false,
  onToggleLanding,
}) => {
  const {
    campusOccupancyPercentage,
    totalAvailableSeats,
    selectedCampus,
    setSelectedCampus,
    alerts,
    setIsFindModalOpen,
    isSimulatorOpen,
    setIsSimulatorOpen,
  } = useCampusStore();

  const activeAlertCount = alerts.filter((a) => a.is_active).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Campus Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">Spotly</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SST LIVE
              </span>
            </div>

            {/* Campus Selector Toggle */}
            <div className="flex items-center gap-1 mt-0.5">
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value as CampusId)}
                aria-label="Select Active Campus"
                className="bg-transparent text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 focus:outline-none cursor-pointer"
              >
                <option value="sst_bangalore" className="bg-slate-900 text-slate-200">
                  📍 SST Bangalore (Electronic City)
                </option>
                <option value="sst_20acre_new" className="bg-slate-900 text-slate-200">
                  🚀 New 20-Acre Campus (Preview)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Campus Pulse Status */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">
              {selectedCampus === 'sst_bangalore' ? 'SST Pulse:' : '20-Acre Pulse:'}
            </span>
            <span className="font-semibold text-emerald-400">{campusOccupancyPercentage}% occupied</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-medium">
            <strong className="text-slate-200">{totalAvailableSeats}</strong> seats available
          </span>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Landing / App Mode Toggle */}
          {onToggleLanding && (
            <button
              onClick={onToggleLanding}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showLanding
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
              title="Toggle Overview / Live App"
            >
              {showLanding ? <Compass className="w-3.5 h-3.5 text-emerald-400" /> : <Layout className="w-3.5 h-3.5 text-slate-400" />}
              <span>{showLanding ? 'Live Spaces' : 'Overview'}</span>
            </button>
          )}

          {/* Find My Space Hero Button */}
          <button
            onClick={() => setIsFindModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find My Space</span>
          </button>

          {/* Active Alerts Button */}
          <button
            onClick={onOpenActiveAlerts}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="My Watches"
            aria-label="My Watches"
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* Demo Simulator Toggle */}
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSimulatorOpen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
            title="Toggle Live Demo Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Demo Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
