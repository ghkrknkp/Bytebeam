import React, { useState, useMemo } from 'react';
import type { Trip, Vehicle } from '../../types/fleet';
import {
  Route,
  Search,
  Clock,
  ArrowRight,
  Navigation,
} from 'lucide-react';

interface TripsTableProps {
  trips: Trip[];
  vehicles: Vehicle[];
  onSelectTripRoute: (trip: Trip) => void;
}

export const TripsTable: React.FC<TripsTableProps> = ({
  trips,
  vehicles,
  onSelectTripRoute,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      if (selectedVehicleId !== 'all' && trip.vehicle_id !== selectedVehicleId) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchStart = trip.start_location.toLowerCase().includes(q);
        const matchEnd = trip.end_location.toLowerCase().includes(q);
        const matchVehicle = trip.vehicle?.registration_number.toLowerCase().includes(q);
        if (!matchStart && !matchEnd && !matchVehicle) return false;
      }
      return true;
    });
  }, [trips, selectedVehicleId, searchQuery]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header and Toolbar */}
      <div className="p-5 border-b border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-indigo-400" />
              Completed Trips & Route Logs
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredTrips.length} of {trips.length} tracked trips
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search location */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="trip-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search origin, destination..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Vehicle Filter */}
            <select
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Fleet Vehicles</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.registration_number} ({v.model.slice(0, 15)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Origin & Destination</th>
              <th className="py-3 px-4">Distance</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Avg Speed / Max</th>
              <th className="py-3 px-4">Idling</th>
              <th className="py-3 px-4 text-right">Route Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip: Trip) => {
                const vehicle = trip.vehicle || vehicles.find(v => v.id === trip.vehicle_id);
                return (
                  <tr key={trip.id} className="hover:bg-slate-800/40 transition">
                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white text-xs">
                        {vehicle?.registration_number || 'Fleet Vehicle'}
                      </div>
                      <div className="text-[11px] text-slate-400">{vehicle?.driver_name || 'Driver'}</div>
                    </td>

                    {/* Route Corridor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-slate-200 font-medium">
                        <span>{trip.start_location}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{trip.end_location}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(trip.started_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(trip.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-300">
                      {trip.distance_km} km
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{trip.duration_minutes} mins</span>
                      </div>
                    </td>

                    {/* Speeds */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-200">{trip.average_speed} km/h</div>
                      {trip.max_speed !== null && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Max: {trip.max_speed} km/h
                        </div>
                      )}
                    </td>

                    {/* Idling */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {trip.idle_minutes > 5 ? (
                        <span className="text-amber-400 font-medium">{trip.idle_minutes}m idle</span>
                      ) : (
                        <span>{trip.idle_minutes}m</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectTripRoute(trip)}
                        className="px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white font-medium text-xs rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Plot GPS Route
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <Route className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No trips found matching the criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
