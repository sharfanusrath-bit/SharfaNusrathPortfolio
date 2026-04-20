'use client';

import { motion } from 'framer-motion';

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f5f3ee]">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#b3b4b010_1px,transparent_1px),linear-gradient(to_bottom,#b3b4b010_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Floating spheres - matching the brand palette */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-[#ed6094]/5 rounded-full blur-[100px]"
        animate={{
          y: [0, -50, 0],
          x: [0, 40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#f6e1d6]/20 rounded-full blur-[120px]"
        animate={{
          y: [0, 60, 0],
          x: [0, -40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-[#b3b4b0]/5 rounded-full blur-[100px]"
        animate={{
          y: [0, -30, 0],
          x: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Accent elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
    </div>
  );
};

export default FloatingShapes;
