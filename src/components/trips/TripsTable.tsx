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
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header and Toolbar */}
      <div className="p-5 border-b border-slate-200 bg-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Route className="w-4 h-4 text-indigo-600" />
              Completed Trips & Route Logs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredTrips.length} of {trips.length} tracked trips
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search location */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="trip-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search origin, destination..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* Vehicle Filter */}
            <select
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition font-medium"
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
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Origin & Destination</th>
              <th className="py-3 px-4">Distance</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Avg Speed / Max</th>
              <th className="py-3 px-4">Idling</th>
              <th className="py-3 px-4 text-right">Route Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip: Trip) => {
                const vehicle = trip.vehicle || vehicles.find(v => v.id === trip.vehicle_id);
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/80 transition">
                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {vehicle?.registration_number || 'Fleet Vehicle'}
                      </div>
                      <div className="text-[11px] text-slate-500">{vehicle?.driver_name || 'Driver'}</div>
                    </td>

                    {/* Route Corridor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <span>{trip.start_location}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{trip.end_location}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(trip.started_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(trip.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {trip.distance_km} km
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.duration_minutes} mins</span>
                      </div>
                    </td>

                    {/* Speeds */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-medium text-slate-800">{trip.average_speed} km/h</div>
                      {trip.max_speed !== null && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          Max: {trip.max_speed} km/h
                        </div>
                      )}
                    </td>

                    {/* Idling */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {trip.idle_minutes > 5 ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-medium">
                          {trip.idle_minutes}m idle
                        </span>
                      ) : (
                        <span>{trip.idle_minutes}m</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectTripRoute(trip)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm transition cursor-pointer inline-flex items-center gap-1.5"
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
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Route className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">No trips found matching the criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
