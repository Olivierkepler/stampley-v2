"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function DiabetesNumbersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.25 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-blue-900 px-5 py-16 text-white sm:px-6 md:px-12 md:py-20 lg:px-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        {/* Left Content */}
        <div
          className={`relative z-10 transition-all duration-700 ease-out ${
            inView
              ? "translate-x-0 opacity-100"
              : "-translate-x-8 opacity-0 md:-translate-x-12"
          }`}
        >
          <h2 className="mb-5 text-3xl font-light tracking-wide sm:text-4xl md:mb-6 md:text-4xl">
            Diabetes Distress <br />
            By-the-Numbers
          </h2>

          <p className="mb-10 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:mb-12 md:text-xl">
            Millions of people living with Type 2 Diabetes experience emotional
            exhaustion, burnout, and distress every day — yet emotional support
            remains one of the most overlooked parts of diabetes care.
          </p>

          <div className="mb-12 grid gap-6 sm:grid-cols-3 sm:gap-8 md:mb-14">
            {[
              ["28", "days of personalized emotional support"],
              ["~5", "minutes per daily check-in"],
              ["4", "core diabetes distress domains explored"],
            ].map(([value, label], index) => (
              <div
                key={value}
                className={`transition-all duration-700 ease-out ${
                  inView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: inView ? `${index * 120 + 200}ms` : "0ms",
                }}
              >
                <div className="mb-2 text-3xl font-light sm:text-4xl md:mb-3">
                  {value}
                </div>

                <p className="max-w-[190px] text-sm font-semibold leading-snug text-white/95 sm:max-w-[150px] sm:text-base">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:mb-10 md:text-xl">
            AIDES-T2D is exploring how compassionate AI-driven support can help
            reduce diabetes distress through daily reflection, emotional
            check-ins, and personalized encouragement from an AI companion
            called Stampley.
          </p>

          <div
            className={`flex flex-col gap-3 transition-all duration-700 ease-out sm:flex-row sm:flex-wrap sm:gap-5 ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{
              transitionDelay: inView ? "520ms" : "0ms",
            }}
          >
            <a
              href="/register"
              className="inline-flex justify-center bg-white px-7 py-3.5 text-center text-xs font-bold uppercase tracking-[0.14em] text-blue-900 transition hover:bg-white/90 sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.16em]"
            >
              Join the Study
            </a>

            <a
              href="#about"
              className="inline-flex justify-center border-2 border-white px-7 py-3.5 text-center text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-blue-900 sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.16em]"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Card */}
        <div
          className={`relative z-10 transition-all duration-700 ease-out ${
            inView
              ? "translate-y-0 opacity-100 lg:translate-x-8"
              : "translate-y-10 opacity-0 lg:translate-x-20"
          }`}
        >
          <div className="overflow-hidden bg-white text-slate-900 shadow-[0_18px_50px_rgba(0,0,0,0.22)] md:shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <div className="relative h-[230px] w-full overflow-hidden sm:h-[280px] md:h-[320px]">
              <Image
                src="/images/diabetics.jpg"
                alt="Person managing diabetes"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover transition-transform duration-[1200ms] ease-out ${
                  inView ? "scale-100" : "scale-110"
                }`}
              />
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <h3 className="mb-4 text-2xl font-normal sm:text-3xl md:text-4xl">
                Meet Stampley
              </h3>

              <p className="mb-7 text-base leading-relaxed text-slate-700 sm:text-lg md:mb-8 md:text-xl">
                Stampley is an AI companion designed to provide compassionate
                emotional support, daily encouragement, and reflective guidance
                throughout the 28-day AIDES-T2D study experience.
              </p>

              <a
                href="#about"
                className="inline-block border-b-2 border-blue-900 text-sm font-semibold tracking-[0.08em] text-blue-900 transition hover:text-blue-950 sm:text-base"
              >
                Explore the Study
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative arcs */}
      <div
        className={`pointer-events-none absolute bottom-[-140px] right-[18%] hidden h-[420px] w-[420px] rounded-full border-[8px] border-white/10 transition-all duration-1000 md:block ${
          inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none absolute bottom-[-180px] right-[14%] hidden h-[520px] w-[520px] rounded-full border-[4px] border-white/10 transition-all duration-1000 md:block ${
          inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      />
    </section>
  )
}