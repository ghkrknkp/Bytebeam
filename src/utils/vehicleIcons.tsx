import React from 'react';
import { Zap } from 'lucide-react';

export type VehicleCategory =
  | 'ev_truck'
  | 'heavy_rig'
  | 'light_commercial'
  | 'three_wheeler_ev'
  | 'cargo_van'
  | 'electric_3w';

export interface VehicleTypeMeta {
  category: VehicleCategory;
  label: string;
  isEV: boolean;
  accentColor: string;
  badgeBg: string;
}

export function getVehicleMetadata(model: string, batteryLevel: number | null): VehicleTypeMeta {
  const m = model.toLowerCase();
  const isEV = batteryLevel !== null || m.includes('ev') || m.includes('electric');

  if (m.includes('treo') || m.includes('ape') || m.includes('e-three')) {
    return {
      category: 'electric_3w',
      label: 'EV 3-Wheeler',
      isEV: true,
      accentColor: '#10b981',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
  }

  if (m.includes('bharatbenz') || m.includes('eicher') || m.includes('lpt')) {
    return {
      category: 'heavy_rig',
      label: 'Heavy Hauler (HCV)',
      isEV: false,
      accentColor: '#6366f1',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
  }

  if (isEV && (m.includes('ace') || m.includes('tata') || m.includes('mahindra'))) {
    return {
      category: 'ev_truck',
      label: 'EV LCV',
      isEV: true,
      accentColor: '#06b6d4',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };
  }

  if (isEV) {
    return {
      category: 'ev_truck',
      label: 'Clean EV Logistics',
      isEV: true,
      accentColor: '#06b6d4',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };
  }

  if (m.includes('urbania') || m.includes('van') || m.includes('traveller')) {
    return {
      category: 'cargo_van',
      label: 'Fleet Cargo Van',
      isEV: false,
      accentColor: '#8b5cf6',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
  }

  return {
    category: 'light_commercial',
    label: 'LCV Delivery',
    isEV: false,
    accentColor: '#3b82f6',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
}

// ── SVG-based modern vehicle icons ──────────────────────────────────────────

const HeavyTruckSVG: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cab */}
    <rect x="2" y="7" width="8" height="9" rx="1.2" />
    {/* Engine Hood */}
    <path d="M10 9h4a2 2 0 0 1 2 2v5H10V9z" />
    {/* Cargo Box */}
    <rect x="2" y="7" width="8" height="9" rx="1.2" />
    <path d="M14 11h3l1.5 2H14v-2z" />
    {/* Windows */}
    <rect x="3.5" y="8.5" width="4" height="3" rx="0.6" strokeWidth="1.2" />
    {/* Wheels */}
    <circle cx="5.5" cy="17" r="1.8" />
    <circle cx="14" cy="17" r="1.8" />
    {/* Undercarriage */}
    <line x1="3" y1="16" x2="17" y2="16" strokeWidth="0.8" />
    {/* Mirror */}
    <line x1="10" y1="9" x2="11.5" y2="8" strokeWidth="1.2" />
  </svg>
);

const LCVTruckSVG: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Body */}
    <path d="M3 12V9a1 1 0 0 1 1-1h10l3 4v3H3v-3z" />
    {/* Cab section */}
    <path d="M3 8h5V5h5l4 3" />
    {/* Window */}
    <path d="M4.5 8.5h3.5V6.5H8l2 2" strokeWidth="1.2" />
    {/* Cargo */}
    <rect x="8.5" y="5" width="4" height="3.5" rx="0.4" strokeWidth="1.2" />
    {/* Wheels */}
    <circle cx="6" cy="17" r="2" />
    <circle cx="15" cy="17" r="2" />
    {/* Ground line */}
    <line x1="3" y1="15" x2="18" y2="15" strokeWidth="0.8" />
  </svg>
);

const CargoVanSVG: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Van body */}
    <rect x="2" y="7" width="18" height="9" rx="1.5" />
    {/* Windshield section */}
    <path d="M2 10h4V7" />
    {/* Side windows */}
    <rect x="3" y="8" width="3" height="3" rx="0.5" strokeWidth="1.2" />
    <rect x="9" y="8" width="3" height="2.5" rx="0.5" strokeWidth="1.2" />
    {/* Rear door line */}
    <line x1="17" y1="7" x2="17" y2="16" strokeWidth="1.2" />
    {/* Wheels */}
    <circle cx="6" cy="17.5" r="2" />
    <circle cx="16" cy="17.5" r="2" />
  </svg>
);

const ThreeWheelerSVG: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cab */}
    <path d="M5 14V9a1 1 0 0 1 1-1h5l2 3v3H5z" />
    {/* Hood/Bonnet */}
    <path d="M11 8l2.5 1.5V13" strokeWidth="1.4" />
    {/* Windshield */}
    <path d="M6 9h4v2.5H6V9z" strokeWidth="1.2" />
    {/* Cargo box at rear */}
    <rect x="2" y="9" width="3" height="5" rx="0.5" />
    {/* Front wheel */}
    <circle cx="13.5" cy="16" r="1.8" />
    {/* Rear wheels */}
    <circle cx="4" cy="16" r="1.6" />
    <circle cx="8" cy="16" r="1.6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Modern UI vehicle icon renderer — returns categorised SVG icons with EV badge overlay.
 */
export const VehicleTypeIcon: React.FC<{
  model: string;
  batteryLevel: number | null;
  className?: string;
  size?: number;
}> = ({ model, batteryLevel, className = '', size = 18 }) => {
  const meta = getVehicleMetadata(model, batteryLevel);

  const renderBaseIcon = () => {
    switch (meta.category) {
      case 'heavy_rig':
        return <HeavyTruckSVG size={size} color={meta.accentColor} />;
      case 'cargo_van':
        return <CargoVanSVG size={size} color={meta.accentColor} />;
      case 'electric_3w':
      case 'three_wheeler_ev':
        return <ThreeWheelerSVG size={size} color={meta.accentColor} />;
      case 'ev_truck':
      case 'light_commercial':
      default:
        return <LCVTruckSVG size={size} color={meta.accentColor} />;
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {renderBaseIcon()}
      {meta.isEV && (
        <Zap
          style={{ width: size * 0.52, height: size * 0.52 }}
          className="absolute -top-0.5 -right-0.5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.9)] fill-emerald-400"
        />
      )}
    </div>
  );
};

/**
 * Larger decorative vehicle hero icon for modals / detail panels.
 */
export const VehicleHeroIcon: React.FC<{
  model: string;
  batteryLevel: number | null;
  size?: number;
}> = ({ model, batteryLevel, size = 36 }) => {
  const meta = getVehicleMetadata(model, batteryLevel);

  const renderHero = () => {
    switch (meta.category) {
      case 'heavy_rig':
        return <HeavyTruckSVG size={size} color={meta.accentColor} />;
      case 'cargo_van':
        return <CargoVanSVG size={size} color={meta.accentColor} />;
      case 'electric_3w':
      case 'three_wheeler_ev':
        return <ThreeWheelerSVG size={size} color={meta.accentColor} />;
      case 'ev_truck':
      case 'light_commercial':
      default:
        return <LCVTruckSVG size={size} color={meta.accentColor} />;
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {renderHero()}
      {meta.isEV && (
        <Zap
          style={{ width: size * 0.45, height: size * 0.45 }}
          className="absolute -top-1 -right-1 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,1)] fill-emerald-400"
        />
      )}
    </div>
  );
};
