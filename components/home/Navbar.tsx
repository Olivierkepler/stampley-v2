"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 transition-all duration-500"
      style={{
        height: scrolled ? "62px" : "76px",
        background: scrolled
          ? "rgba(254,253,251,0.94)"
          : "rgba(0,0,0,0.0)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(10,10,5,0.07)"
          : "1px  rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-[8px] overflow-hidden flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              background: scrolled
                ? "transparent"
                : "rgba(255,255,255,0.08)",
              border: scrolled
                ? "none"
                : "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Image
              src="/images/stampleyLogo.png"
              alt="AIDES-T2D"
              width={28}
              height={28}
              className="object-contain"
              style={{
                filter: scrolled ? "none" : "brightness(0) invert(1)",
                opacity: scrolled ? 1 : 0.85,
              }}
            />
          </div>

          <span
            className="text-[11px] uppercase tracking-[0.28em] font-semibold transition-colors duration-500"
            style={{
              color: scrolled
                ? "rgba(10,10,5,0.65)"
                : "rgba(255,255,255,0.75)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            AIDES-T2D
          </span>
        </div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "About", href: "#about" },
            { label: "How it works", href: "#how" },
            { label: "Stampley", href: "#stampley" },
            { label: "Research Team", href: "#team" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-light transition-all duration-300 hover:opacity-100"
              style={{
                color: scrolled
                  ? "rgba(10,10,5,0.5)"
                  : "rgba(255,255,255,0.5)",
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[12.5px] font-medium px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-px"
            style={{
              color: scrolled
                ? "rgba(10,10,5,0.55)"
                : "rgba(255,255,255,0.55)",
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="text-[12.5px] font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-px"
            style={{
              background: scrolled
                ? "linear-gradient(135deg, #000080, #000080)"
                : "rgba(180,140,60,0.85)",
              color: "rgba(255,252,245,0.92)",
              boxShadow: scrolled
                ? "0 4px 14px rgba(10,10,5,0.18)"
                : "0 4px 18px rgba(180,140,60,0.3)",
              fontFamily: "'Outfit', system-ui, sans-serif",
              border: scrolled
                ? "none"
                : "1px solid rgba(180,140,60,0.4)",
            }}
          >
            Join the Study
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex md:hidden flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-[9px]"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full"
              style={{
                width: i === 1 ? "12px" : "16px",
                height: "1.5px",
                background: scrolled
                  ? "rgba(10,10,5,0.5)"
                  : "rgba(255,255,255,0.6)",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "300px" : "0px",
          background: "rgba(8,10,14,0.96)",
        }}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {[
            { label: "About", href: "#about" },
            { label: "How it works", href: "#how" },
            { label: "Stampley", href: "#stampley" },
            { label: "Research Team", href: "#team" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[13px] font-light py-1"
              style={{
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}