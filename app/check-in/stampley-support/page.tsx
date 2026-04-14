"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"

type StampleyResponse = {
  greeting: string
  validation: string
  reflection_question: string
  micro_skill: string
  education_chip: string
  closure: string
}

export default function StampleySupportPage() {
  const router = useRouter()
  const store = useCheckInStore()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [stampleyResponse, setStampleyResponse] = useState<StampleyResponse | null>(null)
  const [reflectionReply, setReflectionReply] = useState("")
  const [showEducation, setShowEducation] = useState(false)
  const [needsSafety, setNeedsSafety] = useState(false)
  const [subscale, setSubscale] = useState("")
  const [dayNumber, setDayNumber] = useState(1)
  const [weekNumber, setWeekNumber] = useState(1)

  async function handleSubmit() {
    setSubmitting(true)
    setError("")

    try {
      // Step 1: Submit check-in data
      const submitRes = await fetch("/api/check-in/submit", {
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

      if (!submitRes.ok) throw new Error("Failed to submit check-in")

      const submitData = await submitRes.json()
      setNeedsSafety(submitData.needsSafetyEscalation)
      setSubscale(submitData.subscale ?? "")
      setDayNumber(submitData.dayNumber ?? 1)
      setWeekNumber(submitData.weekNumber ?? 1)

      setSubmitting(false)
      setLoading(true)

      // Step 2: Generate Stampley AI response
      const stampleyRes = await fetch("/api/stampley/generate", {
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
          subscale: submitData.subscale,
          dayNumber: submitData.dayNumber,
          weekNumber: submitData.weekNumber,
        }),
      })

      const stampleyData = await stampleyRes.json()
      setStampleyResponse(stampleyData.response)
      setSubmitted(true)
      store.reset()

    } catch (e) {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  // Safety escalation view
  if (submitted && needsSafety) {
    return (
      <div className="space-y-6 py-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-red-800">
              We want to make sure you're okay
            </p>
          </div>
          <p className="text-sm text-red-700 leading-relaxed">
            It sounds like things have been really difficult lately.
            You don't have to face this alone.
            If you need support right now, please reach out:
          </p>
          <div className="space-y-2">
            <a href="sms:741741&body=HOME"
              className="flex items-center gap-3 bg-white border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition">
              <span>📱</span>
              <span>Crisis Text Line — Text HOME to 741741</span>
            </a>
            <a href="tel:18006624357"
              className="flex items-center gap-3 bg-white border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition">
              <span>📞</span>
              <span>SAMHSA Helpline — 1-800-662-4357</span>
            </a>
          </div>
        </div>

        {stampleyResponse && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              {stampleyResponse.closure}
            </p>
          </div>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  // Stampley response view
  if (submitted && stampleyResponse) {
    return (
      <div className="space-y-4 pb-8">

        {/* Stampley header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
            💙
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Stampley</p>
            <p className="text-xs text-gray-400">Your daily support companion</p>
          </div>
        </div>

        {/* Part 1: Greeting */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm text-blue-900 leading-relaxed">
            {stampleyResponse.greeting}
          </p>
        </div>

        {/* Part 2: Validation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            What I noticed
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {stampleyResponse.validation}
          </p>
        </div>

        {/* Part 3: Reflection question */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span>🪞</span>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Reflect
            </p>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {stampleyResponse.reflection_question}
          </p>
          <textarea
            value={reflectionReply}
            onChange={(e) => setReflectionReply(e.target.value)}
            placeholder="Your response (optional)..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition resize-none placeholder:text-gray-300"
          />
          <p className="text-xs text-gray-400">
            Optional — Stampley reads your response but won't reply back.
          </p>
        </div>

        {/* Part 4: Micro-skill */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span>🧘</span>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Try This
            </p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {stampleyResponse.micro_skill}
          </p>
        </div>

        {/* Part 5: Education chip */}
        <button
          onClick={() => setShowEducation(!showEducation)}
          className="w-full bg-white rounded-2xl border border-gray-100 p-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-2">
            <span>💡</span>
            <p className="text-sm font-medium text-gray-700">
              Learn more about this
            </p>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${showEducation ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showEducation && (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 -mt-2">
            <p className="text-sm text-gray-600 leading-relaxed">
              {stampleyResponse.education_chip}
            </p>
          </div>
        )}

        {/* Part 6: Closure */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm text-blue-900 leading-relaxed">
            {stampleyResponse.closure}
          </p>
        </div>

        {/* Back to dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  // Review & Submit view
  return (
    <div className="space-y-6">

      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Step 5 of 5
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          Review & Submit
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Review your check-in then submit to hear from Stampley.
        </p>
      </div>

      {/* Loading state */}
      {(submitting || loading) && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto animate-pulse">
            <span className="text-xl">💙</span>
          </div>
          <p className="text-sm font-medium text-blue-900">
            {submitting ? "Saving your check-in..." : "Stampley is preparing your response..."}
          </p>
          <p className="text-xs text-blue-600">
            This takes a few seconds
          </p>
        </div>
      )}

      {/* Summary */}
      {!submitting && !loading && (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          <div className="px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Distress</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                store.distress >= 7 ? "bg-red-500" :
                store.distress >= 4 ? "bg-amber-500" : "bg-green-500"
              }`} />
              <p className="text-sm font-semibold text-gray-900">{store.distress}/10</p>
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
              {store.contextTags.length > 0 ? `${store.contextTags.length} selected` : "None"}
            </p>
          </div>
          <div className="px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">Domain</p>
            <p className="text-sm font-semibold text-gray-900">{store.domain ?? "—"}</p>
          </div>
          {store.reflection && (
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500 mb-1">Reflection</p>
              <p className="text-sm text-gray-700 line-clamp-2">{store.reflection}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!submitting && !loading && (
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/check-in/weekly-domain")}
            className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition"
          >
            Submit & Hear from Stampley 💙
          </button>
        </div>
      )}
    </div>
  )
}