import {
  calculateDDSScores,
  type DDSAnswers,
  type DDSScores,
} from "@/lib/dds-scoring"

export type PhqAnswers = {
  phq1: number
  phq2: number
  phq3: number
  phq4: number
  phq5: number
  phq6: number
  phq7: number
  phq8: number
  phq9: number
}

export type SusAnswers = {
  sus1: number
  sus2: number
  sus3: number
  sus4: number
  sus5: number
  sus6: number
  sus7: number
  sus8: number
  sus9: number
  sus10: number
}

export function hasNumericAnswer(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

export function calculatePhqTotal(answers: PhqAnswers): number {
  return (
    answers.phq1 +
    answers.phq2 +
    answers.phq3 +
    answers.phq4 +
    answers.phq5 +
    answers.phq6 +
    answers.phq7 +
    answers.phq8 +
    answers.phq9
  )
}

export function calculatePhqSeverity(total: number): string {
  if (total <= 4) return "Minimal"
  if (total <= 9) return "Mild"
  if (total <= 14) return "Moderate"
  if (total <= 19) return "Moderately Severe"
  return "Severe"
}

/** Standard SUS score (0–100). Items 1-based: odd subtract 1, even 5 minus value. */
export function calculateSusScore(answers: SusAnswers): number {
  let sum = 0
  for (let i = 1; i <= 10; i++) {
    const key = `sus${i}` as keyof SusAnswers
    const value = answers[key]
    if (i % 2 === 1) {
      sum += value - 1
    } else {
      sum += 5 - value
    }
  }
  return Math.round(sum * 2.5 * 100) / 100
}

export function scorePostSurveyDds(answers: DDSAnswers): DDSScores {
  return calculateDDSScores(answers)
}
