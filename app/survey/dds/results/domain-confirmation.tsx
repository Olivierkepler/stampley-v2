"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { confirmDomain } from "@/actions/dds"

const DOMAINS = [
  { id: "Emotional", label: "Emotional Burden", emoji: "💙", description: "Feeling overwhelmed, discouraged, or burned out by diabetes" },
  { id: "Regimen", label: "Regimen-Related", emoji: "📋", description: "Challenges with medications, blood sugar, or meal planning" },
  { id: "Physician", label: "Physician-Related", emoji: "🩺", description: "Concerns about your doctor or healthcare team" },
  { id: "Interpersonal", label: "Interpersonal", emoji: "🤝", description: "Feeling unsupported by family or friends about your diabetes" },
]

interface Props {
  recommendedDomain: string
  scores: { domain: string; label: string; score: number; emoji: string }[]
}

export function DomainConfirmation({ recommendedDomain, scores }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState(recommendedDomain)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleConfirm() {
    setLoading(true)
    setError("")

    const result = await confirmDomain(selected)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  const recommended = DOMAINS.find(d => d.id === recommendedDomain)

  return (
    <div className="space-y-4">

      {/* Recommendation card */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-sm font-semibold text-blue-900 mb-1">
          💡 Our Recommendation for Week 1
        </p>
        <p className="text-sm text-blue-700 leading-relaxed">
          Based on your responses, we recommend focusing on{" "}
          <strong>{recommended?.label}</strong> this week.
          Stampley will tailor daily support conversations to this area.
        </p>
      </div>

      {/* Domain selection */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Confirm Your Week 1 Focus
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          You can accept our recommendation or choose a different area to focus on.
        </p>

        <div className="space-y-3">
          {DOMAINS.map((d) => {
            const score = scores.find(s => s.domain === d.id)?.score ?? 0
            const isRecommended = d.id === recommendedDomain
            const isSelected = selected === d.id

            return (
              <button
                key={d.id}
                onClick={() => setSelected(d.id)}
                className={`w-full flex items-start gap-4 px-4 py-4 rounded-xl border-2 text-left transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-xl shrink-0">{d.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-medium ${
                      isSelected ? "text-white" : "text-gray-900"
                    }`}>
                      {d.label}
                    </p>
                    {isRecommended && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        Recommended
                      </span>
                    )}
                    <span className={`text-xs ml-auto ${
                      isSelected ? "text-gray-300" : "text-gray-400"
                    }`}>
                      Score: {score.toFixed(1)}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${
                    isSelected ? "text-gray-300" : "text-gray-500"
                  }`}>
                    {d.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-gray-900 text-white rounded-xl py-4 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
      >
        {loading
          ? "Setting up your dashboard..."
          : `Confirm — Start with ${DOMAINS.find(d => d.id === selected)?.label}`
        }
      </button>

      <p className="text-xs text-gray-400 text-center pb-8">
        You can choose a new focus domain at the start of each week.
      </p>
    </div>
  )
}