'use client';

import React, { useState } from 'react';
import { CampusLocation, CampusId } from '@/types';
import { getCrowdColor, getCrowdStatus } from '@/lib/engine/recommendation';
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
    <div className="rounded-3xl glass-panel border border-slate-800/90 p-5 sm:p-7 relative overflow-hidden flex flex-col gap-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {selectedCampus === 'sst_bangalore'
                ? 'SST Bangalore Campus Floor Map'
                : 'New 20-Acre Campus Master Plan Preview'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {selectedCampus === 'sst_bangalore'
              ? 'Electronic City Phase 1 • Select floor level to view room availability.'
              : 'Architectural multi-building master plan for the upcoming 20-acre tech campus.'}
          </p>
        </div>

        {/* Floor selector tabs inside Map */}
        {selectedCampus === 'sst_bangalore' && (
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full no-scrollbar">
            <button
              onClick={() => setMapFloor('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                mapFloor === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Zones
            </button>
            {availableFloors.map((f) => (
              <button
                key={f}
                onClick={() => setMapFloor(f)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  mapFloor === f
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[500px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="sst-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect width="1000" height="500" fill="url(#sst-grid)" />

          {/* Campus Architectural Layout Corridor Guides */}
          <path
            d="M 80 250 L 920 250"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />
          <path
            d="M 500 50 L 500 450"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />

          {/* Central Hub Marker */}
          <circle
            cx="500"
            cy="250"
            r="40"
            fill="rgba(16, 185, 129, 0.06)"
            stroke="rgba(16, 185, 129, 0.25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text
            x="500"
            y="254"
            textAnchor="middle"
            fill="rgba(148, 163, 184, 0.5)"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
          >
            {selectedCampus === 'sst_bangalore' ? 'CENTRAL LOBBY' : 'CAMPUS PLAZA'}
          </text>

          {/* Render Rooms */}
          {filteredLocations.map((loc, index) => {
            const percentage = Math.round(
              (loc.current_occupancy / Math.max(1, loc.capacity)) * 100
            );
            const colors = getCrowdColor(percentage);
            const isRecommended = recommendedLocationId === loc.id;
            const isHovered = hoveredLoc?.id === loc.id;

            // Dimensions and layout
            const width = 200;
            const height = 110;
            const x = Math.min(780, Math.max(20, loc.coordinates_x - width / 2));
            const y = Math.min(370, Math.max(20, loc.coordinates_y - height / 2));

            return (
              <g
                key={loc.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLoc(loc)}
                onMouseLeave={() => setHoveredLoc(null)}
              >
                {/* Recommended Radar Beacon Ring */}
                {isRecommended && (
                  <circle
                    cx={x + width / 2}
                    cy={y + height / 2}
                    r={width / 1.6}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    className="animate-ping opacity-30 origin-center"
                  />
                )}

                {/* Building Zone Rectangle */}
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="14"
                  fill={isHovered ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.85)'}
                  stroke={isRecommended ? '#10b981' : isHovered ? '#38bdf8' : colors.hex}
                  strokeWidth={isRecommended ? '3' : isHovered ? '2.5' : '1.5'}
                  style={{
                    filter:
                      isHovered || isRecommended
                        ? `drop-shadow(0 0 14px ${colors.hex}44)`
                        : 'none',
                  }}
                />

                {/* Occupancy Fill Glow Bar at Bottom of Room */}
                <rect
                  x={x + 2}
                  y={y + height - 7}
                  width={(width - 4) * (percentage / 100)}
                  height="5"
                  rx="2.5"
                  fill={colors.hex}
                  className="transition-all duration-500"
                />

                {/* Top Badge for Floor & Top Match */}
                {isRecommended && (
                  <g>
                    <rect
                      x={x + width / 2 - 45}
                      y={y - 11}
                      width="90"
                      height="18"
                      rx="9"
                      fill="#10b981"
                    />
                    <text
                      x={x + width / 2}
                      y={y + 2}
                      textAnchor="middle"
                      fill="#022c22"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      TOP MATCH
                    </text>
                  </g>
                )}

                {/* Floor Pill Tag inside room */}
                <text
                  x={x + 14}
                  y={y + 22}
                  fill="#38bdf8"
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  {loc.floor.toUpperCase()}
                </text>

                {/* Room Title */}
                <text
                  x={x + 14}
                  y={y + 40}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {loc.name.length > 22 ? loc.name.substring(0, 20) + '...' : loc.name}
                </text>

                {/* Occupancy Indicator Badge */}
                <g transform={`translate(${x + 14}, ${y + 55})`}>
                  <rect
                    width="100"
                    height="20"
                    rx="10"
                    fill="rgba(0, 0, 0, 0.45)"
                    stroke={colors.hex}
                    strokeWidth="1"
                  />
                  <circle cx="8" cy="10" r="3.5" fill={colors.hex} />
                  <text
                    x="16"
                    y="14"
                    fill={colors.hex}
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    {percentage}% • {loc.capacity - loc.current_occupancy} free
                  </text>
                </g>

                {/* Walk Distance */}
                <text
                  x={x + width - 14}
                  y={y + 68}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontWeight="medium"
                >
                  {loc.distance_minutes}m walk
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredLoc && (
          <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-slate-700/80 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in">
            <div>
              <div className="text-xs font-bold text-white">{hoveredLoc.name}</div>
              <div className="text-[11px] text-slate-400">
                {hoveredLoc.floor} • {hoveredLoc.capacity - hoveredLoc.current_occupancy} of{' '}
                {hoveredLoc.capacity} seats available
              </div>
            </div>
            <button
              onClick={() => onSelectLocation(hoveredLoc)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              Open
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
