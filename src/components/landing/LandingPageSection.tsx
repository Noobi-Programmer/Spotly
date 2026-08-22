'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, Star, VolumeX, Wifi, Zap, Gauge, TrendingUp, BellRing, CheckCircle2, Shield, MapPin, Compass } from 'lucide-react';

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
    <div className="w-full flex flex-col gap-16 md:gap-24 py-6 md:py-12">
      {/* ==========================================
          1. HERO SECTION (1:1 STITCH DESKTOP & MOBILE)
         ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[75vh]">
        {/* Left Column (7 Cols on desktop): Value Prop & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Badge matching Stitch */}
          <div className="inline-flex items-center gap-2 bg-surface-container-high border border-primary-container rounded-full px-4 py-1.5 self-start">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-sora text-xs font-bold text-primary tracking-widest uppercase">
              Campus Availability Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sora text-4xl sm:text-6xl lg:text-[62px] font-bold text-on-surface leading-[1.12] tracking-tight">
            Don&apos;t wait.<br />
            Don&apos;t wander.<br />
            <span className="text-tertiary">Just know.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
            Real-time study space availability right on your phone. Skip the lap around the library and find your spot instantly.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onEnterApp}
              className="bg-tertiary hover:bg-tertiary-fixed text-on-tertiary px-8 py-4 rounded-xl font-sora font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-tertiary/20 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
              <span>Find a Spot Now</span>
            </button>

            <button
              onClick={onEnterApp}
              className="border border-primary-container text-on-surface px-8 py-4 rounded-xl font-inter font-semibold text-base hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            >
              How it works
            </button>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="flex items-center gap-3 pt-2 text-xs text-on-surface-variant font-inter">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>
              SST Campus Pulse: <strong className="text-primary font-sora font-bold">{campusOccupancyPercentage}% occupied</strong>
            </span>
            <span className="text-outline-variant">•</span>
            <span>
              <strong className="text-on-surface font-sora font-bold">{totalAvailableSeats}</strong> seats available right now
            </span>
          </div>
        </div>

        {/* Right Column (5 Cols on desktop): Stitch Live Map Graphic Container */}
        <div className="lg:col-span-5 relative w-full h-[540px] bg-surface-container-high rounded-2xl border border-primary-container p-4 sm:p-6 overflow-hidden flex flex-col gap-4 shadow-2xl">
          {/* Mock Map Header */}
          <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
            <div className="font-sora font-bold text-sm text-primary flex items-center gap-2">
              <span>Live Campus Map</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-mono text-[11px] text-primary">SST BLOCK • 2F</span>
            </div>
          </div>

          {/* Map Canvas with Stitch Layout & Dark Green Blueprint */}
          <div className="flex-1 relative rounded-xl overflow-hidden border border-surface-variant bg-surface p-4 flex flex-col justify-between">
            {/* SVG Background Grid & Architectural Layout */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="stitch-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#31572c" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#stitch-grid)" />
              {/* Floor Plan Boundaries */}
              <rect x="20" y="20" width="140" height="100" rx="10" fill="#151e0a" stroke="#31572c" strokeWidth="1.5" />
              <rect x="180" y="20" width="140" height="100" rx="10" fill="#151e0a" stroke="#31572c" strokeWidth="1.5" />
              <rect x="20" y="140" width="300" height="140" rx="12" fill="#19220e" stroke="#31572c" strokeWidth="1.5" />
            </svg>

            {/* Map Markers matching Stitch Screenshot */}
            <div className="relative z-10 flex flex-col gap-3 pt-1">
              {/* Pin 1: Library */}
              <div className="self-start bg-surface-container-highest/95 border border-primary-container p-2.5 rounded-xl shadow-lg flex flex-col gap-0.5 backdrop-blur-md">
                <div className="font-sora text-xs font-bold text-on-surface">Reading Room &amp; Library</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-bold text-primary font-mono tracking-wider">25% OCCUPIED (30 FREE)</span>
                </div>
              </div>

              {/* Pin 2: Coding Pod B */}
              <div className="self-end bg-surface-container-highest/95 border border-error/40 p-2.5 rounded-xl shadow-lg flex flex-col gap-0.5 backdrop-blur-md">
                <div className="font-sora text-xs font-bold text-on-surface">Coding Pod B</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="text-[10px] font-bold text-error font-mono tracking-wider">83% BUSY (4 FREE)</span>
                </div>
              </div>
            </div>

            {/* Best Match Overlay Card at bottom of map (Matching Stitch Screenshot) */}
            <div className="relative z-20 bg-surface-container-high border-2 border-tertiary rounded-xl p-4 flex flex-col gap-2.5 shadow-2xl">
              <div className="flex justify-between items-center">
                <div className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-sora">
                  <Star className="w-3 h-3 fill-current" />
                  <span>BEST MATCH</span>
                </div>
                <div className="font-sora font-bold text-xs text-tertiary">94% Match</div>
              </div>

              <div>
                <h3 className="font-sora text-base font-bold text-on-surface">Quiet Reading Room &amp; Library</h3>
                <p className="text-[11px] text-on-surface-variant font-inter">Floor 2 • 3 min walk • Silent Zone</p>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-surface-variant text-on-surface-variant px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-inter font-medium">
                  <VolumeX className="w-3 h-3 text-primary" />
                  Quiet
                </span>
                <span className="bg-surface-variant text-on-surface-variant px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-inter font-medium">
                  <Wifi className="w-3 h-3 text-primary" />
                  Wi-Fi
                </span>
                <span className="bg-surface-variant text-on-surface-variant px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 font-inter font-medium">
                  <Zap className="w-3 h-3 text-primary" />
                  Charging
                </span>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full mt-1 bg-tertiary hover:bg-tertiary-fixed text-on-tertiary py-3 rounded-lg font-sora font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Route Me Here →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. "WHY SPOTLY?" 3-CARD GRID (MATCHING STITCH)
         ========================================== */}
      <section className="flex flex-col gap-6 pt-6">
        <h2 className="font-sora text-2xl sm:text-4xl font-bold text-on-surface text-center">
          Why Spotly?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {/* Card 1: Save Time */}
          <div className="bg-surface-container-high rounded-2xl p-6 sm:p-8 border border-primary-container flex flex-col gap-3">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-1 font-bold shadow-md">
              <Gauge className="w-6 h-6 text-on-tertiary-fixed" />
            </div>
            <h3 className="font-sora text-lg font-bold text-on-surface">Save Time</h3>
            <p className="font-inter text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Stop wasting 20 minutes circling floors looking for an empty chair. Get instant guidance before you walk.
            </p>
          </div>

          {/* Card 2: Live Accuracy */}
          <div className="bg-surface-container-high rounded-2xl p-6 sm:p-8 border border-primary-container flex flex-col gap-3">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-1 font-bold shadow-md">
              <TrendingUp className="w-6 h-6 text-on-tertiary-fixed" />
            </div>
            <h3 className="font-sora text-lg font-bold text-on-surface">Live Accuracy</h3>
            <p className="font-inter text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Data updates in real-time using privacy-first campus network sensors and verified student community reports.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. NOTIFY ME BANNER (MATCHING STITCH)
         ========================================== */}
      <section className="max-w-4xl mx-auto w-full bg-surface-container-highest rounded-2xl p-8 sm:p-12 border border-primary-container text-center flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-tertiary-container flex items-center justify-center text-tertiary mb-2">
          <BellRing className="w-7 h-7 text-tertiary" />
        </div>
        <h3 className="font-sora text-2xl sm:text-3xl font-bold text-on-surface">Full capacity?</h3>
        <p className="font-inter text-sm sm:text-base text-on-surface-variant max-w-lg leading-relaxed mb-4">
          Set an alert. We&apos;ll ping your phone the second a quiet study room opens up in the Science &amp; Tech Block.
        </p>
        <button
          onClick={onEnterApp}
          className="w-full sm:w-auto px-10 py-4 bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-base rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          Set Alert in Live App
        </button>
      </section>
    </div>
  );
};
