import "server-only"

import { query } from "@/lib/db"
import type {
  EmotionalThemeMemory,
  EmotionalSupportStyle,
  StampleyPhase,
} from "@/lib/stampley-prompt"

type MemorySessionRow = {
  summary: string | null
  domain: string | null
  stressLevel: number | null
}

type MemoryCheckInRow = {
  domain: string | null
  subscale: string | null
  reflection: string | null
  copingAction: string | null
  distress: number | null
  contextTags: string | null
}

const MAX_THEMES = 3

const THEME_KEYWORDS: Record<string, string[]> = {
  "routine overwhelm": [
    "routine",
    "regimen",
    "overwhelm",
    "meal",
    "medication",
    "blood sugar",
    "glucose",
    "testing",
    "consistency",
    "schedule",
    "plan",
  ],
  "morning exhaustion": [
    "morning",
    "exhaust",
    "tired",
    "sleep",
    "drain",
    "fatigue",
    "low energy",
  ],
  "medication frustration": [
    "medication",
    "insulin",
    "pill",
    "dose",
    "inject",
    "frustrat",
    "remember to take",
  ],
  "feeling unsupported": [
    "unsupported",
    "alone",
    "family",
    "friend",
    "isolated",
    "interpersonal",
    "understand",
    "no one",
  ],
  "stress around glucose numbers": [
    "number",
    "glucose",
    "a1c",
    "reading",
    "spike",
    "high sugar",
    "low sugar",
  ],
  "burnout from consistency pressure": [
    "burnout",
    "burn out",
    "consistent",
    "pressure",
    "every day",
    "burden",
    "discourag",
    "burned out",
  ],
  "healthcare frustration": [
    "doctor",
    "physician",
    "appointment",
    "clinic",
    "healthcare",
    "provider",
    "care team",
  ],
  "emotional burden": [
    "overwhelm",
    "discourag",
    "emotion",
    "anxiet",
    "worry",
    "heavy",
    "mental",
    "stress",
  ],
}

const SUBSCALE_THEMES: Record<string, string> = {
  "Feeling Overwhelmed": "emotional burden",
  "Feeling Discouraged": "burnout from consistency pressure",
  "Feeling Burned Out": "burnout from consistency pressure",
  "Fear of Complications": "emotional burden",
  "Mental Energy Drain": "morning exhaustion",
  "Blood Sugar Testing": "stress around glucose numbers",
  "Routine Failure": "routine overwhelm",
  "Management Confidence": "burnout from consistency pressure",
  "Meal Plan Adherence": "routine overwhelm",
  "Self-Management Motivation": "burnout from consistency pressure",
  "Doctor Knowledge": "healthcare frustration",
  "Care Directions": "healthcare frustration",
  "Doctor Responsiveness": "healthcare frustration",
  "Doctor Access": "healthcare frustration",
  "Social Support for Self-Care": "feeling unsupported",
  "Family Appreciation": "feeling unsupported",
  "Emotional Support from Others": "feeling unsupported",
}

const DOMAIN_THEMES: Record<string, string> = {
  Emotional: "emotional burden",
  Regimen: "routine overwhelm",
  Physician: "healthcare frustration",
  Interpersonal: "feeling unsupported",
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function scoreTextForThemes(text: string): Map<string, number> {
  const scores = new Map<string, number>()
  const normalized = normalizeText(text)
  if (!normalized) return scores

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        scores.set(theme, (scores.get(theme) ?? 0) + 1)
      }
    }
  }
  return scores
}

function addThemeScore(
  totals: Map<string, number>,
  theme: string,
  weight: number
): void {
  if (!theme.trim() || weight <= 0) return
  totals.set(theme, (totals.get(theme) ?? 0) + weight)
}

function mergeThemeScores(
  target: Map<string, number>,
  source: Map<string, number>,
  multiplier = 1
): void {
  for (const [theme, score] of source) {
    addThemeScore(target, theme, score * multiplier)
  }
}

function truncateForScan(text: string, maxLen = 200): string {
  const t = text.trim().replace(/\s+/g, " ")
  if (t.length <= maxLen) return t
  return t.slice(0, maxLen)
}

