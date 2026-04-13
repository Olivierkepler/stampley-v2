"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

export function UsersTableToolbar({
  q,
  role,
  sort,
  pageSize,
}: {
  q: string
  role: string
  sort: string
  pageSize: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(q)
  const [isPending, startTransition] = useTransition()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (!value || value === "ALL") {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    params.set("page", "1")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function submitSearch() {
    updateParam("q", search)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitSearch()
          }}
          placeholder="Search email or study ID"
          className="h-11 w-72 rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-900  outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
        />
        <button
          type="button"
          onClick={submitSearch}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Search users"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <select
        value={role}
        onChange={(e) => updateParam("role", e.target.value)}
        className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900  outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
      >
        <option value="ALL">All roles</option>
        <option value="ADMIN">Admin</option>
        <option value="PARTICIPANT">Participant</option>
      </select>

      <select
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900  outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
      >
        <option value="created_at_desc">Newest</option>
        <option value="created_at_asc">Oldest</option>
        <option value="email_asc">Email A–Z</option>
        <option value="email_desc">Email Z–A</option>
      </select>

      <select
        value={String(pageSize)}
        onChange={(e) => updateParam("pageSize", e.target.value)}
        className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900  outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
      >
        <option value="10">10 / page</option>
        <option value="20">20 / page</option>
        <option value="50">50 / page</option>
      </select>

      {isPending && (
        <span className="text-xs text-gray-400">Updating...</span>
      )}
    </div>
  )
}