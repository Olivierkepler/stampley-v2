import { query } from "@/lib/db"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const userResult = await query(
    `
    SELECT id, email, role, created_at
    FROM users
    WHERE id = $1
    `,
    [id]
  )

  const user = userResult.rows[0]
  if (!user) notFound()

  const preSurveyResult = await query(
    `
    SELECT
      consent_status,
      age,
      gender,
      race,
      ethnicity,
      marital_status,
      education,
      employment_status,
      household_income,
      insurance_type,
      diabetes_duration,
      diagnosis_duration,
      current_treatments,
      diabetes_tools_used,
      overall_health_rating,
      internet_usage,
      app_comfort,
      communication_preference,
      phq_total,
      phq_severity,
      needs_mental_health_followup,
      completed_at
    FROM pre_survey_responses
    WHERE user_id = $1
    `,
    [id]
  )

  const preSurvey = preSurveyResult.rows[0] ?? null

  const progressResult = await query(
    `
    SELECT
      total_checkins,
      current_week,
      last_checkin_date,
      study_start_date,
      consecutive_high_distress_days
    FROM user_study_progress
    WHERE user_id = $1
    `,
    [id]
  )

  const progress = progressResult.rows[0] ?? null

  const checkInsResult = await query(
    `
    SELECT
      id,
      check_in_date,
      distress,
      mood,
      energy,
      domain,
      subscale,
      reflection,
      coping_action,
      context_tags,
      needs_safety_escalation,
      created_at
    FROM check_in_submissions
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 50
    `,
    [id]
  )

  const checkIns = checkInsResult.rows

  return (
    <main className="space-y-8">
      <div>
        <Link
          href="/admin/users"
          className="text-sm font-medium text-blue-900 hover:underline"
        >
          ← Back to Users
        </Link>

        <div className="mt-5 border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Participant Profile
          </p>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {user.email}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Joined {new Date(user.created_at).toLocaleString()}
              </p>
            </div>

            <span className="inline-flex w-fit border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-900">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-4">
        <StatCard
          label="Pre-Survey"
          value={preSurvey?.completed_at ? "Completed" : "Pending"}
        />
        <StatCard
          label="Total Check-ins"
          value={progress?.total_checkins ?? checkIns.length ?? 0}
        />
        <StatCard
          label="Current Week"
          value={progress?.current_week ?? "—"}
        />
        <StatCard
          label="Safety Streak"
          value={progress?.consecutive_high_distress_days ?? 0}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Pre-Survey Summary
            </h2>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            <InfoRow label="Completed" value={formatDate(preSurvey?.completed_at)} />
            <InfoRow label="Consent" value={preSurvey?.consent_status} />
            <InfoRow label="Age" value={preSurvey?.age} />
            <InfoRow label="Gender" value={preSurvey?.gender} />
            <InfoRow label="Race" value={formatArray(preSurvey?.race)} />
            <InfoRow label="Ethnicity" value={preSurvey?.ethnicity} />
            <InfoRow label="Marital Status" value={preSurvey?.marital_status} />
            <InfoRow label="Education" value={preSurvey?.education} />
            <InfoRow label="Employment" value={preSurvey?.employment_status} />
            <InfoRow label="Income" value={preSurvey?.household_income} />
            <InfoRow label="Insurance" value={preSurvey?.insurance_type} />
            <InfoRow label="Diabetes Duration" value={preSurvey?.diabetes_duration} />
            <InfoRow label="Diagnosis Duration" value={preSurvey?.diagnosis_duration} />
            <InfoRow label="Treatments" value={formatArray(preSurvey?.current_treatments)} />
            <InfoRow label="Tools Used" value={formatArray(preSurvey?.diabetes_tools_used)} />
            <InfoRow label="Overall Health" value={preSurvey?.overall_health_rating} />
            <InfoRow label="Internet Usage" value={preSurvey?.internet_usage} />
            <InfoRow label="App Comfort" value={preSurvey?.app_comfort} />
            <InfoRow label="Communication Preference" value={preSurvey?.communication_preference} />
          </div>
        </div>

        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              PHQ-9 Summary
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                PHQ Total
              </p>
              <p className="mt-2 text-4xl font-semibold text-slate-950">
                {preSurvey?.phq_total ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Severity
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {preSurvey?.phq_severity ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Mental Health Follow-up
              </p>

              {preSurvey?.needs_mental_health_followup ? (
                <span className="mt-2 inline-flex border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                  Follow-up Recommended
                </span>
              ) : (
                <span className="mt-2 inline-flex border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  No Follow-up Flag
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Check-in History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
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
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    No check-ins found.
                  </td>
                </tr>
              ) : (
                checkIns.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(item.check_in_date)}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {item.distress}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{item.mood}</td>
                    <td className="px-5 py-4 text-slate-700">{item.energy}</td>
                    <td className="px-5 py-4 text-slate-700">{item.domain ?? "—"}</td>
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
          <div key={`${item.id}-reflection`} className="border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatDate(item.check_in_date)}
                </p>
                <p className="text-xs text-slate-500">
                  {item.domain ?? "No domain"} · {item.subscale ?? "No subscale"}
                </p>
              </div>

              {item.needs_safety_escalation && (
                <span className="w-fit border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                  Safety Flag
                </span>
              )}
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

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">
        {value}
      </p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-slate-800">
        {value ?? "—"}
      </p>
    </div>
  )
}

function formatDate(value: any) {
  if (!value) return "—"
  return new Date(value).toLocaleString()
}

function formatArray(value: any) {
  if (!value) return "—"
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—"
  return value
}