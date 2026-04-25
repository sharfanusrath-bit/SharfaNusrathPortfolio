'use client';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <FaGithub size={24} />, label: 'GitHub', href: 'https://github.com/sharfanusrath-bit', color: 'text-[#ed6094]' },
    { icon: <FaLinkedin size={24} />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/sharfa-nusrath-026600378/', color: 'text-[#ed6094]' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#282828] text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ed6094]/10 rounded-bl-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-8">
            <h3 className="text-4xl font-serif font-black flex items-center gap-2">
              SHARFA<span className="text-[#ed6094]">.</span>
            </h3>
            <p className="text-[#b3b4b0] text-lg leading-relaxed max-w-md font-sans">
              B.Tech student at CMR College of Engineering crafting high-performance, visually stunning web experiences with Next.js and AI integrations.
            </p>
            <div className="flex gap-6">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} transition-colors p-2 border border-white/10 rounded-xl hover:border-[#ed6094]`}
                  whileHover={{ y: -5 }}
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ed6094]">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Skills', 'Projects', 'Certificates'].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-[#b3b4b0] hover:text-white transition-colors text-base font-sans"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Intro */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ed6094]">Connect</h4>
            <div className="space-y-4">
              <p className="text-[#b3b4b0] text-sm">Have a project in mind?</p>
              <a href="mailto:sharfanusrath@gmail.com" className="block text-xl font-serif hover:text-[#ed6094] transition-colors">
                sharfanusrath@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10 w-full mb-12" />

        {/* Copyright & Attribution */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[#b3b4b0] text-xs font-black uppercase tracking-[0.2em] text-center md:text-left">
            © {currentYear} Sharfa Nusrath. All rights reserved.
          </p>
          
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1, backgroundColor: '#ed6094' }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-full border-2 border-[#ed6094] flex items-center justify-center text-[#ed6094] hover:text-white transition-all shadow-2xl"
            title="Back to top"
          >
            <ArrowUp size={24} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

