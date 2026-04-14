"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useCheckInStore, type Domain } from "@/store/checkin-store"

const DOMAINS = [
  {
    id: "Emotional" as Domain,
    label: "Emotional Burden",
    emoji: "💙",
    description: "Feeling overwhelmed, discouraged, or burned out by diabetes",
    color: "border-indigo-200 hover:border-indigo-400",
    selectedColor: "border-indigo-500 bg-indigo-50",
  },
  {
    id: "Regimen" as Domain,
    label: "Regimen-Related",
    emoji: "📋",
    description: "Challenges with medications, blood sugar, or meal planning",
    color: "border-amber-200 hover:border-amber-400",
    selectedColor: "border-amber-500 bg-amber-50",
  },
  {
    id: "Physician" as Domain,
    label: "Physician-Related",
    emoji: "🩺",
    description: "Concerns about your doctor or healthcare team",
    color: "border-green-200 hover:border-green-400",
    selectedColor: "border-green-500 bg-green-50",
  },
  {
    id: "Interpersonal" as Domain,
    label: "Interpersonal",
    emoji: "🤝",
    description: "Feeling unsupported by family or friends about your diabetes",
    color: "border-rose-200 hover:border-rose-400",
    selectedColor: "border-rose-500 bg-rose-50",
  },
]

interface Props {
  lockedDomain: string | null
  weekNumber: number
  isLocked: boolean
}

export function WeeklyDomainClient({ lockedDomain, weekNumber, isLocked }: Props) {
  const router = useRouter()
  const { domain, setDomain } = useCheckInStore()

  // Auto-set locked domain
  useEffect(() => {
    if (lockedDomain) {
      setDomain(lockedDomain as Domain)
    }
  }, [lockedDomain])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Step 4 of 5
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          Your Weekly Focus
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isLocked
            ? `Week ${weekNumber} focus is set. Stampley will support you in this area.`
            : "Choose one area to focus on this week with Stampley."
          }
        </p>
      </div>

      {/* Locked domain notice */}
      {isLocked && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-blue-700">
            Your Week {weekNumber} domain is locked. You can choose a new domain at the start of Week {weekNumber + 1}.
          </p>
        </div>
      )}

      {/* Domain cards */}
      <div className="grid gap-3">
        {DOMAINS.map((d) => {
          const isSelected = domain === d.id || lockedDomain === d.id
          return (
            <button
              key={d.id}
              onClick={() => !isLocked && setDomain(d.id)}
              disabled={isLocked && lockedDomain !== d.id}
              className={`w-full flex items-start gap-4 px-5 py-4 rounded-xl border-2 text-left transition ${
                isSelected
                  ? `${d.selectedColor} border-2`
                  : isLocked
                  ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                  : `bg-white ${d.color}`
              }`}
            >
              <span className="text-2xl shrink-0">{d.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{d.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/check-in/clinical-narrative")}
          className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push("/check-in/stampley-support")}
          disabled={!domain && !lockedDomain}
          className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}