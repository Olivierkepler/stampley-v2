"use client"

import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"

export default function DailyMetricsPage() {
  const router = useRouter()
  const { distress, mood, energy, setDistress, setMood, setEnergy } = useCheckInStore()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
          Step 1 of 5
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          How are you feeling today?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Take a moment to check in with yourself.
        </p>
      </div>

      {/* Distress Slider */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            How stressful did diabetes feel today?
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            0 = Not stressful at all · 10 = Extremely stressful
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Not stressful</span>
            <span className="text-3xl font-bold text-gray-900">{distress}</span>
            <span className="text-xs text-gray-400">Very stressful</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={distress}
            onChange={(e) => setDistress(Number(e.target.value))}
            className="w-full accent-gray-900 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 px-0.5">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
        {distress >= 8 && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            ⚠️ You're reporting high stress today. Stampley will provide extra support.
          </p>
        )}
      </div>

      {/* Mood Slider */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            How is your mood right now?
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            😞 Very unpleasant → 😊 Very pleasant
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xl">😞</span>
            <span className="text-3xl font-bold text-indigo-600">{mood}</span>
            <span className="text-xl">😊</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 px-0.5">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Slider */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            How is your energy level?
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            💤 Very drained → ⚡ Very energized
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xl">💤</span>
            <span className="text-3xl font-bold text-amber-500">{energy}</span>
            <span className="text-xl">⚡</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-300 px-0.5">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Next */}
      <button
        onClick={() => router.push("/check-in/contextual-factors")}
        className="w-full bg-gray-900 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-gray-700 transition"
      >
        Continue →
      </button>
    </div>
  )
}