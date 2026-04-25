'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [experiences, setExperiences] = useState<any[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchExperiences() {
      const { data, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
      if (!error) setExperiences(data || []);
    }
    fetchExperiences();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const handleCreate = () => {
    window.dispatchEvent(new CustomEvent('open-admin-modal', { detail: { type: 'experience' } }));
  };

  return (
    <section id="experience" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative bg-transparent">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-24"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">My Milestones and Learnings</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
                Professional Journey
              </h3>
              <div className="h-1 w-24 bg-[#ed6094] mx-auto md:mx-0" />
            </div>
            {isAdmin && (
              <button 
                onClick={handleCreate}
                className="flex items-center gap-2 px-8 py-4 bg-[#282828] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-black/30 hover:scale-105 transition-all"
              >
                <Plus size={18} /> New Milestone
              </button>
            )}
          </div>

          {/* Timeline Wrapper */}
          <div className="relative space-y-12">
            {/* Central Line */}
            <motion.div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#e2e2df] transform md:-translate-x-1/2"
              initial={{ height: 0 }}
              animate={isInView ? { height: '100%' } : { height: 0 }}
              transition={{ duration: 1 }}
            />

            {experiences.length === 0 ? (
              <div className="py-20 text-center text-[#282828]/40 border-2 border-dashed border-[#e2e2df] rounded-[2rem]">
                <p className="font-serif italic text-xl">Timeline details are being gathered...</p>
              </div>
            ) : (
              experiences.map((item, idx) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={`relative flex items-center gap-8 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Content Card Side */}
                  <div className="md:w-1/2">
                    <div className={`pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                      <div className="bg-white border border-[#e2e2df] rounded-[2rem] p-10 hover:border-[#282828]/30 hover:shadow-2xl transition-all duration-500 shadow-sm relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#282828]/5 rounded-bl-full group-hover:bg-[#282828]/10 transition-colors" />

                        <span className="inline-block px-4 py-1 bg-[#f5f3ee] text-[#282828] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                          {item.duration}
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-[#282828] mb-2">{item.title}</h3>
                        <p className="text-[#282828] font-black uppercase tracking-widest text-[10px] mb-4 opacity-60">{item.company}</p>
                        <p className="text-[#282828]/70 text-base leading-relaxed font-sans font-medium">{item.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="absolute left-0 md:left-1/2 w-14 h-14 flex items-center justify-center transform -translate-x-0 md:-translate-x-1/2">
                    <div className="w-14 h-14 rounded-full bg-white border-2 border-[#282828] flex items-center justify-center shadow-2xl z-20 text-[#282828]">
                      {item.title.toLowerCase().includes('b.tech') || item.title.toLowerCase().includes('degree') ? <GraduationCap size={24} /> : <Briefcase size={24} />}
                    </div>
                  </div>

                  {/* Empty Side for Spacing */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
