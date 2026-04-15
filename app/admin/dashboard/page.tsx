import { query } from "@/lib/db"
import { CheckinActivityChart } from "@/components/charts/checkin-activity-chart"
import { DistressChart } from "@/components/charts/distress-chart"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [
    participantsResult,
    availableKeysResult,
    totalCheckinsResult,
    todayCheckinsResult,
    recentUsersResult,
    activityResult,
    distressResult,
    safetyResult,
  ] = await Promise.all([
    query("SELECT COUNT(*) FROM users WHERE role = 'PARTICIPANT'"),
    query("SELECT COUNT(*) FROM study_keys WHERE is_used = FALSE"),
    query("SELECT COUNT(*) FROM check_in_submissions"),
    query("SELECT COUNT(*) FROM check_in_submissions WHERE check_in_date = CURRENT_DATE"),
    query(`
      SELECT email, created_at FROM users 
      WHERE role = 'PARTICIPANT' 
      ORDER BY created_at DESC LIMIT 5
    `),
    query(`
      SELECT 
        TO_CHAR(check_in_date, 'Mon DD') as date,
        COUNT(*) as count
      FROM check_in_submissions
      WHERE check_in_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY check_in_date, TO_CHAR(check_in_date, 'Mon DD')
      ORDER BY check_in_date ASC
    `),
    query(`
      SELECT
        CASE
          WHEN distress BETWEEN 0 AND 2 THEN '0-2'
          WHEN distress BETWEEN 3 AND 4 THEN '3-4'
          WHEN distress BETWEEN 5 AND 6 THEN '5-6'
          WHEN distress BETWEEN 7 AND 8 THEN '7-8'
          WHEN distress BETWEEN 9 AND 10 THEN '9-10'
        END as range,
        COUNT(*) as count
      FROM check_in_submissions
      GROUP BY range
      ORDER BY range ASC
    `),
    query(`
      SELECT COUNT(*) FROM check_in_submissions 
      WHERE needs_safety_escalation = TRUE
    `),
  ])

  const stats = {
    participants: participantsResult.rows[0].count,
    availableKeys: availableKeysResult.rows[0].count,
    totalCheckins: totalCheckinsResult.rows[0].count,
    todayCheckins: todayCheckinsResult.rows[0].count,
    safetyAlerts: safetyResult.rows[0].count,
  }

  const activityData = activityResult.rows.map((r: any) => ({
    date: r.date,
    count: parseInt(r.count, 10),
  }))

  const distressColors: Record<string, string> = {
    "0-2": "#86efac",
    "3-4": "#6ee7b7",
    "5-6": "#fbbf24",
    "7-8": "#f97316",
    "9-10": "#ef4444",
  }

  const distressData = distressResult.rows.map((r: any) => ({
    range: r.range,
    count: parseInt(r.count, 10),
    color: distressColors[r.range] ?? "#e5e7eb",
  }))

  const participants = parseInt(stats.participants, 10) || 0
  const totalCheckins = parseInt(stats.totalCheckins, 10) || 0
  const safetyAlerts = parseInt(stats.safetyAlerts, 10) || 0

  return (
    <div className="min-h-screen ">
      <div
        className="min-h-screen"
       
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Stats Cards */}
        {/* Stats Cards */}
<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

