import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { DomainConfirmation } from "./domain-confirmation"

type ScoreItem = {
  domain: string
  label: string
  shortLabel: string
  score: number
  emoji: string
  description: string
  accent: string
  softBg: string
  softText: string
}

function getDistressLevel(score: number) {
  if (score >= 3) {
    return {
      label: "High distress",
      tone: "text-[#8B6F47]",
      badge: "bg-[#f6efe4] text-[#8B6F47] border border-[#e7dac8]",
      ring: "from-[#8B6F47] to-[#B08968]",
      summary: "Clinically significant diabetes distress detected.",
    }
  }

  if (score >= 2) {
    return {
      label: "Moderate distress",
      tone: "text-[#A67C52]",
      badge: "bg-[#f8f1e8] text-[#A67C52] border border-[#eadbc8]",
      ring: "from-[#A67C52] to-[#C49A6C]",
      summary: "Some distress is present and worth monitoring.",
    }
  }

  return {
    label: "Lower distress",
    tone: "text-[#7C5E3C]",
    badge: "bg-[#f7f2eb] text-[#7C5E3C] border border-[#e7ddd0]",
    ring: "from-[#7C5E3C] to-[#B08968]",
    summary: "Distress appears to be within a manageable range.",
  }
}

function getDomainSeverity(score: number) {
  if (score >= 3) {
    return {
      label: "Significant",
      bar: "bg-[#8B6F47]",
      badge: "bg-[#f6efe4] text-[#8B6F47] border border-[#e7dac8]",
    }
  }

  if (score >= 2) {
    return {
      label: "Elevated",
      bar: "bg-[#A67C52]",
      badge: "bg-[#f8f1e8] text-[#A67C52] border border-[#eadbc8]",
    }
  }

  return {
    label: "Manageable",
    bar: "bg-[#B08968]",
    badge: "bg-[#faf5ef] text-[#B08968] border border-[#efe4d7]",
    }
}

