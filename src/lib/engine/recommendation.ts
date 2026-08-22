import { CampusLocation, UserPreferences, RecommendationResult, OccupancyTier } from '@/types';
import { UserCoordinates, calculateHaversineDistanceMeters, metersToWalkingMinutes } from '@/lib/utils/geolocation';

/**
 * Standardized Occupancy Tier Calculation (Prompt Section 9):
 * 0–40%  -> LOW
 * 41–70% -> MODERATE
 * 71–100% -> HIGH / FULL
 */
export function getOccupancyTier(percentage: number): OccupancyTier {
  if (percentage <= 40) return 'low';
  if (percentage <= 70) return 'moderate';
  if (percentage < 100) return 'high';
  return 'full';
}

export const getCrowdStatus = getOccupancyTier;

export function getCrowdColor(percentage: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hex: string;
} {
  if (percentage <= 40) {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      hex: '#10b981',
    };
  }
  if (percentage <= 70) {
    return {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      hex: '#f59e0b',
    };
  }
  return {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    hex: '#f43f5e',
  };
}

/**
 * Deterministic, Explainable Multi-Criteria Recommendation Engine (< 2ms)
 * - Prioritizes actual availability (Rule 11: Safety)
 * - Returns clear human-readable match reasons
 */
export function rankSpaces(
  locations: CampusLocation[],
  preferences: UserPreferences,
  userCoordinates?: UserCoordinates | null
): RecommendationResult[] {
  const results: RecommendationResult[] = locations.map((loc) => {
    const occPct = Math.round((loc.current_occupancy / Math.max(1, loc.capacity)) * 100);
    const occRatio = loc.current_occupancy / Math.max(1, loc.capacity);
    const availableSeats = Math.max(0, loc.capacity - loc.current_occupancy);
    const isAvailable = loc.current_occupancy < loc.capacity;
    const tier = getOccupancyTier(occPct);
    const reasons: string[] = [];

    // Filter out if specific space type was selected
    if (preferences.type && preferences.type !== 'all' && loc.type !== preferences.type) {
      return {
        location: loc,
        matchScore: 0,
        reasons: [`Different space type (${loc.type})`],
        crowdStatus: tier,
        occupancyPercentage: occPct,
        availableSeats,
        isAvailable,
      };
    }

    // Floor filter
    if (preferences.floor && preferences.floor !== 'all' && loc.floor !== preferences.floor) {
      return {
        location: loc,
        matchScore: 0,
        reasons: [`Located on ${loc.floor}`],
        crowdStatus: tier,
        occupancyPercentage: occPct,
        availableSeats,
        isAvailable,
      };
    }

    let score = 25; // Base score

    // 1. SAFETY: Full Space Handling (Rule 11)
    if (!isAvailable) {
      score -= 50; // Heavy penalty so full spaces do not take top recommendation
      reasons.push(`Currently full (${occPct}% occupied - 0 seats free)`);
    }

    // 2. Crowd scoring (Max 35 pts)
    if (preferences.low_crowd) {
      const crowdScore = Math.round(35 * Math.max(0, 1 - occRatio));
      score += crowdScore;
      if (occPct <= 40) {
        reasons.push(`Low crowd right now (${occPct}% occupied, ${availableSeats} seats free)`);
      } else if (occPct <= 70) {
        reasons.push(`Moderate crowd (${occPct}% occupied)`);
      }
    } else {
      score += Math.round(15 * Math.max(0, 1 - occRatio));
    }

    // 3. Quiet Environment scoring (Max 25 pts)
    if (preferences.quiet) {
      if (loc.is_quiet) {
        score += 25;
        reasons.push(`Quiet zone verified (${loc.noise_level} environment)`);
      } else {
        score -= 20;
      }
    } else if (loc.is_quiet) {
      score += 10;
    }

    // 4. Power Charging Outlet scoring (Max 20 pts)
    if (preferences.charging) {
      if (loc.has_charging) {
        score += 20;
        reasons.push('Power outlets available at desks');
      } else {
        score -= 15;
      }
    }

    // 5. Gigabit Wi-Fi scoring (Max 15 pts)
    if (preferences.wifi) {
      if (loc.has_fast_wifi) {
        score += 15;
        reasons.push('High-speed campus Wi-Fi');
      }
    }

    // 6. Proximity / Walking Distance
    let effectiveMinutes = loc.distance_minutes;
    if (userCoordinates && loc.latitude && loc.longitude) {
      const distMeters = calculateHaversineDistanceMeters(
        userCoordinates.latitude,
        userCoordinates.longitude,
        loc.latitude,
        loc.longitude
      );
      effectiveMinutes = metersToWalkingMinutes(distMeters);
    }

    if (preferences.nearby || (preferences.max_distance && preferences.max_distance <= 5)) {
      if (effectiveMinutes <= 3) {
        score += 15;
        reasons.push(`Very close (${effectiveMinutes} min walk)`);
      } else if (effectiveMinutes <= 5) {
        score += 8;
        reasons.push(`Quick walk (${effectiveMinutes} min walk)`);
      } else {
        score -= (effectiveMinutes - 5) * 3;
      }
    } else {
      score += Math.max(0, 10 - effectiveMinutes);
      if (effectiveMinutes <= 3) {
        reasons.push(`Nearby (${effectiveMinutes} min walk)`);
      }
    }

    if (reasons.length === 0 && isAvailable) {
      reasons.push(`${availableSeats} open seats out of ${loc.capacity}`);
    }

    const finalScore = isAvailable
      ? Math.min(99, Math.max(10, Math.round(score)))
      : Math.min(30, Math.max(5, Math.round(score)));

    return {
      location: loc,
      matchScore: finalScore,
      reasons,
      crowdStatus: tier,
      occupancyPercentage: occPct,
      availableSeats,
      isAvailable,
    };
  });

  // Sort descending by matchScore (available spaces naturally rank highest)
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
