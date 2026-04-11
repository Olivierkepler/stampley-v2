import { query } from "@/lib/db"
import { deleteUser, createUser } from "@/actions/admin"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const users = await query(
    "SELECT id, email, role, study_id, created_at FROM users ORDER BY created_at DESC"
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Users</h1>

      {/* Add User Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-medium text-gray-900 mb-4">Add User</h2>
        <form action={async () => {
          "use server"
          const formData = new FormData()
          formData.append("email", "test@gmail.com")
          formData.append("password", "test1234")
          formData.append("role", "PARTICIPANT")
          await createUser(formData)
        }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-gray-400 flex-1"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-gray-400 flex-1"
          />
          <select
            name="role"
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-gray-400"
          >
            <option value="PARTICIPANT">Participant</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Study ID</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.rows.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {u.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    u.role === "ADMIN"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-blue-50 text-blue-700"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {u.study_id || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <form action={async () => {
                    "use server"
                    await deleteUser(u.id)
                  }}>
                    <button
                      type="submit"
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}