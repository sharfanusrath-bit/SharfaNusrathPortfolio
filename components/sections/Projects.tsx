'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from '@/components/Tilt';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      title: 'Forensic degital evidence storage Platform',
      description: 'A secure blockchain based platform for storing digital evidences and chain of custody management',
      technologies: ['HTML', 'CSS', 'javascript', 'django', 'MySQl', 'Ethereum-Ganache', 'Anaconda'],
      image: <img src="/forensicphoto.png" />,
      githubLink: 'https://github.com/sharfanusrath-bit/App.git',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'AI Text-Classifier',
      description: 'A machine learning model for classifying text into predefined categories',
      technologies: ['Python', 'TensorFlow', 'NLP', 'Scikit-learn'],
      image: <img src="/aitextclassifierphoto.png" />,
      githubLink: 'https://github.com/sharfanusrath-bit/AI-Text-Classifier.git',
      color: 'from-blue-500 to-cyan-500',
      livelink:'https://text-classifier-app-3usp.onrender.com/',
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
    <section
      id="projects"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={cardVariants} className="flex items-center gap-4">
            <div className="h-1 w-16 bg-gradient-primary rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
          </motion.div>

          {/* Projects Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, idx) => (
              <Tilt key={idx} max={20} scale={1.05}>
                <motion.div variants={cardVariants} className="h-full">
                  <div className="glass-effect rounded-2xl overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all group">
                    {/* Image/Icon */}
                    <div className={`h-40 bg-gradient-to-br ${project.color} relative overflow-hidden flex items-center justify-center`}>
                      <motion.div
                        className="text-8xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {project.image}
                      </motion.div>

                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1 text-xs font-medium bg-purple-100/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <motion.a
                          href={project.githubLink}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 border border-purple-300/50 dark:border-purple-500/50 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-purple-100/10 transition-colors"
                        >
                          Code
                          <Github size={16} />
                        </motion.a>
                        <motion.a
                          href={project.livelink}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 border border-green-300/50 dark:border-green-500/50 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-green-100/10 transition-colors"
                        >
                          Live Demo
                          <ExternalLink size={16} />
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
