export type SpaceType = 'library' | 'study_room' | 'lab' | 'cafeteria' | 'lounge';

export type NoiseLevel = 'silent' | 'quiet' | 'moderate' | 'lively';

export interface CampusLocation {
  id: string;
  code: string;
  name: string;
  building: string;
  floor: string;
  type: SpaceType;
  description: string;
  capacity: number;
  current_occupancy: number;
  is_quiet: boolean;
  has_charging: boolean;
  has_fast_wifi: boolean;
  noise_level: NoiseLevel;
  coordinates_x: number; // 0 - 1000 for SVG map
  coordinates_y: number; // 0 - 1000 for SVG map
  distance_minutes: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  quiet?: boolean;
  charging?: boolean;
  wifi?: boolean;
  low_crowd?: boolean;
  type?: SpaceType | 'all';
  max_distance?: number; // minutes
}

export interface RecommendationResult {
  location: CampusLocation;
  matchScore: number; // 0 - 100%
  reasons: string[];
  crowdStatus: 'spacious' | 'moderate' | 'full';
  occupancyPercentage: number;
}

export interface SpaceAlert {
  id: string;
  user_session_id: string;
  location_id: string;
  location_name?: string;
  threshold_percentage: number;
  is_active: boolean;
  triggered_at?: string | null;
  created_at?: string;
}

export interface OccupancyLog {
  id: string;
  location_id: string;
  occupancy_count: number;
  occupancy_percentage: number;
  source: 'simulator' | 'crowd_report' | 'wifi_ap' | 'iot_sensor';
  recorded_at: string;
}
