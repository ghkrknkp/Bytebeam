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
    iconBg: 'rgba(99,102,241,0.12)',
    iconColor: '#818cf8',
    gradientClass: 'stat-card-indigo',
    valueColor: 'text-indigo-300',
    borderHover: 'rgba(99,102,241,0.4)',
    trendColor: 'text-indigo-400',
  },
  emerald: {
    iconBg: 'rgba(16,185,129,0.12)',
    iconColor: '#34d399',
    gradientClass: 'stat-card-emerald',
    valueColor: 'text-emerald-300',
    borderHover: 'rgba(16,185,129,0.4)',
    trendColor: 'text-emerald-400',
  },
  rose: {
    iconBg: 'rgba(244,63,94,0.12)',
    iconColor: '#fb7185',
    gradientClass: 'stat-card-rose',
    valueColor: 'text-rose-300',
    borderHover: 'rgba(244,63,94,0.4)',
    trendColor: 'text-rose-400',
  },
  blue: {
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: '#60a5fa',
    gradientClass: 'stat-card-blue',
    valueColor: 'text-blue-300',
    borderHover: 'rgba(59,130,246,0.4)',
    trendColor: 'text-blue-400',
  },
  amber: {
    iconBg: 'rgba(245,158,11,0.12)',
    iconColor: '#fbbf24',
    gradientClass: 'stat-card-amber',
    valueColor: 'text-amber-300',
    borderHover: 'rgba(245,158,11,0.4)',
    trendColor: 'text-amber-400',
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend, onClick }) => {
  const c = colorMap[color];
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-200 group hover:-translate-y-0.5 ${c.gradientClass}`}
      style={{
        background: 'rgba(15,23,42,0.85)',
        border: '1px solid rgba(51,65,85,0.6)',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = c.borderHover)}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(51,65,85,0.6)')}
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">
          {title}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
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
      <div className="flex items-center justify-between mt-2">
        <div className="text-[11px] text-slate-500 truncate pr-2">{subtitle}</div>
        {trend && (
          <span className={`text-[10px] font-semibold ${c.trendColor} shrink-0 flex items-center gap-0.5`}>
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>

      {/* Decorative corner glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 transition-opacity group-hover:opacity-20"
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
