import { hasAllDailyMetrics } from "@/lib/wellness-score"
import type { Domain } from "@/store/checkin-store"

export type CheckInDraftState = {
  distress: number | undefined
  mood: number | undefined
  energy: number | undefined
  contextTags: string[]
  reflection: string
  copingAction: string
  domain: Domain | null
}

export function isStepComplete(
  stepIndex: number,
  state: CheckInDraftState
): boolean {
  switch (stepIndex) {
    case 0:
      return hasAllDailyMetrics(state.distress, state.mood, state.energy)
    case 1:
      return state.contextTags.length >= 1
    case 2:
      return (
        state.reflection.trim().length > 0 &&
        state.copingAction.trim().length > 0
      )
    case 3:
      return state.domain !== null
    case 4:
      return true
    default:
      return false
  }
}

/** Highest step index the user may open (first incomplete step, or last if all done). */
export function getMaxAccessibleStepIndex(state: CheckInDraftState): number {
  for (let i = 0; i < 5; i++) {
    if (!isStepComplete(i, state)) {
      return i
    }
  }
  return 4
}

export function canNavigateToStep(
  targetIndex: number,
  activeIndex: number,
  state: CheckInDraftState
): boolean {
  if (targetIndex < 0 || targetIndex > 4) return false
  if (targetIndex <= activeIndex) return true
  return targetIndex <= getMaxAccessibleStepIndex(state)
}

export function getContinueBlockedMessage(
  stepIndex: number,
  state: CheckInDraftState
): string | null {
  if (isStepComplete(stepIndex, state)) {
    return null
  }

  switch (stepIndex) {
    case 0:
      return "Please set your stress, mood, and energy before continuing."
    case 1:
      return "Please select at least one contextual factor before continuing."
    case 2:
      return "Please write your reflection and coping action before continuing."
    case 3:
      return "Please select your weekly focus domain before continuing."
    default:
      return null
  }
}
