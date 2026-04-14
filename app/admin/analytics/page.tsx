import { query } from "@/lib/db"
import { DomainDonutChart } from "@/components/charts/domain-donut-chart"
import { DistressTrendChart } from "@/components/charts/distress-trend-chart"
import { MoodEnergyChart } from "@/components/charts/mood-energy-chart"
import { WeeklyParticipationChart } from "@/components/charts/weekly-participation-chart"

export const dynamic = "force-dynamic"

export default async function AdminAnalyticsPage() {

  const [
    domainResult,
    distressTrendResult,
    moodEnergyResult,
    weeklyResult,
    summaryResult,
  ] = await Promise.all([

    // Domain breakdown
    query(`
      SELECT domain, COUNT(*) as count
      FROM check_in_submissions
      GROUP BY domain
      ORDER BY count DESC
    `),

    // Average distress per day (last 14 days)
    query(`
      SELECT
        TO_CHAR(check_in_date, 'Mon DD') as date,
        ROUND(AVG(distress)::numeric, 1) as avg
      FROM check_in_submissions
      WHERE check_in_date >= CURRENT_DATE - INTERVAL '14 days'
      GROUP BY check_in_date, TO_CHAR(check_in_date, 'Mon DD')
      ORDER BY check_in_date ASC
    `),

    // Average mood and energy per day (last 7 days)
    query(`
      SELECT
        TO_CHAR(check_in_date, 'Mon DD') as date,
        ROUND(AVG(mood)::numeric, 1) as mood,
        ROUND(AVG(energy)::numeric, 1) as energy
      FROM check_in_submissions
      WHERE check_in_date >= CURRENT_DATE - INTERVAL '7 days'
        AND mood IS NOT NULL
        AND energy IS NOT NULL
      GROUP BY check_in_date, TO_CHAR(check_in_date, 'Mon DD')
      ORDER BY check_in_date ASC
    `),

    // Weekly check-ins
    query(`
      SELECT
        'Week ' || week_number as week,
        COUNT(*) as checkins,
        COUNT(DISTINCT user_id) as participants
      FROM check_in_submissions
      GROUP BY week_number
      ORDER BY week_number ASC
    `),

    // Summary stats
    query(`
      SELECT
        COUNT(*) as total_checkins,
        ROUND(AVG(distress)::numeric, 1) as avg_distress,
        ROUND(AVG(mood)::numeric, 1) as avg_mood,
        ROUND(AVG(energy)::numeric, 1) as avg_energy,
        COUNT(CASE WHEN needs_safety_escalation = TRUE THEN 1 END) as safety_count
      FROM check_in_submissions
    `),
  ])

  const domainColors: Record<string, string> = {
    Emotional: "#6366f1",
    Regimen: "#f59e0b",
    Physician: "#10b981",
    Interpersonal: "#ef4444",
  }

  const domainData = domainResult.rows.map((r: any) => ({
    name: r.domain,
    value: parseInt(r.count),
    color: domainColors[r.domain] ?? "#9ca3af",
  }))

  const distressTrendData = distressTrendResult.rows.map((r: any) => ({
    date: r.date,
    avg: parseFloat(r.avg),
  }))

  const moodEnergyData = moodEnergyResult.rows.map((r: any) => ({
    date: r.date,
    mood: parseFloat(r.mood),
    energy: parseFloat(r.energy),
  }))

  const weeklyData = weeklyResult.rows.map((r: any) => ({
    week: r.week,
    checkins: parseInt(r.checkins),
    participants: parseInt(r.participants),
  }))

  const summary = summaryResult.rows[0]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-white mt-1">
          Study data insights and participant trends
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

{/* Total Check-ins */}
<div
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition "
  style={{
    backgroundImage: "url('/images/gradient3.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/15 transition" />
  <div className="relative">
    <p className="text-xs uppercase tracking-[0.18em] text-white/80">
      Total Check-ins
    </p>
    <p className="text-3xl font-semibold text-white mt-2">
      {summary?.total_checkins ?? 0}
    </p>
  </div>
</div>

{/* Avg Distress */}
<div
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition "
  style={{
    backgroundImage: "url('/images/gradient5.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/15  transition" />
  <div className="relative">
    <p className="text-xs uppercase tracking-[0.18em] text-white/80">
      Avg Distress
    </p>
    <p
      className={`text-3xl font-semibold mt-2 ${
        parseFloat(summary?.avg_distress) >= 7
          ? "text-red-300"
          : parseFloat(summary?.avg_distress) >= 5
          ? "text-amber-300"
          : "text-white"
      }`}
    >
      {summary?.avg_distress ?? "—"}
    </p>
  </div>
</div>

{/* Avg Mood */}
<div
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition "
  style={{
    backgroundImage: "url('/images/gradient4.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/15  transition" />
  <div className="relative">
    <p className="text-xs uppercase tracking-[0.18em] text-white/80">
      Avg Mood
    </p>
    <p className="text-3xl font-semibold text-white mt-2">
      {summary?.avg_mood ?? "—"}
    </p>
  </div>
</div>

{/* Avg Energy */}
<div
  className="group relative overflow-hidden rounded-[24px] border border-white/20 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition "
  style={{
    backgroundImage: "url('/images/gradient1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "right bottom",
  }}
>
  <div className="absolute inset-0 bg-black/15  transition" />
  <div className="relative">
    <p className="text-xs uppercase tracking-[0.18em] text-white/80">
      Avg Energy
    </p>
    <p className="text-3xl font-semibold text-white mt-2">
      {summary?.avg_energy ?? "—"}
    </p>
  </div>
</div>

</div>

      {/* Row 1: Distress Trend + Domain Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Distress Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Distress Trend</h2>
            <p className="text-xs text-gray-400 mt-0.5">Average distress over last 14 days</p>
          </div>
          {distressTrendData.length > 0 ? (
            <DistressTrendChart data={distressTrendData} />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No data yet</p>
            </div>
          )}
        </div>

        {/* Domain Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Domain Breakdown</h2>
            <p className="text-xs text-gray-400 mt-0.5">Check-ins by focus domain</p>
          </div>
          {domainData.length > 0 ? (
            <DomainDonutChart data={domainData} />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No domain data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Mood & Energy + Weekly Participation */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Mood & Energy */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Mood & Energy</h2>
            <p className="text-xs text-gray-400 mt-0.5">Average scores over last 7 days</p>
          </div>
          {moodEnergyData.length > 0 ? (
            <MoodEnergyChart data={moodEnergyData} />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No mood/energy data yet</p>
            </div>
          )}
        </div>

        {/* Weekly Participation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Weekly Participation</h2>
            <p className="text-xs text-gray-400 mt-0.5">Check-ins per study week</p>
          </div>
          {weeklyData.length > 0 ? (
            <WeeklyParticipationChart data={weeklyData} />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No weekly data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Safety Alerts Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Safety Alerts</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Participants with distress ≥ 9 for 2+ consecutive days
            </p>
          </div>
          <span className={`text-2xl font-semibold ${
            parseInt(summary?.safety_count) > 0 ? "text-red-600" : "text-green-600"
          }`}>
            {summary?.safety_count ?? 0}
          </span>
        </div>
        {parseInt(summary?.safety_count) === 0 ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">No safety alerts — all participants are within safe range</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium">
              {summary?.safety_count} participant(s) need immediate attention
            </p>
          </div>
        )}
      </div>

    </div>
  )
}