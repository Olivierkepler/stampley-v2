"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

const navLinks = [
  { label: "About", href: "/about" },
  { label: "How it works", href: "#how" },
  { label: "Stampley", href: "#stampley" },
  { label: "Research Team", href: "#team" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)

    onScroll()
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 px-4 transition-all duration-500 sm:px-6 md:px-10 lg:px-12"
      style={{
        height: scrolled ? "64px" : "78px",
        background: scrolled ? "rgba(254,253,251,0.94)" : "rgba(0,0,0,0)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(10,10,5,0.07)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] transition-all duration-500"
            style={{
              background: scrolled ? "transparent" : "rgba(255,255,255,0.08)",
              border: scrolled ? "none" : "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Image
              src="/images/stampleyLogo.png"
              alt="AIDES-T2D"
              width={30}
              height={30}
              className="object-contain transition-all duration-500"
              style={{
                filter: scrolled ? "none" : "brightness(0) invert(1)",
                opacity: scrolled ? 1 : 0.88,
              }}
            />
          </div>

          <span
            className="text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 sm:text-[11px] sm:tracking-[0.28em]"
            style={{
              color: scrolled
                ? "rgba(10,10,5,0.65)"
                : "rgba(255,255,255,0.78)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            AIDES-T2D
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-[13px] font-light transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:opacity-100 hover:after:w-full"
              style={{
                color: scrolled
                  ? "rgba(10,10,5,0.58)"
                  : "rgba(255,255,255,0.62)",
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-[12.5px] font-medium transition-all duration-300 hover:-translate-y-px"
            style={{
              color: scrolled
                ? "rgba(10,10,5,0.55)"
                : "rgba(255,255,255,0.62)",
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="rounded-full px-5 py-2.5 text-[12.5px] font-semibold transition-all duration-300 hover:-translate-y-px"
            style={{
              background: scrolled
                ? "linear-gradient(135deg, #000080, #000080)"
                : "rgba(180,140,60,0.85)",
              color: "rgba(255,252,245,0.92)",
              boxShadow: scrolled
                ? "0 4px 14px rgba(10,10,5,0.18)"
                : "0 4px 18px rgba(180,140,60,0.3)",
              fontFamily: "'Outfit', system-ui, sans-serif",
              border: scrolled ? "none" : "1px solid rgba(180,140,60,0.4)",
            }}
          >
            Join the Study
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-[10px] transition-colors duration-300 hover:bg-white/10 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === 1 ? "13px" : "18px",
                height: "1.5px",
                background: scrolled
                  ? "rgba(10,10,5,0.6)"
                  : "rgba(255,255,255,0.72)",
                transform:
                  menuOpen && i === 0
                    ? "translateY(6.5px) rotate(45deg)"
                    : menuOpen && i === 1
                      ? "scaleX(0)"
                      : menuOpen && i === 2
                        ? "translateY(-6.5px) rotate(-45deg)"
                        : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="absolute left-4 right-4 top-full overflow-hidden rounded-2xl border border-white/10 bg-[#071224]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:hidden"
        style={{
          maxHeight: menuOpen ? "420px" : "0px",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(8px)" : "translateY(-8px)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-light text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 grid gap-3 border-t border-white/10 pt-4">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#FFB100] px-5 py-3 text-center text-sm font-semibold text-[#071224] transition hover:bg-[#ffd966]"
            >
              Join the Study
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}