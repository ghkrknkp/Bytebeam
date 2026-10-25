-- ==============================================================================
-- BYTEBEAM FLEET MANAGEMENT DASHBOARD - SEED DATA
-- Idempotent, production-quality seed dataset featuring 10+ vehicles,
-- multiple trips per vehicle, and GPS route waypoints along realistic corridors.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED VEHICLES
-- Fixed UUIDs ensure re-running the script is idempotent without duplicates.
-- ------------------------------------------------------------------------------
INSERT INTO public.vehicles (id, registration_number, model, driver_name, status, latitude, longitude, fuel_level, battery_level, ignition_on, last_seen)
VALUES
    ('a1111111-1111-4111-8111-111111111111', 'KA-01-MJ-4021', 'Tata Ace Gold EV', 'Rajesh Sharma', 'active', 12.9352, 77.6245, 82.50, 94.00, true, now() - INTERVAL '2 minutes'),
    ('a2222222-2222-4222-8222-222222222222', 'KA-03-AB-9812', 'Mahindra Bolero Maxi Truck', 'Vikram Singh', 'active', 12.9716, 77.5946, 68.00, NULL, true, now() - INTERVAL '5 minutes'),
    ('a3333333-3333-4333-8333-333333333333', 'KA-04-GH-1190', 'Ashok Leyland BADA DOST', 'Anand Kumar', 'idle', 12.8452, 77.6602, 45.20, NULL, false, now() - INTERVAL '15 minutes'),
    ('a4444444-4444-4444-8444-444444444444', 'KA-51-EF-3345', 'Eicher Pro 2049', 'Suresh Reddy', 'active', 12.9915, 77.6874, 91.00, NULL, true, now() - INTERVAL '1 minute'),
    ('a5555555-5555-4555-8555-555555555555', 'KA-05-PQ-7721', 'Tata Ultra T.7 Electric', 'Arun Patel', 'active', 13.0358, 77.5970, 74.00, 88.00, true, now() - INTERVAL '3 minutes'),
    ('a6666666-6666-4666-8666-666666666666', 'KA-53-KL-5509', 'BharatBenz 1217C', 'Manoj Gowda', 'maintenance', 12.9128, 77.6092, 18.50, NULL, false, now() - INTERVAL '2 hours'),
    ('a7777777-7777-4777-8777-777777777777', 'KA-02-TR-8833', 'Mahindra Treo Zor EV', 'Deepak Verma', 'active', 12.9279, 77.6271, 55.00, 62.00, true, now() - INTERVAL '4 minutes'),
    ('a8888888-8888-4888-8888-888888888888', 'KA-04-NM-1204', 'Force Urbania Cargo', 'Kavitha Nair', 'idle', 12.9784, 77.6408, 38.00, NULL, false, now() - INTERVAL '40 minutes'),
    ('a9999999-9999-4999-8999-999999999999', 'KA-50-ZX-6641', 'Tata 407 Gold SFC', 'Praveen Joshi', 'offline', 13.0901, 77.5812, 12.00, NULL, false, now() - INTERVAL '1 day'),
    ('baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'KA-01-HH-9023', 'Ashok Leyland Dost+', 'Santosh Hegde', 'active', 12.9569, 77.7011, 85.00, NULL, true, now() - INTERVAL '6 minutes'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'KA-03-CV-4419', 'Piaggio Ape E-Xtra', 'Ramesh Yadav', 'idle', 12.9165, 77.6101, 24.00, 31.00, false, now() - INTERVAL '25 minutes'),
    ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'KA-51-MM-8102', 'Isuzu D-Max V-Cross Commercial', 'Ganesh Murthy', 'maintenance', 12.9698, 77.7500, 9.00, NULL, false, now() - INTERVAL '5 hours')
ON CONFLICT (id) DO UPDATE SET
    registration_number = EXCLUDED.registration_number,
    model = EXCLUDED.model,
    driver_name = EXCLUDED.driver_name,
    status = EXCLUDED.status,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    fuel_level = EXCLUDED.fuel_level,
    battery_level = EXCLUDED.battery_level,
    ignition_on = EXCLUDED.ignition_on,
    last_seen = EXCLUDED.last_seen;

