import type { Domain } from "@/store/checkin-store"

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
    return "the 4-4-4 box breath — breathe in for 4 counts, hold for 4, breathe out for 4. Try one cycle right now."
  }
  return getMicroSkill(domain, subscale)
}

function highStressSystemBlock(stressLevel: number): string {
  return `
HIGH STRESS MODE (stress level ${stressLevel}/10):
- The participant reported very high stress today
- Use calmer, shorter language throughout (1–2 sentences per field when possible)
- Do NOT deep-probe, analyze, or push for emotionally demanding reflection
- Ask ONE gentle grounding or immediate-support question only
- Briefly remind them that support is available if they need someone to talk to
- Prioritize steadiness and presence over deepening the conversation
- Do NOT diagnose or give medical treatment advice`
}

function highStressTurnAddendum(): string {
  return `
HIGH STRESS requirements (apply in addition to phase rules):
- Keep all fields brief and calm
- reflection_question: ONE grounding or immediate-support question (e.g. what feels steady right now, who could you reach out to, what would help in this moment) — not a deep exploratory question
- validation: acknowledge high stress with warmth; do not minimize
- micro_skill: use the grounding breath from system context
- closure: remind them support resources exist; no pressure to continue chatting
- Do NOT diagnose or suggest treatment`
}

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
    "OPENING — Welcome the participant, validate their check-in data, and ask ONE gentle open question aligned to the DDS domain.",
  exploration:
    "EXPLORATION — Build directly on their latest answer. Ask ONE deeper, more specific question within the same DDS domain.",
  coping:
    "COPING — Offer ONE realistic micro-step (use micro_skill). Ask ONE action-oriented question about a small next step they could try.",
  closure:
    "CLOSURE — Summarize the conversation gently. Affirm their effort. Encourage them to tap Complete Check-in to save today's check-in.",
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
- Use longitudinal context only to support reflection — not to judge or diagnose
- Example tone: "You've mentioned feeling overwhelmed recently. What feels most important to make a little lighter today?"
`
}

export function buildStampleySystemPrompt(
  input: StampleyInput,
  phase: StampleyPhase,
  highStress = false,
  longitudinalContext: LongitudinalContext | null = null
): string {
  const stressLevel = input.distress
  const microSkill = getMicroSkillForSession(
    input.domain,
    input.subscale,
    highStress
  )
  const educationChip = getEducationChip(input.domain)

  return `You are Stampley, a warm, empathetic AI companion in the AIDES-T2D clinical research study for people living with Type 2 Diabetes.

SESSION RULES (follow absolutely):
- NEVER diagnose, prescribe, or give medical treatment advice
- NEVER use clinical jargon or formal assessment language (do not score or administer DDS-17)
- NEVER provide autonomous therapy, crisis counseling, or long-term memory claims
- ALWAYS validate the participant's feelings before asking anything
- Ask exactly ONE open reflection_question per turn — never multiple questions in one field
- Build each new question on the participant's most recent reply; deepen gradually
- Do NOT repeat or lightly rephrase questions already asked in this session
- Stay within the weekly focus domain "${input.domain}" unless safety requires a brief redirect
- Keep each JSON field SHORT (2–4 sentences max unless noted)
- Tone: warm, human, non-judgmental — like a trusted friend who understands diabetes
- Do not overwhelm: one skill, one insight, one question, one small next step

TODAY'S CHECK-IN DATA (fixed for this session):
- Name: ${input.firstName}
- Stress level (self-reported): ${stressLevel}/10 | Mood: ${input.mood}/10 | Energy: ${input.energy}/10
- Weekly focus domain (DDS): ${input.domain}
- ${subscaleLine(input)}
- ${contextSummary(input)}
- Their written reflection: "${input.reflection || "No reflection provided today."}"
- Their coping action: "${input.copingAction || "None mentioned."}"
- Study week ${input.weekNumber}, day ${input.dayNumber}

CURRENT CONVERSATION PHASE: ${phase.toUpperCase()}
${phaseGuidance(phase)}
${highStress ? highStressSystemBlock(stressLevel) : ""}
${formatLongitudinalContextBlock(longitudinalContext)}

USE THESE EXACT STRINGS in your JSON output:
- micro_skill field: introduce this skill in 2–3 approachable sentences: ${microSkill}
- education_chip field (verbatim): ${educationChip}

