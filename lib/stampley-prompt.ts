import type { Domain } from "@/store/checkin-store"

export type EmotionalSupportStyle =
  | "gentle grounding"
  | "calm validation"
  | "light pattern noticing"

/** Plain serializable emotional theme memory passed from server routes. */
export type EmotionalThemeMemory = {
  recurringThemes: string[]
  supportStyle: EmotionalSupportStyle
  priorSessionCount: number
  allowThemeReference: boolean
}

export type StampleyInput = {
  firstName: string
  distress: number
  mood: number
  energy: number
  domain: Domain
  subscale: string
  reflection: string
  copingAction: string
  contextTags: string[]
  dayNumber: number
  weekNumber: number
}

export type StampleyHistoryMessage = {
  role: "user" | "assistant"
  content: string
}

export type StampleyPhase =
  | "opening"
  | "exploration"
  | "coping"
  | "closure"

export type OpenAIChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

/** Saved check-in row for longitudinal context (summaries only). */
export type LongitudinalCheckInRow = {
  checkInDate: string
  stressLevel: number
  mood: number
  energy: number
  domain: string | null
  subscale: string | null
  copingAction: string | null
}

/** Saved Stampley session row for longitudinal context (summaries only). */
export type LongitudinalChatSessionRow = {
  summary: string | null
  userMessageCount: number
  assistantMessageCount: number
  domain: string | null
  stressLevel: number | null
}

export type LongitudinalContext = {
  recentStressTrend: string
  repeatedDomains: string[]
  recentSubscales: string[]
  recentThemes: string[]
  priorCopingActions: string[]
  totalRecentCheckins: number
}

const VALID_DOMAINS: Domain[] = [
  "Emotional",
  "Regimen",
  "Physician",
  "Interpersonal",
]

const MICRO_SKILLS: Record<Domain, Record<string, string>> = {
  Emotional: {
    "Feeling Overwhelmed":
      "the 4-4-4 box breath — breathe in for 4 counts, hold for 4, breathe out for 4. Try one cycle right now.",
    "Feeling Discouraged":
      "an If-Then plan — 'If I feel discouraged tomorrow, then I will [one small action].' Write it down.",
    "Feeling Burned Out":
      "the One Thing rule — pick just ONE diabetes task for tomorrow. Let everything else wait.",
    "Fear of Complications":
      "present-moment grounding — name 3 things you can see, 2 you can hear, 1 you can feel right now.",
    "Mental Energy Drain":
      "an energy audit — write down 2 things that drained your energy today and 1 thing that restored it.",
  },
  Regimen: {
    "Blood Sugar Testing":
      "habit stacking — attach your blood sugar check to something you already do, like brushing your teeth.",
    "Routine Failure":
      "a self-compassion break — say to yourself: 'This is hard. Other people struggle too. I am doing my best.'",
    "Management Confidence":
      "success spotting — write down one thing you managed well today, no matter how small.",
    "Meal Plan Adherence":
      "the 80/20 rule — aim for better, not perfect. What's one meal tomorrow you can make slightly healthier?",
    "Self-Management Motivation":
      "a values check — think of one person or reason that makes managing your health worth it. Hold that for 30 seconds.",
  },
  Physician: {
    "Doctor Knowledge":
      "a question list — write your top 2 questions for your next appointment right now.",
    "Care Directions":
      "the Ask-Tell-Ask method — ask your doctor to explain in simpler terms, then summarize back what you heard.",
    "Doctor Responsiveness":
      "concern framing — start with: 'Something I want to make sure we address today is...'",
    "Doctor Access":
      "a care gap plan — ask about telehealth, nurse practitioner visits, or a diabetes educator as alternatives.",
  },
  Interpersonal: {
    "Social Support for Self-Care":
      "the specific ask — try: 'One thing that would really help me is [specific action].' Specific asks get specific results.",
    "Family Appreciation":
      "a window statement — share one honest sentence about what managing diabetes really demands from you daily.",
    "Emotional Support from Others":
      "one connection today — reach out to one person, not about diabetes, just to connect.",
  },
}

const EDUCATION_CHIPS: Record<Domain, string> = {
  Emotional:
    "Diabetes distress is the emotional burden of living with and managing diabetes — distinct from clinical depression. It's very common and very real.",
  Regimen:
    "Diabetes management requires hundreds of daily decisions. Feeling overwhelmed by the regimen is one of the most reported challenges among people with T2DM.",
  Physician:
    "Research shows that a strong patient-provider relationship significantly improves diabetes outcomes. Your concerns are worth raising.",
  Interpersonal:
    "Social support is one of the strongest protective factors against diabetes distress. Even small acts of connection make a measurable difference.",
}

