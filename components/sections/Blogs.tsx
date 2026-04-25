'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (!error) setBlogs(data || []);
    }
    fetchBlogs();
  }, []);

  return (
    <section id="blogs" className="py-32 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">My Thoughts</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
              Latest Insights
            </h3>
            <div className="h-1 w-24 bg-[#ed6094] mx-auto md:mx-0" />
          </div>
          {isAdmin && (
            <button 
              onClick={() => document.getElementById('admin-blog-trigger')?.click()}
              className="flex items-center gap-2 px-8 py-4 bg-[#ed6094] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-[#ed6094]/30 hover:scale-105 transition-all"
            >
              <Plus size={18} /> New Publication
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.length === 0 ? (
            <div className="col-span-full py-20 text-center text-[#282828]/40 border-2 border-dashed border-[#e2e2df] rounded-[2.5rem]">
              <p className="font-serif italic text-xl">The thinking journal is being updated...</p>
            </div>
          ) : (
            blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-[#e2e2df] rounded-[2.5rem] p-10 hover:border-[#ed6094]/30 hover:shadow-2xl transition-all duration-500 group relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ed6094]/5 rounded-bl-full group-hover:bg-[#ed6094]/10 transition-colors" />
                
                <span className="inline-block px-3 py-1 bg-[#f5f3ee] text-[#ed6094] text-[10px] font-black uppercase tracking-widest rounded-full mb-8">
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                
                <h4 className="text-2xl font-serif font-bold text-[#282828] mb-6 group-hover:text-[#ed6094] transition-colors leading-tight">
                  {blog.title}
                </h4>
                
                <p className="text-[#282828]/60 text-base line-clamp-3 mb-10 leading-relaxed font-sans">
                  {blog.content}
                </p>
                
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#282828] hover:text-[#ed6094] transition-all group/btn">
                  Read Journal <ArrowUpRight size={18} className="transform transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
