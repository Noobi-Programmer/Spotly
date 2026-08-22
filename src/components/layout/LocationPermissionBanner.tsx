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
      <div className="mb-4 px-4 py-2.5 rounded-xl bg-surface-container border border-primary-container flex items-center justify-between text-xs text-primary animate-in fade-in">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong className="font-sora">Location active:</strong> Showing verified walking distances from your current spot.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
          aria-label="Dismiss location banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (locationPermissionState === 'denied') {
    return (
      <div className="mb-4 px-4 py-2.5 rounded-xl bg-surface-container-high border border-primary-container/60 flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-tertiary shrink-0" />
          <span>Location isn&apos;t available. You can still explore and watch campus spaces.</span>
        </div>
        <button
          onClick={requestLocation}
          className="text-xs text-tertiary hover:underline font-sora font-semibold ml-2 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-surface-container-high border border-primary-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-tertiary-container text-tertiary shrink-0 mt-0.5 sm:mt-0">
          <Navigation className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-sora text-xs font-bold text-on-surface">Enable Nearby Study Sorting</h4>
          <p className="font-inter text-[11px] text-on-surface-variant">
            Use your location to show available study spaces and labs closest to where you are right now.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          Skip
        </button>
        <button
          onClick={requestLocation}
          disabled={isRequestingLocation}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{isRequestingLocation ? 'Locating...' : 'Allow Location'}</span>
        </button>
      </div>
    </div>
  );
};
