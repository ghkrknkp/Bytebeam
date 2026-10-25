import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import type { Vehicle, Trip, FleetAlert } from '../../types/fleet';
import { AlertTriangle, Fuel, Activity, TrendingUp, Bell } from 'lucide-react';

interface FleetChartsProps {
  vehicles: Vehicle[];
  trips: Trip[];
  alerts: FleetAlert[];
  onSelectVehicleById?: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  Active: '#10b981', // emerald-500
  Idle: '#f59e0b',   // amber-500
  Maintenance: '#ea580c', // orange-600
  Offline: '#64748b', // slate-500
};

export const FleetCharts: React.FC<FleetChartsProps> = ({
  vehicles,
  trips,
  alerts,
  onSelectVehicleById,
}) => {
  // 1. Vehicle Status Breakdown data for Donut Chart
  const statusData = [
    { name: 'Active', value: vehicles.filter(v => v.status === 'active').length },
    { name: 'Idle', value: vehicles.filter(v => v.status === 'idle').length },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length },
    { name: 'Offline', value: vehicles.filter(v => v.status === 'offline').length },
  ].filter(item => item.value > 0);

  // 2. Fuel Distribution data
  const fuelRanges = [
    { range: '< 20% (Crit)', count: vehicles.filter(v => v.fuel_level < 20).length },
    { range: '20 - 49%', count: vehicles.filter(v => v.fuel_level >= 20 && v.fuel_level < 50).length },
    { range: '50 - 79%', count: vehicles.filter(v => v.fuel_level >= 50 && v.fuel_level < 80).length },
    { range: '80 - 100%', count: vehicles.filter(v => v.fuel_level >= 80).length },
  ];

  // 3. Trip Distance and Average Speed Trend
  const tripTrendData = trips
    .slice(0, 7)
    .reverse()
    .map(t => ({
      name: t.end_location.split(' ')[0],
      distance: t.distance_km,
      avgSpeed: t.average_speed,
      vehicle: t.vehicle?.registration_number || 'Fleet',
    }));

  return (
    <div className="space-y-6">
      {/* Top Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Fleet Status Distribution
            </h3>
            <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
              {vehicles.length} Units
            </span>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map(entry => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                  }}
                  itemStyle={{ color: '#0f172a' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">{vehicles.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</span>
            </div>
          </div>

          {/* Custom Status Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.name] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Level Distribution Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-500" />
              Fuel Reserve Spread
            </h3>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-semibold font-mono">
              Telemetry
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelRanges} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                  }}
                  cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Vehicles" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Critical threshold alert (&lt;20%):</span>
            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 font-mono">
              {vehicles.filter(v => v.fuel_level < 20).length} vehicles
            </span>
          </div>
        </div>

        {/* Trip Velocity & Distance Area Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Trip Distance & Speed (km, km/h)
            </h3>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 font-semibold font-mono">
              Recent Trips
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tripTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="distance"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#distGrad)"
                  name="Distance (km)"
                />
                <Area
                  type="monotone"
                  dataKey="avgSpeed"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#speedGrad)"
                  name="Avg Speed (km/h)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Telemetry source:</span>
            <span className="text-slate-700 font-mono font-medium">GPS Waypoint Integrator</span>
          </div>
        </div>
      </div>

      {/* Operational & Telematics Alerts List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Operational Alerts</h3>
              <p className="text-xs text-slate-500">Automated telematics threshold triggers and driver alerts</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {alerts.length} Pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            const isHigh = alert.severity === 'high';
            return (
              <div
                key={alert.id}
                onClick={() => onSelectVehicleById && onSelectVehicleById(alert.vehicleId)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                  isCritical
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300 hover:bg-rose-50'
                    : isHigh
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCritical
                      ? 'bg-rose-100 text-rose-600'
                      : isHigh
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-slate-900 tracking-wide">
                      {alert.registrationNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{alert.title}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {alert.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
