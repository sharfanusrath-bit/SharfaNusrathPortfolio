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
import { LayoutDashboard, LogOut, X, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminModals from './AdminModals';

export default function AdminSidebarToggle() {
  const { user, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'blog' | 'experience' | 'gallery' | 'project' | 'certificate' | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleOpenModal = (e: any) => {
      if (e.detail?.type) {
        setInitialData(e.detail.data || null);
        setActiveModal(e.detail.type);
        setIsOpen(true);
      }
    };

    window.addEventListener('toggle-admin-panel', handleToggle);
    window.addEventListener('open-admin-modal', handleOpenModal);
    return () => {
      window.removeEventListener('toggle-admin-panel', handleToggle);
      window.removeEventListener('open-admin-modal', handleOpenModal);
    };
  }, []);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setAuthMessage({ type: 'error', text: 'Enter your email above first, then click Forgot Password.' });
      return;
    }

    if (!isSupabaseConfigured()) {
      setAuthMessage({ type: 'error', text: 'Supabase is not connected. Cannot send reset email.' });
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
      setAuthMessage({
        type: 'success',
        text: 'Password reset email sent! Check your inbox (and spam folder), then sign in with the new password.',
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (authMode === 'signup') {
      if (!isSupabaseConfigured()) {
        setAuthMessage({
          type: 'error',
          text: 'Registration needs Supabase. Use Sign In with your portfolio admin account instead.',
        });
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
          setAuthMessage({
            type: 'info',
            text: formatAuthError(result.error.message, 'signup'),
          });
        } else {
          setAuthMessage({ type: 'error', text: formatAuthError(result.error.message, 'signup') });
        }
        setAuthLoading(false);
        return;
      }

      // Auto-login when email confirmation is disabled
      if (result.data.session) {
        setAuthMessage({ type: 'success', text: 'Account created and signed in!' });
        setIsOpen(false);
        setAuthLoading(false);
        return;
      }

      setAuthMode('login');
      setAuthMessage({
        type: 'info',
        text: 'Account created! Check your email to confirm, then Sign In. Or run supabase_fix_admin.sql in Supabase to confirm your email instantly.',
      });
      setAuthLoading(false);
      return;
    }

    // Sign in: Supabase first, then local admin fallback for portfolio owner
    if (isSupabaseConfigured()) {
      try {
        const result = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (!result.error) {
          setIsOpen(false);
          setAuthLoading(false);
          return;
        }

        if (!isNetworkAuthError(result.error.message)) {
          setAuthMessage({ type: 'error', text: formatAuthError(result.error.message, 'login') });
          setAuthLoading(false);
          return;
        }
      } catch {
        // fall through to local admin login
      }
    }

    if (validateLocalAdminCredentials(normalizedEmail, password)) {
      setLocalAdminSession(normalizedEmail);
      setAuthMessage({
        type: 'info',
        text: 'Signed in with offline admin. To save to database, sign in with your Supabase email and password.',
      });
      setIsOpen(false);
    } else {
      setAuthMessage({
        type: 'error',
        text: isSupabaseConfigured()
          ? 'Sign in failed. Your account may already exist — try Forgot Password, or confirm your email in Supabase.'
          : 'Database is offline. Use portfolio admin: sharfanusrath@gmail.com / Sharfa@Admin2026',
      });
    }

    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    setAuthMessage(null);
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
          setTimeout(() => window.location.reload(), 500);
        }}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#f5f3ee] border-r border-[#e2e2df] z-[80] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-xl font-serif font-bold text-[#282828]">Control Center</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-full text-[#282828]">
                  <X size={20} />
                </button>
              </div>

              {user ? (
                <div className="flex-1 flex flex-col">
                  {isAdmin ? (
                    <div id="admin-panel" className="space-y-4">
                      <div className="bg-white p-6 rounded-3xl border border-[#e2e2df] mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#282828] rounded-full flex items-center justify-center text-white shadow-lg shadow-black/30">
                            <UserIcon size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#282828]/40 uppercase tracking-widest">Administrator</p>
                            <p className="text-sm font-bold text-[#282828] truncate max-w-[150px]">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar text-[#282828]">
                        {[
                          { id: 'blog', label: 'New Blog', icon: '✍️', desc: 'Share thoughts' },
                          { id: 'experience', label: 'Add Experience', icon: '💼', desc: 'Update journey' },
                          { id: 'project', label: 'New Project', icon: '🚀', desc: 'Showcase work' },
                          { id: 'certificate', label: 'New Certificate', icon: '🏆', desc: 'Add recognition' },
                          { id: 'gallery', label: 'Add Gallery', icon: '🖼️', desc: 'Upload visual' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            id={`admin-${item.id}-trigger`}
                            onClick={() => setActiveModal(item.id as any)}
                            className="flex items-center gap-4 p-4 bg-white border border-[#e2e2df] rounded-2xl hover:border-black hover:shadow-xl hover:shadow-black/5 transition-all text-left group"
                          >
                            <div className="w-10 h-10 bg-[#f5f3ee] rounded-xl flex items-center justify-center text-[#282828] group-hover:bg-[#282828] group-hover:text-white transition-colors">
                              <span>{item.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#282828]">{item.label}</p>
                              <p className="text-[10px] text-[#282828]/40 font-bold uppercase tracking-widest">{item.desc}</p>
                            </div>
                          </button>
                        ))}

                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 p-4 bg-[#282828] text-white rounded-2xl hover:bg-black transition-all mt-4"
                        >
                          <LayoutDashboard size={20} />
                          <span className="text-sm font-bold">Manage Database</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-3xl border border-[#e2e2df]">
                      <p className="text-sm font-bold text-[#282828]">Viewer Access</p>
                      <p className="text-xs text-[#282828]/60 mt-1">You are logged in as {user.email}</p>
                      <p className="text-xs text-[#282828] font-bold mt-4 italic">
                        Run supabase_fix_admin.sql in Supabase SQL Editor to grant admin access.
                      </p>
                    </div>
                  )}

                  <div className="mt-auto pt-8">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-[#e2e2df] text-[#282828] text-xs font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                      <LogOut size={16} /> Logout session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-4 mb-8">
                    <button
                      onClick={() => { setAuthMode('login'); setAuthMessage(null); }}
                      className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'text-black border-b-2 border-black' : 'text-[#282828]/40'}`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setAuthMode('signup'); setAuthMessage(null); }}
                      className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'text-black border-b-2 border-black' : 'text-[#282828]/40'}`}
                    >
                      New Account
                    </button>
                  </div>

                  <p className="text-sm text-[#282828]/60 mb-4 leading-relaxed italic">
                    {authMode === 'login'
                      ? 'Sign in with the email and password you registered in Supabase.'
                      : 'Only create a new account if you have not registered before.'}
                  </p>

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
                    <div>
                      <label className="text-[10px] font-bold text-[#282828]/40 uppercase tracking-[0.2em] mb-2 block pl-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 bg-white border border-[#e2e2df] rounded-2xl text-sm focus:outline-none focus:border-black transition-colors text-[#282828]"
                        placeholder="sharfanusrath@gmail.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#282828]/40 uppercase tracking-[0.2em] mb-2 block pl-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 bg-white border border-[#e2e2df] rounded-2xl text-sm focus:outline-none focus:border-black transition-colors text-[#282828]"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>

                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={authLoading}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#ed6094] hover:underline disabled:opacity-50"
                      >
                        Forgot Password?
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full p-4 bg-[#282828] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg hover:bg-black transition-all disabled:opacity-50"
                    >
                      {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In' : 'Register Account'}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
