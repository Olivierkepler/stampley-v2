"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  ShieldHalf,
  PenLine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { useCheckInStore } from "@/store/checkin-store"
import CheckInSubHeader from "@/components/check-in/CheckInSubHeader"
import StampleyHeader from "@/components/stampley/stampley-header"

const REFLECTION_MAX_LENGTH = 250
const COPING_MAX_LENGTH = 180

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
  maxLength,
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
  maxLength: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const remaining = Math.max(maxLength - value.length, 0)
  const nearLimit = value.length >= maxLength * 0.9
  const atLimit = value.length >= maxLength

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 180 : -180,
      behavior: "smooth",
    })
  }

  const handleChange = (nextValue: string) => {
    onChange(nextValue.slice(0, maxLength))
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="mb-8 px-4 md:px-20"
      aria-labelledby={`${id}-label`}
    >
      <div className="mb-4 flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: delay + 0.15,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-black/[0.06] bg-white text-[#3d5a80] shadow-[0_1px_3px_rgba(10,10,15,0.04)]"
        >
          <Icon size={16} />
        </motion.div>

        <div className="min-w-0">
          <h2
            id={`${id}-label`}
            className="select-none text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3d5a80]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {label}
          </h2>

          <h3
            className="mt-1 text-[20px] leading-[1.25] text-[#0a0a0f] md:text-[22px]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {question}
          </h3>
        </div>
      </div>

      {/* {suggestions && suggestions.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/[0.08] bg-white text-black/45 shadow-[0_1px_3px_rgba(10,10,15,0.04)] transition-all duration-200 hover:border-[#3d5a80]/25 hover:bg-[#3d5a80]/[0.04] hover:text-[#3d5a80]"
            aria-label="Scroll suggestions left"
          >
            <ChevronLeft size={14} />
          </button>

          <div
            ref={scrollRef}
            className="flex w-full gap-2 overflow-x-auto px-0.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleChange(suggestion)}
                className="shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[13px] font-light text-[#0a0a0f]/70 shadow-[0_1px_3px_rgba(10,10,15,0.04)] transition-all duration-200 hover:border-[#3d5a80]/30 hover:bg-[#3d5a80]/[0.04] hover:text-[#3d5a80]"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/[0.08] bg-white text-black/45 shadow-[0_1px_3px_rgba(10,10,15,0.04)] transition-all duration-200 hover:border-[#3d5a80]/25 hover:bg-[#3d5a80]/[0.04] hover:text-[#3d5a80]"
            aria-label="Scroll suggestions right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )} */}

      <div className="group relative">
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[150px] w-full resize-none  border border-black/[0.2] bg-white p-5 pr-12 text-[18px] font-light leading-[1.7] text-[#0a0a0f] outline-none transition-all duration-300 placeholder:text-black/30 hover:border-[#3d5a80]/25 focus:border-[#3d5a80]/50 focus:ring-[3px] focus:ring-[#3d5a80]/10 focus:shadow-[0_4px_20px_rgba(61,90,128,0.08)]"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        />

        <div className="pointer-events-none absolute bottom-4 right-4 translate-y-1.5 opacity-0 transition-all duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <PenLine size={14} className="text-[#3d5a80]/50" />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p
          className={`text-[12px] ${
            atLimit
              ? "text-[#c65b4b]"
              : nearLimit
                ? "text-amber-600"
                : "text-black/35"
          }`}
        >
          {remaining} characters remaining
        </p>

        <p
          className={`text-[12px] font-medium ${
            atLimit
              ? "text-[#c65b4b]"
              : nearLimit
                ? "text-amber-600"
                : "text-black/45"
          }`}
        >
          {value.length}/{maxLength}
        </p>
      </div>
    </motion.section>
  )
}

export default function ClinicalNarrativePage() {
  const { reflection, copingAction, setReflection, setCopingAction } =
    useCheckInStore()

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

<StampleyHeader
  step="Step 5 of 5"
  title="Stampley Support"
  subtitle="Daily reflection support"
/>
        <CheckInSubHeader
          eyebrow="Step 3 of 5"
          title="Reflect on your day"
          description="Share what was on your mind today. There are no right or wrong answers."
        />

        <div className="my-10 mb-20 md:mb-10">
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
            maxLength={REFLECTION_MAX_LENGTH}
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
            maxLength={COPING_MAX_LENGTH}
          />
        </div>
      </div>
    </>
  )
}