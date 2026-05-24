"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  ShieldHalf,
  PenLine,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { useCheckInStore } from "@/store/checkin-store"
import CheckInSubHeader from "@/components/check-in/CheckInSubHeader"

function NarrativeBox({
  id,
  label,
  question,
  icon: Icon,
  value,
  onChange,
  placeholder,
  delay,
  suggestions,
}: {
  id: string
  label: string
  question: string
  icon: React.ElementType
  value: string
  onChange: (value: string) => void
  placeholder: string
  delay: number
  suggestions?: string[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return

    scrollRef.current.scrollBy({
      left: dir === "right" ? 180 : -180,
      behavior: "smooth",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="mb-8 px-4 md:px-20"
    >
      <div className="mb-4 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: delay + 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="flex h-9 w-9 items-center justify-center border border-black/[0.06] bg-white text-black/40"
        >
          <Icon size={16} />
        </motion.div>

        <div>
          <h2
            className="text-[9.5px] font-medium uppercase leading-none tracking-[0.2em] text-[#3d5a80] select-none"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(10px, 1vw, 12px)",
            }}
          >
            {label}
          </h2>

          <h3
            className="leading-snug text-[#0a0a0f]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(16px, 1vw, 16px)",
            }}
          >
            {question}
          </h3>
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center border border-black/[0.08] bg-white text-black/35 shadow-[0_1px_3px_rgba(10,10,15,0.04)] transition-all duration-200 hover:border-[#3d5a80]/25 hover:bg-[#3d5a80]/[0.03] hover:text-[#3d5a80]"
            aria-label="Scroll suggestions left"
          >
            <ChevronLeft size={13} />
          </button>

          <div
            ref={scrollRef}
            className="flex w-full gap-2 overflow-x-auto px-0.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onChange(suggestion)}
                className="flex-shrink-0 cursor-pointer whitespace-nowrap border border-black/[0.08] bg-white px-3.5 py-1.5 text-[12px] font-light text-[#0a0a0f] shadow-[0_1px_3px_rgba(10,10,15,0.04)] transition-all duration-200 hover:border-[#3d5a80]/30 hover:bg-[#3d5a80]/[0.03] hover:text-[#3d5a80]"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center border border-black/[0.08] bg-[#fefdfb] text-black/35 shadow-[0_1px_3px_rgba(10,10,15,0.04)] transition-all duration-200 hover:border-[#3d5a80]/25 hover:bg-[#3d5a80]/[0.03] hover:text-[#3d5a80]"
            aria-label="Scroll suggestions right"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      <div className="group relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[150px] w-full resize-none border border-black/[0.08] bg-white p-5 text-[13.5px] font-light leading-[1.7] text-[#0a0a0f] outline-none transition-all duration-300 placeholder:text-black/30 hover:border-[#3d5a80]/25 focus:border-[#3d5a80]/50 focus:ring-[3px] focus:ring-[#3d5a80]/10 focus:shadow-[0_4px_20px_rgba(61,90,128,0.08)]"
          style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: "clamp(14px, 3.5vw, 16px)",
          }}
        />

        <div className="pointer-events-none absolute bottom-4 right-4 translate-y-1.5 opacity-0 transition-all duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <PenLine size={14} className="text-[#3d5a80]/50" />
        </div>
      </div>

      {id === "reflection" && (
        <p className="mt-2 text-right text-[11px] font-light text-black">
          {value.length} characters
        </p>
      )}
    </motion.div>
  )
}

export default function ClinicalNarrativePage() {
  const {
    reflection,
    copingAction,
    setReflection,
    setCopingAction,
  } = useCheckInStore()

  const [showContext, setShowContext] = useState(false)

  const reflectionDefaults = [
    "Today I felt overwhelmed by my numbers.",
    "Things went fairly smoothly today.",
    "I was stressed about meals and timing.",
    "I felt burnt out from managing everything.",
  ]

  const copingDefaults = [
    "I took a short walk to clear my head.",
    "I took a moment to breathe deeply.",
    "I talked to someone I trust.",
    "I tried to be patient with myself.",
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="mx-auto w-full max-w-full pb-10 lg:px-0"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <CheckInSubHeader
          eyebrow="Step 3 of 5"
          title="Reflect on your day"
          description="Share what was on your mind today. There are no right or wrong answers."
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 mb-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div />

            <button
              type="button"
              onClick={() => setShowContext((prev) => !prev)}
              className="mt-1 flex  mr-4 md:mr-20 shrink-0 cursor-pointer items-center gap-1.5 border border-black/[0.08] bg-white px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] text-black shadow-[0_1px_3px_rgba(10,10,15,0.04)] transition-all duration-200 hover:border-[#3d5a80]/30 hover:bg-[#3d5a80]/[0.03] hover:text-[#3d5a80]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Info size={12} />
              Why we ask
            </button>
          </div>

          <AnimatePresence>
            {showContext && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <div className="mt-4 border mx-4 md:mx-20 border-blue-900/50 bg-white px-4 md:px-5 py-4 ">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-3">
                      <p className="text-[14px] font-light leading-[1.75] text-black">
                        These reflections help Stampley understand the full
                        context of your day — not just the numbers, but what you
                        were feeling and how you coped.
                      </p>

                      <div className="flex  items-center gap-4 ">
                        {[
                          { label: "Private", icon: "🔒" },
                          { label: "Optional", icon: "↩" },
                          { label: "Supportive", icon: "✓" },
                        ].map((badge) => (
                          <div
                            key={badge.label}
                            className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.16em] text-black"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            <span className="text-[10px]">
                              {badge.icon}
                            </span>

                            {badge.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowContext(false)}
                      className="mt-0.5 shrink-0 cursor-pointer text-black/25 transition-colors hover:text-black/50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <NarrativeBox
          id="reflection"
          label="Contextual Impact"
          question="What most shaped your day with diabetes?"
          icon={BookOpen}
          value={reflection}
          onChange={setReflection}
          placeholder="Today I felt..."
          delay={0.1}
          suggestions={reflectionDefaults}
        />

        <NarrativeBox
          id="copingAction"
          label="Resilience & Action"
          question="What helped you get through the day?"
          icon={ShieldHalf}
          value={copingAction}
          onChange={setCopingAction}
          placeholder="What coping strategies did you use today?"
          delay={0.2}
          suggestions={copingDefaults}
        />
      </div>
    </>
  )
}