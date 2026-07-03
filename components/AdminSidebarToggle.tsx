'use client';

import { useAuth } from '@/hooks/useAuth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  validateLocalAdminCredentials,
  setLocalAdminSession,
  isNetworkAuthError,
  isUserAlreadyRegistered,
  formatAuthError,
} from '@/lib/admin-auth';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdminModals from './AdminModals';

export default function AdminSidebarToggle() {
  const { user, isAdmin, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'blog' | 'experience' | 'gallery' | 'project' | 'certificate' | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const handleAuthToggle = () => setIsAuthOpen((prev) => !prev);
    const handleOpenModal = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type) {
        setInitialData(detail.data || null);
        setActiveModal(detail.type);
      }
    };

    window.addEventListener('toggle-auth-panel', handleAuthToggle);
    window.addEventListener('open-admin-modal', handleOpenModal);
    return () => {
      window.removeEventListener('toggle-auth-panel', handleAuthToggle);
      window.removeEventListener('open-admin-modal', handleOpenModal);
    };
  }, []);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setAuthMessage({ type: 'error', text: 'Enter your email above first, then click Forgot Password.' });
      return;
    }
    if (!isSupabaseConfigured()) {
      setAuthMessage({ type: 'error', text: 'Supabase is not connected.' });
      return;
    }

    setAuthLoading(true);
    setAuthMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/`,
    });
    setAuthLoading(false);

    if (error) {
      setAuthMessage({ type: 'error', text: formatAuthError(error.message, 'login') });
    } else {
      setAuthMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (authMode === 'signup') {
      if (!isSupabaseConfigured()) {
        setAuthMessage({ type: 'error', text: 'Registration needs Supabase.' });
        setAuthLoading(false);
        return;
      }

      const result = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: { data: { is_admin: true }, emailRedirectTo: `${window.location.origin}/` },
      });

      if (result.error) {
        if (isUserAlreadyRegistered(result.error.message)) {
          setAuthMode('login');
          setAuthMessage({ type: 'info', text: formatAuthError(result.error.message, 'signup') });
        } else {
          setAuthMessage({ type: 'error', text: formatAuthError(result.error.message, 'signup') });
        }
      } else if (result.data.session) {
        setAuthMessage({ type: 'success', text: 'Account created and signed in!' });
        setIsAuthOpen(false);
      } else {
        setAuthMode('login');
        setAuthMessage({ type: 'info', text: 'Account created! Confirm your email, then Sign In.' });
      }
      setAuthLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        const result = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        if (!result.error) {
          setIsAuthOpen(false);
          setAuthLoading(false);
          return;
        }
        if (!isNetworkAuthError(result.error.message)) {
          setAuthMessage({ type: 'error', text: formatAuthError(result.error.message, 'login') });
          setAuthLoading(false);
          return;
        }
      } catch {
        // fall through
      }
    }

    if (validateLocalAdminCredentials(normalizedEmail, password)) {
      setLocalAdminSession(normalizedEmail);
      setIsAuthOpen(false);
    } else {
      setAuthMessage({
        type: 'error',
        text: 'Sign in failed. Use your Supabase email and password, or click Forgot Password.',
      });
    }
    setAuthLoading(false);
  };

  return (
    <>
      <AdminModals
        type={activeModal}
        initialData={initialData}
        onClose={() => {
          setActiveModal(null);
          setInitialData(null);
        }}
        onSuccess={() => {
          setActiveModal(null);
          setInitialData(null);
          window.dispatchEvent(new CustomEvent('portfolio-content-updated'));
        }}
      />

      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthOpen(false)}
              className="absolute inset-0 bg-[#282828]/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-[#e2e2df] flex justify-between items-center bg-[#f5f3ee]">
                <h2 className="text-xl font-serif font-bold text-[#282828]">
                  {user ? 'Account' : 'Sign In'}
                </h2>
                <button onClick={() => setIsAuthOpen(false)} className="p-2 hover:bg-white rounded-full">
                  <X size={22} />
                </button>
              </div>

              <div className="p-8">
                {user ? (
                  <div className="space-y-6">
                    <p className="text-sm text-[#282828]/70">
                      Signed in as <strong>{user.email}</strong>
                      {isAdmin && (
                        <span className="block mt-2 text-[#ed6094] text-xs font-bold uppercase tracking-widest">
                          Admin access enabled
                        </span>
                      )}
                    </p>
                    <button
                      onClick={async () => {
                        await signOut();
                        setIsAuthOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#282828] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => { setAuthMode('login'); setAuthMessage(null); }}
                        className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest ${authMode === 'login' ? 'text-black border-b-2 border-black' : 'text-[#282828]/40'}`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => { setAuthMode('signup'); setAuthMessage(null); }}
                        className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest ${authMode === 'signup' ? 'text-black border-b-2 border-black' : 'text-[#282828]/40'}`}
                      >
                        Register
                      </button>
                    </div>

                    {authMessage && (
                      <div
                        className={`mb-4 p-4 rounded-2xl text-xs leading-relaxed ${
                          authMessage.type === 'error'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : authMessage.type === 'success'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {authMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl text-sm focus:outline-none focus:border-[#ed6094] text-[#282828] cursor-text"
                        placeholder="Email"
                        required
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl text-sm focus:outline-none focus:border-[#ed6094] text-[#282828] cursor-text"
                        placeholder="Password"
                        required
                        minLength={6}
                      />
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[10px] font-bold uppercase tracking-widest text-[#ed6094] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full p-4 bg-[#282828] text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-black disabled:opacity-50"
                      >
                        {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In' : 'Register'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
