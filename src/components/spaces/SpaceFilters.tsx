'use client';

import React from 'react';
import { SpaceType } from '@/types';
import { Search, VolumeX, Zap, LayoutGrid, Map as MapIcon, Sparkles, Layers } from 'lucide-react';

interface SpaceFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedType: SpaceType | 'all';
  onTypeChange: (type: SpaceType | 'all') => void;
  selectedFloor: string;
  onFloorChange: (floor: string) => void;
  quietOnly: boolean;
  onQuietToggle: (val: boolean) => void;
  chargingOnly: boolean;
  onChargingToggle: (val: boolean) => void;
  spaciousOnly: boolean;
  onSpaciousToggle: (val: boolean) => void;
  activeView: 'cards' | 'map';
  onViewChange: (v: 'cards' | 'map') => void;
  availableFloors: string[];
}

export const SpaceFilters: React.FC<SpaceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedFloor,
  onFloorChange,
  quietOnly,
  onQuietToggle,
  chargingOnly,
  onChargingToggle,
  spaciousOnly,
  onSpaciousToggle,
  activeView,
  onViewChange,
  availableFloors,
}) => {
  const typeCategories: { label: string; value: SpaceType | 'all' }[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Study Pods & Rooms', value: 'study_room' },
    { label: 'Libraries', value: 'library' },
    { label: 'Tech Labs & Hack', value: 'lab' },
    { label: 'Classrooms / Amphi', value: 'classroom' },
    { label: 'Cafeteria', value: 'cafeteria' },
    { label: 'Lounges & Turf', value: 'lounge' },
  ];

  return (
    <div className="flex flex-col gap-3.5 mb-6">
      {/* Top Bar: Search + View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search SST Innovation Lab, Coding Pods, Reading Room, Cafeteria..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* View Switcher: Cards vs Map */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => onViewChange('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'cards'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => onViewChange('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'map'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Campus Map</span>
          </button>
        </div>
      </div>

      {/* Floor-by-Floor Selector Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1 pr-2 shrink-0">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Floor:
        </span>
        <button
          onClick={() => onFloorChange('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedFloor === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
        >
          All Floors
        </button>
        {availableFloors.map((floor) => (
          <button
            key={floor}
            onClick={() => onFloorChange(floor)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedFloor === floor
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            {floor}
          </button>
        ))}
      </div>

      {/* Category Pills & Quick Filter Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Space Types */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {typeCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onTypeChange(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedType === cat.value
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:bg-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuietToggle(!quietOnly)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              quietOnly
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <VolumeX className="w-3 h-3" />
            Quiet
          </button>

          <button
            onClick={() => onChargingToggle(!chargingOnly)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              chargingOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Zap className="w-3 h-3" />
            Outlets
          </button>

          <button
            onClick={() => onSpaciousToggle(!spaciousOnly)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              spaciousOnly
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Spacious (&lt;50%)
          </button>
        </div>
      </div>
    </div>
  );
};
