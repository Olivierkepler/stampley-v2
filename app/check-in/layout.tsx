import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

const STEPS = [
  { label: "Daily Metrics", path: "/check-in/daily-metrics" },
  { label: "Context", path: "/check-in/contextual-factors" },
  { label: "Narrative", path: "/check-in/clinical-narrative" },
  { label: "Domain", path: "/check-in/weekly-domain" },
  { label: "Stampley", path: "/check-in/stampley-support" },
]

export default async function CheckInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900 transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className="text-gray-200">|</span>
          <h1 className="text-sm font-medium text-gray-900">Daily Check-in</h1>
        </div>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                  {i + 1}
                </div>
                <span className="text-xs text-gray-400 hidden sm:block">
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-2" />
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