"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface VoicePulseCircleProps {
  volume: number; // Volume level from 0 to 1
  isListening: boolean;
}

export default function VoicePulseCircle({ volume, isListening }: VoicePulseCircleProps) {
  // Base size of the circle
  const baseScale = 1;
  
  // Dynamic scale boost based on volume (e.g., adds up to 0.6)
  const dynamicScale = baseScale + (volume * 0.6);
  
  // Inverse opacity: louder volume = lower opacity for a fading effect
  // Clamped between 0.1 and 0.8
  const dynamicOpacity = Math.max(0.1, Math.min(0.8, 0.8 - (volume * 0.5)));

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* 1. The Dynamic Pulsing Inner Circle (Reacting to volume) */}
      <motion.div
        className="absolute w-24 h-24 bg-blue-500 rounded-full"
        animate={{
          scale: isListening ? dynamicScale : baseScale,
          opacity: isListening ? dynamicOpacity : 0.6,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20, // Lower damping for a more 'bouncy' pulse
        }}
      />

      {/* 2. The Constant "Listening" Ambient Glow (Simple infinite pulse) */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="absolute w-24 h-24 bg-blue-300 rounded-full blur-md"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0, 0.3, 0],
            }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* 3. The Static Center Dot (For focus) */}
      <div className="absolute w-6 h-6 bg-white rounded-full shadow-md z-10" />
    </div>
  );
}