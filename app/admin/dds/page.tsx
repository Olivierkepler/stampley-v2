import { query } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

type SearchParams = {
  q?: string
  highDistress?: string
}

const DDS_QUESTIONS = [
  { id: "q1", domain: "Emotional" },
  { id: "q2", domain: "Physician" },
  { id: "q3", domain: "Emotional" },
  { id: "q4", domain: "Physician" },
  { id: "q5", domain: "Regimen" },
  { id: "q6", domain: "Regimen" },
  { id: "q7", domain: "Interpersonal" },
  { id: "q8", domain: "Emotional" },
  { id: "q9", domain: "Physician" },
  { id: "q10", domain: "Regimen" },
  { id: "q11", domain: "Emotional" },
  { id: "q12", domain: "Regimen" },
  { id: "q13", domain: "Interpersonal" },
  { id: "q14", domain: "Emotional" },
  { id: "q15", domain: "Physician" },
  { id: "q16", domain: "Regimen" },
  { id: "q17", domain: "Interpersonal" },
] as const

function formatScore(value: unknown): string {
  if (value == null || value === "") return "—"
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(2) : "—"
}

function hasHighDistress(row: Record<string, unknown>): boolean {
  const scores = [
    row.total_score,
    row.emotional_score,
    row.physician_score,
    row.regimen_score,
    row.interpersonal_score,
  ]

  return scores.some((value) => {
    const n = Number(value)
    return Number.isFinite(n) && n >= 3
  })
}

function focusDomain(row: Record<string, unknown>): string {
  const confirmed = row.confirmed_domain
  if (typeof confirmed === "string" && confirmed.trim()) return confirmed

  const recommended = row.recommended_domain
  if (typeof recommended === "string" && recommended.trim()) return recommended

  return "—"
}

function hasStoredItemResponses(row: Record<string, unknown>): boolean {
  return DDS_QUESTIONS.some((q) => row[q.id] != null)
}

export default async function AdminDDSPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const q = (params.q ?? "").trim()
  const highDistressOnly = params.highDistress === "1"

  const where: string[] = []
  const values: string[] = []

  if (q) {
    values.push(`%${q}%`)
    where.push(
      `(u.email ILIKE $${values.length} OR CAST(u.study_id AS TEXT) ILIKE $${values.length})`
    )
  }

  if (highDistressOnly) {
    where.push(`(
      d.total_score >= 3 OR
      d.emotional_score >= 3 OR
      d.physician_score >= 3 OR
      d.regimen_score >= 3 OR
      d.interpersonal_score >= 3
    )`)
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""

  const result = await query(
    `
    SELECT
      d.id AS dds_id,
      d.user_id,
      u.email,
      u.study_id,
      d.created_at,
      d.total_score,
      d.emotional_score,
      d.physician_score,
      d.regimen_score,
      d.interpersonal_score,
      d.recommended_domain,
      d.confirmed_domain,
      d.q1, d.q2, d.q3, d.q4, d.q5, d.q6, d.q7, d.q8, d.q9,
      d.q10, d.q11, d.q12, d.q13, d.q14, d.q15, d.q16, d.q17
    FROM dds_responses d
    JOIN users u ON u.id = d.user_id
    ${whereClause}
    ORDER BY d.created_at DESC
    `,
    values
  )

  const rows = result.rows as Record<string, unknown>[]

  return (
    <main className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Admin · Study
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          DDS-17 Responses
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Review baseline Diabetes Distress Scale scores and individual item
          responses. Scores ≥ 3 indicate moderate distress or higher on that
          scale.
        </p>
      </div>

      <form
        action="/admin/dds"
        method="get"
        className="border border-slate-200 bg-gradient-to-br from-white to-stone-50 p-5 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Filters
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="block min-w-[220px] flex-1 text-sm">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">
              Search participant
            </span>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Email or study ID…"
              className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="highDistress"
              value="1"
              defaultChecked={highDistressOnly}
              className="h-4 w-4 border-slate-300"
            />
            High distress only (≥ 3)
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-black"
            >
              Apply
            </button>

            {(q || highDistressOnly) && (
              <Link
                href="/admin/dds"
                className="border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 hover:bg-slate-50"
              >
                Clear
              </Link>
            )}
          </div>
        </div>
      </form>

      <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Participant DDS-17 Submissions
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {rows.length} response{rows.length === 1 ? "" : "s"}
            {highDistressOnly ? " · high distress filter active" : ""}
            {q ? ` · matching “${q}”` : ""}
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm font-medium text-slate-700">
              No DDS-17 responses submitted yet.
            </p>
            {(q || highDistressOnly) && (
              <p className="mt-2 text-sm text-slate-500">
                Try clearing filters to see all submissions.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Participant
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Study ID
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Completed
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Total
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Emotional
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Physician
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Regimen
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Interpersonal
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Focus Domain
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Distress
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Items
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const highDistress = hasHighDistress(row)
                  const storedItems = hasStoredItemResponses(row)
                  const userId = String(row.user_id)

                  return (
                    <tr
                      key={String(row.dds_id)}
                      className="border-b border-slate-100 align-top hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/users/${userId}`}
                          className="font-medium text-[#005ea8] hover:underline"
                        >
                          {String(row.email)}
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {row.study_id != null ? String(row.study_id) : "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {row.created_at
                          ? new Date(String(row.created_at)).toLocaleString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-900">
                        {formatScore(row.total_score)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatScore(row.emotional_score)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatScore(row.physician_score)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatScore(row.regimen_score)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatScore(row.interpersonal_score)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {focusDomain(row)}
                      </td>

                      <td className="px-5 py-4">
                        {highDistress ? (
                          <span className="border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                            ≥ 3
                          </span>
                        ) : (
                          <span className="border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                            Below 3
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {storedItems ? (
                          <details className="group">
                            <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.08em] text-[#005ea8] hover:underline [&::-webkit-details-marker]:hidden">
                              View q1–q17
                            </summary>

                            <div className="mt-3 min-w-[280px] border border-slate-200 bg-slate-50 p-3">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="pb-2 pr-3 font-semibold">
                                      Item
                                    </th>
                                    <th className="pb-2 pr-3 font-semibold">
                                      Domain
                                    </th>
                                    <th className="pb-2 font-semibold">
                                      Score
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {DDS_QUESTIONS.map((question, index) => {
                                    const value = row[question.id]
                                    const numeric =
                                      value == null ? null : Number(value)

                                    return (
                                      <tr
                                        key={question.id}
                                        className="border-b border-slate-100 last:border-b-0"
                                      >
                                        <td className="py-1.5 pr-3 font-medium text-slate-800">
                                          {index + 1}
                                        </td>
                                        <td className="py-1.5 pr-3 text-slate-600">
                                          {question.domain}
                                        </td>
                                        <td className="py-1.5 font-medium text-slate-900">
                                          {numeric == null ||
                                          Number.isNaN(numeric)
                                            ? "—"
                                            : numeric}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </details>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Not stored
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-slate-500">
        Individual item responses (q1–q17) are stored when participants submit
        the DDS-17 survey. Domain and total scores are calculated at submission
        time and are not recalculated on this page.
      </p>
    </main>
  )
}
