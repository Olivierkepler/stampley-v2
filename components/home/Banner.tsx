"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function StampleyBanner() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.25,
      }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#071224",
      }}
    >
      {/* Geometric Pattern */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          inView ? "opacity-[0.06]" : "opacity-0"
        }`}
        style={{
          backgroundImage: `
            linear-gradient(60deg, transparent 49.5%, #FFB100 49.5%, #FFB100 50.5%, transparent 50.5%),
            linear-gradient(-60deg, transparent 49.5%, #FFB100 49.5%, #FFB100 50.5%, transparent 50.5%)
          `,
          backgroundSize: "180px 180px",
        }}
      />

      {/* Animated Glow */}
      <div
        className={`absolute pointer-events-none transition-all duration-[1400ms] ease-out ${
          inView ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{
          left: "-10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(255,177,0,0.15) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-12 sm:px-10 md:py-14 lg:flex-row lg:items-center lg:gap-12 lg:px-16 lg:py-16">
        {/* Text */}
        <div
          className={`max-w-2xl transition-all duration-700 ease-out ${
            inView
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          {/* Label */}
          <div
            className={`mb-4 flex items-center gap-3 transition-all duration-700 ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="h-px w-10 bg-[#FFB100]/70" />

            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,177,0,0.9)",
              }}
            >
              AI Companion Support
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`mb-4 transition-all duration-700 ease-out ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
            style={{
              transitionDelay: "120ms",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(24px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.05em",
              color: "rgba(255,255,255,0.96)",
            }}
          >
            Meet{" "}
            <span style={{ color: "#FFB100", fontWeight: 500 }}>
              Stampley
            </span>
            <br />
            your AI companion.
          </h2>

          {/* Paragraph */}
          <p
            className={`transition-all duration-700 ease-out ${
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
            style={{
              transitionDelay: "220ms",
              fontFamily: "'Inter', sans-serif",
              fontSize: "17px",
              fontWeight: 300,
              lineHeight: 1.9,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "640px",
            }}
          >
            Stampley provides personalized, compassionate emotional support for
            people living with Type 2 Diabetes through daily check-ins and
            judgment-free conversation.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`shrink-0 transition-all duration-700 ease-out ${
            inView
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
          }`}
          style={{
            transitionDelay: "320ms",
          }}
        >
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(255,177,0,0.28)]"
            style={{
              padding: "14px 28px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              background: "#FFB100",
              color: "#071224",
              boxShadow:
                "0 10px 30px rgba(255,177,0,0.24), 0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            Meet Stampley

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}