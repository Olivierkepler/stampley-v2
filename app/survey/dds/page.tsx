"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitDDS } from "@/actions/dds"

const QUESTIONS = [
  { id: "q1", text: "Feeling that diabetes is taking up too much of my mental and physical energy every day.", domain: "Emotional" },
  { id: "q2", text: "Feeling that my doctor doesn't know enough about diabetes and diabetes care.", domain: "Physician" },
  { id: "q3", text: "Feeling angry, scared, and/or depressed when I think about living with diabetes.", domain: "Emotional" },
  { id: "q4", text: "Feeling that my doctor doesn't give me clear enough directions on how to manage my diabetes.", domain: "Physician" },
  { id: "q5", text: "Feeling that I am not testing my blood sugars frequently enough.", domain: "Regimen" },
  { id: "q6", text: "Feeling that I am often failing with my diabetes routine.", domain: "Regimen" },
  { id: "q7", text: "Feeling that friends or family are not supportive enough of my self-care efforts.", domain: "Interpersonal" },
  { id: "q8", text: "Feeling that diabetes controls my life.", domain: "Emotional" },
  { id: "q9", text: "Feeling that my doctor doesn't take my concerns seriously enough.", domain: "Physician" },
  { id: "q10", text: "Not feeling confident in my day-to-day ability to manage diabetes.", domain: "Regimen" },
  { id: "q11", text: "Feeling that I will end up with serious long-term complications, no matter what I do.", domain: "Emotional" },
  { id: "q12", text: "Feeling that I am not sticking closely enough to a good meal plan.", domain: "Regimen" },
  { id: "q13", text: "Feeling that friends or family don't appreciate how difficult living with diabetes can be.", domain: "Interpersonal" },
  { id: "q14", text: "Feeling overwhelmed by the demands of living with diabetes.", domain: "Emotional" },
  { id: "q15", text: "Feeling that I don't have a doctor who I can see regularly enough about my diabetes.", domain: "Physician" },
  { id: "q16", text: "Not feeling motivated to keep up my diabetes self-management.", domain: "Regimen" },
  { id: "q17", text: "Feeling that friends or family don't give me the emotional support that I would like.", domain: "Interpersonal" },
]

const SCALE = [
  { value: 1, label: "Not a Problem" },
  { value: 2, label: "A Slight Problem" },
  { value: 3, label: "A Moderate Problem" },
  { value: 4, label: "Somewhat Serious" },
  { value: 5, label: "A Serious Problem" },
  { value: 6, label: "A Very Serious Problem" },
]

export default function DDSSurveyPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const totalAnswered = Object.keys(answers).length
  const progress = Math.round((totalAnswered / 17) * 100)
  const allAnswered = totalAnswered === 17

  function handleAnswer(questionId: string, value: number) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  async function handleSubmit() {
    if (!allAnswered) {
      setError("Please answer all 17 questions before continuing.")
      return
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    Object.entries(answers).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    const result = await submitDDS(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/survey/dds/results")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-medium text-gray-900">
              Baseline Assessment — Diabetes Distress Scale
            </h1>
            <span className="text-xs text-gray-500">
              {totalAnswered}/17 answered
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div
              className="h-1.5 bg-gray-900 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">
            Instructions
          </h2>
          <p className="text-sm text-blue-700 leading-relaxed">
            Living with diabetes can sometimes be tough. Listed below are 17 potential 
            problem areas that people with diabetes may experience. Consider the degree 
            to which each item may have <strong>distressed or bothered you during the past month</strong>.
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Rate each item from 1 (Not a Problem) to 6 (A Very Serious Problem).
          </p>
        </div>

        {/* Questions */}
        {QUESTIONS.map((q, index) => (
          <div
            key={q.id}
            className={`bg-white rounded-2xl border p-6 transition-all ${
              answers[q.id]
                ? "border-gray-200"
                : "border-gray-200"
            }`}
          >
            {/* Question */}
            <div className="flex gap-3 mb-5">
              <span className="text-xs font-medium text-gray-400 mt-0.5 shrink-0 w-6">
                {index + 1}.
              </span>
              <p className="text-sm text-gray-900 leading-relaxed">
                {q.text}
              </p>
            </div>

            {/* Scale buttons */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {SCALE.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(q.id, option.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    answers[q.id] === option.value
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-lg font-semibold">
                    {option.value}
                  </span>
                  <span className={`text-center leading-tight ${
                    answers[q.id] === option.value
                      ? "text-gray-300"
                      : "text-gray-400"
                  } text-[9px]`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="pb-8">
          <button
            onClick={handleSubmit}
            disabled={loading || !allAnswered}
            className={`w-full rounded-xl py-4 text-sm font-medium transition ${
              allAnswered
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } disabled:opacity-50`}
          >
            {loading
              ? "Calculating your results..."
              : allAnswered
              ? "See My Results →"
              : `Answer all questions to continue (${17 - totalAnswered} remaining)`
            }
          </button>
        </div>

      </div>
    </div>
  )
}