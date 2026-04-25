'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#certificates', label: 'Certificates' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleAdminToggle = () => {
    window.dispatchEvent(new CustomEvent('toggle-admin-panel'));
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'py-4 bg-[#f5f3ee]/90 backdrop-blur-xl border-b border-[#e2e2df] shadow-sm'
        : 'py-8 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        {/* Left Side Group: Logo + Admin */}
        <div className="flex items-center gap-6">
           {/* Logo Beside Admin */}
          <motion.a
            href="#home"
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-serif text-[#282828] flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-[#ed6094] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#ed6094]/30 group-hover:rotate-12 transition-transform">SN</div>
          </motion.a>

          <button
            onClick={handleAdminToggle}
            className="flex items-center gap-2 px-6 py-2 bg-[#282828] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:bg-black transition-all"
          >
            <User size={14} />
            {user ? (isAdmin ? 'Admin' : 'Account') : 'Login'}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#282828] hover:text-[#ed6094] transition-all relative group"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#ed6094] transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#282828] hover:bg-black/10 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden bg-[#f5f3ee] border-b border-[#e2e2df] shadow-2xl overflow-hidden"
          >
            <div className="px-10 py-12 flex flex-col gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-serif font-black text-[#282828] hover:text-[#ed6094] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
