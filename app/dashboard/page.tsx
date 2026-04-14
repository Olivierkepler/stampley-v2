import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { query } from "@/lib/db"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Check DDS completion for participants only
  if (session.user?.role === "PARTICIPANT") {

    const ddsResult = await query(
      "SELECT confirmed_domain FROM dds_responses WHERE user_id = $1",
      [session.user.id]
    )

    // No DDS completed → go to survey
    if (ddsResult.rows.length === 0) {
      redirect("/survey/dds")
    }

    // DDS completed but domain not confirmed → go to results
    if (!ddsResult.rows[0].confirmed_domain) {
      redirect("/survey/dds/results")
    }
  }

  // Get today's check-in status
  const todayCheckin = await query(
    `SELECT id FROM check_in_submissions 
     WHERE user_id = $1 AND check_in_date = CURRENT_DATE`,
    [session.user?.id]
  )
  const checkedInToday = todayCheckin.rows.length > 0

  // Get current domain for participants
  const domainResult = await query(
    `SELECT domain FROM user_weekly_domains 
     WHERE user_id = $1 
     ORDER BY week_number DESC LIMIT 1`,
    [session.user?.id]
  )
  const currentDomain = domainResult.rows[0]?.domain ?? null

  // Get study progress
  const progressResult = await query(
    `SELECT total_checkins, current_week 
     FROM user_study_progress WHERE user_id = $1`,
    [session.user?.id]
  )
  const progress = progressResult.rows[0] ?? null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-gray-900">AIDES-T2D</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user?.email}</span>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {session.user?.email}
          </p>
        </div>

        {/* Progress bar — participants only */}
        {progress && session.user?.role === "PARTICIPANT" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Study Progress — Week {progress.current_week} of 4
              </p>
              <p className="text-xs text-gray-400">
                {progress.total_checkins}/28 check-ins
              </p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-gray-900 rounded-full transition-all"
                style={{ width: `${Math.min((progress.total_checkins / 28) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="grid gap-4">

          {/* Current domain — participants only */}
          {currentDomain && session.user?.role === "PARTICIPANT" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">
                  {currentDomain === "Emotional" && "💙"}
                  {currentDomain === "Regimen" && "📋"}
                  {currentDomain === "Physician" && "🩺"}
                  {currentDomain === "Interpersonal" && "🤝"}
                </span>
                <h2 className="font-medium text-gray-900">
                  This Week's Focus
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                {currentDomain === "Emotional" && "Emotional Burden — managing feelings around diabetes"}
                {currentDomain === "Regimen" && "Regimen-Related — medications, blood sugar, meal planning"}
                {currentDomain === "Physician" && "Physician-Related — your healthcare team relationship"}
                {currentDomain === "Interpersonal" && "Interpersonal — support from family and friends"}
              </p>
            </div>
          )}

          {/* Daily Check-in card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-medium text-gray-900 mb-1">
              Daily Check-in
            </h2>

            {checkedInToday ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Completed today!
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  You've already checked in today. See you tomorrow! 👋
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  How are you feeling today?
                </p>
                <Link
                  href="/check-in"
                  className="inline-block bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition"
                >
                  Start Check-in
                </Link>
              </>
            )}
          </div>

          {/* Admin Portal */}
          {session.user?.role === "ADMIN" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-medium text-gray-900 mb-1">
                Admin Portal
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Manage users and study keys
              </p>
              <Link
                href="/admin"
                className="inline-block bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition"
              >
                Go to Admin
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}