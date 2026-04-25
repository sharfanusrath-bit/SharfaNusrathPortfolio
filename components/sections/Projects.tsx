'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Globe, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState<any[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error) setProjects(data || []);
    }
    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="projects" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-50 dark:bg-slate-900/10">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <motion.div variants={cardVariants} className="space-y-6 text-center md:text-left">
              <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">Selected Work</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
                Aesthetic Creations
              </h3>
              <div className="h-1 w-24 bg-[#ed6094] mx-auto md:mx-0" />
            </motion.div>
            {isAdmin && (
              <button 
                className="flex items-center gap-2 px-8 py-4 bg-[#ed6094] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-[#ed6094]/30 hover:scale-105 transition-all"
                onClick={() => document.getElementById('admin-project-trigger')?.click()}
              >
                <Plus size={18} /> New Project
              </button>
            )}
          </div>

          {/* Projects Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {projects.length === 0 ? (
              <div className="col-span-full py-20 text-center text-[#282828]/40 border-2 border-dashed border-[#e2e2df] rounded-[2.5rem]">
                <p className="font-serif italic text-xl">Projects are surfacing soon...</p>
              </div>
            ) : (
              projects.map((project, idx) => (
                <motion.div key={project.id} variants={cardVariants} className="h-full">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden h-full flex flex-col group border border-[#e2e2df] hover:shadow-2xl transition-all duration-500 relative">

                    {/* Image Container */}
                    <div className="h-80 relative overflow-hidden bg-[#f5f3ee]">
                      <div className="absolute inset-0 bg-[#282828]/5 group-hover:bg-transparent transition-colors z-10" />
                      <img 
                        src={project.image_url || '/placeholder.png'} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />

                      {/* Floating Tech Badges */}
                      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 z-20">
                        {(project.technologies || []).slice(0, 4).map((tech: string, tIdx: number) => (
                          <span key={tIdx} className="px-4 py-2 bg-white/90 backdrop-blur-sm text-[#282828] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-[#e2e2df]/50">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 flex-1 flex flex-col">
                      <h3 className="text-3xl font-serif font-bold text-[#282828] mb-6 group-hover:text-[#ed6094] transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-[#282828]/70 text-base leading-relaxed mb-10 flex-1 font-sans">
                        {project.description}
                      </p>

                      {/* Links */}
                      <div className="flex gap-4 pt-8 mt-auto border-t border-[#e2e2df]">
                        {project.github_link && (
                          <motion.a
                            href={project.github_link}
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#282828] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#ed6094] transition-colors shadow-lg"
                            whileHover={{ y: -5 }}
                          >
                            <Github size={18} />
                            Repository
                          </motion.a>
                        )}

                        {project.live_link && (
                          <motion.a
                            href={project.live_link}
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-3 py-4 border-2 border-[#282828] text-[#282828] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#282828] hover:text-white transition-all shadow-md"
                            whileHover={{ y: -5 }}
                          >
                            <Globe size={18} />
                            Live Demo
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