export function buildEmotionalThemeMemory(
  sessions: MemorySessionRow[],
  checkIns: MemoryCheckInRow[],
  options: {
    weekNumber: number
    phase: StampleyPhase
    highStress: boolean
    dayNumber: number
  }
): EmotionalThemeMemory {
  const totals = new Map<string, number>()

  for (const session of sessions) {
    if (session.summary?.trim()) {
      mergeThemeScores(totals, scoreTextForThemes(session.summary), 1)
    }
    if (session.domain && DOMAIN_THEMES[session.domain]) {
      addThemeScore(totals, DOMAIN_THEMES[session.domain], 1)
    }
    if (session.stressLevel != null && session.stressLevel >= 9) {
      addThemeScore(totals, "emotional burden", 0.5)
    }
  }

  for (const checkIn of checkIns) {
    const reflection = checkIn.reflection?.trim()
    if (reflection) {
      mergeThemeScores(
        totals,
        scoreTextForThemes(truncateForScan(reflection)),
        1.5
      )
    }

    const coping = checkIn.copingAction?.trim()
    if (coping) {
      mergeThemeScores(totals, scoreTextForThemes(truncateForScan(coping)), 0.5)
    }

    if (checkIn.subscale?.trim() && SUBSCALE_THEMES[checkIn.subscale.trim()]) {
      addThemeScore(totals, SUBSCALE_THEMES[checkIn.subscale.trim()], 2)
    }

    if (checkIn.domain && DOMAIN_THEMES[checkIn.domain]) {
      addThemeScore(totals, DOMAIN_THEMES[checkIn.domain], 1)
    }

    if (checkIn.distress != null && checkIn.distress >= 9) {
      addThemeScore(totals, "emotional burden", 0.5)
    }

    if (checkIn.contextTags) {
      try {
        const tags = JSON.parse(checkIn.contextTags)
        if (Array.isArray(tags)) {
          mergeThemeScores(
            totals,
            scoreTextForThemes(tags.filter((t) => typeof t === "string").join(" ")),
            0.75
          )
        }
      } catch {
        mergeThemeScores(totals, scoreTextForThemes(checkIn.contextTags), 0.5)
      }
    }
  }

  const recurringThemes = [...totals.entries()]
    .filter(([, score]) => score >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_THEMES)
    .map(([theme]) => theme)

  const priorSessionCount = sessions.length
  const stressLevels = [
    ...sessions.map((s) => s.stressLevel).filter((n): n is number => n != null),
    ...checkIns.map((c) => c.distress).filter((n): n is number => n != null),
  ]
  const avgStress =
    stressLevels.length > 0
      ? stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length
      : 0
  const highStressDays = stressLevels.filter((s) => s >= 9).length

  let supportStyle: EmotionalSupportStyle = "calm validation"
  if (avgStress >= 7.5 || highStressDays >= 2) {
    supportStyle = "gentle grounding"
  } else if (options.weekNumber === 2) {
    supportStyle = "light pattern noticing"
  }

  const allowThemeReference = computeAllowThemeReference({
    weekNumber: options.weekNumber,
    phase: options.phase,
    highStress: options.highStress,
    dayNumber: options.dayNumber,
    priorSessionCount,
    themeCount: recurringThemes.length,
  })

  return {
    recurringThemes,
    supportStyle,
    priorSessionCount,
    allowThemeReference,
  }
}

function computeAllowThemeReference({
  weekNumber,
  phase,
  highStress,
  dayNumber,
  priorSessionCount,
  themeCount,
}: {
  weekNumber: number
  phase: StampleyPhase
  highStress: boolean
  dayNumber: number
  priorSessionCount: number
  themeCount: number
}): boolean {
  const week = Math.min(Math.max(Math.floor(weekNumber) || 1, 1), 4)

  if (themeCount === 0 || priorSessionCount === 0) return false
  if (highStress) return false
  if (week === 1) return false
  if (phase !== "opening" && phase !== "exploration") return false

  if (week === 2) {
    if (priorSessionCount < 2) return false
    return dayNumber === 1 || dayNumber === 3
  }

  if (week === 3) {
    return dayNumber !== 2
  }

  return dayNumber === 1 || dayNumber === 5
}

export async function getRecentEmotionalThemes(
  userId: string,
  options: {
    weekNumber: number
    phase: StampleyPhase
    highStress: boolean
    dayNumber: number
  }
): Promise<EmotionalThemeMemory> {
  const [sessionResult, checkInResult] = await Promise.all([
    query(
      `SELECT summary, domain, stress_level
       FROM stampley_chat_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 8`,
      [userId]
    ),
    query(
      `SELECT domain, subscale, reflection, coping_action, distress, context_tags
       FROM check_in_submissions
       WHERE user_id = $1
       ORDER BY check_in_date DESC NULLS LAST, created_at DESC
       LIMIT 8`,
      [userId]
    ),
  ])

  const sessions: MemorySessionRow[] = sessionResult.rows.map(
    (row: Record<string, unknown>) => ({
      summary: typeof row.summary === "string" ? row.summary : null,
      domain: typeof row.domain === "string" ? row.domain : null,
      stressLevel:
        row.stress_level != null ? Number(row.stress_level) : null,
    })
  )

  const checkIns: MemoryCheckInRow[] = checkInResult.rows.map(
    (row: Record<string, unknown>) => ({
      domain: typeof row.domain === "string" ? row.domain : null,
      subscale: typeof row.subscale === "string" ? row.subscale : null,
      reflection: typeof row.reflection === "string" ? row.reflection : null,
      copingAction:
        typeof row.coping_action === "string" ? row.coping_action : null,
      distress: row.distress != null ? Number(row.distress) : null,
      contextTags:
        typeof row.context_tags === "string"
          ? row.context_tags
          : row.context_tags != null
            ? JSON.stringify(row.context_tags)
            : null,
    })
  )

  return buildEmotionalThemeMemory(sessions, checkIns, options)
}
