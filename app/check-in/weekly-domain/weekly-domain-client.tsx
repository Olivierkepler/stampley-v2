"use client"

import { useLayoutEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BrainCircuit,
  ClipboardList,
  Lock,
  Stethoscope,
  Users,
} from "lucide-react"

import { useCheckInStore, type Domain } from "@/store/checkin-store"

const DOMAINS = [
  {
    id: "Emotional" as Domain,
    label: "Emotional Burden",
    icon: BrainCircuit,
    shortLabel: "Emotional",
    description: "Feeling overwhelmed, discouraged, or burned out by diabetes.",
    tag: "Emotional",
    insight:
      "Emotional distress is common in diabetes care. Naming it can help Stampley support you more gently.",
  },
  {
    id: "Regimen" as Domain,
    label: "Regimen-Related",
    icon: ClipboardList,
    shortLabel: "Regimen",
    description: "Challenges with medications, blood sugar, meals, or routines.",
    tag: "Behavioral",
    insight:
      "Diabetes routines can involve many daily decisions. Support can focus on one realistic step at a time.",
  },
  {
    id: "Physician" as Domain,
    label: "Physician-Related",
    icon: Stethoscope,
    shortLabel: "Physician",
    description: "Concerns about your doctor or healthcare team relationship.",
    tag: "Clinical",
    insight:
      "Feeling understood by your care team matters. This focus can help you reflect on what support you need.",
  },
  {
    id: "Interpersonal" as Domain,
    label: "Interpersonal",
    icon: Users,
    shortLabel: "Social",
    description: "Feeling unsupported by family or friends about your diabetes.",
    tag: "Social",
    insight:
      "Support from others can shape how diabetes feels day to day. Stampley can help you name what would help.",
  },
]

interface Props {
  lockedDomain: string | null
  weekNumber: number
  isLocked: boolean
}

export function WeeklyDomainClient({
  lockedDomain,
  weekNumber,
  isLocked,
}: Props) {
  const { domain, setDomain } = useCheckInStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showInsight, setShowInsight] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (lockedDomain) setDomain(lockedDomain as Domain)
  }, [lockedDomain, setDomain])

  const activeDomain = DOMAINS.find((item) => item.id === (domain || lockedDomain))

  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-12">
     <AnimatePresence>
  {activeDomain && (domain || lockedDomain) && (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 border border-black/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(10,10,15,0.04)]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#3d5a80]/[0.08] text-[#3d5a80]">
        {isLocked ? (
          <Lock size={16} strokeWidth={1.8} />
        ) : (
          <activeDomain.icon size={16} strokeWidth={1.8} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="text-[13.5px] font-medium text-black"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {isLocked
            ? `Week ${weekNumber} focus locked`
            : "Current Stampley focus"}
        </p>

        <p
          className="mt-0.5 text-[12px] leading-[1.6] text-black/60"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Stampley will focus on{" "}
          <span className="font-semibold text-black">
            {activeDomain.label}
          </span>{" "}
          for the next 4 days.
          {isLocked
            ? ` A new focus domain becomes available at Week ${weekNumber + 1}.`
            : ""}
        </p>
      </div>

      <div className="hidden shrink-0 items-center rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1.5 sm:flex">
        <span
          className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-black/45"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {activeDomain.shortLabel}
        </span>
      </div>
    </motion.section>
  )}
</AnimatePresence>

      <div className=" mb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
        {DOMAINS.map((item, index) => {
          const Icon = item.icon
          const isSelected = domain === item.id || lockedDomain === item.id
          const isDisabled = isLocked && lockedDomain !== item.id
          const isHovered = hoveredId === item.id && !isDisabled && !isLocked

          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => {
                if (isLocked) return
                setDomain(item.id)
                setShowInsight(item.id)
                window.setTimeout(() => setShowInsight(null), 3000)
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={isDisabled}
              className={`relative w-full overflow-hidden rounded-[22px] border bg-white p-5 text-left transition-all duration-300 sm:p-6 ${
                isDisabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"
              }`}
              style={{
                borderColor: isSelected
                  ? "rgba(61,90,128,0.35)"
                  : isHovered
                    ? "rgba(61,90,128,0.22)"
                    : "rgba(10,10,5,0.07)",
                boxShadow: isSelected
                  ? "0 10px 30px rgba(61,90,128,0.12)"
                  : isHovered
                    ? "0 8px 24px rgba(10,10,15,0.07)"
                    : "0 1px 4px rgba(10,10,15,0.04)",
              }}
            >
              {isSelected && (
                <motion.div
                  layoutId="selectedDomainAccent"
                  className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full bg-[#3d5a80]"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <div className="mb-5 flex items-start justify-between gap-3 ">
                <motion.div
                  animate={isSelected ? { scale: 1.04 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border ${
                    isSelected
                      ? "border-[#3d5a80]/20 bg-[#3d5a80]/[0.08] text-[#3d5a80]"
                      : "border-black/[0.07] bg-white text-black/45"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.8} />
                </motion.div>

                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full border border-black/[0.06] bg-black/[0.03] px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.18em] text-black/45"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {item.tag}
                  </span>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 20 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 20,
                        }}
                        className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#3d5a80] text-white shadow-[0_2px_8px_rgba(61,90,128,0.25)]"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <p
                className="mb-2 text-[18px] font-medium leading-snug tracking-[-0.015em] text-[#0a0a0f]"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {item.label}
              </p>

              <p
                className="text-[13.5px] leading-[1.65] text-black/55"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {item.description}
              </p>

              <AnimatePresence>
                {showInsight === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2 rounded-[14px] border border-[#3d5a80]/10 bg-[#3d5a80]/[0.04] px-3.5 py-3">
                      <span className="mt-0.5 shrink-0 text-[12px]">💡</span>

                      <p
                        className="text-[12px] leading-relaxed text-black/55"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {item.insight}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}