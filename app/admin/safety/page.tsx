import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminSafetyPage() {
  const [alertsResult, highDistressResult, recentHighResult] = await Promise.all([
    query(`
      SELECT 
        u.email,
        u.id as user_id,
        MAX(c.distress) as max_distress,
        COUNT(*) as total_flags,
        MAX(c.created_at) as last_flagged,
        MAX(c.consecutive_high_distress_days) as consecutive_days
      FROM check_in_submissions c
      JOIN users u ON u.id = c.user_id
      WHERE c.needs_safety_escalation = TRUE
      GROUP BY u.id, u.email
      ORDER BY last_flagged DESC
    `),

    query(`
      SELECT 
        u.email,
        u.id as user_id,
        ROUND(AVG(c.distress)::numeric, 1) as avg_distress,
        MAX(c.distress) as max_distress,
        COUNT(*) as high_count,
        MAX(c.check_in_date) as last_checkin
      FROM check_in_submissions c
      JOIN users u ON u.id = c.user_id
      WHERE c.distress >= 7
        AND c.check_in_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY u.id, u.email
      ORDER BY avg_distress DESC
    `),

    query(`
      SELECT 
        u.email,
        c.distress,
        c.domain,
        c.reflection,
        c.check_in_date,
        c.consecutive_high_distress_days,
        c.needs_safety_escalation
      FROM check_in_submissions c
      JOIN users u ON u.id = c.user_id
      WHERE c.distress >= 7
      ORDER BY c.created_at DESC
      LIMIT 10
    `),
  ])

  const totalAlerts = alertsResult.rows.length
  const atRisk = highDistressResult.rows.length
  const recentHigh = recentHighResult.rows.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Safety Alerts
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Monitor participants flagged for high distress.
          </p>
        </div>
      </div>

      {/* Status Banner */}
      {totalAlerts === 0 ? (
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">

<div className="flex items-start gap-4 px-6 py-5">
  
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
    ✓
  </div>

  <div>
    <p className="text-sm font-semibold text-slate-900">
      System operating normally
    </p>
    <p className="mt-1 text-sm text-slate-500">
      No safety alerts detected across participants.
    </p>
  </div>
</div>
</section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-red-200/80 bg-red-50 shadow-sm">
          <div className="flex items-start gap-4 px-6 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900">
                {totalAlerts} participant{totalAlerts > 1 ? "s" : ""} require immediate attention
              </p>
              <p className="mt-1 text-sm text-red-700">
                Per IRB protocol, please reach out using the resource script.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm"
        
        style={{
          backgroundImage: "url('/images/gradient5.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
        }}
        
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Safety Flags
          </p>
          <p
            className={`mt-2 text-3xl font-semibold tracking-tight text-white ${
              totalAlerts > 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {totalAlerts}
          </p>
          <p className="mt-1 text-xs text-gray-400">Distress ≥ 9 for 2+ days</p>
        </div>

        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm"
           
           style={{
            backgroundImage: "url('/images/gradient3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            At Risk
          </p>
          <p
            className={`mt-2 text-3xl font-semibold tracking-tight text-white ${
              atRisk > 0 ? "text-amber-600" : "text-white"
            }`}
          >
            {atRisk}
          </p>
          <p className="mt-1 text-xs text-white">Distress ≥ 7 this week</p>
        </div>

        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm"
           
           style={{
            backgroundImage: "url('/images/gradient4.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Recent High
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {recentHigh}
          </p>
          <p className="mt-1 text-xs text-white">High distress check-ins</p>
        </div>
      </section>

      {/* Safety Escalations */}
      {alertsResult.rows.length > 0 && (
        <section className="overflow-hidden rounded-3xl border border-red-200/80 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-red-100 bg-gradient-to-b from-red-50 to-white px-6 py-5">
            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-sm font-semibold text-red-800">
              Safety Escalations — Immediate Action Required
            </h2>

           <p className="text-xs text-gray-500">
            Per IRB protocol, please reach out using the resource script.
           </p>
          </div>

          <div className="divide-y divide-gray-100">
            {alertsResult.rows.map((u: any) => (
              <div
                key={u.user_id}
                className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-sm font-semibold text-red-700">
                    {u.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{u.email}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {u.consecutive_days} consecutive high-distress days · Last flagged{" "}
                      {new Date(u.last_flagged).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Max Distress</p>
                    <p className="text-lg font-semibold text-red-600">{u.max_distress}/10</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-400">Total Flags</p>
                    <p className="text-lg font-semibold text-gray-900">{u.total_flags}</p>
                  </div>

                  <a
                    href={`mailto:${u.email}?subject=AIDES-T2D Study Check-in&body=Hi, we noticed you've been experiencing high distress levels. We wanted to check in and provide support.`}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-medium text-white shadow-sm transition hover:bg-red-700"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* At Risk */}
      {highDistressResult.rows.length > 0 && (
        <section className="overflow-hidden rounded-3xl border border-amber-200/80 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-amber-100 bg-gradient-to-b from-amber-50 to-white px-6 py-5">
            <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-sm font-semibold text-amber-800">
              At Risk — Distress ≥ 7 This Week
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {highDistressResult.rows.map((u: any) => (
              <div
                key={u.user_id}
                className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-sm font-semibold text-amber-700">
                    {u.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{u.email}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {u.high_count} high distress check-ins · Last{" "}
                      {new Date(u.last_checkin).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Avg Distress</p>
                    <p className="text-lg font-semibold text-amber-600">{u.avg_distress}/10</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-400">Max</p>
                    <p className="text-lg font-semibold text-gray-900">{u.max_distress}/10</p>
                  </div>

                  <a
                    href={`mailto:${u.email}`}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-200 bg-white px-4 text-xs font-medium text-amber-700 shadow-sm transition hover:bg-amber-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Monitor
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent High Distress Check-ins */}
      <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent High Distress Check-ins
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Latest check-ins with distress ≥ 7
          </p>
        </div>

        {recentHighResult.rows.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-gray-400">No high distress check-ins yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Participant
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Distress
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Domain
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Reflection
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Flag
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentHighResult.rows.map((c: any, i: number) => (
                  <tr key={i} className="transition hover:bg-gray-50/70">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          c.distress >= 9
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.distress}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {c.domain || "—"}
                    </td>

                    <td className="max-w-xs px-6 py-4 text-sm text-gray-500">
                      <p className="truncate">{c.reflection || "—"}</p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(c.check_in_date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      {c.needs_safety_escalation ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Escalated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          At Risk
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}