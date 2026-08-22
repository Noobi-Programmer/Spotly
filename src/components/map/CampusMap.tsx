'use client';

import React, { useState } from 'react';
import { CampusLocation } from '@/types';
import { getCrowdColor, getCrowdStatus } from '@/lib/engine/recommendation';
import { MapPin, Navigation, Sparkles, VolumeX, Zap } from 'lucide-react';

interface CampusMapProps {
  locations: CampusLocation[];
  onSelectLocation: (location: CampusLocation) => void;
  recommendedLocationId?: string | null;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  locations,
  onSelectLocation,
  recommendedLocationId,
}) => {
  const [hoveredLoc, setHoveredLoc] = useState<CampusLocation | null>(null);

  // Map locations to SVG coordinates
  const spaceNodes = [
    {
      code: 'LIB-2F',
      x: 180,
      y: 90,
      width: 220,
      height: 140,
      label: 'Main Library 2F',
      sub: 'Central Library',
    },
    {
      code: 'SR-B',
      x: 520,
      y: 80,
      width: 170,
      height: 110,
      label: 'Study Room B',
      sub: 'Sci & Tech Complex',
    },
    {
      code: 'SR-A',
      x: 710,
      y: 80,
      width: 160,
      height: 110,
      label: 'Study Room A',
      sub: 'Sci & Tech Complex',
    },
    {
      code: 'LAB-CS',
      x: 620,
      y: 260,
      width: 250,
      height: 150,
      label: 'Turing Computer Lab',
      sub: 'Engineering Hall',
    },
    {
      code: 'CAFE-1F',
      x: 140,
      y: 290,
      width: 200,
      height: 130,
      label: 'Artisan Cafe & Commons',
      sub: 'Student Union',
    },
    {
      code: 'LNG-ATRIUM',
      x: 370,
      y: 290,
      width: 220,
      height: 130,
      label: 'Innovation Atrium',
      sub: 'Innovation Center',
    },
  ];

  return (
    <div className="rounded-3xl glass-panel border border-slate-800/90 p-5 sm:p-7 relative overflow-hidden flex flex-col gap-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Interactive Campus Space Map
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Click any zone to inspect room facilities, live occupancy, or set arrival alerts.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-950/70 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300 text-[11px]">Spacious (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-slate-300 text-[11px]">Moderate (40-75%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="text-slate-300 text-[11px]">Crowded (&gt;75%)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[500px] bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox="0 0 1000 480"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1"
              />
            </pattern>
            {/* Pulsing radar filter */}
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="1000" height="480" fill="url(#campus-grid)" />

          {/* Campus Walkways */}
          <path
            d="M 100 240 L 900 240"
            stroke="rgba(100, 116, 139, 0.25)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />
          <path
            d="M 480 50 L 480 430"
            stroke="rgba(100, 116, 139, 0.25)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />

          {/* Campus Central Quad / Green Lawn */}
          <circle cx="480" cy="240" r="45" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="2" strokeDasharray="4 4" />
          <text x="480" y="244" textAnchor="middle" fill="rgba(148, 163, 184, 0.4)" fontSize="11" fontWeight="600" letterSpacing="2">
            CENTRAL QUAD
          </text>

          {/* Render Interactive Building Nodes */}
          {spaceNodes.map((node) => {
            const loc = locations.find((l) => l.code === node.code);
            if (!loc) return null;

            const percentage = Math.round(
              (loc.current_occupancy / Math.max(1, loc.capacity)) * 100
            );
            const colors = getCrowdColor(percentage);
            const isRecommended = recommendedLocationId === loc.id;
            const isHovered = hoveredLoc?.id === loc.id;

            return (
              <g
                key={node.code}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLoc(loc)}
                onMouseLeave={() => setHoveredLoc(null)}
              >
                {/* Recommended Radar Beacon Ring */}
                {isRecommended && (
                  <circle
                    cx={node.x + node.width / 2}
                    cy={node.y + node.height / 2}
                    r={Math.max(node.width, node.height) / 1.5}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    className="animate-ping opacity-30 origin-center"
                  />
                )}

                {/* Building Zone Rectangle */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="14"
                  fill={isHovered ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.85)'}
                  stroke={isRecommended ? '#10b981' : isHovered ? '#38bdf8' : colors.hex}
                  strokeWidth={isRecommended ? '3' : isHovered ? '2.5' : '1.5'}
                  strokeDasharray={isRecommended ? 'none' : 'none'}
                  className="transition-all duration-200"
                  style={{
                    filter: isHovered || isRecommended ? `drop-shadow(0 0 12px ${colors.hex}44)` : 'none',
                  }}
                />

                {/* Occupancy Fill Glow Bar at Bottom of Room */}
                <rect
                  x={node.x + 2}
                  y={node.y + node.height - 8}
                  width={(node.width - 4) * (percentage / 100)}
                  height="6"
                  rx="3"
                  fill={colors.hex}
                  className="transition-all duration-500"
                />

                {/* Recommended Top Badge */}
                {isRecommended && (
                  <g>
                    <rect
                      x={node.x + node.width / 2 - 50}
                      y={node.y - 12}
                      width="100"
                      height="20"
                      rx="10"
                      fill="#10b981"
                    />
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 2}
                      textAnchor="middle"
                      fill="#022c22"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      TOP MATCH
                    </text>
                  </g>
                )}

                {/* Room Title */}
                <text
                  x={node.x + 16}
                  y={node.y + 28}
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {node.label}
                </text>

                {/* Building / Subtitle */}
                <text
                  x={node.x + 16}
                  y={node.y + 44}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="medium"
                >
                  {node.sub}
                </text>

                {/* Occupancy Indicator Badge */}
                <g transform={`translate(${node.x + 16}, ${node.y + 60})`}>
                  <rect
                    width="110"
                    height="22"
                    rx="11"
                    fill="rgba(0, 0, 0, 0.45)"
                    stroke={colors.hex}
                    strokeWidth="1"
                  />
                  <circle cx="10" cy="11" r="4" fill={colors.hex} />
                  <text
                    x="20"
                    y="15"
                    fill={colors.hex}
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {percentage}% • {loc.capacity - loc.current_occupancy} seats
                  </text>
                </g>

                {/* Distance Badge */}
                <text
                  x={node.x + node.width - 16}
                  y={node.y + 75}
                  textAnchor="end"
                  fill="#38bdf8"
                  fontSize="10"
                  fontWeight="semibold"
                >
                  {loc.distance_minutes}m walk
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay (if hovering a node) */}
        {hoveredLoc && (
          <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-slate-700/80 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in">
            <div>
              <div className="text-xs font-bold text-white">{hoveredLoc.name}</div>
              <div className="text-[11px] text-slate-400">
                {hoveredLoc.capacity - hoveredLoc.current_occupancy} of {hoveredLoc.capacity} seats available
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
