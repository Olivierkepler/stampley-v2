export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      checkInSubmissionId,
      domain,
      stressLevel,
      mood,
      energy,
      userMessageCount,
      assistantMessageCount,
      summary,
      messages,
    } = body

    if (
      typeof checkInSubmissionId !== "string" ||
      !checkInSubmissionId.trim()
    ) {
      return NextResponse.json(
        { error: "checkInSubmissionId is required" },
        { status: 400 }
      )
    }

    const owned = await query(
      `SELECT id FROM check_in_submissions
       WHERE id = $1 AND user_id = $2
       LIMIT 1`,
      [checkInSubmissionId.trim(), session.user.id]
    )

    if (owned.rows.length === 0) {
      return NextResponse.json(
        { error: "Check-in not found" },
        { status: 404 }
      )
    }

    const messagesJson = JSON.stringify(
      Array.isArray(messages) ? messages : []
    )

    await query(
      `INSERT INTO stampley_chat_sessions (
        id, user_id, check_in_submission_id, domain,
        stress_level, mood, energy,
        user_message_count, assistant_message_count,
        summary, messages, created_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3,
        $4, $5, $6,
        $7, $8,
        $9, $10::jsonb, NOW()
      )`,
      [
        session.user.id,
        checkInSubmissionId.trim(),
        typeof domain === "string" ? domain : null,
        Number.isFinite(Number(stressLevel)) ? Number(stressLevel) : null,
        Number.isFinite(Number(mood)) ? Number(mood) : null,
        Number.isFinite(Number(energy)) ? Number(energy) : null,
        Number.isFinite(Number(userMessageCount))
          ? Number(userMessageCount)
          : 0,
        Number.isFinite(Number(assistantMessageCount))
          ? Number(assistantMessageCount)
          : 0,
        typeof summary === "string" ? summary : null,
        messagesJson,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[stampley/session]", error)
    return NextResponse.json(
      { error: "Failed to save chat session" },
      { status: 500 }
    )
  }
}
