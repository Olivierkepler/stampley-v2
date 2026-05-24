export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { query } from "@/lib/db"
import {
  buildCsv,
  csvFileResponse,
  exportFilename,
  formatCsvBoolean,
  formatCsvDate,
  formatCsvTimestamp,
  requireAdminApi,
} from "@/lib/admin-csv-export"
import {
  buildHighStressTableFilterClause,
  parseAnalyticsFilters,
} from "@/lib/admin-analytics-filters"

const HEADERS = [
  "user_email",
  "check_in_date",
  "stress_level",
  "mood",
  "energy",
  "domain",
  "subscale",
  "needs_safety_escalation",
  "consecutive_high_distress_days",
  "created_at",
]

export async function GET(req: NextRequest) {
  const admin = await requireAdminApi()
  if (!admin.ok) return admin.response

  const filters = parseAnalyticsFilters(new URL(req.url).searchParams)
  const highStressFilter = buildHighStressTableFilterClause(filters)

  const result = await query(
    `
    SELECT
      u.email AS user_email,
      c.check_in_date,
      c.distress AS stress_level,
      c.mood,
      c.energy,
      c.domain,
      c.subscale,
      c.needs_safety_escalation,
      c.consecutive_high_distress_days,
      c.created_at
    FROM check_in_submissions c
    JOIN users u ON u.id = c.user_id
    WHERE u.role = 'PARTICIPANT'${highStressFilter.clause}
    ORDER BY c.check_in_date DESC, c.created_at DESC
  `,
    highStressFilter.params
  )

  const rows = result.rows.map((row: Record<string, unknown>) => [
    row.user_email,
    formatCsvDate(row.check_in_date),
    row.stress_level,
    row.mood,
    row.energy,
    row.domain,
    row.subscale,
    formatCsvBoolean(row.needs_safety_escalation),
    row.consecutive_high_distress_days,
    formatCsvTimestamp(row.created_at),
  ])

  const csv = buildCsv(HEADERS, rows)
  return csvFileResponse(csv, exportFilename("stampley-high-stress"))
}
