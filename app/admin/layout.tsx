import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-semibold text-gray-900">AIDES-T2D Admin</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/admin/keys" className="text-sm text-gray-600 hover:text-gray-900">
              Study Keys
            </Link>
            <Link href="/admin/users" className="text-sm text-gray-600 hover:text-gray-900">
              Users
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user?.email}</span>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-900">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto p-8">
        {children}
      </main>
    </div>
  )
}