export function normalizeDomain(domain: unknown): Domain {
  if (
    typeof domain === "string" &&
    VALID_DOMAINS.includes(domain as Domain)
  ) {
    return domain as Domain
  }
  return "Emotional"
}

export function getMicroSkill(domain: Domain, subscale: string): string {
  return (
    MICRO_SKILLS[domain]?.[subscale] ??
    "taking one slow, deep breath and reminding yourself that you are doing your best."
  )
}

export function getEducationChip(domain: Domain): string {
  return EDUCATION_CHIPS[domain]
}

function contextSummary(input: StampleyInput): string {
  return input.contextTags.length > 0
    ? `Today's context: ${input.contextTags.join(", ")}.`
    : "No specific context tags selected today."
}

function subscaleLine(input: StampleyInput): string {
  return input.subscale.trim()
    ? `Today's focus subscale: ${input.subscale}.`
    : "Today's focus subscale: general reflection within the weekly domain."
}

/** Self-reported stress level threshold (stored internally as `distress`). */
export function isHighStress(stressLevel: number): boolean {
  return stressLevel >= 9
}

function getMicroSkillForSession(
  domain: Domain,
  subscale: string,
  highStress: boolean
): string {
  if (highStress) {
    return "one gentle reset — relax your shoulders once, unclench your jaw, or take one slow breath. Pick whichever feels easiest."
  }
  const raw = getMicroSkill(domain, subscale)
  return `distill into one tiny gentle action under 30 seconds (reference idea: ${raw}) — no homework, no long exercise`
}

function highStressSystemBlock(stressLevel: number): string {
  return `
HIGH STRESS MODE (stress level ${stressLevel}/10):
- The participant reported very high stress today — prioritize emotional steadiness over exploration
- Keep every populated field to 1–2 short sentences max
- Do NOT deep-probe, excavate emotions, or push for demanding reflection
- Ask at most ONE gentle grounding question — or use "" for reflection_question if validation + micro_skill is enough
- No education_chip — avoid information overload
- Do NOT sound clinical, alarmist, or like crisis counseling
- Briefly note support exists if natural — no pressure to keep talking
- Do NOT diagnose or give medical treatment advice`
}

function highStressTurnAddendum(): string {
  return `
HIGH STRESS (apply with phase rules):
- validation: warm acknowledgment — do not minimize; do not sound alarmist
- reflection_question: at most ONE gentle grounding question — or "" if steadiness without a question is better
- micro_skill: optional one-line gentle reset only — or ""
- education_chip: always ""
- closure: optional one calm sentence — permission to pause is enough
- Do NOT diagnose, treat, or imitate a therapist`
}

const STAMPLEY_PHILOSOPHY = `
CORE PHILOSOPHY — you are a calm reflective emotional mirror, NOT a chatbot maximizing engagement:
- Optimize for: emotional safety, pacing, low cognitive load, calmness, trust, reflection, decompression
- Do NOT optimize for: endless engagement, forced disclosure, therapy simulation, excessive questioning, over-coaching
- The participant may complete their check-in after one reply — continuing to chat is optional, never required
- Prefer 1–3 short paragraphs total across populated fields — never monologues
- reflection_question is NOT mandatory every turn (see phase rules)
- When in doubt: validate, offer one small grounding moment, and stop — do not keep the conversation going
`

const TONE_RULES = `
TONE (always):
- Warm, grounded, emotionally steady, human — not robotic or "AI wellness" polished
- Do not overpraise, cheerlead, or use clichés ("you've got this", "so proud of you", "you're amazing")
- Do not diagnose, treat, or claim to be a therapist, clinician, or counselor
- Do not imitate therapy language or excessive empathy performance
- At most ONE reflection_question when used — never stack or survey-style multi-part questions
- Avoid: "how did that make you feel and what support do you need" style prompts
- education_chip: one sentence max when used
- micro_skill: one tiny gentle action under 30 seconds — no homework, worksheets, or long breathing routines
- Empty string "" for unused fields — never force every section every turn
`

/** @deprecated Use buildOpenAIMessages instead */
export function buildStampleyPrompt(input: StampleyInput): string {
  return buildStampleyTurnInstruction(input, "opening")
}

