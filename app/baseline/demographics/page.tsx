"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitDemographics } from "@/actions/baseline"

export default function DemographicsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    const result = await submitDemographics(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/baseline/diabetes")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Page 1 of 6
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Demographics</h2>
        <p className="text-sm text-gray-500 mt-1">
          All fields are optional. This information helps us describe our study participants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Age */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
          <label className="text-sm font-medium text-gray-900">Age</label>
          <input
            name="age"
            type="number"
            min={18}
            max={100}
            placeholder="Enter your age"
            disabled={loading}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
          />
        </div>

        {/* Sex */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">Sex</label>
          <div className="grid grid-cols-2 gap-2">
            {["Male", "Female", "Non-binary", "Prefer not to say"].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="sex" value={opt} className="accent-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Race/Ethnicity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">Race and Ethnicity</label>
          <div className="space-y-2">
            {[
              "White",
              "Black or African American",
              "Hispanic or Latino",
              "Asian",
              "American Indian or Alaska Native",
              "Other",
              "Prefer not to say",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="race_ethnicity" value={opt} className="accent-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">Highest Education Level</label>
          <div className="space-y-2">
            {[
              "Less than high school",
              "High school diploma or GED",
              "Some college",
              "Associate degree",
              "Bachelor's degree",
              "Graduate degree",
              "Prefer not to say",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="education" value={opt} className="accent-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">Annual Household Income</label>
          <div className="space-y-2">
            {[
              "Under $25,000",
              "$25,000 – $49,999",
              "$50,000 – $74,999",
              "$75,000 – $99,999",
              "$100,000 or more",
              "Prefer not to say",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="income_band" value={opt} className="accent-gray-900" />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Employment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">Employment Status</label>
          <div className="space-y-2">
            {[
              "Employed full-time",
              "Employed part-time",
              "Self-employed",
              "Unemployed",
              "Retired",
              "Student",
              "Unable to work",
              "Prefer not to say",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <input type="radio" name="employment" value={opt} className="accent-gray-900" />
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue →"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          You can skip any question by leaving it blank.
        </p>
      </form>
    </div>
  )
}