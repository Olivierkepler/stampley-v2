import Link from "next/link"

const LINKS = {
  Study: [
    { label: "About AIDES-T2D", href: "#about" },
    { label: "How it works", href: "#how" },
    { label: "Meet Stampley", href: "#stampley" },
    { label: "Study details", href: "#details" },
    { label: "Research team", href: "#team" },
  ],
  Participate: [
    { label: "Register", href: "/register" },
    { label: "Sign in", href: "/login" },
    { label: "Contact us", href: "mailto:pcrg@umb.edu" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "IRB approval", href: "#" },
    { label: "Terms of use", href: "#" },
  ],
}

export default function Footer() {
  return (
    <footer
      className="px-6 md:px-12 pt-16 pb-10"
      style={{
        background: "linear-gradient(160deg, #ebe7df 0%, #e4e0d8 100%)",
        borderTop: "1px solid rgba(10,10,5,0.08)",
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">

          {/* Brand col */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base"
                style={{
                  background: "linear-gradient(135deg, #1a1a18, #0a0a0f)",
                  boxShadow: "0 2px 8px rgba(10,10,5,0.2)",
                }}
              >
                💙
              </div>
              <span
                className="text-[11px] uppercase tracking-[0.28em] font-semibold"
                style={{
                  color: "rgba(10,10,5,0.55)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                AIDES-T2D
              </span>
            </div>

            <p
              className="text-[13px] font-light leading-[1.75] max-w-xs"
              style={{ color: "rgba(10,10,5,0.4)" }}
            >
              An AI-driven emotional support study for people living with
              Type 2 Diabetes — developed at the University of Massachusetts
              Boston.
            </p>

            {/* Institution badges */}
            <div className="flex flex-col gap-2">
              {[
                { label: "UMass Boston", sub: "College of Nursing & Health Sciences" },
                { label: "PCRG", sub: "Patient-Centered Research Group" },
              ].map(badge => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] w-fit"
                  style={{
                    background: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(10,10,5,0.08)",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "rgba(10,10,5,0.3)" }}
                  />
                  <div>
                    <span
                      className="text-[9.5px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        color: "rgba(10,10,5,0.45)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {badge.label}
                    </span>
                    <span
                      className="text-[9.5px] ml-1.5"
                      style={{ color: "rgba(10,10,5,0.3)" }}
                    >
                      {badge.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p
                className="text-[9px] uppercase tracking-[0.24em] font-semibold mb-4"
                style={{
                  color: "rgba(10,10,5,0.3)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-light transition-all duration-200 hover:opacity-80"
                      style={{ color: "rgba(10,10,5,0.45)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-8"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(10,10,5,0.1), transparent)",
          }}
        />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[11px] font-light text-center sm:text-left"
            style={{ color: "rgba(10,10,5,0.3)" }}
          >
            © {new Date().getFullYear()} AIDES-T2D · University of Massachusetts Boston ·
            All rights reserved
          </p>

          <div className="flex items-center gap-4">
            {[
              { label: "IRB Approved", icon: "✅" },
              { label: "HIPAA Compliant", icon: "🔐" },
              { label: "Free to Participate", icon: "🎓" },
            ].map(badge => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5"
              >
                <span className="text-[11px]">{badge.icon}</span>
                <span
                  className="text-[9px] uppercase tracking-[0.14em]"
                  style={{
                    color: "rgba(10,10,5,0.28)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-8 px-5 py-4 rounded-[14px]"
          style={{
            background: "rgba(255,255,255,0.25)",
            border: "1px solid rgba(10,10,5,0.07)",
          }}
        >
          <p
            className="text-[11px] font-light leading-[1.7] text-center"
            style={{ color: "rgba(10,10,5,0.32)" }}
          >
            AIDES-T2D is a research study and is not a medical product or
            therapeutic service. Stampley is an AI research companion and is
            not a substitute for professional medical advice, diagnosis, or
            treatment. Always consult your healthcare provider for medical
            decisions. If you are experiencing a mental health emergency,
            please call 988 (Suicide & Crisis Lifeline) or 911.
          </p>
        </div>
      </div>
    </footer>
  )
}