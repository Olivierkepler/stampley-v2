import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { redirectIfOnboardingIncomplete } from "@/lib/check-in-flow-guard"
import Link from "next/link"
import Image from "next/image"
import ParticipantCharts from "@/components/dashboard/ParticipantCharts"
import DonutProgress from "@/components/dashboard/DonutProgress"
import Footer from "@/components/home/Footer"
import { UnsavedTranscriptResend } from "@/components/stampley/unsaved-transcript-resend"
import {
  STUDY_TOTAL_CHECKINS,
  computeStudyProgressPercent,
  checkinsCompletedInWeek,
} from "@/lib/check-in-utils"
import { getStudyWeekForNextCheckIn } from "@/lib/weekly-domain-progress"
import { getPostSurveyAccessStatus } from "@/lib/post-survey-access"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  if (session.user?.role === "PARTICIPANT") {
    await redirectIfOnboardingIncomplete()
  }

  const todayCheckin = await query(
    `SELECT id FROM check_in_submissions
     WHERE user_id = $1 AND check_in_date = CURRENT_DATE`,
    [session.user.id]
  )

  const checkedInToday = todayCheckin.rows.length > 0

  const progressResult = await query(
    `SELECT total_checkins, current_week
     FROM user_study_progress WHERE user_id = $1`,
    [session.user.id]
  )

  const progress = progressResult.rows[0] ?? null
  const completedCheckins = progress?.total_checkins ?? 0
  const activeStudyWeek = getStudyWeekForNextCheckIn(completedCheckins)

  const currentWeekDomainResult = await query(
    `SELECT domain FROM user_weekly_domains
     WHERE user_id = $1 AND week_number = $2`,
    [session.user.id, activeStudyWeek]
  )

  const currentDomain = currentWeekDomainResult.rows[0]?.domain ?? null

  const chartResult = await query(
    `
    SELECT
      check_in_date,
      distress,
      mood,
      energy,
      domain
    FROM check_in_submissions
    WHERE user_id = $1
    ORDER BY check_in_date ASC
    `,
    [session.user.id]
  )
  
  const trendData = chartResult.rows.map((row) => ({
    date: new Date(row.check_in_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    distress: row.distress,
    mood: row.mood,
    energy: row.energy,
  }))
  
  const domainCounts = chartResult.rows.reduce((acc: Record<string, number>, row) => {
    const domain = row.domain ?? "Unknown"
    acc[domain] = (acc[domain] ?? 0) + 1
    return acc
  }, {})
  
  const domainData = Object.entries(domainCounts).map(([domain, count]) => ({
    domain,
    count,
  }))

  const firstName = session.user.email?.split("@")[0]?.split(".")[0] ?? ""
  const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const remainingCheckins = Math.max(STUDY_TOTAL_CHECKINS - completedCheckins, 0)
  const studyComplete = completedCheckins >= STUDY_TOTAL_CHECKINS

  const postSurveyAccess = studyComplete
    ? await getPostSurveyAccessStatus(session.user.id)
    : null
  const postSurveyCompleted = postSurveyAccess?.postSurveyCompleted ?? false

  const checkinPct = computeStudyProgressPercent(completedCheckins)

  const DOMAIN_META: Record<
    string,
    { emoji: string; label: string; desc: string }
  > = {
    Emotional: {
      emoji: "💙",
      label: "Emotional Burden",
      desc: "Managing feelings around diabetes",
    },
    Regimen: {
      emoji: "📋",
      label: "Regimen-Related",
      desc: "Medications, blood sugar, and meal planning",
    },
    Physician: {
      emoji: "🩺",
      label: "Physician-Related",
      desc: "Your relationship with your healthcare team",
    },
    Interpersonal: {
      emoji: "🤝",
      label: "Interpersonal",
      desc: "Support from family, friends, and others",
    },
  }

  const domainMeta = currentDomain ? DOMAIN_META[currentDomain] : null

  return (
    <>
      <UnsavedTranscriptResend />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,200;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

       .font-body {
  font-family: 'Outfit', system-ui, sans-serif;
}

.font-display {
  font-family: 'Fraunces', Georgia, serif;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

        .dashboard-card {
          background: #ffffff;
          border: 1px solid rgba(10, 10, 5, 0.09);
          box-shadow: 0 1px 2px rgba(10, 10, 5, 0.04);
        }

        .dashboard-card-soft {
          background: #fcfbf8;
          border: 1px solid rgba(10, 10, 5, 0.08);
        }

        .label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a0a05;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #1c1c1a;
          color: #ffffff;
          padding: 13px 22px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.18s ease, transform 0.18s ease;
        }

        .primary-button:hover {
          background: #000000;
          transform: translateY(-1px);
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border: 1px solid rgba(10, 10, 5, 0.14);
          color: rgba(10, 10, 5, 0.65);
          padding: 10px 16px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: background 0.18s ease, color 0.18s ease;
        }

        .secondary-button:hover {
          background: #f5f2ec;
          color: rgba(10, 10, 5, 0.85);
        }

        @keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes donutPop {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slowSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hero-fade-1 {
  animation: heroFadeUp 0.55s ease both;
}

.hero-fade-2 {
  animation: heroFadeUp 0.55s 0.08s ease both;
}

.hero-fade-3 {
  animation: heroFadeUp 0.55s 0.16s ease both;
}

.hero-donut {
  animation: donutPop 0.65s 0.22s ease both;
}

.hero-donut-ring {
  animation: slowSpin 18s linear infinite;
}


@keyframes sectionScrollFadeUp {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-section {
  opacity: 0;
  animation: sectionScrollFadeUp 0.75s ease-out both;
  animation-timeline: view();
  animation-range: entry 12% cover 32%;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-section {
    opacity: 1;
    transform: none;
    animation: none;
  }
}


      `}</style>

      <main className="min-h-screen bg-white font-body text-[#0a0a05] ">
        <header className="border-b border-black/[0.08] bg-white">
          <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/stampleylogomain.webp"
                alt="AIDES-T2D"
                width={150}
                height={50}
                priority
                className="h-auto w-[140px]"
              />
            </Link>

            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <button type="submit" className="secondary-button">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className="relative overflow-hidden bg-[#003e73]">

{/* Decorative Logo-Inspired Background */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* Large White Arc */}
  <div className="absolute left-[-120px] top-[-80px] h-[420px] w-[420px] rounded-full border-[2px] border-white/20" />

  {/* Yellow swoosh */}
  {/* <div className="absolute right-[18%] top-[22%] h-[140px] w-[340px] rotate-[-18deg] rounded-[100%] border-t-[22px] border-[#f6b800]/70 blur-[0.4px]" /> */}

  {/* White swoosh */}
  {/* <div className="absolute right-[12%] top-[35%] h-[220px] w-[420px] rotate-[-22deg] rounded-[100%] border-l-[16px] border-white/20" /> */}

  {/* Top dot */}
  {/* <div className="absolute right-[18%] top-[18%] h-5 w-5 rounded-full bg-white/50" /> */}

  {/* Soft glow */}
  {/* <div className="absolute right-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-blue-300/10 blur-3xl" /> */}

 
</div>

{/* Content */}
<div className="relative z-10 mx-auto grid max-w-8xl gap-10 px-6 md:px-30 py-14 lg:grid-cols-[1fr_240px] lg:items-center">

  <div>
    <p className="label text-white/70" style={{ color: "#fff" }}>{today}</p>

    <h1 className="font-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.08] tracking-[-0.04em] text-white">
         Welcome back,{" "}
      <em className="font-light italic text-white/90">
        {formattedName}
      </em>
    </h1>

    {session.user?.role === "PARTICIPANT" && (
     <p className="mt-5 max-w-xl text-[clamp(0.95rem,1.5vw,1.05rem)] leading-7 text-white/85">
        {studyComplete
          ? "You’ve completed all 20 study check-ins. Thank you for your participation."
          : checkedInToday
          ? "You’ve completed today’s check-in. Your progress has been recorded."
          : "Your daily check-in is ready. Take a few minutes to reflect on how you’re feeling today."}
      </p>
    )}
  </div>

  {/* Donut Progress */}
  <DonutProgress
  percent={checkinPct}
  completed={completedCheckins}
  total={STUDY_TOTAL_CHECKINS}
/>
</div>
</div>


<section className="mx-auto max-w-full px-4 py-10 md:py-20 scroll-section">
          {session.user?.role === "PARTICIPANT" && (
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">

<section className="dashboard-card overflow-hidden scroll-section">
  <div className="grid lg:grid-cols-[240px_1fr]">

    {/* LEFT IMAGE */}
    <div className="relative hidden min-h-[320px] border-r border-black/[0.08] bg-[#f8f6f2] lg:block">
      <Image
        src="/images/diabetictype2.jpg"
        alt="Daily wellness check-in"
        fill
        className="object-cover"
      />

      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
          Daily Reflection
        </p>

        <p className="mt-2 max-w-[180px] text-sm leading-6 text-white/90">
          Consistent check-ins help track emotional well-being and diabetes distress over time.
        </p>
      </div> */}
    </div>

    {/* RIGHT CONTENT */}
    <div className="p-8">
      <p className="label">Daily Check-in</p>

      <div className="mt-6 flex flex-col gap-8">
        <div>
        <h2 className="font-display text-[clamp(1.55rem,3vw,2rem)] font-light leading-tight tracking-[-0.03em] text-black/85">
            {studyComplete
              ? "All 20 study check-ins are complete."
              : checkedInToday
              ? "Today’s check-in is complete."
              : "How are you feeling today?"}
          </h2>
          <p className="mt-4 max-w-lg text-[clamp(0.95rem,1.3vw,1rem)] leading-7 text-black/55">
            {studyComplete
              ? "Thank you for completing the 4-week study protocol."
              : checkedInToday
              ? "Thank you for checking in. Come back tomorrow to continue your daily reflection."
              : "Record your distress, mood, energy, context, and reflection for today."}
          </p>
        </div>

        <div>
          {studyComplete ? (
            <div className="space-y-4">
              <div className="dashboard-card-soft inline-block px-5 py-4">
                <p className="text-sm font-medium text-blue-900">
                  Study check-ins complete
                </p>
                <p className="mt-1 text-xs text-blue-900">
                  You finished all 20 check-ins across 4 weeks.
                </p>
              </div>
              {postSurveyCompleted ? (
                <div className="dashboard-card-soft inline-block px-5 py-4">
                  <p className="text-sm font-medium text-blue-900">
                    Post-Study Survey Completed
                  </p>
                  <p className="mt-1 text-xs text-blue-900">
                    Thank you for sharing your post-study feedback.
                  </p>
                </div>
              ) : (
                <Link
                  href="/survey/post-survey"
                  className="primary-button"
                  style={{ background: "#005ea8", color: "#fff" }}
                >
                  Complete Post-Study Survey
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          ) : checkedInToday ? (
            <div className="dashboard-card-soft inline-block px-5 py-4">
              <p className="text-sm font-medium text-blue-900">
                Completed today
              </p>

              <p className="mt-1 text-xs text-blue-900">
                Your response has been saved.
              </p>
            </div>
          ) : (
            <Link href="/check-in" className="primary-button" style={{ background: "#003e73", color: "#fff" }}>
              Start Check-in
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
</section>

<section className="dashboard-card p-8 scroll-section">
                <div className="grid lg:grid-cols-[1fr_220px]">
                  <div className="p-8">
                    <p className="label">Study Progress</p>

                    <div className="mt-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-display text-[36px] font-light text-black/85">
                            {completedCheckins} / {STUDY_TOTAL_CHECKINS}
                          </p>

                          <p className="mt-1 text-sm text-black/45">
                            Check-ins completed · 4 weeks, 5 per week
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-black/75">
                            Week {activeStudyWeek} / 4
                          </p>

                          <p className="mt-1 text-xs text-black/45">
                            {remainingCheckins} remaining
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 h-2 bg-black/[0.06]">
                        <div
                          className="h-full bg-blue-900"
                          style={{ width: `${checkinPct}%` }}
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((week) => {
                          const weekCompleted = checkinsCompletedInWeek(
                            completedCheckins,
                            week
                          )
                          const active = week <= activeStudyWeek

                            return (
                              <div
                                key={week}
                                className={`border px-3 py-3 text-center transition-colors ${
                                  active
                                    ? "border-blue-900 bg-blue-900 text-white"
                                    : "border-blue-900/10 bg-white text-blue-900 hover:bg-blue-50"
                                }`}
                              >
                                <p
                                  className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                                    active ? "text-white/70" : "text-blue-900/60"
                                  }`}
                                >
                                  Week
                                </p>
                            
                                <p
                                  className={`mt-1 text-sm font-medium ${
                                    active ? "text-white" : "text-blue-900"
                                  }`}
                                >
                                  {week}
                                </p>

                                <p
                                  className={`mt-1 text-[10px] ${
                                    active ? "text-white/70" : "text-blue-900/50"
                                  }`}
                                >
                                  {weekCompleted}/5
                                </p>
                              </div>
                            ) 
                          
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="relative hidden border-l border-black/[0.08] bg-[#faf8f4] lg:block">
                    <Image
                      src="/images/diabatics6.jpg"
                      alt="Study progress"
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </section>

            <section className="dashboard-card p-8 scroll-section">
                <p className="label">This Week&apos;s Focus · Week {activeStudyWeek}</p>

                {domainMeta ? (
                  <div className="mt-6 flex items-start gap-5">
                   <div className="relative border-l border-black/[0.08] bg-[#faf8f4] w-24 h-24"
                   style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                   }}
                   >
                    <Image src="/images/diabetics23.jpg" alt="Study progress" fill className="object-cover" />
                   </div>

                    <div>
                      <h2 className="font-display text-[26px] font-light tracking-[-0.03em] text-black/85">
                        {domainMeta.label}
                      </h2>

                      <p className="mt-3 max-w-md text-[14px] leading-7 text-black/55">
                        {domainMeta.desc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 border border-black/[0.08] bg-[#fcfbf8] p-5">
                    <p className="text-sm font-medium text-black/70">
                      No weekly focus selected yet for Week {activeStudyWeek}.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/50">
                      Choose your focus domain during Step 4 of your next check-in.
                    </p>
                  </div>
                )}
              </section>

              <section className="dashboard-card p-8">
                <p className="label">Study Record</p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                    <span className="text-sm text-black/55">Pre-survey</span>
                    <span className="text-sm font-medium text-black/75">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                    <span className="text-sm text-black/55">
                      Daily check-in
                    </span>
                    <span className="text-sm font-medium text-black/75">
                      {checkedInToday ? "Completed today" : "Pending today"}
                    </span>
                  </div>

                  {studyComplete ? (
                    <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                      <span className="text-sm text-black/55">
                        Post-study survey
                      </span>
                      <span className="text-sm font-medium text-black/75">
                        {postSurveyCompleted ? "Completed" : "Pending"}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/55">
                      Participant role
                    </span>
                    <span className="text-sm font-medium text-black/75">
                      {session.user?.role}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {session.user?.role === "ADMIN" && (
            <section className="dashboard-card p-8">
              <p className="label">Admin Portal</p>

              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="font-display text-[32px] font-light tracking-[-0.03em] text-black/85">
                    Manage study operations.
                  </h2>

                  <p className="mt-4 max-w-xl text-[20px] leading-7 text-black/55">
                    Review users, study keys, participant activity, and safety
                    signals from the administrative dashboard.
                  </p>
                </div>

                <Link href="/admin" className="primary-button">
                  Open Admin
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </section>
          )}

        
        </section>
      </main>  <Footer />
    </>
  )
}