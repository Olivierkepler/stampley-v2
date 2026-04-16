"use client"

import { useState } from "react"
import Link from "next/link"

export default function TopBar() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="w-full px-4 py-2.5 flex items-center justify-between gap-4 relative"
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(10,10,5,0.06)",
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "#8B6F47" }}
        />
        <span
          className="text-[9px] uppercase tracking-[0.2em] hidden sm:block"
          style={{
            color: "rgba(10,10,5,0.35)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Now enrolling
        </span>
      </div>

      {/* Center */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-1 flex-wrap">

        {/* Volunteer */}
        <Link
          href="/register"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-px group"
          style={{
            background: "rgba(139,111,71,0.08)",
            border: "1px solid rgba(139,111,71,0.18)",
          }}
        >
          <span className="text-[11px]">📋</span>
          <span
            className="text-[11px] font-medium whitespace-nowrap group-hover:text-black transition-colors"
            style={{ color: "#8B6F47" }}
          >
            Volunteer Application
          </span>
        </Link>

        {/* Divider */}
        <span
          className="hidden sm:block text-[10px]"
          style={{ color: "rgba(10,10,5,0.15)" }}
        >
          /
        </span>

        {/* Visit Us */}
        <a
          href="https://www.umb.edu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-px group"
        >
          <span className="text-[11px]">🏛️</span>
          <span
            className="text-[11px] font-medium whitespace-nowrap group-hover:text-black transition-colors"
            style={{ color: "rgba(10,10,5,0.5)" }}
          >
            Visit Us Today
          </span>
        </a>

        {/* Divider */}
        <span
          className="hidden sm:block text-[10px]"
          style={{ color: "rgba(10,10,5,0.15)" }}
        >
          /
        </span>

        {/* Phone */}
        <a
          href="tel:6172874067"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-px group"
        >
          <span className="text-[11px]">📞</span>
          <span
            className="text-[11px] font-medium whitespace-nowrap group-hover:text-black transition-colors"
            style={{
              color: "rgba(10,10,5,0.5)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            617-287-4067
          </span>
        </a>
      </div>

      {/* Right */}
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-black/5"
        style={{ color: "rgba(10,10,5,0.3)" }}
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
          <path
            d="M6 6l8 8M6 14L14 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}