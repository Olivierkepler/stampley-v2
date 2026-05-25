import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import DomainConfirmation from "./domain-confirmation"

const DOMAINS = [
  {
    key: "emotional_score",
    title: "Emotional Burden",
    description:
      "Emotional weight, worry, burnout, and feeling overwhelmed by diabetes.",
  },
  {
    key: "physician_score",
    title: "Physician-related Distress",
    description:
      "Concerns about communication, clarity, trust, or support from healthcare providers.",
  },
  {
    key: "regimen_score",
    title: "Regimen-related Distress",
    description:
      "Daily diabetes routines, meal planning, medication, monitoring, and self-management demands.",
  },
  {
    key: "interpersonal_score",
    title: "Interpersonal Distress",
    description:
      "Support, understanding, and emotional help from family, friends, or people around you.",
  },
]

function getSeverity(score: number) {
  if (score >= 4) {
    return {
      label: "High Distress",
      description:
        "This score suggests diabetes distress may be strongly affecting this area.",
      badge: "border-red-200 bg-red-50 text-red-700",
      bar: "bg-red-600",
    }
  }

  if (score >= 3) {
    return {
      label: "Moderate Distress or Higher",
      description:
        "This score meets the commonly used DDS threshold for moderate distress or higher.",
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      bar: "bg-amber-500",
    }
  }

  if (score >= 2) {
    return {
      label: "Mild to Moderate Distress",
      description:
        "This score suggests some diabetes-related distress may be present.",
      badge: "border-[#bfd7ea] bg-[#f0f6fc] text-[#003e73]",
      bar: "bg-[#005ea8]",
    }
  }

  return {
    label: "Low Distress",
    description:
      "This score is below the moderate distress threshold.",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-600",
  }
}

function formatScore(value: unknown) {
  return Number(value ?? 0).toFixed(2)
}

function getScaleWidth(score: number) {
  return `${Math.min(Math.max((score / 6) * 100, 0), 100)}%`
}

export default async function DDSResultsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const result = await query(
    `
      SELECT *
      FROM dds_responses
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [session.user.id]
  )

  if (result.rows.length === 0) {
    redirect("/survey/dds")
  }

  const data = result.rows[0]
  const totalScore = Number(data.total_score ?? 0)
  const severity = getSeverity(totalScore)

  const recommendedDomain =
    data.recommended_domain ||
    data.confirmed_domain ||
    "Emotional"

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-full ">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#003e73] px-6 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest">
              AIDES-T2D Research Study
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Diabetes Distress Scale Results
            </h1>
          </div>
        <div className=" bg-white my-30  ">
         
{/* 
          <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              DDS-17 Score Summary
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Your diabetes distress profile
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
              DDS-17 scores are mean item scores. A mean score of 3 or higher
              suggests moderate diabetes distress or higher and may be worth
              discussing with a healthcare provider.
            </p>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
              This summary is not a diagnosis and does not replace medical
              care.
            </p>
          </div> */}

          <section className="mx-auto max-w-7xl  grid gap-6 px-6 py-6 lg:grid-cols-[360px_1fr]">
            <div className="border border-gray-300 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                Total DDS Score
              </p>

              <div className="mt-4 flex items-end gap-3">
                <p className="text-5xl font-bold text-[#003e73]">
                  {totalScore.toFixed(2)}
                </p>

                <p className="pb-2 text-sm font-semibold text-gray-500">
                  / 6
                </p>
              </div>

              <div
                className={`mt-4 inline-flex border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${severity.badge}`}
              >
                {severity.label}
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-700">
                {severity.description}
              </p>
            </div>

            <div className="border border-gray-300 bg-[#f8fafc] p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                    Distress Scale
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-gray-900">
                    Where your score falls
                  </h3>
                </div>

                <div className="hidden border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-600 sm:block">
                  Threshold: 3.0
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex justify-between text-xs font-semibold text-gray-500">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Severe</span>
                </div>

                <div className="relative h-3 border border-gray-300 bg-white">
                  <div
                    className={`h-full ${severity.bar}`}
                    style={{ width: getScaleWidth(totalScore) }}
                  />

                  <div
                    className="absolute -top-2 h-7 w-[2px] bg-red-600"
                    style={{ left: "50%" }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[11px] text-gray-500">
                  <span>1.0</span>
                  <span>3.0 moderate distress threshold</span>
                  <span>6.0</span>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-gray-700">
                Your total score helps summarize your overall diabetes-related
                distress. Domain scores below show which areas contributed most
                strongly.
              </p>
            </div>
          </section>

          {/* <section className="border-b border-gray-300 px-6 py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Domain Breakdown
              </p>

              <h3 className="mt-2 text-xl font-bold text-gray-900">
                Scores by distress area
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                These domains identify the areas where diabetes distress may be
                most present.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {DOMAINS.map((domain) => {
                const score = Number(data[domain.key] ?? 0)
                const domainSeverity = getSeverity(score)

                return (
                  <div
                    key={domain.key}
                    className="border border-gray-300 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">
                          {domain.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {domain.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold text-[#003e73]">
                          {formatScore(score)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          mean score
                        </p>
                      </div>
                    </div>

                    <div
                      className={`mt-4 inline-flex border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] ${domainSeverity.badge}`}
                    >
                      {domainSeverity.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </section> */}

          <section className="px-6 py-6 mx-auto max-w-7xl  z-50">
            <div className="border border-gray-300 bg-gray-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Focus Selection
              </p>

              <h3 className="mt-2 text-xl font-bold text-gray-900">
                Choose your support focus
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700">
                We recommend starting with the area most connected to your DDS
                responses. You can confirm the recommendation or choose another
                area that feels more important to you right now.
              </p>

              <div className="mt-6">
                <DomainConfirmation recommendedDomain={recommendedDomain} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}