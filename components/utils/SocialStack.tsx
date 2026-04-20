"use client"

import Link from "next/link"

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="w-[26px] h-[26px]" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7l6.2 5.2C39.1 36.9 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[24px] h-[24px]" aria-hidden="true" fill="none">
      <path
        d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3C4.17 3 3.3 3.88 3.3 4.96c0 1.07.87 1.94 1.95 1.94 1.07 0 1.94-.87 1.94-1.94C7.19 3.88 6.32 3 5.25 3ZM20.7 12.9c0-3.46-1.84-5.07-4.3-5.07-1.98 0-2.87 1.09-3.37 1.85V8.5H9.66c.04.79 0 11.5 0 11.5h3.37v-6.42c0-.34.03-.68.13-.92.27-.67.87-1.36 1.89-1.36 1.33 0 1.86 1.02 1.86 2.52V20h3.37v-7.1Z"
        fill="white"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" aria-hidden="true" fill="none">
      <path
        d="M18.9 3H21l-6.87 7.85L22 21h-6.17l-4.83-6.32L5.47 21H3.36l7.34-8.39L2 3h6.33l4.37 5.77L18.9 3Zm-1.08 16.2h1.17L7.7 4.74H6.45L17.82 19.2Z"
        fill="white"
      />
    </svg>
  )
}

export default function SocialStack() {
  const socials = [
    {
      name: "Google Scholar",
      href: "https://scholar.google.com/citations?user=qTKYFuoAAAAJ&hl=en",
      icon: <GoogleG />,
      bg: "rgba(255,255,255,0.92)",
      border: "1px solid rgba(10,10,5,0.06)",
      shadow: "0 10px 35px rgba(10,10,5,0.08), 0 2px 10px rgba(10,10,5,0.04)",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/michelle-d-s-boakye-phd-mph-rn-870a9938/",
      icon: <LinkedInIcon />,
      bg: "linear-gradient(180deg, #0A66C2 0%, #0857A6 100%)",
      border: "1px solid rgba(255,255,255,0.18)",
      shadow: "0 12px 34px rgba(10,102,194,0.22), 0 2px 10px rgba(10,10,5,0.05)",
    },
    {
      name: "X",
      href: "https://x.com/MichelleBoakye4",
      icon: <XIcon />,
      bg: "linear-gradient(180deg, #151515 0%, #000000 100%)",
      border: "1px solid rgba(255,255,255,0.12)",
      shadow: "0 12px 34px rgba(0,0,0,0.18), 0 2px 10px rgba(10,10,5,0.05)",
    },
  ]

  return (
    <div className="relative flex flex-col items-center">
      {/* connector line */}
      <div
        className="absolute top-6 bottom-6 w-px"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(10,10,5,0.08) 16%, rgba(10,10,5,0.08) 84%, transparent 100%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-5">
        {socials.map((item, i) => (
          <Link
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            title={item.name}
            className="group relative flex h-[64px] w-[64px] items-center justify-center rounded-full transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.06]"
            style={{
              background: item.bg,
              border: item.border,
              boxShadow: item.shadow,
              animation: `socialFloatIn 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms both`,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {/* inner highlight */}
            <span
              className="pointer-events-none absolute inset-[1px] rounded-full opacity-100"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.02) 100%)",
              }}
            />

            {/* glow ring on hover */}
            <span className="pointer-events-none absolute inset-[-6px] rounded-full border border-black/0 transition-all duration-500 group-hover:border-black/5 group-hover:scale-[1.04]" />

            <span className="relative z-10">{item.icon}</span>

            {/* tooltip */}
            <span
              className="pointer-events-none absolute left-[82px] whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] opacity-0 translate-x-[-6px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "rgba(10,10,5,0.55)",
                border: "1px solid rgba(10,10,5,0.06)",
                boxShadow: "0 8px 24px rgba(10,10,5,0.08)",
                fontFamily: "'JetBrains Mono', monospace",
                backdropFilter: "blur(8px)",
              }}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes socialFloatIn {
          0% {
            opacity: 0;
            transform: translateX(-18px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}