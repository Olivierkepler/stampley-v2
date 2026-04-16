"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const ELIGIBILITY = [
  { met: true, label: "18 years of age or older" },
  { met: true, label: "Diagnosed with Type 2 Diabetes" },
  { met: true, label: "Own a smartphone with internet access" },
  { met: true, label: "Comfortable using mobile apps" },
  { met: true, label: "Able to read and write in English" },
  { met: false, label: "Currently under psychiatric care for severe mental illness" },
  { met: false, label: "Enrolled in another diabetes intervention study" },
]

const COMMITMENT = [
  {
    icon: "📅",
    value: "28",
    unit: "days",
    label: "Study duration",
    description: "4 weeks of daily check-ins",
  },
  {
    icon: "⏱️",
    value: "~5",
    unit: "min",
    label: "Per check-in",
    description: "Quick, focused, daily",
  },
  {
    icon: "📊",
    value: "1×",
    unit: "baseline",
    label: "At enrollment",
    description: "Demographics + DDS-17 survey",
  },
  {
    icon: "🔔",
    value: "≤3",
    unit: "reminders",
    label: "Per week",
    description: "Optional, at your preferred time",
  },
]

const PRIVACY = [
  {
    emoji: "🔐",
    title: "Your data is encrypted",
    description:
      "All responses are stored on a secure, encrypted database. Only the research team can access de-identified data.",
  },
  {
    emoji: "🚫",
    title: "No data is sold",
    description:
      "Your information is never sold or shared with third parties. It is used solely for this research study.",
  },
  {
    emoji: "📋",
    title: "IRB approved",
    description:
      "This study has been reviewed and approved by the Institutional Review Board at the University of Massachusetts Boston.",
  },
  {
    emoji: "🚪",
    title: "Withdraw anytime",
    description:
      "Participation is completely voluntary. You may withdraw at any time without penalty or loss of benefits.",
  },
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

export default function StudyDetailsSection() {
  const { ref: eligRef, inView: eligInView } = useInView()
  const { ref: commitRef, inView: commitInView } = useInView()
  const { ref: privRef, inView: privInView } = useInView()

  return (
    <section
      id="details"
      className="relative px-6 md:px-12 py-24 md:py-32"
      style={{ background: "linear-gradient(160deg, #fefdfb 0%, #f5f2ec 100%)" }}
    >
      <div className="max-w-6xl mx-auto space-y-20">

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-black/15" />
            <span className="text-[9.5px] uppercase tracking-[0.3em] text-black/30 font-mono">
              Study details
            </span>
          </div>

          <h2 className="text-[36px] md:text-[48px] font-light tracking-tight max-w-xl text-black/75">
            Everything you need{" "}
            <em className="italic text-black/30">to know</em>
          </h2>
        </div>

        {/* ELIGIBILITY RIGHT CARD (FIXED AREA) */}
        <div ref={eligRef}>
          <div className="rounded-[24px] p-8 flex flex-col gap-6 bg-[#fefdfb] border border-black/10 shadow-sm">

            <div>
              <p className="text-xs uppercase tracking-widest text-black/40 mb-2">
                Ready to participate?
              </p>

              <h3 className="text-[24px] font-light text-black/75 mb-2">
                Join the study with your <em>Study ID</em>
              </h3>

              <p className="text-sm text-black/50 leading-relaxed">
                Participation is free and voluntary. You will receive a Study ID from the research team.
                Contact us at{" "}
                <a
                  href="mailto:pcrg@umb.edu"
                  className="underline hover:opacity-70"
                >
                  pcrg@umb.edu
                </a>{" "}
                to express interest.
              </p>
            </div>

            {/* STEPS */}
            <div className="space-y-2">
              {[
                "Contact the research team",
                "Receive your Study ID",
                "Register and complete baseline",
                "Begin your 28-day journey",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <p className="text-sm text-black/60">{step}</p>
                </div>
              ))}
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col gap-3">
              <Link
                href="/register"
                className="w-full py-3 rounded-xl bg-black text-white text-sm text-center hover:opacity-90 transition"
              >
                Register with Study ID →
              </Link>

              <a
                href="mailto:pcrg@umb.edu"
                className="w-full py-3 rounded-xl border border-black/20 text-center text-sm text-black/60 hover:bg-black/5 transition"
              >
                Contact the research team
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}