"use client"

import { useEffect, useRef, useState } from "react"

const CARDS = [
  {
    tag: "What",
    headline: "A 28-day emotional support study",
    body: "AIDES-T2D is a clinical research study exploring how AI-driven emotional support can reduce diabetes distress for people living with Type 2 Diabetes. Participants complete daily check-ins and receive personalized support from Stampley, an AI companion.",
    emoji: "🔬",
    accent: "rgba(92,92,92,0.08)",
    accentBorder: "rgba(92,92,92,0.12)",
  },
  {
    tag: "How",
    headline: "Daily check-ins, personalized by AI",
    body: "Each day takes about 5 minutes. You rate your distress, mood, and energy, reflect on your day, and receive a tailored response from Stampley — including a micro-skill, an educational insight, and a compassionate message built around your weekly focus domain.",
    emoji: "💙",
    accent: "rgba(61,90,128,0.07)",
    accentBorder: "rgba(61,90,128,0.13)",
  },
  {
    tag: "Who",
    headline: "Adults living with Type 2 Diabetes",
    body: "You may be eligible if you are 18 or older, have been diagnosed with Type 2 Diabetes, own a smartphone with internet access, and are comfortable using apps. No clinical experience is required — just a willingness to check in daily for 28 days.",
    emoji: "🤝",
    accent: "rgba(124,106,82,0.07)",
    accentBorder: "rgba(124,106,82,0.13)",
  },
]

function useInView(threshold = 0.15) {
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

export default function WhatIsSection() {
  const { ref, inView } = useInView()

  return (
    <section
      id="about"
      className="relative px-6 md:px-12 py-24 md:py-32"
      style={{ background: "linear-gradient(160deg, #f5f2ec 0%, #f0ede6 100%)" }}
    >
      {/* Section label */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-black/15" />
          <span
            className="text-[9.5px] uppercase tracking-[0.3em]"
            style={{
              color: "rgba(10,10,5,0.32)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            About the study
          </span>
        </div>

        {/* Headline */}
        <div className="max-w-2xl mb-16">
          <h2
            className="text-[36px] md:text-[48px] font-light leading-[1.1] tracking-[-0.025em] mb-4"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              color: "rgba(10,10,5,0.75)",
            }}
          >
            What is{" "}
            <em className="italic font-light" style={{ color: "rgba(10,10,5,0.28)" }}>
              AIDES-T2D?
            </em>
          </h2>
          <p
            className="text-[15px] font-light leading-[1.75]"
            style={{ color: "rgba(10,10,5,0.42)" }}
          >
            A research-backed platform designed around one insight: emotional
            distress is one of the biggest barriers to managing diabetes well —
            and almost no one talks about it.
          </p>
        </div>

        {/* Cards grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {CARDS.map((card, i) => (
            <div
              key={card.tag}
              className="relative rounded-[24px] p-7 flex flex-col gap-4 transition-all duration-700"
              style={{
                background: `linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)`,
                border: `1.5px solid ${card.accentBorder}`,
                boxShadow: "0 2px 16px rgba(10,10,5,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl"
                  style={{
                    background: card.accent,
                    border: `1px solid ${card.accentBorder}`,
                  }}
                >
                  {card.emoji}
                </div>
                <span
                  className="text-[9px] uppercase tracking-[0.24em] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    color: "rgba(10,10,5,0.3)",
                    background: "rgba(10,10,5,0.04)",
                    border: "1px solid rgba(10,10,5,0.07)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {card.tag}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3
                  className="text-[18px] font-medium leading-snug mb-3"
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    color: "rgba(10,10,5,0.75)",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {card.headline}
                </h3>
                <p
                  className="text-[13px] font-light leading-[1.75]"
                  style={{ color: "rgba(10,10,5,0.45)" }}
                >
                  {card.body}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-8 right-8 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${card.accentBorder}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Bottom stat strip */}
        <div
          className="mt-10 rounded-[20px] px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{
            background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
            border: "1.5px solid rgba(10,10,5,0.07)",
            boxShadow: "0 2px 12px rgba(10,10,5,0.03), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {[
            { value: "4", label: "Focus domains", sub: "Emotional · Regimen · Physician · Interpersonal" },
            { value: "28", label: "Study days", sub: "Daily check-ins over 4 weeks" },
            { value: "DDS-17", label: "Validated scale", sub: "Diabetes Distress Scale scoring" },
            { value: "GPT-4o", label: "AI backbone", sub: "Clinically constrained responses" },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[26px] font-light leading-none"
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    color: "rgba(10,10,5,0.68)",
                  }}
                >
                  {stat.value}
                </span>
              </div>
              <span
                className="text-[10px] uppercase tracking-[0.16em] font-semibold"
                style={{
                  color: "rgba(10,10,5,0.4)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {stat.label}
              </span>
              <span
                className="text-[11.5px] font-light leading-snug"
                style={{ color: "rgba(10,10,5,0.3)" }}
              >
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}