'use client';

import React from 'react';
import {
  Search,
  Star,
  VolumeX,
  Wifi,
  Zap,
  TrendingUp,
  BellRing,
  Clock,
  Sparkles,
  Utensils,
  Users,
  Cpu,
} from 'lucide-react';

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
    <div className="w-full flex flex-col gap-20 md:gap-28 py-6 md:py-10">
      {/* ==========================================
          1. HERO SECTION (1:1 STITCH DESKTOP & MOBILE)
         ========================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center min-h-[72vh]">
        {/* Left Column (7 Cols): Value Prop & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Badge matching Stitch */}
          <div className="inline-flex items-center gap-2 bg-surface-container-high border border-primary-container rounded-full px-4 py-1.5 self-start">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-sora text-xs font-bold text-primary tracking-widest uppercase">
              Campus Availability Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sora text-4xl sm:text-6xl lg:text-[58px] font-bold text-on-surface leading-[1.12] tracking-tight">
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
              Explore Live Spaces
            </button>
          </div>

          {/* Live Campus Telemetry Pill */}
          <div className="flex items-center gap-3 pt-2 text-xs text-on-surface-variant font-inter">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            <span>
              SST Campus Pulse: <strong className="text-primary font-sora font-bold">{campusOccupancyPercentage}% occupied</strong>
            </span>
            <span className="text-outline-variant">•</span>
            <span>
              <strong className="text-on-surface font-sora font-bold">{totalAvailableSeats}</strong> free seats right now
            </span>
          </div>
        </div>

        {/* Right Column (5 Cols): Stitch Live Map Graphic Container */}
        <div className="lg:col-span-5 relative w-full h-[520px] bg-surface-container-high rounded-2xl border border-primary-container p-4 sm:p-6 overflow-hidden flex flex-col gap-4 shadow-2xl">
          {/* Mock Map Header */}
          <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
            <div className="font-sora font-bold text-sm text-primary flex items-center gap-2">
              <span>Live Campus Radar (Floor 2)</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-mono text-[11px] text-primary">SST ELECTRONIC CITY</span>
            </div>
          </div>

          {/* Map Canvas with Stitch Layout & Dark Green Blueprint */}
          <div className="flex-1 relative rounded-xl overflow-hidden border border-surface-variant bg-surface p-4 flex flex-col justify-between">
            {/* SVG Background Grid & Architectural Layout */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="stitch-grid-hero" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#31572c" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#stitch-grid-hero)" />
              {/* Floor Plan Boundaries */}
              <rect x="20" y="20" width="140" height="90" rx="10" fill="#151e0a" stroke="#31572c" strokeWidth="1.5" />
              <rect x="180" y="20" width="140" height="90" rx="10" fill="#151e0a" stroke="#31572c" strokeWidth="1.5" />
              <rect x="20" y="130" width="300" height="120" rx="12" fill="#19220e" stroke="#31572c" strokeWidth="1.5" />
            </svg>

            {/* Map Markers */}
            <div className="relative z-10 flex flex-col gap-3 pt-1">
              <div className="self-start bg-surface-container-highest/95 border border-primary-container p-2.5 rounded-xl shadow-lg flex flex-col gap-0.5 backdrop-blur-md">
                <div className="font-sora text-xs font-bold text-on-surface">Quiet Reading Room</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-bold text-primary font-mono tracking-wider">25% OCCUPIED (30 FREE)</span>
                </div>
              </div>

              <div className="self-end bg-surface-container-highest/95 border border-error/40 p-2.5 rounded-xl shadow-lg flex flex-col gap-0.5 backdrop-blur-md">
                <div className="font-sora text-xs font-bold text-on-surface">Coding Pod B</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="text-[10px] font-bold text-error font-mono tracking-wider">83% BUSY (4 FREE)</span>
                </div>
              </div>
            </div>

            {/* Best Match Overlay Card at bottom of map */}
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
                  Gigabit Wi-Fi
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
          2. HOW SPOTLY WORKS (3-STEP ARCHITECTURE)
         ========================================== */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary tracking-widest uppercase mb-2 font-sora">
            <Cpu className="w-4 h-4" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="font-sora text-3xl sm:text-4xl font-bold text-on-surface">
            From Sensor Telemetry to Instant Decision
          </h2>
          <p className="font-inter text-sm sm:text-base text-on-surface-variant mt-2">
            Spotly replaces guessing and wandering with a 3-stage privacy-first intelligence pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-surface-container-high rounded-2xl p-6 sm:p-8 border border-primary-container flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container text-tertiary flex items-center justify-center font-sora font-bold">
                01
              </div>
              <span className="text-[11px] text-primary font-mono font-semibold">TELEMETRY</span>
            </div>
            <h3 className="font-sora text-lg font-bold text-on-surface">Zero-PII Density Sensing</h3>
            <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
              We monitor aggregate network load and student check-ins without storing personal identities, tracking MAC addresses, or sniffing devices.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-surface-container-high rounded-2xl p-6 sm:p-8 border border-primary-container flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container text-tertiary flex items-center justify-center font-sora font-bold">
                02
              </div>
              <span className="text-[11px] text-tertiary font-mono font-semibold">&lt;2ms ENGINE</span>
            </div>
            <h3 className="font-sora text-lg font-bold text-on-surface">Deterministic Space Matching</h3>
            <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
              Our multi-factor scoring evaluates acoustic comfort, charging port availability, walking minutes, and crowd trends with 100% explainability.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-surface-container-high rounded-2xl p-6 sm:p-8 border border-primary-container flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container text-tertiary flex items-center justify-center font-sora font-bold">
                03
              </div>
              <span className="text-[11px] text-primary font-mono font-semibold">REAL-TIME</span>
            </div>
            <h3 className="font-sora text-lg font-bold text-on-surface">Instant Threshold Alerts</h3>
            <p className="font-inter text-sm text-on-surface-variant leading-relaxed">
              When high-demand spots like Coding Pod B are full, set a watch target. Spotly chimes and notifies you the second occupancy clears.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. CORE CAPABILITIES (THE 6 PILLARS)
         ========================================== */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-sora text-3xl sm:text-4xl font-bold text-on-surface">
            Everything You Need to Claim Your Space
          </h2>
          <p className="font-inter text-sm sm:text-base text-on-surface-variant mt-2">
            Built specifically for high-intensity engineering campuses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-primary-container/70 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-sora text-base font-bold text-on-surface">Smart Match Hero</h4>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Select your immediate vibe: silent focus, collaborative coding, power outlets, or proximity. Instant sub-2ms ranking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-primary-container/70 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-tertiary flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <h4 className="font-sora text-base font-bold text-on-surface">Watch This Space</h4>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Never refresh manually. Set discrete alerts (&le;70%, &le;50%, &le;30%) and get harmonic Web Audio notifications.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-primary-container/70 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-sora text-base font-bold text-on-surface">Dynamic Crowd Trends</h4>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Live trend indicators (↗ Getting busier, ↘ Clearing up, → Steady) prevent you from walking toward a space that is filling fast.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-primary-container/70 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-tertiary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-sora text-base font-bold text-on-surface">Best Time to Go</h4>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Predictive time-series recommendations highlighting exact calm hours so you can schedule your deep-work sprint.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-primary-container/70 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-sora text-base font-bold text-on-surface">1-Tap Crowd Validation</h4>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Students confirm room density on-the-spot with single-tap reports, creating high-confidence verified campus data.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-surface-container-high rounded-2xl p-6 border border-primary-container/70 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-tertiary flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="font-sora text-base font-bold text-on-surface">Food &amp; Sports Queues</h4>
            <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Beyond study: check Chef Talk meal queues (~4 min wait vs 18 min at Craving Brew) and rooftop turf sports equipment.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. "FULL CAPACITY? SET ALERT" BANNER (STITCH)
         ========================================== */}
      <section className="bg-surface-container-highest rounded-3xl p-8 sm:p-14 border border-primary-container text-center flex flex-col items-center gap-5 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-tertiary-container text-tertiary flex items-center justify-center shadow-lg">
          <BellRing className="w-8 h-8" />
        </div>
        <h3 className="font-sora text-3xl sm:text-4xl font-bold text-on-surface">
          Full capacity?
        </h3>
        <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
          Set an alert. We&apos;ll ping your phone the second a quiet study room opens up in the Science &amp; Tech Block.
        </p>
        <button
          onClick={onEnterApp}
          className="px-10 py-4 bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-base rounded-xl shadow-xl shadow-tertiary/20 transition-all active:scale-95 cursor-pointer mt-2"
        >
          Open Spotly &amp; Set Watch
        </button>
      </section>
    </div>
  );
};
