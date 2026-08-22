'use client';

import React, { useState } from 'react';
import { CampusLocation, CampusId } from '@/types';
import { getCrowdColor } from '@/lib/engine/recommendation';
import { Layers, Sparkles, Navigation, VolumeX, Zap } from 'lucide-react';

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
  const [mapFloor, setMapFloor] = useState<string>('all');

  // Dynamic nodes based on campus and floor
  const filteredLocations = locations.filter((l) => {
    if (mapFloor !== 'all' && l.floor !== mapFloor) return false;
    return true;
  });

  const availableFloors = Array.from(new Set(locations.map((l) => l.floor)));

  return (
    <div className="rounded-2xl bg-surface-container-high border border-primary-container p-5 sm:p-7 relative overflow-hidden flex flex-col gap-4 shadow-xl">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-variant pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sora text-base sm:text-lg font-bold text-on-surface tracking-tight">
              {selectedCampus === 'sst_bangalore'
                ? 'SST Bangalore Campus Floor Map'
                : 'New 20-Acre Campus Master Plan Preview'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-container/60 text-primary border border-primary-container font-mono">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-on-surface-variant font-inter">
            {selectedCampus === 'sst_bangalore'
              ? 'Electronic City Phase 1 • Select floor level to view room availability.'
              : 'Architectural multi-building master plan for the upcoming 20-acre tech campus.'}
          </p>
        </div>

        {/* Floor selector tabs inside Map */}
        {selectedCampus === 'sst_bangalore' && (
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-primary-container/70 text-xs overflow-x-auto max-w-full no-scrollbar">
            <button
              onClick={() => setMapFloor('all')}
              className={`px-2.5 py-1 rounded-lg font-sora font-semibold transition-all cursor-pointer ${
                mapFloor === 'all'
                  ? 'bg-tertiary text-on-tertiary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Floors
            </button>
            {availableFloors.map((floor) => (
              <button
                key={floor}
                onClick={() => setMapFloor(floor)}
                className={`px-2.5 py-1 rounded-lg font-sora font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  mapFloor === floor
                    ? 'bg-tertiary text-on-tertiary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {floor}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SVG Interactive Floorplan Container */}
      <div className="relative w-full h-[450px] sm:h-[520px] rounded-xl bg-surface border border-primary-container/60 overflow-hidden">
        {/* SVG Floor Layout */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern
              id="campus-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#31572c"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="1000" height="600" fill="url(#campus-grid)" />

          {/* Building Footprint Outline */}
          <rect
            x="80"
            y="40"
            width="840"
            height="520"
            rx="24"
            fill="#151e0a"
            stroke="#31572c"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <text
            x="110"
            y="75"
            fill="#8c9387"
            fontSize="14"
            fontWeight="bold"
            letterSpacing="2"
            fontFamily="Sora"
          >
            {selectedCampus === 'sst_bangalore'
              ? 'SST MAIN ACADEMIC BLOCK'
              : '20-ACRE INNOVATION PARK'}
          </text>

          {/* Render Active Campus Rooms as Interactive SVG Nodes */}
          {filteredLocations.map((loc) => {
            const pct = Math.round(
              (loc.current_occupancy / Math.max(1, loc.capacity)) * 100
            );
            const isRecommended = recommendedLocationId === loc.id;
            const colors = getCrowdColor(pct);

            return (
              <g
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLoc(loc)}
                onMouseLeave={() => setHoveredLoc(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Pulsing Radar Ring for Top Recommendation */}
                {isRecommended && (
                  <circle
                    cx={loc.coordinates_x}
                    cy={loc.coordinates_y}
                    r="40"
                    fill="none"
                    stroke="#a6d29b"
                    strokeWidth="3"
                    className="radar-beacon opacity-75"
                  />
                )}

                {/* Outer Room Geometry Box */}
                <rect
                  x={loc.coordinates_x - 70}
                  y={loc.coordinates_y - 45}
                  width="140"
                  height="90"
                  rx="14"
                  fill="#19220e"
                  stroke={isRecommended ? '#c5cc7b' : '#31572c'}
                  strokeWidth={isRecommended ? '2.5' : '1.5'}
                  className="transition-all hover:fill-[#232d18]"
                />

                {/* Heat Indicator Color Bar on Room Top */}
                <rect
                  x={loc.coordinates_x - 70}
                  y={loc.coordinates_y - 45}
                  width="140"
                  height="6"
                  rx="3"
                  fill={colors.hex}
                />

                {/* Room Label */}
                <text
                  x={loc.coordinates_x}
                  y={loc.coordinates_y - 15}
                  textAnchor="middle"
                  fill="#dbe7c6"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="Sora"
                >
                  {loc.name.length > 18 ? loc.name.substring(0, 16) + '…' : loc.name}
                </text>

                {/* Floor Label */}
                <text
                  x={loc.coordinates_x}
                  y={loc.coordinates_y + 4}
                  textAnchor="middle"
                  fill="#8c9387"
                  fontSize="10"
                  fontFamily="Inter"
                >
                  {loc.floor}
                </text>

                {/* Live Occupancy Metric */}
                <text
                  x={loc.coordinates_x}
                  y={loc.coordinates_y + 24}
                  textAnchor="middle"
                  fill={colors.hex}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="Sora"
                >
                  {pct}% ({Math.max(0, loc.capacity - loc.current_occupancy)} free)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Space Floating Popover Tooltip */}
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
              <span className="text-tertiary font-bold">Click to view details →</span>
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
    </div>
  );
};
