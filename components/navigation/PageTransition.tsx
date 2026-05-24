"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { STEPS } from "@/app/check-in/constants/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevIndex = useRef(0)

  const currentIndex = STEPS.findIndex((s) => s.path === pathname)
  const safeCurrentIndex = currentIndex === -1 ? prevIndex.current : currentIndex
  const direction = safeCurrentIndex >= prevIndex.current ? 1 : -1

  useEffect(() => {
    if (currentIndex !== -1) {
      prevIndex.current = currentIndex
    }
  }, [currentIndex])

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
