import React, { useState, useEffect } from 'react';
import type { Vehicle, Trip, VehicleStatus } from '../../types/fleet';
import { fleetService } from '../../services/fleetService';
import { VehicleHeroIcon, getVehicleMetadata } from '../../utils/vehicleIcons';
import {
  X,
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
  const meta = getVehicleMetadata(vehicle.model, vehicle.battery_level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(8px)' }}>
      <div className="rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 bg-white border border-slate-200">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm shrink-0 bg-white border border-slate-200"
              >
                <VehicleHeroIcon model={vehicle.model} batteryLevel={vehicle.battery_level} size={34} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {vehicle.registration_number}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                      vehicle.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : vehicle.status === 'idle'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : vehicle.status === 'maintenance'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${vehicle.status === 'active' ? 'bg-emerald-500 animate-pulse' : vehicle.status === 'idle' ? 'bg-amber-500' : vehicle.status === 'maintenance' ? 'bg-orange-500' : 'bg-slate-400'}`} />
                    {vehicle.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${meta.badgeBg}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{vehicle.model}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status update alert banner */}
          {statusMessage && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Telematics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Ignition */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                Ignition State
              </div>
              <div className="text-sm font-bold flex items-center gap-1.5 text-slate-900">
                <span
                  className={`w-2 h-2 rounded-full ${
                    vehicle.ignition_on ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                {vehicle.ignition_on ? 'RUNNING' : 'STANDBY'}
              </div>
            </div>

            {/* Fuel Level */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                Fuel Reserve
              </div>
              <div className={`text-sm font-bold font-mono ${isLowFuel ? 'text-rose-600' : 'text-slate-900'}`}>
                {vehicle.fuel_level}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    isLowFuel ? 'bg-rose-500' : vehicle.fuel_level < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${vehicle.fuel_level}%` }}
                />
              </div>
            </div>

            {/* Battery Level (EV) */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
                EV Battery
              </div>
              <div className="text-sm font-bold font-mono text-slate-900">
                {vehicle.battery_level !== null ? `${vehicle.battery_level}%` : 'N/A (ICE)'}
              </div>
              {vehicle.battery_level !== null && (
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${vehicle.battery_level}%` }}
                  />
                </div>
              )}
            </div>

            {/* Assigned Driver */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Driver
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate">{vehicle.driver_name}</div>
            </div>
          </div>

          {/* Location & GPS Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">Current GPS Coordinates</div>
                <div className="text-xs font-mono text-slate-600 font-medium mt-0.5">
                  Lat: {vehicle.latitude.toFixed(6)} | Lng: {vehicle.longitude.toFixed(6)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Last Telemetry Ping: {new Date(vehicle.last_seen).toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLocateOnMap(vehicle);
                onClose();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              Locate on Live Map
            </button>
          </div>

          {/* Operational Status Control */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Update Dispatch & Operational Status
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Changing status updates the vehicle in the central fleet telematics database and refreshes active dispatch routes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['active', 'idle', 'maintenance', 'offline'] as VehicleStatus[]).map(st => (
                <button
                  key={st}
                  disabled={isUpdatingStatus}
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                    vehicle.status === st
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Route className="w-4 h-4 text-indigo-600" />
                Recent Trip Logs ({trips.length})
              </h3>
            </div>

            {loadingTrips ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading trips...</div>
            ) : trips.length > 0 ? (
              <div className="space-y-2">
                {trips.map((trip: Trip) => (
                  <div
                    key={trip.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 hover:bg-slate-100/50 transition"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {trip.start_location} → {trip.end_location}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1">
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
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <Route className="w-3 h-3" />
                        Plot Route
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
                No recent trips logged for this vehicle.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
