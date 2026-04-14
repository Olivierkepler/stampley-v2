'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BioMonitorProps {
  mood: number;
  energy: number;
}

const BioMonitor = ({ mood, energy }: BioMonitorProps) => {
  // CORRECTED: Combine mood and energy for a "Vitality" score (0-100)
  // E.g., Mood 8 + Energy 6 = 14. (14 / 2) = 7. 7 * 10 = 70.
  const vitality = Math.round(((mood + energy) / 2) * 10); 
  
  const getThemeColor = () => {
    if (vitality >= 70) return "#10b981"; // Vibrant Green
    if (vitality >= 40) return "#3b82f6"; // Calm Blue
    return "#f43f5e";                    // Urgent Red
  };

  const themeColor = getThemeColor();

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none p-2">
      <motion.svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 200" 
        className="drop-shadow-2xl max-w-[180px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <radialGradient id="ceramicRing" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>
          
          <filter id="glassInnerShadow">
            <feOffset dx="0" dy="4" />
            <feGaussianBlur stdDeviation="4" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.4" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          </filter>
        </defs>

        {/* Outer Ceramic Case */}
        <circle cx="100" cy="100" r="95" fill="url(#ceramicRing)" stroke="#cbd5e1" strokeWidth="0.5" />
        
        {/* Glass Display Bezel */}
        <circle cx="100" cy="100" r="75" fill="#020617" filter="url(#glassInnerShadow)" />

        {/* Vitality Progress Ring */}
        <motion.circle
          cx="100" 
          cy="100" 
          r="70"
          fill="none"
          stroke={themeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="440"
          initial={{ strokeDashoffset: 440 }}
          animate={{ strokeDashoffset: 440 - (vitality / 100) * 440 }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
          style={{ 
            opacity: 0.8, 
            rotate: -90, 
            transformOrigin: '100px 100px' // Crucial for clean rotation inside SVGs
          }}
        />

        {/* Display Content */}
        <foreignObject x="40" y="40" width="120" height="120">
          <div className="w-full h-full flex flex-col items-center justify-center text-white font-sans">
            <div className="text-[8px] uppercase tracking-[0.3em] opacity-50 mb-1 font-semibold">
              Vitality
            </div>
            
            <div className="h-[48px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={vitality}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-5xl font-light tracking-tighter tabular-nums"
                  style={{ 
                    color: themeColor, 
                    textShadow: `0 0 20px ${themeColor}66` 
                  }}
                >
                  {vitality}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Audio/Pulse Waveform */}
            <div className="flex gap-1 mt-3 items-end h-3" style={{ marginLeft: "-20px" }}>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: [4, Math.random() * 8 + 4, 4],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.2, 
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  className="w-1 rounded-full"
                  style={{ backgroundColor: themeColor }}
                />
              ))}
            </div>
          </div>
        </foreignObject>

        {/* Reflection Glare */}
        <path 
          d="M 50 40 Q 100 30 150 40 Q 130 80 50 40" 
          fill="white" 
          fillOpacity="0.04" 
          pointerEvents="none" 
        />
      </motion.svg>
    </div>
  );
};

export default BioMonitor;