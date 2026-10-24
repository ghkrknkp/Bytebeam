import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  Truck,
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
} from 'lucide-react';

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
    { id: 'overview', label: 'Fleet Overview', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicle Registry', icon: Truck },
    { id: 'map', label: 'Live GPS Map', icon: MapPin },
    { id: 'trips', label: 'Trips & Telematics', icon: Route },
    { id: 'analytics', label: 'Operational Insights', icon: BarChart3, badge: alertCount > 0 ? alertCount : undefined },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* ----------------- MOBILE TOP BAR ----------------- */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">Bytebeam</span>{' '}
            <span className="text-indigo-400 text-xs uppercase font-semibold">Fleet</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            title="Refresh fleet data"
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ----------------- DESKTOP SIDEBAR ----------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight flex items-center gap-1.5">
                Bytebeam
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Fleet
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Telematics Active
              </div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Operations Menu
          </div>
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                      isActive ? 'bg-white text-indigo-600' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Database Status Panel */}
        <div className="p-3 mx-3 mb-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              Data Source
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
          <div className="font-semibold text-slate-200">
            {isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local Seed Dataset'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isSupabaseConfigured ? 'RLS Policies Active' : 'Offline / Standalone Mode'}
          </div>
        </div>

        {/* Operator Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300 border border-slate-600">
                {user?.email ? user.email.slice(0, 2).toUpperCase() : 'OP'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Operator'}
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <span>{isDemoUser ? 'Demo Operator' : 'Authenticated'}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-slate-800 hover:border-rose-900/50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-900/60 border-b border-slate-800/80 sticky top-0 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white capitalize">
              {navigationItems.find(i => i.id === currentTab)?.label || 'Dashboard'}
            </h2>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 font-mono">
              Bengaluru Operations Hub
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/70 border border-slate-700/60 rounded-full text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300 font-medium">
                {isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode (Local)'}
              </span>
            </div>

            {/* Quick Refresh */}
            <button
              id="refresh-fleet-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
