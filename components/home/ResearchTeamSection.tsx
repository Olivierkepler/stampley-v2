"use client"

import { useEffect, useRef, useState } from "react"

const TEAM = [
  {
    initials: "OP",
    name: "Olivier Pierre-Louis",
    role: "Principal Investigator",
    credentials: "PhD Candidate · UMass Boston",
    department: "College of Nursing & Health Sciences",
    focus: "Diabetes distress · AI-driven support · T2DM outcomes",
  },
  {
    initials: "MB",
    name: "Research Team",
    role: "PCRG Lab",
    credentials: "Patient-Centered Research Group",
    department: "University of Massachusetts Boston",
    focus: "Patient-centered outcomes · Digital health · Chronic illness",
  },
]

const INSTITUTIONS = [
  {
    abbr: "UMass",
    full: "University of Massachusetts Boston",
    detail: "College of Nursing & Health Sciences",
    emoji: "🏛️",
  },
  {
    abbr: "PCRG",
    full: "Patient-Centered Research Group",
    detail: "Health outcomes & digital therapeutics",
    emoji: "🔬",
  },
  {
    abbr: "IRB",
    full: "Institutional Review Board",
    detail: "Ethics approved · Protocol reviewed",
    emoji: "✅",
  },
]

const PUBLICATIONS = [
  {
    tag: "Foundation",
    title: "Diabetes Distress Scale (DDS-17)",
    authors: "Polonsky et al.",
    year: "2005",
    journal: "Diabetes Care",
  },
  {
    tag: "Methodology",
    title: "AI-assisted chronic disease self-management",
    authors: "Ding et al.",
    year: "2023",
    journal: "NPJ Digital Medicine",
  },
  {
    tag: "Evidence",
    title: "Emotional burden in T2DM: prevalence and outcomes",
    authors: "Fisher et al.",
    year: "2022",
    journal: "Diabetic Medicine",
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

export default function ResearchTeamSection() {
  const { ref: teamRef, inView: teamInView } = useInView()
  const { ref: instRef, inView: instInView } = useInView()
  const { ref: pubRef, inView: pubInView } = useInView()

  return (
    <section
      id="team"
      className="relative px-6 md:px-12 py-24 md:py-32"
      style={{ background: "linear-gradient(160deg, #f0ede6 0%, #ebe7df 100%)" }}
    >
      <div className="max-w-6xl mx-auto space-y-20">

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-black/15" />
            <span className="text-[9.5px] uppercase tracking-[0.3em] text-black/30 font-mono">
              Research team
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-[36px] md:text-[48px] font-light max-w-xl text-black/75">
              Built by researchers,{" "}
              <em className="italic text-black/30">for patients.</em>
            </h2>

            <p className="text-[14px] font-light leading-[1.7] max-w-sm text-black/40">
              AIDES-T2D was developed at the University of Massachusetts Boston
              by a team dedicated to improving patient-centered outcomes in
              chronic illness care.
            </p>
          </div>
        </div>

        {/* TEAM */}
        <div ref={teamRef} className="grid md:grid-cols-2 gap-5">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className="rounded-[24px] p-7 flex gap-5 transition-all duration-700"
              style={{
                background: "#fefdfb",
                border: "1px solid rgba(0,0,0,0.07)",
                opacity: teamInView ? 1 : 0,
                transform: teamInView ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-black/5 text-sm font-semibold">
                {member.initials}
              </div>

              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-xs text-black/50 mb-2">
                  {member.role} · {member.credentials}
                </p>
                <p className="text-sm text-black/50">{member.department}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT STRIP */}
        <div className="rounded-[24px] px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#fefdfb] border border-black/10">
          
          <div>
            <p className="text-xs text-black/40 mb-2 uppercase tracking-wide">
              Questions about the study?
            </p>
            <h3 className="text-xl text-black/70">
              We'd love to hear from you.
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* EMAIL */}
            <a
              href="mailto:pcrg@umb.edu?subject=Study Inquiry - AIDES T2D"
              className="px-6 py-3 rounded-xl bg-black text-white text-sm text-center hover:opacity-90 transition"
            >
              📧 pcrg@umb.edu
            </a>

            {/* PHONE */}
            <a
              href="tel:6172874067"
              className="px-6 py-3 rounded-xl border border-black/20 text-black/60 text-sm text-center hover:bg-black/5 transition"
            >
              📞 (617) 287-4067
            </a>

          </div>
        </div>

      </div>
    </section>
  )
}