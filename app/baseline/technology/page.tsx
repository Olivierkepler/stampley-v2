"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitTechnology } from "@/actions/baseline"

export default function TechnologyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [comfort, setComfort] = useState(5)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    formData.set("smartphone_comfort", comfort.toString())
    const result = await submitTechnology(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/baseline/preferences")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Page 3 of 6
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Technology Readiness</h2>
        <p className="text-sm text-gray-500 mt-1">
          Help us understand your comfort with digital technology.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Smartphone type */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            What type of smartphone do you use?
          </label>
          <div className="space-y-2">
            {["iPhone (iOS)", "Android", "Other", "I don't own a smartphone"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="smartphone_type" value={opt} className="accent-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Smartphone comfort */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <label className="text-sm font-medium text-gray-900">
            How comfortable are you using a smartphone?
          </label>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Not comfortable</span>
              <span className="text-2xl font-bold text-gray-900">{comfort}</span>
              <span className="text-xs text-gray-400">Very comfortable</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={comfort}
              onChange={(e) => setComfort(Number(e.target.value))}
              className="w-full accent-gray-900 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-300">
              {Array.from({ length: 11 }, (_, i) => (
                <span key={i}>{i}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Internet access */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            How often do you have access to the internet?
          </label>
          <div className="space-y-2">
            {["Always available", "Sometimes available", "Rarely available"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="internet_access" value={opt} className="accent-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Input preference */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            How would you prefer to share your daily reflections?
          </label>
          <div className="space-y-2">
            {["Written text", "Voice recording", "Either works for me"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="input_preference" value={opt} className="accent-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/baseline/diabetes")}
            className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3.5 text-sm font-medium hover:bg-gray-50 transition">
            ← Back
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50">
            {loading ? "Saving..." : "Continue →"}
          </button>
        </div>
      </form>
    </div>
  )
}