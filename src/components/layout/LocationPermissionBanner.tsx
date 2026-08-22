'use client';

import React, { useState } from 'react';
import { useCampusStore } from '@/lib/store/useCampusStore';
import { GeolocationPermissionState, UserCoordinates } from '@/lib/utils/geolocation';
import { MapPin, Navigation, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface LocationPermissionBannerProps {
  userCoordinates?: UserCoordinates | null;
  locationPermissionState?: GeolocationPermissionState;
  isRequestingLocation?: boolean;
  onRequestLocation?: () => void;
}

export const LocationPermissionBanner: React.FC<LocationPermissionBannerProps> = (props) => {
  const store = useCampusStore();
  const userCoordinates = props.userCoordinates !== undefined ? props.userCoordinates : store.userCoordinates;
  const locationPermissionState = props.locationPermissionState || store.locationPermissionState;
  const isRequestingLocation = props.isRequestingLocation !== undefined ? props.isRequestingLocation : store.isRequestingLocation;
  const onRequestLocation = props.onRequestLocation || store.requestLocation;

  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (locationPermissionState === 'granted' && userCoordinates) {
    return (
      <div className="mb-4 px-4 py-2.5 rounded-2xl bg-surface-container border border-primary-container flex items-center justify-between text-xs text-primary animate-in fade-in">
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
      <div className="mb-4 px-4 py-2.5 rounded-2xl bg-surface-container border border-surface-variant flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-outline shrink-0" />
          <span>
            Location access off. Using campus center defaults for walking distances.
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

  return (
    <div className="mb-4 px-4 py-3 rounded-2xl bg-surface-container border border-primary-container/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-on-surface">
      <div className="flex items-center gap-2.5">
        <Navigation className="w-4 h-4 text-tertiary shrink-0 animate-pulse" />
        <span>
          Enable location to auto-sort closest rooms and live walking distances.
        </span>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={() => onRequestLocation()}
          disabled={isRequestingLocation}
          className="px-3.5 py-1.5 rounded-xl bg-tertiary hover:bg-tertiary-fixed text-on-tertiary font-sora font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isRequestingLocation ? 'Locating...' : 'Enable GPS'}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
          aria-label="Dismiss location banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
