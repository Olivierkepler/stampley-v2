import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { WeeklyDomainClient } from "./weekly-domain-client"
import CheckInSubHeader from "@/components/check-in/CheckInSubHeader"
import StampleyHeader from "@/components/stampley/stampley-header"
import {
  fetchUserTotalCheckins,
  fetchUserWeeklyDomainRows,
} from "@/lib/resolve-weekly-domain"
import {
  getDomainForStudyWeek,
  getStudyWeekForNextCheckIn,
  getUsedDomainsFromPreviousWeeks,
  isWeeklyDomainLocked,
} from "@/lib/weekly-domain-progress"

export default async function WeeklyDomainPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const userId = session.user?.id
  if (!userId) redirect("/login")

  const totalCompleted = await fetchUserTotalCheckins(userId)
  const currentWeek = getStudyWeekForNextCheckIn(totalCompleted)
  const weeklyRows = await fetchUserWeeklyDomainRows(userId)
  const currentWeekDomain = getDomainForStudyWeek(weeklyRows, currentWeek)
  const usedPreviousDomains = getUsedDomainsFromPreviousWeeks(
    weeklyRows,
    currentWeek
  )
  const isLocked = isWeeklyDomainLocked(
    totalCompleted,
    currentWeek,
    currentWeekDomain
  )

  const description = isLocked
    ? `Week ${currentWeek} focus is locked. Stampley will tailor every session to ${currentWeekDomain}.`
    : currentWeekDomain
      ? `Week ${currentWeek} focus is set. You can change it until your first check-in this week.`
      : `Choose your focus domain for Week ${currentWeek}. Select one of the remaining DDS domains you have not completed yet.`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="mx-auto w-full max-w-full  pb-10 lg:px-0"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <StampleyHeader
          step="Step 5 of 5"
          title="Stampley Support"
          subtitle="Daily reflection support"
        />
        <CheckInSubHeader
          eyebrow="Step 4 of 5"
          title={`Choose your focus domain for Week ${currentWeek}.`}
          description={description}
        />

        <div className="mx-auto  w-full max-w-full">
          <div className="bg-white px-6 py-8 md:px-10 md:py-10">
            <WeeklyDomainClient
              lockedDomain={currentWeekDomain}
              weekNumber={currentWeek}
              isLocked={isLocked}
              usedPreviousDomains={usedPreviousDomains}
            />
          </div>
        </div>
      </div>
    </>
  )
}
