import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import CollapsibleSidebar from "@/components/check-in/CollapsibleSidebar"
import Image from "next/image"
export default async function CheckInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")
{/* 
        fontFamily: "'Poppins', sans-serif",
        fontSize: "clamp(25px, 3vw, 40px)", */}
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Top nav */}
      <header className="h-14 bg-white/80 backdrop-blur-sm border-b border-black/[0.06] flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-black/40 hover:text-black/70 transition text-sm hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <Image src="/images/stampleyLogo.png" alt="AIDES-T2D" width={30} height={30} />
          </Link>
          <span className="text-black/20">·</span>
          <span
        
            className="text-[11px] uppercase font-bold tracking-[0.15em] text-black" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(10px, 1vw, 12px)" }}
          >
            Dashboard
          </span>
        </div>


        <p
          style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(10px, 1vw, 12px)" }}
          className="text-[11px] font-bold text-black uppercase tracking-[0.1em]"
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar */}
        <CollapsibleSidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10">
            {children}
          </div>
        </main>

      </div>
    </div>
  )
}