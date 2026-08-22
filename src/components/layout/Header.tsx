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
    <header className="sticky top-0 z-30 w-full border-b border-primary-container bg-surface-container-low/95 backdrop-blur-md">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between gap-4">
        {/* Brand & Campus Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container border border-primary text-primary flex items-center justify-center font-sora font-black text-xl shadow-md">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sora font-bold text-lg text-primary tracking-tight">Spotly</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-container-high text-primary border border-primary-container">
                SST LIVE
              </span>
            </div>

            {/* Campus Selector Toggle */}
            <div className="flex items-center gap-1 mt-0.5">
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value as CampusId)}
                aria-label="Select Active Campus"
                className="bg-transparent text-[11px] font-semibold text-tertiary hover:text-tertiary-fixed focus:outline-none cursor-pointer"
              >
                <option value="sst_bangalore" className="bg-surface-container text-on-surface">
                  📍 SST Bangalore (Electronic City)
                </option>
                <option value="sst_20acre_new" className="bg-surface-container text-on-surface">
                  🚀 New 20-Acre Campus (Preview)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Campus Pulse Status */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-surface-container border border-primary-container text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-on-surface-variant">
              {selectedCampus === 'sst_bangalore' ? 'SST Pulse:' : '20-Acre Pulse:'}
            </span>
            <span className="font-semibold text-primary">{campusOccupancyPercentage}% occupied</span>
          </div>
          <span className="text-outline-variant">•</span>
          <span className="text-on-surface-variant font-medium">
            <strong className="text-on-surface">{totalAvailableSeats}</strong> seats available
          </span>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Landing / App Mode Toggle */}
          {onToggleLanding && (
            <button
              onClick={onToggleLanding}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sora font-semibold border transition-all ${
                showLanding
                  ? 'bg-primary-container text-on-primary-container border-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-primary-container'
              }`}
              title="Toggle Overview / Live App"
            >
              {showLanding ? <Compass className="w-3.5 h-3.5 text-primary" /> : <Layout className="w-3.5 h-3.5 text-on-surface-variant" />}
              <span>{showLanding ? 'Live Spaces' : 'Overview'}</span>
            </button>
          )}

          {/* Find My Space Hero Button */}
          <button
            onClick={() => setIsFindModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs sm:text-sm shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find My Space</span>
          </button>

          {/* Active Alerts Button */}
          <button
            onClick={onOpenActiveAlerts}
            className="relative p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-primary-container transition-colors"
            title="My Watches"
            aria-label="My Watches"
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>

          {/* Demo Simulator Toggle */}
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSimulatorOpen
                ? 'bg-tertiary-container text-on-tertiary-container border-tertiary shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-primary-container'
            }`}
            title="Toggle Live Demo Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-tertiary" />
            <span className="hidden sm:inline">Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
