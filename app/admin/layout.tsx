import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminAppShell } from "@/components/admin/admin-app-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <AdminAppShell email={session.user?.email ?? ""}>
      {children}
    </AdminAppShell>
  )
}