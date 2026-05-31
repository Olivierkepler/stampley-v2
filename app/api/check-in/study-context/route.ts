export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { buildCheckInStudyContext } from "@/lib/check-in-context"
import { resolveWeeklyDomainForUser } from "@/lib/resolve-weekly-domain"
import { STUDY_DOMAINS } from "@/lib/weekly-domain-progress"
import { query } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { domain } = await resolveWeeklyDomainForUser(
      session.user.id,
      body.domain
    )

    if (!domain || !STUDY_DOMAINS.includes(domain)) {
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
