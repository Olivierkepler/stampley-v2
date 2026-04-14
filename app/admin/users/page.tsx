import { query } from "@/lib/db"
import { deleteUser, toggleUserRole } from "@/actions/admin"
import { AddUserForm } from "@/components/admin/add-user-form"
import { UsersTableToolbar } from "@/components/admin/users/users-table-toolbar"
import { UsersTable } from "@/components/admin/users/users-table"
import { UsersPagination } from "@/components/admin/users/users-pagination"

export const dynamic = "force-dynamic"

type SearchParams = {
  q?: string
  role?: string
  sort?: string
  page?: string
  pageSize?: string
}

const SORT_MAP: Record<string, string> = {
  created_at_desc: "created_at DESC",
  created_at_asc: "created_at ASC",
  email_asc: "email ASC",
  email_desc: "email DESC",
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const q = (params.q ?? "").trim()
  const role = params.role ?? "ALL"
  const sort = params.sort ?? "created_at_desc"
  const page = Math.max(Number(params.page ?? "1"), 1)
  const pageSize = Math.max(Number(params.pageSize ?? "20"), 1)

  const where: string[] = []
  const values: any[] = []

  if (q) {
    values.push(`%${q}%`)
    const i = values.length
    where.push(`(email ILIKE $${i} OR CAST(study_id AS TEXT) ILIKE $${i})`)
  }

  if (role !== "ALL") {
    values.push(role)
    where.push(`role = $${values.length}`)
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""
  const orderBy = SORT_MAP[sort] ?? SORT_MAP.created_at_desc

  values.push(pageSize)
  const limitIndex = values.length

  values.push((page - 1) * pageSize)
  const offsetIndex = values.length

  const usersResult = await query(
    `
      SELECT id, email, role, study_id, created_at
      FROM users
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${limitIndex}
      OFFSET $${offsetIndex}
    `,
    values
  )

  const countValues = values.slice(0, values.length - 2)

  const countResult = await query(
    `
      SELECT COUNT(*)::int AS count
      FROM users
      ${whereClause}
    `,
    countValues
  )

  const totalUsers = countResult.rows[0]?.count ?? 0
  const totalPages = Math.max(Math.ceil(totalUsers / pageSize), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Users
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Manage admins and participants.
        </p>
      </div>

      <AddUserForm />

      <section className="overflow-hidden rounded-xl border border-gray-200/80 bg-white ">
        <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">All Users</h2>
              <p className="mt-1 text-sm text-gray-500">
                {totalUsers} total user{totalUsers === 1 ? "" : "s"}
              </p>
            </div>

            <UsersTableToolbar
              q={q}
              role={role}
              sort={sort}
              pageSize={pageSize}
            />
          </div>
        </div>

        <UsersTable
          users={usersResult.rows}
          deleteUser={async (id: string) => {
            "use server"
            await deleteUser(id)
          }}
          toggleUserRole={async (id: string, role: string) => {
            "use server"
            await toggleUserRole(id, role)
          }}
        />

        <UsersPagination
          page={page}
          pageSize={pageSize}
          totalUsers={totalUsers}
          totalPages={totalPages}
        />
      </section>
    </div>
  )
}