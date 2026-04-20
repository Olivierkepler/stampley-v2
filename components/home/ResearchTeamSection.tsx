"use client"

import { useEffect, useRef, useState } from "react"

const TEAM = [
  {
    initials: "OP",
    name: "Olivier Pierre-Louis",
    role: "Principal Investigator",
    credentials: "PhD Candidate · UMass Boston",
    department: "College of Nursing & Health Sciences",
  },
  {
    initials: "MB",
    name: "Research Team",
    role: "PCRG Lab",
    credentials: "Patient-Centered Research Group",
    department: "University of Massachusetts Boston",
  },
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

export default function ResearchTeamSection() {
  const { ref, inView } = useInView()

  return (
<section
  id="team"
  className="relative px-6 md:px-12 py-28 md:py-36"
  style={{
    background:
      "radial-gradient(circle at 20% 30%, rgba(180,140,60,0.06), transparent 40%), linear-gradient(160deg, #f4f1eb 0%, #ece7df 100%)",
  }}
>
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

    {/* LEFT — IMAGE */}
    <div className="relative">
      <div
        className=" overflow-hidden"
        
      >
        <img
          src="/images/hero/michelle.png"
          alt="Research Team"
          className="w-full h-full object-contain"
        />
      </div>

      {/* subtle overlay tint (optional, premium look) */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1), transparent 40%)",
        }}
      />
    </div>

    {/* RIGHT — CONTENT */}
    <div className="space-y-20">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-10 bg-black/15" />
          <span className="text-[9.5px] uppercase tracking-[0.32em] text-black/30 font-mono">
            Research team
          </span>
        </div>

        <h2 className="text-[38px] md:text-[52px] font-light leading-[1.05] tracking-[-0.02em] max-w-xl text-black/75 mb-6">
          Built by researchers,{" "}
          <em className="italic text-black/30">for patients.</em>
        </h2>

        <p className="text-[15px] font-light leading-[1.8] max-w-md text-black/40">
          AIDES-T2D was developed at the University of Massachusetts Boston
          by a team dedicated to improving patient-centered outcomes in
          chronic illness care.
        </p>
      </div>

      {/* TEAM CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        {TEAM.map((member, i) => (
          <div
            key={member.name}
            className="group relative rounded-[26px] p-8 flex gap-6 transition-all duration-700 hover:-translate-y-1"
            style={{
              background:
                "linear-gradient(160deg, #ffffff 0%, #f9f6f1 100%)",
              border: "1px solid rgba(10,10,5,0.06)",
              boxShadow:
                "0 10px 30px rgba(10,10,5,0.06), 0 2px 10px rgba(10,10,5,0.04)",
            }}
          >
            <div
              className="w-14 h-14 flex items-center justify-center rounded-xl text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {member.initials}
            </div>

            <div>
              <p className="text-[15px] font-medium text-black/80 mb-1">
                {member.name}
              </p>
              <p className="text-[12px] text-black/45 mb-3">
                {member.role} · {member.credentials}
              </p>
              <p className="text-[13px] text-black/50">
                {member.department}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTACT STRIP */}
      <div
        className="rounded-[26px] px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, #f9f6f1 100%)",
          border: "1px solid rgba(10,10,5,0.07)",
          boxShadow:
            "0 12px 36px rgba(10,10,5,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <div>
          <p className="text-[10px] text-black/40 mb-2 uppercase tracking-[0.22em]">
            Questions about the study
          </p>

          <h3 className="text-[22px] font-light text-black/75">
            We'd love to hear from you.
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:pcrg@umb.edu?subject=Study Inquiry - AIDES T2D"
            className="px-7 py-3.5 rounded-full bg-black text-white text-[13px] hover:-translate-y-[1px] transition"
          >
            📧 Email us
          </a>

          <a
            href="tel:6172874067"
            className="px-7 py-3.5 rounded-full border border-black/15 text-black/60 text-[13px] hover:bg-black/5 transition"
          >
            📞 Call us
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}