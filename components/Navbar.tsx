'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openNavSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-nav-sidebar'));
  };

  const openAuthPanel = () => {
    window.dispatchEvent(new CustomEvent('toggle-auth-panel'));
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-4 bg-[#f5f3ee]/90 backdrop-blur-xl border-b border-[#e2e2df] shadow-sm'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={openNavSidebar}
            className="p-3 rounded-2xl bg-white border border-[#e2e2df] text-[#282828] hover:border-[#ed6094] hover:text-[#ed6094] shadow-sm transition-all"
            aria-label="Open navigation menu"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>

          <motion.a
            href="#home"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-[#ed6094] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#ed6094]/30 group-hover:rotate-12 transition-transform">
              SN
            </div>
            <span className="hidden sm:block font-serif font-bold text-[#282828] text-lg">Sharfa</span>
          </motion.a>
        </div>

        {/* Right: Login */}
        <button
          onClick={openAuthPanel}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#282828] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:bg-black transition-all"
        >
          <User size={14} />
          {user ? (isAdmin ? 'Admin' : 'Account') : 'Login'}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
