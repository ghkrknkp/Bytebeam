import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Vehicle, Trip, TripPoint, FleetStats, FleetAlert, VehicleStatus, TripFilters } from '../types/fleet';
import { INITIAL_VEHICLES, INITIAL_TRIPS, INITIAL_TRIP_POINTS, INITIAL_ALERTS } from '../lib/demoData';

// Local cache for mutations during session (supports demo mode & instant updates)
let localVehicles: Vehicle[] = [...INITIAL_VEHICLES];
let localTrips: Trip[] = [...INITIAL_TRIPS];

export const fleetService = {
  /**
   * Fetch all vehicles with optional caching & fallback
   */
  async getVehicles(): Promise<{ data: Vehicle[]; error: string | null; isLive: boolean }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('registration_number', { ascending: true });

        if (error) {
          console.warn('Supabase query error, falling back to local dataset:', error.message);
          return { data: localVehicles, error: error.message, isLive: false };
        }

        if (data && data.length > 0) {
          // Cast and merge
          const vehicles: Vehicle[] = data.map((v: any) => ({
            ...v,
            latitude: Number(v.latitude),
            longitude: Number(v.longitude),
            fuel_level: Number(v.fuel_level),
            battery_level: v.battery_level !== null ? Number(v.battery_level) : null,
          }));
          localVehicles = vehicles;
          return { data: vehicles, error: null, isLive: true };
        }
      } catch (err: any) {
        console.warn('Supabase connection failed:', err);
        return { data: localVehicles, error: err.message || 'Connection failed', isLive: false };
      }
    }

    // Default to seeded dataset
    return { data: localVehicles, error: null, isLive: false };
  },

  /**
   * Update vehicle status
   */
  async updateVehicleStatus(vehicleId: string, status: VehicleStatus): Promise<{ success: boolean; error: string | null }> {
    // Update local cache immediately for responsive UI
    localVehicles = localVehicles.map(v => (v.id === vehicleId ? { ...v, status, last_seen: new Date().toISOString() } : v));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('vehicles')
          .update({ status, last_seen: new Date().toISOString() })
          .eq('id', vehicleId);

        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to update vehicle' };
      }
    }

    return { success: true, error: null };
  },

  /**
   * Fetch trips with optional filters
   */
  async getTrips(filters?: TripFilters): Promise<{ data: Trip[]; error: string | null }> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('trips')
          .select('*, vehicles(*)')
          .order('started_at', { ascending: false });

        if (filters?.vehicleId) {
          query = query.eq('vehicle_id', filters.vehicleId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          const trips: Trip[] = data.map((t: any) => ({
            id: t.id,
            vehicle_id: t.vehicle_id,
            start_location: t.start_location,
            end_location: t.end_location,
            distance_km: Number(t.distance_km),
            duration_minutes: Number(t.duration_minutes),
            average_speed: Number(t.average_speed),
            max_speed: t.max_speed !== null ? Number(t.max_speed) : null,
            idle_minutes: Number(t.idle_minutes || 0),
            started_at: t.started_at,
            ended_at: t.ended_at,
            vehicle: t.vehicles
              ? {
                  ...t.vehicles,
                  latitude: Number(t.vehicles.latitude),
                  longitude: Number(t.vehicles.longitude),
                  fuel_level: Number(t.vehicles.fuel_level),
                  battery_level: t.vehicles.battery_level !== null ? Number(t.vehicles.battery_level) : null,
                }
              : undefined,
          }));
          localTrips = trips;
          return { data: trips, error: null };
        }
      } catch (err: any) {
        console.warn('Supabase trips query error:', err);
      }
    }

    // Filter local trips
    let filtered = [...localTrips];
    if (filters?.vehicleId) {
      filtered = filtered.filter(t => t.vehicle_id === filters.vehicleId);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        t => t.start_location.toLowerCase().includes(q) || t.end_location.toLowerCase().includes(q)
      );
    }

    // Enrich with vehicle data from localVehicles
    filtered = filtered.map(t => ({
      ...t,
      vehicle: localVehicles.find(v => v.id === t.vehicle_id),
    }));

    return { data: filtered, error: null };
  },

  /**
   * Fetch GPS route points for a specific trip
   */
  async getTripPoints(tripId: string): Promise<{ data: TripPoint[]; error: string | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('trip_points')
          .select('*')
          .eq('trip_id', tripId)
          .order('sequence_number', { ascending: true });

        if (!error && data && data.length > 0) {
          const points: TripPoint[] = data.map((p: any) => ({
            id: p.id,
            trip_id: p.trip_id,
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
            recorded_at: p.recorded_at,
            sequence_number: Number(p.sequence_number),
          }));
          return { data: points, error: null };
        }
      } catch (err: any) {
        console.warn('Failed to load live route points:', err);
      }
    }

    // Fallback to local points
    const points = INITIAL_TRIP_POINTS[tripId] || [];
    return { data: points, error: null };
  },

  /**
   * Compute fleet-wide operational KPIs
   */
  calculateStats(vehicles: Vehicle[], trips: Trip[]): FleetStats {
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    const idleVehicles = vehicles.filter(v => v.status === 'idle').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
    const offlineVehicles = vehicles.filter(v => v.status === 'offline').length;

    // Attention required: maintenance, offline, or fuel < 20%
    const attentionRequiredCount = vehicles.filter(
      v => v.status === 'maintenance' || v.status === 'offline' || v.fuel_level < 20
    ).length;

    const totalDistanceKm = trips.reduce((acc, t) => acc + (t.distance_km || 0), 0);
    const avgFleetFuel =
      totalVehicles > 0
        ? Math.round(vehicles.reduce((acc, v) => acc + (v.fuel_level || 0), 0) / totalVehicles)
        : 0;

    return {
      totalVehicles,
      activeVehicles,
      idleVehicles,
      maintenanceVehicles,
      offlineVehicles,
      attentionRequiredCount,
      completedTrips: trips.length,
      avgFleetFuel,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    };
  },

  /**
   * Generate real-time alerts dynamically based on vehicle metrics
   */
  getAlerts(vehicles: Vehicle[]): FleetAlert[] {
    const alerts: FleetAlert[] = [...INITIAL_ALERTS];

    // Check for critical fuel (< 15%)
    vehicles.forEach(v => {
      if (v.fuel_level < 15 && !alerts.some(a => a.vehicleId === v.id && a.type === 'low_fuel')) {
        alerts.push({
          id: `dyn-fuel-${v.id}`,
          vehicleId: v.id,
          registrationNumber: v.registration_number,
          type: 'low_fuel',
          severity: 'critical',
          title: `Low Fuel Level (${v.fuel_level}%)`,
          message: `${v.model} (${v.registration_number}) driver ${v.driver_name} requires immediate refueling.`,
          timestamp: 'Just now',
        });
      }
    });

    return alerts;
  },
};
