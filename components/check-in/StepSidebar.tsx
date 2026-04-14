"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, ShieldCheck, Sparkles } from "lucide-react"
import { STEPS } from "@/app/check-in/constants/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface StepSidebarProps {
  collapsed?: boolean
}

export default function StepSidebar({ collapsed = false }: StepSidebarProps) {
  const pathname = usePathname()

  const activeIndex = STEPS.findIndex((s) => s.path === pathname)
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex
  const isFullyComplete = safeActiveIndex === STEPS.length - 1

  return (
    <>
      <style>{`
        .f-mono { font-family: 'JetBrains Mono', monospace; }
        .f-body { font-family: 'Outfit', system-ui, sans-serif; }
        .step-link { transition: background 0.18s ease; }
        .step-link:hover .step-label { color: #0a0a0f; }
      `}</style>

      <nav className="f-body relative w-full h-full py-8 px-5 flex flex-col justify-between overflow-hidden">

        {/* Success ambience */}
        <AnimatePresence>
          {isFullyComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_24px_100%,rgba(61,90,128,0.07),transparent_70%)] pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className={`relative flex flex-col ${collapsed ? "gap-12" : "gap-9"}`}>

          {/* Track line */}
          <div
            className="absolute top-6 bottom-6 w-px bg-black/[0.06] -translate-x-1/2 transition-all duration-500"
            style={{ left: collapsed ? "50%" : "24px" }}
          />

          {/* Progress line */}
          <motion.div
            className="absolute top-6 w-[1.5px] -translate-x-1/2 rounded-full z-0"
            animate={{
              height: STEPS.length > 1
                ? `${(safeActiveIndex / (STEPS.length - 1)) * 100}%`
                : "0%",
              backgroundColor: isFullyComplete ? "#9d7855" : "#3d5a80",
            }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            style={{
              left: collapsed ? "50%" : "24px",
              boxShadow: isFullyComplete
                ? "0 0 12px rgba(157,120,85,0.3)"
                : "0 0 10px rgba(61,90,128,0.2)",
            }}
          />

          {STEPS.map((step, index) => {
            const isActive = index === safeActiveIndex
            const isCompleted = index < safeActiveIndex
            const isFinalNode = index === STEPS.length - 1

            return (
              <Link
                key={step.id}
                href={step.path}
                className={`step-link relative z-10 group flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#3d5a80]/30 rounded-md ${
                  collapsed ? "justify-center" : "gap-5"
                }`}
              >
                {/* Circle indicator */}
                <div className={`flex items-center justify-center shrink-0 ${collapsed ? "w-10" : "w-12"}`}>
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      borderColor:
                        isCompleted || (isFinalNode && isFullyComplete)
                          ? "#9d7855"
                          : isActive
                          ? "#3d5a80"
                          : "rgba(10,10,15,0.1)",
                    }}
                    className={`flex items-center justify-center rounded-full border bg-[#fefdfb] transition-all duration-500 ${
                      isActive
                        ? "w-8 h-8 shadow-[0_2px_8px_rgba(61,90,128,0.15)]"
                        : "w-5 h-5"
                    }`}
                  >
                    {isCompleted || (isFinalNode && isFullyComplete) ? (
                      <Check size={11} strokeWidth={3} style={{ color: "#9d7855" }} />
                    ) : isActive ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3d5a80]" />
                    ) : (
                      <span className="f-mono text-[9px] text-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index + 1}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Text content */}
                {!collapsed && (
                  <div className="flex flex-col min-w-0 pb-0.5">
                    <span className={`f-mono text-[8px] uppercase tracking-[0.2em] mb-1 transition-colors duration-300 ${
                      isActive
                        ? "text-[#3d5a80]"
                        : isCompleted || (isFinalNode && isFullyComplete)
                        ? "text-[#9d7855]"
                        : "text-black/25"
                    }`}>
                      {step.id}
                    </span>
                    <span className={`step-label f-body text-[13px] font-medium tracking-tight transition-colors duration-300 ${
                      isActive ? "text-[#0a0a0f]" : "text-black/35 group-hover:text-black/60"
                    }`}>
                      {step.label}
                    </span>
                    {isActive && !collapsed && (
                      <span className="f-body text-[11px] text-black/30 mt-0.5">
                        {step.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Completion badge */}
        {!collapsed && (
          <AnimatePresence>
            {isFullyComplete && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 p-4 rounded-2xl border border-[#9d7855]/20 bg-[#9d7855]/[0.04] flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-[9px] bg-[#9d7855] flex items-center justify-center shadow-[0_2px_10px_rgba(157,120,85,0.25)] shrink-0">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="f-mono text-[8.5px] uppercase tracking-[0.2em] text-[#9d7855]/70 leading-none mb-1">
                    Status
                  </span>
                  <span className="f-body text-[12px] font-semibold text-[#6b4f2e] leading-none">
                    Check-in Complete
                  </span>
                </div>
                <Sparkles size={13} className="ml-auto shrink-0 text-[#9d7855]/50" />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </nav>
    </>
  )
}