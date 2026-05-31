"use client"

import { useEffect } from "react"
import { useCheckInStore, type Domain } from "@/store/checkin-store"
import { isCheckInDomain } from "@/lib/check-in-subscale"

/** Keep the check-in store aligned with the server’s current-week domain. */
export default function WeeklyDomainSync() {
  const setDomain = useCheckInStore((s) => s.setDomain)
  const clearDomain = useCheckInStore((s) => s.clearDomain)

  useEffect(() => {
    let cancelled = false

    async function sync() {
      try {
        const res = await fetch("/api/check-in/weekly-domain")
        if (!res.ok || cancelled) return

        const data = await res.json()
        const weekDomain = isCheckInDomain(data.currentWeekDomain)
          ? (data.currentWeekDomain as Domain)
          : null
        const usedPrevious = Array.isArray(data.usedPreviousDomains)
          ? data.usedPreviousDomains.filter((d: unknown): d is Domain =>
              isCheckInDomain(d)
            )
          : []

        if (weekDomain) {
          setDomain(weekDomain)
          return
        }

        const storeDomain = useCheckInStore.getState().domain
        if (storeDomain && usedPrevious.includes(storeDomain)) {
          clearDomain()
        }
      } catch {
        // Non-blocking: Step 4 POST / study-context still enforce server-side.
      }
    }

    void sync()
    return () => {
      cancelled = true
    }
  }, [setDomain, clearDomain])

  return null
}
