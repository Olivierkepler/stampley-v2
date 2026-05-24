import { query } from "@/lib/db"
import {
  buildAnalyticsQueryString,
  buildCheckInFilterClause,
  buildCheckInRowFilterClause,
  buildHighStressTableFilterClause,
  buildParticipantUserFilterClause,
  buildSessionFilterClause,
  buildSessionRowFilterClause,
  hasActiveAnalyticsFilters,
  parseAnalyticsFilters,
  sqlJoinOn,
  STUDY_DOMAINS,
} from "@/lib/admin-analytics-filters"

export const dynamic = "force-dynamic"

type SearchParams = Record<string, string | string[] | undefined>

function formatDate(value: unknown): string {
  if (!value) return "—"
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
}

function formatNumber(value: unknown, digits = 1): string {
  if (value == null || value === "") return "—"
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(digits) : "—"
}

function pct(numerator: number, denominator: number): string {
  if (denominator <= 0) return "—"
  return `${Math.round((numerator / denominator) * 100)}%`
}

function hasCheckInRowFilters(
  filters: ReturnType<typeof parseAnalyticsFilters>
): boolean {
  return Boolean(
    filters.from ||
      filters.to ||
      filters.domain ||
      filters.week ||
      filters.highStress
  )
}

function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string
  value: string | number
  hint?: string
  accent?: boolean
}) {
  return (
    <div
      className={`border p-5 shadow-sm ${
        accent
          ? "border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-stone-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-stone-50/80 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const filters = parseAnalyticsFilters(params)
  const exportQs = buildAnalyticsQueryString(filters)
  const filtersActive = hasActiveAnalyticsFilters(filters)

  const checkInFilter = buildCheckInFilterClause(filters)
  const sessionFilter = buildSessionFilterClause(filters)
  const highStressFilter = buildHighStressTableFilterClause(filters)
  const userFilter = buildParticipantUserFilterClause(filters)

  const checkInRowOffset = 1 + userFilter.params.length
  const checkInRowFilter = buildCheckInRowFilterClause(
    filters,
    "c",
    checkInRowOffset
  )
  const checkInRowFilterC2 = buildCheckInRowFilterClause(
    filters,
    "c2",
    checkInRowOffset
  )
  const sessionRowOffset = checkInRowOffset + checkInRowFilter.params.length
  const sessionRowFilter = buildSessionRowFilterClause(filters, {
    s: "s",
    c: "c_sess",
    paramOffset: sessionRowOffset,
  })

  const checkInOn = sqlJoinOn(checkInRowFilter)
  const sessionRowOn = sqlJoinOn(sessionRowFilter)
  const participantParams = [
    ...userFilter.params,
    ...checkInRowFilter.params,
    ...sessionRowFilter.params,
  ]

  const rowFiltersActive = hasCheckInRowFilters(filters)

  const participantCountSql = rowFiltersActive
    ? `
      SELECT COUNT(DISTINCT c.user_id)::int AS total_participants
      FROM check_in_submissions c
      JOIN users u ON u.id = c.user_id
      WHERE u.role = 'PARTICIPANT'${checkInFilter.clause}
    `
    : `
      SELECT COUNT(*)::int AS total_participants
      FROM users u
      WHERE u.role = 'PARTICIPANT'${userFilter.clause}
    `

  const participantCountParams = rowFiltersActive
    ? checkInFilter.params
    : userFilter.params

  const [
    participantCountResult,
    overviewResult,
    completionResult,
    participantResult,
    domainResult,
    highStressResult,
    engagementResult,
  ] = await Promise.all([
    query(participantCountSql, participantCountParams),
    query(
      `
      SELECT
        (SELECT COUNT(*)::int
         FROM check_in_submissions c
         JOIN users u ON u.id = c.user_id
         WHERE u.role = 'PARTICIPANT'${checkInFilter.clause}) AS total_checkins,
        (SELECT COUNT(*)::int
         FROM stampley_chat_sessions s
         JOIN users u ON u.id = s.user_id
         LEFT JOIN check_in_submissions c ON c.id = s.check_in_submission_id
         WHERE u.role = 'PARTICIPANT'${sessionFilter.clause}) AS total_stampley_sessions,
        (SELECT ROUND(AVG(c.distress)::numeric, 1)
         FROM check_in_submissions c
         JOIN users u ON u.id = c.user_id
         WHERE u.role = 'PARTICIPANT'${checkInFilter.clause}) AS avg_stress,
        (SELECT COUNT(*)::int
         FROM check_in_submissions c
         JOIN users u ON u.id = c.user_id
         WHERE u.role = 'PARTICIPANT'${checkInFilter.clause}
           AND c.distress >= 9) AS high_stress_checkins
    `,
      checkInFilter.params
    ),
    query(
      `
      SELECT
        COUNT(DISTINCT u.id)::int AS total_participants,
        COUNT(DISTINCT u.id) FILTER (
          WHERE p.completed_at IS NOT NULL
        )::int AS pre_survey_completed,
        COUNT(DISTINCT u.id) FILTER (
          WHERE d.id IS NOT NULL
        )::int AS dds_completed,
        COUNT(DISTINCT u.id) FILTER (
          WHERE EXISTS (
            SELECT 1
            FROM check_in_submissions c
            WHERE c.user_id = u.id${checkInRowFilter.clause}
          )
        )::int AS with_checkins
      FROM users u
      LEFT JOIN pre_survey_responses p ON p.user_id = u.id
      LEFT JOIN dds_responses d ON d.user_id = u.id
      WHERE u.role = 'PARTICIPANT'${userFilter.clause}
    `,
      [...userFilter.params, ...checkInRowFilter.params]
    ),
    query(
      `
      SELECT
        u.email,
        u.role::text AS role,
        COUNT(DISTINCT c.id)::int AS total_checkins,
        MAX(c.check_in_date) AS latest_check_in_date,
        ROUND(AVG(c.distress)::numeric, 1) AS avg_stress,
        ROUND(AVG(c.mood)::numeric, 1) AS avg_mood,
        ROUND(AVG(c.energy)::numeric, 1) AS avg_energy,
        (
          SELECT c2.domain
          FROM check_in_submissions c2
          WHERE c2.user_id = u.id${checkInRowFilterC2.clause}
          GROUP BY c2.domain
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) AS most_common_domain,
        COUNT(DISTINCT s.id) FILTER (
          WHERE s.id IS NOT NULL AND (${sessionRowOn})
        )::int AS stampley_sessions,
        MAX(s.created_at) FILTER (
          WHERE s.id IS NOT NULL AND (${sessionRowOn})
        ) AS last_session_date
      FROM users u
      LEFT JOIN check_in_submissions c
        ON c.user_id = u.id AND (${checkInOn})
      LEFT JOIN stampley_chat_sessions s ON s.user_id = u.id
      LEFT JOIN check_in_submissions c_sess
        ON c_sess.id = s.check_in_submission_id
      WHERE u.role = 'PARTICIPANT'${userFilter.clause}
      GROUP BY u.id, u.email, u.role
      ORDER BY latest_check_in_date DESC NULLS LAST, u.email ASC
    `,
      participantParams
    ),
    query(
      `
      SELECT domain, COUNT(*)::int AS count
      FROM check_in_submissions c
      JOIN users u ON u.id = c.user_id
      WHERE u.role = 'PARTICIPANT'
        AND c.domain IN ('Emotional', 'Regimen', 'Physician', 'Interpersonal')${checkInFilter.clause}
      GROUP BY domain
    `,
      checkInFilter.params
    ),
    query(
      `
      SELECT
        u.email,
        c.check_in_date,
        c.distress AS stress_level,
        c.domain,
        c.needs_safety_escalation
      FROM check_in_submissions c
      JOIN users u ON u.id = c.user_id
      WHERE u.role = 'PARTICIPANT'${highStressFilter.clause}
      ORDER BY c.check_in_date DESC, c.created_at DESC
      LIMIT 75
    `,
      highStressFilter.params
    ),
    query(
      `
      SELECT
        u.email,
        s.user_message_count,
        s.assistant_message_count,
        s.summary,
        c.check_in_date AS linked_check_in_date,
        s.created_at
      FROM stampley_chat_sessions s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN check_in_submissions c ON c.id = s.check_in_submission_id
      WHERE u.role = 'PARTICIPANT'${sessionFilter.clause}
      ORDER BY s.created_at DESC
      LIMIT 100
    `,
      sessionFilter.params
    ),
  ])

  const overview = overviewResult.rows[0] ?? {}
  overview.total_participants =
    participantCountResult.rows[0]?.total_participants ?? 0

  const completion = completionResult.rows[0] ?? {}
  const totalParticipants = Number(completion.total_participants) || 0
  const preSurveyCompleted = Number(completion.pre_survey_completed) || 0
  const ddsCompleted = Number(completion.dds_completed) || 0
  const withCheckins = Number(completion.with_checkins) || 0

  const domainCounts = new Map<string, number>(
    domainResult.rows.map((r: Record<string, unknown>) => [
      String(r.domain),
      Number(r.count) || 0,
    ])
  )

  const participants = participantResult.rows as Record<string, unknown>[]
  const highStressRows = highStressResult.rows as Record<string, unknown>[]
  const engagementRows = engagementResult.rows as Record<string, unknown>[]

  return (
    <main className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Admin · Research
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Longitudinal Analytics
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Read-only view of daily check-in trends, Stampley engagement, domain
          focus, and high-stress monitoring across the 4-week study. Summaries
          only — full chat transcripts are not shown.
        </p>

        <form
          action="/admin/analytics"
          method="get"
          className="mt-6 border border-slate-200 bg-gradient-to-br from-white to-stone-50 p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Filters
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Participant email</span>
              <input
                type="search"
                name="q"
                defaultValue={filters.q ?? ""}
                placeholder="Search email…"
                className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">From date</span>
              <input
                type="date"
                name="from"
                defaultValue={filters.from ?? ""}
                className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">To date</span>
              <input
                type="date"
                name="to"
                defaultValue={filters.to ?? ""}
                className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Domain</span>
              <select
                name="domain"
                defaultValue={filters.domain ?? "ALL"}
                className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="ALL">All domains</option>
                {STUDY_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Study week</span>
              <select
                name="week"
                defaultValue={
                  filters.week != null ? String(filters.week) : "ALL"
                }
                className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="ALL">All weeks</option>
                <option value="1">Week 1</option>
                <option value="2">Week 2</option>
                <option value="3">Week 3</option>
                <option value="4">Week 4</option>
              </select>
            </label>
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                name="highStress"
                value="true"
                defaultChecked={filters.highStress}
                className="h-4 w-4 border-slate-300 text-slate-900"
              />
              <span className="font-medium text-slate-700">
                High-stress only (stress ≥ 9)
              </span>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Apply filters
            </button>
            <a
              href="/admin/analytics"
              className="text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
            >
              Clear filters
            </a>
            {filtersActive ? (
              <span className="text-xs text-slate-500">
                Showing filtered results
              </span>
            ) : null}
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`/api/admin/analytics/check-ins/export${exportQs}`}
            className="inline-flex items-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-stone-50"
          >
            Export check-ins CSV
          </a>
          <a
            href={`/api/admin/analytics/stampley-sessions/export${exportQs}`}
            className="inline-flex items-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-stone-50"
          >
            Export Stampley sessions CSV
          </a>
          <a
            href={`/api/admin/analytics/high-stress/export${exportQs}`}
            className="inline-flex items-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-stone-50"
          >
            Export high-stress CSV
          </a>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard
            label="Participants"
            value={overview.total_participants ?? 0}
            hint={
              rowFiltersActive
                ? "Participants with matching check-ins"
                : "Participants matching email search"
            }
          />
          <StatCard
            label="Total check-ins"
            value={overview.total_checkins ?? 0}
          />
          <StatCard
            label="Stampley sessions"
            value={overview.total_stampley_sessions ?? 0}
          />
          <StatCard
            label="Avg stress level"
            value={formatNumber(overview.avg_stress)}
            hint="Self-reported stress (0–10) for filtered check-ins"
          />
          <StatCard
            label="High-stress check-ins"
            value={overview.high_stress_checkins ?? 0}
            hint="Check-ins with stress ≥ 9 (within current filters)"
            accent
          />
          <StatCard
            label="Completion rates"
            value={pct(withCheckins, totalParticipants)}
            hint={`Pre-survey ${pct(preSurveyCompleted, totalParticipants)} · DDS baseline ${pct(ddsCompleted, totalParticipants)} · ≥1 matching check-in ${pct(withCheckins, totalParticipants)}`}
            accent
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Domain trends
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STUDY_DOMAINS.map((domain) => (
            <div
              key={domain}
              className="border border-slate-200 bg-gradient-to-br from-white to-stone-50 p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-700">{domain}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {domainCounts.get(domain) ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">check-ins</p>
            </div>
          ))}
        </div>
      </div>

      <Section
        title="Participants"
        description="Aggregated metrics per participant for the current filters. Read-only."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-5 py-3 font-semibold text-slate-600">Email</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Role</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Check-ins</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Latest check-in</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Avg stress</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Avg mood</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Avg energy</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Top domain</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Stampley sessions</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Last session</th>
              </tr>
            </thead>
            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No participants match the current filters.
                  </td>
                </tr>
              ) : (
                participants.map((row) => (
                  <tr
                    key={String(row.email)}
                    className="border-b border-slate-100 hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {String(row.email)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {String(row.role ?? "—")}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {Number(row.total_checkins) || 0}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(row.latest_check_in_date)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {formatNumber(row.avg_stress)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {formatNumber(row.avg_mood)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {formatNumber(row.avg_energy)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {row.most_common_domain
                        ? String(row.most_common_domain)
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {Number(row.stampley_sessions) || 0}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(row.last_session_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="High-stress monitoring"
        description="Check-ins with self-reported stress ≥ 9, further narrowed by your filters."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-5 py-3 font-semibold text-slate-600">Participant</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Stress</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Domain</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Safety escalation</th>
              </tr>
            </thead>
            <tbody>
              {highStressRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No high-stress check-ins match the current filters.
                  </td>
                </tr>
              ) : (
                highStressRows.map((row, i) => (
                  <tr
                    key={`${row.email}-${row.check_in_date}-${i}`}
                    className="border-b border-slate-100 hover:bg-red-50/30"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {String(row.email)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(row.check_in_date)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-red-700">
                      {row.stress_level != null ? String(row.stress_level) : "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {row.domain ? String(row.domain) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {row.needs_safety_escalation ? (
                        <span className="border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                          Flagged
                        </span>
                      ) : (
                        <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                          Not flagged
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Stampley engagement"
        description="Saved session summaries and message counts for the current filters. Raw chat JSON is not displayed."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-5 py-3 font-semibold text-slate-600">Participant</th>
                <th className="px-5 py-3 font-semibold text-slate-600">User msgs</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Assistant msgs</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Linked check-in</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Session summary</th>
              </tr>
            </thead>
            <tbody>
              {engagementRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No Stampley sessions match the current filters.
                  </td>
                </tr>
              ) : (
                engagementRows.map((row, i) => (
                  <tr
                    key={`${row.email}-${row.created_at}-${i}`}
                    className="border-b border-slate-100 hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {String(row.email)}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {Number(row.user_message_count) || 0}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {Number(row.assistant_message_count) || 0}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(row.linked_check_in_date)}
                    </td>
                    <td className="max-w-md px-5 py-4 text-slate-600">
                      {row.summary ? (
                        <span className="line-clamp-3">{String(row.summary)}</span>
                      ) : (
                        <span className="italic text-slate-400">No summary</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </main>
  )
}
