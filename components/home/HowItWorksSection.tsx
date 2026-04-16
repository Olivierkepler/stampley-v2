"use client"

import { useEffect, useRef, useState } from "react"

const STEPS = [
  {
    number: "01",
    title: "Register with your Study ID",
    description: "You'll receive a unique Study ID from the research team. Use it to create your account and begin your baseline assessments.",
    detail: "Takes ~10 minutes",
    icon: "🔑",
    accent: "rgba(92,92,92,0.08)",
  },
  {
    number: "02",
    title: "Complete baseline surveys",
    description: "Answer questions about your diabetes history, emotional wellbeing, and technology preferences. This helps us personalize your experience.",
    detail: "PHQ-2 · GAD-2 · DDS-17",
    icon: "📋",
    accent: "rgba(124,106,82,0.08)",
  },
  {
    number: "03",
    title: "Daily check-ins",
    description: "Each day, spend about 5 minutes rating your distress, mood, and energy — then reflect on what shaped your day with diabetes.",
    detail: "5 min/day · 28 days",
    icon: "📊",
    accent: "rgba(90,107,90,0.08)",
  },
  {
    number: "04",
    title: "Receive support from Stampley",
    description: "After each check-in, Stampley generates a personalized response — validating how you feel, offering a micro-skill, and providing a gentle reflection prompt.",
    detail: "Powered by GPT-4o",
    icon: "💙",
    accent: "rgba(61,90,128,0.08)",
  },
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export default function HowItWorksSection() {
  const { ref, inView } = useInView()

  return (
    <section
      id="how"
      className="relative px-6 md:px-12 py-24 md:py-32"
      style={{ background: "linear-gradient(160deg, #fefdfb 0%, #f5f2ec 100%)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Label + headline */}
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-black/15" />
          <span
            className="text-[9.5px] uppercase tracking-[0.3em]"
            style={{
              color: "rgba(10,10,5,0.32)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            How it works
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2
            className="text-[36px] md:text-[48px] font-light leading-[1.1] tracking-[-0.025em] max-w-lg"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              color: "rgba(10,10,5,0.75)",
            }}
          >
            Four steps,{" "}
            <em className="italic font-light" style={{ color: "rgba(10,10,5,0.28)" }}>
              28 days
            </em>
          </h2>
          <p
            className="text-[14px] font-light leading-[1.7] max-w-sm"
            style={{ color: "rgba(10,10,5,0.4)" }}
          >
            The study is designed to fit into your life — not the other way around.
            Each step builds naturally on the last.
          </p>
        </div>

        {/* Steps */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative rounded-[24px] p-7 flex gap-5 transition-all duration-700 group"
              style={{
                background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                border: "1.5px solid rgba(10,10,5,0.07)",
                boxShadow: "0 2px 16px rgba(10,10,5,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Step number */}
              <div className="shrink-0 flex flex-col items-center gap-3 pt-1">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xl"
                  style={{
                    background: step.accent,
                    border: "1px solid rgba(10,10,5,0.07)",
                  }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-[10px] font-bold tracking-[0.1em]"
                  style={{
                    color: "rgba(10,10,5,0.18)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3
                    className="text-[16px] font-medium leading-snug"
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      color: "rgba(10,10,5,0.72)",
                      letterSpacing: "-0.012em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <span
                    className="shrink-0 text-[9px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
                    style={{
                      color: "rgba(10,10,5,0.3)",
                      background: "rgba(10,10,5,0.04)",
                      border: "1px solid rgba(10,10,5,0.07)",
                      fontFamily: "'JetBrains Mono', monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.detail}
                  </span>
                </div>
                <p
                  className="text-[13px] font-light leading-[1.72]"
                  style={{ color: "rgba(10,10,5,0.43)" }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Connector arrow */}
        <div className="flex items-center justify-center mt-10 gap-3">
          {["Register", "Baseline", "Check-ins", "Stampley"].map((label, i, arr) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="px-4 py-2 rounded-full text-[11px] font-medium"
                style={{
                  background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                  border: "1px solid rgba(10,10,5,0.09)",
                  color: "rgba(10,10,5,0.45)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </div>
              {i < arr.length - 1 && (
                <span
                  className="text-[12px]"
                  style={{ color: "rgba(10,10,5,0.18)" }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}