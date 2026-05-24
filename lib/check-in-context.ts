import { getSubscaleForDay, isCheckInDomain } from "@/lib/check-in-subscale"
import { computeStudyWeekAndDay } from "@/lib/check-in-utils"
import type { Domain } from "@/store/checkin-store"

export type CheckInStudyContext = {
  domain: Domain
  weekNumber: number
  dayNumber: number
  subscale: string
}

export function buildCheckInStudyContext(
  domain: string,
  studyStartDate: Date | string | null | undefined,
  referenceDate: Date = new Date()
): CheckInStudyContext | null {
  if (!isCheckInDomain(domain)) return null

  const { weekNumber, dayNumber } = computeStudyWeekAndDay(
    studyStartDate,
    referenceDate
  )
  const subscale = getSubscaleForDay(domain, dayNumber)

  return {
    domain,
    weekNumber,
    dayNumber,
    subscale,
  }
}
