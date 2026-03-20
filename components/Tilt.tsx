'use client';

import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TiltProps {
  children: ReactNode;
  max?: number;
  scale?: number;
}

const Tilt = ({ children, max = 15, scale = 1.03 }: TiltProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useRef(0);
  const rotateY = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    rotateY.current = (x / (rect.width / 2)) * max;
    rotateX.current = -(y / (rect.height / 2)) * max;
  };

  const handleMouseLeave = () => {
    rotateX.current = 0;
    rotateY.current = 0;
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX.current,
        rotateY: rotateY.current,
        scale: Math.abs(rotateX.current) > 0.1 || Math.abs(rotateY.current) > 0.1 ? scale : 1,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        perspective: '1000px',
      }}
    >
      {children}
    </motion.div>
  );
};

export default Tilt;
