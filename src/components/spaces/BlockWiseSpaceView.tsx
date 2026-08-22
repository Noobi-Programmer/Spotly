'use client';

import React from 'react';
import { CampusLocation, CampusResourceCategory } from '@/types';
import { SpaceCard } from './SpaceCard';
import { SST_FLOOR_ORDER } from '@/lib/supabase/seed-data';
import {
  BookOpen,
  UtensilsCrossed,
  Trophy,
  Building,
  Layers,
  Sparkles,
  Navigation,
  Armchair,
  CheckCircle2,
} from 'lucide-react';
import { UserCoordinates } from '@/lib/utils/geolocation';

interface BlockWiseSpaceViewProps {
  locations: CampusLocation[];
  selectedCategory: CampusResourceCategory | 'all';
  onSelectCategory: (cat: CampusResourceCategory | 'all') => void;
  onSelectLocation: (loc: CampusLocation) => void;
  onNotify: (loc: CampusLocation) => void;
  onBookSeat: (loc: CampusLocation) => void;
  highlightedId?: string | null;
  userCoordinates?: UserCoordinates | null;
}

export const BlockWiseSpaceView: React.FC<BlockWiseSpaceViewProps> = ({
  locations,
  selectedCategory,
  onSelectCategory,
  onSelectLocation,
  onNotify,
  onBookSeat,
  highlightedId,
  userCoordinates,
}) => {
  const intentPillars = [
    {
      id: 'study' as const,
      title: 'Study & Code',
      subtitle: 'Quiet labs, coding pods & reading rooms',
      icon: BookOpen,
      count: locations.filter((l) => l.category === 'study').length,
      badgeColor: 'bg-primary-container text-primary border-primary',
    },
    {
      id: 'food' as const,
      title: 'Eat & Mess',
      subtitle: 'Cheftalk, Jain counter & Craving Brew',
      icon: UtensilsCrossed,
      count: locations.filter((l) => l.category === 'food').length,
      badgeColor: 'bg-tertiary-container text-tertiary border-tertiary',
    },
    {
      id: 'sports' as const,
      title: 'Sports & Games',
      subtitle: 'Football turf, basketball, badminton & TT',
      icon: Trophy,
      count: locations.filter((l) => l.category === 'sports').length,
      badgeColor: 'bg-secondary-container text-secondary border-secondary',
    },
  ];

  // Filter locations by intent category if selected
  const activeLocations =
    selectedCategory === 'all'
      ? locations
      : locations.filter((l) => l.category === selectedCategory);

  // Group active locations Block-Wise and Floor-Wise
  const blocksMap = new Map<string, { blockTitle: string; subtitle: string; floor: string; items: CampusLocation[] }>();

  // Defined Spatial Blocks
  const blockDefinitions = [
    {
      key: 'Floor 2',
      title: 'Main Academic Block — 2nd Floor (Sprint Labs)',
      subtitle: 'Classrooms 2A, 2B, 2C with tiered tables and dual whiteboards',
      floor: 'Floor 2',
    },
    {
      key: 'Floor 1',
      title: 'Main Academic Block — 1st Floor (Innovation & Deep Work)',
      subtitle: 'Block B Innovation Lab, acoustic reading room & shaded terrace',
      floor: 'Floor 1',
    },
    {
      key: 'Ground Floor Academic',
      title: 'Main Academic Block — Ground Floor (Lectures & Study)',
      subtitle: 'Ground tech classroom & focus reading area',
      floor: 'Ground Floor',
      category: 'study',
    },
    {
      key: 'Upper Basement',
      title: 'Upper Basement — Student Mess & Recreation',
      subtitle: 'Cheftalk Main, Jain counter, The Craving Brew & indoor games',
      floor: 'Upper Basement',
    },
    {
      key: 'Ground Floor Sports',
      title: 'Outdoor Sports Zone — Ground Level',
      subtitle: 'Synthetic football turf, badminton court & basketball hardcourt',
      floor: 'Ground Floor',
      category: 'sports',
    },
  ];

  blockDefinitions.forEach((b) => {
    const items = activeLocations.filter((l) => {
      if (b.category && l.category !== b.category) return false;
      if (l.floor !== b.floor) return false;
      return true;
    });

    if (items.length > 0) {
      blocksMap.set(b.key, {
        blockTitle: b.title,
        subtitle: b.subtitle,
        floor: b.floor,
        items,
      });
    }
  });

  return (
    <div className="flex flex-col gap-8 mb-12">
      {/* 1. INTENT SELECTOR HERO: "What do you want to do right now?" */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-high border-2 border-primary-container shadow-2xl flex flex-col gap-5">
        <div>
          <span className="text-[11px] font-sora font-bold uppercase tracking-widest text-primary font-mono block mb-1">
            STEP 1 • CHOOSE YOUR INTENT
          </span>
          <h2 className="font-sora text-xl sm:text-3xl font-bold text-on-surface tracking-tight">
            What do you want to do right now?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant font-inter mt-1">
            Pick your activity to see real-time seats and table availability organized block by block.
          </p>
        </div>

        {/* 3 Large Intent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {intentPillars.map((intent) => {
            const Icon = intent.icon;
            const isSelected = selectedCategory === intent.id;

            return (
              <button
                key={intent.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : intent.id)}
                className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-primary-container/80 border-primary text-primary shadow-xl shadow-primary/15 ring-2 ring-primary'
                    : 'bg-surface-container hover:bg-surface-bright border-primary-container/70 text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-variant text-on-surface'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                      isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high text-on-surface border-primary-container'
                    }`}
                  >
                    {intent.count} Spaces
                  </span>
                </div>

                <div>
                  <h3 className="font-sora text-base sm:text-lg font-bold text-on-surface mb-0.5">
                    {intent.title}
                  </h3>
                  <p className="font-inter text-xs text-on-surface-variant leading-relaxed">
                    {intent.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedCategory !== 'all' && (
          <div className="flex items-center justify-between pt-1 border-t border-surface-variant text-xs text-on-surface-variant font-inter">
            <span>
              Showing <strong className="text-on-surface font-semibold">{activeLocations.length} spaces</strong> filtered by {selectedCategory}.
            </span>
            <button
              onClick={() => onSelectCategory('all')}
              className="text-primary hover:underline font-sora font-semibold cursor-pointer"
            >
              Show All Campus Blocks
            </button>
          </div>
        )}
      </div>

      {/* 2. BLOCK-WISE SPATIAL GRID: Clear Sectional Presentation */}
      <div className="flex flex-col gap-10">
        {Array.from(blocksMap.values()).map((block) => (
          <div
            key={block.blockTitle}
            className="rounded-3xl bg-surface-container-lowest/40 border border-primary-container/60 p-5 sm:p-7 flex flex-col gap-5 shadow-lg"
          >
            {/* Block Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-variant pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-tertiary" />
                  <h3 className="font-sora text-base sm:text-xl font-bold text-on-surface">
                    {block.blockTitle}
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant font-inter mt-0.5">
                  {block.subtitle}
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-primary bg-primary-container/40 px-3 py-1 rounded-xl border border-primary-container self-start sm:self-auto">
                {block.items.length} {block.items.length === 1 ? 'Space' : 'Spaces'} on {block.floor}
              </span>
            </div>

            {/* Room Cards in this Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {block.items.map((loc) => (
                <SpaceCard
                  key={loc.id}
                  location={loc}
                  onSelect={onSelectLocation}
                  onNotify={onNotify}
                  onBookSeat={onBookSeat}
                  highlighted={highlightedId === loc.id}
                  userCoordinates={userCoordinates}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
