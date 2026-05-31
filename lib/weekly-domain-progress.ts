import {
  checkinsCompletedInWeek,
  computeStudyWeekAndDayFromCheckInNumber,
  STUDY_TOTAL_CHECKINS,
} from "@/lib/check-in-utils"
import { isCheckInDomain } from "@/lib/check-in-subscale"
import type { Domain } from "@/store/checkin-store"

export const STUDY_DOMAINS: Domain[] = [
  "Emotional",
  "Regimen",
  "Physician",
  "Interpersonal",
]

export type WeeklyDomainRow = {
  week_number: number
  domain: string
}

/** Study week for the next check-in based on completed count (0 → week 1, 5 → week 2, …). */
export function getStudyWeekForNextCheckIn(totalCompleted: number): number {
  const completed = Math.max(Math.floor(Number(totalCompleted)) || 0, 0)
  const nextCheckInNumber = Math.min(completed + 1, STUDY_TOTAL_CHECKINS)
  return computeStudyWeekAndDayFromCheckInNumber(nextCheckInNumber).weekNumber
}

export function getDomainForStudyWeek(
  rows: WeeklyDomainRow[],
  weekNumber: number
): Domain | null {
  const row = rows.find((r) => r.week_number === weekNumber)
  const domain = row?.domain
  return isCheckInDomain(domain) ? domain : null
}

export function getUsedDomainsFromPreviousWeeks(
  rows: WeeklyDomainRow[],
  currentWeek: number
): Domain[] {
  return rows
    .filter((r) => r.week_number < currentWeek)
    .map((r) => r.domain)
    .filter((d): d is Domain => isCheckInDomain(d))
}

export function isWeeklyDomainLocked(
  totalCompleted: number,
  weekNumber: number,
  weekDomain: string | null
): boolean {
  if (!weekDomain) return false
  return checkinsCompletedInWeek(totalCompleted, weekNumber) > 0
}

export function isDomainSelectable(
  domain: Domain,
  usedPreviousDomains: Domain[],
  currentWeekDomain: Domain | null,
  isLocked: boolean
): boolean {
  if (isLocked) {
    return currentWeekDomain === domain
  }
  if (usedPreviousDomains.includes(domain)) {
    return false
  }
  return true
}
