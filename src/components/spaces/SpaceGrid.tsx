'use client';

import React from 'react';
import { CampusLocation } from '@/types';
import { SpaceCard } from './SpaceCard';
import { SearchX } from 'lucide-react';
import { UserCoordinates } from '@/lib/utils/geolocation';

interface SpaceGridProps {
  locations: CampusLocation[];
  onSelect: (location: CampusLocation) => void;
  onNotify: (location: CampusLocation) => void;
  onBookSeat?: (location: CampusLocation) => void;
  highlightedId?: string | null;
  onResetFilters: () => void;
  userCoordinates?: UserCoordinates | null;
}

export const SpaceGrid: React.FC<SpaceGridProps> = ({
  locations,
  onSelect,
  onNotify,
  onBookSeat,
  highlightedId,
  onResetFilters,
  userCoordinates,
}) => {
  if (locations.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center bg-surface-container border border-primary-container flex flex-col items-center justify-center gap-3 my-8">
        <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-outline">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="font-sora text-base font-bold text-on-surface">No matching campus spaces found</h3>
        <p className="font-inter text-xs text-on-surface-variant max-w-sm">
          Try loosening your filter criteria or search query to find other available rooms.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-2 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-sora font-semibold text-primary transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((loc) => (
        <SpaceCard
          key={loc.id}
          location={loc}
          onSelect={onSelect}
          onNotify={onNotify}
          onBookSeat={onBookSeat}
          highlighted={highlightedId === loc.id}
          userCoordinates={userCoordinates}
        />
      ))}
    </div>
  );
};
