export type CampusResourceCategory = 'study' | 'food' | 'sports';

export type SpaceType =
  | 'library'
  | 'study_room'
  | 'lab'
  | 'cafeteria'
  | 'lounge'
  | 'classroom'
  | 'sports_court'
  | 'food_counter';

export type NoiseLevel = 'silent' | 'quiet' | 'moderate' | 'lively';

export type OccupancyTier = 'low' | 'moderate' | 'high' | 'full';

export type CrowdTrend = 'getting_busier' | 'clearing_up' | 'steady';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type CampusId = 'sst_bangalore' | 'sst_20acre_new';

export interface HourlyTrafficPoint {
  hour: string; // e.g. '8 AM', '12 PM'
  hourNum: number; // 8 to 22
  occupancyPercentage: number; // 0 to 100
  isCurrentHour?: boolean;
}

export interface SeatInfo {
  id: string; // e.g. 'T1-S1'
  serial_number: string; // e.g. 'T1-S1'
  table_number: number;
  seat_index: number;
  is_occupied: boolean;
  booked_by_user?: boolean;
}

export interface SeatBooking {
  id: string;
  ticket_code: string; // e.g. 'SPT-8942-SST'
  location_id: string;
  location_name: string;
  location_floor: string;
  location_building?: string;
  seat_number: string;
  table_number: number;
  user_name?: string;
  user_email?: string;
  booked_at: string;
  booked_timestamp: number; // for real-time second-by-second countdown
  expires_in_minutes: number;
  status: 'active' | 'expired' | 'cancelled';
  qr_data?: string;
}

export interface CampusLocation {
  id: string;
  code: string;
  name: string;
  campus_id: CampusId;
  category: CampusResourceCategory;
  building: string;
  floor: string; // 'Upper Basement' | 'Ground Floor' | 'Floor 1' | 'Floor 2'
  floor_level: number; // -1 for Upper Basement, 0 for Ground, 1 for Floor 1, 2 for Floor 2
  type: SpaceType;
  description: string;
  capacity: number;
  current_occupancy: number;
  table_count?: number; // Number of tables in the room
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
  
  // P1 Intelligence Signals
  trend: CrowdTrend;
  best_time_to_go?: string;
  peak_hours?: string;
  report_count: number;
  last_reported_minutes_ago: number;
  confidence: ConfidenceLevel;
  hourly_traffic?: HourlyTrafficPoint[]; // 8 AM to 10 PM traffic pattern

  // P2 Resource extensions (Food & Sports)
  wait_time_minutes?: number; // e.g. 4 for Chef Talk
  mess_provider?: 'Cheftalk' | 'The Craving Brew' | 'Uniworld';
  meal_type?: 'Daily Mess Meal' | 'Veg' | 'Non-Veg' | 'Jain' | 'Alternate Mess Meal' | 'Special Thali & Meals' | 'Uniworld Student Meal';
  equipment_items?: { name: string; available: number; total: number }[];

  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  category?: CampusResourceCategory | 'all';
  study?: boolean;
  quiet?: boolean;
  charging?: boolean;
  wifi?: boolean;
  low_crowd?: boolean;
  nearby?: boolean;
  type?: SpaceType | 'all';
  max_distance?: number; // minutes
  floor?: string | 'all';
  food_preference?: 'all' | 'cheftalk' | 'jain' | 'uniworld' | 'craving_brew';
  fast_queue_only?: boolean;
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
