'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const timeline = [
    {
      year: '2024-Present',
      title: 'B.Tech in CSE',
      company: 'CMR College of Engineering',
      description: 'Pursuing Bachelor of Technology in Computer Science and Engineering. Building strong fundamentals in data structures, algorithms, and web development.',
      icon: '🎓',
    },
    {
      year: '2026',
      title: 'Internship',
      company: '1stop.ai',
      description: 'Learned many things from top AI developers ',
      icon: '📚',
    },
    {
      year: 'March(2026)-Present',
      title: 'Intership ',
      company: 'EvolveX',
      description: 'Full Stack Developer Intern',
      icon: '💼',
    },

  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="experience"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="h-1 w-16 bg-gradient-primary rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Experience</h2>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-8 relative">
            {/* Vertical line */}
            <motion.div
              className="absolute left-8 md:left-1/2 top-0 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 opacity-30"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.8 }}
              style={{ transformOrigin: 'top' }}
            />

            {/* Timeline Items */}
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`flex gap-6 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Left side (for even) / Right side (for odd) */}
                <div className="md:w-1/2 flex justify-center md:justify-end">
                  <div className="md:pr-8 md:text-right w-full md:w-auto">
                    {/* Timeline dot */}
                    <motion.div
                      className="absolute left-0 md:left-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full glass-effect flex items-center justify-center text-3xl md:text-4xl transform -translate-x-8 md:-translate-x-1/2 z-10"
                      whileHover={{ scale: 1.1 }}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: idx * 0.1 + 0.3, type: 'spring' }}
                    >
                      {item.icon}
                    </motion.div>

                    <motion.div
                      className="glass-effect rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow"
                      whileHover={{ y: -5 }}
                    >
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{item.year}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-2 mb-1">{item.title}</h3>
                      <p className="text-purple-600 dark:text-purple-400 font-semibold text-sm mb-3">{item.company}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                    </motion.div>
                  </div>
                </div>

                {/* Right side (for even) / Left side (for odd) */}
                <div className="md:w-1/2 md:pl-8 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
