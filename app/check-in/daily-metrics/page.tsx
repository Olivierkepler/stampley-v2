"use client"

import { motion } from "framer-motion"
import { Smile, Zap, Frown, BatteryWarning } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"
import DailyWellnessRadar from "@/components/daily-metrics/DailyWellnessRadar"
import BioMonitor from "@/components/daily-metrics/BioMonitor"
import WhiteGlucometer from "@/components/daily-metrics/glucometer"

export default function DailyMetricsPage() {
  const router = useRouter()
  const { distress, mood, energy, setDistress, setMood, setEnergy } = useCheckInStore()

  const affect = {
    distress,
    mood,
    energy,
  }

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
  }: {
    label: string
    question: string
    minLabel: string
    midLabel: string
    maxLabel: string
    minIcon: any
    maxIcon: any
    value: number
    onChange: (value: number) => void
  }) => {
    const percentage = (value / 10) * 100

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative border border-black/[0.08] p-7 md:p-8 rounded-[28px] mb-6 shadow-[0_2px_16px_rgba(10,10,15,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(10,10,15,0.1)] hover:border-[#3d5a80]/25 group w-full"
        style={{ background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)" }}
      >
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3d5a80] shadow-[0_0_5px_rgba(61,90,128,0.45)]" />
            <h2
              className="text-[9.5px] font-medium text-[#3d5a80] uppercase tracking-[0.2em] leading-none select-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {label}
            </h2>
          </div>

          <h3
            className="text-[17px] font-normal text-[#0a0a0f] leading-snug"
            style={{ fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.01em" }}
          >
            {question}
          </h3>
        </div>

        <div className="relative py-8">
          <div
            className="absolute top-[-22px] -ml-4 w-8 h-8 flex items-center justify-center bg-[#0a0a0f] text-white text-[12px] font-medium rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-30 pointer-events-none shadow-[0_4px_10px_rgba(10,10,15,0.25)]"
            style={{ left: `${percentage}%`, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {value}
            <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#0a0a0f]" />
          </div>

          <div
            className="absolute top-1/2 left-0 h-[3px] bg-[#3d5a80] rounded-full -translate-y-1/2 blur-[6px] opacity-0 group-hover:opacity-40 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />

          <div className="absolute top-1/2 left-0 right-0 h-[2.5px] bg-black/[0.08] rounded-full -translate-y-1/2 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]" />

          <div
            className="absolute top-1/2 left-0 h-[2.5px] rounded-full -translate-y-1/2 transition-all duration-150 ease-out z-10"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, rgba(61,90,128,0.4), #3d5a80)",
            }}
          />

          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-full pointer-events-none px-[1px] z-10">
            <div className="absolute left-[0%] w-[2px] h-[7px] bg-[#3d5a80]/40 rounded-full top-1/2 -translate-y-1/2" />
            <div
              className="absolute left-[50%] w-[2px] h-[7px] rounded-full top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ backgroundColor: percentage >= 50 ? "rgba(61,90,128,0.5)" : "rgba(10,10,15,0.1)" }}
            />
            <div
              className="absolute left-[100%] -ml-[2px] w-[2px] h-[7px] rounded-full top-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ backgroundColor: percentage === 100 ? "#3d5a80" : "rgba(10,10,15,0.1)" }}
            />
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute top-1/2 left-0 right-0 w-full -translate-y-1/2 h-10 opacity-0 cursor-pointer z-20 peer"
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 -ml-[10px] w-5 h-5 rounded-full bg-[#fefdfb] border-[2.5px] border-[#3d5a80] shadow-[0_2px_8px_rgba(61,90,128,0.25)] z-30 pointer-events-none transition-all duration-150 ease-out flex items-center justify-center peer-active:scale-90"
            style={{ left: `${percentage}%` }}
          >
            <div className="absolute inset-0 -m-3 rounded-full bg-[#3d5a80] opacity-0 peer-hover:opacity-8 peer-active:opacity-12 scale-50 peer-hover:scale-100 peer-active:scale-125 transition-all duration-300 ease-out" />
          </div>
        </div>

        <div
          className="flex justify-between items-center text-[11.5px] font-normal text-black/40 mt-2 select-none"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          <div className={`flex flex-col items-center gap-2 w-24 text-center transition-all duration-300 ${value <= 3 ? "text-[#3d5a80] scale-105" : "hover:text-black/60"}`}>
            <MinIcon size={18} className={value <= 3 ? "text-[#3d5a80]" : "text-black/35"} />
            <span>{minLabel}</span>
          </div>

          <div className="flex flex-col items-center gap-2 w-24 text-center opacity-35">
            <span
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {midLabel}
            </span>
          </div>

          <div className={`flex flex-col items-center gap-2 w-24 text-center transition-all duration-300 ${value >= 7 ? "text-[#3d5a80] scale-105" : "hover:text-black/60"}`}>
            <MaxIcon size={18} className={value >= 7 ? "text-[#3d5a80]" : "text-black/35"} />
            <span>{maxLabel}</span>
          </div>
        </div>

        {label === "Distress" && value >= 8 && (
          <div className="mt-5 rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-[12px] leading-relaxed text-amber-800">
            ⚠️ You&apos;re reporting high stress today. Stampley will provide extra support.
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="max-w-full mx-auto w-full pb-16 pt-6 "
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div className="w-full max-w-[600px]">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-[#3d5a80]/40" />
              <span
                className="text-[9px] uppercase tracking-[0.24em] text-[#3d5a80]/70 select-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Step 1 of 5
              </span>
            </div>

            <h1
              className="text-[32px] font-light text-[#0a0a0f]/70 mb-3 leading-[1.1]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", letterSpacing: "-0.02em" }}
            >
              How are you feeling <em className="italic font-light text-black/30">today?</em>
            </h1>

            <p className="text-[13.5px] font-light leading-[1.7] text-black/50">
              Take a moment to check in with yourself. Move each slider to reflect your experience before continuing.
            </p>
          </div>

          <div className="w-full max-w-[300px]">
            <DailyWellnessRadar affect={affect} />
          </div>
        </motion.div>

        <div className="max-w-full mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
            <div className="flex-1 w-full">
              {renderSlider({
                label: "Distress",
                question: "How stressful did diabetes feel today?",
                minLabel: "Not stressful",
                midLabel: "Moderate",
                maxLabel: "Very stressful",
                minIcon: Smile,
                maxIcon: Frown,
                value: distress,
                onChange: setDistress,
              })}
            </div>

            <div className="relative hidden lg:block w-[200px] shrink-0 translate-y-[-22px]">
              <WhiteGlucometer
                value={distress}
                unit="Distress Lvl"
                label="Sys_Live"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
            <div className="flex-1 w-full flex flex-col md:flex-row gap-6">
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

            <div className="relative hidden lg:flex items-center justify-center w-[200px] shrink-0">
              <BioMonitor mood={mood} energy={energy} />
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full">
          <button
            onClick={() => router.push("/check-in/contextual-factors")}
            className="btn-shimmer relative mt-4 max-w-3xl mx-auto overflow-hidden rounded-[16px] border-none bg-[#0a0a0f] px-6 py-[15px] text-[13px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_4px_16px_rgba(10,10,15,0.18),0_1px_3px_rgba(10,10,15,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-[#1a1a24] hover:shadow-[0_8px_28px_rgba(10,10,15,0.25),0_2px_6px_rgba(10,10,15,0.15)] active:translate-y-0 active:scale-[0.985]"
          >
            Continue →
          </button>
        </div>
   
      </div>
    </>
  )
}