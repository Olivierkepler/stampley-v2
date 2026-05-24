import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import DDSClient from "./dds-client"

export default async function Page() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const preSurveyResult = await query(
    "SELECT id FROM pre_survey_responses WHERE user_id = $1",
    [session.user.id]
  )

  if (preSurveyResult.rows.length === 0) {
    redirect("/survey/pre-survey")
  }

  const ddsResult = await query(
    "SELECT id FROM dds_responses WHERE user_id = $1",
    [session.user.id]
  )

  if (ddsResult.rows.length > 0) {
    redirect("/survey/dds/results")
  }

  return <DDSClient />
}
