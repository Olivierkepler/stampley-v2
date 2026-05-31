/**
 * Study schedule helpers for the 4-week / 20 check-in protocol.
 * Week mapping: W1 = check-ins 1–5, W2 = 6–10, W3 = 11–15, W4 = 16–20.
 */

export const STUDY_TOTAL_CHECKINS = 20
export const STUDY_WEEKS = 4
export const CHECKINS_PER_WEEK = 5

export type StudyWeekDay = {
  weekNumber: number
  dayNumber: number
}

export const STUDY_COMPLETE_MESSAGE =
  "You have completed all 20 study check-ins. Thank you for participating."

/** 1-based check-in number (1–20) → week (1–4) and day within week (1–5). */
export function computeStudyWeekAndDayFromCheckInNumber(
  checkInNumber: number
): StudyWeekDay {
  const n = Math.min(
    Math.max(Math.floor(Number(checkInNumber)) || 1, 1),
    STUDY_TOTAL_CHECKINS
  )

  const weekNumber = Math.min(
    Math.floor((n - 1) / CHECKINS_PER_WEEK) + 1,
    STUDY_WEEKS
  )
  const dayNumber = ((n - 1) % CHECKINS_PER_WEEK) + 1

  return { weekNumber, dayNumber }
}

/** Progress percent toward the 20-check-in study goal. */
export function computeStudyProgressPercent(completedCheckins: number): number {
  const completed = Math.max(Number(completedCheckins) || 0, 0)
  return Math.min((completed / STUDY_TOTAL_CHECKINS) * 100, 100)
}

/** Check-ins completed within a given study week (1–4). */
export function checkinsCompletedInWeek(
  totalCompleted: number,
  week: number
): number {
  if (week < 1 || week > STUDY_WEEKS) return 0
  const start = (week - 1) * CHECKINS_PER_WEEK + 1
  if (totalCompleted < start) return 0
  return Math.min(totalCompleted - start + 1, CHECKINS_PER_WEEK)
}
