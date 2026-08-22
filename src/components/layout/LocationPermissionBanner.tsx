'use client';

import React from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { MapPin, Navigation, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const LocationPermissionBanner: React.FC = () => {
  const {
    userCoordinates,
    locationPermissionState,
    isRequestingLocation,
    requestLocation,
  } = useCampusStore();

  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  if (locationPermissionState === 'granted' && userCoordinates) {
    return (
      <div className="mb-4 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Location active:</strong> Showing verified walking distances from your current spot.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-emerald-400/60 hover:text-emerald-300 p-1"
          aria-label="Dismiss location banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (locationPermissionState === 'denied') {
    return (
      <div className="mb-4 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Location isn&apos;t available. You can still explore and watch campus spaces.</span>
        </div>
        <button
          onClick={requestLocation}
          className="text-xs text-emerald-400 hover:underline font-semibold ml-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
          <Navigation className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Enable Nearby Space Sorting</h4>
          <p className="text-[11px] text-slate-400">
            Use your location to show available study spaces and labs closest to where you are right now.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          Skip
        </button>
        <button
          onClick={requestLocation}
          disabled={isRequestingLocation}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{isRequestingLocation ? 'Locating...' : 'Allow Location'}</span>
        </button>
      </div>
    </div>
  );
};
