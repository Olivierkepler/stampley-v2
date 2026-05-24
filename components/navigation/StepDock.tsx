"use client"

import { useRouter, usePathname } from "next/navigation"
import { STEPS } from "@/app/check-in/constants/navigation"
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCheckInStore } from "@/store/checkin-store"
import { useCheckInSubmit } from "@/components/check-in/CheckInSubmitContext"

const WEEKLY_DOMAIN_INDEX = STEPS.findIndex(
  (s) => s.path === "/check-in/weekly-domain"
)

const STAMPLEY_INDEX = STEPS.findIndex(
  (s) => s.path === "/check-in/stampley-support"
)

export default function StepDock() {
  const router = useRouter()
  const pathname = usePathname()
  const domain = useCheckInStore((s) => s.domain)

  const { onSubmit, meta } = useCheckInSubmit()

  const currentIndex = STEPS.findIndex((s) => s.path === pathname)
  const currentStepNum = currentIndex + 1
  const isStampleyStep = currentIndex === STAMPLEY_INDEX

  if (currentIndex === -1 || meta.submitted || meta.checkInSaved) {
    return null
  }

  const continueDisabled =
    currentIndex === WEEKLY_DOMAIN_INDEX && !domain

  const submitDisabled =
    isStampleyStep &&
    (meta.submitting || meta.loading || meta.checkInSaved || meta.submitted)

  const primaryDisabled = continueDisabled || submitDisabled

  const handleNavigate = (dir: "next" | "prev") => {
    const targetIndex = dir === "next" ? currentIndex + 1 : currentIndex - 1

    if (targetIndex >= 0 && targetIndex < STEPS.length) {
      router.push(STEPS[targetIndex].path)
    }
  }

  const handlePrimary = () => {
    if (primaryDisabled) return

    if (isStampleyStep) {
      onSubmit()
      return
    }

    handleNavigate("next")
  }

  const primaryLabel = isStampleyStep
    ? meta.submitting
      ? "Saving Check-in"
      : meta.loading
        ? "Preparing Response"
        : meta.label ?? "Submit & Hear from Stampley"
    : "Continue"
    // Submit Check-in

  return (
    <motion.div
      layout
      className="
        flex items-center gap-2 p-1.5 ml-0 md:ml-60
        bg-white backdrop-blur-xl
        border border-black/[0.07]
        rounded-[2.5rem]
        shadow-[0_8px_32px_rgba(10,10,15,0.1),0_2px_8px_rgba(10,10,15,0.06)] 
      "
    >
      <AnimatePresence initial={false}>
        {currentStepNum > 1 && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden"
          >
            <span
              className="
                flex items-center justify-center px-3
                font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.2em]
                text-black select-none whitespace-nowrap
              "
            >
              {currentStepNum - 1} / {STEPS.length - 1}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {currentStepNum > 1 && (
          <motion.button
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 52, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            onClick={() => handleNavigate("prev")}
            className="
              flex h-12 items-center justify-center rounded-[1.8rem] shrink-0
              bg-black/[0.04] text-black border border-black/[0.06]
              hover:bg-black/[0.07] hover:text-black/60
              active:scale-95 transition-all duration-200 cursor-pointer
              overflow-hidden
            "
            aria-label="Go back"
          >
            <ChevronLeft size={17} />
          </motion.button>
        )}
      </AnimatePresence>

      <button
        onClick={handlePrimary}
        disabled={primaryDisabled}
        className={`
          group relative pl-12 flex h-12 min-w-[220px] flex-1 overflow-hidden rounded-[1.8rem]
          font-[JetBrains_Mono,monospace] text-[10px] font-medium uppercase tracking-[0.2em]
          transition-all duration-300
          ${
            primaryDisabled
              ? "cursor-not-allowed bg-[#003e73]/40 text-white/55 shadow-none"
              : "cursor-pointer bg-[#003e73] text-white shadow-[0_4px_16px_rgba(0,62,115,0.28)] hover:bg-[#00508f] hover:shadow-[0_10px_28px_rgba(0,62,115,0.36)] active:scale-[0.985]"
          }
        `}
      >
        {!primaryDisabled && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,177,0,0.18),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        <div className="relative z-10 flex items-center justify-center gap-2.5">
          <span>{primaryLabel}</span>

          {meta.submitting || meta.loading ? (
            <Loader2 size={15} className="animate-spin opacity-80" />
          ) : isStampleyStep ? (
            <CheckCircle2 size={15} />
          ) : (
            <ChevronRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          )}
        </div>

        {!primaryDisabled && (
          <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
        )}
      </button>
    </motion.div>
  )
}
