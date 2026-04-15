"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCheckInStore, type Domain } from "@/store/checkin-store"
import { 
  
    ClipboardList, 
    BrainCircuit, 
    Users, 
  
  } from "lucide-react";

const DOMAINS = [
  {
    id: "Emotional" as Domain,
    label: "Emotional Burden",
    emoji: <BrainCircuit className="w-4 h-4" />,
    shortLabel: "Emotional",
    description: "Feeling overwhelmed, discouraged, or burned out by diabetes",
    accent: "#5c5c5c",
    accentRgb: "92,92,92",
    tag: "Emotional",
    gradient: "linear-gradient(160deg, #fefdfb 0%, #f5f3ef 100%)",
    insight: "Most common form of diabetes distress — affects 1 in 3 people with T2DM",
  },
  {
    id: "Regimen" as Domain,
    label: "Regimen-Related",
    emoji: <ClipboardList className="w-4 h-4" />,
    shortLabel: "Regimen",
    description: "Challenges with medications, blood sugar, or meal planning",
    accent: "#7c6a52",
    accentRgb: "124,106,82",
    tag: "Behavioral",
    gradient: "linear-gradient(160deg, #fefdfb 0%, #f6f1ea 100%)",
    insight: "Requires hundreds of daily decisions — burnout is normal and expected",
  },
  {
    id: "Physician" as Domain,
    label: "Physician-Related",
    emoji: "🩺",
    shortLabel: "Physician",
    description: "Concerns about your doctor or healthcare team relationship",
    accent: "#5a6b5a",
    accentRgb: "90,107,90",
    tag: "Clinical",
    gradient: "linear-gradient(160deg, #fefdfb 0%, #f2f5f2 100%)",
    insight: "A strong patient-provider relationship improves outcomes significantly",
  },
  {
    id: "Interpersonal" as Domain,
    label: "Interpersonal",
    emoji: <Users className="w-4 h-4" />,
    shortLabel: "Social",
    description: "Feeling unsupported by family or friends about your diabetes",
    accent: "#7a5a5a",
    accentRgb: "122,90,90",
    tag: "Social",
    gradient: "linear-gradient(160deg, #fefdfb 0%, #f5f0ef 100%)",
    insight: "Social support is one of the strongest protective factors against distress",
  },
]

interface Props {
  lockedDomain: string | null
  weekNumber: number
  isLocked: boolean
}

