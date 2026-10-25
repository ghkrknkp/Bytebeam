import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Key, Mail, Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Activity, Zap, Check } from 'lucide-react';

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
        if (!res.success) setErrorMessage(res.error || 'Failed to register account.');
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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased">

      {/* ── LEFT PANEL — Full Cover AI Fleet Hero ─────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 min-h-screen overflow-hidden bg-slate-900">
        {/* Full Cover AI Image */}
        <img
          src="/fleet_auth_hero.jpg"
          alt="Bytebeam Autonomous Electric Fleet"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Soft Vignette & Subtle Gradient Overlay for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/30" />

        {/* Hero Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full h-full text-white">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z" />
                <circle cx="6.5" cy="16" r="2" />
                <circle cx="14.5" cy="16" r="2" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-white text-xl tracking-tight leading-tight">
                Bytebeam Fleet
              </div>
              <div className="text-[10px] text-indigo-300 font-bold tracking-widest uppercase">
                Enterprise Telematics Suite
              </div>
            </div>
          </div>

          {/* Bottom Hero Narrative & Floating Telematics Card */}
          <div className="space-y-6 max-w-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-indigo-200 mb-3">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Next-Generation Fleet Infrastructure</span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Precision tracking, EV diagnostics & operational control.
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mt-2.5">
                Real-time GPS telemetry, battery state-of-charge analytics, and dispatch logistics designed for modern commercial fleets.
              </p>
            </div>

            {/* Floating Live Telemetry HUD Widget */}
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15 shadow-2xl grid grid-cols-3 gap-3">
              <div className="border-r border-white/10 pr-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Live Units</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5">12 / 12</div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 100% Online
                </div>
              </div>
              <div className="border-r border-white/10 pr-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Trips</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5">10 Logs</div>
                <div className="text-[10px] text-indigo-300 font-medium mt-0.5">GPS Polyline Sync</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Clean Energy</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5">6 EV Units</div>
                <div className="text-[10px] text-cyan-300 font-medium flex items-center gap-0.5 mt-0.5">
                  <Zap className="w-3 h-3 text-cyan-400" /> Real-time SoC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Modern Pure White & Light Grey Auth Form ──────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 relative">
        <div className="w-full max-w-md">

          {/* Mobile Header (Shown on small screens) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11V9a1 1 0 0 1 1-1h9l3 4v3H3v-3z" />
                <circle cx="6.5" cy="16" r="2" /><circle cx="14.5" cy="16" r="2" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg">Bytebeam Fleet</div>
              <div className="text-[10px] text-slate-500 font-semibold">Operations Console</div>
            </div>
          </div>

          {/* Pure White Card */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/60 border border-slate-200/90 transition-all">

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isSignUp ? 'Create Fleet Account' : 'Fleet Operations Console'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isSignUp
                  ? 'Register new supervisor credentials to manage fleet assets'
                  : 'Instant demo access available below or sign in with credentials'}
              </p>
            </div>

            {/* ── 1-CLICK INSTANT DEMO ACCESS BUTTON (Prominent at top) ── */}
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Instant Evaluator Review
                </span>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full text-indigo-700 border border-indigo-200 shadow-xs">
                  Zero Setup
                </span>
              </div>
              <button
                id="demo-login-quick-btn"
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {demoLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Enter Console as Demo Dispatcher (1-Click)</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2 font-medium">
                Instant access with preloaded telemetry, 12 vehicles, and trip routes.
              </p>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-5">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                or sign in with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl flex items-start gap-2.5 text-xs bg-rose-50 border border-rose-200 text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl flex items-start gap-2.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Credential Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={fillDemo}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Auto-fill demo credentials
                  </button>
                </div>
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

              {/* Submit Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                ) : isSignUp ? (
                  <><Key className="w-4 h-4 text-indigo-600" /> Create Account</>
                ) : (
                  <><ArrowRight className="w-4 h-4 text-indigo-600" /> Sign In with Credentials</>
                )}
              </button>
            </form>

            {/* Switch Sign In / Sign Up */}
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

          {/* Footer Security Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>TLS 256-bit Encryption</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-indigo-500" />
              <span>Role-Based Access Control</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
