import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminPreSurveysPage() {
  const result = await query(`
    SELECT
      u.id AS user_id,
      u.email,
      p.consent_status,
      p.age,
      p.gender,
      p.diabetes_duration,
      p.insurance_type,
      p.phq_total,
      p.phq_severity,
      p.needs_mental_health_followup,
      p.completed_at
    FROM users u
    LEFT JOIN pre_survey_responses p ON p.user_id = u.id
    WHERE u.role = 'PARTICIPANT'
    ORDER BY p.completed_at DESC NULLS LAST, u.created_at DESC
  `)

  const rows = result.rows

  return (
    <main className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Pre-Survey Responses
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Review participant onboarding completion, demographics, diabetes
          history, and PHQ-9 screening summary.
        </p>
      </div>

      <section className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Participant Onboarding Status
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-5 py-3 font-semibold text-slate-600">User</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Age</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Gender</th>
                <th className="px-5 py-3 font-semibold text-slate-600">PHQ Total</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Severity</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Follow-up</th>
                <th className="px-5 py-3 font-semibold text-slate-600">Completed</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((item) => {
                const completed = Boolean(item.completed_at)

                return (
                  <tr
                    key={item.user_id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-900">
                      {item.email}
                    </td>

                    <td className="px-5 py-4">
                      {completed ? (
                        <span className="border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                          Completed
                        </span>
                      ) : (
                        <span className="border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.age ?? "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.gender || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.phq_total ?? "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {item.phq_severity || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {item.needs_mental_health_followup ? (
                        <span className="border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                          Yes
                        </span>
                      ) : (
                        <span className="text-sm text-slate-500">No</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.completed_at
                        ? new Date(item.completed_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}