{/* Participants */}
<Link
  href="/admin/users"
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-[2px] hover:shadow-md"
  style={{
    backgroundImage: "url('/images/gradient1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
  <div className="relative z-10">
    <p className="text-xs uppercase tracking-[0.18em] text-white/80">
      Participants
    </p>
    <p className="mt-2 text-3xl font-semibold text-white">
      {stats.participants}
    </p>
    <p className="mt-2 text-xs text-white/70">Total enrolled</p>
  </div>
</Link>

{/* Check-ins */}
<Link
  href="/admin/check-ins"
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-[2px] hover:shadow-md"
  style={{
    backgroundImage: "url('/images/gradient4.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition" />
  <div className="relative z-10">
    <p className="text-xs uppercase tracking-[0.18em] text-white/80">
      Check-ins
    </p>
    <p className="mt-2 text-3xl font-semibold text-white">
      {stats.todayCheckins}
    </p>
    <p className="mt-2 text-xs text-white/70">Today</p>
  </div>
</Link>

{/* Keys */}
<Link
  href="/admin/keys"
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-[2px] hover:shadow-md"
  style={{
    backgroundImage: "url('/images/gradient5.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition" />
  <div className="relative z-10">
    <p className="text-xs uppercase tracking-[0.18em] text-white/75">
      Keys
    </p>
    <p className="mt-2 text-3xl font-semibold text-emerald-300">
      {stats.availableKeys}
    </p>
    <p className="mt-2 text-xs text-white/70">Available</p>
  </div>
</Link>

{/* Safety */}
<Link
  href="/admin/safety"
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-[2px] hover:shadow-md"
  style={{
    backgroundImage: "url('/images/gradient3.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
  <div className="relative z-10">
    <p className="text-xs uppercase tracking-[0.18em] text-white/80">
      Safety
    </p>
    <p
      className={`mt-2 text-3xl font-semibold ${
        safetyAlerts > 0 ? "text-red-400" : "text-white"
      }`}
    >
      {stats.safetyAlerts}
    </p>
    <p className="mt-2 text-xs text-white/70">Alerts</p>
  </div>
</Link>

</div>

          {/* Safety Status */}
          <section className="relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white/80 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm">

{/* subtle neutral glow */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.15),transparent_45%)]" />

<div className="relative flex items-start gap-4 px-6 py-5">
  
  {/* icon */}
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>

  {/* text */}
  <div className="min-w-0">
    <p className="text-sm font-semibold text-slate-900">
      System operating normally
    </p>
    <p className="mt-1 text-sm text-slate-500">
      {safetyAlerts > 0
        ? `${stats.safetyAlerts} safety alert${
            safetyAlerts === 1 ? "" : "s"
          } detected and may need review.`
        : "All participants are within safe range. No alerts detected."}
    </p>
  </div>
</div>
</section>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Check-in Activity
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">Last 7 days</p>
              </div>
              {activityData.length > 0 ? (
                <CheckinActivityChart data={activityData} />
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <p className="text-sm text-slate-400">No check-in data yet</p>
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-slate-200/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900">
                  Distress Distribution
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  All check-ins by distress level
                </p>
              </div>
              {distressData.length > 0 ? (
                <DistressChart data={distressData} />
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <p className="text-sm text-slate-400">No distress data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-[28px]  border border-slate-200/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm"
            style={{
              backgroundImage: "url('/images/gradient5.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "right bottom",
            }}
            >
              <h2 className="mb-4 text-sm font-semibold text-white">
                Recent Participants
              </h2>

              <div className="space-y-3">
                {recentUsersResult.rows.length === 0 ? (
                  <p className="text-sm text-white">No participants yet</p>
                ) : (
                  recentUsersResult.rows.map((u: any) => (
                    <div key={u.email} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-medium text-slate-700">
                        {u.email[0].toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white">
                          {u.email}
                        </p>
                        <p className="text-xs text-white">
                          {new Date(u.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/60 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm"
             style={{
              backgroundImage: "url('/images/light_white_gradient.png')",
              backgroundSize: "cover",
              backgroundPosition: "right bottom",
            }}
            >
              <h2 className="mb-4 text-sm font-semibold text-black">
                Study Overview
              </h2>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-xs text-black">
                    <span>Total Check-ins</span>
                    <span>{stats.totalCheckins}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-slate-900 to-slate-700"
                      style={{
                        width: `${Math.min((totalCheckins / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                      <div className="mb-2 flex justify-between text-xs text-black">
                    <span>Keys Used</span>
                    <span>{participants}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300"
                      style={{
                        width: `${Math.min((participants / 20) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs text-black">
                    <span>Safety Alerts</span>
                    <span className={safetyAlerts > 0 ? "text-red-500" : ""}>
                      {stats.safetyAlerts}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                      style={{
                        width: `${Math.min((safetyAlerts / 10) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}