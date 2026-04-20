"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    { value: "28", label: "days" },
    { value: "~5", label: "min / day" },
    { value: "Free", label: "to participate" },
  ]

  return (
    <section
      className="relative min-h-[520px] flex flex-col justify-center px-12 pt-36 pb-12 overflow-hidden"
      style={{ borderBottomRightRadius: "20%", background: "#07090d" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/hero/umb_hero.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
          opacity: 0.45,
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(160deg, rgba(10,14,22,0.52) 0%, rgba(12,16,26,0.32) 50%, rgba(10,14,22,0.58) 100%)",
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      {/* Warm accent glow */}
      <div
        className="absolute z-[3] pointer-events-none"
        style={{
          left: "-5%",
          top: "10%",
          bottom: 0,
          width: "55%",
          background:
            "radial-gradient(ellipse at 0% 55%, rgba(185,148,62,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 max-w-2xl"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          <div
            className="w-[2px] h-7 rounded-full flex-shrink-0"
            style={{ background: "rgba(185,148,62,0.65)" }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9.5px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.38)",
            }}
          >
            University of Massachusetts Boston · PCRG
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-6"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(26px, 4vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.9)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s",
          }}
        >
          Managing diabetes is{" "}
          <em
            className="italic font-light"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            hard.
          </em>
          <br />
          You shouldn't have to
          <br />
          do it{" "}
          <em
            className="italic font-light"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            alone.
          </em>
        </h1>

        {/* Subtext */}
        <p
          className="mb-8"
          style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: 1.85,
            color: "rgba(255,255,255,0.42)",
            maxWidth: "460px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease 0.35s, transform 0.8s ease 0.35s",
          }}
        >
          AIDES-T2D is a 28-day research study providing personalized
          AI-driven emotional support for people living with Type 2 Diabetes —
          through daily check-ins and a compassionate AI companion called{" "}
          <span style={{ color: "rgba(185,148,62,0.88)", fontWeight: 500 }}>
            Stampley
          </span>
          .
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-3 mb-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
          }}
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full transition-all duration-200 hover:-translate-y-0.5"
            style={{
              padding: "13px 26px",
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(185,148,62,0.88)",
              color: "rgba(255,252,245,0.96)",
              boxShadow:
                "0 6px 24px rgba(185,148,62,0.22), 0 1px 4px rgba(0,0,0,0.35)",
            }}
          >
            Volunteer Application
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <a
            href="#about"
            className="inline-flex items-center rounded-full transition-all duration-200 hover:-translate-y-px hover:bg-white/10"
            style={{
              padding: "13px 26px",
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              letterSpacing: "0.06em",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(6px)",
            }}
          >
            Learn more
          </a>
        </div>

        {/* Trust signals */}
        <div
          className="flex flex-wrap items-center"
          style={{
            gap: 0,
            rowGap: "10px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-baseline gap-[5px]"
              style={{
                paddingRight: "20px",
                paddingLeft: i > 0 ? "20px" : undefined,
                borderLeft:
                  i > 0 ? "1px solid rgba(255,255,255,0.1)" : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "22px",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.26)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}

          {/* IRB badge */}
          <div
            className="flex items-baseline"
            style={{ paddingLeft: "20px", borderLeft: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div
              className="inline-flex items-center gap-[5px] rounded-full"
              style={{
                padding: "3px 9px 3px 7px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <IRBDot />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                IRB Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function IRBDot() {
  return (
    <span
      className="block rounded-full animate-pulse"
      style={{
        width: "5px",
        height: "5px",
        flexShrink: 0,
        background: "rgba(120,210,140,0.8)",
        boxShadow: "0 0 0 2px rgba(120,210,140,0.15)",
        animationDuration: "2.4s",
      }}
    />
  )
}