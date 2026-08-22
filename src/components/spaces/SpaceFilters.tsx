'use client';

import React from 'react';
import { SpaceType, CampusResourceCategory } from '@/types';
import { Search, VolumeX, Zap, LayoutGrid, Map as MapIcon, BookOpen, Utensils, Dumbbell } from 'lucide-react';

interface SpaceFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CampusResourceCategory | 'all';
  onCategoryChange: (cat: CampusResourceCategory | 'all') => void;
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
  selectedCategory,
  onCategoryChange,
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
  const resourceCategories = [
    { label: 'All Resources', value: 'all' as const, icon: null },
    { label: '📚 Study Spaces', value: 'study' as const, icon: BookOpen },
    { label: '🍴 Food & Queues', value: 'food' as const, icon: Utensils },
    { label: '🏀 Sports & Courts', value: 'sports' as const, icon: Dumbbell },
  ];

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Top Row: Search + View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search rooms, innovation lab, coding pods, chef talk, turf..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-primary-container text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-tertiary transition-all font-inter"
          />
        </div>

        {/* View Switcher: Cards vs Map */}
        <div className="flex items-center p-1 rounded-xl bg-surface-container-high border border-primary-container self-start sm:self-auto">
          <button
            onClick={() => onViewChange('cards')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sora font-semibold transition-all cursor-pointer ${
              activeView === 'cards'
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Spaces Grid</span>
          </button>

          <button
            onClick={() => onViewChange('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sora font-semibold transition-all cursor-pointer ${
              activeView === 'map'
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Floor Radar</span>
          </button>
        </div>
      </div>

      {/* Purpose Resource Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {resourceCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.value
                ? 'bg-primary-container text-primary border border-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface border border-primary-container/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Secondary Filter Chips Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-inter">
        {/* Floor Switcher */}
        <select
          value={selectedFloor}
          onChange={(e) => onFloorChange(e.target.value)}
          aria-label="Filter by Campus Floor"
          className="bg-surface-container-high border border-primary-container rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-tertiary cursor-pointer font-sora font-semibold"
        >
          <option value="all">All Floors</option>
          {availableFloors.map((fl) => (
            <option key={fl} value={fl}>
              {fl}
            </option>
          ))}
        </select>

        {/* Space Type */}
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as SpaceType | 'all')}
          aria-label="Filter by Space Type"
          className="bg-surface-container-high border border-primary-container rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-tertiary cursor-pointer font-sora font-semibold"
        >
          <option value="all">All Space Types</option>
          <option value="library">Library &amp; Silent</option>
          <option value="study_room">Study &amp; Collab Pods</option>
          <option value="lab">Tech &amp; AI Labs</option>
          <option value="classroom">Amphitheaters</option>
          <option value="food_counter">Food &amp; Cafeteria</option>
          <option value="sports_court">Sports &amp; Turf</option>
        </select>

        {/* Silent Toggle */}
        <button
          onClick={() => onQuietToggle(!quietOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
            quietOnly
              ? 'bg-tertiary text-on-tertiary border-tertiary shadow-sm'
              : 'bg-surface-container-high text-on-surface-variant border-primary-container/70 hover:text-on-surface'
          }`}
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Silent Only</span>
        </button>

        {/* Charging Outlets Toggle */}
        <button
          onClick={() => onChargingToggle(!chargingOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
            chargingOnly
              ? 'bg-tertiary text-on-tertiary border-tertiary shadow-sm'
              : 'bg-surface-container-high text-on-surface-variant border-primary-container/70 hover:text-on-surface'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Power Outlets</span>
        </button>

        {/* Spacious Toggle (<50% crowd) */}
        <button
          onClick={() => onSpaciousToggle(!spaciousOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
            spaciousOnly
              ? 'bg-primary text-on-primary border-primary shadow-sm'
              : 'bg-surface-container-high text-on-surface-variant border-primary-container/70 hover:text-on-surface'
          }`}
        >
          <span>Spacious (&lt;50%)</span>
        </button>
      </div>
    </div>
  );
};
