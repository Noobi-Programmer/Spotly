-- ==============================================================================
-- Spotly (Campus Availability & Booking Engine) - Production Supabase Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS public.sports_bookings CASCADE;
DROP TABLE IF EXISTS public.seat_bookings CASCADE;
DROP TABLE IF EXISTS public.occupancy_logs CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;

-- 3. Create Locations Table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    campus_id TEXT NOT NULL DEFAULT 'sst_bangalore',
    category TEXT NOT NULL CHECK (category IN ('study', 'food', 'sports')),
    building TEXT NOT NULL,
    floor TEXT NOT NULL DEFAULT 'Ground Floor',
    floor_level INT NOT NULL DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('library', 'study_room', 'lab', 'classroom', 'cafeteria', 'food_counter', 'sports_court', 'lounge')),
    description TEXT,
    capacity INT NOT NULL CHECK (capacity > 0),
    current_occupancy INT NOT NULL DEFAULT 0 CHECK (current_occupancy >= 0),
    table_count INT NOT NULL DEFAULT 10,
    is_quiet BOOLEAN NOT NULL DEFAULT false,
    has_charging BOOLEAN NOT NULL DEFAULT true,
    has_fast_wifi BOOLEAN NOT NULL DEFAULT true,
    noise_level TEXT NOT NULL DEFAULT 'moderate' CHECK (noise_level IN ('silent', 'quiet', 'moderate', 'lively')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    coordinates_x INT NOT NULL DEFAULT 500,
    coordinates_y INT NOT NULL DEFAULT 250,
    distance_minutes INT NOT NULL DEFAULT 2,
    trend TEXT NOT NULL DEFAULT 'steady' CHECK (trend IN ('getting_busier', 'clearing_up', 'steady')),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'moderate', 'full', 'unavailable')),
    wait_time_minutes INT,
    mess_provider TEXT CHECK (mess_provider IN ('Cheftalk', 'The Craving Brew')),
    meal_type TEXT,
    equipment_items JSONB DEFAULT '[]',
    best_time_to_go TEXT,
    peak_hours TEXT,
    report_count INT NOT NULL DEFAULT 8,
    last_reported_minutes_ago INT NOT NULL DEFAULT 2,
    confidence TEXT NOT NULL DEFAULT 'high' CHECK (confidence IN ('high', 'medium', 'low')),
    hourly_traffic JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Seat Bookings Table (BookMyShow-Style Serialized Seat Reservation)
CREATE TABLE public.seat_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_floor TEXT NOT NULL,
    table_number INT NOT NULL,
    seat_number TEXT NOT NULL, -- e.g. 'T2-S3'
    user_email TEXT NOT NULL DEFAULT 'sst-student@scaler.com',
    duration_hours INT NOT NULL DEFAULT 2,
    is_active BOOLEAN NOT NULL DEFAULT true,
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Sports Facility & Gear Bookings Table
CREATE TABLE public.sports_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    court_slot TEXT NOT NULL, -- e.g. 'Full 5v5 Turf Pitch'
    gear_items JSONB DEFAULT '[]', -- e.g. ['2x Footballs', '1x Cricket Kit']
    duration_minutes INT NOT NULL DEFAULT 45,
    user_email TEXT NOT NULL DEFAULT 'sst-student@scaler.com',
    is_active BOOLEAN NOT NULL DEFAULT true,
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '45 minutes'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Space Watch Alerts Table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_session_id TEXT NOT NULL,
    user_email TEXT,
    location_id TEXT NOT NULL,
    threshold_percentage INT NOT NULL CHECK (threshold_percentage BETWEEN 5 AND 95),
    is_active BOOLEAN NOT NULL DEFAULT true,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Occupancy Logs Table
CREATE TABLE public.occupancy_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_code TEXT NOT NULL,
    occupancy_count INT NOT NULL,
    occupancy_percentage INT NOT NULL,
    source TEXT NOT NULL DEFAULT 'live_report' CHECK (source IN ('simulator', 'crowd_report', 'wifi_ap', 'iot_sensor', 'live_report')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Indexes for Ultra-Fast Query Execution
CREATE INDEX idx_locations_category ON public.locations(category);
CREATE INDEX idx_locations_floor ON public.locations(floor);
CREATE INDEX idx_seat_bookings_active ON public.seat_bookings(location_id, seat_number, is_active) WHERE is_active = true;
CREATE INDEX idx_sports_bookings_active ON public.sports_bookings(location_id, is_active) WHERE is_active = true;
CREATE INDEX idx_alerts_active ON public.alerts(location_id, is_active) WHERE is_active = true;

-- 9. Realtime Publication Setup for Instant Multi-Device Sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seat_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sports_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occupancy_logs ENABLE ROW LEVEL SECURITY;

-- 11. Open Access Policies for Spotly Student Campus Experience
CREATE POLICY "Allow public read access to locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Allow public update access to locations" ON public.locations FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to seat bookings" ON public.seat_bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert to seat bookings" ON public.seat_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to seat bookings" ON public.seat_bookings FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to sports bookings" ON public.sports_bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert to sports bookings" ON public.sports_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to sports bookings" ON public.sports_bookings FOR UPDATE USING (true);

CREATE POLICY "Allow public all access to alerts" ON public.alerts FOR ALL USING (true);
CREATE POLICY "Allow public all access to occupancy logs" ON public.occupancy_logs FOR ALL USING (true);
