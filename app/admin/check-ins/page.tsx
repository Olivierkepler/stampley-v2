import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminCheckInsPage() {
  const result = await query(`
    SELECT
      c.id,
      c.user_id,
      u.email,
      c.check_in_date,
      c.distress,
      c.mood,
      c.energy,
      c.domain,
      c.subscale,
      c.reflection,
      c.coping_action,
      c.context_tags,
      c.needs_safety_escalation,
      c.created_at
    FROM check_in_submissions c
    JOIN users u ON u.id = c.user_id
    ORDER BY c.created_at DESC
    LIMIT 100
  `)

  const checkIns = result.rows

  return (
    <main className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Participant Check-ins
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Review daily check-in submissions, participant distress levels,
          selected domains, reflections, and safety flags.
        </p>
      </div>

      <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent Check-ins
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 font-semibold text-slate-600">User</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Distress</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Mood</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Energy</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Domain</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Safety</th>
              </tr>
            </thead>

            <tbody>
              {checkIns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No check-ins found.
                  </td>
                </tr>
              ) : (
                checkIns.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-900">
                      {item.email}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {new Date(item.check_in_date).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-900">
                      {item.distress}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.mood}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.energy}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.domain ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      {item.needs_safety_escalation ? (
                        <span className="border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                          Flagged
                        </span>
                      ) : (
                        <span className="border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                          Clear
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4">
        {checkIns.map((item) => (
          <div key={`${item.id}-details`} className="border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.email}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                {item.domain ?? "No domain"} · {item.subscale ?? "No subscale"}
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Reflection
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {item.reflection || "No reflection provided."}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Coping Action
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {item.coping_action || "No coping action provided."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}