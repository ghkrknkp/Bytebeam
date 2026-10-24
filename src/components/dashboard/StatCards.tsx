import type { FleetStats } from '../../types/fleet';
import { Truck, CheckCircle2, AlertOctagon, Route, Fuel } from 'lucide-react';

interface StatCardsProps {
  stats: FleetStats;
  onFilterClick?: (filterType: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, onFilterClick }) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Fleet Units',
      value: stats.totalVehicles,
      subtitle: `${stats.idleVehicles} currently on standby`,
      icon: Truck,
      color: 'indigo',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      id: 'active',
      title: 'Active / Moving',
      value: stats.activeVehicles,
      subtitle: `${Math.round((stats.activeVehicles / (stats.totalVehicles || 1)) * 100)}% fleet utilization`,
      icon: CheckCircle2,
      color: 'emerald',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'attention',
      title: 'Attention Required',
      value: stats.attentionRequiredCount,
      subtitle: `${stats.maintenanceVehicles} maint • ${stats.offlineVehicles} offline`,
      icon: AlertOctagon,
      color: 'rose',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    {
      id: 'trips',
      title: 'Trips Completed',
      value: stats.completedTrips,
      subtitle: `${stats.totalDistanceKm} total km logged`,
      icon: Route,
      color: 'blue',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 'fuel',
      title: 'Fleet Avg Fuel',
      value: `${stats.avgFleetFuel}%`,
      subtitle: 'Real-time sensor telemetry',
      icon: Fuel,
      color: 'amber',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id)}
            className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-4.5 shadow-lg transition duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.badgeColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-bold font-mono text-white tracking-tight group-hover:text-indigo-400 transition">
              {card.value}
            </div>

            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
