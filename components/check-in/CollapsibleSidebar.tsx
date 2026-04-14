"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PanelLeftClose, PanelLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import StepSidebar from "./StepSidebar"

const SIDEBAR_CONFIG = {
  EXPANDED: "w-[280px]",
  COLLAPSED: "w-[88px]",
  TRANSITION: "transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
}

export default function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
        .f-display { font-family: 'Fraunces', Georgia, serif; }
        .f-mono    { font-family: 'JetBrains Mono', monospace; }
        .f-body    { font-family: 'Outfit', system-ui, sans-serif; }

        .sidebar-grain::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
          pointer-events: none;
          z-index: 0;
        }

        .toggle-btn {
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .toggle-btn:hover {
          background: rgba(10,10,15,0.04);
          border-color: rgba(10,10,15,0.1);
          color: #0a0a0f;
        }
      `}</style>

      <aside className={`
        f-body sidebar-grain
        relative hidden lg:flex flex-col shrink-0 z-30
        bg-[#fefdfb] border-r border-black/[0.07]
        ${SIDEBAR_CONFIG.TRANSITION}
        ${isCollapsed ? SIDEBAR_CONFIG.COLLAPSED : SIDEBAR_CONFIG.EXPANDED}
      `}>

        {/* Mesh tint */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 300px 400px at 0% 30%, rgba(61,90,128,0.04) 0%, transparent 70%)',
              'radial-gradient(ellipse 200px 300px at 100% 80%, rgba(157,120,85,0.03) 0%, transparent 70%)',
            ].join(', '),
          }}
        />

        {/* Header */}
        <div className={`
          relative z-10 flex items-center px-4 py-3.5
          border-b border-black/[0.06] shrink-0
          ${isCollapsed ? "justify-center" : "justify-between"}
        `}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Link href="/dashboard" className="flex flex-col outline-none rounded-md">
                  <span className="f-mono text-[9px] uppercase tracking-[0.2em] text-black/30">
                    AIDES-T2D
                  </span>
                  <span className="f-body text-[13px] font-semibold text-[#0a0a0f]">
                    Daily Check-in
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`
              toggle-btn relative flex items-center justify-center
              w-9 h-9 rounded-[9px] border border-black/[0.08]
              text-black/35 outline-none
              focus-visible:ring-2 focus-visible:ring-[#3d5a80]/30
            `}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed
              ? <PanelLeft size={15} />
              : <PanelLeftClose size={15} />
            }
            {/* Online dot */}
            <span className="absolute top-[7px] right-[7px] w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)] border border-[#fefdfb]" />
          </button>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
          <nav className="flex-1 min-h-0 py-4 overflow-y-auto">
            <StepSidebar collapsed={isCollapsed} />
          </nav>
        </div>

        {/* Edge gradient */}
        <div className="absolute inset-y-0 -right-[1px] w-[1px] bg-gradient-to-b from-transparent via-black/[0.06] to-transparent pointer-events-none" />
      </aside>
    </>
  )
}