"use client"

import Image from "next/image"
import PostSurveySidebar from "./PostSurveySidebar"

export default function PostSurveyShell({
  currentStep,
  children,
}: {
  currentStep: number
  children: React.ReactNode
}) {
  return (
    <main
      className="min-h-screen bg-[#f8fafc]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="mx-auto flex min-h-screen flex-col">
        <header className="border-b border-black/[0.06] bg-[#003e73] text-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-5 md:px-6">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center bg-white backdrop-blur-sm">
              <Image
                src="/images/stampleyLogo.png"
                alt="AIDES-T2D"
                width={30}
                height={30}
                className="h-auto w-auto object-contain"
                priority
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-['Poppins',sans-serif] uppercase leading-tight tracking-[0.22em] text-white/70">
                AIDES-T2D Research Study
              </p>
              <h1 className="text-[20px] font-['Poppins',sans-serif] leading-tight tracking-[-0.03em] text-white">
                Post-Study Survey
              </h1>
              <p className="text-[13px] font-['Poppins',sans-serif] leading-tight text-white/70">
                Share your experience after completing the 4-week study.
              </p>
            </div>
          </div>
        </header>

        <section className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="border border-black/[0.06] bg-white p-5 shadow-[0_4px_24px_rgba(10,10,15,0.04)]">
              <PostSurveySidebar currentStep={currentStep} />
            </aside>

            <div className="overflow-hidden border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(10,10,15,0.05)]">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
