import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AlertCircle, Key, Mail, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

// Animated truck SVG for the login hero
const HeroTruck: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    {/* Glow bg */}
    <circle cx="26" cy="26" r="24" fill="rgba(99,102,241,0.12)" />
    {/* Truck body */}
    <rect x="8" y="20" width="26" height="16" rx="3" fill="white" fillOpacity="0.9" />
    {/* Cab extension */}
    <path d="M34 23h8l4 6v7H34V23z" fill="white" fillOpacity="0.7" />
    {/* Windshield */}
    <path d="M34.5 24l6 0.5 3 4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
    {/* Cab window */}
    <rect x="9" y="21.5" width="8" height="6" rx="1.5" fill="#6366f1" fillOpacity="0.25" stroke="#6366f1" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="15" cy="37" r="4" fill="#4f46e5" />
    <circle cx="15" cy="37" r="2" fill="#818cf8" />
    <circle cx="33" cy="37" r="4" fill="#4f46e5" />
    <circle cx="33" cy="37" r="2" fill="#818cf8" />
    <circle cx="43" cy="37" r="3.5" fill="#4f46e5" />
    <circle cx="43" cy="37" r="1.8" fill="#818cf8" />
    {/* EV bolt */}
    <path d="M23 18l-3.5 5.5h3.5L20 30" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Signal arcs */}
    <path d="M4 14a12 12 0 0 1 0 12" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    <path d="M7 16a8 8 0 0 1 0 8" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 18a4 4 0 0 1 0 4" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// Feature badges shown below login card
const features = [
  { icon: '📍', text: 'Live GPS Tracking' },
  { icon: '⚡', text: 'EV Telematics' },
  { icon: '📊', text: 'Fleet Analytics' },
  { icon: '🔒', text: 'RLS Security' },
];

export const LoginPage: React.FC = () => {
  const { signIn, signUp, loginAsDemo } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await signUp(email, password);
        if (!res.success) setErrorMessage(res.error || 'Failed to register.');
        else if (res.message) setSuccessMessage(res.message);
      } else {
        const res = await signIn(email, password);
        if (!res.success) setErrorMessage(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    await loginAsDemo();
    setDemoLoading(false);
  };

  const fillDemo = () => {
    setEmail('ops.lead@bytebeam.io');
    setPassword('Bytebeam@2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT PANEL — Brand / Hero ──────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 w-[420px] shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a0e1f 0%, #0d1530 50%, #070b18 100%)' }}
      >
        {/* Ambient glow blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 right-5 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #0891b2)', boxShadow: '0 0 20px rgba(79,70,229,0.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z"/>
                <circle cx="6.5" cy="16" r="2" />
                <circle cx="14.5" cy="16" r="2" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-white text-lg tracking-tight">Bytebeam Fleet</div>
              <div className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase">Telematics Platform</div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-snug mb-4">
            Real-time fleet<br />
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              intelligence
            </span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-10">
            Monitor your entire fleet from a single operational console. GPS telemetry, EV analytics, route history, and live driver tracking — built for modern logistics.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: '📍', label: 'Live GPS Positions', sub: 'OpenStreetMap • Leaflet' },
              { icon: '⚡', label: 'EV Battery Telemetry', sub: 'Real-time sensor data' },
              { icon: '📊', label: 'Operational Analytics', sub: 'Recharts dashboards' },
              { icon: '🔐', label: 'Supabase Auth + RLS', sub: 'Row-level security' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800/60 flex items-center justify-center text-sm border border-slate-700/50 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{f.label}</div>
                  <div className="text-[10px] text-slate-500">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="text-[10px] text-slate-600 border-t border-slate-800/60 pt-4">
          Bytebeam Frontend Engineering Intern Assignment • v2.0
        </div>
      </div>

      {/* ── RIGHT PANEL — Login Form ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: '#020617' }}>

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 right-10 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />

        <div className="w-full max-w-md z-10">

          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #0891b2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z"/>
                <circle cx="6.5" cy="16" r="2" /><circle cx="14.5" cy="16" r="2" />
              </svg>
            </div>
            <div className="font-extrabold text-white text-lg">Bytebeam Fleet</div>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-8 shadow-2xl"
            style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(51,65,85,0.55)', backdropFilter: 'blur(16px)' }}
          >
            {/* Hero icon */}
            <div className="flex flex-col items-center mb-7">
              <div className="mb-3 animate-bounce" style={{ animationDuration: '3s' }}>
                <HeroTruck />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-400 text-center">
                {isSignUp ? 'Register to manage your fleet' : 'Sign in to your fleet console'}
              </p>

              {/* Backend badge */}
              <div
                className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.5)' }}
              >
                {isSupabaseConfigured ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300">Supabase Connected</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-amber-300">Demo / Evaluation Mode</span>
                  </>
                )}
              </div>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl flex items-start gap-2.5 text-xs" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}>
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-rose-300">{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl flex items-start gap-2.5 text-xs" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-emerald-300">{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Operator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    style={{ background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(51,65,85,0.7)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(51,65,85,0.7)')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                    style={{ background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(51,65,85,0.7)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(51,65,85,0.7)')}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)', boxShadow: '0 4px 20px rgba(79,70,229,0.35)' }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSignUp ? (
                  <><Key className="w-4 h-4" /> Create Fleet Account</>
                ) : (
                  <><ArrowRight className="w-4 h-4" /> Sign In to Console</>
                )}
              </button>
            </form>

            {/* Demo Access */}
            <div className="mt-5 pt-5 border-t border-slate-800/70 space-y-2">
              <button
                id="demo-login-quick-btn"
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 hover:-translate-y-0.5"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}
              >
                {demoLoading ? (
                  <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                ) : (
                  <><Sparkles className="w-4 h-4" /> Instant Demo Access — 1 Click</>
                )}
              </button>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-slate-500 hover:text-slate-400 text-[11px] py-1 transition text-center cursor-pointer"
              >
                Prefill demo credentials (ops.lead@bytebeam.io)
              </button>
            </div>

            {/* Toggle sign in/up */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(null); setSuccessMessage(null); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition"
              >
                {isSignUp ? '← Back to Sign In' : "Don't have an account? Register →"}
              </button>
            </div>
          </div>

          {/* Feature pills below card */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {features.map(f => (
              <span
                key={f.text}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-slate-500"
                style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.35)' }}
              >
                {f.icon} {f.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
