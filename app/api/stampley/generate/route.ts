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
import { getRecentEmotionalThemes } from "@/lib/stampley-memory"
import type { Domain } from "@/store/checkin-store"

function safeErrorInfo(error: unknown) {
  if (error instanceof Error) {
    return { message: error.message, name: error.name }
  }

  return { message: String(error) }
}

function safeOpenAIErrorInfo(error: unknown) {
  const base = safeErrorInfo(error)

  const status =
    typeof (error as { status?: unknown })?.status === "number"
      ? (error as { status: number }).status
      : undefined

  return { ...base, status }
}

export async function POST(req: NextRequest) {
  console.log("[stampley/generate] route entered")

  console.log("[stampley/generate] env flags", {
    hasDatabaseUrl: !!process.env.DATABASE_URL?.trim(),
    hasOpenAiApiKey: !!process.env.OPENAI_API_KEY?.trim(),
  })

  const session = await auth()

  console.log("[stampley/generate] auth flags", {
    sessionExists: !!session,
    hasUserId: !!session?.user?.id,
    hasUserEmail: !!session?.user?.email,
  })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    console.log("[stampley/generate] request body parsed successfully")

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

    let userResult

    try {
      userResult = await query("SELECT email FROM users WHERE id = $1", [
        session.user.id,
      ])

      console.log("[stampley/generate] user lookup success", {
        found: userResult.rows.length > 0,
      })
    } catch (error) {
      console.error(
        "[stampley/generate] user lookup failure",
        safeErrorInfo(error)
      )
      throw error
    }

    const email = userResult.rows[0]?.email ?? ""
    const firstName = email.split("@")[0].split(".")[0]
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

    const resolvedDomain = normalizeDomain(domain)
    const stressLevel = Number(distress) || 5
    const highStress = isHighStress(stressLevel)

    let liveStudyContext

    try {
      liveStudyContext = await loadLiveStudyContext(
        session.user.id,
        resolvedDomain
      )

      console.log("[stampley/generate] study context success", {
        hasContext: liveStudyContext != null,
      })
    } catch (error) {
      console.error(
        "[stampley/generate] study context failure",
        safeErrorInfo(error)
      )
      throw error
    }

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

    const history = sanitizeHistory(messageHistory)
    const phase = resolvePhase(history, conversationPhase)

    let longitudinalContext
    let emotionalThemeMemory

    try {
      ;[longitudinalContext, emotionalThemeMemory] = await Promise.all([
        loadLongitudinalContext(session.user.id),
        getRecentEmotionalThemes(session.user.id, {
          weekNumber: input.weekNumber,
          phase,
          highStress,
          dayNumber: input.dayNumber,
        }),
      ])

      console.log("[stampley/generate] memory DB query success")
    } catch (error) {
      console.error(
        "[stampley/generate] memory DB query failure",
        safeErrorInfo(error)
      )
      throw error
    }

    const messages = buildOpenAIMessages(
      input,
      history,
      phase,
      highStress,
      longitudinalContext,
      emotionalThemeMemory
    )

    console.log("[stampley/generate] OpenAI call start")

    const apiKey = process.env.OPENAI_API_KEY?.trim()

    if (!apiKey) {
      console.error(
        "[stampley/generate] OPENAI_API_KEY missing at request runtime"
      )
      throw new Error("OPENAI_API_KEY is missing at request runtime")
    }

    const openai = new OpenAI({
      apiKey,
    })

    let completion

    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 800,
        temperature: 0.7,
        response_format: { type: "json_object" },
      })

      console.log("[stampley/generate] OpenAI call success")
    } catch (error) {
      console.error(
        "[stampley/generate] OpenAI call failure",
        safeOpenAIErrorInfo(error)
      )

      throw error
    }

    const raw = completion.choices[0]?.message?.content ?? ""

    let stampleyResponse

    try {
      stampleyResponse = JSON.parse(raw)
    } catch {
      console.error("[stampley/generate] JSON parse failed")

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
    console.error("[stampley/generate] final catch", safeErrorInfo(error))

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}

async function loadLiveStudyContext(userId: string, domain: Domain) {
  const progressResult = await query(
    "SELECT total_checkins FROM user_study_progress WHERE user_id = $1",
    [userId]
  )

  const totalCheckins = Number(progressResult.rows[0]?.total_checkins ?? 0)
  const checkInNumber = totalCheckins + 1

  return buildCheckInStudyContext(domain, checkInNumber)
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
      stressLevel: row.stress_level != null ? Number(row.stress_level) : null,
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
  _name: string,
  _domain: Domain,
  phase: StampleyPhase,
  highStress: boolean
) {
  const microSkill =
    "Small reset: relax your shoulders once before moving to the next thing."

  if (highStress) {
    return {
      greeting: "",
      validation:
        "Today sounds really heavy, and it makes sense you'd feel that way.",
      reflection_question: "",
      micro_skill: microSkill,
      education_chip: "",
      closure:
        "You do not need to figure everything out right now. Support is available if you need someone to talk to.",
    }
  }

  switch (phase) {
    case "opening":
      return {
        greeting: "",
        validation:
          "Trying to manage diabetes while carrying what you shared today can feel heavy.",
        reflection_question: "What felt hardest to carry today?",
        micro_skill: "",
        education_chip: "",
        closure: "",
      }

    case "exploration":
      return {
        greeting: "",
        validation:
          "It sounds like the pressure may have built gradually through the day.",
        reflection_question:
          "When did you first notice yourself feeling overwhelmed?",
        micro_skill: "",
        education_chip: "",
        closure: "",
      }

    case "coping":
      return {
        greeting: "",
        validation: "You have been holding a lot — a small reset can still help.",
        reflection_question: "",
        micro_skill: microSkill,
        education_chip: "",
        closure: "",
      }

    case "closure":
      return {
        greeting: "",
        validation: "Thank you for checking in honestly today.",
        reflection_question: "",
        micro_skill: "",
        education_chip: "",
        closure:
          "You do not need to solve everything tonight. Complete Check-in is here when you are ready — no rush.",
      }
  }
}