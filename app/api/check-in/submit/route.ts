export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import { getSubscaleForDay } from "@/lib/check-in-subscale"
import {
  computeStudyWeekAndDayFromCheckInNumber,
  STUDY_COMPLETE_MESSAGE,
  STUDY_TOTAL_CHECKINS,
} from "@/lib/check-in-utils"
import { resolveWeeklyDomainForUser } from "@/lib/resolve-weekly-domain"
import { STUDY_DOMAINS } from "@/lib/weekly-domain-progress"

const DUPLICATE_CHECK_IN_MESSAGE =
  "You have already completed today's check-in."

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  )
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { distress, mood, energy, contextTags, reflection, copingAction } = body

    const { domain } = await resolveWeeklyDomainForUser(
      session.user.id,
      body.domain
    )

    if (!domain || !STUDY_DOMAINS.includes(domain)) {
      return NextResponse.json(
        { error: "Weekly focus is missing. Open Weekly Domain and continue again." },
        { status: 400 }
      )
    }

    const existingToday = await query(
      `SELECT id
       FROM check_in_submissions
       WHERE user_id = $1 AND check_in_date = CURRENT_DATE
       LIMIT 1`,
      [session.user.id]
    )

    if (existingToday.rows.length > 0) {
      return NextResponse.json(
        { error: DUPLICATE_CHECK_IN_MESSAGE },
        { status: 409 }
      )
    }

    const progressResult = await query(
      "SELECT total_checkins FROM user_study_progress WHERE user_id = $1",
      [session.user.id]
    )

    const totalCheckins = Number(progressResult.rows[0]?.total_checkins ?? 0)

    if (totalCheckins >= STUDY_TOTAL_CHECKINS) {
      return NextResponse.json({ error: STUDY_COMPLETE_MESSAGE }, { status: 403 })
    }

    const checkInNumber = totalCheckins + 1
    const { weekNumber, dayNumber } =
      computeStudyWeekAndDayFromCheckInNumber(checkInNumber)
    const subscale = getSubscaleForDay(domain, dayNumber)

    // Get previous check-in for safety logic
    const prevResult = await query(
      `SELECT distress, consecutive_high_distress_days
       FROM check_in_submissions
       WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [session.user.id]
    )

    const prev = prevResult.rows[0]
    const consecutiveDays =
      prev && prev.distress >= 9 && distress >= 9
        ? (prev.consecutive_high_distress_days || 0) + 1
        : distress >= 9 ? 1 : 0

    const needsSafetyEscalation = consecutiveDays >= 2

    let checkInSubmissionId: string
    try {
      const insertResult = await query(
        `INSERT INTO check_in_submissions (
          id, user_id, domain, subscale, distress, mood, energy,
          reflection, coping_action, context_tags,
          needs_safety_escalation, consecutive_high_distress_days,
          week_number, day_number, check_in_date, created_at, updated_at
        ) VALUES (
          gen_random_uuid()::text, $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13, CURRENT_DATE, NOW(), NOW()
        )
        RETURNING id`,
        [
          session.user.id, domain, subscale,
          distress, mood, energy,
          reflection, copingAction,
          JSON.stringify(contextTags),
          needsSafetyEscalation, consecutiveDays,
          weekNumber, dayNumber,
        ]
      )
      const insertedId = (insertResult.rows[0] as { id?: string } | undefined)?.id
      if (!insertedId) {
        throw new Error("Insert succeeded but no id returned")
      }
      checkInSubmissionId = insertedId
    } catch (insertError) {
      if (isUniqueViolation(insertError)) {
        return NextResponse.json(
          { error: DUPLICATE_CHECK_IN_MESSAGE },
          { status: 409 }
        )
      }
      throw insertError
    }

    // Update study progress
    await query(
      `INSERT INTO user_study_progress (
        id, user_id, study_start_date, current_week,
        total_checkins, last_checkin_date,
        consecutive_high_distress_days, updated_at
      ) VALUES (
        gen_random_uuid()::text, $1, CURRENT_DATE, $2,
        1, CURRENT_DATE, $3, NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        current_week = $2,
        total_checkins = user_study_progress.total_checkins + 1,
        last_checkin_date = CURRENT_DATE,
        consecutive_high_distress_days = $3,
        updated_at = NOW()`,
      [session.user.id, weekNumber, consecutiveDays]
    )

    return NextResponse.json({
      success: true,
      id: checkInSubmissionId,
      checkInSubmissionId,
      needsSafetyEscalation,
      subscale,
      dayNumber,
      weekNumber,
    })

  } catch (error) {
    console.error("[check-in/submit]", error)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}
