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
    const { distress, mood, energy, contextTags, reflection, copingAction, domain } = body

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

    // Get week number
    const progressResult = await query(
      "SELECT study_start_date, current_week FROM user_study_progress WHERE user_id = $1",
      [session.user.id]
    )

    let weekNumber = 1
    let dayNumber = 1

    if (progressResult.rows.length > 0) {
      const startDate = new Date(progressResult.rows[0].study_start_date)
      const today = new Date()
      const diffDays = Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      weekNumber = Math.min(Math.floor(diffDays / 7) + 1, 4)
      dayNumber = (diffDays % 7) + 1
    }

    // Get subscale for today based on domain + day
    const subscaleMap: Record<string, string[]> = {
      Emotional: ["Feeling Overwhelmed", "Feeling Discouraged", "Feeling Burned Out", "Fear of Complications", "Mental Energy Drain"],
      Regimen: ["Blood Sugar Testing", "Routine Failure", "Management Confidence", "Meal Plan Adherence", "Self-Management Motivation"],
      Physician: ["Doctor Knowledge", "Care Directions", "Doctor Responsiveness", "Doctor Access"],
      Interpersonal: ["Social Support for Self-Care", "Family Appreciation", "Emotional Support from Others"],
    }

    const subscales = subscaleMap[domain] ?? ["General"]
    const subscale = subscales[(dayNumber - 1) % subscales.length]

    // Insert check-in
    await query(
      `INSERT INTO check_in_submissions (
        id, user_id, domain, subscale, distress, mood, energy,
        reflection, coping_action, context_tags,
        needs_safety_escalation, consecutive_high_distress_days,
        week_number, day_number, check_in_date, created_at, updated_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, CURRENT_DATE, NOW(), NOW()
      )`,
      [
        session.user.id, domain, subscale,
        distress, mood, energy,
        reflection, copingAction,
        JSON.stringify(contextTags),
        needsSafetyEscalation, consecutiveDays,
        weekNumber, dayNumber,
      ]
    )

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

    // ✅ Return subscale + day info for Stampley AI
    return NextResponse.json({
      success: true,
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