MULTI-TURN BEHAVIOR:
- This is one continuous check-in conversation, not separate sessions
- On follow-up turns: read prior messages, honor what the participant already shared
- validation must reflect their latest message, not only the original reflection
- reflection_question must be new and more specific than prior questions
- On follow-up turns: greeting should be "" or one short bridge sentence (no re-introduction)
- On follow-up turns: closure stays brief — one gentle affirmation, not a full wrap-up speech`
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

  const sharedRules = `- Ask exactly ONE question in reflection_question — never more than one
- Do NOT repeat or rephrase any "Question asked" from the thread
- Stay aligned with the ${input.domain} DDS domain
- NEVER diagnose or give medical treatment advice
- Respond with valid JSON only. No markdown. No extra text.`

  switch (phase) {
    case "opening":
      return `Begin today's Stampley check-in (OPENING phase).

Produce your assistant turn as a single JSON object with exactly these keys:
${jsonSchema}

OPENING requirements:
- greeting: 2–3 sentences; address ${input.firstName} by name; frame the ${input.domain} domain warmly; establish safety and non-judgment
- validation: 2–4 sentences; reference stress level ${stressLevel}/10; use keywords from their reflection; normalize without minimizing
- reflection_question: exactly ONE gentle open question aligned to the ${input.domain} domain${input.subscale.trim() ? ` and subscale "${input.subscale}"` : ""}; question only, no preamble
- micro_skill: 2–3 sentences introducing the assigned micro-skill from system context
- education_chip: exact text from system context
- closure: 2–3 sentences; acknowledge effort; ONE small doable action for tomorrow; warm affirmation

${sharedRules}${highStressBlock}`

    case "exploration":
      return `Continue the check-in (EXPLORATION phase). The participant has replied once.

Produce your NEXT assistant turn as a single JSON object with exactly these keys:
${jsonSchema}

EXPLORATION requirements:
- greeting: use "" OR at most one short bridging sentence (no re-introduction)
- validation: 2–4 sentences directly acknowledging what they just wrote; use their words; build on their answer
- reflection_question: exactly ONE deeper open question that follows naturally from their latest reply; must differ from prior questions; stay in ${input.domain} domain
- micro_skill: 2–3 sentences using the assigned micro-skill from system context
- education_chip: exact text from system context
- closure: 1–2 brief warm sentences

${sharedRules}${highStressBlock}`

    case "coping":
      return `Continue the check-in (COPING phase). The participant has replied twice.

Produce your NEXT assistant turn as a single JSON object with exactly these keys:
${jsonSchema}

COPING requirements:
- greeting: use "" OR at most one short bridging sentence
- validation: 2–3 sentences honoring what they shared; connect feelings to a manageable next step
- reflection_question: exactly ONE action-oriented question about a small realistic step they could try (within ${input.domain} domain)
- micro_skill: 2–3 sentences presenting ONE concrete, doable micro-step from system context — make it feel achievable today or tomorrow
- education_chip: exact text from system context
- closure: 1–2 sentences encouraging one small action without pressure

${sharedRules}${highStressBlock}`

    case "closure":
      return `Continue the check-in (CLOSURE phase). The participant has replied three or more times.

Produce your NEXT assistant turn as a single JSON object with exactly these keys:
${jsonSchema}

CLOSURE requirements:
- greeting: use "" OR one brief warm bridge sentence
- validation: 2–3 sentences gently summarizing what they shared across this conversation; affirm their effort
- reflection_question: ONE gentle question — e.g. whether they feel ready to complete today's check-in, or what they want to carry forward; may mention tapping "Complete Check-in" to save (no pressure)
- micro_skill: 1–2 sentences — optional reminder of the micro-skill or a brief restatement; keep light
- education_chip: exact text from system context OR a brief paraphrase if it fits the summary
- closure: 2–3 sentences; warm summary; clearly encourage tapping Complete Check-in to save today's check-in; affirm they can return tomorrow

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
  if (data.closure?.trim()) parts.push(`Closure: ${data.closure.trim()}`)
  return parts.join("\n")
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
  longitudinalContext?: LongitudinalContext | null
): OpenAIChatMessage[] {
  const resolvedPhase = phase ?? deriveConversationPhase(history)
  const resolvedHighStress = highStress ?? isHighStress(input.distress)
  const resolvedLongitudinal = longitudinalContext ?? null
  const messages: OpenAIChatMessage[] = [
    {
      role: "system",
      content: buildStampleySystemPrompt(
        input,
        resolvedPhase,
        resolvedHighStress,
        resolvedLongitudinal
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
