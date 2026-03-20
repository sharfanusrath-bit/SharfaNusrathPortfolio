'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from '@/components/Tilt';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      title: 'Frontend',
      icon: '🎨',
      skills: ['HTML','CSS', 'React', 'Next.js', 'JavaScript', 'Tailwind CSS', ],
    },
    {
      title: 'Backend',
      icon: '⚙️',
      skills: ['Node.js', 'Django', 'MongoDB', ],
    },
    {
      title: 'Tools & Others',
      icon: '🛠️',
      skills: ['Git', 'AntiGravity', 'VS Code', 'Lovable', 'Vercel','AI & ML'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="skills"
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">My Skills</h2>
          </motion.div>

          {/* Skills Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {skillCategories.map((category, catIdx) => (
              <Tilt key={catIdx} max={15} scale={1.03}>
                <motion.div variants={cardVariants} className="h-full">
                  <div className="glass-effect rounded-2xl p-8 h-full flex flex-col hover:shadow-2xl transition-all group">
                    {/* Category Icon */}
                    <motion.div
                      className="text-5xl mb-4 inline-block"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {category.icon}
                    </motion.div>

                    {/* Category Title */}
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {category.title}
                    </h3>

                    {/* Skills List */}
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-300/30 dark:border-purple-500/30 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>

                    {/* Hover gradient line */}
                    <motion.div
                      className="mt-6 h-1 w-0 bg-gradient-primary rounded-full"
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
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

export default Skills;
