'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin(u: User | null) {
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // First check metadata for speed
      if (u.user_metadata?.is_admin === true) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // If not in metadata, check the database table
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', u.id)
        .single();
      
      if (!error && data) {
        setIsAdmin(data.is_admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdmin(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAdmin(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
