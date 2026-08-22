'use client';

import React from 'react';
import { CampusId, CampusResourceCategory, SpaceWatch } from '@/types';
import {
  Sparkles,
  Bell,
  Sliders,
  Layout,
  Compass,
  BookOpen,
  UtensilsCrossed,
  Trophy,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  onOpenActiveAlerts: () => void;
  showLanding?: boolean;
  onToggleLanding?: () => void;
  onSelectCategoryNav?: (cat: 'study' | 'food' | 'sports') => void;
  selectedCampus: CampusId;
  onCampusChange: (campus: CampusId) => void;
  selectedCategory: CampusResourceCategory | 'all';
  onCategoryChange: (category: CampusResourceCategory | 'all') => void;
  alerts: SpaceWatch[];
  onOpenFinder: () => void;
  isSimulatorOpen: boolean;
  onToggleSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenActiveAlerts,
  showLanding = false,
  onToggleLanding,
  onSelectCategoryNav,
  selectedCampus,
  onCampusChange,
  selectedCategory,
  onCategoryChange,
  alerts,
  onOpenFinder,
  isSimulatorOpen,
  onToggleSimulator,
}) => {
  const activeAlertCount = alerts.filter((a) => a.is_active).length;

  const handleNavCategory = (cat: 'study' | 'food' | 'sports') => {
    onCategoryChange(cat);
    if (onSelectCategoryNav) {
      onSelectCategoryNav(cat);
    }
    if (showLanding && onToggleLanding) {
      onToggleLanding(); // Automatically enter the live app view with this category filter active!
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-primary-container bg-surface-container-low/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Brand & Campus Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!showLanding && onToggleLanding) onToggleLanding();
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-container border border-primary text-primary flex items-center justify-center font-sora font-black text-lg shadow-md shadow-primary/10">
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
              onChange={(e) => onCampusChange(e.target.value as CampusId)}
              aria-label="Select Active Campus"
              className="bg-transparent text-xs font-semibold text-tertiary hover:text-tertiary-fixed focus:outline-none cursor-pointer"
            >
              <option value="sst_bangalore" className="bg-surface-container text-on-surface">
                📍 SST Bangalore (Main)
              </option>
              <option value="sst_20acre_new" className="bg-surface-container text-on-surface">
                🚀 New 20-Acre Campus
              </option>
            </select>
          </div>
        </div>

        {/* Center Category Filter Links with Distinct Lucide Icons & Active Underline */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-inter">
          <button
            onClick={() => handleNavCategory('study')}
            className={`font-sora text-xs sm:text-sm font-semibold transition-all cursor-pointer py-1 border-b-2 flex items-center gap-2 ${
              !showLanding && selectedCategory === 'study'
                ? 'text-primary border-primary shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface border-transparent'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${!showLanding && selectedCategory === 'study' ? 'text-primary' : 'text-on-surface-variant'}`} />
            <span>Study Spaces</span>
          </button>

          <button
            onClick={() => handleNavCategory('food')}
            className={`font-sora text-xs sm:text-sm font-semibold transition-all cursor-pointer py-1 border-b-2 flex items-center gap-2 ${
              !showLanding && selectedCategory === 'food'
                ? 'text-tertiary border-tertiary shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface border-transparent'
            }`}
          >
            <UtensilsCrossed className={`w-4 h-4 ${!showLanding && selectedCategory === 'food' ? 'text-tertiary' : 'text-on-surface-variant'}`} />
            <span>Food &amp; Queues</span>
          </button>

          <button
            onClick={() => handleNavCategory('sports')}
            className={`font-sora text-xs sm:text-sm font-semibold transition-all cursor-pointer py-1 border-b-2 flex items-center gap-2 ${
              !showLanding && selectedCategory === 'sports'
                ? 'text-secondary border-secondary shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface border-transparent'
            }`}
          >
            <Trophy className={`w-4 h-4 ${!showLanding && selectedCategory === 'sports' ? 'text-secondary' : 'text-on-surface-variant'}`} />
            <span>Sports &amp; Courts</span>
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

          {/* Open App / Find My Space Pill */}
          <button
            onClick={onOpenFinder}
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
            onClick={onToggleSimulator}
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
