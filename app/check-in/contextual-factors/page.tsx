"use client"

import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"

const CONTEXT_TAGS = [
  { id: "doctors_appointment", label: "Doctor's appointment", emoji: "🩺" },
  { id: "blood_sugar", label: "High or low blood sugar", emoji: "🩸" },
  { id: "missed_medication", label: "Missed a medication or meal", emoji: "💊" },
  { id: "work_stress", label: "Stress at work or school", emoji: "💼" },
  { id: "conflict", label: "Conflict or tension with someone", emoji: "😤" },
  { id: "felt_supported", label: "Felt supported by someone", emoji: "🤗" },
  { id: "unwell", label: "Felt physically unwell or tired", emoji: "😔" },
]

export default function ContextualFactorsPage() {
  const router = useRouter()
  const { contextTags, setContextTags } = useCheckInStore()

  function toggleTag(tag: string) {
    if (contextTags.includes(tag)) {
      setContextTags(contextTags.filter((t) => t !== tag))
    } else {
      setContextTags([...contextTags, tag])
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Step 2 of 5
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          What shaped your day?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select all that applied to your day with diabetes.
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        {CONTEXT_TAGS.map((tag) => {
          const selected = contextTags.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition ${
                selected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="text-xl shrink-0">{tag.emoji}</span>
              <span className="text-sm font-medium">{tag.label}</span>
              {selected && (
                <div className="ml-auto w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {contextTags.length === 0 && (
        <p className="text-xs text-gray-400 text-center">
          Nothing applied today? That's okay — you can continue without selecting anything.
        </p>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/check-in/daily-metrics")}
          className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push("/check-in/clinical-narrative")}
          className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}