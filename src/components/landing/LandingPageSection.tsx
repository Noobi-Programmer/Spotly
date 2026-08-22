'use client';

import React from 'react';
import { Sparkles, MapPin, Eye, Zap, Shield, ArrowRight, CheckCircle2, Users, Compass } from 'lucide-react';

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
    <div className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Scaler School of Technology • Hackathon 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Don&apos;t wait. <br className="hidden sm:block" />
          Don&apos;t wander.{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Just know.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
          Google Maps tells you where a room is. <strong>Spotly</strong> answers:{' '}
          <em className="text-white not-italic font-semibold">&ldquo;Is it worth going there right now?&rdquo;</em> Combining real-time crowd telemetry, noise levels, and power outlet availability.
        </p>

        {/* Hero CTA & Live Stats Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Compass className="w-5 h-5" />
            <span>Launch Live Campus App</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">
              Campus Pulse: <strong className="text-emerald-400">{campusOccupancyPercentage}% full</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              <strong className="text-white">{totalAvailableSeats}</strong> open seats right now
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
        <div className="p-6 rounded-3xl glass-card border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Find My Ideal Space</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tell Spotly what you need (Silent study, power outlets, gigabit Wi-Fi, low crowd) and get ranked recommendations in under 2ms.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Deterministic explainable scoring</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Watch This Space</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When Coding Pod B or the Library is full, set a target threshold. Spotly pings you the instant occupancy drops below your target.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dual-guarantee real-time alerts</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Zero-PII Privacy Guaranteed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No individual student tracking, no packet sniffing, no device surveillance. Aggregate space metrics only.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Privacy-preserving by design</span>
          </div>
        </div>
      </div>
    </div>
  );
};
