"use client"

import Image from "next/image"
import { Menu, Search, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated" && !!session?.user

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <header className="relative z-50 w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1750px] items-center justify-between px-5 py-5 sm:px-8 lg:px-16 xl:px-24">
        <button
          className="flex cursor-pointer items-center transition-all duration-300 hover:scale-105 focus:outline-none"
          onClick={() => (window.location.href = "/")}
          aria-label="Go to home page"
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

        <div className="hidden items-center gap-5 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-blue-900 px-7 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border-2 border-blue-900 px-7 text-base font-semibold text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-900 hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-blue-900 px-7 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Register
              </Link>

              <Link
                href="/login"
                className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border-2 border-blue-900 px-7 text-base font-semibold text-blue-900 transition hover:-translate-y-0.5 hover:bg-blue-900 hover:text-white"
              >
                Login
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-5 py-5">
          <div className="group relative flex h-12 overflow-hidden rounded-full border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
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
              <Search size={19} strokeWidth={2.3} />
            </button>
          </div>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-blue-900 px-6 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex h-12 w-full items-center justify-center rounded-full border-2 border-blue-900 px-6 text-sm font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-blue-900 px-6 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Register
              </Link>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full border-2 border-blue-900 px-6 text-sm font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}