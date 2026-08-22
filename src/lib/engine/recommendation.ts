import { CampusLocation, UserPreferences, RecommendationResult } from '@/types';

/**
 * Deterministic scoring engine that runs locally in < 1ms without LLM dependencies.
 * Returns sorted recommendations with human-readable explainability bullets.
 */
export function rankSpaces(
  locations: CampusLocation[],
  preferences: UserPreferences
): RecommendationResult[] {
  const results: RecommendationResult[] = locations.map((loc) => {
    const occPct = Math.round((loc.current_occupancy / Math.max(1, loc.capacity)) * 100);
    const occRatio = loc.current_occupancy / Math.max(1, loc.capacity);
    const reasons: string[] = [];

    // Filter out if specific type was explicitly selected
    if (preferences.type && preferences.type !== 'all' && loc.type !== preferences.type) {
      return {
        location: loc,
        matchScore: 0,
        reasons: [`Different space type (${loc.type})`],
        crowdStatus: getCrowdStatus(occPct),
        occupancyPercentage: occPct,
      };
    }

    let score = 20; // Base score

    // 1. Crowd scoring (Max 35 pts)
    if (preferences.low_crowd) {
      const crowdScore = Math.round(35 * Math.max(0, 1 - occRatio));
      score += crowdScore;
      if (occPct <= 40) {
        reasons.push(`Low crowd right now (${occPct}% full, ${loc.capacity - loc.current_occupancy} seats free)`);
      } else if (occPct >= 80) {
        reasons.push(`Currently crowded (${occPct}% full)`);
      }
    } else {
      score += Math.round(15 * Math.max(0, 1 - occRatio));
    }

    // 2. Quiet scoring (Max 25 pts)
    if (preferences.quiet) {
      if (loc.is_quiet) {
        score += 25;
        reasons.push(`Quiet zone verified (${loc.noise_level} environment)`);
      } else {
        score -= 15;
      }
    } else if (loc.is_quiet) {
      score += 10;
    }

    // 3. Charging outlet scoring (Max 20 pts)
    if (preferences.charging) {
      if (loc.has_charging) {
        score += 20;
        reasons.push('Power charging stations at desks');
      } else {
        score -= 10;
      }
    }

    // 4. Wi-Fi scoring (Max 15 pts)
    if (preferences.wifi) {
      if (loc.has_fast_wifi) {
        score += 15;
        reasons.push('High-speed Wi-Fi available');
      }
    }

    // 5. Distance scoring (Penalty if far)
    if (preferences.max_distance !== undefined) {
      if (loc.distance_minutes <= preferences.max_distance) {
        score += 10;
        reasons.push(`Quick walk (${loc.distance_minutes} min away)`);
      } else {
        const excess = loc.distance_minutes - preferences.max_distance;
        score -= Math.min(20, excess * 4);
      }
    } else {
      score += Math.max(0, 10 - loc.distance_minutes);
      if (loc.distance_minutes <= 3) {
        reasons.push(`Nearby (${loc.distance_minutes} min away)`);
      }
    }

    // If no specific reasons were generated yet, add fallback status
    if (reasons.length === 0) {
      reasons.push(`${loc.capacity - loc.current_occupancy} seats open out of ${loc.capacity}`);
    }

    // Clamp score between 5% and 99%
    const finalScore = Math.min(99, Math.max(5, Math.round(score)));

    return {
      location: loc,
      matchScore: finalScore,
      reasons,
      crowdStatus: getCrowdStatus(occPct),
      occupancyPercentage: occPct,
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function getCrowdStatus(percentage: number): 'spacious' | 'moderate' | 'full' {
  if (percentage < 40) return 'spacious';
  if (percentage < 75) return 'moderate';
  return 'full';
}

export function getCrowdColor(percentage: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hex: string;
} {
  if (percentage < 40) {
    return {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      hex: '#10b981',
    };
  }
  if (percentage < 75) {
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
