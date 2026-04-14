'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlucometerProps {
  value: number;
  unit?: string;
  label?: string;
  isActive?: boolean;
  onPress?: () => void;
}

const WhiteGlucometer = ({ 
  value, 
  unit = "Distress Units", 
  label = "System Live",
  isActive = true,
  onPress 
}: GlucometerProps) => {
  
  // Medical-grade color palette logic
  // 0-3: Low Distress (Emerald), 4-7: Moderate (Blue), 8-10: High (Rose)
  const getStatusColor = () => {
    if (value < 4) return "#10b981"; 
    if (value < 8) return "#3b82f6"; 
    return "#f43f5e";                
  };

  const statusColor = getStatusColor();

  return (
    // 1. Changed to flex center so it perfectly fills the container from the parent layout
    <div className="relative w-full h-full flex items-center justify-center select-none p-2">
      <motion.svg 
        // 2. Made width/height 100% so it scales responsively based on the viewBox
        width="100%" 
        height="100%" 
        viewBox="0 0 200 300" 
        className="drop-shadow-2xl max-w-[180px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        role="img"
        aria-label={`Medical meter reading: ${value} ${unit}`}
      >
        <defs>
          <linearGradient id="ceramicBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          <filter id="softBezel" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feOffset dx="0" dy="4" result="offsetBlur" />
            <feFlood floodColor="#000" floodOpacity="0.08" result="color" />
            <feComposite in2="offsetBlur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Device Body */}
        {/* 3. Restored height to 290 so it connects to the strip entry port at the bottom */}
        <rect x="5" y="5" width="190" height="290" rx="50" fill="url(#ceramicBody)" stroke="#f1f5f9" strokeWidth="2" />
        
        {/* Glass Face Plate */}
        <rect 
          x="18" y="28" 
          width="164" height="154" 
          rx="24" 
          fill="#1e293b" 
          filter="url(#softBezel)" 
        />
        
        {/* 4. PERFECTLY ALIGNED The Digital Display coordinates to match the glass plate exactly */}
        <foreignObject x="10" y="28" width="164" height="154">
          <div className="w-full h-full flex flex-col p-5 font-sans text-white overflow-hidden relative">
            
            {/* Top Bar UI */}
            <div className="flex justify-between items-center opacity-40 text-[7px] tracking-widest font-bold uppercase">
              <span>{label}</span>
              <div className="flex gap-1.5 items-center">
                <motion.div 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)]" 
                />
                <span className="text-[6px]">BT-LE</span>
              </div>
            </div>

            {/* Main Value Reading */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  // 5. Bumped text back up to 5xl so it looks like a prominent digital clock
                  className="text-5xl font-light tracking-tight tabular-nums"
                  style={{ 
                    color: statusColor,
                    textShadow: `0 0 20px ${statusColor}33`
                  }}
                >
                  {value}
                </motion.div>
              </AnimatePresence>
              <div className="text-[7px] uppercase tracking-[0.25em] font-semibold text-slate-400 mt-1">
                {unit}
              </div>
            </div>

            {/* Activity Waveform */}
            <div className="h-5 flex items-end justify-center gap-[3px] mb-1">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    height: isActive ? [4, Math.random() * 12 + 4, 4] : 4,
                    opacity: isActive ? [0.2, 0.6, 0.2] : 0.1 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5, 
                    delay: i * 0.05,
                    ease: "easeInOut"
                  }}
                  className="w-[3px] rounded-full"
                  style={{ backgroundColor: statusColor }}
                />
              ))}
            </div>
          </div>
        </foreignObject>

        {/* Glass Reflection Overlay */}
        <path 
          d="M 25 35 Q 100 35 170 90 L 170 35 L 25 35 Z" 
          fill="white" 
          fillOpacity="0.03" 
          pointerEvents="none" 
        />

        {/* Physical Action Button */}
        <g transform="translate(100, 235)" onClick={onPress} className="cursor-pointer">
          <circle r="34" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          
          <motion.circle 
            r="26" 
            fill="white" 
            className="shadow-inner"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          />

          <motion.circle 
            r="30" 
            fill="none" 
            stroke={statusColor} 
            strokeWidth="1.5" 
            style={{ opacity: 0.2 }}
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <text 
            textAnchor="middle" 
            y="3" 
            fontSize="6" 
            fill="#64748b" 
            className="pointer-events-none font-bold tracking-[0.15em] uppercase"
          >
            Measure
          </text>
        </g>

        {/* Strip Entry Port */}
        <rect x="70" y="288" width="60" height="3" rx="1.5" fill="#e2e8f0" />
        <rect x="85" y="288" width="30" height="1" rx="0.5" fill="#cbd5e1" />
      </motion.svg>
    </div>
  );
};

export default WhiteGlucometer;