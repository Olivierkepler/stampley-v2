"use client";

import React from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceControllerProps {
  isMuted: boolean;
  isSpeaking: boolean;
  onToggleMute: () => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({ 
  isMuted, 
  isSpeaking, 
  onToggleMute 
}) => {
  return (
    <button 
      onClick={onToggleMute}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
        isMuted 
          ? "bg-[#fce8e6] text-[#b3261e]" 
          : "hover:bg-[#f1f3f4] text-[#5f6368]"
      }`}
      title={isMuted ? "Unmute Voice" : "Mute Voice"}
    >
      {isSpeaking && !isMuted && (
        <motion.span 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 rounded-full bg-[#1a73e8]/20"
        />
      )}
      
      {isMuted ? (
        <VolumeX size={20} strokeWidth={1.5} />
      ) : (
        <Volume2 size={20} strokeWidth={1.5} className={isSpeaking ? "text-[#1a73e8]" : ""} />
      )}
    </button>
  );
};