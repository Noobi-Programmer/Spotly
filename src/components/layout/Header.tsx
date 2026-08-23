'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { CampusId } from '@/types';
import {
  Sparkles,
  Bell,
  SlidersHorizontal,
  LogIn,
  User,
  Compass,
  Home,
  MapPin,
  Flame,
  QrCode,
} from 'lucide-react';

interface HeaderProps {
  onOpenActiveAlerts: () => void;
  activeAlertCount: number;
  onSelectCategoryNav?: (cat: 'all' | 'study' | 'food' | 'sports') => void;
  showLanding?: boolean;
  onToggleLanding?: () => void;
  onOpenLoginModal?: () => void;
  currentUser?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenActiveAlerts,
  activeAlertCount,
  onSelectCategoryNav,
  showLanding = false,
  onToggleLanding,
  onOpenLoginModal,
  currentUser,
}) => {
  const {
    selectedCampus,
    setSelectedCampus,
    setIsFindModalOpen,
    setIsSimulatorOpen,
    tickets = [],
    activeTicket,
    setIsTicketModalOpen,
    activeTab,
    setActiveTab,
  } = useCampusStore();

  const totalNotificationsCount = (activeAlertCount || 0) + (tickets ? tickets.length : 0);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-primary-container bg-surface-container-low/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Brand & Campus Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('cards');
              if (showLanding && onToggleLanding) onToggleLanding();
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-container border border-primary text-primary flex items-center justify-center font-sora font-black text-lg shadow-md shadow-primary/10">
              S
            </div>
            <div>
              <span className="font-sora font-bold text-xl text-primary tracking-tight">Spotly</span>
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
                📍 SST Bangalore (Main)
              </option>
              <option value="sst_20acre_new" className="bg-surface-container text-on-surface">
                🚀 New 20-Acre Campus
              </option>
            </select>
          </div>
        </div>

        {/* 4 Core Pillars Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-inter">
          <button
            onClick={() => {
              setActiveTab('cards');
              if (showLanding && onToggleLanding) onToggleLanding();
            }}
            className={`font-sora text-xs sm:text-sm font-semibold transition-all cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
              !showLanding && activeTab === 'cards'
                ? 'text-primary border-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface border-transparent'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('map');
              if (showLanding && onToggleLanding) onToggleLanding();
            }}
            className={`font-sora text-xs sm:text-sm font-semibold transition-all cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
              !showLanding && activeTab === 'map'
                ? 'text-primary border-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface border-transparent'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explore Map</span>
          </button>

          <button
            onClick={() => setIsFindModalOpen(true)}
            className="font-sora text-xs sm:text-sm font-semibold text-tertiary hover:text-tertiary-fixed transition-all cursor-pointer py-1 border-b-2 border-transparent flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-tertiary" />
            <span>Find My Space</span>
          </button>

          <button
            onClick={onOpenActiveAlerts}
            className="font-sora text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-all cursor-pointer py-1 border-b-2 border-transparent flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4" />
            <span>Passes &amp; Watches</span>
            {totalNotificationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-[10px] font-mono font-bold">
                {totalNotificationsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Active E-Ticket Boarding Pass Pill */}
          {activeTicket && (
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-sora font-bold text-xs shadow-md shadow-primary/20 transition-all animate-pulse active:scale-95 cursor-pointer border border-primary-container"
              title="Show Active Campus Pass"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pass: {activeTicket.seat_number}</span>
              <span className="sm:hidden">Pass</span>
            </button>
          )}

          {/* Find My Space Hero Button */}
          <button
            onClick={() => setIsFindModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs sm:text-sm shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find My Space</span>
          </button>

          {/* Active Alerts & Passes Bell */}
          <button
            onClick={onOpenActiveAlerts}
            className="relative p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-primary-container transition-colors cursor-pointer"
            title="My Passes & Watches"
            aria-label="My Passes & Watches"
          >
            <Bell className="w-4 h-4" />
            {totalNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center animate-pulse">
                {totalNotificationsCount}
              </span>
            )}
          </button>

          {/* User Sign In / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-surface-container border border-primary-container text-xs font-inter text-primary font-semibold">
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.split('@')[0]}</span>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-sora font-semibold border border-primary-container transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Stealth Demo Simulator Button (Backstage Hackathon Magic) */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="p-2 rounded-xl bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-tertiary border border-primary-container/40 transition-colors cursor-pointer"
            title="Demo Simulator (Backstage Trigger)"
            aria-label="Demo Simulator"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
