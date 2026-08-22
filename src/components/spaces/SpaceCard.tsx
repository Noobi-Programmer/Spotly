'use client';

import React from 'react';
import { CampusLocation } from '@/types';
import { OccupancyBadge } from './OccupancyBadge';
import {
  Volume2,
  VolumeX,
  Zap,
  Wifi,
  Navigation,
  Eye,
  BookOpen,
  Coffee,
  Code2,
  Users,
  GraduationCap,
  UtensilsCrossed,
  ChefHat,
  Trophy,
  Dumbbell,
  Clock,
  CheckCircle2,
  Armchair,
  Flame,
  Leaf,
  Salad,
  Sun,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import {
  UserCoordinates,
  calculateHaversineDistanceMeters,
  metersToWalkingMinutes,
} from '@/lib/utils/geolocation';

interface SpaceCardProps {
  location: CampusLocation;
  onSelect: (location: CampusLocation) => void;
  onNotify: (location: CampusLocation) => void;
  onBookSeat?: (location: CampusLocation) => void;
  highlighted?: boolean;
  userCoordinates?: UserCoordinates | null;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  location,
  onSelect,
  onNotify,
  onBookSeat,
  highlighted = false,
  userCoordinates,
}) => {
  const percentage = Math.round(
    (location.current_occupancy / Math.max(1, location.capacity)) * 100
  );
  const isUnavailable = location.current_occupancy >= location.capacity || percentage >= 71;
  const freeSeats = Math.max(0, location.capacity - location.current_occupancy);

  // Calculate live proximity if user coordinates available
  let displayMinutes = location.distance_minutes;
  if (userCoordinates && location.latitude && location.longitude) {
    const distMeters = calculateHaversineDistanceMeters(
      userCoordinates.latitude,
      userCoordinates.longitude,
      location.latitude,
      location.longitude
    );
    displayMinutes = metersToWalkingMinutes(distMeters);
  }

  // Apt Lucide Icons for every distinct space
  const getSpaceIcon = () => {
    if (location.mess_provider === 'Cheftalk') {
      return <ChefHat className="w-4 h-4 text-tertiary" />;
    }
    if (location.mess_provider === 'The Craving Brew') {
      return <Coffee className="w-4 h-4 text-tertiary" />;
    }
    if (location.name.includes('Block B') || location.type === 'lab') {
      return <Code2 className="w-4 h-4 text-primary" />;
    }
    if (location.name.includes('Terrace') || location.name.includes('Outside')) {
      return <Sun className="w-4 h-4 text-tertiary" />;
    }
    if (location.name.includes('Turff') || location.name.includes('Basketball')) {
      return <Trophy className="w-4 h-4 text-secondary" />;
    }
    if (location.name.includes('Play Zone')) {
      return <Gamepad2 className="w-4 h-4 text-primary" />;
    }
    if (location.type === 'classroom') {
      return <GraduationCap className="w-4 h-4 text-primary" />;
    }
    if (location.type === 'library' || location.type === 'study_room') {
      return <BookOpen className="w-4 h-4 text-primary" />;
    }
    return <Users className="w-4 h-4 text-primary" />;
  };

  return (
    <div
      className={`group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl ${
        highlighted
          ? 'bg-surface-container-high border-2 border-tertiary shadow-xl shadow-tertiary/15'
          : 'bg-surface-container border border-primary-container/80 hover:border-primary hover:bg-surface-container-high'
      }`}
    >
      {/* Top Row: Type Badge + Proximity Walk Meter */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] font-sora font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl bg-surface-container-highest text-on-surface border border-primary-container">
              {getSpaceIcon()}
              <span>{location.type.replace('_', ' ')}</span>
            </span>
            <span className="text-xs text-on-surface-variant font-inter font-semibold">
              📍 {location.floor}
            </span>
          </div>

          <span className="text-xs font-bold text-primary flex items-center gap-1 font-sora px-2.5 py-1 rounded-lg bg-primary-container/30 border border-primary-container">
            <Navigation className="w-3 h-3 text-primary" />
            {displayMinutes}m walk
          </span>
        </div>

        {/* Space Title */}
        <h3
          onClick={() => onSelect(location)}
          className="font-sora text-lg font-bold text-on-surface hover:text-tertiary cursor-pointer transition-colors leading-tight mb-2"
        >
          {location.name}
        </h3>

        {/* Doomscroll Brain: Big Bold Tables & Seats Summary */}
        <div className="flex items-center gap-2.5 text-xs text-on-surface-variant mb-3 font-inter bg-surface-container-lowest/60 p-2.5 rounded-xl border border-primary-container/40">
          <span className="flex items-center gap-1 text-on-surface font-semibold font-sora">
            <Armchair className="w-3.5 h-3.5 text-tertiary" />
            {location.table_count || 10} Tables
          </span>
          <span className="text-outline">•</span>
          <span className="font-sora font-semibold">
            {location.capacity} Seats
          </span>
          <span className="text-outline">•</span>
          <span
            className={`font-sora font-bold px-2 py-0.5 rounded-md ${
              freeSeats > 10
                ? 'bg-primary-container/60 text-primary'
                : freeSeats > 0
                ? 'bg-tertiary-container/60 text-tertiary'
                : 'bg-error-container/60 text-error'
            }`}
          >
            {freeSeats} Free
          </span>
        </div>

        <p className="font-inter text-xs text-on-surface-variant line-clamp-2 mb-3.5 leading-relaxed">
          {location.description}
        </p>

        {/* 🍱 Food Provider Callout (CT: Cheftalk vs TCB: The Craving Brew) */}
        {location.mess_provider && (
          <div className="mb-3.5 p-3 rounded-2xl bg-surface-container-high border border-primary-container flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              {location.mess_provider === 'Cheftalk' ? (
                <div className="w-7 h-7 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-xs">
                  👨‍🍳
                </div>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                  ☕
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant font-sora block leading-none">
                  {location.mess_provider === 'Cheftalk' ? 'CT • MESS COUNTER' : 'TCB • ALTERNATE MESS'}
                </span>
                <span className="font-sora text-xs font-bold text-on-surface">
                  {location.mess_provider}
                </span>
              </div>
            </div>

            {/* Meal Type Pill */}
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-sora font-bold border ${
                location.meal_type === 'Veg'
                  ? 'bg-primary-container/40 text-primary border-primary'
                  : location.meal_type === 'Non-Veg'
                  ? 'bg-tertiary-container/40 text-tertiary border-tertiary'
                  : location.meal_type === 'Jain'
                  ? 'bg-secondary-container/40 text-secondary border-secondary'
                  : 'bg-surface-container-highest text-on-surface border-outline'
              }`}
            >
              {location.meal_type === 'Veg' && <Salad className="w-3 h-3" />}
              {location.meal_type === 'Non-Veg' && <Flame className="w-3 h-3" />}
              {location.meal_type === 'Jain' && <Leaf className="w-3 h-3" />}
              {location.meal_type === 'Cafe & Snacks' && <Coffee className="w-3 h-3" />}
              <span>{location.meal_type}</span>
            </span>
          </div>
        )}

        {/* ⏱️ Food Queue Wait Time Callout */}
        {location.wait_time_minutes !== undefined && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-tertiary-container/30 border border-tertiary/40 flex items-center justify-between text-xs text-tertiary">
            <span className="flex items-center gap-1 font-semibold font-sora">
              <Clock className="w-3.5 h-3.5 text-tertiary" />
              Queue Wait Time
            </span>
            <span className="font-bold font-mono">~{location.wait_time_minutes} min wait</span>
          </div>
        )}

        {/* 🏀 Sports Gear Callout */}
        {location.equipment_items && location.equipment_items.length > 0 && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-primary-container/30 border border-primary-container flex items-center justify-between text-xs text-primary">
            <span className="flex items-center gap-1 font-semibold font-sora">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              Equipment Available
            </span>
            <span className="font-bold font-inter">
              {location.equipment_items[0].available} {location.equipment_items[0].name.toLowerCase()} free
            </span>
          </div>
        )}
      </div>

      {/* Live Occupancy Gauge with Crowd Trend */}
      <div className="mb-3.5">
        <OccupancyBadge
          currentOccupancy={location.current_occupancy}
          capacity={location.capacity}
          trend={location.trend}
        />
      </div>

      {/* Amenity Badges & Action Buttons */}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px] font-inter">
          {/* Noise Rating */}
          <span
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border font-semibold ${
              location.is_quiet
                ? 'bg-primary-container/20 text-primary border-primary-container'
                : 'bg-tertiary-container/20 text-tertiary border-tertiary-container'
            }`}
          >
            {location.is_quiet ? (
              <VolumeX className="w-3 h-3 text-primary" />
            ) : (
              <Volume2 className="w-3 h-3 text-tertiary" />
            )}
            {location.noise_level}
          </span>

          {/* Charging */}
          {location.has_charging && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary-container/20 text-primary border border-primary-container font-semibold">
              <Zap className="w-3 h-3 text-primary" />
              Power
            </span>
          )}

          {/* Fast Wi-Fi */}
          {location.has_fast_wifi && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary-container/20 text-primary border border-primary-container font-semibold">
              <Wifi className="w-3 h-3 text-primary" />
              Gigabit
            </span>
          )}

          {/* Confidence Indicator */}
          <span className="ml-auto flex items-center gap-1 text-[10px] text-on-surface-variant font-inter">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            {location.report_count || 8} reports
          </span>
        </div>

        {/* Action Buttons: Book Seat + Go Here / Watch */}
        <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-surface-variant">
          <button
            onClick={() => (onBookSeat ? onBookSeat(location) : onSelect(location))}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-sora font-bold border border-primary-container transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Armchair className="w-3.5 h-3.5 text-tertiary" />
            <span>Book Seat</span>
          </button>

          {isUnavailable ? (
            <button
              onClick={() => onNotify(location)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container-highest hover:bg-surface-bright text-on-surface border border-outline-variant text-xs font-sora font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-tertiary" />
              <span>Watch</span>
            </button>
          ) : (
            <button
              onClick={() => onSelect(location)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary text-xs font-sora font-bold shadow-md shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Go Here</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
