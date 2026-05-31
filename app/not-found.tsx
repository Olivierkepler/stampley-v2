// app/not-found.tsx

import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
return (
<main
className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fefdfb] px-6"
style={{
fontFamily: "'Outfit', system-ui, sans-serif",
}}
>
{/* soft background glow */} <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_45%)]" />

  <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
    
    {/* Logo */}
    <div className="mb-8 flex items-center justify-center">
      <Image
        src="/images/stampleyLogo.png"
        alt="Stampley"
        width={72}
        height={72}
        className="h-auto w-auto object-contain"
        priority
      />
    </div>

    {/* 404 */}
    <p className="mb-3 font-['JetBrains_Mono',monospace] text-[12px] uppercase tracking-[0.24em] text-blue-700/70">
      Error 404
    </p>

    {/* title */}
    <h1
      className="mb-5 text-[42px] font-light leading-[1.05] tracking-[-0.04em] text-[#0a0a0f] sm:text-[58px]"
      style={{
        fontFamily: "'Fraunces', Georgia, serif",
      }}
    >
      This page could not be found
    </h1>

    {/* description */}
    <p className="max-w-xl text-[16px] font-light leading-[1.9] text-black/55 sm:text-[17px]">
      The page you&apos;re looking for may have been moved, removed,
      or is temporarily unavailable.
    </p>

    {/* actions */}
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
      
      <Link
        href="/"
        className="inline-flex h-12 items-center justify-center rounded-full bg-blue-900 px-8 text-[15px] font-medium text-white shadow-[0_8px_30px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-800"
      >
        Return Home
      </Link>

      <Link
        href="/login"
        className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-8 text-[15px] font-medium text-slate-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        Login
      </Link>
    </div>
  </div>
</main>


)
}
