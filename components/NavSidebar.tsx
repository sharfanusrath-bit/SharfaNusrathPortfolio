'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
];

export default function NavSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-nav-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-nav-sidebar', handleToggle);
  }, []);

  const handleNavClick = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-[#f5f3ee] border-r border-[#e2e2df] z-[95] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex justify-between items-center border-b border-[#e2e2df]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ed6094]">Navigate</p>
                <h2 className="text-xl font-serif font-bold text-[#282828] mt-1">Portfolio</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/10 rounded-full text-[#282828]"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="block px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-[#282828] hover:bg-white hover:text-[#ed6094] hover:shadow-md border border-transparent hover:border-[#e2e2df] transition-all"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {user && (
              <div className="p-6 border-t border-[#e2e2df] space-y-2">
                <p className="text-[10px] font-bold text-[#282828]/40 uppercase tracking-widest px-2 mb-3 truncate">
                  {user.email}
                </p>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#282828] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                  >
                    <LayoutDashboard size={16} />
                    Manage Database
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-[#e2e2df] text-[#282828] text-xs font-bold uppercase tracking-widest hover:bg-white transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
