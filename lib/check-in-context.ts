import { getSubscaleForDay, isCheckInDomain } from "@/lib/check-in-subscale"
import { computeStudyWeekAndDayFromCheckInNumber } from "@/lib/check-in-utils"
import type { Domain } from "@/store/checkin-store"

export type CheckInStudyContext = {
  domain: Domain
  weekNumber: number
  dayNumber: number
  subscale: string
}

/** Build study context for the given 1-based check-in number (1–20). */
export function buildCheckInStudyContext(
  domain: string,
  checkInNumber: number
): CheckInStudyContext | null {
  if (!isCheckInDomain(domain)) return null

  const { weekNumber, dayNumber } =
    computeStudyWeekAndDayFromCheckInNumber(checkInNumber)
  const subscale = getSubscaleForDay(domain, dayNumber)

  return {
    domain,
    weekNumber,
    dayNumber,
    subscale,
  }
}
