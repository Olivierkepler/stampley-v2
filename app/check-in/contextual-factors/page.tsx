"use client"

import { motion } from "framer-motion"
import { useCheckInStore } from "@/store/checkin-store"
import CheckInSubHeader from "@/components/check-in/CheckInSubHeader"
import {
  Stethoscope,
  Activity,
  Pill,
  Briefcase,
  MessageSquareWarning,
  HeartHandshake,
  ThermometerSnowflake,
  CheckCircle2,
} from "lucide-react"
import StampleyHeader from "@/components/stampley/stampley-header"

const CONTEXT_TAGS = [
  { id: "doctors_appointment", label: "Doctor's appointment", icon: Stethoscope },
  { id: "blood_sugar", label: "High or low blood sugar", icon: Activity },
  { id: "missed_medication", label: "Missed a medication or meal", icon: Pill },
  { id: "work_stress", label: "Stress at work or school", icon: Briefcase },
  { id: "conflict", label: "Conflict or tension with someone", icon: MessageSquareWarning },
  { id: "felt_supported", label: "Felt supported by someone", icon: HeartHandshake },
  { id: "unwell", label: "Felt physically unwell or tired", icon: ThermometerSnowflake },
]

export default function ContextualFactorsPage() {
  const { contextTags, setContextTags } = useCheckInStore()

  function toggleTag(tag: string) {
    if (contextTags.includes(tag)) {
      setContextTags(contextTags.filter((t) => t !== tag))
    } else {
      setContextTags([...contextTags, tag])
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="mx-auto w-full max-w-full pb-10  "
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >

<StampleyHeader
  step="Step 5 of 5"
  title="Stampley Support"
  subtitle="Daily reflection support"
/>  
        <CheckInSubHeader
          eyebrow="Step 2 of 5"
          title="What shaped your day?"
          description="Select all that applied to your day with diabetes."
        />

        <div className="mt-10 md:mt-20 grid grid-cols-1 px-4 md:px-20 gap-3 md:grid-cols-2">
          {CONTEXT_TAGS.map((tag, index) => {
            const selected = contextTags.includes(tag.id)
            const Icon = tag.icon

            return (
              <motion.button
                key={tag.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTag(tag.id)}
                className={`
                  relative flex cursor-pointer w-full items-center gap-4 overflow-hidden border p-5 text-left transition-all duration-300
                  ${
                    selected
                      ? "border-[#3d5a80]/50 bg-white shadow-[0_4px_16px_rgba(61,90,128,0.1)]"
                      : "border-black/[0.08] bg-white shadow-[0_1px_4px_rgba(10,10,15,0.04)] hover:border-[#3d5a80]/25 hover:bg-[#3d5a80]/[0.02]"
                  }
                `}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.05 + 0.2,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className={`
                    flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] transition-all duration-300
                    ${
                      selected
                        ? "bg-blue-900 text-white shadow-[0_2px_8px_rgba(61,90,128,0.25)]"
                        : "border border-black/[0.06] bg-black/[0.04] text-black/40"
                    }
                  `}
                >
                  <Icon size={18} />
                </motion.div>

                <span
                  className={`
                    flex-1 leading-snug transition-colors duration-300
                    ${
                      selected
                        ? "font-medium text-[#0a0a0f]"
                        : "font-normal text-[#0a0a0f]/70"
                    }
                  `}
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "clamp(16px, 1vw, 16px)",
                  }}
                >
                  {tag.label}
                </span>

                <div
                  className={`
                    shrink-0 transform transition-all duration-300
                    ${selected ? "scale-100 opacity-100" : "scale-50 opacity-0"}
                  `}
                >
                  <CheckCircle2 size={18} className="text-[#0a0a0f]" />
                </div>

                {selected && (
                  <div className="pointer-events-none absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                )}
              </motion.button>
            )
          })}
        </div>

        {contextTags.length === 0 && (
          <p className="mt-6 text-center text-[12px] font-light text-black/35">
            Nothing applied today? That&apos;s okay — you can continue without selecting anything.
          </p>
        )}
      </div>
    </>
  )
}