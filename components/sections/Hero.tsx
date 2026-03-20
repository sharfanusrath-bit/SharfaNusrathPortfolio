'use client';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from '@/components/Tilt';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const roles = ['Full Stack Developer', 'AI Engineer'];
  const [displayedText, setDisplayedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = roles[roleIndex];

    if (!isDeleting && displayedText !== currentText) {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length + 1));
      }, isDeleting ? 50 : 100);
    }
    else if (!isDeleting && displayedText === currentText) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    }
    else if (isDeleting && displayedText !== '') {
      timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, displayedText.length - 1));
      }, 50);
    }
    else if (isDeleting && displayedText === '') {
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
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Profile Image with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <Tilt max={25} scale={1.05}>
              <div className="flex justify-center items-center">
                {/* Glowing border */}
                <div className="absolute inset-0bg-slate-300 dark:bg-slate-700 rounded-3xl opacity-75 blur-2xl" />

                {/* Inner circle with profile */}
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-1 h-full flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center text-center">
                    <img
                      src="/profile.jpeg"
                      alt="Sharfa Nusrath"
                      width={350}
                      height={350}
                      className="object-cover object-top rounded-3xl"
                    />
                  </div>
                </div>

                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full  opacity-50"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full opacity-40"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
            </Tilt>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col justify-center gap-6">
            {/* Greeting */}
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <div className="h-1 w-12 bg-gradient-primary rounded-full" />
              <span className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400">Welcome to my portfolio</span>
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                Hello, I'm{' '}
                <span className="gradient-primary bg-clip-text text-transparent">Sharfa Nusrath</span>
              </h1>
            </motion.div>

            {/* Typing Text */}
            <motion.div variants={itemVariants} className="min-h-16">
              <p className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-2xl md:text-3xl text-purple-600"
                >
                  |
                </motion.span>
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              B.Tech student at CMR College of Engineering building beautiful, scalable web experiences. Passionate about modern web
              technologies and creative problem-solving.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 flex-wrap">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-shadow"
              >
                View Projects
                <ArrowRight size={20} />
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 glass-effect text-slate-900 dark:text-white font-semibold rounded-full"
              >
                Contact Me
                <ArrowRight size={20} />
              </motion.a>
            </motion.div>

            {/* Social Icons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <motion.a
                href="https://github.com/sharfanusrath-bit"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-xl hover:text-purple-600"
              >
                <FaGithub size={22} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/sharfa-nusrath-026600378/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -5 }}
                className="w-12 h-12 rounded-full glass-effect flex items-center justify-center text-xl hover:text-blue-600"
              >
                <FaLinkedin size={22} />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
