import React, { useState, useEffect } from 'react';
import type { Vehicle, Trip, VehicleStatus } from '../../types/fleet';
import { fleetService } from '../../services/fleetService';
import {
  X,
  Truck,
  User,
  Fuel,
  Battery,
  MapPin,
  Radio,
  CheckCircle,
  Route,
  Navigation,
  ShieldCheck,
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onLocateOnMap: (vehicle: Vehicle) => void;
  onVehicleUpdated: (updatedVehicle: Vehicle) => void;
  onSelectTripRoute?: (trip: Trip) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onLocateOnMap,
  onVehicleUpdated,
  onSelectTripRoute,
}) => {
  if (!vehicle) return null;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVehicleTrips = async () => {
      setLoadingTrips(true);
      const res = await fleetService.getTrips({ vehicleId: vehicle.id });
      if (isMounted) {
        setTrips(res.data);
        setLoadingTrips(false);
      }
    };
    fetchVehicleTrips();
    return () => {
      isMounted = false;
    };
  }, [vehicle.id]);

  const handleStatusChange = async (newStatus: VehicleStatus) => {
    if (newStatus === vehicle.status) return;
    setIsUpdatingStatus(true);
    setStatusMessage(null);

    const res = await fleetService.updateVehicleStatus(vehicle.id, newStatus);
    setIsUpdatingStatus(false);

    if (res.success) {
      const updated = { ...vehicle, status: newStatus };
      onVehicleUpdated(updated);
      setStatusMessage(`Status updated to ${newStatus}`);
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setStatusMessage(`Failed: ${res.error}`);
    }
  };

  const isLowFuel = vehicle.fuel_level < 20;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                  {vehicle.registration_number}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    vehicle.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : vehicle.status === 'idle'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : vehicle.status === 'maintenance'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{vehicle.model}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status update alert banner */}
          {statusMessage && (
            <div className="p-3 bg-indigo-950/80 border border-indigo-700/60 rounded-xl text-xs text-indigo-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Telematics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Ignition */}
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Radio className="w-3.5 h-3.5 text-slate-500" />
                Ignition State
              </div>
              <div className="text-sm font-bold flex items-center gap-1.5 text-white">
                <span
                  className={`w-2 h-2 rounded-full ${
                    vehicle.ignition_on ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                {vehicle.ignition_on ? 'RUNNING' : 'STANDBY'}
              </div>
            </div>

            {/* Fuel Level */}
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                Fuel Reserve
              </div>
              <div className={`text-sm font-bold font-mono ${isLowFuel ? 'text-rose-400' : 'text-white'}`}>
                {vehicle.fuel_level}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    isLowFuel ? 'bg-rose-500' : vehicle.fuel_level < 50 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${vehicle.fuel_level}%` }}
                />
              </div>
            </div>

            {/* Battery Level (EV) */}
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
                EV Battery
              </div>
              <div className="text-sm font-bold font-mono text-white">
                {vehicle.battery_level !== null ? `${vehicle.battery_level}%` : 'N/A (ICE)'}
              </div>
              {vehicle.battery_level !== null && (
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${vehicle.battery_level}%` }}
                  />
                </div>
              )}
            </div>

            {/* Assigned Driver */}
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Driver
              </div>
              <div className="text-sm font-semibold text-white truncate">{vehicle.driver_name}</div>
            </div>
          </div>

          {/* Location & GPS Info */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Current GPS Coordinates</div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Lat: {vehicle.latitude.toFixed(6)} | Lng: {vehicle.longitude.toFixed(6)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Last Telemetry Ping: {new Date(vehicle.last_seen).toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLocateOnMap(vehicle);
                onClose();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              Locate on Live Map
            </button>
          </div>

          {/* Operational Status Control */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Update Dispatch & Operational Status
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Changing status updates the vehicle in Supabase PostgreSQL and refreshes active dispatch routes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['active', 'idle', 'maintenance', 'offline'] as VehicleStatus[]).map(st => (
                <button
                  key={st}
                  disabled={isUpdatingStatus}
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                    vehicle.status === st
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Trip History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Route className="w-4 h-4 text-indigo-400" />
                Recent Trip Logs ({trips.length})
              </h3>
            </div>

            {loadingTrips ? (
              <div className="py-6 text-center text-xs text-slate-500">Loading trips...</div>
            ) : trips.length > 0 ? (
              <div className="space-y-2">
                {trips.map((trip: Trip) => (
                  <div
                    key={trip.id}
                    className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {trip.start_location} → {trip.end_location}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                        <span>Distance: {trip.distance_km} km</span>
                        <span>•</span>
                        <span>Duration: {trip.duration_minutes} mins</span>
                        <span>•</span>
                        <span>Avg Speed: {trip.average_speed} km/h</span>
                      </div>
                    </div>

                    {onSelectTripRoute && (
                      <button
                        onClick={() => {
                          onSelectTripRoute(trip);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <Route className="w-3 h-3" />
                        Plot Route
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-950/40 rounded-xl text-center text-xs text-slate-500 border border-slate-800">
                No recent trips logged for this vehicle.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
