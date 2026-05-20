"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function StampleySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.2,
      }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-6 py-20 md:px-12 lg:px-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Image */}
        <div
          className={`relative transition-all duration-700 ease-out ${
            inView
              ? "translate-x-0 opacity-100"
              : "-translate-x-12 opacity-0"
          }`}
        >
          {/* Decorative Lines */}
          <div
            className={`pointer-events-none absolute -left-16 -top-10 h-[430px] w-[180px] rounded-full border-l-[6px] border-cyan-100/70 transition-all duration-1000 ${
              inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />

          <div
            className={`pointer-events-none absolute -left-10 -top-10 h-[430px] w-[180px] rounded-full border-l-[3px] border-cyan-100/70 transition-all duration-1000 delay-100 ${
              inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />

          <div
            className={`pointer-events-none absolute -left-4 -top-10 h-[430px] w-[180px] rounded-full border-l-[3px] border-cyan-100/70 transition-all duration-1000 delay-200 ${
              inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />

          <div className="relative h-[360px] w-full max-w-[620px] overflow-hidden bg-slate-100 md:h-[460px]">
            <Image
              src="/images/sections/chatstampley.jpg"
              alt="Person using AI companion"
              fill
              className={`object-cover grayscale transition-all duration-[1400ms] ease-out ${
                inView ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <div
          className={`max-w-xl transition-all duration-700 ease-out lg:pl-8 ${
            inView
              ? "translate-x-0 opacity-100"
              : "translate-x-12 opacity-0"
          }`}
        >
          <p
            className={`mb-6 text-xs font-bold uppercase tracking-[0.35em] text-cyan-700 transition-all duration-700 ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            Meet Stampley
          </p>

          <h2
            className={`mb-6 text-4xl font-light leading-tight tracking-[-0.03em] text-slate-950 transition-all duration-700 delay-100 md:text-5xl ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            Not a Chatbot,
            <br />
            A Companion.
          </h2>

          <p
            className={`mb-10 text-lg leading-relaxed text-slate-600 transition-all duration-700 delay-200 md:text-xl ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            Stampley is a structured AI companion — not a free-form chatbot.
            Every response follows a clinically designed 6-part framework,
            ensuring you always receive validation, a reflection prompt, a
            coping skill, and an educational insight. Safe. Predictable. Warm.
          </p>

          <div
            className={`transition-all duration-700 delay-300 ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <Link
              href="#"
              className="inline-flex bg-blue-900 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-950"
            >
              Explore Stampley
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}