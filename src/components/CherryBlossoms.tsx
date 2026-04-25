import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FLOWER_COUNT = 15;

const SVGFlower = () => (
  <svg 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full fill-rose-300 opacity-60 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]"
  >
    <path d="M50 5 C 60 20, 80 40, 50 60 C 20 40, 40 20, 50 5" transform="rotate(0 50 50)" />
    <path d="M50 5 C 60 20, 80 40, 50 60 C 20 40, 40 20, 50 5" transform="rotate(72 50 50)" />
    <path d="M50 5 C 60 20, 80 40, 50 60 C 20 40, 40 20, 50 5" transform="rotate(144 50 50)" />
    <path d="M50 5 C 60 20, 80 40, 50 60 C 20 40, 40 20, 50 5" transform="rotate(216 50 50)" />
    <path d="M50 5 C 60 20, 80 40, 50 60 C 20 40, 40 20, 50 5" transform="rotate(288 50 50)" />
    <circle cx="50" cy="50" r="10" className="fill-orange-200" />
  </svg>
);

export function CherryBlossoms() {
  const [flowers, setFlowers] = useState<{ id: number; left: number; top: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const items = Array.from({ length: FLOWER_COUNT }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -20 - (Math.random() * 20),
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 15,
      size: 10 + Math.random() * 30
    }));
    setFlowers(items);
  }, []);

  if (flowers.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-dark-bg">
      {/* Background Gradients (Optimized) */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-900/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none opacity-50" />

      {/* Falling Blossoms */}
      {flowers.map((f) => (
        <motion.div
  key={f.id}
  className="absolute opacity-80"
  style={{ 
            left: `${f.left}%`, 
            top: `${f.top}%`,
            width: f.size, 
            height: f.size,
            willChange: 'transform' // Improve performance
  }}
  animate={{
            y: ['0vh', '120vh'],
            x: [0, Math.sin(f.id) * 100, -Math.sin(f.id) * 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <SVGFlower />
        </motion.div>
      ))}
    </div>
  );
}
