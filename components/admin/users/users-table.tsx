export function UsersTable({
    users,
    deleteUser,
    toggleUserRole,
  }: {
    users: any[]
    deleteUser: (id: string) => Promise<void>
    toggleUserRole: (id: string, role: string) => Promise<void>
  }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-white">
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                User
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Study ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Joined
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Actions
              </th>
              <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                Remove
              </th>
            </tr>
          </thead>
  
          <tbody className="divide-y divide-gray-100">
            {users.map((u: any) => (
              <tr key={u.id} className="transition hover:bg-gray-50/70">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 shadow-sm">
                      {u.email?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {u.email}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">User account</p>
                    </div>
                  </div>
                </td>
  
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                      u.role === "ADMIN"
                        ? "bg-violet-50 text-violet-700 ring-violet-100"
                        : "bg-sky-50 text-sky-700 ring-sky-100"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
  
                <td className="px-6 py-4">
                  <span className="inline-flex rounded-xl bg-gray-50 px-2.5 py-1.5 font-mono text-xs text-gray-600 ring-1 ring-gray-100">
                    {u.study_id || "—"}
                  </span>
                </td>
  
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
  
                <td className="px-6 py-4">
                  <form
                    action={async () => {
                      "use server"
                      await toggleUserRole(u.id, u.role)
                    }}
                  >
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                        u.role === "ADMIN"
                          ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100"
                          : "bg-violet-50 text-violet-700 ring-1 ring-violet-100 hover:bg-violet-100"
                      }`}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Make {u.role === "ADMIN" ? "Participant" : "Admin"}
                    </button>
                  </form>
                </td>
  
                <td className="px-4 py-4 text-center">
                  <form
                    action={async () => {
                      "use server"
                      await deleteUser(u.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                      aria-label={`Delete ${u.email}`}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
  
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m12 0H7m10-12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">No users found</p>
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