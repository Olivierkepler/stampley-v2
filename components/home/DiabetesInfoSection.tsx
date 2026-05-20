"use client"

import { useEffect, useRef, useState } from "react"
import {
  Activity,
  ClipboardList,
  Gauge,
  HeartPulse,
  ShieldPlus,
  Stethoscope,
  Syringe,
} from "lucide-react"

const topics = [
  { icon: ShieldPlus, label: "Diabetes\nPrevention" },
  { icon: Gauge, label: "Prediabetes" },
  { icon: ClipboardList, label: "Newly\nDiagnosed" },
  { icon: Syringe, label: "Type 1\nDiabetes" },
  { icon: Stethoscope, label: "Type 2\nDiabetes" },
  { icon: HeartPulse, label: "Life With\nDiabetes" },
  { icon: Activity, label: "Diabetes\nComplications" },
]

export default function DiabetesInfoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.25,
      }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  const playVideo = () => {
    videoRef.current?.play()
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-6 py-20 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Topic Cards */}
        <div
          className={`mb-28 flex flex-wrap justify-center gap-5 transition-all duration-700 ease-out ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          {topics.map(({ icon: Icon, label }, index) => (
            <a
              key={label}
              href="#"
              className={`group flex h-36 w-36 flex-col items-center justify-center gap-4 bg-white text-center text-blue-900 shadow-[0_14px_35px_rgba(15,23,42,0.14)] transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.18)] ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: inView ? `${index * 90}ms` : "0ms",
              }}
            >
              <Icon
                size={48}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:scale-105"
              />

              <span className="whitespace-pre-line text-sm font-medium leading-snug">
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Video */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              inView
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <div
              className={`absolute -left-6 -top-16 h-56 w-36 rotate-[-12deg] rounded-full border-l-4 border-blue-100/70 transition-all duration-700 ${
                inView ? "opacity-100" : "opacity-0"
              }`}
            />

            <div
              className={`absolute -right-10 -top-10 h-24 w-24 border-[10px] border-blue-900 transition-all duration-700 ${
                inView
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-45 scale-75 opacity-0"
              }`}
            />

            <div className="relative h-[300px] overflow-hidden shadow-sm md:h-[420px]">
              <video
                ref={videoRef}
                src="/videos/diabeticsvideo.mp4"
                poster="/images/diabetes/diabetes2.jpg"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-slate-900/20" />

              <button
                type="button"
                onClick={playVideo}
                aria-label="Play video"
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue-900 shadow-lg transition hover:scale-105"
              >
                <span className="ml-1 text-2xl">▶</span>
              </button>
            </div>
          </div>

          {/* Text */}
          <div
            className={`max-w-md transition-all duration-700 ease-out ${
              inView
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            }`}
          >
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-cyan-700">
              The Good Fight
            </p>

            <h2 className="mb-5 text-4xl font-light tracking-tight text-slate-950 md:text-5xl">
              It All Matters
            </h2>

            <p className="text-lg leading-relaxed text-slate-600">
              Every step toward better diabetes support matters. Through
              education, emotional care, research, and daily check-ins,
              AIDES-T2D helps people feel less alone while managing Type 2
              Diabetes.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative side tab */}
      <button
        type="button"
        className={`fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 cursor-pointer rounded-l-md bg-[#FFB100] px-3 py-5 text-xs font-bold uppercase tracking-wide text-blue-900 shadow-lg transition-all duration-700 hover:bg-[#ffd966] focus:outline-none focus:ring-2 focus:ring-blue-300 lg:block [writing-mode:vertical-rl] ${
          inView ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        aria-label="Learn More"
        onClick={() => window.open("#about", "_blank")}
      >
        Learn More
      </button>
    </section>
  )
}