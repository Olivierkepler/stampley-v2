import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import {
  STUDY_COMPLETE_MESSAGE,
  STUDY_TOTAL_CHECKINS,
} from "@/lib/check-in-utils"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CheckInEntryPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect("/login")
  }

  const [todayResult, progressResult] = await Promise.all([
    query(
      `SELECT id FROM check_in_submissions 
       WHERE user_id = $1 AND check_in_date = CURRENT_DATE
       LIMIT 1`,
      [userId]
    ),
    query(
      `SELECT total_checkins 
       FROM user_study_progress 
       WHERE user_id = $1
       LIMIT 1`,
      [userId]
    ),
  ])

  const totalCheckins = Number(progressResult.rows[0]?.total_checkins ?? 0)
  const studyComplete = totalCheckins >= STUDY_TOTAL_CHECKINS

  if (studyComplete) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Study check-ins complete
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          {STUDY_COMPLETE_MESSAGE}
        </p>

        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (todayResult.rows.length > 0) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Already checked in today!
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          You&apos;ve completed your check-in for today. See you tomorrow! 👋
        </p>

        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  redirect("/check-in/daily-metrics")
}