-- ------------------------------------------------------------------------------
-- 2. SEED TRIPS
-- ------------------------------------------------------------------------------
INSERT INTO public.trips (id, vehicle_id, start_location, end_location, distance_km, duration_minutes, average_speed, max_speed, idle_minutes, started_at, ended_at)
VALUES
    -- Trips for KA-01-MJ-4021 (Tata Ace Gold EV)
    ('d1111111-1111-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', 'Electronic City Hub', 'Koramangala 5th Block', 14.80, 42, 21.14, 48.50, 6, now() - INTERVAL '3 hours', now() - INTERVAL '2 hours 18 minutes'),
    ('d1111111-1111-4111-8111-111111111112', 'a1111111-1111-4111-8111-111111111111', 'Koramangala 5th Block', 'Indiranagar 100ft Rd', 8.20, 26, 18.92, 42.00, 4, now() - INTERVAL '1 hour 40 minutes', now() - INTERVAL '1 hour 14 minutes'),

    -- Trips for KA-03-AB-9812 (Mahindra Bolero)
    ('d2222222-2222-4222-8222-222222222221', 'a2222222-2222-4222-8222-222222222222', 'Peenya Industrial Area', 'Majestic Bus Stand', 12.50, 38, 19.74, 52.00, 8, now() - INTERVAL '5 hours', now() - INTERVAL '4 hours 22 minutes'),
    ('d2222222-2222-4222-8222-222222222222', 'a2222222-2222-4222-8222-222222222222', 'Majestic Bus Stand', 'MG Road Metro Station', 5.60, 20, 16.80, 38.00, 3, now() - INTERVAL '3 hours 10 minutes', now() - INTERVAL '2 hours 50 minutes'),

    -- Trips for KA-51-EF-3345 (Eicher Pro)
    ('d4444444-4444-4444-8444-444444444441', 'a4444444-4444-4444-8444-444444444444', 'Whitefield ITPL Gate', 'Marathahalli Bridge', 9.40, 28, 20.14, 55.00, 5, now() - INTERVAL '6 hours', now() - INTERVAL '5 hours 32 minutes'),
    ('d4444444-4444-4444-8444-444444444442', 'a4444444-4444-4444-8444-444444444444', 'Marathahalli Bridge', 'Bellandur EcoSpace', 6.80, 22, 18.55, 46.00, 3, now() - INTERVAL '4 hours', now() - INTERVAL '3 hours 38 minutes'),

    -- Trips for KA-05-PQ-7721 (Tata Ultra Electric)
    ('d5555555-5555-4555-8555-555555555551', 'a5555555-5555-4555-8555-555555555555', 'Hebbal Flyover Depot', 'Manyata Tech Park', 7.50, 24, 18.75, 45.00, 4, now() - INTERVAL '7 hours', now() - INTERVAL '6 hours 36 minutes'),
    ('d5555555-5555-4555-8555-555555555552', 'a5555555-5555-4555-8555-555555555555', 'Manyata Tech Park', 'Yelahanka Satellite Town', 11.20, 32, 21.00, 58.00, 2, now() - INTERVAL '2 hours 15 minutes', now() - INTERVAL '1 hour 43 minutes'),

    -- Trip for KA-02-TR-8833 (Mahindra Treo)
    ('d7777777-7777-4777-8777-777777777771', 'a7777777-7777-4777-8777-777777777777', 'Jayanagar 4th Block', 'BTM Layout 2nd Stage', 4.50, 16, 16.88, 35.00, 2, now() - INTERVAL '4 hours 30 minutes', now() - INTERVAL '4 hours 14 minutes'),

    -- Trip for KA-01-HH-9023 (Ashok Leyland)
    ('daaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Sarjapur Wipro Circle', 'Bellandur Central Mall', 10.30, 35, 17.65, 48.00, 7, now() - INTERVAL '8 hours', now() - INTERVAL '7 hours 25 minutes')
ON CONFLICT (id) DO UPDATE SET
    start_location = EXCLUDED.start_location,
    end_location = EXCLUDED.end_location,
    distance_km = EXCLUDED.distance_km,
    duration_minutes = EXCLUDED.duration_minutes,
    average_speed = EXCLUDED.average_speed,
    max_speed = EXCLUDED.max_speed,
    idle_minutes = EXCLUDED.idle_minutes,
    started_at = EXCLUDED.started_at,
    ended_at = EXCLUDED.ended_at;