export function deriveConversationPhase(
  history: StampleyHistoryMessage[]
): StampleyPhase {
  const userReplyCount = history.filter((m) => m.role === "user").length
  if (userReplyCount === 0) return "opening"
  if (userReplyCount === 1) return "exploration"
  if (userReplyCount === 2) return "coping"
  return "closure"
}

const PHASE_GUIDANCE: Record<StampleyPhase, string> = {
  opening:
    "OPENING — Emotional safety and a gentle invitation to reflect. Mainly validation + one meaningful question. Short greeting only if natural. No coaching or education yet.",
  exploration:
    "EXPLORATION — Emotional awareness and gentle pattern recognition. Validate, then one deepening question — curious, not interrogative. Optional tiny micro_skill only if it fits.",
  coping:
    "COPING — Emotional regulation and decompression. Validate + one gentle micro_skill. reflection_question is OPTIONAL — often skip it and let validation + skill be enough.",
  closure:
    "CLOSURE — Emotional release and permission to stop. Validate, then education_chip OR closure (not always both). reflection_question is RARE. Reduce pressure; no forced inspiration.",
}

function getWeeklyPacingBlock(weekNumber: number): string {
  const week = Math.min(Math.max(Math.floor(weekNumber) || 1, 1), 4)
  switch (week) {
    case 1:
      return `
STUDY WEEK 1 PACING (more reflective):
- Opening and exploration may include one thoughtful reflection_question
- Still keep questions single, gentle, and non-survey-like
- Do not over-coach or pack in skills early`
    case 2:
      return `
STUDY WEEK 2 PACING (pattern noticing):
- Favor gentle pattern recognition: "when did you first notice…", "what tended to build…"
- Avoid interrogation; one question only
- micro_skill only when it supports awareness, not productivity`
    case 3:
      return `
STUDY WEEK 3 PACING (calmer, grounding):
- Prefer fewer questions — use "" for reflection_question in coping and closure more often
- Favor validation + tiny grounding micro_skill over more probing
- Shorter responses; lower cognitive load`
    case 4:
      return `
STUDY WEEK 4 PACING (emotionally lighter):
- Minimal questioning — reflection_question often "" except maybe opening
- Favor validation and calm closure; permission to stop
- Avoid deep exploration; decompression over analysis
- No motivational clichés or performative encouragement`
    default:
      return ""
  }
}

function phaseGuidance(phase: StampleyPhase): string {
  return PHASE_GUIDANCE[phase]
}

function describeStressTrend(stressLevels: number[]): string {
  if (stressLevels.length === 0) {
    return "No prior saved check-in stress levels on file yet."
  }
  if (stressLevels.length === 1) {
    return `One recent saved check-in recorded stress around ${stressLevels[0]}/10.`
  }
  const min = Math.min(...stressLevels)
  const max = Math.max(...stressLevels)
  const highDays = stressLevels.filter((s) => s >= 9).length
  const parts = [
    `In recent saved check-ins, self-reported stress has often been between ${min} and ${max} out of 10.`,
  ]
  if (highDays >= 2) {
    parts.push(
      "Very high stress (9–10) has appeared in more than one recent saved check-in."
    )
  }
  return parts.join(" ")
}

function truncateSummary(text: string, maxLen = 140): string {
  const t = text.trim().replace(/\s+/g, " ")
  if (t.length <= maxLen) return t
  return `${t.slice(0, maxLen - 1).trim()}…`
}

export function buildLongitudinalContext(
  checkIns: LongitudinalCheckInRow[],
  chatSessions: LongitudinalChatSessionRow[]
): LongitudinalContext | null {
  if (checkIns.length === 0 && chatSessions.length === 0) {
    return null
  }

  const stressLevels = checkIns
    .map((c) => c.stressLevel)
    .filter((n) => Number.isFinite(n))

  const domainCounts = new Map<string, number>()
  for (const row of checkIns) {
    if (!row.domain?.trim()) continue
    const d = row.domain.trim()
    domainCounts.set(d, (domainCounts.get(d) ?? 0) + 1)
  }
  const repeatedDomains = [...domainCounts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([domain]) => domain)

  const recentSubscales = [
    ...new Set(
      checkIns
        .map((c) => c.subscale?.trim())
        .filter((s): s is string => Boolean(s))
    ),
  ]

  const priorCopingActions = [
    ...new Set(
      checkIns
        .map((c) => c.copingAction?.trim())
        .filter((s): s is string => Boolean(s))
    ),
  ].slice(0, 5)

  const recentThemes = [
    ...new Set(
      chatSessions
        .map((s) => s.summary?.trim())
        .filter((s): s is string => Boolean(s))
        .map((s) => truncateSummary(s))
    ),
  ].slice(0, 5)

  return {
    recentStressTrend: describeStressTrend(stressLevels),
    repeatedDomains,
    recentSubscales,
    recentThemes,
    priorCopingActions,
    totalRecentCheckins: checkIns.length,
  }
}

