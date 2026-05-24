import Image from "next/image"
import {
  Mail,
  Globe,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import MainHeader from "@/components/home/MainHeader"
import TopNav from "@/components/home/topNav"
import Footer from "@/components/home/Footer"

export default function team() {
  return (
    <main className="bg-white">
      <TopNav />
      <MainHeader />
      {/* Announcement Bar */}
      <div className="relative overflow-hidden bg-[#FFB100] text-[#071224]">
        {/* Accent Line */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[#071224]/0 via-[#071224]/35 to-[#071224]/0" />

        <div className="mx-auto flex h-11 max-w-[1800px] items-center px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 text-[13px] leading-none text-[#071224]"
            style={{
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            <span className="text-[#071224]">✦</span>

            <span className="font-semibold uppercase tracking-[0.06em] text-[#071224]">
              Limited Time:
            </span>

            <span className="text-[#071224]/80">
              Join the AIDES-T2D emotional support study today
            </span>

            <Link
              href="/register"
              className="ml-1 font-semibold text-[#071224] transition hover:opacity-70"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="grid min-h-[420px] overflow-hidden lg:grid-cols-[0.72fr_1fr]">
        {/* Left Side */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-blue-900 px-6 py-10 text-white md:px-12 md:py-12 lg:px-16 lg:py-14">
          {/* Soft Accent Glow */}
          <div className="pointer-events-none absolute -left-24 top-[-80px] h-[260px] w-[260px] rounded-full bg-cyan-400/10 blur-3xl" />

          {/* Breadcrumb */}
          <div
            className="relative z-10 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70 sm:text-xs"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Link
              href="/"
              className="transition-colors text-[#FFB100] font-bold duration-200 hover:text-white"
            >
              Home
            </Link>

            <ChevronRight size={14} className="text-white/40" />

            <Link
              href="/about"
              className="transition-colors duration-200 hover:text-white"
            >
              Contact Us
            </Link>
          </div>

          {/* Heading */}
          <div className="relative z-10 pt-16 md:pt-20">
            <h1
              className="max-w-xl text-4xl font-medium leading-[0.95] tracking-[-0.05em] text-white sm:text-4xl md:text-4xl"
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: "rgba(255,255,255,0.96)",
              }}
            >
              Contact us
            </h1>

            <p
              className="mt-5 max-w-md text-base leading-relaxed text-white/65 md:text-lg"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Questions about the study, participation, or support? Our team is
              here to help.
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative min-h-[320px] lg:min-h-[420px]">
          <Image
            src="/images/diabetics4.jpg"
            alt="Contact support team"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Contact Section */}
   
    
    </main>
  )
}