export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import OpenAI from "openai"
import { buildCheckInStudyContext } from "@/lib/check-in-context"
import {
  buildLongitudinalContext,
  buildOpenAIMessages,
  deriveConversationPhase,
  isHighStress,
  normalizeDomain,
  sanitizeHistory,
  type LongitudinalChatSessionRow,
  type LongitudinalCheckInRow,
  type StampleyInput,
  type StampleyPhase,
} from "@/lib/stampley-prompt"
import type { Domain } from "@/store/checkin-store"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      distress,
      mood,
      energy,
      contextTags,
      reflection,
      copingAction,
      domain,
      messageHistory,
      conversationPhase,
    } = body

    const userResult = await query(
      "SELECT email FROM users WHERE id = $1",
      [session.user.id]
    )
    const email = userResult.rows[0]?.email ?? ""
    const firstName = email.split("@")[0].split(".")[0]
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

    const resolvedDomain = normalizeDomain(domain)
    const stressLevel = Number(distress) || 5
    const highStress = isHighStress(stressLevel)

    const liveStudyContext = await loadLiveStudyContext(
      session.user.id,
      resolvedDomain
    )

    const input: StampleyInput = {
      firstName: formattedName,
      distress: stressLevel,
      mood: Number(mood) || 5,
      energy: Number(energy) || 5,
      domain: resolvedDomain,
      subscale: liveStudyContext?.subscale ?? "",
      reflection: typeof reflection === "string" ? reflection : "",
      copingAction: typeof copingAction === "string" ? copingAction : "",
      contextTags: Array.isArray(contextTags) ? contextTags : [],
      dayNumber: liveStudyContext?.dayNumber ?? 1,
      weekNumber: liveStudyContext?.weekNumber ?? 1,
    }

    const longitudinalContext = await loadLongitudinalContext(
      session.user.id
    )

    const history = sanitizeHistory(messageHistory)
    const phase = resolvePhase(history, conversationPhase)
    const messages = buildOpenAIMessages(
      input,
      history,
      phase,
      highStress,
      longitudinalContext
    )

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0]?.message?.content ?? ""

    let stampleyResponse
    try {
      stampleyResponse = JSON.parse(raw)
    } catch {
      console.error("[stampley] JSON parse failed:", raw)
      stampleyResponse = getFallbackResponse(
        formattedName,
        resolvedDomain,
        phase,
        highStress
      )
    }

    return NextResponse.json({
      success: true,
      response: stampleyResponse,
      conversationPhase: phase,
      highStress,
    })
  } catch (error) {
    console.error("[stampley/generate]", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}

async function loadLiveStudyContext(userId: string, domain: Domain) {
  const progressResult = await query(
    "SELECT study_start_date FROM user_study_progress WHERE user_id = $1",
    [userId]
  )
  return buildCheckInStudyContext(
    domain,
    progressResult.rows[0]?.study_start_date ?? null
  )
}

async function loadLongitudinalContext(userId: string) {
  const [checkInResult, chatResult] = await Promise.all([
    query(
      `SELECT check_in_date, distress, mood, energy, domain, subscale, coping_action
       FROM check_in_submissions
       WHERE user_id = $1
       ORDER BY check_in_date DESC NULLS LAST, created_at DESC
       LIMIT 7`,
      [userId]
    ),
    query(
      `SELECT summary, user_message_count, assistant_message_count, domain, stress_level
       FROM stampley_chat_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    ),
  ])

  const checkIns: LongitudinalCheckInRow[] = checkInResult.rows.map(
    (row: Record<string, unknown>) => ({
      checkInDate: String(row.check_in_date ?? ""),
      stressLevel: Number(row.distress) || 0,
      mood: Number(row.mood) || 0,
      energy: Number(row.energy) || 0,
      domain: typeof row.domain === "string" ? row.domain : null,
      subscale: typeof row.subscale === "string" ? row.subscale : null,
      copingAction:
        typeof row.coping_action === "string" ? row.coping_action : null,
    })
  )

  const chatSessions: LongitudinalChatSessionRow[] = chatResult.rows.map(
    (row: Record<string, unknown>) => ({
      summary: typeof row.summary === "string" ? row.summary : null,
      userMessageCount: Number(row.user_message_count) || 0,
      assistantMessageCount: Number(row.assistant_message_count) || 0,
      domain: typeof row.domain === "string" ? row.domain : null,
      stressLevel:
        row.stress_level != null ? Number(row.stress_level) : null,
    })
  )

  return buildLongitudinalContext(checkIns, chatSessions)
}

function resolvePhase(
  history: ReturnType<typeof sanitizeHistory>,
  clientPhase: unknown
): StampleyPhase {
  const derived = deriveConversationPhase(history)
  const validPhases: StampleyPhase[] = [
    "opening",
    "exploration",
    "coping",
    "closure",
  ]
  if (
    typeof clientPhase === "string" &&
    validPhases.includes(clientPhase as StampleyPhase) &&
    clientPhase === derived
  ) {
    return clientPhase as StampleyPhase
  }
  return derived
}

function getFallbackResponse(
  name: string,
  domain: Domain,
  phase: StampleyPhase,
  highStress: boolean
) {
  const domainMessages: Record<Domain, string> = {
    Emotional:
      "managing the emotional weight of diabetes takes real courage. You showed up today and that matters.",
    Regimen:
      "keeping up with your diabetes routine is genuinely hard work. Every effort counts, even the small ones.",
    Physician:
      "navigating your healthcare can feel overwhelming sometimes. Your concerns are always valid.",
    Interpersonal:
      "feeling unsupported can make everything harder. Reaching out — even small steps — makes a difference.",
  }

  const educationChip = `Living with diabetes means ${domainMessages[domain]}`
  const microSkill =
    "Try taking one slow, deep breath — in for 4 counts, hold for 4, out for 4. You can do this anytime things feel heavy."

  if (highStress) {
    return {
      greeting: `Hi ${name}, I'm glad you're here.`,
      validation:
        "Your stress level is very high today, and that is completely understandable. You don't have to go through this alone.",
      reflection_question:
        "What's one thing — even something small — that might help you feel a little more steady right now?",
      micro_skill: microSkill,
      education_chip: educationChip,
      closure:
        "Support is available if you need someone to talk to. Take things one breath at a time.",
    }
  }

  switch (phase) {
    case "opening":
      return {
        greeting: `Hi ${name}, thank you for checking in today. This space is just for you — no judgment, no pressure.`,
        validation: `I can see today had its challenges. What you're feeling makes complete sense given everything you're managing.`,
        reflection_question: `What's one thing from today you'd like to leave behind as you move into tomorrow?`,
        micro_skill: microSkill,
        education_chip: educationChip,
        closure: `You've already done something meaningful today by checking in. For tomorrow, try giving yourself one small moment of kindness.`,
      }
    case "exploration":
      return {
        greeting: "",
        validation:
          "Thank you for sharing more — what you're describing matters, and it makes sense you'd feel this way.",
        reflection_question:
          "What feels like the most important part of that for you right now?",
        micro_skill: microSkill,
        education_chip: educationChip,
        closure: "I'm glad you're continuing to reflect.",
      }
    case "coping":
      return {
        greeting: "",
        validation:
          "It sounds like you've been carrying a lot. A small step can still make a real difference.",
        reflection_question:
          "What's one small action you could try in the next day or two that feels realistic for you?",
        micro_skill: microSkill,
        education_chip: educationChip,
        closure: "Even a tiny step counts. Be gentle with yourself.",
      }
    case "closure":
      return {
        greeting: "",
        validation:
          "Thank you for taking this time to reflect today. What you shared really matters.",
        reflection_question:
          "When you feel ready, would you like to complete today's check-in so it's saved?",
        micro_skill: microSkill,
        education_chip: educationChip,
        closure:
          "Tap Complete Check-in when you're ready to save today's check-in. You can always come back tomorrow.",
      }
  }
}
