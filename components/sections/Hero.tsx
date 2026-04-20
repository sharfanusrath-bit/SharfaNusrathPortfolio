'use client';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from '@/components/Tilt';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const roles = ['Full Stack Developer', 'AI Engineer', 'Creative Designer'];
  const [displayedText, setDisplayedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = roles[roleIndex];

    if (!isDeleting && displayedText !== currentText) {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, 100);
    } else if (!isDeleting && displayedText === currentText) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    } else if (isDeleting && displayedText !== '') {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length - 1));
      }, 50);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, roleIndex]);

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
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Profile Image with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center md:justify-end order-2 md:order-1"
          >
            <Tilt max={15} scale={1.05}>
              <div className="relative group">
                {/* Glowing border */}
                <div className="absolute -inset-2 bg-[#ed6094] rounded-[2rem] blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

                {/* Inner circle with profile */}
                <div className="relative bg-white rounded-[2.5rem] p-6 shadow-2xl border border-[#e2e2df] overflow-hidden">
                  <div className="aspect-[4/5] w-full max-w-[450px] bg-[#f5f3ee] rounded-[2rem] flex items-center justify-center text-center overflow-hidden">
                    <img
                      src="/profile.jpeg"
                      alt="Sharfa Nusrath"
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Floating tags */}
                <motion.div
                  className="absolute -top-6 -right-6 px-8 py-4 bg-[#282828] text-white rounded-2xl shadow-2xl z-20"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Innovation</span>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 px-8 py-4 bg-[#ed6094] text-white rounded-2xl shadow-2xl z-20"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Aesthetics</span>
                </motion.div>
              </div>
            </Tilt>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col justify-center gap-8 order-1 md:order-2">
            {/* Greeting */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="w-16 h-[3px] bg-[#ed6094]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ed6094] scale-y-110">Available for Projects</span>
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <h1 className="text-6xl md:text-[7rem] font-serif font-bold text-[#282828] leading-[0.9] tracking-tighter">
                I'm <span className="text-[#ed6094]">Sharfa Nusrath</span>
              </h1>
            </motion.div>

            {/* Typing Text */}
            <motion.div variants={itemVariants} className="min-h-12 overflow-hidden py-2">
              <p className="text-2xl md:text-3xl font-bold text-[#282828] font-sans">
                <span className="text-[#ed6094]">{displayedText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block ml-2 h-8 w-1.5 bg-[#ed6094] align-middle"
                />
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-xl text-[#282828] leading-relaxed max-w-lg font-sans font-medium opacity-90">
              B.Tech student at CMR College of Engineering crafting <span className="text-[#ed6094] font-bold">high-performance</span>, visually stunning web experiences with Next.js and AI integrations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex gap-6 flex-wrap mt-4">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-[#ed6094] text-white font-black rounded-full shadow-2xl shadow-[#ed6094]/40 flex items-center gap-3 transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                View Works
                <ArrowRight size={18} strokeWidth={4} />
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, backgroundColor: '#f5f3ee', borderColor: '#ed6094' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-[#282828] font-black rounded-full border-2 border-[#282828] shadow-sm flex items-center gap-2 transition-all uppercase tracking-widest text-xs"
              >
                Hire Me
              </motion.a>
            </motion.div>

            {/* Social Icons */}
            <motion.div variants={itemVariants} className="flex gap-8 pt-6">
              <motion.a
                href="https://github.com/sharfanusrath-bit"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: '#ed6094' }}
                className="text-[#282828]/40 transition-all"
                aria-label="GitHub"
              >
                <FaGithub size={32} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/sharfa-nusrath-026600378/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: '#ed6094' }}
                className="text-[#282828]/40 transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={32} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


export default Hero;
