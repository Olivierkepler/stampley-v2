"use client"

import { useEffect, useState } from "react"

interface AnimatedOrbProps {
  delay?: number
  size?: number
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedOrb({
  delay = 0,
  size = 560,
  className = "",
  style = {},
}: AnimatedOrbProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const center = 280

  return (
    <div
      className={`pointer-events-none relative ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1)" : "scale(0.96)",
        transition:
          "opacity 1.4s ease, transform 1.4s cubic-bezier(0.22,1,0.36,1)",
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Soft background glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,179,33,0.18) 0%, rgba(244,179,33,0.08) 34%, transparent 68%)",
          filter: "blur(28px)",
          animation: "orb-breathe 7s ease-in-out infinite",
        }}
      />

      <svg
        viewBox="0 0 560 560"
        className="absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient
            id="orb-ring-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(244,179,33,0)" />
            <stop offset="50%" stopColor="rgba(244,179,33,0.72)" />
            <stop offset="100%" stopColor="rgba(244,179,33,0)" />
          </linearGradient>

          <radialGradient id="orb-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,236,180,0.42)" />
            <stop offset="45%" stopColor="rgba(244,179,33,0.18)" />
            <stop offset="100%" stopColor="rgba(244,179,33,0)" />
          </radialGradient>

          <filter id="orb-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center glow */}
        {/* <circle cx={center} cy={center} r="92" fill="url(#orb-center-glow)" /> */}

    {/* Outer dotted orbit */}
<g
  style={{
    transformOrigin: `${center}px ${center}px`,
    animation: "orb-spin-slow 46s linear infinite",
  }}
>
  <circle
    cx={center}
    cy={center}
    r="238"
    fill="none"
    stroke="rgba(244,179,33,0.38)"
    strokeWidth="2.2"
    strokeDasharray="3 10"
  />
</g>

{/* Middle glowing orbit */}
<g
  style={{
    transformOrigin: `${center}px ${center}px`,
    animation: "orb-spin-reverse 28s linear infinite",
  }}
>
  <circle
    cx={center}
    cy={center}
    r="178"
    fill="none"
    stroke="url(#orb-ring-gradient)"
    strokeWidth="3"
    opacity="0.95"
    filter="url(#orb-soft-glow)"
  />
</g>

{/* Inner thin orbit */}
<g
  style={{
    transformOrigin: `${center}px ${center}px`,
    animation: "orb-spin-slow 22s linear infinite",
  }}
>
  <circle
    cx={center}
    cy={center}
    r="126"
    fill="none"
    stroke="rgba(255,236,180,0.42)"
    strokeWidth="2"
  />
</g>

{/* Pulse rings */}
{[0, 1.35, 2.7].map((delayTime) => (
  <circle
    key={delayTime}
    cx={center}
    cy={center}
    r="112"
    fill="none"
    stroke="rgba(244,179,33,0.62)"
    strokeWidth="2.4"
    style={{
      animation: `orb-pulse-ring 4.2s ease-out infinite ${delayTime}s`,
    }}
  />
))}

        {/* Floating points */}
       
      </svg>

      <style jsx>{`
        @keyframes orb-spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orb-spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes orb-pulse-ring {
          0% {
            r: 112;
            opacity: 0.55;
          }
          100% {
            r: 224;
            opacity: 0;
          }
        }

        @keyframes orb-breathe {
          0%,
          100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  )
}