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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <AdminSidebar
        email={email}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      {/* Main Content */}
      <div
        className={`flex flex-1 min-w-0 flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* Top Navigation */}
        <TopNav title="Dashboard" email={email} />

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}