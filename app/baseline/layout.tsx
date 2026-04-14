import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Baseline Assessment — AIDES-T2D",
}

const STEPS = [
  { label: "Demographics" },
  { label: "Diabetes" },
  { label: "Technology" },
  { label: "Preferences" },
  { label: "PHQ-2" },
  { label: "GAD-2" },
]

export default function BaselineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-sm font-medium text-gray-900">
            AIDES-T2D — Baseline Assessment
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Completed once before your study begins • Takes about 10 minutes
          </p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium shrink-0">
                  {i + 1}
                </div>
                <span className="text-xs text-gray-400 hidden sm:block">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}