export function WeeklyDomainClient({ lockedDomain, weekNumber, isLocked }: Props) {
  const router = useRouter()
  const { domain, setDomain } = useCheckInStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showInsight, setShowInsight] = useState<string | null>(null)

  useEffect(() => {
    if (lockedDomain) setDomain(lockedDomain as Domain)
  }, [lockedDomain, setDomain])

  const activeDomain = DOMAINS.find(d => d.id === (domain || lockedDomain))

  return (
    <div className="space-y-5">

      {/* Locked notice */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[18px] px-5 py-4"
            style={{
              background: "linear-gradient(160deg, #fefdfb 0%, #f5f3ef 100%)",
              border: "1px solid rgba(10,10,5,0.09)",
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(10,10,5,0.04) 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />

            <div className="flex items-center gap-3 relative">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(10,10,5,0.05)",
                  border: "1px solid rgba(10,10,5,0.09)",
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="rgba(10,10,5,0.45)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p
                  className="text-[12.5px] font-medium"
                  style={{
                    color: "rgba(10,10,5,0.6)",
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                >
                  Week {weekNumber} focus locked
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{
                    color: "rgba(10,10,5,0.35)",
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                >
                  New domain available at Week {weekNumber + 1}
                </p>
              </div>

              {/* Active domain pill */}
              {activeDomain && (
                <div
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(10,10,5,0.1)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span className="text-sm">{activeDomain.emoji}</span>
                  <span
                    className="text-[9.5px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color: "rgba(10,10,5,0.5)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {activeDomain.shortLabel}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Domain grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DOMAINS.map((d, i) => {
          const isSelected = domain === d.id || lockedDomain === d.id
          const isDisabled = isLocked && lockedDomain !== d.id
          const isHovered = hoveredId === d.id && !isDisabled && !isLocked

          return (
            <motion.button
              key={d.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.06,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => {
                if (!isLocked) {
                  setDomain(d.id)
                  setShowInsight(d.id)
                  setTimeout(() => setShowInsight(null), 3000)
                }
              }}
              onMouseEnter={() => setHoveredId(d.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={isDisabled}
              className="relative w-full text-left rounded-[22px] overflow-hidden transition-all duration-300"
              style={{
                background: isSelected
                  ? d.gradient
                  : isDisabled
                  ? "rgba(255,255,255,0.4)"
                  : "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                border: isSelected
                  ? `2px solid rgba(${d.accentRgb},0.2)`
                  : isHovered
                  ? `1.5px solid rgba(10,10,5,0.14)`
                  : isDisabled
                  ? "1.5px solid rgba(10,10,5,0.04)"
                  : "1.5px solid rgba(10,10,5,0.08)",
                opacity: isDisabled ? 0.28 : 1,
                cursor: isDisabled ? "not-allowed" : isLocked ? "default" : "pointer",
                boxShadow: isSelected
                  ? `0 6px 28px rgba(10,10,5,0.08), 0 2px 8px rgba(10,10,5,0.05), inset 0 1px 0 rgba(255,255,255,0.95)`
                  : isHovered
                  ? `0 6px 20px rgba(10,10,5,0.07), inset 0 1px 0 rgba(255,255,255,0.95)`
                  : "0 2px 12px rgba(10,10,5,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                transform: isHovered && !isSelected ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {/* Ambient warm glow */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  background: "radial-gradient(ellipse at 15% 50%, rgba(255,252,245,0.6) 0%, transparent 65%)",
                  opacity: isSelected || isHovered ? 1 : 0,
                }}
              />

              {/* Left selection bar */}
              {isSelected && (
                <motion.div
                  layoutId="selectedBar"
                  className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full"
                  style={{ background: `rgba(${d.accentRgb},0.45)` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative p-5">

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">

                  {/* Icon box */}
                  <motion.div
                    animate={isSelected ? { scale: 1.04 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center text-[22px] shrink-0"
                    style={{
                      background: isSelected
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.55)",
                      border: isSelected
                        ? `1.5px solid rgba(10,10,5,0.1)`
                        : "1.5px solid rgba(10,10,5,0.07)",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(10,10,5,0.08)"
                        : "0 1px 4px rgba(10,10,5,0.04)",
                    }}
                  >
                    {d.emoji}
                  </motion.div>

                  {/* Tag + checkmark */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[8.5px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: isSelected
                          ? "rgba(10,10,5,0.55)"
                          : "rgba(10,10,5,0.25)",
                        background: isSelected
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(255,255,255,0.4)",
                        border: isSelected
                          ? "1px solid rgba(10,10,5,0.1)"
                          : "1px solid rgba(10,10,5,0.06)",
                        fontFamily: "'JetBrains Mono', monospace",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {d.tag}
                    </span>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 20 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                          className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(10,10,5,0.75)",
                            boxShadow: "0 2px 8px rgba(10,10,5,0.2)",
                          }}
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Label */}
                <p
                  className="text-[15.5px] font-medium leading-snug mb-1.5"
                  style={{
                    color: isSelected ? "#0a0a0f" : "rgba(10,10,5,0.65)",
                    fontFamily: "'Fraunces', Georgia, serif",
                    letterSpacing: "-0.015em",
                    transition: "color 0.2s ease",
                  }}
                >
                  {d.label}
                </p>

                {/* Description */}
                <p
                  className="text-[12px] leading-[1.65]"
                  style={{
                    color: isSelected
                      ? "rgba(10,10,5,0.48)"
                      : "rgba(10,10,5,0.34)",
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    transition: "color 0.2s ease",
                  }}
                >
                  {d.description}
                </p>

                {/* Insight toast */}
                <AnimatePresence>
                  {showInsight === d.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className="rounded-[10px] px-3 py-2 flex items-start gap-2"
                        style={{
                          background: "rgba(255,255,255,0.65)",
                          border: "1px solid rgba(10,10,5,0.08)",
                        }}
                      >
                        <span className="text-[11px] mt-0.5 shrink-0">💡</span>
                        <p
                          className="text-[11px] leading-relaxed"
                          style={{
                            color: "rgba(10,10,5,0.5)",
                            fontFamily: "'Outfit', system-ui, sans-serif",
                          }}
                        >
                          {d.insight}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Selection summary */}
      <AnimatePresence>
        {(domain || lockedDomain) && activeDomain && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className="rounded-[16px] px-4 py-3 flex items-center gap-3"
            style={{
              background: "linear-gradient(160deg, #fefdfb 0%, #f5f3ef 100%)",
              border: "1px solid rgba(10,10,5,0.08)",
            }}
          >
            <span className="text-base">{activeDomain.emoji}</span>
            <p
              className="text-[12px]"
              style={{
                color: "rgba(10,10,5,0.4)",
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Stampley will focus on{" "}
              <span
                className="font-semibold"
                style={{ color: "rgba(10,10,5,0.65)" }}
              >
                {activeDomain.label}
              </span>{" "}
              for the next 7 days
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => router.push("/check-in/clinical-narrative")}
          className="flex-1 rounded-[16px] py-[14px] text-[13px] font-medium transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          style={{
            border: "1.5px solid rgba(10,10,5,0.09)",
            color: "rgba(10,10,5,0.38)",
            background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          ← Back
        </button>

        <motion.button
          onClick={() => router.push("/check-in/stampley-support")}
          disabled={!domain && !lockedDomain}
          whileHover={domain || lockedDomain ? { y: -2 } : {}}
          whileTap={domain || lockedDomain ? { scale: 0.98 } : {}}
          className="flex-1 rounded-[16px] py-[14px] text-[13px] font-semibold uppercase tracking-[0.07em] relative overflow-hidden transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #1a1a18 0%, #0a0a0f 100%)",
            color: "rgba(255,252,245,0.9)",
            boxShadow: domain || lockedDomain
              ? "0 6px 20px rgba(10,10,5,0.22), 0 2px 6px rgba(10,10,5,0.12)"
              : "none",
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          {/* Warm shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1.5,
            }}
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,248,235,0.12) 50%, transparent 60%)",
              width: "60%",
            }}
          />
          <span className="relative">Continue →</span>
        </motion.button>
      </div>
    </div>
  )
}