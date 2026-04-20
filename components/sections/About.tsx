'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Heart } from 'lucide-react';

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
      className="py-32 px-4 sm:px-6 lg:px-8 relative bg-transparent"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="space-y-6 text-center">
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">Personal Story</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-black text-[#282828]">
              Behind the Code
            </h3>
            <div className="h-1 w-20 bg-[#ed6094] mx-auto" />
          </motion.div>

          {/* Content Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-[#e2e2df] rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ed6094]/5 rounded-bl-full" />
            <div className="space-y-8 text-xl text-[#282828] leading-relaxed font-sans">
              <p>
                I'm a passionate full-stack developer with a strong foundation in modern web technologies. Currently pursuing my B.Tech at{' '}
                <span className="font-bold text-[#282828]">CMR College of Engineering</span>, where I've honed my
                skills in building scalable, user-centric applications.
              </p>

              <p>
                My journey in web development evolved into a passion for creating beautiful, functional interfaces and robust backend systems. I love working with <span className="text-[#ed6094] font-bold">React, Next.js, and AI-driven development practices</span>.
              </p>

              <p className="italic font-serif text-[#282828]">
                "I believe in continuous learning and building projects that make a real impact. Whether it's crafting pixel-perfect UIs or optimizing backend performance, I'm always up for the challenge."
              </p>
            </div>
          </motion.div>

          {/* Key Points */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Education', desc: 'B.Tech at CMR College', icon: <GraduationCap className="w-8 h-8 text-[#ed6094]"/> },
              { title: 'Focus', desc: 'Full Stack & AI', icon: <Target className="w-8 h-8 text-[#ed6094]"/> },
              { title: 'Passion', desc: 'Creative Systems', icon: <Heart className="w-8 h-8 text-[#ed6094]"/> },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white border border-[#e2e2df] rounded-[1.5rem] p-8 flex flex-col items-center text-center group hover:border-[#ed6094] transition-all duration-300 shadow-sm hover:shadow-xl"
                whileHover={{ y: -10 }}
              >
                <div className="mb-6 p-5 bg-[#f5f3ee] rounded-2xl group-hover:bg-[#ed6094] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-serif font-black text-xl text-[#282828] mb-3">{item.title}</h3>
                <p className="text-[#282828]/60 text-xs font-black uppercase tracking-widest leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
