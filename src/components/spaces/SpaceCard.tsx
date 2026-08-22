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
  highlighted?: boolean;
  userCoordinates?: UserCoordinates | null;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  location,
  onSelect,
  onNotify,
  highlighted = false,
  userCoordinates,
}) => {
  const percentage = Math.round(
    (location.current_occupancy / Math.max(1, location.capacity)) * 100
  );
  const isUnavailable = location.current_occupancy >= location.capacity || percentage >= 71;

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
      case 'cafeteria':
        return <Coffee className="w-3.5 h-3.5" />;
      default:
        return <Users className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all flex flex-col justify-between ${
        highlighted
          ? 'bg-slate-900/90 border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/15'
          : 'glass-card'
      }`}
    >
      {/* Header Info */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
              {getTypeIcon()}
              {location.type.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {location.building} • {location.floor}
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-cyan-400" />
            {displayMinutes}m walk
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(location)}
          className="text-base sm:text-lg font-bold text-white hover:text-emerald-400 cursor-pointer transition-colors leading-tight mb-2"
        >
          {location.name}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {location.description}
        </p>
      </div>

      {/* Live Occupancy Gauge */}
      <div className="mb-4">
        <OccupancyBadge
          currentOccupancy={location.current_occupancy}
          capacity={location.capacity}
        />
      </div>

      {/* Amenity Badges & Action Buttons */}
      <div>
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px]">
          {/* Noise Rating */}
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
              location.is_quiet
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/25'
            }`}
          >
            {location.is_quiet ? (
              <VolumeX className="w-3 h-3 text-blue-400" />
            ) : (
              <Volume2 className="w-3 h-3 text-amber-400" />
            )}
            {location.noise_level}
          </span>

          {/* Charging */}
          {location.has_charging && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-medium">
              <Zap className="w-3 h-3 text-emerald-400" />
              Power
            </span>
          )}

          {/* Fast Wi-Fi */}
          {location.has_fast_wifi && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 font-medium">
              <Wifi className="w-3 h-3 text-cyan-400" />
              Gigabit Wi-Fi
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => onSelect(location)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Details
          </button>

          {isUnavailable ? (
            <button
              onClick={() => onNotify(location)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              Watch Space
            </button>
          ) : (
            <button
              onClick={() => onSelect(location)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-sm transition-all active:scale-95"
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
