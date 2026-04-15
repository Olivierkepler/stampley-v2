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
        className="min-h-screen px-4 py-10"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <div className="max-w-full mx-auto w-full">
          <div className="rounded-[28px] border border-black/[0.06] bg-[#fefdfb] shadow-[0_8px_40px_rgba(10,10,15,0.06)] px-6 py-8 md:px-10 md:py-10">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-6 bg-[#3d5a80]/40" />
                <span
                  className="text-[9px] uppercase tracking-[0.24em] text-[#3d5a80]/70"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Step 4 of 5 — Weekly Focus
                </span>
              </div>
              <h1
                className="text-[28px] font-light tracking-[-0.02em] text-[#0a0a0f]/70"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Choose your{" "}
                <em className="italic text-black/25">focus domain</em>
              </h1>
              <p className="text-[13.5px] font-light leading-[1.7] text-black/45 mt-2">
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