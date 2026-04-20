'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from '@/components/Tilt';
import { ExternalLink, Github, Code2, Globe } from 'lucide-react';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      title: 'Forensic Digital Evidence Storage',
      description: 'A secure blockchain-based platform for storing digital evidence and chain of custody management.',
      technologies: ['Django', 'MySQL', 'Ethereum', 'Web3.js', 'Blockchain'],
      image: <img src="/forensicphoto.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />,
      githubLink: 'https://github.com/sharfanusrath-bit/App.git',
      accentColor: 'border-indigo-500/50',
    },
    {
      title: 'AI Text-Classifier',
      description: 'A high-accuracy machine learning model for classifying complex text data into categories.',
      technologies: ['Python', 'TensorFlow', 'NLP', 'Scikit-learn', 'React'],
      image: <img src="/aitextclassifierphoto.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />,
      githubLink: 'https://github.com/sharfanusrath-bit/AI-Text-Classifier.git',
      livelink: 'https://text-classifier-app-3usp.onrender.com/',
      accentColor: 'border-cyan-500/50',
    },
  ];

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
          <motion.div variants={cardVariants} className="space-y-6 text-center mb-20">
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">Selected Work</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-black text-[#282828] tracking-tight">
              Aesthetic Creations
            </h3>
            <div className="h-1 w-24 bg-[#ed6094] mx-auto" />
          </motion.div>

          {/* Projects Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {projects.map((project, idx) => (
              <motion.div key={idx} variants={cardVariants} className="h-full">
                <div className="bg-white rounded-[2.5rem] overflow-hidden h-full flex flex-col group border border-[#e2e2df] hover:shadow-2xl transition-all duration-500 relative">
                  
                  {/* Image Container */}
                  <div className="h-80 relative overflow-hidden bg-[#f5f3ee]">
                    <div className="absolute inset-0 bg-[#282828]/10 group-hover:bg-transparent transition-colors z-10" />
                    {project.image}
                    
                    {/* Floating Tech Badges */}
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 z-20">
                      {project.technologies.slice(0, 3).map((tech, tIdx) => (
                        <span key={tIdx} className="px-4 py-2 bg-[#f5f3ee] text-[#282828] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-[#e2e2df]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-12 flex-1 flex flex-col">
                    <h3 className="text-3xl font-serif font-black text-[#282828] mb-6 group-hover:text-[#ed6094] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-[#282828] text-base leading-relaxed mb-10 flex-1 font-sans">
                      {project.description}
                    </p>

                    {/* Links */}
                    <div className="flex gap-4 pt-8 mt-auto border-t border-[#e2e2df]">
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#282828] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#ed6094] transition-colors shadow-lg"
                        whileHover={{ y: -5 }}
                      >
                        <Github size={18} />
                        Repository
                      </motion.a>
                      
                      {project.livelink && (
                        <motion.a
                          href={project.livelink}
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
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
