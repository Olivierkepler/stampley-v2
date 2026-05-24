import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { WeeklyDomainClient } from "./weekly-domain-client"
import CheckInSubHeader from "@/components/check-in/CheckInSubHeader"

export default async function WeeklyDomainPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const domainResult = await query(
    `SELECT domain, week_number FROM user_weekly_domains
     WHERE user_id = $1
     ORDER BY week_number DESC LIMIT 1`,
    [session.user?.id]
  )

  const currentDomain = domainResult.rows[0]?.domain ?? null

  const progressResult = await query(
    `SELECT current_week FROM user_study_progress WHERE user_id = $1`,
    [session.user?.id]
  )

  const currentWeek = progressResult.rows[0]?.current_week ?? 1
  const isLocked = currentDomain !== null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="mx-auto w-full max-w-full px-4 pb-10 lg:px-0"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <CheckInSubHeader
          eyebrow="Step 4 of 5"
          title="Choose your focus domain."
          description={
            isLocked
              ? `Week ${currentWeek} focus is already set. Stampley will tailor every session to this area.`
              : "Select one area to explore with Stampley this week. You can change it at the start of each new week."
          }
        />

        <div className="mx-auto  w-full max-w-full">
          <div className="bg-white px-6 py-8 md:px-10 md:py-10">
            <WeeklyDomainClient
              lockedDomain={currentDomain}
              weekNumber={currentWeek}
              isLocked={isLocked}
            />
          </div>
        </div>
      </div>
    </>
  )
}