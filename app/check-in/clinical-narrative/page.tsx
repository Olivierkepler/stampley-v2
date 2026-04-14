"use client"

import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"

export default function ClinicalNarrativePage() {
  const router = useRouter()
  const { reflection, copingAction, setReflection, setCopingAction } = useCheckInStore()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Step 3 of 5
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          Reflect on your day
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Share what was on your mind today. There are no right or wrong answers.
        </p>
      </div>

      {/* Reflection */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            What most shaped your day with diabetes?
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Share as much or as little as you'd like.
          </p>
        </div>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Today I felt..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition resize-none placeholder:text-gray-300"
        />
        <p className="text-xs text-gray-400 text-right">
          {reflection.length} characters
        </p>
      </div>

      {/* Coping action */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            What helped you get through the day?
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Even small things count.
          </p>
        </div>
        <textarea
          value={copingAction}
          onChange={(e) => setCopingAction(e.target.value)}
          placeholder="What coping strategies did you use today?"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition resize-none placeholder:text-gray-300"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/check-in/contextual-factors")}
          className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={() => router.push("/check-in/weekly-domain")}
          className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}