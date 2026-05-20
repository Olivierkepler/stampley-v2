"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Zap, Target, Info, ChevronRight } from "lucide-react";
import { useCheckInStore } from "../hooks/useCheckInStore";

export default function CheckInResults() {
  const { affect, focusDomain } = useCheckInStore();

  const metrics = [
    {
      label: "Distress",
      value: affect?.distress,
      icon: Activity,
      accent: "#3d5a80",
    },
    {
      label: "Mood",
      value: affect?.mood,
      icon: Heart,
      accent: "#9d7855",
    },
    {
      label: "Energy",
      value: affect?.energy,
      icon: Zap,
      accent: "#3d5a80",
    },
  ];

  return (
    <div className="flex-1 w-full bg-[#f5f2ec] overflow-y-auto font-[Outfit,system-ui,sans-serif]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">

        {/* ── Header ── */}
        <header className="mb-10 pb-8 border-b border-black/[0.06]">
          {/* <div className="flex items-center gap-2.5 mb-4">
            <span className="h-px w-5 bg-[#3d5a80]/40" />
            <span className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.24em] text-[#3d5a80]/70 select-none">
              Session Report
            </span>
          </div> */}
          <h1 className="font-[Fraunces,Georgia,serif] text-[28px] font-light tracking-[-0.02em] text-[#0a0a0f]/75 mb-2">
            Check-in <em className="italic font-light text-[#0a0a0f]/25">Metrics</em>
          </h1>
          <p className="text-[13.5px] font-light leading-[1.7] text-black/45 max-w-xl">
            A quantitative overview of your psychological state. These parameters help Stampley calibrate its response tone and skill selection for your session.
          </p>
        </header>

        {/* ── Metrics Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-[#fefdfb] border border-black/[0.07] rounded-[18px] p-6 hover:border-[#3d5a80]/20 hover:shadow-[0_4px_16px_rgba(10,10,15,0.06)] transition-all duration-250 shadow-[0_1px_4px_rgba(10,10,15,0.04)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-black/[0.04] border border-black/[0.06]">
                  <m.icon size={15} className="text-black/40" strokeWidth={1.5} />
                </div>
                <span className="font-[JetBrains_Mono,monospace] text-[8.5px] uppercase tracking-[0.2em] text-black/35 select-none">
                  {m.label}
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-[Fraunces,Georgia,serif] text-[40px] font-light leading-none tracking-[-0.02em] text-[#0a0a0f]/80">
                  {m.value ?? "—"}
                </span>
                <span className="text-[12px] font-light text-black/30 mb-1">/10</span>
              </div>

              {/* Progress track */}
              <div className="w-full h-[2px] bg-black/[0.07] relative overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: m.value ? `${(m.value / 10) * 100}%` : 0 }}
                  transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute h-full left-0 top-0 rounded-full"
                  style={{ backgroundColor: m.accent }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Session Context Card ── */}
        <div className="bg-[#fefdfb] border border-black/[0.07] rounded-[18px] overflow-hidden shadow-[0_1px_4px_rgba(10,10,15,0.04)]">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.05]">
            <span className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.2em] text-black/40 select-none">
              Session Context
            </span>
            <Target size={13} className="text-[#9d7855]/60" />
          </div>

          {/* Focus domain row */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.04] hover:bg-black/[0.015] transition-colors cursor-default">
            <div>
              <p className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.16em] text-black/30 mb-1.5 select-none">
                Primary Focus Domain
              </p>
              <p className="text-[14px] font-normal text-[#0a0a0f]/75">
                {focusDomain ? focusDomain.replace(/-/g, " ") : "General Support"}
              </p>
            </div>
            <ChevronRight size={15} className="text-black/20" />
          </div>

          {/* Model calibration row */}
          <div className="px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-[8px] bg-[#3d5a80]/[0.08] shrink-0 mt-0.5">
                <Info size={13} className="text-[#3d5a80]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0a0a0f]/70 mb-1">Model Calibration</p>
                <p className="text-[13px] font-light text-black/45 leading-[1.65]">
                  Based on your current distress level ({affect?.distress ?? 0}/10), Stampley has adjusted its empathy threshold.
                  Safety filters are active and monitoring for escalation needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-10 pt-7 border-t border-black/[0.06] flex items-center justify-between">
          <p className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.16em] text-black/20 select-none">
            Ref: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <p className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.16em] text-black/20 select-none">
            Powered by Stampley
          </p>
        </footer>

      </div>
    </div>
  );
}