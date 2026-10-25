import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  LayoutDashboard,
  MapPin,
  Route,
  BarChart3,
  LogOut,
  RefreshCw,
  Menu,
  X,
  Database,
  Radio,
  ChevronRight,
  Wifi,
  WifiOff,
  Bell,
} from 'lucide-react';

// Inline SVG logo for Bytebeam Fleet
const BytebeamLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Truck body */}
    <rect x="3" y="13" width="18" height="11" rx="2" fill="white" fillOpacity="0.9" />
    {/* Cab */}
    <path d="M21 16h4l3 4v4h-7V16z" fill="white" fillOpacity="0.75" />
    {/* Windshield */}
    <path d="M21.5 16.5h3l2 2.5" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
    {/* Front wheels */}
    <circle cx="8"  cy="25" r="3" fill="#6366f1" />
    <circle cx="22" cy="25" r="3" fill="#6366f1" />
    {/* EV bolt */}
    <path d="M14 11l-2.5 4h2.5l-2.5 5" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    {/* Signal arcs */}
    <path d="M26 7a5 5 0 0 1 0 7" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M28.5 4.5a9 9 0 0 1 0 12" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// Vehicle-themed SVG for truck nav icon
const TruckNavIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 11V8a1 1 0 0 1 1-1h9l3 4v3H3v-3z" />
    <path d="M3 7h5V4h4l4 4" />
    <circle cx="6.5" cy="16" r="2" />
    <circle cx="15.5" cy="16" r="2" />
  </svg>
);

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  alertCount?: number;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onRefresh,
  isRefreshing = false,
  alertCount = 0,
  children,
}) => {
  const { user, signOut, isDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'overview',   label: 'Fleet Overview',       icon: LayoutDashboard, desc: 'KPIs & live map' },
    { id: 'vehicles',   label: 'Vehicle Registry',     icon: TruckNavIcon,    desc: 'Manage all units' },
    { id: 'map',        label: 'Live GPS Map',          icon: MapPin,          desc: 'Telematics view' },
    { id: 'trips',      label: 'Trips & Telematics',   icon: Route,           desc: 'Route history' },
    { id: 'analytics',  label: 'Operational Insights', icon: BarChart3,       desc: 'Charts & alerts', badge: alertCount > 0 ? alertCount : undefined },
  ];

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'OP';
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Operator';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">

      {/* ── Mobile top bar ──────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-50 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sidebar-brand-gradient rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30">
            <BytebeamLogo size={22} />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm tracking-tight">Bytebeam</span>
            <span className="text-[10px] text-indigo-400 font-semibold ml-1.5 uppercase tracking-wider">Fleet</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {alertCount > 0 && (
            <div className="relative">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                {alertCount}
              </span>
            </div>
          )}
          <button
            onClick={onRefresh}
            title="Refresh"
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, #0d1224 0%, #0a0f1e 100%)', borderRight: '1px solid rgba(51,65,85,0.5)' }}
      >

        {/* Brand Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #0891b2 100%)', boxShadow: '0 0 20px rgba(79,70,229,0.4)' }}
            >
              <BytebeamLogo size={26} />
            </div>
            <div>
              <div className="font-extrabold text-white tracking-tight text-base leading-tight">
                Bytebeam
                <span
                  className="ml-2 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  Fleet
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-semibold">TELEMATICS ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Data source pill */}
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
            style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.5)' }}
          >
            {isSupabaseConfigured ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Supabase PostgreSQL</span>
                <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300">Demo / Local Mode</span>
                <span className="ml-auto w-1.5 h-1.5 bg-amber-400 rounded-full" />
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="px-2 pb-2 pt-1 text-[9px] font-bold tracking-[0.15em] text-slate-500 uppercase">
            Operations Console
          </div>

          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => { onSelectTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(79,70,229,0.1) 100%)',
                  border: '1px solid rgba(99,102,241,0.35)',
                  boxShadow: '0 0 12px rgba(99,102,241,0.15)',
                } : { border: '1px solid transparent' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                    style={isActive
                      ? { background: 'rgba(99,102,241,0.25)', color: '#818cf8' }
                      : { background: 'rgba(51,65,85,0.3)', color: '#64748b' }}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'} />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-[13px] leading-tight truncate">{item.label}</div>
                    <div className={`text-[10px] truncate transition ${isActive ? 'text-indigo-300/70' : 'text-slate-600 group-hover:text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-all ${isActive ? 'text-indigo-400 opacity-100' : 'opacity-0 group-hover:opacity-50 text-slate-500'}`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Database Status Card */}
        <div className="mx-3 mb-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(51,65,85,0.4)', background: 'rgba(2,6,23,0.6)' }}>
          <div className="px-3 py-2.5 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-300 truncate">
                {isSupabaseConfigured ? 'Supabase Live DB' : 'Local Seed Dataset'}
              </div>
              <div className="text-[9px] text-slate-600 mt-0.5 truncate">
                {isSupabaseConfigured ? 'RLS policies enforced' : '10 vehicles • 30 trips'}
              </div>
            </div>
            <span className={`w-2 h-2 rounded-full shrink-0 ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-200 truncate capitalize">{userName}</div>
              <div className="text-[10px] text-slate-500 truncate">
                {isDemoUser ? 'Demo Operator' : 'Fleet Manager'}
              </div>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-400 hover:text-rose-300 rounded-lg border border-slate-800/80 hover:border-rose-900/60 hover:bg-rose-950/30 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Sticky Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-30 backdrop-blur-xl" style={{ background: 'rgba(2,6,23,0.8)', borderBottom: '1px solid rgba(51,65,85,0.4)' }}>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-white leading-tight capitalize">
                {navigationItems.find(i => i.id === currentTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {navigationItems.find(i => i.id === currentTab)?.desc}
              </p>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
              Bengaluru Hub
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection status */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.5)' }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300">{isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}</span>
            </div>

            {/* Alert bell */}
            {alertCount > 0 && (
              <button
                onClick={() => onSelectTab('analytics')}
                className="relative p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer"
                title={`${alertCount} alerts`}
              >
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {alertCount}
                </span>
              </button>
            )}

            {/* Refresh */}
            <button
              id="refresh-fleet-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/60 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
};
