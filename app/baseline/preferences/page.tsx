"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitEngagement } from "@/actions/baseline"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function PreferencesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [reminderConsent, setReminderConsent] = useState<boolean | null>(null)

  function toggleDay(day: string) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const formData = new FormData(e.currentTarget)
    selectedDays.forEach(day => formData.append("preferred_days", day))
    if (reminderConsent !== null) {
      formData.set("reminder_consent", reminderConsent.toString())
    }
    const result = await submitEngagement(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/baseline/phq2")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Page 4 of 6
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Engagement Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">
          Help us personalize your study experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Preferred days */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Which days do you prefer to check in?
          </label>
          <p className="text-xs text-gray-400">Select all that apply</p>
          <div className="grid grid-cols-4 gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`py-2.5 rounded-xl text-xs font-medium border-2 transition ${
                  selectedDays.includes(day)
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Reminder time */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            When would you like to receive reminders?
          </label>
          <div className="space-y-2">
            {[
              { label: "Morning", time: "7–9am" },
              { label: "Midday", time: "11am–1pm" },
              { label: "Afternoon", time: "3–5pm" },
              { label: "Evening", time: "6–8pm" },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <input type="radio" name="preferred_reminder_time" value={opt.label} className="accent-gray-900" />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </div>
                <span className="text-xs text-gray-400">{opt.time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reminder consent */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Do you consent to receive up to 3 reminders per week?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Yes", value: true }, { label: "No", value: false }].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setReminderConsent(opt.value)}
                className={`py-3 rounded-xl border-2 text-sm font-medium transition ${
                  reminderConsent === opt.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/baseline/technology")}
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