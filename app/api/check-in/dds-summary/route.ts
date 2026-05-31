export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"

type DomainName = "Emotional" | "Regimen" | "Physician" | "Interpersonal"

function parseScore(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : NaN
}

function highestDomainFromScores(scores: {
  emotionalScore: number
  regimenScore: number
  physicianScore: number
  interpersonalScore: number
}): DomainName {
  const entries: { domain: DomainName; score: number }[] = [
    { domain: "Emotional", score: scores.emotionalScore },
    { domain: "Regimen", score: scores.regimenScore },
    { domain: "Physician", score: scores.physicianScore },
    { domain: "Interpersonal", score: scores.interpersonalScore },
  ]

  return entries.reduce((best, current) =>
    current.score > best.score ? current : best
  ).domain
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await query(
      `
        SELECT
          total_score,
          emotional_score,
          physician_score,
          regimen_score,
          interpersonal_score
        FROM dds_responses
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [session.user.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ ddsSummary: null })
    }

    const row = result.rows[0]
    const totalScore = parseScore(row.total_score)
    const emotionalScore = parseScore(row.emotional_score)
    const regimenScore = parseScore(row.regimen_score)
    const physicianScore = parseScore(row.physician_score)
    const interpersonalScore = parseScore(row.interpersonal_score)

    const highestDomain = highestDomainFromScores({
      emotionalScore,
      regimenScore,
      physicianScore,
      interpersonalScore,
    })

    return NextResponse.json({
      ddsSummary: {
        totalScore,
        emotionalScore,
        regimenScore,
        physicianScore,
        interpersonalScore,
        highestDomain,
      },
    })
  } catch (error) {
    console.error("[dds-summary]", error)
    return NextResponse.json(
      { error: "Failed to load DDS summary" },
      { status: 500 }
    )
  }
}
