import { query } from "@/lib/db"
import { generateStudyKey, deleteStudyKey } from "@/actions/admin"

export const dynamic = "force-dynamic"

export default async function AdminKeysPage() {
  const keys = await query(
    "SELECT * FROM study_keys ORDER BY created_at DESC"
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Study Keys</h1>
        <form action={async () => {
          "use server"
          await generateStudyKey()
        }}>
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition"
          >
            Generate New Key
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Key</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {keys.rows.map((k: any) => (
              <tr key={k.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">
                  {k.key}
                </td>
                <td className="px-6 py-4">
                  {k.is_used ? (
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                      Used
                    </span>
                  ) : (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      Available
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(k.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {!k.is_used && (
                    <form action={async () => {
                      "use server"
                      await deleteStudyKey(k.id)
                    }}>
                      <button
                        type="submit"
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {keys.rows.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">
            No keys yet. Generate your first key above.
          </p>
        )}
      </div>
    </div>
  )
}