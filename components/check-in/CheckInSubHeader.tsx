"use client"

import { useCheckInStore } from "@/store/checkin-store"
import DonutProgress from "@/components/dashboard/DonutProgress"
import { computeWellnessPercent } from "@/lib/wellness-score"

type CheckInSubHeaderProps = {
  eyebrow: string
  title: string
  description: string
}

export default function CheckInSubHeader({
  eyebrow,
  title,
  description,
}: CheckInSubHeaderProps) {
  const { distress, mood, energy } = useCheckInStore()

  const wellness = computeWellnessPercent(distress, mood, energy)

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-[#003e73] px-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-28 max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
            {eyebrow}
          </p>

          <h1 className="mt-1 text-[clamp(1.35rem,3vw,2rem)] font-medium tracking-[-0.03em] text-white">
            {title}
          </h1>

          <p
            className="mt-2 max-w-md text-[18px] leading-[1.5] text-white/75"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {description}
          </p>
        </div>

        <div className="hidden shrink-0 origin-right scale-[0.58] sm:block">
          <DonutProgress
            percent={wellness}
            completed={wellness}
            total={100}
            label="Wellness"
            bgColor="#003e73"
          />
        </div>
      </div>
    </div>
  )
}
