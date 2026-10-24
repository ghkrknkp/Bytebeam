export type VehicleStatus = 'active' | 'idle' | 'maintenance' | 'offline';

export interface Vehicle {
  id: string;
  registration_number: string;
  model: string;
  driver_name: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  fuel_level: number;
  battery_level: number | null;
  ignition_on: boolean;
  last_seen: string;
  created_at?: string;
}

export interface Trip {
  id: string;
  vehicle_id: string;
  start_location: string;
  end_location: string;
  distance_km: number;
  duration_minutes: number;
  average_speed: number;
  max_speed: number | null;
  idle_minutes: number;
  started_at: string;
  ended_at: string;
  created_at?: string;
  vehicle?: Vehicle;
}

export interface TripPoint {
  id: string;
  trip_id: string;
  latitude: number;
  longitude: number;
  recorded_at: string;
  sequence_number: number;
  created_at?: string;
}

export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  maintenanceVehicles: number;
  offlineVehicles: number;
  attentionRequiredCount: number;
  completedTrips: number;
  avgFleetFuel: number;
  totalDistanceKm: number;
}

export type AlertType = 'low_fuel' | 'maintenance' | 'offline' | 'high_speed' | 'excessive_idle';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FleetAlert {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
}

export interface VehicleFilters {
  searchQuery: string;
  status: 'all' | VehicleStatus;
  fuelFilter: 'all' | 'critical' | 'low' | 'good';
  sortBy: 'last_seen' | 'fuel_level' | 'registration_number';
  sortOrder: 'asc' | 'desc';
}

export interface TripFilters {
  vehicleId?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}
