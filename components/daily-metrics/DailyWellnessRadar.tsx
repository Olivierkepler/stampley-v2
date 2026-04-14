"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

// Properly typed Tooltip
interface CustomTooltipProps extends TooltipProps<number, string> {}

const CustomTooltip = ({ active, payload }: { active: boolean, payload: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-md z-50">
        <p className="text-[11px] font-medium text-slate-500 mb-0.5 uppercase tracking-wider">
          {payload[0].payload.metric}
        </p>
        <p className="text-[14px] font-bold text-[#1a73e8]">
          Score: <span className="text-slate-900">{payload[0].value}</span>
          <span className="text-slate-400 text-[11px] font-normal ml-1">/ 10</span>
        </p>
      </div>
    );
  }
  return null;
};

export interface DailyWellnessRadarProps {
  affect: {
    mood: number | null;
    energy: number | null;
    distress: number | null;
  };
}

export default function DailyWellnessRadar({ affect }: DailyWellnessRadarProps) {
  // 1. Hover state to control text visibility
  const [isHovered, setIsHovered] = useState(false);

  // 2. Set fallback values (default to 5 if null)
  const moodVal = affect?.mood ?? 5;
  const energyVal = affect?.energy ?? 5;
  const distressVal = affect?.distress ?? 5;

  // 3. Map data for the Radar Chart
  const radarData = [
    { metric: "Mood", value: moodVal, fullMark: 10 },
    { metric: "Energy", value: energyVal, fullMark: 10 },
    { metric: "Distress", value: distressVal, fullMark: 10 },
  ];

  // 4. Dynamic Insight Logic
  const getInsightText = (mood: number, energy: number, distress: number) => {
    if (distress >= 7 && mood <= 4) return "High distress and lower mood indicate a tough day. Please be kind to yourself.";
    if (distress >= 7) return "You're carrying a lot of distress right now. Remember to lean on your coping tools.";
    if (energy <= 3 && mood <= 4) return "Your energy and mood are running low. Make sure to prioritize rest and recovery.";
    if (energy <= 3) return "You're feeling physically drained today. Take things one step at a time.";
    if (mood >= 7 && energy >= 7) return "High energy and a positive mood! You're in a great spot today.";
    if (mood >= 6 && distress <= 4) return "Manageable stress and a solid mood. You're navigating today well!";
    return "Your daily metrics are currently balanced and steady.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full cursor-default"
      // Add hover event listeners to the container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Radar Chart Container */}
      <div className="w-full h-[160px] -mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} 
              tickSize={12} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name="Metrics"
              dataKey="value"
              stroke="#1a73e8"
              strokeWidth={2}
              fill="#1a73e8"
              fillOpacity={0.15}
              activeDot={{ r: 4, fill: "#1a73e8", stroke: "white", strokeWidth: 2 }} 
              isAnimationActive={true} 
            />
            <Tooltip content={<CustomTooltip active={false} payload={[]} />} cursor={false} />  
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Summary Description - Only renders when hovered */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="insight-text"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-center text-[12.5px] font-medium text-slate-500 px-2 leading-relaxed max-w-[240px] mt-1 pb-2">
              {getInsightText(moodVal, energyVal, distressVal)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}