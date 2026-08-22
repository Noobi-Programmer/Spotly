'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { CampusId } from '@/types';
import { Sparkles, Bell, Sliders, Layout, Compass, Search } from 'lucide-react';

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
    setSelectedCategory,
  } = useCampusStore();

  const activeAlertCount = alerts.filter((a) => a.is_active).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-primary-container bg-surface-container-low/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Brand & Campus Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLanding}
            className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-container border border-primary text-primary flex items-center justify-center font-sora font-black text-lg shadow-md">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sora font-bold text-xl text-primary tracking-tight">Spotly</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-primary border border-primary-container font-mono">
                  SST LIVE
                </span>
              </div>
            </div>
          </button>

          {/* Campus Selector Toggle */}
          <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-surface-variant">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value as CampusId)}
              aria-label="Select Active Campus"
              className="bg-transparent text-xs font-semibold text-tertiary hover:text-tertiary-fixed focus:outline-none cursor-pointer"
            >
              <option value="sst_bangalore" className="bg-surface-container text-on-surface">
                📍 SST Bangalore
              </option>
              <option value="sst_20acre_new" className="bg-surface-container text-on-surface">
                🚀 New 20-Acre Campus
              </option>
            </select>
          </div>
        </div>

        {/* Center Links (Matching Stitch Desktop Nav) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-inter">
          <button
            onClick={() => {
              if (showLanding && onToggleLanding) onToggleLanding();
              setSelectedCategory('study');
            }}
            className="text-on-surface hover:text-tertiary transition-colors cursor-pointer"
          >
            Study Spaces
          </button>
          <button
            onClick={() => {
              if (showLanding && onToggleLanding) onToggleLanding();
              setSelectedCategory('food');
            }}
            className="text-on-surface hover:text-tertiary transition-colors cursor-pointer"
          >
            Food &amp; Queues
          </button>
          <button
            onClick={() => {
              if (showLanding && onToggleLanding) onToggleLanding();
              setSelectedCategory('sports');
            }}
            className="text-on-surface hover:text-tertiary transition-colors cursor-pointer"
          >
            Sports &amp; Courts
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Landing / App Mode Toggle */}
          {onToggleLanding && (
            <button
              onClick={onToggleLanding}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sora font-semibold border transition-all cursor-pointer ${
                !showLanding
                  ? 'bg-primary-container text-on-primary-container border-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-primary-container'
              }`}
            >
              {!showLanding ? <Compass className="w-3.5 h-3.5 text-primary" /> : <Layout className="w-3.5 h-3.5 text-tertiary" />}
              <span>{!showLanding ? 'Overview' : 'Live Spaces'}</span>
            </button>
          )}

          {/* Open App / Find My Space Pill (Matching Stitch Hero Button) */}
          <button
            onClick={() => setIsFindModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs sm:text-sm shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Find My Space</span>
            <span className="sm:hidden">Find</span>
          </button>

          {/* Active Alerts Button */}
          <button
            onClick={onOpenActiveAlerts}
            className="relative p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-primary-container transition-colors cursor-pointer"
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
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isSimulatorOpen
                ? 'bg-tertiary-container text-on-tertiary-container border-tertiary shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-primary-container'
            }`}
            title="Toggle Live Demo Simulator"
          >
            <Sliders className="w-3.5 h-3.5 text-tertiary" />
            <span className="hidden xl:inline">Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
