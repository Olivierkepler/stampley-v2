"use client"

import type { ComponentType } from "react"
import { motion } from "framer-motion"
import { Smile, Zap, Frown, BatteryWarning } from "lucide-react"
import { useCheckInStore } from "@/store/checkin-store"
import BioMonitor from "@/components/daily-metrics/BioMonitor"
import WhiteGlucometer from "@/components/daily-metrics/glucometer"
import CheckInSubHeader from "@/components/check-in/CheckInSubHeader"
import StampleyHeader from "@/components/stampley/stampley-header"

export default function DailyMetricsPage() {
  const { distress, mood, energy, setDistress, setMood, setEnergy } =
    useCheckInStore()

  const renderSlider = ({
    label,
    question,
    minLabel,
    midLabel,
    maxLabel,
    minIcon: MinIcon,
    maxIcon: MaxIcon,
    value,
    onChange,
    invertScale = false,
  }: {
    label: string
    question: string
    minLabel: string
    midLabel: string
    maxLabel: string
    minIcon: ComponentType<{ size?: number; className?: string }>
    maxIcon: ComponentType<{ size?: number; className?: string }>
    value: number | undefined
    onChange: (value: number) => void
    invertScale?: boolean
  }) => {
    const hasValue = value !== undefined
    const storedValue = value ?? 0
    const sliderValue = invertScale && hasValue ? 10 - storedValue : storedValue
    const percentage = hasValue ? (sliderValue / 10) * 100 : 0
    const isHighStressSide = invertScale
      ? hasValue && storedValue >= 7
      : hasValue && storedValue <= 3
    const isLowStressSide = invertScale
      ? hasValue && storedValue <= 3
      : hasValue && storedValue >= 7

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="group relative mb-6 w-full border border-black/[0.08] p-7 shadow-[0_2px_16px_rgba(10,10,15,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:border-[#3d5a80]/25 hover:shadow-[0_8px_32px_rgba(10,10,15,0.1)] md:p-8"
        style={{ background: "#fff" }}
      >
        <div className="mb-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-[#3d5a80] shadow-[0_0_5px_rgba(61,90,128,0.45)]" />

            <h2
              className="select-none text-[9.5px] uppercase leading-none tracking-[0.2em] text-[#3d5a80]"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(10px, 1vw, 12px)",
              }}
            >
              {label}
            </h2>
          </div>

          <h3
            className="text-[20px] leading-snug text-[#0a0a0f]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {question}
          </h3>
        </div>

        <div className="relative py-8">
          <div
            className="pointer-events-none absolute top-[-22px] z-30 -ml-4 flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-blue-900 text-[12px] font-medium text-white opacity-0 shadow-[0_4px_10px_rgba(10,10,15,0.25)] transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
            style={{
              left: `${percentage}%`,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {hasValue ? value : "—"}
            <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#0a0a0f]" />
          </div>

          <div
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#3d5a80] opacity-0 blur-[6px] transition-all duration-300 ease-out group-hover:opacity-40"
            style={{ width: `${percentage}%` }}
          />

          <div className="absolute left-0 right-0 top-1/2 h-[2.5px] -translate-y-1/2 rounded-full bg-black/[0.08] shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]" />

          <div
            className="absolute left-0 top-1/2 z-10 h-[2.5px] -translate-y-1/2 rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${percentage}%`,
              background:
                "linear-gradient(90deg, rgba(61,90,128,0.4), #3d5a80)",
            }}
          />

          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={sliderValue}
            onChange={(e) => {
              const next = Number(e.target.value)
              onChange(invertScale ? 10 - next : next)
            }}
            className="peer absolute left-0 right-0 top-1/2 z-20 h-10 w-full -translate-y-1/2 cursor-pointer opacity-0"
          />

          <div
            className="pointer-events-none absolute top-1/2 z-30 -ml-[10px] flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-[2.5px] border-[#3d5a80] bg-[#fefdfb] shadow-[0_2px_8px_rgba(61,90,128,0.25)] transition-all duration-150 ease-out peer-active:scale-90"
            style={{ left: `${percentage}%` }}
          />
        </div>

        <div
          className="mt-2 flex select-none items-center justify-between text-[11.5px] font-normal text-black/40"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(10px, 1vw, 12px)",
          }}
        >
          <div
            className={`flex w-24 flex-col items-center gap-2 text-center transition-all duration-300 ${
              isHighStressSide
                ? "scale-105 text-[#3d5a80]"
                : "hover:text-black/60"
            }`}
          >
            <MinIcon
              size={18}
              className={
                isHighStressSide ? "text-[#3d5a80]" : "text-black/35"
              }
            />
            <span>{minLabel}</span>
          </div>

          <div className="flex w-24 flex-col items-center gap-2 text-center opacity-35">
            <span className="text-[10px] uppercase tracking-[0.15em]">
              {midLabel}
            </span>
          </div>

          <div
            className={`flex w-24 flex-col items-center gap-2 text-center transition-all duration-300 ${
              isLowStressSide
                ? "scale-105 text-[#3d5a80]"
                : "hover:text-black/60"
            }`}
          >
            <MaxIcon
              size={18}
              className={
                isLowStressSide ? "text-[#3d5a80]" : "text-black/35"
              }
            />
            <span>{maxLabel}</span>
          </div>
        </div>

        {label === "Stress" && hasValue && storedValue >= 8 && (
          <div className="mt-5 rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-[12px] leading-relaxed text-amber-800">
            ⚠️ You&apos;re reporting high stress today. Stampley will provide
            extra support.
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <>
      <div
        className="mx-auto w-full max-w-full"
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(10px, 1vw, 12px)",
        }}
      >
        <StampleyHeader
          step="Step 1 of 5"
          title="Daily Metrics"
          subtitle="Daily wellness check-in"
        />

        <CheckInSubHeader
          eyebrow="Step 1 of 5"
          title="How are you feeling today?"
          description="Take a moment to check in with yourself. Move each slider to reflect your experience before continuing."
        />

        <div className="mx-auto my-10 w-full max-w-full px-4 md:px-20">
          <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
            <div className="w-full flex-1">
            {renderSlider({
  label: "Stress",
  question: "How stressful did diabetes feel today?",
  minLabel: "Very stressful",
  midLabel: "Moderate",
  maxLabel: "Not stressful",
  minIcon: Frown,
  maxIcon: Smile,
  value: distress,
  onChange: setDistress,
  invertScale: true,
})}
            </div>

            <div className="relative hidden w-[200px] shrink-0 translate-y-[-22px] lg:block">
              <WhiteGlucometer
                value={distress ?? 0}
                unit="Stress Level"
                label="Sys_Live"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
            <div className="mb-30 flex w-full flex-1 flex-col gap-6 md:flex-row">
              <div className="flex-1">
                {renderSlider({
                  label: "Mood",
                  question: "How is your mood right now?",
                  minLabel: "Unpleasant",
                  midLabel: "Neutral",
                  maxLabel: "Pleasant",
                  minIcon: Frown,
                  maxIcon: Smile,
                  value: mood,
                  onChange: setMood,
                })}
              </div>

              <div className="flex-1">
                {renderSlider({
                  label: "Energy",
                  question: "How is your energy level?",
                  minLabel: "Drained",
                  midLabel: "Moderate",
                  maxLabel: "Energised",
                  minIcon: BatteryWarning,
                  maxIcon: Zap,
                  value: energy,
                  onChange: setEnergy,
                })}
              </div>
            </div>

            <div className="relative hidden w-[200px] shrink-0 items-center justify-center lg:flex">
              <BioMonitor mood={mood ?? 0} energy={energy ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}