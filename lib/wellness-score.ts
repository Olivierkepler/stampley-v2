/**
 * Daily wellness score from check-in metrics.
 * Stress is stored 0 (not stressful) → 10 (very stressful); wellness inverts it.
 */
export function computeWellnessPercent(
  distress: number | undefined,
  mood: number | undefined,
  energy: number | undefined
): number {
  if (
    distress === undefined ||
    mood === undefined ||
    energy === undefined
  ) {
    return 0
  }

  return Math.round((((10 - distress) + mood + energy) / 30) * 100)
}

export function hasAllDailyMetrics(
  distress: number | undefined,
  mood: number | undefined,
  energy: number | undefined
): boolean {
  return (
    distress !== undefined &&
    mood !== undefined &&
    energy !== undefined
  )
}

/** Wellness-oriented stress axis for charts (higher = calmer). */
export function stressWellnessScore(distress: number): number {
  return 10 - distress
}
