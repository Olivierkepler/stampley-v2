import Link from "next/link"

export function KeysPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  q,
  status,
  sort,
}: {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  q: string
  status: string
  sort: string
}) {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  function buildHref(nextPage: number) {
    const params = new URLSearchParams()

    if (q) params.set("q", q)
    if (status && status !== "ALL") params.set("status", status)
    if (sort) params.set("sort", sort)

    params.set("page", String(nextPage))
    params.set("pageSize", String(pageSize))

    return `?${params.toString()}`
  }

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Showing {from}–{to} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={page > 1 ? buildHref(page - 1) : "#"}
          className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium ${
            page > 1
              ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              : "pointer-events-none border-gray-100 bg-gray-50 text-gray-300"
          }`}
        >
          Previous
        </Link>

        <span className="px-3 text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <Link
          href={page < totalPages ? buildHref(page + 1) : "#"}
          className={`inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium ${
            page < totalPages
              ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              : "pointer-events-none border-gray-100 bg-gray-50 text-gray-300"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  )
}