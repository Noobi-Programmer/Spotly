/**
 * Privacy-Preserving Session-Level Geolocation Utility
 * - One-shot location request (no background tracking, no continuous polling)
 * - Ephemeral session coordinates (never stored in permanent databases)
 * - Computes real-time walking distance via Haversine formula
 */

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type GeolocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

// Reference coordinate: Scaler School of Technology (SST), Electronic City Phase 1, Bangalore
export const SST_CAMPUS_COORDS = {
  latitude: 12.8452,
  longitude: 77.6602,
};

/**
 * Calculates distance in meters between two lat/lng pairs using the Haversine formula.
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Converts distance in meters to approximate walking minutes (average 80m / min).
 */
export function metersToWalkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

/**
 * Requests one-shot browser geolocation.
 */
export function requestSessionLocation(): Promise<{
  coordinates: UserCoordinates | null;
  state: GeolocationPermissionState;
  error?: string;
}> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({
        coordinates: null,
        state: 'unavailable',
        error: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          state: 'granted',
        });
      },
      (error) => {
        resolve({
          coordinates: null,
          state: error.code === 1 ? 'denied' : 'unavailable',
          error: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000, // Allow 1-minute cache
      }
    );
  });
}
