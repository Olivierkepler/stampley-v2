"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitPHQ2 } from "@/actions/baseline"

const SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
]

const QUESTIONS = [
  { id: "q1", text: "Little interest or pleasure in doing things?" },
  { id: "q2", text: "Feeling down, depressed, or hopeless?" },
]

export default function PHQ2Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const allAnswered = Object.keys(answers).length === 2

  async function handleSubmit() {
    if (!allAnswered) {
      setError("Please answer both questions.")
      return
    }
    setLoading(true)
    setError("")
    const formData = new FormData()
    Object.entries(answers).forEach(([k, v]) => formData.append(k, v.toString()))
    const result = await submitPHQ2(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/baseline/gad2")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Page 5 of 6
        </p>
        <h2 className="text-xl font-semibold text-gray-900">PHQ-2</h2>
        <p className="text-sm text-gray-500 mt-1">
          Patient Health Questionnaire — 2 questions about mood over the past 2 weeks.
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm text-blue-800 font-medium mb-1">Instructions</p>
        <p className="text-sm text-blue-700">
          Over the <strong>past 2 weeks</strong>, how often have you been bothered by the following problems?
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <p className="text-sm font-medium text-gray-900">
              {qi + 1}. {q.text}
            </p>
            <div className="space-y-2">
              {SCALE.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${
                    answers[q.id] === opt.value
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  <span className={`text-sm font-bold ${
                    answers[q.id] === opt.value ? "text-white" : "text-gray-400"
                  }`}>
                    {opt.value}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.push("/baseline/preferences")}
          className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition">
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !allAnswered}
          className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue →"}
        </button>
      </div>
    </div>
  )
}