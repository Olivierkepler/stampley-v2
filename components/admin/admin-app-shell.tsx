"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { TopNav } from "@/components/admin/top-nav"

export function AdminAppShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        email={email}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-200 ease-out ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <TopNav title="Dashboard" email={email} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
