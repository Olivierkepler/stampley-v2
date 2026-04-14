import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { DomainConfirmation } from "./domain-confirmation"

export default async function DDSResultsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  // Get DDS results from database
  const result = await query(
    `SELECT * FROM dds_responses WHERE user_id = $1`,
    [session.user.id]
  )

  if (result.rows.length === 0) {
    redirect("/survey/dds")
  }

  const dds = result.rows[0]

  const scores = [
    {
      domain: "Emotional",
      label: "Emotional Burden",
      score: parseFloat(dds.emotional_score),
      emoji: "💙",
      color: "indigo",
      description: "Feeling overwhelmed, discouraged, or burned out by diabetes",
    },
    {
      domain: "Regimen",
      label: "Regimen-Related",
      score: parseFloat(dds.regimen_score),
      emoji: "📋",
      color: "amber",
      description: "Challenges with medications, blood sugar, or meal planning",
    },
    {
      domain: "Physician",
      label: "Physician-Related",
      score: parseFloat(dds.physician_score),
      emoji: "🩺",
      color: "green",
      description: "Concerns about your doctor or healthcare team",
    },
    {
      domain: "Interpersonal",
      label: "Interpersonal",
      score: parseFloat(dds.interpersonal_score),
      emoji: "🤝",
      color: "rose",
      description: "Feeling unsupported by family or friends about your diabetes",
    },
  ].sort((a, b) => b.score - a.score)

  const recommendedDomain = dds.recommended_domain
  const totalScore = parseFloat(dds.total_score)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-sm font-medium text-gray-900">
            Your Diabetes Distress Results
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Overall score */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Overall Distress Score
          </p>
          <p className={`text-5xl font-bold mt-2 ${
            totalScore >= 3 ? "text-amber-600" : "text-green-600"
          }`}>
            {totalScore.toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1">out of 6.0</p>
          <p className={`text-sm mt-3 font-medium ${
            totalScore >= 3 ? "text-amber-700" : "text-green-700"
          }`}>
            {totalScore >= 3
              ? "Clinically significant diabetes distress detected"
              : "Distress within manageable range"
            }
          </p>
        </div>

        {/* Subscale scores */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Scores by Domain
          </h2>
          <div className="space-y-4">
            {scores.map((s) => (
              <div key={s.domain}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span>{s.emoji}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {s.label}
                    </span>
                    {s.score >= 3 && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                        Significant
                      </span>
                    )}
                    {s.domain === recommendedDomain && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        Recommended focus
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {s.score.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      s.score >= 3 ? "bg-amber-500" : "bg-green-400"
                    }`}
                    style={{ width: `${(s.score / 6) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Domain confirmation — client component */}
        <DomainConfirmation
          recommendedDomain={recommendedDomain}
          scores={scores}
        />

      </div>
    </div>
  )
}