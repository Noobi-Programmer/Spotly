'use client';

import React, { useState } from 'react';
import { CampusLocation } from '@/types';
import { OccupancyBadge } from './OccupancyBadge';
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
  UtensilsCrossed,
  ChefHat,
  Coffee,
  Check,
  Armchair,
  Salad,
  Flame,
  Leaf,
  Trophy,
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

  const handleQuickReport = (level: 'empty' | 'moderate' | 'full') => {
    onSubmitReport?.(location.id, level);
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-container-high border-2 border-primary-container shadow-2xl p-6 sm:p-8 no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-primary-container/40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-sora text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-surface-container text-primary border border-primary-container">
            {location.type.replace('_', ' ')}
          </span>
          <span className="text-xs font-medium text-on-surface-variant font-inter">
            {location.building} • {location.floor}
          </span>
          <span className="text-xs font-semibold text-primary flex items-center gap-1 ml-auto mr-8 font-inter">
            <Navigation className="w-3.5 h-3.5" />
            {location.distance_minutes} min walk
          </span>
        </div>

        {/* Space Title */}
        <h2 className="font-sora text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-2">
          {location.name}
        </h2>

        {/* Summary Pill: Sports Facility vs Tables & Seats */}
        {isSports ? (
          <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-4 font-inter">
            <span className="flex items-center gap-1 text-secondary font-bold font-sora">
              <Trophy className="w-4 h-4 text-secondary" />
              Sports Court &amp; Pitch
            </span>
            <span>•</span>
            <span>
              Players Active: <strong>{location.current_occupancy} / {location.capacity}</strong>
            </span>
            <span>•</span>
            <span className="text-secondary font-bold">
              {location.equipment_items && location.equipment_items.length > 0
                ? `${location.equipment_items[0].available} ${location.equipment_items[0].name.toLowerCase()} available`
                : 'Gear locker open'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-4 font-inter">
            <span className="flex items-center gap-1">
              <Armchair className="w-4 h-4 text-tertiary" />
              <strong>{location.table_count || 10}</strong> Tables
            </span>
            <span>•</span>
            <span>
              <strong>{location.capacity}</strong> Total Seats
            </span>
            <span>•</span>
            <span className="text-primary font-bold">
              {availableSeats} Free Seats
            </span>
          </div>
        )}

        <p className="font-inter text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-5">
          {location.description}
        </p>

        {/* Mess Provider Callout (Cheftalk vs The Craving Brew) */}
        {location.mess_provider && (
          <div className="p-4 rounded-2xl bg-surface-container border border-primary-container mb-5 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2.5">
              {location.mess_provider === 'Cheftalk' ? (
                <div className="w-8 h-8 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-sm">
                  👨‍🍳
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                  🍱
                </div>
              )}
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

        {/* Occupancy Status Section */}
        <div className="p-4 rounded-2xl bg-surface-container border border-primary-container mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sora">
              Live Crowd Telemetry
            </span>
            <span className="text-xs font-semibold text-primary flex items-center gap-1 font-inter">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              Live Stream
            </span>
          </div>

          <OccupancyBadge
            currentOccupancy={location.current_occupancy}
            capacity={location.capacity}
            trend={location.trend}
          />
        </div>

        {/* Hourly Traffic Chart (Google Popular Times Style) */}
        <div className="mb-5">
          <HourlyTrafficChart location={location} />
        </div>

        {/* Community 1-Tap Crowd Reporting */}
        <div className="p-4 rounded-2xl bg-surface-container border border-primary-container/70 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-sora flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              Community Crowd Check-in
            </span>
            <span className="text-[11px] text-primary font-medium font-inter">
              {location.report_count || 8} verified reports
            </span>
          </div>

          <p className="text-[11px] text-on-surface-variant mb-3 font-inter">
            Are you here right now? Help fellow students by tapping the live crowd status:
          </p>

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
              <span>Thank you! Live crowd updated.</span>
            </div>
          )}
        </div>

        {/* Sports Gear Details */}
        {location.equipment_items && location.equipment_items.length > 0 && (
          <div className="p-4 rounded-2xl bg-surface-container border border-secondary-container/70 mb-5">
            <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-2.5 flex items-center gap-1.5 font-sora">
              <Dumbbell className="w-3.5 h-3.5" />
              Locker Gear Available for Checkout
            </div>
            <div className="grid grid-cols-2 gap-2">
              {location.equipment_items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-surface-container-high border border-primary-container/60 flex items-center justify-between text-xs font-inter"
                >
                  <span className="text-on-surface font-medium">{item.name}</span>
                  <span className="font-bold text-secondary font-mono">
                    {item.available} / {item.total} free
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenity Feature Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center gap-2.5">
            {location.is_quiet ? (
              <VolumeX className="w-4 h-4 text-primary" />
            ) : (
              <Volume2 className="w-4 h-4 text-tertiary" />
            )}
            <div>
              <div className="text-[10px] text-on-surface-variant font-inter">Acoustics</div>
              <div className="text-xs font-bold text-on-surface font-sora">{location.noise_level}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center gap-2.5">
            <Zap className={`w-4 h-4 ${location.has_charging ? 'text-primary' : 'text-outline'}`} />
            <div>
              <div className="text-[10px] text-on-surface-variant font-inter">Power Plugs</div>
              <div className="text-xs font-bold text-on-surface font-sora">
                {location.has_charging ? 'Available' : 'Limited'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-primary-container/60 flex items-center gap-2.5">
            <Wifi className="w-4 h-4 text-primary" />
            <div>
              <div className="text-[10px] text-on-surface-variant font-inter">Wi-Fi</div>
              <div className="text-xs font-bold text-on-surface font-sora">
                {location.has_fast_wifi ? 'Gigabit' : 'Standard'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-surface-variant">
          {/* Action CTA: Book Court / Gear vs Pick Seat */}
          <button
            onClick={() => {
              if (onBookSeat) onBookSeat(location);
              onClose();
            }}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs sm:text-sm shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
          >
            {isSports ? (
              <>
                <Trophy className="w-4 h-4 text-on-tertiary" />
                <span>Book Court Slot &amp; Claim Gear</span>
              </>
            ) : (
              <>
                <Armchair className="w-4 h-4" />
                <span>Pick &amp; Book Seat</span>
              </>
            )}
          </button>

          {/* Watch This Space */}
          <button
            onClick={() => {
              onNotify(location);
              onClose();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-surface-container hover:bg-surface-container-highest text-on-surface font-sora font-semibold text-xs border border-primary-container transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-tertiary" />
            <span>Watch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
