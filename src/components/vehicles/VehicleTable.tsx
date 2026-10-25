import React, { useState, useMemo } from 'react';
import type { Vehicle, VehicleStatus, VehicleFilters } from '../../types/fleet';
import { VehicleTypeIcon } from '../../utils/vehicleIcons';
import {
  Search,
  ArrowUpDown,
  Truck,
  Fuel,
  Battery,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onTrackOnMap: (vehicle: Vehicle) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onSelectVehicle,
  onTrackOnMap,
}) => {
  const [filters, setFilters] = useState<VehicleFilters>({
    searchQuery: '',
    status: 'all',
    fuelFilter: 'all',
    sortBy: 'last_seen',
    sortOrder: 'desc',
  });

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchReg = v.registration_number.toLowerCase().includes(q);
          const matchModel = v.model.toLowerCase().includes(q);
          const matchDriver = v.driver_name.toLowerCase().includes(q);
          if (!matchReg && !matchModel && !matchDriver) return false;
        }

        // Status filter
        if (filters.status !== 'all' && v.status !== filters.status) {
          return false;
        }

        // Fuel filter
        if (filters.fuelFilter === 'critical' && v.fuel_level >= 20) return false;
        if (filters.fuelFilter === 'low' && (v.fuel_level < 20 || v.fuel_level >= 50)) return false;
        if (filters.fuelFilter === 'good' && v.fuel_level < 50) return false;

        return true;
      })
      .sort((a, b) => {
        let valA: any = (a as any)[filters.sortBy];
        let valB: any = (b as any)[filters.sortBy];

        if (filters.sortBy === 'last_seen') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (filters.sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [vehicles, filters]);

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'idle':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Idle
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-600/20 text-orange-400 border border-orange-600/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Maintenance
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-600/20 text-slate-400 border border-slate-600/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Offline
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-400" />
              Fleet Vehicles Registry
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredVehicles.length} of {vehicles.length} tracked units
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="vehicle-search-input"
              type="text"
              value={filters.searchQuery}
              onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search registration, driver, model..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Badges and Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'active', 'idle', 'maintenance', 'offline'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilters({ ...filters, status: st })}
                className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer font-medium ${
                  filters.status === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Fuel Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Fuel className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filters.fuelFilter}
                onChange={e => setFilters({ ...filters, fuelFilter: e.target.value as any })}
                className="bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Fuel Levels</option>
                <option value="critical">&lt; 20% (Critical)</option>
                <option value="low">20% - 49% (Low)</option>
                <option value="good">&gt; 50% (Adequate)</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={e => {
                  const [sortBy, sortOrder] = e.target.value.split('-') as [any, any];
                  setFilters({ ...filters, sortBy, sortOrder });
                }}
                className="bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="last_seen-desc">Latest Activity</option>
                <option value="fuel_level-asc">Fuel: Lowest First</option>
                <option value="fuel_level-desc">Fuel: Highest First</option>
                <option value="registration_number-asc">Reg: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <th className="py-3 px-4">Vehicle Details</th>
              <th className="py-3 px-4">Driver</th>
              <th className="py-3 px-4">Operational Status</th>
              <th className="py-3 px-4">Fuel & Power</th>
              <th className="py-3 px-4">Ignition</th>
              <th className="py-3 px-4">Last Seen</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map(vehicle => {
                const isCritFuel = vehicle.fuel_level < 20;
                return (
                  <tr
                    key={vehicle.id}
                    className="hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => onSelectVehicle(vehicle)}
                  >
                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 transition shadow-sm">
                          <VehicleTypeIcon model={vehicle.model} batteryLevel={vehicle.battery_level} size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono font-bold text-white text-xs group-hover:text-indigo-400 transition flex items-center gap-1.5">
                            <span>{vehicle.registration_number}</span>
                            {vehicle.battery_level !== null && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-500/30">
                                EV
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{vehicle.model}</div>
                        </div>
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {vehicle.driver_name}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(vehicle.status)}</td>

                    {/* Fuel & Battery */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCritFuel
                                ? 'bg-rose-500'
                                : vehicle.fuel_level < 50
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                            style={{ width: `${vehicle.fuel_level}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono text-xs font-medium ${
                            isCritFuel ? 'text-rose-400 font-bold' : 'text-slate-300'
                          }`}
                        >
                          {vehicle.fuel_level}%
                        </span>
                      </div>
                      {vehicle.battery_level !== null && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Battery className="w-3 h-3 text-emerald-400" />
                          <span>EV Battery: {vehicle.battery_level}%</span>
                        </div>
                      )}
                    </td>

                    {/* Ignition */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          vehicle.ignition_on ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            vehicle.ignition_on ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                        />
                        {vehicle.ignition_on ? 'Running' : 'Off'}
                      </span>
                    </td>

                    {/* Last Seen */}
                    <td className="py-3.5 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(vehicle.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onTrackOnMap(vehicle);
                          }}
                          title="Locate on Map"
                          className="p-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectVehicle(vehicle);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No vehicles match current filters</p>
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        status: 'all',
                        fuelFilter: 'all',
                        sortBy: 'last_seen',
                        sortOrder: 'desc',
                      })
                    }
                    className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
