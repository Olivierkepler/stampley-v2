"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-40 pb-10 overflow-hidden">
      {/* ── BACKGROUND IMAGE ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/hero/umb_hero.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(160deg, rgba(6,8,12,0.78) 0%, rgba(10,10,15,0.72) 50%, rgba(6,8,12,0.85) 100%)",
        }}
      />

      {/* Bottom fade */}
      {/* <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(245,242,236,0.95) 100%)",
        }}
      /> */}

      {/* Warm accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 50%, rgba(180,140,60,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div
        className="max-w-6xl mx-auto relative z-10 w-full"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        {/* Study label */}
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: "rgba(180,140,60,0.7)" }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.32em]"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            University of Massachusetts Boston · PCRG
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="text-[32px] md:text-[50px] font-light leading-[1.03] tracking-[-0.03em] mb-8 max-w-5xl"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            color: "rgba(255,255,255,0.88)",
          }}
        >
          Managing diabetes
         
          is{" "}
          <em
            className="italic font-light"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            hard.
          </em>
          <br />
          You shouldn't have to
          <br />
          do it{" "}
          <em
            className="italic font-light"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            alone.
          </em>
        </h1>

        {/* Subtext */}
        <p
          className="text-[15px] md:text-[17px] font-light leading-[1.8] max-w-xl mb-10"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          AIDES-T2D is a 28-day research study providing personalized
          AI-driven emotional support for people living with Type 2 Diabetes —
          through daily check-ins and a compassionate AI companion called{" "}
          <span
            style={{
              color: "rgba(180,140,60,0.9)",
              fontWeight: 500,
            }}
          >
            Stampley
          </span>
          .
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mb-14">
          <Link
            href="/register"
            className="px-8 py-4 rounded-full text-[13px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(180,140,60,0.9)",
              color: "rgba(255,252,245,0.95)",
              boxShadow:
                "0 8px 28px rgba(180,140,60,0.25), 0 2px 8px rgba(0,0,0,0.3)",
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Volunteer Application →
          </Link>

          <a
            href="#about"
            className="px-8 py-4 rounded-full text-[13px] font-medium transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Outfit', system-ui, sans-serif",
              backdropFilter: "blur(8px)",
            }}
          >
            Learn more
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {[
            { value: "28", label: "days" },
            { value: "~5", label: "min / day" },
            { value: "Free", label: "to participate" },
            { value: "IRB", label: "approved" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              {i > 0 && (
                <span
                  className="hidden sm:block text-[12px]"
                  style={{ color: "rgba(255,255,255,0.1)" }}
                >
                  /
                </span>
              )}
              <span
                className="text-[22px] font-light"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[9.5px] uppercase tracking-[0.2em]"
                style={{
                  color: "rgba(255,255,255,0.28)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — "Our Team" */}
      <div
        className="absolute right-40 top-1/2 -translate-y-1/2 z-10 hidden xl:flex flex-col items-center gap-4"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.2s ease 0.4s",
        }}
      >
        <div
          className="absolute left-0 top-8 bottom-8 w-px"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />

        <div className="pl-10 flex flex-col items-center gap-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              border: "2px solid rgba(180,140,60,0.5)",
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle
                cx="13"
                cy="12"
                r="4.5"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
              />
              <circle
                cx="23"
                cy="12"
                r="4.5"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
              />
              <path
                d="M4 28c0-5 4-8 9-8M23 20c5 0 9 3 9 8"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M13 20c0 0 2.5 2 5 0"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            className="absolute w-24 h-24 rounded-full animate-ping"
            style={{
              border: "1px solid rgba(180,140,60,0.2)",
              animationDuration: "3s",
            }}
          />

          <p
            className="text-[15px] font-medium"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            Our Team
          </p>

          <a
            href="#team"
            className="text-[9.5px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
            style={{
              color: "rgba(180,140,60,0.75)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Meet us →
          </a>
        </div>
      </div>

      {/* Bottom left quote */}
      <div
        className="absolute bottom-16 left-8 md:left-12 z-10 max-w-sm hidden md:block"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.2s ease 0.6s",
        }}
      >
        {/* <p
          className="text-[13px] font-light leading-[1.7]"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Our{" "}
          <span style={{ color: "rgba(180,140,60,0.85)", fontWeight: 500 }}>
            multidisciplinary team
          </span>{" "}
          is passionate about transforming person-centered diabetes care
          through{" "}
          <span style={{ color: "rgba(180,140,60,0.85)" }}>
            research, innovation,
          </span>{" "}
          and{" "}
          <span style={{ color: "rgba(180,140,60,0.85)" }}>
            collaboration.
          </span>
        </p> */}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div
          className="w-px h-8 animate-pulse"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)",
          }}
        />
        <span
          className="text-[8px] uppercase tracking-[0.24em]"
          style={{
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}