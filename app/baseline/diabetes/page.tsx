"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitDiabetesProfile } from "@/actions/baseline"

const MEDICATIONS = [
  "Metformin",
  "Sulfonylurea",
  "GLP-1 agonist",
  "SGLT2 inhibitor",
  "DPP-4 inhibitor",
  "Insulin",
  "Other",
  "None",
]

export default function DiabetesProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [usesInsulin, setUsesInsulin] = useState<boolean | null>(null)
  const [selectedMeds, setSelectedMeds] = useState<string[]>([])

  function toggleMed(med: string) {
    setSelectedMeds(prev =>
      prev.includes(med) ? prev.filter(m => m !== med) : [...prev, med]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    selectedMeds.forEach(med => formData.append("medications", med))
    if (usesInsulin !== null) {
      formData.set("uses_insulin", usesInsulin.toString())
    }
    const result = await submitDiabetesProfile(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/baseline/technology")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Page 2 of 6
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Diabetes Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Help us understand your diabetes history and current management.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Years since diagnosis */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
          <label className="text-sm font-medium text-gray-900">
            How many years have you been living with type 2 diabetes?
          </label>
          <input
            name="years_since_diagnosis"
            type="number"
            min={0}
            max={80}
            placeholder="Number of years"
            disabled={loading}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
          />
        </div>

        {/* Medications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Current diabetes medications
          </label>
          <p className="text-xs text-gray-400">Select all that apply</p>
          <div className="space-y-2">
            {MEDICATIONS.map((med) => (
              <button
                key={med}
                type="button"
                onClick={() => toggleMed(med)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition ${
                  selectedMeds.includes(med)
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                  selectedMeds.includes(med)
                    ? "border-white bg-white"
                    : "border-gray-400"
                }`}>
                  {selectedMeds.includes(med) && (
                    <svg className="w-2.5 h-2.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{med}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Insulin */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Are you currently using insulin?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setUsesInsulin(opt.value)}
                className={`py-3 rounded-xl border-2 text-sm font-medium transition ${
                  usesInsulin === opt.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* A1c */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
          <label className="text-sm font-medium text-gray-900">
            Most recent HbA1c (%) — if known
          </label>
          <input
            name="most_recent_a1c"
            type="text"
            placeholder="e.g. 7.2"
            disabled={loading}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
          />
          <p className="text-xs text-gray-400">Optional — leave blank if unknown</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/baseline/demographics")}
            className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue →"}
          </button>
        </div>
      </form>
    </div>
  )
}