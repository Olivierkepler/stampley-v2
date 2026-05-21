import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  if (session.user?.role === "PARTICIPANT") {
    const preSurveyResult = await query(
      "SELECT id FROM pre_survey_responses WHERE user_id = $1",
      [session.user.id]
    )

    if (preSurveyResult.rows.length === 0) {
      redirect("/survey/dds")
    }
  }

  const todayCheckin = await query(
    `SELECT id FROM check_in_submissions
     WHERE user_id = $1 AND check_in_date = CURRENT_DATE`,
    [session.user.id]
  )

  const checkedInToday = todayCheckin.rows.length > 0

  const domainResult = await query(
    `SELECT domain FROM user_weekly_domains
     WHERE user_id = $1 ORDER BY week_number DESC LIMIT 1`,
    [session.user.id]
  )

  const currentDomain = domainResult.rows[0]?.domain ?? null

  const progressResult = await query(
    `SELECT total_checkins, current_week
     FROM user_study_progress WHERE user_id = $1`,
    [session.user.id]
  )

  const progress = progressResult.rows[0] ?? null

  const firstName = session.user.email?.split("@")[0]?.split(".")[0] ?? ""
  const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const completedCheckins = progress?.total_checkins ?? 0
  const remainingCheckins = Math.max(28 - completedCheckins, 0)

  const checkinPct = progress
    ? Math.min((progress.total_checkins / 28) * 100, 100)
    : 0

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,200;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        .font-body {
          font-family: "'Poppins', sans-serif";
        }

        .font-display {
          font-family: "'Poppins', sans-serif";
        }

        .font-mono {
          font-family: "'Poppins', sans-serif";
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
      `}</style>

      <main className="min-h-screen bg-white font-body text-[#0a0a05]">
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

        <div className="bg-blue-900">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_240px] lg:items-center">
            <div>
              <p className="label" style={{ color: "#fff" }}>{today}</p>

              <h1 className="font-display mt-4 max-w-3xl text-[24px] font-light leading-[1.12] tracking-[-0.03em] text-white md:text-[30px]">
                Welcome back,{" "}
                <em className="font-light italic text-white">
                  {formattedName}
                </em>
              </h1>

              {session.user?.role === "PARTICIPANT" && (
                <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/90">
                  {checkedInToday
                    ? "You’ve completed today’s check-in. Your progress has been recorded."
                    : "Your daily check-in is ready. Take a few minutes to reflect on how you’re feeling today."}
                </p>
              )}
            </div>

            <div className="flex justify-start lg:justify-end">
              <div className="relative flex h-[180px] w-[180px] items-center justify-center">
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: "9999px",
                    background: `conic-gradient(
                      #ffffff ${checkinPct}%,
                      rgba(255,255,255,0.18) 0
                    )`,
                  }}
                />

                <div
                  className="absolute inset-[18px] bg-blue-900"
                  style={{ borderRadius: "9999px" }}
                />

                <div className="relative z-10 text-center">
                  <p className="font-display text-[34px] font-light text-white">
                    {Math.round(checkinPct)}%
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
                    Complete
                  </p>

                  <p className="mt-2 text-xs text-white/60">
                    {completedCheckins} / 28 check-ins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-9xl px-6 py-12">
          {session.user?.role === "PARTICIPANT" && (
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">

<section className="dashboard-card overflow-hidden">
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
          <h2 className="font-display text-[30px] font-light leading-tight tracking-[-0.03em] text-black/85">
            {checkedInToday
              ? "Today’s check-in is complete."
              : "How are you feeling today?"}
          </h2>

          <p className="mt-4 max-w-lg text-[15px] leading-7 text-black/55">
            {checkedInToday
              ? "Thank you for checking in. Come back tomorrow to continue your daily reflection."
              : "Record your distress, mood, energy, context, and reflection for today."}
          </p>
        </div>

        <div>
          {checkedInToday ? (
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

              <section className="dashboard-card overflow-hidden">
                <div className="grid lg:grid-cols-[1fr_220px]">
                  <div className="p-8">
                    <p className="label">Study Progress</p>

                    <div className="mt-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-display text-[36px] font-light text-black/85">
                            {completedCheckins} / 28
                          </p>

                          <p className="mt-1 text-sm text-black/45">
                            Check-ins completed
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-black/75">
                            Week {progress?.current_week ?? 1} / 4
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
                          const active = progress
                            ? week <= progress.current_week
                            : week === 1

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

              <section className="dashboard-card p-8">
                <p className="label">This Week’s Focus</p>

                {domainMeta ? (
                  <div className="mt-6 flex items-start gap-5">
                    <div className="flex h-14 w-14 items-center justify-center border border-black/[0.08] bg-[#fcfbf8] text-2xl">
                      {domainMeta.emoji}
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
                      No weekly focus selected yet.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/50">
                      Your focus area will appear here after your check-in flow
                      identifies or records one.
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

                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-black/55">
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

          <footer className="mt-16 border-t border-black/[0.08] pt-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/30">
              AIDES-T2D · University of Massachusetts Boston
            </p>
          </footer>
        </section>
      </main>
    </>
  )
}