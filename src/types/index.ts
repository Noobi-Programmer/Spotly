export type SpaceType = 'library' | 'study_room' | 'lab' | 'cafeteria' | 'lounge' | 'classroom';

export type NoiseLevel = 'silent' | 'quiet' | 'moderate' | 'lively';

export type OccupancyTier = 'low' | 'moderate' | 'high' | 'full';

export type CampusId = 'sst_bangalore' | 'sst_20acre_new';

export interface CampusLocation {
  id: string;
  code: string;
  name: string;
  campus_id: CampusId;
  building: string;
  floor: string; // e.g. 'Basement', 'Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3', 'Rooftop'
  floor_level: number;
  type: SpaceType;
  description: string;
  capacity: number;
  current_occupancy: number;
  is_quiet: boolean;
  has_charging: boolean;
  has_fast_wifi: boolean;
  noise_level: NoiseLevel;
  latitude: number;
  longitude: number;
  coordinates_x: number; // 0 - 1000 for SVG map
  coordinates_y: number; // 0 - 1000 for SVG map
  distance_minutes: number;
  image?: string;
  status?: 'available' | 'moderate' | 'full' | 'unavailable';
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  study?: boolean;
  quiet?: boolean;
  charging?: boolean;
  wifi?: boolean;
  low_crowd?: boolean;
  nearby?: boolean;
  type?: SpaceType | 'all';
  max_distance?: number; // minutes
  floor?: string | 'all';
}

export interface RecommendationResult {
  location: CampusLocation;
  matchScore: number; // 0 - 100%
  reasons: string[];
  crowdStatus: 'low' | 'moderate' | 'high' | 'full';
  occupancyPercentage: number;
  availableSeats: number;
  isAvailable: boolean; // false if occupancy >= capacity
}

export interface SpaceWatch {
  id: string;
  user_session_id: string;
  location_id: string;
  location_name: string;
  location_floor?: string;
  location_building?: string;
  threshold_percentage: number; // e.g. 70, 50, 30, or 0 (available)
  is_active: boolean;
  triggered_at?: string | null;
  created_at?: string;
}

// Backward compatibility alias
export type SpaceAlert = SpaceWatch;

export interface OccupancyLog {
  id: string;
  location_id: string;
  occupancy_count: number;
  occupancy_percentage: number;
  source: 'simulator' | 'student_report' | 'wifi_ap' | 'iot_sensor';
  recorded_at: string;
}
