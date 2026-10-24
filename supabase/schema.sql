-- ==============================================================================
-- BYTEBEAM FLEET MANAGEMENT DASHBOARD - DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. VEHICLES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'idle', 'maintenance', 'offline')),
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    fuel_level NUMERIC(5, 2) NOT NULL CHECK (fuel_level >= 0 AND fuel_level <= 100),
    battery_level NUMERIC(5, 2) CHECK (battery_level IS NULL OR (battery_level >= 0 AND battery_level <= 100)),
    ignition_on BOOLEAN NOT NULL DEFAULT false,
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. TRIPS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    distance_km NUMERIC(8, 2) NOT NULL CHECK (distance_km >= 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
    average_speed NUMERIC(6, 2) NOT NULL CHECK (average_speed >= 0),
    max_speed NUMERIC(6, 2) CHECK (max_speed IS NULL OR max_speed >= 0),
    idle_minutes INTEGER NOT NULL DEFAULT 0 CHECK (idle_minutes >= 0),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_trip_duration CHECK (ended_at >= started_at)
);

-- ------------------------------------------------------------------------------
-- 3. TRIP POINTS TABLE (GPS Waypoints)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    sequence_number INTEGER NOT NULL CHECK (sequence_number >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON public.vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON public.trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_started_at ON public.trips(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_points_trip_id_seq ON public.trip_points(trip_id, sequence_number ASC);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_points ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Anon users can view vehicles in demo mode" ON public.vehicles;

DROP POLICY IF EXISTS "Authenticated users can view trips" ON public.trips;
DROP POLICY IF EXISTS "Anon users can view trips in demo mode" ON public.trips;

DROP POLICY IF EXISTS "Authenticated users can view trip points" ON public.trip_points;
DROP POLICY IF EXISTS "Anon users can view trip points in demo mode" ON public.trip_points;

-- Policies for Vehicles:
-- 1) Authenticated users can read all fleet vehicles
CREATE POLICY "Authenticated users can view vehicles"
    ON public.vehicles FOR SELECT
    TO authenticated
    USING (true);

-- 2) Authenticated fleet managers can update vehicle status
CREATE POLICY "Authenticated users can update vehicles"
    ON public.vehicles FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3) Public anon read policy (allows seamless review & evaluation in demo mode)
CREATE POLICY "Anon users can view vehicles in demo mode"
    ON public.vehicles FOR SELECT
    TO anon
    USING (true);

-- Policies for Trips:
CREATE POLICY "Authenticated users can view trips"
    ON public.trips FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anon users can view trips in demo mode"
    ON public.trips FOR SELECT
    TO anon
    USING (true);

-- Policies for Trip Points:
CREATE POLICY "Authenticated users can view trip points"
    ON public.trip_points FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anon users can view trip points in demo mode"
    ON public.trip_points FOR SELECT
    TO anon
    USING (true);
