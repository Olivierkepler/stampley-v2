import Link from "next/link"
import Image from "next/image"
const footerColumns = [
  {
    title: "Study",
    links: [
      { label: "About AIDES-T2D", href: "#about" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Meet Stampley", href: "#stampley" },
      { label: "Study Details", href: "#details" },
      { label: "Research Team", href: "#team" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Diabetes Support", href: "#" },
      { label: "Emotional Wellness", href: "#" },
      { label: "Type 2 Diabetes", href: "#" },
      { label: "Participant FAQs", href: "#faq" },
      { label: "Contact Us", href: "mailto:pcrg@umb.edu" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "IRB Approval", href: "#" },
      { label: "Terms of Use", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden px-5 py-12 text-white sm:px-6 sm:py-14 md:px-12 lg:px-20 xl:px-24"
      style={{
        backgroundImage:
          "linear-gradient(25deg, rgb(0, 16, 47) 3%, rgb(0, 37, 117) 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(96,165,250,0.22),transparent_28%),radial-gradient(circle_at_85%_90%,rgba(34,211,238,0.13),transparent_30%)]" />
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_2fr] xl:grid-cols-[1fr_2.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex flex-col">
              <Image
                src="/images/stampleyLogo.png"
                alt="Stampley Logo"
                width={64}
                height={64}
                className="mb-3"
                priority
              />
        

              <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-cyan-200/80 sm:text-xs sm:tracking-[0.28em]">
                T2D Support Study
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-blue-100/75 sm:mt-7">
              A 28-day research experience built around daily check-ins,
              structured emotional support, and Stampley, a warm AI companion.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              {["IRB Reviewed", "Free to Participate", "28 Days"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:px-4 sm:text-[11px] sm:tracking-[0.16em]"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {footerColumns.map((column) => (
              <div
                key={column.title}
                className="border-t border-white/15 pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0 lg:pl-9"
              >
                <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white sm:mb-6 sm:text-sm">
                  {column.title}
                </h3>

                <ul className="space-y-3.5 sm:space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="border-b border-sky-300/50 text-base font-light text-sky-300 transition hover:border-white hover:text-white sm:text-lg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/20 pt-7 sm:mt-14">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-white/80">
              <Link href="/terms" className="hover:text-cyan-300">
                Terms
              </Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-cyan-300">
                Privacy
              </Link>
              <span>|</span>
              <Link href="/accessibility" className="hover:text-cyan-300">
                Accessibility
              </Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-cyan-300">
                Contact
              </Link>
            </div>

            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} AIDES-T2D. All Rights Reserved.
            </p>
          </div>

          <p className="mt-6 max-w-5xl text-xs leading-relaxed text-white/45">
            AIDES-T2D is a research study and is not a medical product or
            therapeutic service. Stampley is not a substitute for professional
            medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </footer>
  )
}