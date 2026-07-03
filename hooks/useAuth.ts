'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  getLocalAdminSession,
  clearLocalAdminSession,
  type LocalAdminSession,
} from '@/lib/admin-auth';

function createLocalUser(session: LocalAdminSession): User {
  return {
    id: 'local-admin',
    email: session.email,
    app_metadata: {},
    user_metadata: { is_admin: true },
    aud: 'authenticated',
    created_at: new Date(session.createdAt).toISOString(),
  } as User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authSource, setAuthSource] = useState<'supabase' | 'local' | null>(null);

  const applyLocalSession = useCallback((session: LocalAdminSession | null) => {
    if (session) {
      setUser(createLocalUser(session));
      setIsAdmin(true);
      setAuthSource('local');
    }
    setLoading(false);
  }, []);

  const checkAdmin = useCallback(async (u: User | null) => {
    if (!u) {
      const localSession = getLocalAdminSession();
      if (localSession) {
        applyLocalSession(localSession);
        return;
      }
      setIsAdmin(false);
      setAuthSource(null);
      setLoading(false);
      return;
    }

    if (u.id === 'local-admin') {
      setIsAdmin(true);
      setAuthSource('local');
      setLoading(false);
      return;
    }

    if (u.user_metadata?.is_admin === true) {
      setIsAdmin(true);
      setAuthSource('supabase');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setIsAdmin(false);
      setAuthSource('supabase');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', u.id)
        .single();

      setIsAdmin(!error && data?.is_admin === true);
      setAuthSource('supabase');
    } catch {
      setIsAdmin(false);
      setAuthSource('supabase');
    }
    setLoading(false);
  }, [applyLocalSession]);

  const refreshAuth = useCallback(async () => {
    const localSession = getLocalAdminSession();
    if (localSession) {
      setUser(createLocalUser(localSession));
      setIsAdmin(true);
      setAuthSource('local');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setUser(null);
      setIsAdmin(false);
      setAuthSource(null);
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      await checkAdmin(session?.user ?? null);
    } catch {
      setUser(null);
      setIsAdmin(false);
      setAuthSource(null);
      setLoading(false);
    }
  }, [checkAdmin]);

  useEffect(() => {
    refreshAuth();

    const onLocalAuthChange = () => refreshAuth();
    window.addEventListener('local-auth-change', onLocalAuthChange);

    if (!isSupabaseConfigured()) {
      return () => window.removeEventListener('local-auth-change', onLocalAuthChange);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (getLocalAdminSession()) return;
      setUser(session?.user ?? null);
      checkAdmin(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('local-auth-change', onLocalAuthChange);
    };
  }, [refreshAuth, checkAdmin]);

  const signOut = useCallback(async () => {
    clearLocalAdminSession();
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore network errors on sign out
      }
    }
    setUser(null);
    setIsAdmin(false);
    setAuthSource(null);
  }, []);

  return { user, isAdmin, loading, authSource, signOut };
}
