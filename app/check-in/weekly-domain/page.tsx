import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { WeeklyDomainClient } from "./weekly-domain-client"

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
  const weekNumber = domainResult.rows[0]?.week_number ?? 1

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
        className="min-h-screen  "
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <div className="max-w-full mx-auto w-full">
          <div className="bg-white px-6 py-8 md:px-10 md:py-10">

            {/* Header */}
            <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
                {/* <span className="h-px w-5 bg-[#3d5a80]/40" /> */}
                <span
              className="text-[9px] uppercase tracking-[0.24em] text-black select-none"
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(10px, 5vw, 10px)" }}
              >
                  Step 4 of 5 — Weekly Focus
                </span>
              </div>
              <h1
    className="font-light text-blue-900 mb-3 leading-[1.15] text-center sm:text-left"
    style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(22px, 5vw, 30px)" }}
  >
                Choose your{" "}
                <span className="text-[#FFB100] font-light" style={{ fontFamily: "'Poppins', sans-serif" }}>
 
                focus domain</span>
              </h1>
              <p
    className="leading-[1.7] hidden sm:block "
    style={{
      fontFamily: "'Poppins', sans-serif",
      fontSize: "clamp(14px, 3.5vw, 16px)",
    }} >
      
      {isLocked
                  ? `Week ${currentWeek} focus is already set. Stampley will tailor every session to this area.`
                  : "Select one area to explore with Stampley this week. You can change it at the start of each new week."
                }
              </p>
            </div>

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