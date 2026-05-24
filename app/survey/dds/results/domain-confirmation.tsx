"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { confirmDomain } from "@/actions/dds"

type Domain = "Emotional" | "Regimen" | "Physician" | "Interpersonal"

const DOMAINS: Domain[] = ["Emotional", "Regimen", "Physician", "Interpersonal"]

type ScoreItem = {
  domain: string
  label: string
  shortLabel: string
  score: number
  emoji: string
  description: string
  accent: string
  softBg: string
  softText: string
}

interface DomainConfirmationProps {
  recommendedDomain: string
  scores: ScoreItem[]
}

function isDomain(value: string): value is Domain {
  return DOMAINS.includes(value as Domain)
}

export function DomainConfirmation({
  recommendedDomain,
  scores,
}: DomainConfirmationProps) {
  const router = useRouter()
  const defaultDomain = isDomain(recommendedDomain) ? recommendedDomain : DOMAINS[0]

  const [selectedDomain, setSelectedDomain] = useState<Domain>(defaultDomain)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState("")

  const selected =
    scores.find((s) => s.domain === selectedDomain) ??
    scores.find((s) => s.domain === recommendedDomain) ??
    scores[0]

  const domainNotes: Record<Domain, string> = {
    Emotional:
      "This area reflects the emotional weight of living with diabetes — feeling overwhelmed, discouraged, or mentally exhausted.",
    Regimen:
      "This area reflects the pressure of routines like medications, blood sugar checks, meal planning, and day-to-day self-management.",
    Physician:
      "This area reflects concerns about healthcare support, communication, and whether your diabetes care feels clear and helpful.",
    Interpersonal:
      "This area reflects support from family and friends, and whether diabetes feels understood by people around you.",
  }

  async function handleConfirm() {
    if (confirming) return

    setConfirming(true)
    setError("")

    const result = await confirmDomain(selectedDomain)

    if (result?.error) {
      setError(result.error)
      setConfirming(false)
      return
    }

    router.push("/check-in")
  }

  return (
    <section className="rounded-[32px] border border-black/[0.06] bg-[#fefdfb] p-7 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/35">
            Recommended focus
          </p>
          <h2
            className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-black/85"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Confirm your starting domain
          </h2>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-black/50">
            Based on your DDS results, we recommend{" "}
            <span className="font-medium text-black/70">{recommendedDomain}</span>.
            You can keep this recommendation or choose another focus area.
          </p>
        </div>

        <span className="rounded-full border border-[#e7dac8] bg-[#f6efe4] px-3 py-1.5 text-[11px] font-medium text-[#8B6F47]">
          Recommended: {recommendedDomain}
        </span>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {DOMAINS.map((domain) => {
          const scoreItem = scores.find((s) => s.domain === domain)
          const isSelected = selectedDomain === domain
          const isRecommended = domain === recommendedDomain

          return (
            <button
              key={domain}
              type="button"
              onClick={() => setSelectedDomain(domain)}
              disabled={confirming}
              className={[
                "rounded-[22px] border p-4 text-left transition-all",
                isSelected
                  ? "border-[#1f1a17] bg-[#faf7f2] shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
                  : "border-black/[0.08] bg-white hover:border-[#8B6F47]/30 hover:bg-[#fefdfb]",
                confirming ? "cursor-not-allowed opacity-70" : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xl">{scoreItem?.emoji ?? "•"}</span>
                    <span className="text-[14px] font-semibold text-black/80">
                      {scoreItem?.label ?? domain}
                    </span>
                    {isRecommended && (
                      <span className="rounded-full bg-[#1f1a17] px-2 py-0.5 text-[10px] font-medium text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] leading-6 text-black/50">{domainNotes[domain]}</p>
                </div>

                {scoreItem && (
                  <div className="shrink-0 text-right">
                    <p className="text-[18px] font-semibold text-black/75">
                      {scoreItem.score.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-black/35">/ 6.0</p>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-black/[0.06] bg-[linear-gradient(180deg,#fffdf9_0%,#faf6ef_100%)] p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ${selected.softBg} text-2xl`}
            >
              {selected.emoji}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-black/85">
                  {selected.label}
                </h3>

                {selectedDomain === recommendedDomain && (
                  <span className="rounded-full bg-[#1f1a17] px-2.5 py-1 text-[11px] font-medium text-white">
                    Recommended
                  </span>
                )}
              </div>

              <p className="text-[14px] leading-7 text-black/55">{domainNotes[selectedDomain]}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[22px] border border-black/[0.06] bg-white/70 p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[12px] font-medium text-black/45">Domain score</p>
              <p className="text-[13px] font-medium text-black/65">
                {selected.score.toFixed(1)} / 6.0
              </p>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#8B6F47,#B08968)]"
                style={{ width: `${(selected.score / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-black/[0.06] bg-[#fbf8f4] p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-black/35">
            What happens next
          </p>

          <div className="mt-5 space-y-4">
            {[
              {
                title: "Start where the score is highest",
                text: "Your highest scoring domain is usually the best place to begin because it may be contributing most to your current distress.",
              },
              {
                title: "Use this as a guide, not a label",
                text: "This recommendation helps focus support. It does not define your whole experience.",
              },
              {
                title: "Weekly support can build from here",
                text: "Your selected focus area can guide reflection prompts and support strategies.",
              },
            ].map((item, index) => (
              <div key={item.title} className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1e8da] text-[11px] font-semibold text-[#8B6F47]">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-black/75">{item.title}</h4>
                  <p className="mt-1 text-[13px] leading-6 text-black/50">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="fixed bottom-10 left-0 right-0 z-50 mx-auto max-w-6xl rounded-[22px] border border-black/[0.06] bg-[#fefdfb]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
          <p className="text-center text-[12px] leading-6 text-black/55 sm:text-left">
            <span className="font-medium text-black/70">Selected focus:</span>{" "}
            {selected.label}. Confirm to begin your personalized check-ins.
          </p>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirming}
            className="shrink-0 rounded-[18px] bg-[#1f1a17] px-6 py-3 text-sm font-medium text-white shadow-[0_6px_16px_rgba(31,26,23,0.18)] transition hover:bg-[#2a231f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirming
              ? "Confirming..."
              : `Start my ${selected.shortLabel} check-in →`}
          </button>
        </div>
      </div>

      <div className="mt-8 pb-24">
        <p className="text-[13px] text-black/45">
          You&apos;re ready to begin your personalized weekly check-ins once you confirm
          your focus domain.
        </p>
      </div>
    </section>
  )
}
