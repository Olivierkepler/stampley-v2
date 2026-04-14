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

const MICRO_SKILLS: Record<Domain, Record<string, string>> = {
  Emotional: {
    "Feeling Overwhelmed": "the 4-4-4 box breath — breathe in for 4 counts, hold for 4, breathe out for 4. Try one cycle right now.",
    "Feeling Discouraged": "an If-Then plan — 'If I feel discouraged tomorrow, then I will [one small action].' Write it down.",
    "Feeling Burned Out": "the One Thing rule — pick just ONE diabetes task for tomorrow. Let everything else wait.",
    "Fear of Complications": "present-moment grounding — name 3 things you can see, 2 you can hear, 1 you can feel right now.",
    "Mental Energy Drain": "an energy audit — write down 2 things that drained your energy today and 1 thing that restored it.",
  },
  Regimen: {
    "Blood Sugar Testing": "habit stacking — attach your blood sugar check to something you already do, like brushing your teeth.",
    "Routine Failure": "a self-compassion break — say to yourself: 'This is hard. Other people struggle too. I am doing my best.'",
    "Management Confidence": "success spotting — write down one thing you managed well today, no matter how small.",
    "Meal Plan Adherence": "the 80/20 rule — aim for better, not perfect. What's one meal tomorrow you can make slightly healthier?",
    "Self-Management Motivation": "a values check — think of one person or reason that makes managing your health worth it. Hold that for 30 seconds.",
  },
  Physician: {
    "Doctor Knowledge": "a question list — write your top 2 questions for your next appointment right now.",
    "Care Directions": "the Ask-Tell-Ask method — ask your doctor to explain in simpler terms, then summarize back what you heard.",
    "Doctor Responsiveness": "concern framing — start with: 'Something I want to make sure we address today is...'",
    "Doctor Access": "a care gap plan — ask about telehealth, nurse practitioner visits, or a diabetes educator as alternatives.",
  },
  Interpersonal: {
    "Social Support for Self-Care": "the specific ask — try: 'One thing that would really help me is [specific action].' Specific asks get specific results.",
    "Family Appreciation": "a window statement — share one honest sentence about what managing diabetes really demands from you daily.",
    "Emotional Support from Others": "one connection today — reach out to one person, not about diabetes, just to connect.",
  },
}

const EDUCATION_CHIPS: Record<Domain, string> = {
  Emotional: "Diabetes distress is the emotional burden of living with and managing diabetes — distinct from clinical depression. It's very common and very real.",
  Regimen: "Diabetes management requires hundreds of daily decisions. Feeling overwhelmed by the regimen is one of the most reported challenges among people with T2DM.",
  Physician: "Research shows that a strong patient-provider relationship significantly improves diabetes outcomes. Your concerns are worth raising.",
  Interpersonal: "Social support is one of the strongest protective factors against diabetes distress. Even small acts of connection make a measurable difference.",
}

export function getMicroSkill(domain: Domain, subscale: string): string {
  return MICRO_SKILLS[domain]?.[subscale] ?? "taking one slow, deep breath and reminding yourself that you are doing your best."
}

export function getEducationChip(domain: Domain): string {
  return EDUCATION_CHIPS[domain]
}

export function buildStampleyPrompt(input: StampleyInput): string {
  const microSkill = getMicroSkill(input.domain, input.subscale)
  const educationChip = getEducationChip(input.domain)

  const contextSummary = input.contextTags.length > 0
    ? `Today's context: ${input.contextTags.join(", ")}.`
    : "No specific context tags selected today."

  return `You are Stampley, a warm, empathetic AI companion designed to support people living with Type 2 Diabetes in a clinical research study (AIDES-T2D).

CRITICAL RULES — follow these absolutely:
- NEVER make medical claims, diagnoses, or treatment recommendations
- NEVER suggest medications, dosages, or clinical interventions
- NEVER use clinical jargon or diagnostic language
- ALWAYS validate before offering any guidance
- Keep each part SHORT — 2-4 sentences maximum per part
- Use the participant's own words from their reflection when validating
- Tone: warm, human, non-judgmental, like a trusted friend who understands diabetes

TODAY'S PARTICIPANT DATA:
- Name: ${input.firstName}
- Distress score: ${input.distress}/10
- Mood score: ${input.mood}/10
- Energy score: ${input.energy}/10
- Weekly focus domain: ${input.domain}
- Today's subscale: ${input.subscale}
- ${contextSummary}
- Their reflection: "${input.reflection || "No reflection provided today."}"
- Their coping action: "${input.copingAction || "None mentioned."}"
- Study week: ${input.weekNumber}, Day: ${input.dayNumber}

MICRO-SKILL TO DELIVER (use exactly as written):
${microSkill}

EDUCATION CHIP (use exactly as written):
${educationChip}

Generate a response with EXACTLY these 6 JSON fields:

{
  "greeting": "2-3 sentences. Address ${input.firstName} by name. Frame the ${input.domain} domain warmly. Establish safety and non-judgment.",
  "validation": "2-4 sentences. Reference their distress score of ${input.distress}/10. Use keywords from their reflection. Normalize their experience without minimizing it.",
  "reflection_question": "Exactly 1 open question aligned to the subscale '${input.subscale}'. Gentle and curious in tone. Do not add explanation — just the question.",
  "micro_skill": "2-3 sentences introducing the micro-skill: ${microSkill}. Make it feel doable and approachable.",
  "education_chip": "${educationChip}",
  "closure": "2-3 sentences. Acknowledge their effort today. Give ONE specific doable action for tomorrow. End with a warm affirmation."
}

RESPOND WITH VALID JSON ONLY. No markdown, no code blocks, no extra text. Just the JSON object.`
}