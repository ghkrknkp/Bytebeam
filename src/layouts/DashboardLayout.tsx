import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Route,
  BarChart3,
  LogOut,
  RefreshCw,
  Menu,
  X,
  Radio,
  ChevronRight,
  Bell,
} from 'lucide-react';

// Modern clean logo for Bytebeam Fleet
const BytebeamLogo: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    {/* Truck body */}
    <rect x="3" y="13" width="18" height="11" rx="2.5" fill="white" />
    {/* Cab */}
    <path d="M21 16h4.5l2.5 4v4h-7V16z" fill="white" fillOpacity="0.85" />
    {/* Windshield */}
    <path d="M21.5 16.5h3.5l1.5 2.5" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" />
    {/* Wheels */}
    <circle cx="8" cy="25" r="3" fill="#4f46e5" />
    <circle cx="22" cy="25" r="3" fill="#4f46e5" />
    {/* EV bolt */}
    <path d="M14 11l-2.5 4h2.5l-2.5 5" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    {/* Signal arcs */}
    <path d="M26 7a5 5 0 0 1 0 7" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

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
    { id: 'overview', label: 'Fleet Overview', icon: LayoutDashboard, desc: 'Live telematics & KPIs' },
    { id: 'vehicles', label: 'Vehicle Registry', icon: TruckNavIcon, desc: 'Inspect & manage units' },
    { id: 'map', label: 'Live GPS Map', icon: MapPin, desc: 'Interactive tracking' },
    { id: 'trips', label: 'Trips & Telematics', icon: Route, desc: 'Route histories' },
    { id: 'analytics', label: 'Operational Insights', icon: BarChart3, desc: 'Analytics & alerts', badge: alertCount > 0 ? alertCount : undefined },
  ];

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'OP';
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Operator';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">

      {/* ── Mobile top bar ──────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 z-50 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white">
            <BytebeamLogo size={18} />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">Bytebeam</span>
            <span className="text-[10px] text-indigo-600 font-bold ml-1.5 uppercase tracking-wider">Fleet</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {alertCount > 0 && (
            <div className="relative">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                {alertCount}
              </span>
            </div>
          )}
          <button
            onClick={onRefresh}
            title="Refresh"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
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

      {/* ── Desktop Sidebar — Pure White with Light Grey Accents ─────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-white border-r border-slate-200 shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white shrink-0">
              <BytebeamLogo size={24} />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 tracking-tight text-base leading-tight flex items-center">
                Bytebeam
                <span className="ml-2 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Fleet
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-600 font-bold tracking-wide uppercase">TELEMATICS ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Enterprise Operational Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-emerald-50 border border-emerald-200/80 text-emerald-800">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Operations Live • 100% Units</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-white' : 'text-slate-600'} />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-[13px] leading-tight truncate">{item.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-indigo-600/80' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-all ${
                      isActive ? 'text-indigo-600 opacity-100' : 'opacity-0 group-hover:opacity-40 text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Telematics Stream Health Card */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-slate-800 truncate">
              Telematics Gateway
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Live GPS • 99.8% Uptime
            </div>
          </div>
          <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate capitalize">{userName}</div>
              <div className="text-[10px] text-slate-500 truncate">
                {isDemoUser ? 'Lead Fleet Controller' : 'Operations Supervisor'}
              </div>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Top Header — Pure White with Light Grey Border */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight capitalize tracking-tight">
                {navigationItems.find(i => i.id === currentTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-xs text-slate-500">
                {navigationItems.find(i => i.id === currentTab)?.desc}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
              Bengaluru Logistics Hub
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live operational pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Fleet Telematics Active</span>
            </div>

            {/* Alert bell */}
            {alertCount > 0 && (
              <button
                onClick={() => onSelectTab('analytics')}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                title={`${alertCount} alerts`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {alertCount}
                </span>
              </button>
            )}

            {/* Refresh */}
            <button
              id="refresh-fleet-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
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
