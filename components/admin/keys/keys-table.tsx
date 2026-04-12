type KeyRow = {
    id: string
    key: string
    is_used: boolean
    created_at: string | Date
    participant_email: string | null
  }
  
  type CopyButtonComponent = React.ComponentType<{ text: string }>
  
  export function KeysTable({
    keys,
    deleteStudyKey,
    CopyButton,
  }: {
    keys: KeyRow[]
    deleteStudyKey: (id: string) => Promise<void>
    CopyButton: CopyButtonComponent
  }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-white">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Study Key
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Assigned Participant
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Created
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
  
          <tbody className="divide-y divide-gray-100">
            {keys.map((k) => (
              <tr key={k.id} className="transition hover:bg-gray-50/70">
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-xl bg-gray-50 px-3 py-1.5 font-mono text-xs font-medium text-gray-800 ring-1 ring-gray-100">
                    {k.key}
                  </span>
                </td>
  
                <td className="px-6 py-4">
                  {k.is_used ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Used
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  )}
                </td>
  
                <td className="px-6 py-4">
                  {k.participant_email ? (
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-medium text-sky-700">
                        {k.participant_email[0].toUpperCase()}
                      </span>
                      <span className="truncate text-sm text-gray-700">
                        {k.participant_email}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm italic text-gray-400">Unassigned</span>
                  )}
                </td>
  
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(k.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
  
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <CopyButton text={k.key} />
  
                    {!k.is_used ? (
                      <form
                        action={async () => {
                          "use server"
                          await deleteStudyKey(k.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex h-10 items-center rounded-xl border border-red-100 bg-white px-3 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
  
            {keys.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">No study keys found</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }