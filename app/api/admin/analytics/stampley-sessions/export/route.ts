export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { query } from "@/lib/db"
import {
  buildCsv,
  csvFileResponse,
  exportFilename,
  formatCsvTimestamp,
  requireAdminApi,
} from "@/lib/admin-csv-export"
import {
  buildSessionFilterClause,
  parseAnalyticsFilters,
} from "@/lib/admin-analytics-filters"

const HEADERS = [
  "user_email",
  "check_in_submission_id",
  "domain",
  "stress_level",
  "mood",
  "energy",
  "user_message_count",
  "assistant_message_count",
  "summary",
  "created_at",
]

export async function GET(req: NextRequest) {
  const admin = await requireAdminApi()
  if (!admin.ok) return admin.response

  const filters = parseAnalyticsFilters(new URL(req.url).searchParams)
  const sessionFilter = buildSessionFilterClause(filters)

  const result = await query(
    `
    SELECT
      u.email AS user_email,
      s.check_in_submission_id,
      s.domain,
      s.stress_level,
      s.mood,
      s.energy,
      s.user_message_count,
      s.assistant_message_count,
      s.summary,
      s.created_at
    FROM stampley_chat_sessions s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN check_in_submissions c ON c.id = s.check_in_submission_id
    WHERE u.role = 'PARTICIPANT'${sessionFilter.clause}
    ORDER BY s.created_at DESC
  `,
    sessionFilter.params
  )

  const rows = result.rows.map((row: Record<string, unknown>) => [
    row.user_email,
    row.check_in_submission_id,
    row.domain,
    row.stress_level,
    row.mood,
    row.energy,
    row.user_message_count,
    row.assistant_message_count,
    row.summary,
    formatCsvTimestamp(row.created_at),
  ])

  const csv = buildCsv(HEADERS, rows)
  return csvFileResponse(csv, exportFilename("stampley-sessions"))
}
