'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Github, ExternalLink, Edit2, Trash2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error) setProjects(data || []);
    }
    fetchProjects();
  }, []);

  const handleCreate = () => {
    window.dispatchEvent(new CustomEvent('open-admin-modal', { detail: { type: 'project' } }));
  };

  const handleEdit = (project: any) => {
    // This is a bit tricky since AdminSidebarToggle manages the modal.
    // I'll update AdminSidebarToggle to listen for edit events too.
    window.dispatchEvent(new CustomEvent('open-admin-modal', {
      detail: { type: 'project', data: project }
    }));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project forever?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="projects" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-32">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <motion.div variants={cardVariants} className="space-y-6 text-center md:text-left">
              <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">Projects</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
                My Creations
              </h3>
              <div className="h-1 w-24 bg-[#ed6094] mx-auto md:mx-0" />
            </motion.div>
            {isAdmin && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-8 py-4 bg-[#ed6094] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-black/30 hover:scale-105 transition-all text-sm"
              >
                <Plus size={18} /> New Project
              </button>
            )}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {projects.length === 0 ? (
              <p className="col-span-full text-center py-20 text-[#282828]/40 italic font-serif">My creations are loading...</p>
            ) : (
              projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={cardVariants}
                  className="group relative"
                >
                  <div className="relative rounded-[2.5rem] overflow-hidden bg-white border border-[#e2e2df] shadow-sm hover:shadow-2xl transition-all duration-700">
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-6 right-6 z-30 flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-3 bg-white/90 backdrop-blur-md rounded-full text-[#ed6094] hover:bg-[#282828] hover:text-white transition-all shadow-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-3 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {/* Image Container */}
                    <div className="h-80 relative overflow-hidden bg-[#f5f3ee]">
                      <div className="absolute inset-0 bg-[#282828]/5 group-hover:bg-transparent transition-colors z-10" />
                      <img
                        src={project.image_url || '/placeholder.png'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Floating Tech Badges */}
                      <div className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-2">
                        {project.technologies?.map((tech: string) => (
                          <span key={tech} className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#282828] text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 space-y-6">
                      <h4 className="text-3xl font-serif font-bold text-[#282828] group-hover:text-black transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-[#282828]/60 text-base leading-relaxed font-medium line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-6 pt-4">
                        {project.github_link && (
                          <a href={project.github_link} target="_blank" className="p-3 border border-[#e2e2df] rounded-full text-[#282828] hover:bg-[#282828] hover:text-white transition-all">
                            <Github size={20} />
                          </a>
                        )}
                        {project.live_link && (
                          <a href={project.live_link} target="_blank" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#282828] hover:gap-4 transition-all pb-1 border-b-2 border-black/10 hover:border-black">
                            Live Experience <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
