import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {session.user?.email}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-medium text-gray-900 mb-1">
              Daily Check-in
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              How are you feeling today?
            </p>
            <Link
              href="/check-in"
              className="inline-block bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition"
            >
              Start Check-in
            </Link>
          </div>

          {session.user?.role === "ADMIN" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-medium text-gray-900 mb-1">
                Admin Portal
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Manage users and study keys
              </p>
              <Link
                href="/admin"
                className="inline-block bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition"
              >
                Go to Admin
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}