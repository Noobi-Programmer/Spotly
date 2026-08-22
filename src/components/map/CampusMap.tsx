'use client';

import React, { useState } from 'react';
import { CampusLocation, CampusId } from '@/types';
import { getCrowdColor } from '@/lib/engine/recommendation';
import { OccupancyBadge } from '../spaces/OccupancyBadge';
import { Layers, Navigation, VolumeX, Volume2, Zap, Wifi, Eye, Sparkles } from 'lucide-react';

interface CampusMapProps {
  locations: CampusLocation[];
  selectedCampus: CampusId;
  onSelectLocation: (location: CampusLocation) => void;
  recommendedLocationId?: string | null;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  locations,
  selectedCampus,
  onSelectLocation,
  recommendedLocationId,
}) => {
  const [hoveredLoc, setHoveredLoc] = useState<CampusLocation | null>(null);
  // Default to Floor 2 for clean, pristine single-floor view
  const [mapFloor, setMapFloor] = useState<string>('Floor 2');

  const availableFloors = Array.from(new Set(locations.map((l) => l.floor)));

  // Dynamic nodes based on floor selection
  const filteredLocations = locations.filter((l) => {
    if (mapFloor !== 'all' && l.floor !== mapFloor) return false;
    return true;
  });

  return (
    <div className="rounded-2xl bg-surface-container-high border border-primary-container p-5 sm:p-7 relative overflow-hidden flex flex-col gap-6 shadow-xl">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sora text-lg sm:text-xl font-bold text-on-surface tracking-tight">
              {selectedCampus === 'sst_bangalore'
                ? 'SST Bangalore Campus Floor Map'
                : 'New 20-Acre Campus Master Plan Preview'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-container/60 text-primary border border-primary-container font-mono">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-on-surface-variant font-inter mt-0.5">
            {selectedCampus === 'sst_bangalore'
              ? 'Electronic City Phase 1 • Select floor level to view room availability.'
              : 'Architectural multi-building master plan for the upcoming 20-acre tech campus.'}
          </p>
        </div>

        {/* Floor selector tabs */}
        {selectedCampus === 'sst_bangalore' && (
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-xl border border-primary-container/70 text-xs overflow-x-auto max-w-full no-scrollbar">
            {availableFloors.map((floor) => (
              <button
                key={floor}
                onClick={() => setMapFloor(floor)}
                className={`px-3 py-1.5 rounded-lg font-sora font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  mapFloor === floor
                    ? 'bg-tertiary text-on-tertiary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {floor}
              </button>
            ))}
            <button
              onClick={() => setMapFloor('all')}
              className={`px-3 py-1.5 rounded-lg font-sora font-semibold transition-all cursor-pointer ${
                mapFloor === 'all'
                  ? 'bg-tertiary text-on-tertiary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Floors
            </button>
          </div>
        )}
      </div>

      {/* SVG Interactive Floorplan Container */}
      <div className="relative w-full h-[400px] sm:h-[460px] rounded-xl bg-surface border border-primary-container/60 overflow-hidden">
        {/* SVG Floor Layout */}
        <svg
          viewBox="0 0 1000 560"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid Pattern */}
          <defs>
            <pattern
              id="campus-grid-pattern"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 36 0 L 0 0 0 36"
                fill="none"
                stroke="#31572c"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="1000" height="560" fill="url(#campus-grid-pattern)" />

          {/* Floor Perimeter Boundary */}
          <rect
            x="60"
            y="40"
            width="880"
            height="480"
            rx="24"
            fill="#151e0a"
            stroke="#31572c"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <text
            x="90"
            y="75"
            fill="#8c9387"
            fontSize="13"
            fontWeight="bold"
            letterSpacing="2"
            fontFamily="Sora"
          >
            {selectedCampus === 'sst_bangalore'
              ? `SST MAIN BLOCK • ${mapFloor.toUpperCase()}`
              : '20-ACRE INNOVATION MASTER PARK'}
          </text>

          {/* Render Room Nodes */}
          {filteredLocations.map((loc, idx) => {
            const pct = Math.round(
              (loc.current_occupancy / Math.max(1, loc.capacity)) * 100
            );
            const isRecommended = recommendedLocationId === loc.id;
            const colors = getCrowdColor(pct);

            // Compute clean x coordinate if multiple rooms on 'all'
            const nodeX = loc.coordinates_x;
            const nodeY = loc.coordinates_y;

            return (
              <g
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLoc(loc)}
                onMouseLeave={() => setHoveredLoc(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Pulsing Radar Beacon for Top Recommendation */}
                {isRecommended && (
                  <circle
                    cx={nodeX}
                    cy={nodeY}
                    r="55"
                    fill="none"
                    stroke="#a6d29b"
                    strokeWidth="3"
                    className="radar-beacon opacity-80"
                  />
                )}

                {/* Room Geometry Card */}
                <rect
                  x={nodeX - 100}
                  y={nodeY - 55}
                  width="200"
                  height="110"
                  rx="14"
                  fill="#19220e"
                  stroke={isRecommended ? '#c5cc7b' : '#31572c'}
                  strokeWidth={isRecommended ? '2.5' : '1.5'}
                  className="transition-all hover:fill-[#232d18]"
                />

                {/* Heat Indicator Color Bar on Top */}
                <rect
                  x={nodeX - 100}
                  y={nodeY - 55}
                  width="200"
                  height="6"
                  rx="3"
                  fill={colors.hex}
                />

                {/* Room Name */}
                <text
                  x={nodeX}
                  y={nodeY - 20}
                  textAnchor="middle"
                  fill="#dbe7c6"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="Sora"
                >
                  {loc.name.length > 22 ? loc.name.substring(0, 20) + '…' : loc.name}
                </text>

                {/* Floor Info */}
                <text
                  x={nodeX}
                  y={nodeY + 2}
                  textAnchor="middle"
                  fill="#8c9387"
                  fontSize="10"
                  fontFamily="Inter"
                >
                  {loc.floor} • {loc.distance_minutes} min walk
                </text>

                {/* Live Occupancy Metric */}
                <text
                  x={nodeX}
                  y={nodeY + 26}
                  textAnchor="middle"
                  fill={colors.hex}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="Sora"
                >
                  {pct}% full ({Math.max(0, loc.capacity - loc.current_occupancy)} free)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Popover Tooltip */}
        {hoveredLoc && (
          <div className="absolute top-4 left-4 z-20 p-3.5 rounded-xl bg-surface-container-high border-2 border-primary-container shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-sora">
                {hoveredLoc.type.replace('_', ' ')} • {hoveredLoc.floor}
              </span>
              <span className="text-xs font-bold text-on-surface font-mono">
                {Math.round((hoveredLoc.current_occupancy / hoveredLoc.capacity) * 100)}% occupied
              </span>
            </div>
            <h4 className="font-sora text-sm font-bold text-on-surface mb-1">
              {hoveredLoc.name}
            </h4>
            <p className="font-inter text-xs text-on-surface-variant line-clamp-2 mb-2">
              {hoveredLoc.description}
            </p>
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-surface-variant font-inter">
              <span>🚶 {hoveredLoc.distance_minutes} min walk</span>
              <span className="text-tertiary font-bold">Click to view →</span>
            </div>
          </div>
        )}

        {/* Heat Legend */}
        <div className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-surface-container-high/90 border border-primary-container text-xs flex items-center gap-3 backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-inter">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a6d29b]" />
            <span className="text-on-surface-variant text-[11px]">Spacious (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-1.5 font-inter">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c5cc7b]" />
            <span className="text-on-surface-variant text-[11px]">Moderate (40–70%)</span>
          </div>
          <div className="flex items-center gap-1.5 font-inter">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]" />
            <span className="text-on-surface-variant text-[11px]">Crowded (&gt;70%)</span>
          </div>
        </div>
      </div>

      {/* Structured Floor Directory Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="font-sora text-sm font-bold text-on-surface">
            Rooms on {mapFloor === 'all' ? 'All Floors' : mapFloor} ({filteredLocations.length})
          </h4>
          <span className="text-xs text-on-surface-variant font-inter">
            Click any room to open detailed telemetry or set crowd alerts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLocations.map((loc) => {
            const isRec = recommendedLocationId === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`p-3.5 rounded-xl bg-surface-container border cursor-pointer transition-all hover:bg-surface-container-highest flex flex-col justify-between gap-2.5 ${
                  isRec ? 'border-tertiary shadow-md shadow-tertiary/10' : 'border-primary-container/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {isRec && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1 font-sora">
                        <Sparkles className="w-3 h-3" /> Top Pick
                      </span>
                    )}
                    <h5 className="font-sora text-sm font-bold text-on-surface leading-snug">
                      {loc.name}
                    </h5>
                    <p className="text-[11px] text-on-surface-variant font-inter">
                      {loc.floor} • {loc.distance_minutes}m walk
                    </p>
                  </div>
                </div>

                <OccupancyBadge
                  currentOccupancy={loc.current_occupancy}
                  capacity={loc.capacity}
                  trend={loc.trend}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
