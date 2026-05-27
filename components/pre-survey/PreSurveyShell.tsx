"use client"

import Image from "next/image"

import PreSurveySidebar from "./PreSurveySidebar"

export default function PreSurveyShell({
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
        
        {/* Header */}
        <header className="border-b border-black/[0.06] bg-[#003e73] text-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-7xl items-center gap-4 py-5">
            
            <div className="flex h-13 w-13 shrink-0 items-center justify-center  bg-white backdrop-blur-sm">
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
              <p className="text-[10px] font-['Poppins', sans-serif]  uppercase tracking-[0.22em] text-white/70 leading-tight">
                AIDES-T2D Research Study
              </p>
              <h1 className="text-[20px] font-['Poppins', sans-serif] tracking-[-0.03em] text-white leading-tight">
                Participant Pre-Survey Form
              </h1>
              <p className="text-[13px] font-['Poppins', sans-serif]  leading-tight text-white/70">
              Help us understand your diabetes experience and support needs.
              </p>
            </div>

       
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[300px_1fr]">
            
            {/* Sidebar */}
            <aside className=" border border-black/[0.06] bg-white p-5 shadow-[0_4px_24px_rgba(10,10,15,0.04)]">
              <PreSurveySidebar currentStep={currentStep} />
            </aside>

            {/* Main Form */}
            <div className="overflow-hidden  border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(10,10,15,0.05)]">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}