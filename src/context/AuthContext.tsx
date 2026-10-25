import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemoUser: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error: string | null; message?: string }>;
  signOut: () => Promise<void>;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-fleet-manager-uuid-001',
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Operations Lead', role: 'Fleet Controller' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@gmail.com',
  phone: '',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    // Check if user previously logged in as demo
    const storedDemo = localStorage.getItem('bytebeam_demo_session');
    if (storedDemo === 'true') {
      setUser(DEMO_USER);
      setIsDemoUser(true);
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      // If not configured, start in unauthenticated state to allow user to see login screen
      setIsLoading(false);
      return;
    }

    // Initialize Supabase Auth Session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (err) {
        console.error('Failed to get Supabase session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession) {
        setIsDemoUser(false);
        localStorage.removeItem('bytebeam_demo_session');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          setUser(data.user);
          setSession(data.session);
          setIsDemoUser(false);
          localStorage.removeItem('bytebeam_demo_session');
          return { success: true, error: null };
        }
        // If demo credentials, allow immediate sign in even if network glitch occurs
        if (email.trim().toLowerCase() === 'demo@gmail.com' && password === '12345678') {
          loginAsDemo();
          return { success: true, error: null };
        }
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        if (email.trim().toLowerCase() === 'demo@gmail.com' && password === '12345678') {
          loginAsDemo();
          return { success: true, error: null };
        }
        return { success: false, error: err.message || 'Authentication error' };
      }
    }

    // In demo environment if Supabase is not configured yet
    if (email === 'demo@bytebeam.io' || email.includes('@')) {
      loginAsDemo();
      return { success: true, error: null };
    }

    return { success: false, error: 'Invalid credentials. Use demo login or configure Supabase keys.' };
  };

  const signUp = async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: 'Please enter email and password.' };
    }

    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase URL/Key not configured in environment variables. You can log in using Demo Mode directly.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0],
            role: 'Fleet Manager',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return {
          success: true,
          error: null,
          message: 'Account created! Please check your email inbox to confirm your registration before logging in.',
        };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const signOut = async () => {
    setIsDemoUser(false);
    localStorage.removeItem('bytebeam_demo_session');
    setUser(null);
    setSession(null);

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setIsDemoUser(true);
    localStorage.setItem('bytebeam_demo_session', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isDemoUser,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
