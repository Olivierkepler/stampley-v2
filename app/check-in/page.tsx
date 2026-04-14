import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import Link from "next/link"

export default async function CheckInEntryPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Check if already checked in today
  const todayResult = await query(
    `SELECT id FROM check_in_submissions 
     WHERE user_id = $1 AND check_in_date = CURRENT_DATE`,
    [session.user?.id]
  )

  if (todayResult.rows.length > 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Already checked in today!
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          You've completed your check-in for today. See you tomorrow! 👋
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-gray-900 text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  // Redirect to first step
  redirect("/check-in/daily-metrics")
}