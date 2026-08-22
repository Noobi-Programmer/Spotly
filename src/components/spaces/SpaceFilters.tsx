'use client';

import React from 'react';
import { SpaceType, CampusResourceCategory } from '@/types';
import {
  Search,
  VolumeX,
  Zap,
  LayoutGrid,
  Map as MapIcon,
  BookOpen,
  UtensilsCrossed,
  Trophy,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

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
    { label: 'All Campus', value: 'all' as const, icon: Layers },
    { label: 'Study Spaces', value: 'study' as const, icon: BookOpen },
    { label: 'Food & Queues', value: 'food' as const, icon: UtensilsCrossed },
    { label: 'Sports & Courts', value: 'sports' as const, icon: Trophy },
  ];

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Purpose Resource Category Selector (Doomscroll Brain: High Scan, Instant Reward) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {resourceCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => {
                onCategoryChange(cat.value);
                // When clicking a category, automatically populate or clear the search context
                if (cat.value === 'study') onSearchChange('');
                else if (cat.value === 'food') onSearchChange('');
                else if (cat.value === 'sports') onSearchChange('');
                else onSearchChange('');
              }}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 text-left cursor-pointer ${
                isSelected
                  ? 'bg-primary-container/80 border-primary text-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
                  : 'bg-surface-container hover:bg-surface-container-high border-primary-container/60 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-sora text-xs sm:text-sm font-bold block leading-tight">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-inter">
                    {cat.value === 'study'
                      ? 'Labs & Reading Rooms'
                      : cat.value === 'food'
                      ? 'Cheftalk & Craving Brew'
                      : cat.value === 'sports'
                      ? 'Turf & Hardcourts'
                      : 'All Real-time Spaces'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Top Row: Search Input + View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input with Clear Button */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search by room name, Cheftalk counter, Craving Brew, Turff ground, Block B..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container-high border border-primary-container text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-tertiary transition-all font-inter shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher: Spaces Grid vs Floor Radar */}
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

      {/* Secondary Fast Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-inter">
        {/* Floor Level Filter */}
        <select
          value={selectedFloor}
          onChange={(e) => onFloorChange(e.target.value)}
          aria-label="Filter by Floor Level"
          className="px-3 py-1.5 rounded-xl bg-surface-container border border-primary-container text-xs text-on-surface focus:outline-none cursor-pointer font-sora font-medium"
        >
          <option value="all">🏢 All Floors</option>
          {availableFloors.map((floor) => (
            <option key={floor} value={floor}>
              📍 {floor}
            </option>
          ))}
        </select>

        {/* Quiet Only Chip */}
        <button
          onClick={() => onQuietToggle(!quietOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
            quietOnly
              ? 'bg-primary-container text-primary border-primary font-bold'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-primary-container/70'
          }`}
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Silent Only</span>
        </button>

        {/* Power Charging Chip */}
        <button
          onClick={() => onChargingToggle(!chargingOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
            chargingOnly
              ? 'bg-primary-container text-primary border-primary font-bold'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-primary-container/70'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Power Plugs</span>
        </button>

        {/* Low Crowd / Spacious Only Chip */}
        <button
          onClick={() => onSpaciousToggle(!spaciousOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
            spaciousOnly
              ? 'bg-tertiary text-on-tertiary border-tertiary-fixed font-bold shadow-sm'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-primary-container/70'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spacious (&lt;50%)</span>
        </button>
      </div>
    </div>
  );
};