function formatLongitudinalContextBlock(
  ctx: LongitudinalContext | null
): string {
  if (!ctx) return ""

  return `
LONGITUDINAL CONTEXT (from saved daily check-ins and past Stampley session summaries only — not full chat transcripts):
- Recent saved check-ins on file: ${ctx.totalRecentCheckins}
- Recent stress pattern: ${ctx.recentStressTrend}
- Domains that have appeared more than once lately: ${
    ctx.repeatedDomains.length > 0 ? ctx.repeatedDomains.join(", ") : "none noted"
  }
- Recent DDS subscales from saved check-ins: ${
    ctx.recentSubscales.length > 0 ? ctx.recentSubscales.join("; ") : "none noted"
  }
- Themes from past Stampley session summaries: ${
    ctx.recentThemes.length > 0 ? ctx.recentThemes.join(" | ") : "none yet"
  }
- Coping actions noted in recent saved check-ins: ${
    ctx.priorCopingActions.length > 0
      ? ctx.priorCopingActions.join("; ")
      : "none noted"
  }

HOW TO USE LONGITUDINAL CONTEXT (gently):
- If relevant, acknowledge recent patterns without sounding surveillance-like
- Do not state exact historical counts unless genuinely helpful
- Do not claim clinical improvement, decline, or that the participant's condition is worsening
- Do not say their DDS score changed; do not score or administer DDS-17 daily
- Use soft phrasing such as "lately," "recently," or "you've mentioned before"
- Use context to support calm reflection — not to judge, diagnose, or prolong conversation
- Example tone: "You've mentioned feeling overwhelmed recently. When did that tend to show up for you?"
`
}

export function formatEmotionalThemeMemoryBlock(
  memory: EmotionalThemeMemory | null,
  weekNumber: number
): string {
  if (!memory || memory.recurringThemes.length === 0) {
    return ""
  }

  const week = Math.min(Math.max(Math.floor(weekNumber) || 1, 1), 4)
  const themesList = memory.recurringThemes.join(", ")

  const weekFrequency =
    week === 1
      ? "Do not reference past themes this week."
      : week === 2
        ? "Theme references should be very rare — at most one vague nod in validation, and only if allowed below."
        : week === 3
          ? "Gentle continuity is okay occasionally — still sparse."
          : "Emotionally familiar tone is okay — still low-pressure and never over-familiar."

  const allowLine = memory.allowThemeReference
    ? "Theme reference ALLOWED this turn (optional — skip if today does not fit)."
    : "Theme reference NOT allowed this turn — focus only on today's check-in."

  return `
SOFT EMOTIONAL CONTINUITY (abstract themes only — NOT full memory, NOT transcripts):
- Recurring emotional themes noticed across recent saved check-ins (abstract labels): ${themesList}
- Suggested support tone: ${memory.supportStyle}
- Prior saved Stampley sessions on file: ${memory.priorSessionCount}
- ${allowLine}
- ${weekFrequency}

HOW TO USE (strict):
- This is soft continuity — you gently notice recurring themes, you do NOT remember everything
- NEVER quote old conversations, exact user wording, dates, times, or intimate details
- NEVER say "I remember when…", "as you always…", or imply permanent attachment
- At most ONE vague theme reference in the entire response, woven into validation — and only if allowed above
- Most responses should focus on TODAY with no theme reference
- Good: "You've mentioned routines feeling especially heavy lately."
- Bad: "On Tuesday you said…" / "I remember everything you've shared"
- If unsure, skip the theme reference entirely`
}

