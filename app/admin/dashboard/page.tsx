import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [usersResult, keysResult] = await Promise.all([
    query("SELECT COUNT(*) FROM users WHERE role = 'PARTICIPANT'"),
    query("SELECT COUNT(*) FROM study_keys WHERE is_used = FALSE"),
  ])

  const totalParticipants = usersResult.rows[0].count
  const availableKeys = keysResult.rows[0].count

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Total Participants</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">
            {totalParticipants}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Available Study Keys</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">
            {availableKeys}
          </p>
        </div>
      </div>
    </div>
  )
}