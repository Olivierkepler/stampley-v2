export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import { isCheckInDomain } from "@/lib/check-in-subscale"
import type { Domain } from "@/store/checkin-store"
import {
  fetchUserTotalCheckins,
  fetchUserWeeklyDomainRows,
} from "@/lib/resolve-weekly-domain"
import {
  getDomainForStudyWeek,
  getStudyWeekForNextCheckIn,
  getUsedDomainsFromPreviousWeeks,
  isWeeklyDomainLocked,
  STUDY_DOMAINS,
} from "@/lib/weekly-domain-progress"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const totalCompleted = await fetchUserTotalCheckins(session.user.id)
    const currentWeek = getStudyWeekForNextCheckIn(totalCompleted)
    const weeklyRows = await fetchUserWeeklyDomainRows(session.user.id)
    const currentWeekDomain = getDomainForStudyWeek(weeklyRows, currentWeek)
    const usedPreviousDomains = getUsedDomainsFromPreviousWeeks(
      weeklyRows,
      currentWeek
    )
    const isLocked = isWeeklyDomainLocked(
      totalCompleted,
      currentWeek,
      currentWeekDomain
    )

    return NextResponse.json({
      currentWeek,
      currentWeekDomain,
      usedPreviousDomains,
      isLocked,
      totalCompleted,
    })
  } catch (error) {
    console.error("[check-in/weekly-domain GET]", error)
    return NextResponse.json({ error: "Failed to load weekly domain" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const domain = body.domain

    if (!isCheckInDomain(domain) || !STUDY_DOMAINS.includes(domain)) {
      return NextResponse.json({ error: "Invalid domain." }, { status: 400 })
    }

    const totalCompleted = await fetchUserTotalCheckins(session.user.id)
    const currentWeek = getStudyWeekForNextCheckIn(totalCompleted)
    const weeklyRows = await fetchUserWeeklyDomainRows(session.user.id)
    const currentWeekDomain = getDomainForStudyWeek(weeklyRows, currentWeek)
    const usedPreviousDomains = getUsedDomainsFromPreviousWeeks(
      weeklyRows,
      currentWeek
    )
    const isLocked = isWeeklyDomainLocked(
      totalCompleted,
      currentWeek,
      currentWeekDomain
    )

    if (isLocked) {
      return NextResponse.json(
        { error: "This week's domain is locked once check-ins begin." },
        { status: 403 }
      )
    }

    if (usedPreviousDomains.includes(domain as Domain)) {
      return NextResponse.json(
        { error: "You already completed this domain in a previous week." },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO user_weekly_domains (id, user_id, week_number, domain, started_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, NOW())
       ON CONFLICT (user_id, week_number)
       DO UPDATE SET domain = EXCLUDED.domain, started_at = NOW()`,
      [session.user.id, currentWeek, domain]
    )

    await query(
      `INSERT INTO user_study_progress (id, user_id, study_start_date, current_week, total_checkins, updated_at)
       VALUES (gen_random_uuid()::text, $1, CURRENT_DATE, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         current_week = EXCLUDED.current_week,
         updated_at = NOW()`,
      [session.user.id, currentWeek, totalCompleted]
    )

    return NextResponse.json({
      success: true,
      weekNumber: currentWeek,
      domain,
    })
  } catch (error) {
    console.error("[check-in/weekly-domain POST]", error)
    return NextResponse.json({ error: "Failed to save weekly domain" }, { status: 500 })
  }
}
