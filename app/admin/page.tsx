'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Trash2, Edit, Home, Settings, Database, Briefcase, PenTool, Image as ImageIcon, Rocket, Award } from 'lucide-react';
import Link from 'next/link';

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'blogs' | 'experiences' | 'projects' | 'certificates' | 'gallery'>('blogs');
  const [items, setItems] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchItems();
    }
  }, [isAdmin, activeTab]);

  async function fetchItems() {
    setFetchLoading(true);
    const { data, error } = await supabase.from(activeTab).select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
    setFetchLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Permanently delete this item? This action cannot be undone.')) {
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) alert(error.message);
      else fetchItems();
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f5f3ee] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 border-4 border-[#ed6094]/20 border-t-[#ed6094] rounded-full animate-spin mb-6" />
      <p className="font-serif italic text-[#282828]/60">Verifying administrative credentials...</p>
    </div>
  );

  if (!user || !isAdmin) return null;

  const tabs = [
    { id: 'blogs', label: 'Blogs', icon: PenTool },
    { id: 'experiences', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Rocket },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#f5f3ee] flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white border-r border-[#e2e2df] p-10 flex flex-col hidden lg:flex">
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#282828] rounded-2xl flex items-center justify-center text-white group-hover:bg-[#ed6094] transition-colors">
              <Home size={20} />
            </div>
            <span className="font-serif font-black text-xl text-[#282828]">Sharfa.Site</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-[#282828]/40 uppercase tracking-[0.2em] mb-6 ml-4">Management</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-black transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#ed6094] text-white shadow-xl shadow-[#ed6094]/20' 
                  : 'text-[#282828]/60 hover:bg-[#f5f3ee] hover:text-[#282828]'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-[#e2e2df]">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-4 p-4 text-[#282828]/40 hover:text-red-500 hover:bg-red-50/50 rounded-2xl transition-all font-black text-sm"
          >
            <LogOut size={20} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-20 overflow-y-auto max-h-screen custom-scrollbar">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-[#ed6094]" size={24} />
              <h1 className="text-4xl font-serif font-black text-[#282828] tracking-tight">Database Explorer</h1>
            </div>
            <p className="text-[#282828]/40 font-bold uppercase tracking-[0.2em] text-[10px]">
              Managing <span className="text-[#ed6094]">{activeTab}</span> collection
            </p>
          </div>
          
          <button 
            onClick={() => {
              // Trigger the modal from the sidebar component if possible, 
              // or just use a redirect/message. For simplicity, we point to the sidebar.
              alert('Please use the quick-action triggers in the Floating Sidebar (Left) to add new content.');
            }}
            className="flex items-center gap-3 px-10 py-5 bg-[#282828] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#ed6094] hover:scale-105 transition-all"
          >
            <Plus size={20} /> Add New Entry
          </button>
        </header>

        {/* Dynamic Table List */}
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-[#e2e2df]">
          <div className="space-y-4">
            {fetchLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#ed6094]/10 border-t-[#ed6094] rounded-full animate-spin mx-auto" />
                <p className="font-serif italic text-xl text-[#282828]/40">Synchronizing with server...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-[#e2e2df] rounded-[2rem] space-y-4">
                <div className="w-16 h-16 bg-[#f5f3ee] rounded-full flex items-center justify-center mx-auto text-[#282828]/20">
                  <Database size={32} />
                </div>
                <p className="font-serif italic text-xl text-[#282828]/40">No entries found in this collection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white border border-[#e2e2df] rounded-[2rem] hover:border-[#ed6094]/30 hover:shadow-xl hover:shadow-[#ed6094]/5 transition-all group"
                  >
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      {item.image_url && (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#f5f3ee] flex-shrink-0">
                          <img src={item.image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-serif font-black text-[#282828] mb-1 group-hover:text-[#ed6094] transition-colors">
                          {item.title || item.caption || 'Untitled Entry'}
                        </h3>
                        <p className="text-[10px] font-black text-[#282828]/40 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ed6094]" />
                          {item.company || item.issuer || item.duration || 'General Record'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-100 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-20 text-center">
          <p className="text-[10px] font-black text-[#282828]/20 uppercase tracking-[0.3em]">
            Secure Portfolio Management System &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
