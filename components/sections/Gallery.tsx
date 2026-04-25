'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Plus, Maximize2 } from 'lucide-react';

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error) setItems(data || []);
    }
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="py-32 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">Moments</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
              Visual Archive
            </h3>
            <div className="h-1 w-24 bg-[#ed6094] mx-auto md:mx-0" />
          </div>
          {isAdmin && (
            <button 
              onClick={() => document.getElementById('admin-gallery-trigger')?.click()}
              className="flex items-center gap-2 px-8 py-4 bg-[#ed6094] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-[#ed6094]/30 hover:scale-105 transition-all"
            >
              <Plus size={18} /> New Visual
            </button>
          )}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          {items.length === 0 ? (
            <div className="col-span-full py-20 text-center text-[#282828]/40 border-2 border-dashed border-[#e2e2df] rounded-[2.5rem]">
              <p className="font-serif italic text-xl">The visual archive is currently pending...</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative break-inside-avoid bg-white p-6 border border-[#e2e2df] rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-[#ed6094]/20 transition-all duration-500 group"
              >
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <img 
                    src={item.image_url} 
                    alt={item.caption || 'Gallery image'} 
                    className="w-full h-auto grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <Maximize2 className="text-white w-10 h-10 transform translate-y-4 group-hover:translate-y-0 transition-transform" />
                  </div>
                </div>
                {item.caption && (
                  <div className="mt-6 px-2">
                    <p className="text-[10px] font-black text-[#ed6094] uppercase tracking-[0.2em] mb-1">Observation</p>
                    <p className="text-sm font-bold text-[#282828] leading-relaxed italic">{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
