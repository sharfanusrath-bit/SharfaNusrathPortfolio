'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from '@/components/Tilt';
import { Code2, Server, Wrench, Cpu } from 'lucide-react';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: <Code2 className="w-10 h-10 text-[#ed6094]" />,
      skills: ['HTML', 'CSS', 'React', 'Next.js', 'JavaScript', 'Tailwind CSS'],
    },
    {
      title: 'Backend & Database',
      icon: <Server className="w-10 h-10 text-[#b3b4b0]" />,
      skills: ['Node.js', 'Django', 'MongoDB', 'PostgreSQL'],
    },
    {
      title: 'AI & Engineering Tools',
      icon: <Cpu className="w-10 h-10 text-[#282828]" />,
      skills: ['Git', 'VS Code', 'Vercel', 'AI Integration', 'Prompt Eng.'],
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
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={cardVariants} className="text-center space-y-4">
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase mb-4">Expertise</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-black text-[#282828] tracking-tight">
              Technical Proficiency
            </h3>
            <div className="h-1 w-24 bg-[#ed6094] mx-auto" />
          </motion.div>

          {/* Skills Grid */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillCategories.map((category, catIdx) => (
              <Tilt key={catIdx} max={10} scale={1.02}>
                <motion.div variants={cardVariants} className="h-full">
                  <div className="bg-white border border-[#e2e2df] rounded-[2rem] p-10 h-full flex flex-col group relative overflow-hidden shadow-sm hover:shadow-xl hover:border-[#ed6094]/30 transition-all duration-500">
                    {/* Icon */}
                    <div className="mb-8 p-5 bg-[#f5f3ee] rounded-2xl w-fit group-hover:bg-[#ed6094] group-hover:text-white transition-all duration-500">
                      {category.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-serif font-bold text-[#282828] mb-8 group-hover:text-[#ed6094] transition-colors">
                      {category.title}
                    </h3>

                    {/* Skills List */}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      {category.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-5 py-2 bg-[#f5f3ee] border border-[#e2e2df] rounded-full text-xs font-black uppercase tracking-widest text-[#282828]/60 hover:border-[#ed6094] hover:text-[#ed6094] transition-all cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
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

export default Skills;
