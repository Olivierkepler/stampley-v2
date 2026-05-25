"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { confirmDomain } from "@/actions/dds"

const DOMAINS = [
  {
    value: "Emotional",
    title: "Emotional Burden",
    description:
      "Focus on overwhelm, fear, burnout, worry, and the emotional weight of diabetes.",
  },
  {
    value: "Regimen",
    title: "Regimen-related Distress",
    description:
      "Focus on daily routines, meal planning, blood sugar testing, medication, and self-management.",
  },
  {
    value: "Physician",
    title: "Physician-related Distress",
    description:
      "Focus on communication, trust, support, and confidence with your healthcare team.",
  },
  {
    value: "Interpersonal",
    title: "Interpersonal Distress",
    description:
      "Focus on family, friends, social support, and feeling understood by people around you.",
  },
]

export default function DomainConfirmation({
  recommendedDomain,
}: {
  recommendedDomain: string
}) {
  const router = useRouter()
  const [selectedDomain, setSelectedDomain] = useState(
    recommendedDomain || "Emotional"
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleConfirm() {
    setLoading(true)
    setError("")

    const result = await confirmDomain(selectedDomain)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push("/check-in")
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 ">
        {DOMAINS.map((domain) => {
          const selected = selectedDomain === domain.value
          const recommended = recommendedDomain === domain.value

          return (
            <button
              key={domain.value}
              type="button"
              onClick={() => setSelectedDomain(domain.value)}
              className={`group cursor-pointer border p-5 text-left transition ${
                selected
                  ? "border-[#005ea8] bg-[#f0f6fc] shadow-sm"
                  : "border-gray-200 bg-white hover:border-[#9ec5e5] hover:bg-[#f8fafc]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">
                      {domain.title}
                    </h3>

                    {recommended ? (
                      <span className="rounded-full border border-[#bfd7ea] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#005ea8]">
                        Recommended
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {domain.description}
                  </p>
                </div>

                <span
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                    selected
                      ? "border-[#005ea8] bg-[#005ea8]"
                      : "border-gray-300 bg-white group-hover:border-[#005ea8]"
                  }`}
                  aria-hidden="true"
                >
                  {selected ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  ) : null}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {error ? (
        <p className="mt-4 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

<div className="pointer-events-none fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-md">
  <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="pointer-events-auto text-sm leading-6 text-gray-600">
      This focus will guide your first week of daily check-ins.
    </p>

    <button
      type="button"
      onClick={handleConfirm}
      disabled={loading || !selectedDomain}
      className="pointer-events-auto inline-flex items-center justify-center rounded-lg bg-[#005ea8] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#004b87] disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {loading ? "Saving focus..." : "Confirm Focus & Continue"}
    </button>
  </div>
</div>
    </div>
  )
}