'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-8"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="h-1 w-16 bg-gradient-primary rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">About Me</h2>
          </motion.div>

          {/* Content Card */}
          <motion.div
            variants={itemVariants}
            className="glass-effect rounded-2xl p-8 md:p-12 hover:shadow-2xl transition-shadow"
            whileHover={{ y: -5 }}
          >
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              I'm a passionate full-stack developer with a strong foundation in modern web technologies. Currently pursuing my B.Tech at{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">CMR College of Engineering</span>, where I've honed my
              skills in building scalable, user-centric applications.
            </p>

            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              My journey in web development started with curiosity about how the web works, and it has evolved into a passion for creating
              beautiful, functional interfaces and robust backend systems. I love working with React, Next.js, JavaScript, modern
              development practices and AI tools.
            </p>

            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge
              with the developer community. I believe in continuous learning and building projects that make a real impact.
            </p>
          </motion.div>

          {/* Key Points */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Education', desc: 'B.Tech at CMR College of Engineering' },
              { title: 'Focus', desc: 'Full Stack Web Development And AI Integration' },
              { title: 'Passion', desc: 'Building scalable web apps' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="glass-effect rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
