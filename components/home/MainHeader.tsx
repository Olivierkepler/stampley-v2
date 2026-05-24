"use client"

import Image from "next/image"
import { Heart, Menu, Search, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="relative z-50 w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1750px] items-center justify-between px-5 py-5 sm:px-8 lg:px-16 xl:px-24">
        
        {/* Logo */}
        <button
          className="flex items-center focus:outline-none cursor-pointer hover:scale-105 transition-all duration-300"
          onClick={() => window.location.href = "/"}
          aria-label="Go to home page"
          tabIndex={0}
          type="button"
        >
          <Image
            src="/images/stampleylogomain.webp"
            alt="AIDES-T2D"
            width={200}
            height={90}
            priority
            className="h-auto w-[150px] sm:w-[180px] lg:w-[200px]"
          />
        </button>
  

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-5 lg:flex">
          
          {/* Search */}
          <div className="flex h-14 w-[420px] overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-sm transition focus-within:border-blue-900 focus-within:bg-white xl:w-[520px]">
            <input
              type="text"
              placeholder="Search"
              className="h-full min-w-0 flex-1 bg-transparent px-5 text-base text-slate-700 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              aria-label="Search"
              className="flex h-full w-14 cursor-pointer items-center justify-center text-blue-900 transition hover:bg-blue-50"
            >
              <Search size={22} />
            </button>
          </div>

          {/* Donate */}
          <Link
            href="/register" className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-900 px-7 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800">
            {/* <Heart size={20} /> */}
            Register
          </Link>

          {/* Donate Monthly */}
          <Link
            href="/login"className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border-2 border-blue-900 px-7 text-base font-semibold text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-900 hover:text-white">
        Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-5 py-5">
          
          {/* Search */}
      {/* Search */}
<div className="group relative flex h-12 overflow-hidden rounded-full border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
  {/* Subtle gradient glow */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-50/40 via-transparent to-cyan-50/30 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />

  <input
    type="text"
    placeholder="Search articles, research, events..."
    className="relative h-full min-w-0 flex-1 bg-transparent px-6 text-sm font-medium text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400"
  />

  <button
    type="button"
    aria-label="Search"
    className="relative flex h-full w-14 items-center justify-center border-l border-slate-100 text-slate-500 transition-all duration-300 hover:bg-blue-600 hover:text-white active:scale-[0.97]"
  >
    <Search
      size={19}
      strokeWidth={2.3}
      className="transition-transform duration-300 group-hover:scale-105"
    />
  </button>
</div>

          {/* Donate */}
          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-900 px-6 text-sm font-semibold text-white transition hover:bg-blue-800">
            <Heart size={18} />
            Volunteer
          </button>

          {/* Donate Monthly */}
          <button className="flex h-12 w-full items-center justify-center rounded-full border-2 border-blue-900 px-6 text-sm font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white">
            Learn More
          </button>
        </div>
      </div>
    </header>
  )
}