"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"
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
  const router = useRouter()
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
        className="max-w-3xl mx-auto w-full pb-10 pt-10 px-4 lg:px-0"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-px w-5 bg-[#3d5a80]/40" />
            <span
              className="text-[9px] uppercase tracking-[0.24em] text-[#3d5a80]/70 select-none"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Step 2 of 5
            </span>
          </div>

          <h1
            className="text-[30px] font-light tracking-[-0.02em] text-[#0a0a0f]/70 mb-2 leading-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            What shaped your <em className="italic font-light text-[#0a0a0f]/25">day?</em>
          </h1>

          <p className="text-[13.5px] font-light leading-[1.7] text-black/45">
            Select all that applied to your day with diabetes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  relative w-full p-5 rounded-[18px] border transition-all duration-300 text-left flex items-center gap-4 overflow-hidden
                  ${selected
                    ? "bg-[#3d5a80]/[0.04] border-[#3d5a80]/50 shadow-[0_4px_16px_rgba(61,90,128,0.1)]"
                    : "bg-[#fefdfb] border-black/[0.08] hover:border-[#3d5a80]/25 hover:bg-[#3d5a80]/[0.02] shadow-[0_1px_4px_rgba(10,10,15,0.04)]"
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
                    flex items-center justify-center shrink-0 w-11 h-11 rounded-[12px] transition-all duration-300
                    ${selected
                      ? "bg-[#3d5a80] text-white shadow-[0_2px_8px_rgba(61,90,128,0.25)]"
                      : "bg-black/[0.04] text-black/40 border border-black/[0.06]"
                    }
                  `}
                >
                  <Icon size={18} />
                </motion.div>

                <span
                  className={`
                    flex-1 text-[13.5px] leading-snug transition-colors duration-300
                    ${selected ? "text-[#3d5a80] font-medium" : "text-[#0a0a0f]/70 font-normal"}
                  `}
                >
                  {tag.label}
                </span>

                <div
                  className={`
                    transition-all duration-300 transform shrink-0
                    ${selected ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                  `}
                >
                  <CheckCircle2 size={18} className="text-[#3d5a80]" />
                </div>

                {selected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                )}
              </motion.button>
            )
          })}
        </div>

        {contextTags.length === 0 && (
          <p className="text-[12px] text-black/35 text-center mt-6 font-light">
            Nothing applied today? That&apos;s okay — you can continue without selecting anything.
          </p>
        )}

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.push("/check-in/daily-metrics")}
            className="flex-1 border border-black/[0.08] bg-[#fefdfb] text-black/60 rounded-[16px] py-[14px] text-[13px] font-medium transition-all duration-200 hover:bg-black/[0.02] hover:border-[#3d5a80]/25 hover:text-[#3d5a80]"
          >
            ← Back
          </button>

          <button
            onClick={() => router.push("/check-in/clinical-narrative")}
            className="flex-1 bg-[#0a0a0f] text-white rounded-[16px] py-[14px] text-[13px] font-semibold uppercase tracking-[0.06em] transition-all duration-300 hover:bg-[#1a1a24]"
          >
            Continue →
          </button>
        </div>
      </div>
    </>
  )
}