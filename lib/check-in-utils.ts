/**
 * Study week/day helpers aligned with /api/check-in/submit logic (read-only).
 */

export type StudyWeekDay = {
  weekNumber: number
  dayNumber: number
}

export function computeStudyWeekAndDay(
  studyStartDate: Date | string | null | undefined,
  referenceDate: Date = new Date()
): StudyWeekDay {
  let weekNumber = 1
  let dayNumber = 1

  if (studyStartDate != null && studyStartDate !== "") {
    const startDate =
      studyStartDate instanceof Date
        ? studyStartDate
        : new Date(studyStartDate)
    const startMs = startDate.getTime()
    const diffDays = Number.isFinite(startMs)
      ? Math.floor(
          (referenceDate.getTime() - startMs) / (1000 * 60 * 60 * 24)
        )
      : 0
    weekNumber = Math.min(Math.floor(diffDays / 7) + 1, 4)
    dayNumber = (diffDays % 7) + 1
  }

  if (!Number.isFinite(dayNumber) || dayNumber < 1 || dayNumber > 7) {
    dayNumber = 1
  }
  if (!Number.isFinite(weekNumber) || weekNumber < 1) {
    weekNumber = 1
  }

  return { weekNumber, dayNumber }
}
