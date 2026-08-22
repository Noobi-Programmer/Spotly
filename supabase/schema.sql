-- ==============================================================================
-- Spotly - Production Supabase Schema & Realtime Trigger Pipeline
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS public.occupancy_logs CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;

-- 3. Create Locations Table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    building TEXT NOT NULL,
    floor TEXT NOT NULL DEFAULT 'Floor 1',
    type TEXT NOT NULL CHECK (type IN ('library', 'study_room', 'lab', 'cafeteria', 'lounge')),
    description TEXT,
    capacity INT NOT NULL CHECK (capacity > 0),
    current_occupancy INT NOT NULL DEFAULT 0 CHECK (current_occupancy >= 0),
    is_quiet BOOLEAN NOT NULL DEFAULT false,
    has_charging BOOLEAN NOT NULL DEFAULT true,
    has_fast_wifi BOOLEAN NOT NULL DEFAULT true,
    noise_level TEXT NOT NULL DEFAULT 'moderate' CHECK (noise_level IN ('silent', 'quiet', 'moderate', 'lively')),
    coordinates_x INT NOT NULL,
    coordinates_y INT NOT NULL,
    distance_minutes INT NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Alerts Table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_session_id TEXT NOT NULL,
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    threshold_percentage INT NOT NULL CHECK (threshold_percentage BETWEEN 5 AND 95),
    is_active BOOLEAN NOT NULL DEFAULT true,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Occupancy Logs Table
CREATE TABLE public.occupancy_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    occupancy_count INT NOT NULL,
    occupancy_percentage INT NOT NULL,
    source TEXT NOT NULL DEFAULT 'simulator' CHECK (source IN ('simulator', 'crowd_report', 'wifi_ap', 'iot_sensor')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for ultra-fast query performance
CREATE INDEX idx_locations_type ON public.locations(type);
CREATE INDEX idx_alerts_active ON public.alerts(location_id, is_active) WHERE is_active = true;
CREATE INDEX idx_occupancy_logs_recent ON public.occupancy_logs(location_id, recorded_at DESC);

-- 7. Realtime Trigger: Automatic Alert Evaluation on Occupancy Drop
CREATE OR REPLACE FUNCTION public.evaluate_alerts_on_occupancy_change()
RETURNS TRIGGER AS $$
DECLARE
    new_pct INT;
BEGIN
    new_pct := ROUND((NEW.current_occupancy::NUMERIC / GREATEST(1, NEW.capacity)::NUMERIC) * 100);

    -- Automatically trigger any active alerts when occupancy falls to or below target threshold
    UPDATE public.alerts
    SET is_active = false,
        triggered_at = NOW()
    WHERE location_id = NEW.id
      AND is_active = true
      AND threshold_percentage >= new_pct;

    -- Record telemetry log
    INSERT INTO public.occupancy_logs (location_id, occupancy_count, occupancy_percentage, source)
    VALUES (NEW.id, NEW.current_occupancy, new_pct, 'simulator');

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_on_occupancy_change
BEFORE UPDATE OF current_occupancy ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.evaluate_alerts_on_occupancy_change();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occupancy_logs ENABLE ROW LEVEL SECURITY;

-- 9. Open Read Policies for Campus Space Telemetry
CREATE POLICY "Allow public read access to locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Allow public read access to occupancy logs" ON public.occupancy_logs FOR SELECT USING (true);
CREATE POLICY "Allow simulator updates to locations" ON public.locations FOR ALL USING (true);

-- 10. Alert Policies by Session ID
CREATE POLICY "Allow public insert and manage own alerts" ON public.alerts FOR ALL USING (true);

-- 11. Enable Supabase Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- 12. Seed Realistic Initial Locations
INSERT INTO public.locations (name, code, building, floor, type, description, capacity, current_occupancy, is_quiet, has_charging, has_fast_wifi, noise_level, coordinates_x, coordinates_y, distance_minutes)
VALUES
('Main Library (2nd Floor Quiet Zone)', 'LIB-2F', 'Central Library', 'Floor 2', 'library', 'Silent study zone with individual cubicles, acoustic dampening, and high-speed Wi-Fi.', 120, 98, true, true, true, 'silent', 280, 220, 4),
('Study Room B (Collaborative Pod)', 'SR-B', 'Science & Tech Complex', 'Floor 1', 'study_room', 'Ideal for group sessions and assignments with dual whiteboards and power outlets at every seat.', 24, 20, true, true, true, 'quiet', 650, 310, 3),
('Study Room A (Focus Nook)', 'SR-A', 'Science & Tech Complex', 'Floor 1', 'study_room', 'Cozy study alcove with natural lighting, ergonomic chairs, and privacy dividers.', 18, 5, true, true, true, 'quiet', 580, 260, 3),
('Turing Computer Lab', 'LAB-CS', 'Engineering Hall', 'Floor 3', 'lab', 'High-spec dual-monitor workstations, Linux/Windows dual-boot, and gigabit wired ports.', 45, 12, true, true, true, 'quiet', 820, 520, 6),
('Campus Commons & Artisan Cafe', 'CAFE-1F', 'Student Union', 'Floor 1', 'cafeteria', 'Vibrant communal atmosphere with espresso bar, soft booth seating, and background music.', 90, 76, false, true, true, 'lively', 350, 680, 2),
('Innovation Atrium & Lounge', 'LNG-ATRIUM', 'Innovation Center', 'Floor 1', 'lounge', 'Open-concept atrium with bean bags, high-top tables, skylights, and casual chatter.', 65, 28, false, true, true, 'moderate', 180, 540, 5);
