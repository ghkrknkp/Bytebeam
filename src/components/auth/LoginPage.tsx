import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AlertCircle, Key, Mail, Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Activity, Cpu } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, signUp, loginAsDemo } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900 antialiased">

      {/* ── LEFT PANEL — Modern Pure White Showcase with AI Hero ─────────── */}
      <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 w-[520px] shrink-0 bg-white border-r border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Ambient pale glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-50/60 pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-slate-100/70 pointer-events-none blur-2xl" />

        <div className="relative z-10">
          {/* Header Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z" />
                <circle cx="6.5" cy="16" r="2" />
                <circle cx="14.5" cy="16" r="2" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg tracking-tight">Bytebeam Fleet</div>
              <div className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase">Next-Gen Telematics</div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-3 tracking-tight">
            Intelligent fleet operations,{' '}
            <span className="text-indigo-600">
              simplified.
            </span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Autonomous fleet diagnostics, live GPS telematics, and real-time battery analytics engineered for precision commercial transport.
          </p>

          {/* AI Hero Image with Telematics HUD Badge */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group mb-6">
            <img
              src="/fleet_auth_hero.jpg"
              alt="Autonomous Electric Fleet Telematics"
              className="w-full h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient bottom overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Floating Telematics Badge */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Quantum Telematics Core</div>
                  <div className="text-[10px] text-slate-500">Autonomous Sensor Network Active</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Live 99.8%
              </span>
            </div>
          </div>

          {/* Light Feature Boxes */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: '📍', label: 'Real-Time GPS', desc: 'Precision route tracking' },
              { icon: '⚡', label: 'EV Telematics', desc: 'Battery & state of charge' },
              { icon: '📊', label: 'KPI Analytics', desc: 'Efficiency & trip history' },
              { icon: '🔒', label: 'Supabase RLS', desc: 'Enterprise security' },
            ].map(f => (
              <div key={f.label} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:bg-slate-100/70 transition">
                <div className="text-base mb-1">{f.icon}</div>
                <div className="text-xs font-bold text-slate-800">{f.label}</div>
                <div className="text-[10px] text-slate-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 relative z-10">
          <span>Bytebeam Fleet Operations v2.0</span>
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" /> AI-Powered UI
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL — Pure White Login Card ───────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
        <div className="w-full max-w-md">

          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z"/>
                <circle cx="6.5" cy="16" r="2" /><circle cx="14.5" cy="16" r="2" />
              </svg>
            </div>
            <div className="font-extrabold text-slate-900 text-lg">Bytebeam Fleet</div>
          </div>

          {/* Pure White Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-200/90 transition-all">
            
            {/* Header */}
            <div className="text-center mb-7">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1.5 tracking-tight">
                {isSignUp ? 'Create Fleet Account' : 'Welcome to Fleet Console'}
              </h2>
              <p className="text-xs text-slate-500">
                {isSignUp ? 'Register operator credentials to manage vehicles' : 'Enter your credentials or use 1-click demo access'}
              </p>

              {/* Backend status badge */}
              <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                {isSupabaseConfigured ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Supabase Connected (Live DB)</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Demo / Evaluation Mode</span>
                  </>
                )}
              </div>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-xs bg-rose-50 border border-rose-200 text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Operator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ops.lead@bytebeam.io"
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
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

            {/* Instant Demo Access (1-Click) */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5">
              <button
                id="demo-login-quick-btn"
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
              >
                {demoLoading ? (
                  <div className="w-4 h-4 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
                ) : (
                  <><Sparkles className="w-4 h-4 text-amber-600" /> Instant Demo Access (1-Click Review)</>
                )}
              </button>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-slate-500 hover:text-slate-800 text-[11px] py-1 transition text-center cursor-pointer font-medium"
              >
                Prefill demo credentials (ops.lead@bytebeam.io)
              </button>
            </div>

            {/* Switch between Sign In / Sign Up */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(null); setSuccessMessage(null); }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer transition"
              >
                {isSignUp ? '← Back to Sign In' : "Don't have an account? Register →"}
              </button>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secured with Supabase Row Level Security (RLS)</span>
          </div>

        </div>
      </div>
    </div>
  );
};
