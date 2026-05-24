import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import { redirect } from "next/navigation"

export async function redirectIfOnboardingIncomplete() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  if (session.user.role !== "PARTICIPANT") return

  const preSurveyResult = await query(
    "SELECT id FROM pre_survey_responses WHERE user_id = $1",
    [session.user.id]
  )

  if (preSurveyResult.rows.length === 0) {
    redirect("/survey/pre-survey")
  }

  const ddsResult = await query(
    "SELECT confirmed_domain FROM dds_responses WHERE user_id = $1",
    [session.user.id]
  )

  if (ddsResult.rows.length === 0) {
    redirect("/survey/dds")
  }

  if (!ddsResult.rows[0].confirmed_domain) {
    redirect("/survey/dds/results")
  }
}

export async function redirectIfAlreadyCheckedInToday() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const todayResult = await query(
    `SELECT id FROM check_in_submissions
     WHERE user_id = $1 AND check_in_date = CURRENT_DATE`,
    [session.user.id]
  )

  if (todayResult.rows.length > 0) {
    redirect("/check-in")
  }
}
