import { query } from "@/lib/db"
import { generateStudyKey, deleteStudyKey } from "@/actions/admin"
import { CopyButton } from "@/components/admin/copy-button"
import { KeysTableToolbar } from "@/components/admin/keys/keys-table-toolbar"
import { KeysTable } from "@/components/admin/keys/keys-table"
import { KeysPagination } from "@/components/admin/keys/keys-pagination"

export const dynamic = "force-dynamic"

type SearchParams = {
  q?: string
  status?: string
  sort?: string
  page?: string
  pageSize?: string
}

const SORT_MAP: Record<string, string> = {
  created_at_desc: "sk.created_at DESC",
  created_at_asc: "sk.created_at ASC",
  key_asc: "sk.key ASC",
  key_desc: "sk.key DESC",
}

export default async function AdminKeysPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const q = (params.q ?? "").trim()
  const status = params.status ?? "ALL"
  const sort = params.sort ?? "created_at_desc"
  const page = Math.max(Number(params.page ?? "1"), 1)
  const pageSize = Math.max(Number(params.pageSize ?? "20"), 1)

  const where: string[] = []
  const values: (string | number | boolean)[] = []

  if (q) {
    values.push(`%${q}%`)
    const i = values.length
    where.push(`(sk.key ILIKE $${i} OR u.email ILIKE $${i})`)
  }

  if (status === "USED") {
    where.push(`sk.is_used = true`)
  } else if (status === "AVAILABLE") {
    where.push(`sk.is_used = false`)
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""
  const orderBy = SORT_MAP[sort] ?? SORT_MAP.created_at_desc

  values.push(pageSize)
  const limitIndex = values.length

  values.push((page - 1) * pageSize)
  const offsetIndex = values.length

  const keysResult = await query(
    `
      SELECT 
        sk.*,
        u.email AS participant_email
      FROM study_keys sk
      LEFT JOIN users u ON u.study_id = sk.key
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
      FROM study_keys sk
      LEFT JOIN users u ON u.study_id = sk.key
      ${whereClause}
    `,
    countValues
  )

  const statsResult = await query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE is_used = true)::int AS used,
      COUNT(*) FILTER (WHERE is_used = false)::int AS available
    FROM study_keys
  `)

  const total = statsResult.rows[0]?.total ?? 0
  const used = statsResult.rows[0]?.used ?? 0
  const available = statsResult.rows[0]?.available ?? 0

  const filteredTotal = countResult.rows[0]?.count ?? 0
  const totalPages = Math.max(Math.ceil(filteredTotal / pageSize), 1)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Study Keys
          </h1>
          <p className="mt-1.5 text-sm text-white">
            {available} available · {used} used · {total} total
          </p>
        </div>

        <form
          action={async () => {
            "use server"
            await generateStudyKey()
          }}
        >
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
          >
            <span className="text-base leading-none">+</span>
            Generate New Key
          </button>
        </form>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
    className="rounded-2xl border border-gray-100 p-5 relative overflow-hidden"
    style={{
      backgroundImage: "url('/images/gradient5.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "right bottom",
      backgroundRepeat: "no-repeat",
    }}
  >
  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Total Keys
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {total}
          </p>
        </div>

      <div
    className="rounded-2xl border border-gray-100 p-5 relative overflow-hidden"
    style={{
      backgroundImage: "url('/images/gradient4.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "right bottom",
      backgroundRepeat: "no-repeat",
    }}
  >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Available
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {available}
          </p>
        </div>

        <div
    className="rounded-2xl border border-gray-100 p-5 relative overflow-hidden"
    style={{
      backgroundImage: "url('/images/gradient3.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "right bottom",
      backgroundRepeat: "no-repeat",
    }}
  >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Used
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {used}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">All Study Keys</h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredTotal} matching key{filteredTotal === 1 ? "" : "s"}
              </p>
            </div>

            <KeysTableToolbar
              q={q}
              status={status}
              sort={sort}
              pageSize={pageSize}
            />
          </div>
        </div>

        <KeysTable
          keys={keysResult.rows}
          deleteStudyKey={async (id: string) => {
            "use server"
            await deleteStudyKey(id)
          }}
          CopyButton={CopyButton}
        />

        <KeysPagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredTotal}
          totalPages={totalPages}
          q={q}
          status={status}
          sort={sort}
        />
      </section>
    </div>
  )
}