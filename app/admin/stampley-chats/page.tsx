import { query } from "@/lib/db"
import {
  buildSessionFilterClause,
  hasActiveAnalyticsFilters,
  parseAnalyticsFilters,
  STUDY_DOMAINS,
} from "@/lib/admin-analytics-filters"
import { mapStampleySessionRow } from "@/lib/admin-stampley-sessions"
import { StampleySessionCard } from "@/components/admin/stampley-chats/stampley-session-card"

export const dynamic = "force-dynamic"

type SearchParams = Record<string, string | string[] | undefined>

export default async function AdminStampleyChatsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const filters = parseAnalyticsFilters(params)
  const filtersActive = hasActiveAnalyticsFilters(filters)
  const sessionFilter = buildSessionFilterClause(filters)

  const result = await query(
    `
    SELECT
      s.id,
      s.user_id,
      u.email,
      s.check_in_submission_id,
      s.domain,
      s.stress_level,
      s.mood,
      s.energy,
      s.user_message_count,
      s.assistant_message_count,
      s.summary,
      s.messages,
      s.created_at,
      c.check_in_date
    FROM stampley_chat_sessions s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN check_in_submissions c ON c.id = s.check_in_submission_id
    WHERE u.role = 'PARTICIPANT'${sessionFilter.clause}
    ORDER BY s.created_at DESC
    LIMIT 200
    `,
    sessionFilter.params
  )

  const sessions = (result.rows as Record<string, unknown>[]).map(
    mapStampleySessionRow
  )

  return (
    <main className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Stampley Chats
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Read-only view of Stampley chat sessions saved from participant
          check-ins. Expand any session to review the full transcript.
        </p>

        <form
          action="/admin/stampley-chats"
          method="get"
          className="mt-6 border border-slate-200 bg-gradient-to-br from-white to-stone-50 p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Filters
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">
                Participant email
              </span>
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
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                name="highStress"
                value="true"
                defaultChecked={filters.highStress}
                className="h-4 w-4 border-slate-300 text-slate-900"
              />
              <span className="font-medium text-slate-700">
                High stress only (stress ≥ 9)
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
              href="/admin/stampley-chats"
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
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Saved sessions
          </h2>
          <p className="text-xs text-slate-500">
            {sessions.length} session{sessions.length === 1 ? "" : "s"}
            {sessions.length >= 200 ? " (most recent 200)" : ""}
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-700">
              No Stampley chat sessions saved yet.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Sessions appear here after participants complete Step 5 and save
              their check-in.
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <StampleySessionCard key={session.id} session={session} />
          ))
        )}
      </section>
    </main>
  )
}
