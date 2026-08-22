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
  Laptop,
  Users,
  GraduationCap,
  Utensils,
  Dumbbell,
  Clock,
  CheckCircle2,
  Armchair,
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

  const getTypeIcon = () => {
    switch (location.type) {
      case 'library':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'study_room':
        return <Users className="w-3.5 h-3.5" />;
      case 'lab':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'classroom':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'food_counter':
      case 'cafeteria':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'sports_court':
        return <Dumbbell className="w-3.5 h-3.5" />;
      default:
        return <Users className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all flex flex-col justify-between ${
        highlighted
          ? 'bg-surface-container-high border-2 border-tertiary shadow-xl shadow-tertiary/15'
          : 'glass-card'
      }`}
    >
      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] font-sora font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container text-on-surface border border-primary-container">
              {getTypeIcon()}
              {location.type.replace('_', ' ')}
            </span>
            <span className="text-xs text-on-surface-variant font-inter font-medium">
              {location.floor}
            </span>
          </div>

          <span className="text-xs font-semibold text-primary flex items-center gap-1 font-inter whitespace-nowrap">
            <Navigation className="w-3 h-3 text-primary" />
            {displayMinutes}m walk
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(location)}
          className="font-sora text-base sm:text-lg font-bold text-on-surface hover:text-primary cursor-pointer transition-colors leading-tight mb-1.5"
        >
          {location.name}
        </h3>

        {/* Tables & Seats Summary */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2.5 font-inter">
          <span className="flex items-center gap-1">
            <Armchair className="w-3.5 h-3.5 text-tertiary" />
            <strong>{location.table_count || 10}</strong> tables
          </span>
          <span>•</span>
          <span>
            <strong>{location.capacity}</strong> total seats (
            <strong className="text-primary">{freeSeats} free</strong>)
          </span>
        </div>

        <p className="font-inter text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
          {location.description}
        </p>

        {/* Mess Provider Badge for Cafeteria Counters */}
        {location.mess_provider && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-surface-container border border-primary-container/70 flex items-center justify-between text-xs">
            <span className="font-sora font-bold text-on-surface flex items-center gap-1">
              <Utensils className="w-3 h-3 text-primary" />
              {location.mess_provider}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-primary font-mono text-[10px] font-bold">
              {location.meal_type}
            </span>
          </div>
        )}

        {/* Food Queue wait time */}
        {location.wait_time_minutes !== undefined && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-tertiary-container/30 border border-tertiary/40 flex items-center justify-between text-xs text-tertiary">
            <span className="flex items-center gap-1 font-semibold font-sora">
              <Clock className="w-3.5 h-3.5 text-tertiary" />
              Queue Wait Time
            </span>
            <span className="font-bold font-mono">~{location.wait_time_minutes} min wait</span>
          </div>
        )}

        {/* Sports Gear */}
        {location.equipment_items && location.equipment_items.length > 0 && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-primary-container/30 border border-primary-container flex items-center justify-between text-xs text-primary">
            <span className="flex items-center gap-1 font-semibold font-sora">
              <Dumbbell className="w-3.5 h-3.5 text-primary" />
              Available Gear
            </span>
            <span className="font-bold font-inter">
              {location.equipment_items[0].available} {location.equipment_items[0].name.toLowerCase()} free
            </span>
          </div>
        )}
      </div>

      {/* Live Occupancy Gauge with Crowd Trend */}
      <div className="mb-3">
        <OccupancyBadge
          currentOccupancy={location.current_occupancy}
          capacity={location.capacity}
          trend={location.trend}
        />
      </div>

      {/* Amenity Badges & Action Buttons */}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5 text-[11px] font-inter">
          {/* Noise Rating */}
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
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
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-container/20 text-primary border border-primary-container font-medium">
              <Zap className="w-3 h-3 text-primary" />
              Power
            </span>
          )}

          {/* Fast Wi-Fi */}
          {location.has_fast_wifi && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-container/20 text-primary border border-primary-container font-medium">
              <Wifi className="w-3 h-3 text-primary" />
              Gigabit
            </span>
          )}

          {/* Confidence Indicator */}
          <span className="ml-auto flex items-center gap-1 text-[10px] text-on-surface-variant">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            {location.report_count || 8} reports
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-surface-variant">
          <button
            onClick={() => (onBookSeat ? onBookSeat(location) : onSelect(location))}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-sora font-semibold border border-primary-container/60 transition-colors cursor-pointer"
          >
            <Armchair className="w-3.5 h-3.5 text-tertiary" />
            <span>Book Seat</span>
          </button>

          {isUnavailable ? (
            <button
              onClick={() => onNotify(location)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface border border-outline-variant text-xs font-sora font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-tertiary" />
              Watch Space
            </button>
          ) : (
            <button
              onClick={() => onSelect(location)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-tertiary hover:bg-tertiary-fixed text-on-tertiary text-xs font-sora font-bold shadow-sm shadow-tertiary/20 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              Go Here
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
