export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { buildCheckInStudyContext } from "@/lib/check-in-context"
import { isCheckInDomain } from "@/lib/check-in-subscale"
import { query } from "@/lib/db"
import type { Domain } from "@/store/checkin-store"

const VALID_DOMAINS: Domain[] = [
  "Emotional",
  "Regimen",
  "Physician",
  "Interpersonal",
]

async function resolveDomain(
  userId: string,
  requested: unknown
): Promise<Domain | null> {
  if (isCheckInDomain(requested)) return requested

  const weekly = await query(
    `SELECT domain FROM user_weekly_domains
     WHERE user_id = $1 ORDER BY week_number DESC LIMIT 1`,
    [userId]
  )
  const weeklyDomain = weekly.rows[0]?.domain
  if (isCheckInDomain(weeklyDomain)) return weeklyDomain

  const dds = await query(
    `SELECT confirmed_domain FROM dds_responses WHERE user_id = $1`,
    [userId]
  )
  const confirmed = dds.rows[0]?.confirmed_domain
  if (isCheckInDomain(confirmed)) return confirmed

  return null
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const domain = await resolveDomain(session.user.id, body.domain)

    if (!domain || !VALID_DOMAINS.includes(domain)) {
      return NextResponse.json(
        {
          error:
            "Weekly focus is missing. Open Weekly Domain and continue again.",
        },
        { status: 400 }
      )
    }

    const progressResult = await query(
      "SELECT total_checkins FROM user_study_progress WHERE user_id = $1",
      [session.user.id]
    )

    const totalCheckins = Number(progressResult.rows[0]?.total_checkins ?? 0)
    const checkInNumber = totalCheckins + 1
    const context = buildCheckInStudyContext(domain, checkInNumber)

    if (!context) {
      return NextResponse.json(
        { error: "Unable to compute study context." },
        { status: 400 }
      )
    }

    return NextResponse.json(context)
  } catch (error) {
    console.error("[check-in/study-context]", error)
    return NextResponse.json(
      { error: "Failed to compute study context" },
      { status: 500 }
    )
  }
}