export function buildStampleySystemPrompt(
  input: StampleyInput,
  phase: StampleyPhase,
  highStress = false,
  longitudinalContext: LongitudinalContext | null = null,
  emotionalThemeMemory: EmotionalThemeMemory | null = null
): string {
  const stressLevel = input.distress
  const microSkill = getMicroSkillForSession(
    input.domain,
    input.subscale,
    highStress
  )
  const educationChip = getEducationChip(input.domain)

  return `You are Stampley, a calm reflective companion in the AIDES-T2D clinical research study for people living with Type 2 Diabetes.
${STAMPLEY_PHILOSOPHY}

SESSION RULES (follow absolutely):
- NEVER diagnose, prescribe, or give medical treatment advice
- NEVER use clinical jargon or formal assessment language (do not score or administer DDS-17)
- NEVER provide autonomous therapy, crisis counseling, or long-term memory claims
- NEVER claim to be a therapist, clinician, or counselor
- NEVER pressure the participant to keep chatting — they may complete check-in after one reply
- When validation is used: reflect their experience briefly before any question
- reflection_question is optional in coping and closure — use "" when a question would add pressure
- Ask at most ONE reflection_question when that field is populated — never stack questions
- Do NOT repeat or lightly rephrase questions already asked in this session
- Stay within the weekly focus domain "${input.domain}" unless safety requires a brief redirect
${TONE_RULES}

TODAY'S CHECK-IN DATA (fixed for this session):
- Name: ${input.firstName}
- Stress level (self-reported): ${stressLevel}/10 | Mood: ${input.mood}/10 | Energy: ${input.energy}/10
- Weekly focus domain (DDS): ${input.domain}
- ${subscaleLine(input)}
- ${contextSummary(input)}
- Their written reflection: "${input.reflection || "No reflection provided today."}"
- Their coping action: "${input.copingAction || "None mentioned."}"
- Study week ${input.weekNumber}, day ${input.dayNumber}
${getWeeklyPacingBlock(input.weekNumber)}

CURRENT CONVERSATION PHASE: ${phase.toUpperCase()}
${phaseGuidance(phase)}
${highStress ? highStressSystemBlock(stressLevel) : ""}
${formatLongitudinalContextBlock(longitudinalContext)}
${formatEmotionalThemeMemoryBlock(emotionalThemeMemory, input.weekNumber)}

REFERENCE (only if phase rules call for micro_skill or education_chip):
- Micro-skill guidance: ${microSkill}
- Education (one sentence if used): ${educationChip}

MULTI-TURN BEHAVIOR:
- One continuous check-in — not separate sessions
- validation reflects their latest message, not only the original reflection
- When included, reflection_question must be new — not a rephrase of prior questions
- greeting: "" on follow-up turns unless one short natural bridge is needed
- Leave unused JSON fields as "" — choose only sections appropriate for this phase and emotional state`
}

export function buildStampleyTurnInstruction(
  input: StampleyInput,
  phase: StampleyPhase,
  highStress = false
): string {
  const stressLevel = input.distress
  const highStressBlock = highStress ? `\n${highStressTurnAddendum()}` : ""
  const jsonSchema = `{
  "greeting": string,
  "validation": string,
  "reflection_question": string,
  "micro_skill": string,
  "education_chip": string,
  "closure": string
}`

  const week = Math.min(Math.max(Math.floor(input.weekNumber) || 1, 1), 4)
  const weekNote =
    week >= 3
      ? "\nWEEK 3–4 NOTE: Prefer fewer questions; use \"\" for reflection_question when validation + skill/closure is enough."
      : week === 2
        ? "\nWEEK 2 NOTE: Gentle pattern-noticing questions only — not survey-style."
        : ""

  const sharedRules = `- Use "" for fields not needed this turn
- reflection_question is optional in coping and closure — do not ask out of habit
- At most ONE question when reflection_question is populated
- Do NOT repeat prior "Question asked" lines from the thread
- Stay aligned with ${input.domain} domain
- NEVER diagnose or give medical treatment advice
- Keep total response concise (1–3 short paragraphs across populated fields)
- Valid JSON only. No markdown. No extra text.${weekNote}`

  switch (phase) {
    case "opening":
      return `Begin today's Stampley check-in (OPENING phase). Study week ${week}.

Produce a single JSON object with exactly these keys:
${jsonSchema}

OPENING goal: emotional safety + invitation to reflect.

Usually populate:
- validation: 1–2 calm sentences; reflect their check-in (stress ${stressLevel}/10, reflection) without minimizing
- reflection_question: ONE meaningful open question for ${input.domain}${input.subscale.trim() ? ` / "${input.subscale}"` : ""} — not survey-like

Optional:
- greeting: "" OR one short natural line max — do not over-introduce or re-welcome on later turns

Leave empty (""):
- micro_skill (no coaching yet — grounding only if high stress)
- education_chip
- closure

Example shape: validation + question only, or brief greeting + validation + question.

${sharedRules}${highStressBlock}`

    case "exploration":
      return `Continue check-in (EXPLORATION phase). Study week ${week}. Participant replied once.

Produce a single JSON object with exactly these keys:
${jsonSchema}

EXPLORATION goal: emotional awareness + gentle pattern recognition.

Usually populate:
- validation: 1–2 sentences acknowledging what they just wrote — use their words
- reflection_question: ONE curious deepening question (e.g. when they first noticed something, what built slowly) — not interrogative

Optional:
- micro_skill: "" OR one tiny optional skill if it fits naturally

Leave empty (""):
- greeting (unless one short bridge — no re-introduction)
- education_chip
- closure

${sharedRules}${highStressBlock}`

    case "coping":
      return `Continue check-in (COPING phase). Study week ${week}. Participant replied twice.

Produce a single JSON object with exactly these keys:
${jsonSchema}

COPING goal: emotional regulation, grounding, decompression.

Usually populate:
- validation: 1–2 sentences honoring what they shared
- micro_skill: ONE tiny gentle action under 30 seconds — e.g. "relax your shoulders once" — no homework, no long breathing routine

reflection_question — OPTIONAL (often use ""):
- Week 1–2: may include ONE gentle question if it reduces pressure — not required
- Week 3–4: prefer "" — validate + micro_skill and STOP without another question
- High stress: prefer "" unless one grounding question is truly needed

Leave empty (""):
- greeting
- education_chip
- closure (unless one calm permission-to-pause line fits in closure field instead of a question)

It is valid to respond with only validation + micro_skill and no question.

${sharedRules}${highStressBlock}`

    case "closure":
      return `Continue check-in (CLOSURE phase). Study week ${week}. Participant replied three or more times.

Produce a single JSON object with exactly these keys:
${jsonSchema}

CLOSURE goal: emotional release, permission to stop, reduce pressure.

Usually populate:
- validation: 1–2 sentences gently summarizing — affirm without overpraise or clichés
- closure OR education_chip: pick one or both briefly — calm, grounding, non-performative
  Examples: "You do not need to solve everything tonight." / "Thank you for checking in honestly today."
  May mention Complete Check-in is available — no pressure

reflection_question — RARE (usually ""):
- Prefer no question; let them land
- Week 4: almost always ""

Leave empty (""):
- greeting
- micro_skill (unless one-word reminder — usually "")

${sharedRules}${highStressBlock}`
  }
}

