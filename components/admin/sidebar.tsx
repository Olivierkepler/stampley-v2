"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const navItems = [
  {
    section: "Overview",
    links: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Management",
    links: [
      {
        href: "/admin/users",
        label: "Users",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        href: "/admin/keys",
        label: "Study Keys",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        ),
      },
      {
        href: "/admin/check-ins",
        label: "Check-ins",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Study",
    links: [
      {
        href: "/admin/safety",
        label: "Safety Alerts",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
      {
        href: "/admin/analytics",
        label: "Analytics",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
]

interface AdminSidebarProps {
  email: string
  collapsed: boolean
  onToggleCollapse: () => void
}

export function AdminSidebar({
  email,
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed z-30 flex h-full flex-col border-r border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.08)] transition-[width] duration-300 ease-out ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div
        className={`shrink-0 border-b border-slate-200/70 ${
          collapsed ? "px-3 py-4" : "px-5 py-5"
        }`}
      >
        <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-3"}`}>
          {!collapsed ? (
            <>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  {/* <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-lg shadow-slate-900/20">
                    <span className="text-sm font-semibold">A</span>
                  </div> */}
                  <Image
                    src="/images/stampleyLogo.png"
                    alt="AIDES-T2D"
                    width={32}
                    height={32}
                    style={{ width: 32, height: "auto" }}
                  />
                  <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold tracking-wide text-slate-900">
                      AIDES-T2D
                    </h1>
                    <p className="mt-0.5 text-xs text-slate-500">Admin Portal</p>
                  </div>
            
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <>
                {/* <Image src="/images/stampleyLogo.png" alt="AIDES-T2D" width={32} height={32} /> */}

              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="border-b border-slate-200/70 px-5 py-4">
          <div className="group relative">
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search navigation..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-200/50"
            />
          </div>
        </div>
      )}

      <nav className={`flex-1 overflow-y-auto py-5 ${collapsed ? "px-3" : "px-4"}`}>
        <div className="space-y-6">
          {navItems.map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <div className="mb-2 px-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {section.section}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                {section.links.map((link) => {
                  const isActive = pathname === link.href

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      title={collapsed ? link.label : undefined}
                      className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                        collapsed ? "justify-center px-2 py-3" : "gap-3 px-3.5 py-3"
                      } ${
                        isActive
                          ? " text-black shadow-lg shadow-slate-900/15 "
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      {!collapsed && isActive && (
                        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-900 -translate-x-4" />
                      )}

                      <span
                        className={`relative shrink-0 transition ${
                          isActive
                            ? "text-blue-900"
                            : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      >
                        {link.icon}
                      </span>

                      {!collapsed && (
                        <span className="truncate">{link.label}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className={`border-t border-slate-200/70 p-4 ${collapsed ? "px-3" : ""}`}>
        <div
          className={`rounded-2xl border border-slate-200/80 bg-slate-50/70 shadow-sm ${
            collapsed ? "p-2.5" : "p-3"
          }`}
        >
          <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-3"}`}>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-semibold text-white shadow-md"
              title={collapsed ? email : undefined}
            >
              {email[0]?.toUpperCase() ?? "?"}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{email}</p>
                <p className="mt-0.5 text-xs text-slate-500">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}