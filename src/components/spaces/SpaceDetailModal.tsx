'use client';

import React, { useState } from 'react';
import { CampusLocation } from '@/types';
import { HourlyTrafficChart } from './HourlyTrafficChart';
import {
  X,
  Navigation,
  Eye,
  Volume2,
  VolumeX,
  Zap,
  Wifi,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  Dumbbell,
  Armchair,
  Salad,
  Flame,
  Leaf,
  Trophy,
  ArrowRight,
  TrendingUp,
  Snowflake,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface SpaceDetailModalProps {
  location: CampusLocation | null;
  onClose: () => void;
  onNotify: (loc: CampusLocation) => void;
  onBookSeat?: (loc: CampusLocation) => void;
  onSubmitReport?: (locationId: string, level: 'empty' | 'moderate' | 'full') => void;
}

export const SpaceDetailModal: React.FC<SpaceDetailModalProps> = ({
  location,
  onClose,
  onNotify,
  onBookSeat,
  onSubmitReport,
}) => {
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!location) return null;

  const isSports = location.category === 'sports';
  const percentage = Math.round(
    (location.current_occupancy / Math.max(1, location.capacity)) * 100
  );
  const availableSeats = Math.max(0, location.capacity - location.current_occupancy);

  // Density Bar calculation: 10 segments (e.g. 3 filled, 7 empty)
  const filledBlocks = Math.round((percentage / 100) * 10);
  const crowdLabel =
    percentage >= 75
      ? 'Crowded (High density)'
      : percentage >= 40
      ? 'Moderate crowd'
      : 'Low crowd (Plenty free)';

  const handleQuickReport = (level: 'empty' | 'moderate' | 'full') => {
    onSubmitReport?.(location.id, level);
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Mobile Bottom Sheet & Desktop Floating Modal */}
      <div className="relative w-full max-w-xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-t-[32px] sm:rounded-3xl bg-surface-container-high border-t-2 sm:border-2 border-primary-container shadow-2xl p-6 sm:p-8 no-scrollbar animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0">
        {/* Mobile Pull Indicator */}
        <div className="sm:hidden w-12 h-1.5 rounded-full bg-outline-variant/60 mx-auto -mt-2 mb-4" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-primary-container/40 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5 pr-8">
          <span className="font-sora text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-surface-container text-primary border border-primary-container">
            {location.type.replace('_', ' ')}
          </span>
          <span className="text-xs font-semibold text-on-surface-variant font-inter">
            {location.building} • {location.floor}
          </span>
          <span className="text-xs font-bold text-primary flex items-center gap-1 ml-auto font-inter">
            <Navigation className="w-3.5 h-3.5" />
            {location.distance_minutes} min walk
          </span>
        </div>

        {/* Space Title */}
        <h2 className="font-sora text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mb-2">
          {location.name}
        </h2>

        {/* Description */}
        <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-5">
          {location.description}
        </p>

        {/* 🌟 Visual Density & Live Occupancy Meter */}
        <div className="p-4 rounded-2xl bg-surface-container border border-primary-container mb-5 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sora">
              Live Crowd Density
            </span>
            <span className="font-mono text-sm font-bold text-on-surface">
              {location.current_occupancy} / {location.capacity} seats ({percentage}%)
            </span>
          </div>

          {/* Visual 10-Segment Density Bar */}
          <div className="flex items-center gap-1.5 h-3 w-full my-2">
            {Array.from({ length: 10 }).map((_, i) => {
              const isFilled = i < filledBlocks;
              const barColor =
                percentage >= 75
                  ? 'bg-error'
                  : percentage >= 40
                  ? 'bg-tertiary'
                  : 'bg-primary';

              return (
                <div
                  key={i}
                  className={`flex-1 h-full rounded-full transition-all duration-300 ${
                    isFilled ? `${barColor} shadow-sm` : 'bg-surface-variant/40'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-inter mt-1.5">
            <span
              className={`font-semibold font-sora ${
                percentage >= 75
                  ? 'text-error'
                  : percentage >= 40
                  ? 'text-tertiary'
                  : 'text-primary'
              }`}
            >
              ● {crowdLabel}
            </span>
            <span className="text-on-surface-variant">
              {availableSeats} seats available right now
            </span>
          </div>
        </div>

        {/* ⚡ Tiny Prediction Insight (Decision Engine) */}
        <div className="p-3.5 rounded-2xl bg-primary-container/20 border border-primary-container/70 mb-5 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sora text-xs font-bold text-primary uppercase tracking-wider">
                Spotly Decision Insight
              </span>
              <span className="text-[10px] bg-primary text-on-primary font-bold px-1.5 py-0.2 rounded font-mono">
                BEST TIME: NOW
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-inter mt-1 leading-snug">
              {location.category === 'food'
                ? 'Queue is currently short. Rush expected to surge by +40% in ~45 mins.'
                : location.category === 'sports'
                ? 'Prime weather conditions. Court lights on until 10:00 PM.'
                : 'Crowd remains low for the next 90 mins. Golden hour for uninterrupted focus.'}
            </p>
          </div>
        </div>

        {/* Mess Provider Callout (if food) */}
        {location.mess_provider && (
          <div className="p-4 rounded-2xl bg-surface-container border border-primary-container mb-5 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-sm">
                🍱
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-sora block">
                  {location.mess_provider === 'Cheftalk' ? 'PRIMARY MESS PROVIDER' : 'OFFICIAL ALTERNATE MESS PROVIDER'}
                </span>
                <h4 className="font-sora text-sm font-bold text-on-surface">
                  {location.mess_provider}
                </h4>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-primary-container text-primary font-mono text-xs font-bold border border-primary flex items-center gap-1">
              {location.meal_type === 'Veg' && <Salad className="w-3.5 h-3.5" />}
              {location.meal_type === 'Non-Veg' && <Flame className="w-3.5 h-3.5" />}
              {location.meal_type === 'Jain' && <Leaf className="w-3.5 h-3.5" />}
              <span>{location.meal_type}</span>
            </span>
          </div>
        )}

        {/* Hourly Traffic Chart */}
        <div className="mb-5">
          <HourlyTrafficChart location={location} />
        </div>

        {/* Key Amenities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center gap-2">
            {location.is_quiet ? <VolumeX className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4 text-tertiary" />}
            <div>
              <div className="text-[10px] text-on-surface-variant font-inter">Acoustics</div>
              <div className="text-xs font-bold text-on-surface font-sora capitalize">{location.noise_level}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center gap-2">
            <Zap className={`w-4 h-4 ${location.has_charging ? 'text-primary' : 'text-outline'}`} />
            <div>
              <div className="text-[10px] text-on-surface-variant font-inter">Power Plugs</div>
              <div className="text-xs font-bold text-on-surface font-sora">
                {location.has_charging ? 'Plenty Plugs' : 'Limited'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-on-surface-variant font-inter">Wi-Fi</div>
              <div className="text-xs font-bold text-on-surface font-sora">
                {location.has_fast_wifi ? 'Gigabit 5G' : 'Standard'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-on-surface-variant font-inter">Climate</div>
              <div className="text-xs font-bold text-on-surface font-sora">AC Cooling</div>
            </div>
          </div>
        </div>

        {/* Community 1-Tap Check-in */}
        <div className="p-3.5 rounded-2xl bg-surface-container border border-primary-container/70 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sora flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              Community Crowd Check-in
            </span>
            <span className="text-[11px] text-primary font-medium font-inter">
              {location.report_count || 8} verified reports
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickReport('empty')}
              className="py-2 px-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-sora font-semibold text-primary border border-primary-container transition-all cursor-pointer"
            >
              🟢 Plenty Free
            </button>
            <button
              onClick={() => handleQuickReport('moderate')}
              className="py-2 px-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-sora font-semibold text-tertiary border border-primary-container transition-all cursor-pointer"
            >
              🟡 Moderate
            </button>
            <button
              onClick={() => handleQuickReport('full')}
              className="py-2 px-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-xs font-sora font-semibold text-error border border-primary-container transition-all cursor-pointer"
            >
              🔴 Packed Full
            </button>
          </div>

          {reportSubmitted && (
            <div className="mt-2 text-center text-xs text-primary font-bold flex items-center justify-center gap-1 font-inter">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Crowd report updated live!</span>
            </div>
          )}
        </div>

        {/* Sticky Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-surface-variant">
          {/* Main Action: Pick & Book Seat / Court */}
          <button
            onClick={() => {
              if (onBookSeat) onBookSeat(location);
              onClose();
            }}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs sm:text-sm shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
          >
            {isSports ? (
              <>
                <Trophy className="w-4 h-4" />
                <span>Book Court &amp; Claim Gear</span>
              </>
            ) : (
              <>
                <Armchair className="w-4 h-4" />
                <span>Pick &amp; Book Seat</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Watch This Space */}
          <button
            onClick={() => {
              onNotify(location);
              onClose();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface font-sora font-semibold text-xs border border-primary-container transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-tertiary" />
            <span>Watch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