-- ------------------------------------------------------------------------------
-- 3. SEED TRIP POINTS (Detailed GPS Waypoints for Route Drawing)
-- ------------------------------------------------------------------------------
-- Trip 1 (Electronic City Hub -> Koramangala 5th Block)
INSERT INTO public.trip_points (id, trip_id, latitude, longitude, recorded_at, sequence_number)
VALUES
    ('f1111111-0001-4111-8111-111111111111', 'd1111111-1111-4111-8111-111111111111', 12.8452, 77.6602, now() - INTERVAL '3 hours', 1),
    ('f1111111-0002-4111-8111-111111111111', 'd1111111-1111-4111-8111-111111111111', 12.8590, 77.6570, now() - INTERVAL '2 hours 55 minutes', 2),
    ('f1111111-0003-4111-8111-111111111111', 'd1111111-1111-4111-8111-111111111111', 12.8821, 77.6492, now() - INTERVAL '2 hours 47 minutes', 3),
    ('f1111111-0004-4111-8111-111111111111', 'd1111111-1111-4111-8111-111111111111', 12.9056, 77.6401, now() - INTERVAL '2 hours 39 minutes', 4),
    ('f1111111-0005-4111-8111-111111111111', 'd1111111-1111-4111-8111-111111111111', 12.9189, 77.6322, now() - INTERVAL '2 hours 31 minutes', 5),
    ('f1111111-0006-4111-8111-111111111111', 'd1111111-1111-4111-8111-111111111111', 12.9275, 77.6280, now() - INTERVAL '2 hours 24 minutes', 6),
    ('f1111111-0007-4111-8111-111111111111', 'd1111111-1111-4111-8111-111111111111', 12.9352, 77.6245, now() - INTERVAL '2 hours 18 minutes', 7),

    -- Trip 2 (Koramangala 5th Block -> Indiranagar 100ft Rd)
    ('f1111111-0008-4111-8111-111111111112', 'd1111111-1111-4111-8111-111111111112', 12.9352, 77.6245, now() - INTERVAL '1 hour 40 minutes', 1),
    ('f1111111-0009-4111-8111-111111111112', 'd1111111-1111-4111-8111-111111111112', 12.9460, 77.6310, now() - INTERVAL '1 hour 34 minutes', 2),
    ('f1111111-0010-4111-8111-111111111112', 'd1111111-1111-4111-8111-111111111112', 12.9580, 77.6385, now() - INTERVAL '1 hour 27 minutes', 3),
    ('f1111111-0011-4111-8111-111111111112', 'd1111111-1111-4111-8111-111111111112', 12.9710, 77.6412, now() - INTERVAL '1 hour 20 minutes', 4),
    ('f1111111-0012-4111-8111-111111111112', 'd1111111-1111-4111-8111-111111111112', 12.9784, 77.6408, now() - INTERVAL '1 hour 14 minutes', 5),

    -- Trip 3 (Peenya Industrial Area -> Majestic)
    ('f2222222-0001-4222-8222-222222222221', 'd2222222-2222-4222-8222-222222222221', 13.0310, 77.5255, now() - INTERVAL '5 hours', 1),
    ('f2222222-0002-4222-8222-222222222221', 'd2222222-2222-4222-8222-222222222221', 13.0180, 77.5412, now() - INTERVAL '4 hours 50 minutes', 2),
    ('f2222222-0003-4222-8222-222222222221', 'd2222222-2222-4222-8222-222222222221', 12.9980, 77.5620, now() - INTERVAL '4 hours 40 minutes', 3),
    ('f2222222-0004-4222-8222-222222222221', 'd2222222-2222-4222-8222-222222222221', 12.9840, 77.5750, now() - INTERVAL '4 hours 30 minutes', 4),
    ('f2222222-0005-4222-8222-222222222221', 'd2222222-2222-4222-8222-222222222221', 12.9765, 77.5729, now() - INTERVAL '4 hours 22 minutes', 5),

    -- Trip 4 (Whitefield ITPL -> Marathahalli)
    ('f4444444-0001-4444-8444-444444444441', 'd4444444-4444-4444-8444-444444444441', 12.9860, 77.7310, now() - INTERVAL '6 hours', 1),
    ('f4444444-0002-4444-8444-444444444441', 'd4444444-4444-4444-8444-444444444441', 12.9780, 77.7210, now() - INTERVAL '5 hours 52 minutes', 2),
    ('f4444444-0003-4444-8444-444444444441', 'd4444444-4444-4444-8444-444444444441', 12.9690, 77.7120, now() - INTERVAL '5 hours 44 minutes', 3),
    ('f4444444-0004-4444-8444-444444444441', 'd4444444-4444-4444-8444-444444444441', 12.9560, 77.7011, now() - INTERVAL '5 hours 32 minutes', 4)
ON CONFLICT (id) DO UPDATE SET
    trip_id = EXCLUDED.trip_id,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    recorded_at = EXCLUDED.recorded_at,
    sequence_number = EXCLUDED.sequence_number;