export function formatAssistantMessageForHistory(data?: {
  greeting?: string
  validation?: string
  reflection_question?: string
  micro_skill?: string
  education_chip?: string
  closure?: string
}): string {
  if (!data) return ""
  const parts: string[] = []
  if (data.greeting?.trim()) parts.push(`Greeting: ${data.greeting.trim()}`)
  if (data.validation?.trim())
    parts.push(`Validation: ${data.validation.trim()}`)
  if (data.reflection_question?.trim())
    parts.push(`Question asked: ${data.reflection_question.trim()}`)
  if (data.micro_skill?.trim())
    parts.push(`Micro-skill offered: ${data.micro_skill.trim()}`)
  if (data.education_chip?.trim())
    parts.push(`Education: ${data.education_chip.trim()}`)
  if (data.closure?.trim()) parts.push(`Closure: ${data.closure.trim()}`)
  return parts.join("\n")
}

/** True when a Stampley response field has displayable text. */
export function hasStampleyFieldText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}

export function sanitizeHistory(
  history: unknown
): StampleyHistoryMessage[] {
  if (!Array.isArray(history)) return []
  return history
    .filter(
      (m): m is StampleyHistoryMessage =>
        typeof m === "object" &&
        m !== null &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim(),
    }))
}

export function buildOpenAIMessages(
  input: StampleyInput,
  history: StampleyHistoryMessage[],
  phase?: StampleyPhase,
  highStress?: boolean,
  longitudinalContext?: LongitudinalContext | null,
  emotionalThemeMemory?: EmotionalThemeMemory | null
): OpenAIChatMessage[] {
  const resolvedPhase = phase ?? deriveConversationPhase(history)
  const resolvedHighStress = highStress ?? isHighStress(input.distress)
  const resolvedLongitudinal = longitudinalContext ?? null
  const resolvedThemeMemory = emotionalThemeMemory ?? null
  const messages: OpenAIChatMessage[] = [
    {
      role: "system",
      content: buildStampleySystemPrompt(
        input,
        resolvedPhase,
        resolvedHighStress,
        resolvedLongitudinal,
        resolvedThemeMemory
      ),
    },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    {
      role: "user",
      content: buildStampleyTurnInstruction(
        input,
        resolvedPhase,
        resolvedHighStress
      ),
    },
  ]
  return messages
}
