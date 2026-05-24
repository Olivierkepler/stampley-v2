import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export function escapeCsvValue(value: unknown): string {
  if (value == null) return ""
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function buildCsv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ]
  return lines.join("\n")
}

export function csvFileResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

export function exportFilename(prefix: string): string {
  const dateStamp = new Date().toISOString().slice(0, 10)
  return `${prefix}-${dateStamp}.csv`
}

export function formatCsvTimestamp(value: unknown): string {
  if (value == null || value === "") return ""
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString()
}

export function formatCsvDate(value: unknown): string {
  if (value == null || value === "") return ""
  const d = new Date(String(value))
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toISOString().slice(0, 10)
}

export function formatCsvBoolean(value: unknown): string {
  if (value === true || value === "true" || value === "t") return "true"
  if (value === false || value === "false" || value === "f") return "false"
  return ""
}

export async function requireAdminApi():
  Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }
  if (session.user.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }
  return { ok: true }
}