export default async function DDSResultsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const result = await query(
    `SELECT * FROM dds_responses WHERE user_id = $1`,
    [session.user.id]
  )

  if (result.rows.length === 0) {
    redirect("/survey/dds")
  }

  const dds = result.rows[0]
  const totalScore = parseFloat(dds.total_score)
  const recommendedDomain = dds.recommended_domain

  const scores: ScoreItem[] = [
    {
      domain: "Emotional",
      label: "Emotional Burden",
      shortLabel: "Emotional",
      score: parseFloat(dds.emotional_score),
      emoji: "💙",
      description: "Feeling overwhelmed, discouraged, or burned out by diabetes.",
      accent: "from-[#8B6F47] to-[#B08968]",
      softBg: "bg-[#f6efe4]",
      softText: "text-[#8B6F47]",
    },
    {
      domain: "Regimen",
      label: "Regimen-Related",
      shortLabel: "Regimen",
      score: parseFloat(dds.regimen_score),
      emoji: "📋",
      description: "Challenges with medications, blood sugar, or meal planning.",
      accent: "from-[#A67C52] to-[#C49A6C]",
      softBg: "bg-[#f8f1e8]",
      softText: "text-[#A67C52]",
    },
    {
      domain: "Physician",
      label: "Physician-Related",
      shortLabel: "Physician",
      score: parseFloat(dds.physician_score),
      emoji: "🩺",
      description: "Concerns about your doctor or healthcare team.",
      accent: "from-[#7C5E3C] to-[#A67C52]",
      softBg: "bg-[#f7f2eb]",
      softText: "text-[#7C5E3C]",
    },
    {
      domain: "Interpersonal",
      label: "Interpersonal",
      shortLabel: "Interpersonal",
      score: parseFloat(dds.interpersonal_score),
      emoji: "🤝",
      description: "Feeling unsupported by family or friends about your diabetes.",
      accent: "from-[#B08968] to-[#C8A27E]",
      softBg: "bg-[#faf5ef]",
      softText: "text-[#B08968]",
    },
  ].sort((a, b) => b.score - a.score)

  const topDomain = scores[0]
  const overall = getDistressLevel(totalScore)

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f7f3ed_45%,#fefdfb_100%)]">
      <header className="sticky top-0 z-10 border-b border-black/[0.06] bg-[#fefdfb]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/35">
              Diabetes Distress Scale
            </p>
            <h1
              className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-black/85"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Your Results
            </h1>
          </div>

          <div className={`rounded-full px-3 py-1.5 text-[11px] font-medium ${overall.badge}`}>
            {overall.label}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="relative overflow-hidden rounded-[32px] border border-black/[0.06] bg-[#fefdfb] p-7 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.15))]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1 text-[11px] font-medium text-black/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8B6F47]" />
                  Personalized summary
                </div>

                <h2
                  className="text-[30px] font-medium tracking-[-0.03em] text-black/85"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Your overall diabetes distress score is{" "}
                  <span className={overall.tone}>{totalScore.toFixed(1)}</span>
                  <span className="text-black/25"> / 6.0</span>
                </h2>

                <p className="mt-4 max-w-xl text-[14px] leading-7 text-black/55">
                  {overall.summary} This result helps identify which area may need the most support right now, so your next steps can feel more focused and practical.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <div className="rounded-full border border-black/[0.06] bg-black/[0.03] px-3 py-1.5 text-[12px] font-medium text-black/55">
                    Top area: {topDomain.label}
                  </div>
                  <div className="rounded-full border border-black/[0.06] bg-black/[0.03] px-3 py-1.5 text-[12px] font-medium text-black/55">
                    Recommended focus: {recommendedDomain}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative h-44 w-44">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${overall.ring} opacity-[0.14] blur-sm`} />
                  <div className="absolute inset-[10px] rounded-full border border-black/[0.06] bg-[#fefdfb] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-semibold tracking-[-0.04em] ${overall.tone}`}>
                      {totalScore.toFixed(1)}
                    </span>
                    <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-black/30">
                      total score
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[32px] border border-black/[0.06] bg-[#1f1a17] p-7 text-white shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
              Key Insight
            </p>
            <h3
              className="mt-3 text-[24px] font-medium tracking-[-0.02em] text-white"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {topDomain.emoji} {topDomain.label} is your highest scoring domain
            </h3>
            <p className="mt-4 text-[14px] leading-7 text-white/65">
              This suggests that this area may be contributing most to your current distress. Starting here can make support feel more relevant and more effective week to week.
            </p>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                Highest score
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-[14px] text-white/70">{topDomain.shortLabel}</span>
                <span className="text-4xl font-semibold tracking-[-0.03em] text-white">
                  {topDomain.score.toFixed(1)}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* <section className="mt-6 rounded-[32px] border border-black/[0.06] bg-[#fefdfb] p-7 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/35">
                Domain breakdown
              </p>
              <h2
                className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-black/85"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Scores by domain
              </h2>
            </div>
            <p className="text-[12px] text-black/35">
              Ordered from highest to lowest score
            </p>
          </div>

          <div className="grid gap-4">
            {scores.map((s, index) => {
              const severity = getDomainSeverity(s.score)
              const isRecommended = s.domain === recommendedDomain

              return (
                <div
                  key={s.domain}
                  className="rounded-[24px] border border-black/[0.06] bg-white p-5 transition hover:border-black/[0.1] hover:shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ${s.softBg} text-2xl`}>
                        {s.emoji}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[15px] font-semibold text-black/85">
                            {s.label}
                          </h3>

                          {index === 0 && (
                            <span className="rounded-full bg-[#1f1a17] px-2.5 py-1 text-[11px] font-medium text-white">
                              Highest
                            </span>
                          )}

                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${severity.badge}`}>
                            {severity.label}
                          </span>

                          {isRecommended && (
                            <span className="rounded-full border border-[#e7dac8] bg-[#f6efe4] px-2.5 py-1 text-[11px] font-medium text-[#8B6F47]">
                              Recommended focus
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-[14px] leading-7 text-black/50">
                          {s.description}
                        </p>

                        <div className="mt-5">
                          <div className="mb-2 flex items-center justify-between text-[12px] text-black/40">
                            <span>Score progress</span>
                            <span className="font-medium text-black/65">
                              {s.score.toFixed(1)} / 6.0
                            </span>
                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
                            <div
                              className={`h-full rounded-full ${severity.bar}`}
                              style={{ width: `${(s.score / 6) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row items-center gap-2 lg:flex-col lg:items-end">
                      <span className="text-4xl font-semibold tracking-[-0.04em] text-black/85">
                        {s.score.toFixed(1)}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-black/30">
                        domain score
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section> */}

        <section className="mt-6">
          <DomainConfirmation
            recommendedDomain={recommendedDomain}
            scores={scores}
          />
        </section>

        <section className="mt-6 rounded-[22px] border border-black/[0.06] bg-[#fbf8f4] p-4">
          <p className="text-[12px] leading-6 text-black/45">
            These results are meant to guide support and reflection. They do not replace medical advice or a clinical diagnosis.
          </p>
        </section>
      </main>
    </div>
  )
}