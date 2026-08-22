export type SpaceType = 'library' | 'study_room' | 'lab' | 'cafeteria' | 'lounge' | 'classroom';

export type NoiseLevel = 'silent' | 'quiet' | 'moderate' | 'lively';

export type CampusId = 'sst_bangalore' | 'sst_20acre_new';

export interface CampusLocation {
  id: string;
  code: string;
  name: string;
  campus_id: CampusId;
  building: string;
  floor: string; // e.g. 'Basement', 'Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3', 'Rooftop'
  floor_level: number; // -1 for basement, 0 for ground, 1, 2, 3, 4 for rooftop
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
  floor?: string | 'all';
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
