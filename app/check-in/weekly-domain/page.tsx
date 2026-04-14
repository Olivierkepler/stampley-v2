import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { WeeklyDomainClient } from "./weekly-domain-client"

export default async function WeeklyDomainPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Get current week's locked domain
  const domainResult = await query(
    `SELECT domain, week_number FROM user_weekly_domains
     WHERE user_id = $1
     ORDER BY week_number DESC LIMIT 1`,
    [session.user?.id]
  )

  const currentDomain = domainResult.rows[0]?.domain ?? null
  const weekNumber = domainResult.rows[0]?.week_number ?? 1

  // Get study progress
  const progressResult = await query(
    `SELECT current_week FROM user_study_progress WHERE user_id = $1`,
    [session.user?.id]
  )
  const currentWeek = progressResult.rows[0]?.current_week ?? 1

  // Domain is locked if we already have one for this week
  const isLocked = currentDomain !== null

  return (
    <WeeklyDomainClient
      lockedDomain={currentDomain}
      weekNumber={currentWeek}
      isLocked={isLocked}
    />
  )
}