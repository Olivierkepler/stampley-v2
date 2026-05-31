// components/stampley/stampley-header.tsx

"use client"

import Image from "next/image"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

interface StampleyHeaderProps {
  step?: string
  title?: string
  subtitle?: string
}

export default function StampleyHeader({
  step = "Step 5 of 5",
  title = "Stampley Support",
  subtitle = "Daily reflection support",
}: StampleyHeaderProps) {
  return (
    <header
    className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/[0.06] bg-white/95 px-4 backdrop-blur-md md:h-16 md:px-6"
    style={{ fontFamily: "'Poppins', sans-serif" }}
  >
    <Link
      href="/dashboard"
      className="flex min-w-0 items-center gap-3 transition-all duration-200 hover:scale-[1.015] hover:opacity-90 active:scale-[0.98]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
        <Image
          src="/images/stampleyLogo.png"
          alt="Stampley"
          width={28}
          height={28}
          className="h-auto w-auto object-contain"
          priority
        />
      </div>
  
      <div className="min-w-0">
        <h1 className="truncate text-[16px] font-['Poppins',sans-serif] font-medium text-black">
          {title}
        </h1>
  
        {subtitle && (
          <p className="hidden text-[16px] font-['Poppins',sans-serif] text-black/60 md:block">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="group flex cursor-pointer items-center gap-2 bg-white px-3.5 py-2 text-[16px] font-['Poppins',sans-serif] text-black transition-all duration-200 hover:-translate-y-[1px] hover:text-black active:translate-y-0"
    >
      <LogOut
        size={14}
        className="transition-transform duration-200 group-hover:-translate-x-[1px]"
      />
  
      <span className="hidden sm:inline">Sign out</span>
    </button>
  </header>
  )
}