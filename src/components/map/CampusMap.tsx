'use client';

import React, { useState } from 'react';
import { CampusLocation, CampusId } from '@/types';
import { SST_FLOOR_ORDER } from '@/lib/supabase/seed-data';
import { getCrowdColor } from '@/lib/engine/recommendation';
import { OccupancyBadge } from '../spaces/OccupancyBadge';
import { Sparkles, Armchair, Trophy } from 'lucide-react';

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
  const [mapFloor, setMapFloor] = useState<string>('Ground Floor');

  // Strict physical floor order
  const availableFloors = Array.from(new Set(locations.map((l) => l.floor))).sort((a, b) => {
    const idxA = SST_FLOOR_ORDER.indexOf(a);
    const idxB = SST_FLOOR_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    return a.localeCompare(b);
  });

  // Dynamic layout calculation to guarantee ZERO collisions
  const getRenderNodes = () => {
    if (mapFloor !== 'all') {
      const floorLocs = locations.filter((l) => l.floor === mapFloor);
      // If single floor, space items nicely
      return floorLocs.map((loc, idx) => {
        let x = loc.coordinates_x;
        let y = loc.coordinates_y;

        if (mapFloor === 'Ground Floor') {
          // 2 Rows: Study in Row 1 (y: 180), Sports in Row 2 (y: 380)
          if (loc.category === 'study') {
            x = idx === 0 ? 320 : 680;
            y = 180;
          } else {
            const sportsIdx = floorLocs.filter((fl) => fl.category === 'sports').indexOf(loc);
            x = 220 + sportsIdx * 280;
            y = 380;
          }
        } else if (mapFloor === 'Upper Basement') {
          if (loc.category === 'food') {
            const foodIdx = floorLocs.filter((fl) => fl.category === 'food').indexOf(loc);
            x = 220 + foodIdx * 280;
            y = 190;
          } else {
            x = 500;
            y = 390;
          }
        } else if (mapFloor === 'Floor 1' || mapFloor === 'Floor 2') {
          x = 220 + (idx % 3) * 280;
          y = 260;
        }

        return { ...loc, renderX: x, renderY: y, cardW: 190, cardH: 95 };
      });
    }

    // ALL LEVELS VIEW: Arrange in 4 pristine, non-colliding floor lanes
    const allNodes: (CampusLocation & { renderX: number; renderY: number; cardW: number; cardH: number })[] = [];

    // Lane 1: Floor 2 (y: 95)
    const f2 = locations.filter((l) => l.floor === 'Floor 2');
    f2.forEach((loc, i) => {
      allNodes.push({ ...loc, renderX: 200 + i * 280, renderY: 95, cardW: 180, cardH: 80 });
    });

    // Lane 2: Floor 1 (y: 215)
    const f1 = locations.filter((l) => l.floor === 'Floor 1');
    f1.forEach((loc, i) => {
      allNodes.push({ ...loc, renderX: 200 + i * 280, renderY: 215, cardW: 180, cardH: 80 });
    });

    // Lane 3: Ground Floor (y: 345)
    const fg = locations.filter((l) => l.floor === 'Ground Floor');
    fg.forEach((loc, i) => {
      allNodes.push({ ...loc, renderX: 130 + i * 185, renderY: 345, cardW: 165, cardH: 80 });
    });

    // Lane 4: Upper Basement (y: 475)
    const fb = locations.filter((l) => l.floor === 'Upper Basement');
    fb.forEach((loc, i) => {
      allNodes.push({ ...loc, renderX: 160 + i * 230, renderY: 475, cardW: 175, cardH: 80 });
    });

    return allNodes;
  };

  const renderedNodes = getRenderNodes();
  const filteredList = locations.filter((l) => mapFloor === 'all' || l.floor === mapFloor);

  return (
    <div className="rounded-3xl bg-surface-container-high border border-primary-container p-5 sm:p-7 relative overflow-hidden flex flex-col gap-6 shadow-xl">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sora text-lg sm:text-xl font-bold text-on-surface tracking-tight">
              {selectedCampus === 'sst_bangalore'
                ? 'SST Bangalore Campus Architectural Map'
                : 'New 20-Acre Campus Master Plan Preview'}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-container/60 text-primary border border-primary-container font-mono">
              COLLISION-FREE 2D RADAR
            </span>
          </div>
          <p className="text-xs text-on-surface-variant font-inter mt-0.5">
            {selectedCampus === 'sst_bangalore'
              ? 'Electronic City Phase 1 • Select floor level to view room & counter availability.'
              : 'Architectural multi-building master plan for the upcoming 20-acre tech campus.'}
          </p>
        </div>

        {/* Floor selector tabs in strict order */}
        {selectedCampus === 'sst_bangalore' && (
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-2xl border border-primary-container/70 text-xs overflow-x-auto max-w-full no-scrollbar">
            {availableFloors.map((floor) => (
              <button
                key={floor}
                onClick={() => setMapFloor(floor)}
                className={`px-3 py-1.5 rounded-xl font-sora font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  mapFloor === floor
                    ? 'bg-tertiary text-on-tertiary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {floor}
              </button>
            ))}
            <button
              onClick={() => setMapFloor('all')}
              className={`px-3 py-1.5 rounded-xl font-sora font-semibold transition-all cursor-pointer ${
                mapFloor === 'all'
                  ? 'bg-tertiary text-on-tertiary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Levels
            </button>
          </div>
        )}
      </div>

      {/* SVG Interactive Floorplan Container */}
      <div className="relative w-full h-[520px] sm:h-[580px] rounded-2xl bg-surface border border-primary-container/60 overflow-hidden">
        {/* SVG Floor Layout */}
        <svg
          viewBox="0 0 1000 580"
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
          <rect width="1000" height="580" fill="url(#campus-grid-pattern)" />

          {/* Floor Perimeter Boundary */}
          <rect
            x="30"
            y="20"
            width="940"
            height="540"
            rx="24"
            fill="#151e0a"
            stroke="#31572c"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Floor Level Lane Indicators in "All Levels" view */}
          {mapFloor === 'all' ? (
            <g>
              <text x="50" y="55" fill="#8c9387" fontSize="11" fontWeight="bold" fontFamily="Sora" letterSpacing="1">
                FLOOR 2 • CODING LABS
              </text>
              <line x1="45" y1="165" x2="945" y2="165" stroke="#31572c" strokeWidth="1" strokeDasharray="4 4" />

              <text x="50" y="180" fill="#8c9387" fontSize="11" fontWeight="bold" fontFamily="Sora" letterSpacing="1">
                FLOOR 1 • INNOVATION &amp; READING
              </text>
              <line x1="45" y1="285" x2="945" y2="285" stroke="#31572c" strokeWidth="1" strokeDasharray="4 4" />

              <text x="50" y="300" fill="#8c9387" fontSize="11" fontWeight="bold" fontFamily="Sora" letterSpacing="1">
                GROUND FLOOR • CLASSROOM &amp; SPORTS
              </text>
              <line x1="45" y1="415" x2="945" y2="415" stroke="#31572c" strokeWidth="1" strokeDasharray="4 4" />

              <text x="50" y="430" fill="#8c9387" fontSize="11" fontWeight="bold" fontFamily="Sora" letterSpacing="1">
                UPPER BASEMENT • MESS &amp; RECREATION
              </text>
            </g>
          ) : (
            <text
              x="60"
              y="55"
              fill="#8c9387"
              fontSize="13"
              fontWeight="bold"
              letterSpacing="2"
              fontFamily="Sora"
            >
              {`SST MAIN CAMPUS • ${mapFloor.toUpperCase()}`}
            </text>
          )}

          {/* Render Collision-Free Room Nodes */}
          {renderedNodes.map((loc) => {
            const pct = Math.round(
              (loc.current_occupancy / Math.max(1, loc.capacity)) * 100
            );
            const isRecommended = recommendedLocationId === loc.id;
            const colors = getCrowdColor(pct);
            const isSports = loc.category === 'sports';

            const nodeX = loc.renderX;
            const nodeY = loc.renderY;
            const halfW = loc.cardW / 2;
            const halfH = loc.cardH / 2;

            return (
              <g
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                onMouseEnter={() => setHoveredLoc(loc)}
                onMouseLeave={() => setHoveredLoc(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Clean Top Match Badge Tag */}
                {isRecommended && (
                  <g>
                    <rect
                      x={nodeX - 40}
                      y={nodeY - halfH - 14}
                      width="80"
                      height="16"
                      rx="5"
                      fill="#c5cc7b"
                    />
                    <text
                      x={nodeX}
                      y={nodeY - halfH - 3}
                      textAnchor="middle"
                      fill="#1b1d00"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="Sora"
                    >
                      ★ TOP MATCH
                    </text>
                  </g>
                )}

                {/* Room Geometry Card */}
                <rect
                  x={nodeX - halfW}
                  y={nodeY - halfH}
                  width={loc.cardW}
                  height={loc.cardH}
                  rx="12"
                  fill="#19220e"
                  stroke={isRecommended ? '#c5cc7b' : isSports ? '#454b05' : '#31572c'}
                  strokeWidth={isRecommended ? '2.5' : '1.5'}
                  className="transition-all hover:fill-[#232d18]"
                />

                {/* Heat Indicator Color Bar on Top */}
                <rect
                  x={nodeX - halfW}
                  y={nodeY - halfH}
                  width={loc.cardW}
                  height="4.5"
                  rx="2"
                  fill={colors.hex}
                />

                {/* Room Name */}
                <text
                  x={nodeX}
                  y={nodeY - (mapFloor === 'all' ? 10 : 16)}
                  textAnchor="middle"
                  fill="#dbe7c6"
                  fontSize={mapFloor === 'all' ? '10' : '11'}
                  fontWeight="bold"
                  fontFamily="Sora"
                >
                  {loc.name.length > 18 ? loc.name.substring(0, 16) + '…' : loc.name}
                </text>

                {/* Table/Seat or Court/Gear Info */}
                <text
                  x={nodeX}
                  y={nodeY + (mapFloor === 'all' ? 6 : 4)}
                  textAnchor="middle"
                  fill="#8c9387"
                  fontSize={mapFloor === 'all' ? '8.5' : '9.5'}
                  fontFamily="Inter"
                >
                  {isSports
                    ? loc.equipment_items && loc.equipment_items.length > 0
                      ? `${loc.equipment_items[0].available} ${loc.equipment_items[0].name.split(' ')[0]} Free`
                      : 'Court Open'
                    : `${loc.table_count ? `${loc.table_count}T • ` : ''}${loc.capacity} Seats`}
                </text>

                {/* Live Occupancy Metric */}
                <text
                  x={nodeX}
                  y={nodeY + (mapFloor === 'all' ? 22 : 26)}
                  textAnchor="middle"
                  fill={colors.hex}
                  fontSize={mapFloor === 'all' ? '10.5' : '12'}
                  fontWeight="bold"
                  fontFamily="Sora"
                >
                  {pct}% ({isSports ? `${Math.max(0, loc.capacity - loc.current_occupancy)} free` : `${Math.max(0, loc.capacity - loc.current_occupancy)} free`})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Popover Tooltip */}
        {hoveredLoc && (
          <div className="absolute top-4 left-4 z-20 p-3.5 rounded-2xl bg-surface-container-high border-2 border-primary-container shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in">
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
            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-inter mb-1.5">
              {hoveredLoc.category === 'sports' ? (
                <span>Sports Court • {hoveredLoc.equipment_items ? hoveredLoc.equipment_items[0].available : 2} gear free</span>
              ) : (
                <span>{hoveredLoc.table_count || 10} Tables • {hoveredLoc.capacity} Seats</span>
              )}
            </div>
            <p className="font-inter text-xs text-on-surface-variant line-clamp-2 mb-2">
              {hoveredLoc.description}
            </p>
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-surface-variant font-inter">
              <span>🚶 {hoveredLoc.distance_minutes} min walk</span>
              <span className="text-tertiary font-bold">Click to view &amp; book →</span>
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
            Spaces on {mapFloor === 'all' ? 'All Levels' : mapFloor} ({filteredList.length})
          </h4>
          <span className="text-xs text-on-surface-variant font-inter">
            Click any space to view live tables or book a seat by serial number
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredList.map((loc) => {
            const isRec = recommendedLocationId === loc.id;
            const isSports = loc.category === 'sports';

            return (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className={`p-3.5 rounded-2xl bg-surface-container border cursor-pointer transition-all hover:bg-surface-container-highest flex flex-col justify-between gap-2.5 ${
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
                    <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-inter mt-0.5">
                      {isSports ? (
                        <>
                          <Trophy className="w-3 h-3 text-secondary" />
                          <span>Court Facility • {loc.equipment_items ? `${loc.equipment_items[0].available} gear free` : 'Open'}</span>
                        </>
                      ) : (
                        <>
                          <Armchair className="w-3 h-3 text-tertiary" />
                          <span>{loc.table_count || 10} Tables</span>
                          <span>•</span>
                          <span>{loc.capacity} Seats ({Math.max(0, loc.capacity - loc.current_occupancy)} free)</span>
                        </>
                      )}
                    </div>
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
