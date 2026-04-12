import { query } from "@/lib/db"
import { CheckinActivityChart } from "@/components/charts/checkin-activity-chart"
import { DistressChart } from "@/components/charts/distress-chart"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {

  // Stats
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
    count: parseInt(r.count),
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
    count: parseInt(r.count),
    color: distressColors[r.range] ?? "#e5e7eb",
  }))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Participants</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{stats.participants}</p>
          <p className="text-xs text-gray-400 mt-1">Total enrolled</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Today</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{stats.todayCheckins}</p>
          <p className="text-xs text-gray-400 mt-1">Check-ins today</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Available Keys</p>
          <p className="text-3xl font-semibold text-green-600 mt-1">{stats.availableKeys}</p>
          <p className="text-xs text-gray-400 mt-1">Ready to assign</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Safety Alerts</p>
          <p className={`text-3xl font-semibold mt-1 ${
            parseInt(stats.safetyAlerts) > 0 ? "text-red-600" : "text-gray-900"
          }`}>
            {stats.safetyAlerts}
          </p>
          <p className="text-xs text-gray-400 mt-1">Need attention</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Check-in Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Check-in Activity</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
          </div>
          {activityData.length > 0 ? (
            <CheckinActivityChart data={activityData} />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No check-in data yet</p>
            </div>
          )}
        </div>

        {/* Distress Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Distress Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">All check-ins by distress level</p>
          </div>
          {distressData.length > 0 ? (
            <DistressChart data={distressData} />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No distress data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Recent Participants */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Recent Participants
          </h2>
          <div className="space-y-3">
            {recentUsersResult.rows.length === 0 ? (
              <p className="text-sm text-gray-400">No participants yet</p>
            ) : (
              recentUsersResult.rows.map((u: any) => (
                <div key={u.email} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                    {u.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{u.email}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Study Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Study Overview
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Total Check-ins</span>
                <span>{stats.totalCheckins}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-1.5 bg-gray-900 rounded-full"
                  style={{
                    width: `${Math.min((parseInt(stats.totalCheckins) / 100) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Keys Used</span>
                <span>{parseInt(stats.participants)}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-1.5 bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min((parseInt(stats.participants) / 20) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Safety Alerts</span>
                <span className={parseInt(stats.safetyAlerts) > 0 ? "text-red-500" : ""}>
                  {stats.safetyAlerts}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-1.5 bg-red-500 rounded-full"
                  style={{
                    width: `${Math.min((parseInt(stats.safetyAlerts) / 10) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}