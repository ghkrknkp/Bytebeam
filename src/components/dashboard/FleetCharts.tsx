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
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Fleet Status Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">{vehicles.length} Units</span>
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
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white">{vehicles.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</span>
            </div>
          </div>

          {/* Custom Status Legend */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-xs">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.name] }}
                  />
                  <span>{item.name}</span>
                </span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Level Distribution Bar Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-400" />
              Fuel Reserve Spread
            </h3>
            <span className="text-xs text-amber-400/90 font-mono">Telemetry</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelRanges} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Vehicles" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between items-center">
            <span>Critical threshold alert (&lt;20%):</span>
            <span className="font-bold text-rose-400 font-mono">
              {vehicles.filter(v => v.fuel_level < 20).length} vehicles
            </span>
          </div>
        </div>

        {/* Trip Velocity & Distance Area Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Trip Distance & Speed (km, km/h)
            </h3>
            <span className="text-xs text-indigo-400 font-mono">Recent Trips</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tripTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '12px',
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

          <div className="mt-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between items-center">
            <span>Telemetry source:</span>
            <span className="text-slate-300 font-mono">GPS Waypoint Integrator</span>
          </div>
        </div>
      </div>

      {/* Operational & Telematics Alerts List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Operational Alerts</h3>
              <p className="text-xs text-slate-400">Automated telematics threshold triggers and driver alerts</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
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
                    ? 'bg-rose-950/30 border-rose-800/50 hover:border-rose-600'
                    : isHigh
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-600'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCritical
                      ? 'bg-rose-600/20 text-rose-400'
                      : isHigh
                      ? 'bg-amber-600/20 text-amber-400'
                      : 'bg-slate-700/30 text-slate-400'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-white tracking-wide">
                      {alert.registrationNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200">{alert.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
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
