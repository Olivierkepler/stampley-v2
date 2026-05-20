"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const updates = [
  {
    image: "/images/news/family.jpg",
    category: "AIDES-T2D",
    title: "Supporting emotional health in diabetes care",
    text: "Learn how AIDES-T2D explores daily emotional support, reflection, and AI-guided encouragement for people living with Type 2 Diabetes.",
    link: "Learn More",
  },
  {
    image: "/images/news/daily.jpg",
    category: "Diabetes Distress",
    title: "Small check-ins can make a difference",
    text: "Daily check-ins help participants reflect on mood, energy, and diabetes-related stress in a simple and supportive way.",
    link: "Explore Study",
  },
  {
    image: "/images/news/research.jpg",
    category: "Research",
    title: "A 28-day AI support study",
    text: "AIDES-T2D studies how compassionate AI-driven support may help reduce diabetes distress over four weeks.",
    link: "Read More",
  },
  {
    image: "/images/news/stamply.jpg",
    category: "Stampley",
    title: "Meet your AI companion",
    text: "Stampley provides personalized encouragement, micro-skills, and compassionate responses based on each daily check-in.",
    link: "Meet Stampley",
  },
]

export default function WhatsHappeningSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.15,
      }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-white shadow-[inset_0_1px_0_rgba(15,23,42,0.04)] px-6 py-20 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 ease-out ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="mb-4 text-3xl font-light tracking-tight text-slate-950 md:text-4xl">
            What&apos;s Happening?
          </h2>

          <p className="max-w-4xl text-base leading-relaxed text-slate-700 md:text-lg">
            Stay up to date with AIDES-T2D research updates, diabetes support
            resources, study opportunities, and emotional wellness insights.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {updates.map((item, index) => (
            <article
              key={item.title}
              className={`overflow-hidden bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.16)] ${
                inView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
              style={{
                transitionDelay: inView ? `${index * 120}ms` : "0ms",
              }}
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={`object-cover transition-all duration-[1200ms] ease-out ${
                    inView ? "scale-100" : "scale-110"
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex min-h-[300px] flex-col p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-cyan-700">
                  {item.category}
                </p>

                <h3 className="mb-4 text-2xl font-light leading-tight text-slate-950">
                  {item.title}
                </h3>

                <p className="mb-8 text-base leading-relaxed text-slate-600">
                  {item.text}
                </p>

                <a
                  href="#"
                  className="group mt-auto inline-flex w-fit items-center gap-1 border-b-2 border-blue-900 text-sm font-semibold tracking-[0.08em] text-blue-900 transition hover:text-blue-950"
                >
                  {item.link}

                  <ExternalLink
                    size={14}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div
          className={`mt-10 flex justify-end gap-4 transition-all duration-700 ease-out ${
            inView
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: "500ms",
          }}
        >
          <button
            type="button"
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center border border-slate-300 text-slate-300 transition-all duration-300 hover:border-slate-400 hover:text-slate-500"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center border-2 border-blue-900 text-2xl text-blue-900 transition-all duration-300 hover:bg-blue-900 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}