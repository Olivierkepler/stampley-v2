import { query } from "@/lib/db"
import { generateStudyKey, deleteStudyKey } from "@/actions/admin"
import { CopyButton } from "@/components/admin/copy-button"

export const dynamic = "force-dynamic"

export default async function AdminKeysPage() {
  const keys = await query(`
    SELECT 
      sk.*,
      u.email as participant_email
    FROM study_keys sk
    LEFT JOIN users u ON u.study_id = sk.key
    ORDER BY sk.created_at DESC
  `)

  const total = keys.rows.length
  const used = keys.rows.filter((k: any) => k.is_used).length
  const available = total - used

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Study Keys</h1>
          <p className="text-sm text-gray-500 mt-1">
            {available} available · {used} used · {total} total
          </p>
        </div>
        <form action={async () => {
          "use server"
          await generateStudyKey()
        }}>
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-700 transition flex items-center gap-2"
          >
            <span>+</span>
            Generate New Key
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Keys</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Available</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{available}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Used</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{used}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Study Key
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Assigned Participant
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Created
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {keys.rows.map((k: any) => (
              <tr key={k.id} className="hover:bg-gray-50 transition-colors">

                {/* Key */}
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {k.key}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {k.is_used ? (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Used
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Available
                    </span>
                  )}
                </td>

                {/* Participant Email */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {k.participant_email ? (
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium">
                        {k.participant_email[0].toUpperCase()}
                      </span>
                      {k.participant_email}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Created */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(k.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    
                    {/* Copy button - client component */}
                    <CopyButton text={k.key} />

                    {/* Delete - only for unused keys */}
                    {!k.is_used && (
                      <form action={async () => {
                        "use server"
                        await deleteStudyKey(k.id)
                      }}>
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 rounded px-2 py-1 transition"
                        >
                          Delete
                        </button>
                      </form>
                    )}

                    {k.is_used && (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {keys.rows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No study keys yet.</p>
            <p className="text-gray-400 text-xs mt-1">
              Generate your first key using the button above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}