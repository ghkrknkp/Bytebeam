import React from 'react';
import type { FleetStats } from '../../types/fleet';
import { Route, Fuel, TrendingUp } from 'lucide-react';

// Custom SVG icons for each KPI card
const TruckCountIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10V8a1 1 0 0 1 1-1h8l3 4v3H3v-3z" />
    <path d="M3 7h4V5h4l3 3" />
    <circle cx="6"  cy="16" r="2" />
    <circle cx="14" cy="16" r="2" />
    <path d="M15 10h3l2 2.5V14" strokeWidth="1.6" />
    <circle cx="19" cy="16" r="2" />
  </svg>
);

const ActiveVehicleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z" />
    <circle cx="6.5" cy="16.5" r="2" />
    <circle cx="15" cy="16.5" r="2" />
    <path d="M19 9l2 2" strokeWidth="1.4" />
    <path d="M18 7l3.5 0.5" strokeWidth="1.2" opacity="0.6" />
    <path d="M20 12l1.5 1" strokeWidth="1.2" opacity="0.6" />
  </svg>
);

const AlertVehicleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z" />
    <circle cx="6.5" cy="16.5" r="2" />
    <circle cx="15" cy="16.5" r="2" />
    <path d="M19 5l1 4m0 3h.01" strokeWidth="1.6" stroke="#f43f5e" />
  </svg>
);

type StatColor = 'indigo' | 'emerald' | 'rose' | 'blue' | 'amber';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: StatColor;
  trend?: string;
  onClick?: () => void;
}

const colorMap: Record<StatColor, {
  iconBg: string;
  iconColor: string;
  gradientClass: string;
  valueColor: string;
  borderHover: string;
  trendColor: string;
}> = {
  indigo: {
    iconBg: '#eef2ff',
    iconColor: '#4f46e5',
    gradientClass: 'stat-card-indigo',
    valueColor: 'text-indigo-900',
    borderHover: '#a5b4fc',
    trendColor: 'text-indigo-600',
  },
  emerald: {
    iconBg: '#ecfdf5',
    iconColor: '#059669',
    gradientClass: 'stat-card-emerald',
    valueColor: 'text-emerald-900',
    borderHover: '#6ee7b7',
    trendColor: 'text-emerald-600',
  },
  rose: {
    iconBg: '#fff1f2',
    iconColor: '#e11d48',
    gradientClass: 'stat-card-rose',
    valueColor: 'text-rose-900',
    borderHover: '#fda4af',
    trendColor: 'text-rose-600',
  },
  blue: {
    iconBg: '#f0f9ff',
    iconColor: '#0284c7',
    gradientClass: 'stat-card-blue',
    valueColor: 'text-sky-900',
    borderHover: '#7dd3fc',
    trendColor: 'text-sky-600',
  },
  amber: {
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    gradientClass: 'stat-card-amber',
    valueColor: 'text-amber-900',
    borderHover: '#fcd34d',
    trendColor: 'text-amber-600',
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend, onClick }) => {
  const c = colorMap[color];
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-md bg-white border border-slate-200 shadow-xs ${c.gradientClass}`}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = c.borderHover)}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">
          {title}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs"
          style={{ background: c.iconBg, color: c.iconColor }}
        >
          {icon}
        </div>
      </div>

      {/* Big metric */}
      <div className={`text-3xl font-extrabold font-mono tracking-tight leading-none ${c.valueColor}`}>
        {value}
      </div>

      {/* Subtitle + trend */}
      <div className="flex items-center justify-between mt-2.5">
        <div className="text-[11px] text-slate-500 font-medium truncate pr-2">{subtitle}</div>
        {trend && (
          <span className={`text-[10px] font-bold ${c.trendColor} shrink-0 flex items-center gap-0.5 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/80`}>
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>

      {/* Decorative corner glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 transition-opacity group-hover:opacity-35 pointer-events-none"
        style={{ background: c.iconColor, filter: 'blur(20px)' }}
      />
    </div>
  );
};

interface StatCardsProps {
  stats: FleetStats;
  onFilterClick?: (filterType: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, onFilterClick }) => {
  const utilization = Math.round((stats.activeVehicles / (stats.totalVehicles || 1)) * 100);

  const cards: StatCardProps[] = [
    {
      id: 'total',
      title: 'Total Fleet Units',
      value: stats.totalVehicles,
      subtitle: `${stats.idleVehicles} on standby • ${stats.activeVehicles} moving`,
      icon: <TruckCountIcon size={18} />,
      color: 'indigo',
      trend: `${utilization}% util`,
      onClick: () => onFilterClick?.('total'),
    },
    {
      id: 'active',
      title: 'Active / Moving',
      value: stats.activeVehicles,
      subtitle: `Fleet utilization rate`,
      icon: <ActiveVehicleIcon size={18} />,
      color: 'emerald',
      trend: `${utilization}%`,
      onClick: () => onFilterClick?.('active'),
    },
    {
      id: 'attention',
      title: 'Needs Attention',
      value: stats.attentionRequiredCount,
      subtitle: `${stats.maintenanceVehicles} maint • ${stats.offlineVehicles} offline`,
      icon: <AlertVehicleIcon size={18} />,
      color: 'rose',
      onClick: () => onFilterClick?.('attention'),
    },
    {
      id: 'trips',
      title: 'Trips Completed',
      value: stats.completedTrips,
      subtitle: `${stats.totalDistanceKm} km total distance`,
      icon: <Route className="w-4.5 h-4.5" />,
      color: 'blue',
      trend: `${stats.totalDistanceKm}km`,
      onClick: () => onFilterClick?.('trips'),
    },
    {
      id: 'fuel',
      title: 'Avg Fleet Fuel',
      value: `${stats.avgFleetFuel}%`,
      subtitle: 'Real-time sensor telemetry',
      icon: <Fuel className="w-4.5 h-4.5" />,
      color: 'amber',
      trend: stats.avgFleetFuel > 50 ? 'Adequate' : 'Low',
      onClick: () => onFilterClick?.('total'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
      {cards.map(card => (
        <StatCard key={card.id} {...card} />
      ))}
    </div>
  );
};
