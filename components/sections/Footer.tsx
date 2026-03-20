'use client';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: <FaGithub size={22} />, label: 'GitHub', href: 'https://github.com/sharfanusrath-bit', color: 'hover:text-slate-700 dark:hover:text-slate-300' },
    { icon: <FaLinkedin size={22} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/sharfa-nusrath-026600378/', color: 'hover:text-blue-600' },
  ];

  const currentYear = new Date().getFullYear();

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

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <footer className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-8"
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Column */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">SN</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Building beautiful web experiences with modern technologies. Full-stack developer passionate about creating scalable
                solutions.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Projects', 'Contact'].map((link, idx) => (
                  <li key={idx}>
                    <motion.a
                      href={`#${link.toLowerCase()}`}
                      className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Follow Me</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full glass-effect flex items-center justify-center text-lg ${social.color} transition-colors`}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
          />

          {/* Copyright & Attribution */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <p>
              © {currentYear} Sharfa Nusrath. All rights reserved. Built with React, Next.js & Tailwind CSS.
            </p>
            <div className="flex gap-6">
              <motion.a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
                whileHover={{ underline: true }}
              >
                Privacy
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
                whileHover={{ underline: true }}
              >
                Terms
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variants={itemVariants}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto w-12 h-12 rounded-full glass-effect flex items-center justify-center text-xl hover:shadow-lg transition-shadow"
            title="Back to top"
          >
            ↑
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
