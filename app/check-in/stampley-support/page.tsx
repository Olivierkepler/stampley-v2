"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"

export default function StampleySupportPage() {
  const router = useRouter()
  const store = useCheckInStore()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/check-in/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distress: store.distress,
          mood: store.mood,
          energy: store.energy,
          contextTags: store.contextTags,
          reflection: store.reflection,
          copingAction: store.copingAction,
          domain: store.domain,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit")

      store.reset()
      setSubmitted(true)
    } catch (e) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Check-in complete!
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Thank you for checking in today.
          </p>
        </div>

        {/* Stampley message */}
        <div className="bg-blue-50 rounded-2xl p-6 text-left space-y-3 border border-blue-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">💙</span>
            <p className="text-sm font-semibold text-blue-900">
              A message from Stampley
            </p>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            {store.domain === "Emotional" && (
              "Thank you for sharing how you're feeling. Noticing your emotions around diabetes is an important step. For tomorrow, try giving yourself one small moment of rest — even a minute counts. I'll check in again when you're ready. 💙"
            )}
            {store.domain === "Regimen" && (
              "Thank you for checking in. Managing your diabetes routine takes real effort every single day. For tomorrow, try focusing on just one small thing you can do well — progress over perfection. I'll be here when you're ready. 💙"
            )}
            {store.domain === "Physician" && (
              "Thank you for sharing today. Navigating your relationship with your healthcare team can be challenging. For tomorrow, consider writing down one question you'd like to ask at your next appointment. I'll check in again soon. 💙"
            )}
            {store.domain === "Interpersonal" && (
              "Thank you for being open today. Feeling unsupported can make managing diabetes even harder. For tomorrow, try reaching out to one person — not about diabetes, just to connect. I'll be here when you're ready. 💙"
            )}
            {!store.domain && (
              "Thank you for taking this moment for yourself. You've already taken an important step by noticing how you feel. I'll check in again when you're ready. 💙"
            )}
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Step 5 of 5
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          Review & Submit
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here's a summary of your check-in today.
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        <div className="px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Distress</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              store.distress >= 7 ? "bg-red-500" :
              store.distress >= 4 ? "bg-amber-500" : "bg-green-500"
            }`} />
            <p className="text-sm font-semibold text-gray-900">
              {store.distress}/10
            </p>
          </div>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Mood</p>
          <p className="text-sm font-semibold text-gray-900">{store.mood}/10</p>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Energy</p>
          <p className="text-sm font-semibold text-gray-900">{store.energy}/10</p>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Context Tags</p>
          <p className="text-sm font-semibold text-gray-900">
            {store.contextTags.length > 0
              ? `${store.contextTags.length} selected`
              : "None"
            }
          </p>
        </div>
        <div className="px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">Focus Domain</p>
          <p className="text-sm font-semibold text-gray-900">
            {store.domain ?? "—"}
          </p>
        </div>
        {store.reflection && (
          <div className="px-6 py-4">
            <p className="text-sm text-gray-500 mb-1">Reflection</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {store.reflection}
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/check-in/weekly-domain")}
          className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Check-in ✓"}
        </button>
      </div>
    </div>
  )
}