'use client';

import { motion } from 'framer-motion';

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-background" />

      {/* Floating spheres */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-40 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <motion.div
        className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Accent orbs */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-indigo-300/15 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-300/15 rounded-full blur-2xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
    </div>
  );
};

export default FloatingShapes;
