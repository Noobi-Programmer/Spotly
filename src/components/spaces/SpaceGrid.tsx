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
  highlightedId?: string | null;
  onResetFilters: () => void;
  userCoordinates?: UserCoordinates | null;
}

export const SpaceGrid: React.FC<SpaceGridProps> = ({
  locations,
  onSelect,
  onNotify,
  highlightedId,
  onResetFilters,
  userCoordinates,
}) => {
  if (locations.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center glass-panel border border-slate-800 flex flex-col items-center justify-center gap-3 my-8">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">No matching campus spaces found</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Try loosening your filter criteria or search query to find other available rooms.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {locations.map((loc) => (
        <SpaceCard
          key={loc.id}
          location={loc}
          onSelect={onSelect}
          onNotify={onNotify}
          highlighted={highlightedId === loc.id}
          userCoordinates={userCoordinates}
        />
      ))}
    </div>
  );
};
