"use client"

import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Microscope,
  Users,
} from "lucide-react"

const menuItems = ["Our Team", "Research", "News & Events", "About"]

const pageLinks: Record<string, string> = {
  About: "/about",
}

const dropdowns = {
  "Our Team": {
    title: "Our Team",
    left: [
      "Leadership",
      "Medical Team",
      "Researchers",
      "Volunteers",
      "Community Partners",
    ],
    middle: [
      "Board Members",
      "Advisors",
      "Student Interns",
      "Care Coordinators",
    ],
    cards: [
      {
        icon: Users,
        title: "Meet Our Team",
        text: "Learn about the people behind our mission",
      },
      {
        icon: Users,
        title: "Volunteer With Us",
        text: "Join our team and support the community",
      },
      {
        icon: Users,
        title: "Partner With Us",
        text: "Work with us to improve diabetes care",
      },
    ],
  },

  Research: {
    title: "Research",
    left: [
      "Current Studies",
      "Clinical Trials",
      "Type 2 Diabetes Research",
      "Prevention Studies",
    ],
    middle: [
      "Publications",
      "Data & Reports",
      "Innovation Lab",
      "Research Partners",
    ],
    cards: [
      {
        icon: Microscope,
        title: "Explore Research",
        // href = "",
        text: "See our latest diabetes studies and findings",
      },
      {
        icon: Microscope,
        title: "Join a Study",
        text: "Find opportunities to participate in research",
      },
      {
        icon: Microscope,
        title: "Research News",
        text: "Read updates from our research team",
      },
    ],
  },

  "News & Events": {
    title: "News & Events",
    left: [
      "Latest News",
      "Upcoming Events",
      "Community Outreach",
      "Workshops",
    ],
    middle: [
      "Webinars",
      "Health Fairs",
      "Announcements",
      "Press Releases",
    ],
    cards: [
      {
        icon: CalendarDays,
        title: "Upcoming Events",
        text: "Find diabetes education and community events",
      },
      {
        icon: CalendarDays,
        title: "Latest News",
        text: "Stay updated with our newest stories",
      },
      {
        icon: CalendarDays,
        title: "Community Programs",
        text: "Discover local programs and outreach",
      },
    ],
  },
} as const

type DropdownKey = keyof typeof dropdowns

export default function MenuBar() {
  return (
    <nav
      className="relative z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <ul className="flex h-full flex-1 items-center justify-center gap-1 text-[15px] font-medium tracking-[-0.01em] text-slate-700 xl:gap-2">
          {menuItems.map((item) => {
            const dropdown = dropdowns[item as DropdownKey]
            const href = pageLinks[item] ?? "#"

            if (!dropdown) {
              return (
                <li key={item} className="h-full">
                  <Link
                    href={href}
                    className="group relative flex h-full items-center px-3 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200 hover:text-blue-600 focus-visible:text-blue-600 focus-visible:outline-none sm:px-4 xl:px-5"
                  >
                    <span className="relative   ">
                      {item}

                      <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] origin-center scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
               
                  </Link>
                </li>
              )
            }

            return (
              <li key={item} className="group h-full">
                <button
                  className="relative cursor-pointer flex h-full items-center gap-1.5 px-3 text-[16px] font-medium tracking-[-0.01em] transition-colors duration-200 group-hover:text-blue-600 focus-visible:text-blue-600 focus-visible:outline-none sm:px-4 xl:px-5"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="relative">
                    {item}

                    <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] origin-center scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />
                  </span>

                  <ChevronDown
                    size={14}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>

                {/* Dropdown */}
                <div className="invisible fixed left-0 right-0 top-16 z-40 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="border-b border-slate-200 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]">
                    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-[1.3fr_1fr]">
                      {/* Links */}
                      <div className="grid grid-cols-2 gap-6 px-6 py-8 sm:gap-10 sm:px-10 sm:py-12 xl:gap-14 xl:px-14 xl:py-14">
                        <div>
                          <h3 className="mb-5 text-[16px] font-semibold uppercase tracking-[0.18em] text-blue-900">
                            {dropdown.title}
                          </h3>

                          <ul className="space-y-3.5">
                            {dropdown.left.map((link) => (
                              <li key={link}>
                                <a
                                  href="#"
                                  className="group/link inline-flex items-center text-[17px] font-medium leading-[1.4] tracking-[-0.01em] text-black transition-colors duration-200 hover:text-blue-600"
                                >
                                  <span className="relative">
                                    {link}

                                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-600 transition-all duration-300 group-hover/link:w-full" />
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-[42px]">
                          <ul className="space-y-3.5">
                            {dropdown.middle.map((link) => (
                              <li key={link}>
                                <a
                                  href="#"
                                  className="group/link inline-flex items-center text-[18px] font-medium leading-[1.4] tracking-[-0.01em] text-black transition-colors duration-200 hover:text-blue-600"
                                >
                                  <span className="relative">
                                    {link}

                                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-600 transition-all duration-300 group-hover/link:w-full" />
                                  </span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Cards */}
                      <div className="hidden  bg-blue-900 px-6 py-8 sm:px-8 sm:py-12 xl:px-12 xl:py-14 lg:block">

{/* Decorative Logo-Inspired Background */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* Large White Arc */}
  <div className="absolute left-[-120px] top-[-80px] h-[420px] w-[420px] rounded-full border-[2px] border-white/20" />

  {/* Yellow swoosh */}
  <div className="absolute right-[1%] top-[22%] h-[140px] w-[340px] rotate-[-18deg] rounded-[100%] border-t-[22px] border-[#f6b800]/30 blur-[0.4px]" />

  {/* White swoosh */}
  <div className="absolute right-[12%] top-[35%] h-[220px] w-[420px] rotate-[-22deg] rounded-[100%] border-l-[16px] border-white/20" />

  {/* Top dot */}
  <div className="absolute right-[18%] top-[18%] h-5 w-5 rounded-full bg-white/50" />

  {/* Soft glow */}
  <div className="absolute right-[-120px] top-[-100px] h-[320px] w-[320px] rounded-full bg-blue-300/10 blur-3xl" />

 
</div>


                        <ul className="space-y-2">
                          {dropdown.cards.map(({ icon: Icon, title, text }) => (
                            <li key={title}>
                              <a
                                href="#"
                                className="group/card flex items-start gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-transparent hover:shadow-sm"
                              >
                                {/* <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-100 transition-all duration-200 group-hover/card:bg-blue-50 group-hover/card:ring-blue-100">
                                  <Icon size={20} strokeWidth={1.8} />
                                </div> */}

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-trasparent text-white shadow-sm ring-1 ring-slate-100 transition-all duration-200  group-hover/card:ring-[#FFB100]">
                                  <Icon size={20} strokeWidth={1.8} />
                                </div>
                               

                                <div className="flex-1 pt-0.5">
                                  <h4 className="mb-1 flex items-center gap-1.5 text-[18px] font-semibold tracking-[-0.015em] text-white transition-colors duration-200 group-hover/card:text-[#FFB100]">
                                    {title}

                                    <ArrowRight
                                      size={14}
                                      strokeWidth={2.5}
                                      className="-translate-x-1 opacity-0 transition-all duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100"
                                    />
                                  </h4>

                                  <p className="text-[14px] font-normal leading-[1.65] tracking-[-0.01em] text-white">
                                    {text}
                                  </p>
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}