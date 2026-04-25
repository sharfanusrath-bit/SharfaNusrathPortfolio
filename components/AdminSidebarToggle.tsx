'use client';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LayoutDashboard, LogOut, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import AdminModals from './AdminModals';

export default function AdminSidebarToggle() {
  const { user, isAdmin, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'blog' | 'experience' | 'gallery' | 'project' | 'certificate' | null>(null);
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    let result;
    if (authMode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password, options: { data: { is_admin: false } } });
      if (!result.error) alert('Account created! Please ask an owner to grant admin access or update the users table in Supabase.');
    }

    if (result.error) alert(result.error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      {!activeModal && (
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[60] bg-[#282828] text-white p-3 rounded-r-2xl shadow-2xl hover:bg-[#ed6094] transition-colors group"
        >
          <Settings className="group-hover:rotate-90 transition-transform" size={20} />
        </motion.button>
      )}

      {/* Admin Modals */}
      <AdminModals 
        type={activeModal} 
        onClose={() => setActiveModal(null)} 
        onSuccess={() => {
          setActiveModal(null);
          // Small delay before reload to ensure DB propagates
          setTimeout(() => window.location.reload(), 500);
        }}
      />

      {/* Sidebar Drawer */}
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
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[#ed6094]/10 rounded-full text-[#ed6094]">
                  <X size={20} />
                </button>
              </div>

              {user ? (
                <div className="flex-1 flex flex-col">
                  {isAdmin ? (
                    <div id="admin-panel" className="space-y-4">
                      <div className="bg-white p-6 rounded-3xl border border-[#e2e2df] mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#ed6094] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#ed6094]/30">
                            <UserIcon size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#282828]/40 uppercase tracking-widest">Administrator</p>
                            <p className="text-sm font-bold text-[#282828] truncate max-w-[150px]">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
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
                            className="flex items-center gap-4 p-4 bg-white border border-[#e2e2df] rounded-2xl hover:border-[#ed6094] hover:shadow-xl hover:shadow-[#ed6094]/5 transition-all text-left group"
                          >
                            <div className="w-10 h-10 bg-[#f5f3ee] rounded-xl flex items-center justify-center text-[#282828] group-hover:bg-[#ed6094] group-hover:text-white transition-colors">
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
                          className="flex items-center gap-4 p-4 bg-[#282828] text-white rounded-2xl hover:bg-[#ed6094] transition-all mt-4"
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
                      <p className="text-xs text-[#ed6094] font-bold mt-4">Please set is_admin to TRUE in Supabase for this user.</p>
                    </div>
                  )}

                  <div className="mt-auto pt-8">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-[#e2e2df] text-[#282828] text-xs font-bold uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
                    >
                      <LogOut size={16} /> Logout session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'text-[#ed6094] border-b-2 border-[#ed6094]' : 'text-[#282828]/40'}`}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'text-[#ed6094] border-b-2 border-[#ed6094]' : 'text-[#282828]/40'}`}
                    >
                      New Account
                    </button>
                  </div>

                  <p className="text-sm text-[#282828]/60 mb-8 leading-relaxed italic">
                    {authMode === 'login' ? 'Sign in to access your administrative dashboard.' : 'Enter your details to register as a new site authority.'}
                  </p>

                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#282828]/40 uppercase tracking-[0.2em] mb-2 block pl-1">Email</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 bg-white border border-[#e2e2df] rounded-2xl text-sm focus:outline-none focus:border-[#ed6094] transition-colors"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#282828]/40 uppercase tracking-[0.2em] mb-2 block pl-1">Password</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 bg-white border border-[#e2e2df] rounded-2xl text-sm focus:outline-none focus:border-[#ed6094] transition-colors"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={authLoading}
                      className="w-full p-4 bg-[#ed6094] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-[#ed6094]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
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
