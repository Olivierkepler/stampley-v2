import Link from "next/link"

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
    <div className="overflow-hidden  border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-300 bg-slate-50 px-6 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          User Management
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Review participant records, survey status, roles, and account actions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#005ea8]">
            <tr>
              {[
                "User",
                "Role",
                "Pre-Survey",
                "Check",
                "Study ID",
                "Joined",
                "Actions",
                "Remove",
              ].map((header) => (
                <th
                  key={header}
                  className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {users.map((u: any) => (
              <tr key={u.id} className="bg-white transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center  border border-slate-300 bg-slate-100 text-sm font-bold text-slate-700">
                      {u.email?.[0]?.toUpperCase() ?? "?"}
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="truncate text-sm font-semibold text-[#005ea8] underline-offset-2 hover:underline"
                      >
                        {u.email}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        View participant profile
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex  border px-2.5 py-1 text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                        : "border-blue-300 bg-blue-50 text-blue-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {u.pre_survey_completed_at ? (
                    <span className="inline-flex  border border-green-300 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex  border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex  border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {u.checkin_count ?? 0}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex  border border-slate-300 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700">
                    {u.study_id || "—"}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">
                  <form
                    action={async () => {
                      "use server"
                      await toggleUserRole(u.id, u.role)
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2  border border-[#005ea8] bg-white px-3 py-2 text-xs font-semibold text-[#005ea8] transition hover:bg-[#eef7ff] focus:outline-none focus:ring-2 focus:ring-[#005ea8] focus:ring-offset-2"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Make {u.role === "ADMIN" ? "Participant" : "Admin"}
                    </button>
                  </form>
                </td>

                <td className="px-5 py-4 text-center">
                  <form
                    action={async () => {
                      "use server"
                      await deleteUser(u.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex h-9 w-9 items-center justify-center  border border-slate-300 bg-white text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
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
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center  border border-slate-300 bg-slate-50 text-slate-500">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m12 0H7m10-12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      No users found
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Try changing your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}