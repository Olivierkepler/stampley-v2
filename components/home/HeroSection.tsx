"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import AnimatedOrb from "@/components/home/AnimatedOrb"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)

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

  const stats = [
    { value: "28", label: "days" },
    { value: "~5", label: "min / day" },
    { value: "Free", label: "to participate" },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[550px] flex-col justify-center overflow-hidden px-12 pb-12 pt-16 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
      style={{
        borderBottomRightRadius: "20%",
        background: "#071224",
      }}
    >
      <style jsx>{`
        @keyframes heroImageDrift {
          0% {
            transform: scale(1.05) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.1) translate3d(-14px, -8px, 0);
          }
          100% {
            transform: scale(1.05) translate3d(0, 0, 0);
          }
        }

        @keyframes softFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes slowPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.08);
          }
        }

        .hero-bg-motion {
          animation: heroImageDrift 18s ease-in-out infinite;
          will-change: transform;
        }

        .hero-float {
          animation: softFloat 5s ease-in-out infinite;
        }

        .hero-pulse {
          animation: slowPulse 6s ease-in-out infinite;
        }
      `}</style>

      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="hero-bg-motion absolute inset-[-24px]"
          style={{
            backgroundImage: "url('/images/hero/umb_hero.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            backgroundRepeat: "no-repeat",
            opacity: 0.35,
          }}
        />
      </div>

      {/* Soft Moving Glow */}
      <div className="hero-pulse absolute left-[-120px] top-[-120px] z-[1] h-[280px] w-[280px] rounded-full bg-blue-400/20 blur-3xl" />

      {/* Animated Orb */}
      <div className="hero-float absolute right-[80px] top-1/2 z-[2] hidden -translate-y-1/2 lg:block">
        <AnimatedOrb delay={400} size={340} />
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-2xl"
        style={{
          opacity: mounted && inView ? 1 : 0,
          transform:
            mounted && inView ? "translateY(0)" : "translateY(40px)",
          transition:
            "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Headline */}
        <h1
          className="hero-float mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(25px, 3vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.96)",
            opacity: mounted && inView ? 1 : 0,
            transform:
              mounted && inView ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s",
          }}
        >
          Managing diabetes is{" "}
          <span style={{ color: "#FFB100", fontWeight: 600 }}>hard.</span>
          <br />
          You shouldn&apos;t have to
          <br />
          do it{" "}
          <span style={{ color: "#FFB100", fontWeight: 600 }}>alone.</span>
        </h1>

        {/* Subtext */}
        <p
          className="mb-8"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 400,
            lineHeight: 1.85,
            color: "rgba(255,255,255,0.68)",
            maxWidth: "520px",
            opacity: mounted && inView ? 1 : 0,
            transform:
              mounted && inView ? "translateY(0)" : "translateY(45px)",
            transition: "opacity 0.8s ease 0.35s, transform 0.8s ease 0.35s",
          }}
        >
          AIDES-T2D provides AI emotional support for people living with Type 2
          Diabetes through daily check-ins and{" "}
          <span style={{ color: "#FFD166", fontWeight: 500 }}>Stampley</span>.
        </p>

        {/* CTA Buttons */}
        <div
          className="mb-10 flex flex-wrap gap-4"
          style={{
            opacity: mounted && inView ? 1 : 0,
            transform:
              mounted && inView ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
          }}
        >
          <Link
            href="/register"
            className="group hero-float inline-flex items-center gap-2 rounded-full transition-all duration-200 hover:-translate-y-1"
            style={{
              padding: "10px 20px",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "white",
              color: "black",
              boxShadow:
                "0 10px 30px rgba(37,99,235,0.28), 0 2px 6px rgba(0,0,0,0.25)",
              animationDelay: "0.4s",
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
              padding: "10px 20px",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(6px)",
            }}
          >
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div
          className="hero-float flex flex-wrap items-center"
          style={{
            gap: 0,
            rowGap: "10px",
            opacity: mounted && inView ? 1 : 0,
            transform:
              mounted && inView ? "translateY(0)" : "translateY(55px)",
            transition: "opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s",
            animationDelay: "0.8s",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-baseline gap-[6px]"
              style={{
                paddingRight: "20px",
                paddingLeft: i > 0 ? "20px" : undefined,
                borderLeft:
                  i > 0 ? "1px solid rgba(255,255,255,0.1)" : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {stat.value}
              </span>

              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}