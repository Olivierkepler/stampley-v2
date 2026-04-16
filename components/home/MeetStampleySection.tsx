"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FEATURES = [
  {
    emoji: "🪞",
    title: "Validates how you feel",
    description: "Stampley reads your check-in data and mirrors back what you're experiencing — without judgment.",
  },
  {
    emoji: "🧘",
    title: "Delivers a micro-skill",
    description: "Each session includes one evidence-based coping technique tailored to your weekly focus domain.",
  },
  {
    emoji: "💡",
    title: "Teaches through insight",
    description: "Short education chips explain the science behind what you're feeling — in plain language.",
  },
  {
    emoji: "🔒",
    title: "Clinically constrained",
    description: "Stampley never makes medical claims. Every response follows a strict 6-part clinical structure.",
  },
]

const DEMO_MESSAGES = [
  {
    id: "1",
    role: "assistant" as const,
    parts: [
      { text: "Hi Sarah, thank you for checking in today. This week we're focusing on Emotional Burden — and I can see today was a heavy one.", dim: false },
      { text: "You rated your distress at 8 out of 10. That's significant, and it makes complete sense given the work stress you mentioned on top of everything else you're managing.", dim: true },
      { text: "What part of today felt the most emotionally exhausting?", dim: false, bold: true },
    ],
    chips: ["🧘 Skill", "💡 Insight"],
  },
  {
    id: "2",
    role: "user" as const,
    text: "Honestly, trying to keep my blood sugar stable while dealing with a difficult conversation at work.",
  },
  {
    id: "3",
    role: "assistant" as const,
    parts: [
      { text: "That combination is genuinely hard — emotional stress directly affects blood sugar regulation, so you were dealing with both at once.", dim: false },
      { text: "For right now, try the 4-4-4 breath: in for 4, hold for 4, out for 4. Even one cycle can help reset your nervous system.", dim: true },
    ],
    chips: ["🧘 Skill", "💡 Insight"],
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

function ChatPreview() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [expandedChip, setExpandedChip] = useState<string | null>(null)

  useEffect(() => {
    if (visibleMessages >= DEMO_MESSAGES.length) return
    const timer = setTimeout(() => {
      setVisibleMessages(v => v + 1)
    }, visibleMessages === 0 ? 600 : 1400)
    return () => clearTimeout(timer)
  }, [visibleMessages])

  return (
    <div
      className="relative rounded-[28px] overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #fefdfb 0%, #f5f2ec 100%)",
        border: "1.5px solid rgba(10,10,5,0.08)",
        boxShadow: "0 24px 60px rgba(10,10,5,0.1), 0 4px 16px rgba(10,10,5,0.06)",
      }}
    >
      {/* Chat header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          borderBottom: "1px solid rgba(10,10,5,0.06)",
          background: "rgba(254,253,251,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center text-base"
          style={{
            background: "linear-gradient(160deg, #fefdfb, #f9f6f1)",
            border: "1px solid rgba(10,10,5,0.08)",
          }}
        >
          💙
        </div>
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.16em] font-semibold"
            style={{
              color: "rgba(10,10,5,0.5)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Stampley
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "rgba(90,107,90,0.6)" }}
            />
            <span
              className="text-[9px] uppercase tracking-[0.14em]"
              style={{
                color: "rgba(10,10,5,0.3)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Active session
            </span>
          </div>
        </div>

        {/* Window dots */}
        <div className="ml-auto flex items-center gap-1.5">
          {["rgba(244,63,94,0.4)", "rgba(245,158,11,0.4)", "rgba(16,185,129,0.4)"].map((bg, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: bg }} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="px-5 py-5 space-y-4 min-h-[320px]">
        <AnimatePresence>
          {DEMO_MESSAGES.slice(0, visibleMessages).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "user" ? (
                <div
                  className="max-w-[78%] px-4 py-3 rounded-[16px] rounded-tr-[4px] text-[13px] font-light leading-relaxed"
                  style={{
                    background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                    border: "1px solid rgba(10,10,5,0.09)",
                    color: "rgba(10,10,5,0.72)",
                    boxShadow: "0 1px 4px rgba(10,10,5,0.05)",
                  }}
                >
                  {msg.text}
                </div>
              ) : (
                <div className="flex gap-2.5 w-full max-w-[100%]">
                  <div
                    className="shrink-0 w-7 h-7 rounded-[8px] flex items-center justify-center text-sm mt-0.5"
                    style={{
                      background: "linear-gradient(160deg, #fefdfb, #f9f6f1)",
                      border: "1px solid rgba(10,10,5,0.08)",
                    }}
                  >
                    💙
                  </div>
                  <div className="flex-1 space-y-2">
                    {msg.parts?.map((part, pi) => (
                      <p
                        key={pi}
                        className="text-[13px] leading-[1.7]"
                        style={{
                          color: part.dim
                            ? "rgba(10,10,5,0.45)"
                            : "rgba(10,10,5,0.75)",
                          fontWeight: part.bold ? 500 : 300,
                          fontFamily: "'Outfit', system-ui, sans-serif",
                        }}
                      >
                        {part.text}
                      </p>
                    ))}

                    {/* Chips */}
                    {msg.chips && (
                      <div className="flex gap-1.5 pt-1">
                        {msg.chips.map(chip => (
                          <button
                            key={chip}
                            onClick={() =>
                              setExpandedChip(
                                expandedChip === `${msg.id}-${chip}` ? null : `${msg.id}-${chip}`
                              )
                            }
                            className="px-2.5 py-1 rounded-full text-[10px] transition-all duration-200"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              background: expandedChip === `${msg.id}-${chip}`
                                ? "rgba(10,10,5,0.07)"
                                : "transparent",
                              border: "1px solid rgba(10,10,5,0.09)",
                              color: "rgba(10,10,5,0.38)",
                            }}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Chip expansion */}
                    <AnimatePresence>
                      {msg.chips?.map(chip =>
                        expandedChip === `${msg.id}-${chip}` ? (
                          <motion.div
                            key={chip}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="rounded-[12px] p-3 mt-1"
                              style={{
                                background: "linear-gradient(160deg, #fefdfb, #f9f6f1)",
                                border: "1px solid rgba(10,10,5,0.07)",
                              }}
                            >
                              <p
                                className="text-[12px] font-light leading-relaxed"
                                style={{ color: "rgba(10,10,5,0.5)" }}
                              >
                                {chip.includes("Skill")
                                  ? "4-4-4 Box Breathing — breathe in for 4 counts, hold for 4, breathe out for 4. Repeat twice."
                                  : "Emotional burden is the most common form of diabetes distress — affecting up to 36% of people with T2DM."}
                              </p>
                            </div>
                          </motion.div>
                        ) : null
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {visibleMessages < DEMO_MESSAGES.length && visibleMessages > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center text-sm"
              style={{
                background: "linear-gradient(160deg, #fefdfb, #f9f6f1)",
                border: "1px solid rgba(10,10,5,0.08)",
                opacity: 0.5,
              }}
            >
              💙
            </div>
            <div className="flex items-center gap-1 px-3 py-2 rounded-full" style={{ background: "rgba(10,10,5,0.04)" }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "rgba(10,10,5,0.25)" }}
                  animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderTop: "1px solid rgba(10,10,5,0.06)" }}
      >
        <div
          className="flex-1 px-4 py-2.5 rounded-[14px] text-[12.5px] font-light"
          style={{
            background: "rgba(10,10,5,0.03)",
            border: "1px solid rgba(10,10,5,0.07)",
            color: "rgba(10,10,5,0.25)",
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          Reply to Stampley…
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(10,10,5,0.06)",
            color: "rgba(10,10,5,0.2)",
          }}
        >
          ↑
        </div>
      </div>
    </div>
  )
}

export default function MeetStampleySection() {
  const { ref, inView } = useInView()

  return (
    <section
      id="stampley"
      className="relative px-6 md:px-12 py-24 md:py-32"
      style={{ background: "linear-gradient(160deg, #f0ede6 0%, #ebe7df 100%)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-black/15" />
          <span
            className="text-[9.5px] uppercase tracking-[0.3em]"
            style={{
              color: "rgba(10,10,5,0.32)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Meet Stampley
          </span>
        </div>

        {/* Two-col layout */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — description */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <h2
              className="text-[36px] md:text-[48px] font-light leading-[1.1] tracking-[-0.025em] mb-6"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                color: "rgba(10,10,5,0.75)",
              }}
            >
              Not a chatbot.
              <br />
              A{" "}
              <em className="italic font-light" style={{ color: "rgba(10,10,5,0.3)" }}>
                companion.
              </em>
            </h2>

            <p
              className="text-[15px] font-light leading-[1.78] mb-8"
              style={{ color: "rgba(10,10,5,0.45)" }}
            >
              Stampley is a structured AI companion — not a free-form chatbot.
              Every response follows a clinically designed 6-part framework,
              ensuring you always receive validation, a reflection prompt,
              a coping skill, and an educational insight. Safe. Predictable. Warm.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="flex gap-4 transition-all duration-500"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-12px)",
                    transitionDelay: `${200 + i * 80}ms`,
                  }}
                >
                  <div
                    className="shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center text-base mt-0.5"
                    style={{
                      background: "linear-gradient(160deg, #fefdfb, #f9f6f1)",
                      border: "1px solid rgba(10,10,5,0.08)",
                    }}
                  >
                    {f.emoji}
                  </div>
                  <div>
                    <p
                      className="text-[14px] font-medium mb-0.5"
                      style={{
                        color: "rgba(10,10,5,0.68)",
                        fontFamily: "'Fraunces', Georgia, serif",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {f.title}
                    </p>
                    <p
                      className="text-[12.5px] font-light leading-relaxed"
                      style={{ color: "rgba(10,10,5,0.4)" }}
                    >
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Not a replacement note */}
            <div
              className="mt-8 rounded-[16px] px-4 py-3.5 flex items-start gap-3"
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(10,10,5,0.08)",
              }}
            >
              <span className="text-sm shrink-0 mt-0.5">⚠️</span>
              <p
                className="text-[12px] font-light leading-relaxed"
                style={{ color: "rgba(10,10,5,0.42)" }}
              >
                Stampley is a research tool and emotional support companion —
                not a substitute for professional medical or mental health care.
                Always consult your healthcare provider for medical decisions.
              </p>
            </div>
          </div>

          {/* Right — live chat preview */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              transitionDelay: "150ms",
            }}
          >
            <ChatPreview />

            {/* Caption */}
            <p
              className="text-center text-[10px] uppercase tracking-[0.18em] mt-4"
              style={{
                color: "rgba(10,10,5,0.22)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Live preview — messages animate automatically
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}