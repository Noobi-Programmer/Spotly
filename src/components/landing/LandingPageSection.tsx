'use client';

import React from 'react';
import { ArrowRight, Search, Filter, Star, Zap, VolumeX, Wifi, BellRing, Gauge, TrendingUp } from 'lucide-react';

interface LandingPageSectionProps {
  onEnterApp: () => void;
  campusOccupancyPercentage: number;
  totalAvailableSeats: number;
}

export const LandingPageSection: React.FC<LandingPageSectionProps> = ({
  onEnterApp,
  campusOccupancyPercentage,
  totalAvailableSeats,
}) => {
  return (
    <div className="w-full flex flex-col gap-xxl py-lg">
      {/* ==========================================
          1. HERO SECTION (1:1 STITCH DESKTOP & MOBILE)
         ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl lg:gap-xxl items-center min-h-[75vh]">
        {/* Left Column: Value Prop & CTAs */}
        <div className="flex flex-col gap-lg text-left">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-sm bg-surface-container-high border border-primary-container rounded-full px-md py-xs self-start">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase font-bold">
              Real-Time Campus Availability
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sora text-3xl sm:text-5xl lg:text-[54px] font-bold text-on-surface leading-[1.15] tracking-tight">
            Don&apos;t wait.<br />
            Don&apos;t wander.<br />
            <span className="text-tertiary">Just know.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-lg leading-relaxed">
            Stop pacing the library. Spotly shows you exactly where the open seats, quiet rooms, and charging ports are across campus, right now.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-md mt-sm">
            <button
              onClick={onEnterApp}
              className="bg-tertiary hover:bg-tertiary-fixed text-on-tertiary px-xl py-md rounded-lg font-sora font-semibold text-sm sm:text-base flex items-center gap-sm shadow-lg shadow-tertiary/20 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Find My Space</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onEnterApp}
              className="border border-primary-container text-on-surface px-xl py-md rounded-lg font-inter font-semibold text-sm sm:text-base hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Explore Live Map
            </button>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="flex items-center gap-3 pt-2 text-xs text-on-surface-variant">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>
              SST Campus Pulse: <strong className="text-primary font-sora">{campusOccupancyPercentage}% occupied</strong>
            </span>
            <span className="text-outline-variant">•</span>
            <span>
              <strong className="text-on-surface font-sora">{totalAvailableSeats}</strong> free seats right now
            </span>
          </div>
        </div>

        {/* Right Column: Stitch Live Map Graphic Container */}
        <div className="relative w-full h-[520px] bg-surface-container-high rounded-2xl border border-primary-container p-md sm:p-lg overflow-hidden flex flex-col gap-md shadow-2xl">
          {/* Mock Map Header */}
          <div className="flex justify-between items-center pb-sm border-b border-surface-variant">
            <div className="font-sora font-bold text-sm sm:text-base text-primary flex items-center gap-2">
              <span>Live Campus Radar (Floor 2)</span>
              <span className="text-[10px] bg-primary-container/40 text-primary border border-primary-container px-2 py-0.5 rounded-full font-mono">
                SST ELECTRONIC CITY
              </span>
            </div>
            <div className="flex gap-sm text-on-surface-variant">
              <Search className="w-4 h-4 cursor-pointer hover:text-on-surface" />
              <Filter className="w-4 h-4 cursor-pointer hover:text-on-surface" />
            </div>
          </div>

          {/* Map Area with stylized architectural floor elements */}
          <div className="flex-1 relative rounded-xl overflow-hidden border border-surface-variant bg-surface p-4">
            {/* SVG Grid Lines & Rooms */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#31572c" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Architectural Rooms */}
              <rect x="40" y="30" width="130" height="90" rx="8" fill="#151e0a" stroke="#31572c" strokeWidth="1.5" />
              <rect x="220" y="30" width="140" height="90" rx="8" fill="#151e0a" stroke="#31572c" strokeWidth="1.5" />
              <rect x="40" y="160" width="320" height="130" rx="12" fill="#19220e" stroke="#31572c" strokeWidth="1.5" />
            </svg>

            {/* Map Markers matching Stitch Mockup */}
            {/* Pin 1: Library */}
            <div className="absolute top-[18%] left-[10%] bg-surface-container-highest border border-primary-container p-2.5 rounded-xl shadow-lg flex flex-col gap-1 backdrop-blur-md bg-opacity-95 z-10">
              <div className="font-sora text-xs font-bold text-on-surface">Quiet Reading Room</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[11px] font-bold text-primary font-mono">25% OCCUPIED (30 FREE)</span>
              </div>
            </div>

            {/* Pin 2: Coding Pod B */}
            <div className="absolute top-[18%] right-[10%] bg-surface-container-highest border border-error/50 p-2.5 rounded-xl shadow-lg flex flex-col gap-1 backdrop-blur-md bg-opacity-95 z-10">
              <div className="font-sora text-xs font-bold text-on-surface">Coding Pod B</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="text-[11px] font-bold text-error font-mono">83% BUSY (4 FREE)</span>
              </div>
            </div>

            {/* Best Match Overlay Card matching Stitch mockup */}
            <div className="absolute bottom-3 left-3 right-3 bg-surface-container-high border-2 border-tertiary rounded-xl p-3.5 sm:p-4 flex flex-col gap-2.5 shadow-2xl z-20">
              <div className="flex justify-between items-center">
                <div className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-sora">
                  <Star className="w-3 h-3 fill-current" />
                  <span>BEST MATCH</span>
                </div>
                <div className="font-sora font-bold text-xs text-tertiary">94% Match</div>
              </div>

              <div>
                <h3 className="font-sora text-base font-bold text-on-surface">Quiet Reading Room &amp; Library</h3>
                <p className="text-[11px] text-on-surface-variant font-inter">Science &amp; Tech Block • Floor 2 • 3 min walk</p>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-inter">
                  <VolumeX className="w-3 h-3 text-primary" />
                  Quiet
                </span>
                <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-inter">
                  <Wifi className="w-3 h-3 text-primary" />
                  Gigabit Wi-Fi
                </span>
                <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-inter">
                  <Zap className="w-3 h-3 text-primary" />
                  Charging
                </span>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full mt-1 bg-tertiary hover:bg-tertiary-fixed text-on-tertiary py-2.5 rounded-lg font-sora font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                Route Me Here →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. "WHY SPOTLY?" 3-CARD GRID (STITCH THEME)
         ========================================== */}
      <section className="flex flex-col gap-md pt-4">
        <h2 className="font-sora text-2xl sm:text-3xl font-bold text-on-surface text-center mb-2">
          Why Spotly?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Card 1: Save Time */}
          <div className="bg-surface-container-high rounded-xl p-lg border border-primary-container flex flex-col gap-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-1 font-bold">
              <Gauge className="w-5 h-5 text-on-tertiary-fixed" />
            </div>
            <h3 className="font-sora text-base font-bold text-on-surface">Save Time</h3>
            <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
              Stop wasting 20 minutes circling floors looking for an empty chair. Get instant guidance before you walk.
            </p>
          </div>

          {/* Card 2: Live Accuracy */}
          <div className="bg-surface-container-high rounded-xl p-lg border border-primary-container flex flex-col gap-sm">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-1 font-bold">
              <TrendingUp className="w-5 h-5 text-on-tertiary-fixed" />
            </div>
            <h3 className="font-sora text-base font-bold text-on-surface">Live Accuracy</h3>
            <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
              Data updates in real-time using privacy-first campus network sensors and student community reports.
            </p>
          </div>

          {/* Card 3: Full Capacity Alerts */}
          <div className="bg-surface-container-high rounded-xl p-lg border border-primary-container flex flex-col justify-between gap-sm">
            <div>
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-1 font-bold">
                <BellRing className="w-5 h-5 text-on-tertiary-fixed" />
              </div>
              <h3 className="font-sora text-base font-bold text-on-surface">Full Capacity Alerts</h3>
              <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
                Set a target threshold. We&apos;ll ping your phone the second a quiet study room frees up.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
