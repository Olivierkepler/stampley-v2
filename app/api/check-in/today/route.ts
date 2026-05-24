export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await query(
    `SELECT id FROM check_in_submissions
     WHERE user_id = $1 AND check_in_date = CURRENT_DATE
     LIMIT 1`,
    [session.user.id]
  )

  return NextResponse.json({
    checkedInToday: result.rows.length > 0,
  })
}
