export const STUDY_DOMAINS = [
  "Emotional",
  "Regimen",
  "Physician",
  "Interpersonal",
] as const

export type StudyDomain = (typeof STUDY_DOMAINS)[number]

export type AnalyticsFilters = {
  q: string | null
  from: string | null
  to: string | null
  domain: StudyDomain | null
  highStress: boolean
  week: number | null
}

type SearchParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>

function readParam(
  source: SearchParamSource,
  key: string
): string | undefined {
  if (source instanceof URLSearchParams) {
    const value = source.get(key)
    return value ?? undefined
  }
  const raw = source[key]
  if (Array.isArray(raw)) return raw[0]
  return raw
}

function parseDateParam(value: string | undefined): string | null {
  if (!value?.trim()) return null
  const trimmed = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null
  const d = new Date(`${trimmed}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) return null
  return trimmed
}

function parseDomainParam(value: string | undefined): StudyDomain | null {
  if (!value?.trim() || value.trim().toUpperCase() === "ALL") return null
  const trimmed = value.trim()
  return STUDY_DOMAINS.includes(trimmed as StudyDomain)
    ? (trimmed as StudyDomain)
    : null
}

function parseWeekParam(value: string | undefined): number | null {
  if (!value?.trim() || value.trim().toUpperCase() === "ALL") return null
  const week = Number(value)
  if (!Number.isInteger(week) || week < 1 || week > 4) return null
  return week
}

export function parseAnalyticsFilters(
  source: SearchParamSource
): AnalyticsFilters {
  const qRaw = readParam(source, "q")?.trim()
  const highStressRaw = readParam(source, "highStress")

  return {
    q: qRaw && qRaw.length > 0 ? qRaw : null,
    from: parseDateParam(readParam(source, "from")),
    to: parseDateParam(readParam(source, "to")),
    domain: parseDomainParam(readParam(source, "domain")),
    highStress:
      highStressRaw === "true" ||
      highStressRaw === "1" ||
      highStressRaw === "on",
    week: parseWeekParam(readParam(source, "week")),
  }
}

export function hasActiveAnalyticsFilters(filters: AnalyticsFilters): boolean {
  return Boolean(
    filters.q ||
      filters.from ||
      filters.to ||
      filters.domain ||
      filters.highStress ||
      filters.week
  )
}

export function buildAnalyticsQueryString(filters: AnalyticsFilters): string {
  const params = new URLSearchParams()
  if (filters.q) params.set("q", filters.q)
  if (filters.from) params.set("from", filters.from)
  if (filters.to) params.set("to", filters.to)
  if (filters.domain) params.set("domain", filters.domain)
  if (filters.highStress) params.set("highStress", "true")
  if (filters.week != null) params.set("week", String(filters.week))
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export type SqlFilterClause = {
  /** Prefix with AND when appended to WHERE */
  clause: string
  params: unknown[]
}

export function buildCheckInFilterClause(
  filters: AnalyticsFilters,
  options: { c?: string; u?: string; paramOffset?: number } = {}
): SqlFilterClause {
  const c = options.c ?? "c"
  const u = options.u ?? "u"
  const conditions: string[] = []
  const params: unknown[] = []
  let index = options.paramOffset ?? 1

  if (filters.q) {
    conditions.push(`${u}.email ILIKE $${index}`)
    params.push(`%${filters.q}%`)
    index++
  }
  if (filters.from) {
    conditions.push(`${c}.check_in_date >= $${index}::date`)
    params.push(filters.from)
    index++
  }
  if (filters.to) {
    conditions.push(`${c}.check_in_date <= $${index}::date`)
    params.push(filters.to)
    index++
  }
  if (filters.domain) {
    conditions.push(`${c}.domain = $${index}`)
    params.push(filters.domain)
    index++
  }
  if (filters.week != null) {
    conditions.push(`${c}.week_number = $${index}`)
    params.push(filters.week)
    index++
  }
  if (filters.highStress) {
    conditions.push(`${c}.distress >= 9`)
  }

  return {
    clause: conditions.length > 0 ? ` AND ${conditions.join(" AND ")}` : "",
    params,
  }
}

export function buildSessionFilterClause(
  filters: AnalyticsFilters,
  options: {
    s?: string
    u?: string
    c?: string
    paramOffset?: number
  } = {}
): SqlFilterClause {
  const s = options.s ?? "s"
  const u = options.u ?? "u"
  const c = options.c ?? "c"
  const conditions: string[] = []
  const params: unknown[] = []
  let index = options.paramOffset ?? 1

  if (filters.q) {
    conditions.push(`${u}.email ILIKE $${index}`)
    params.push(`%${filters.q}%`)
    index++
  }
  if (filters.from) {
    conditions.push(`${s}.created_at::date >= $${index}::date`)
    params.push(filters.from)
    index++
  }
  if (filters.to) {
    conditions.push(`${s}.created_at::date <= $${index}::date`)
    params.push(filters.to)
    index++
  }
  if (filters.domain) {
    conditions.push(
      `(${s}.domain = $${index} OR ${c}.domain = $${index})`
    )
    params.push(filters.domain)
    index++
  }
  if (filters.week != null) {
    conditions.push(`${c}.week_number = $${index}`)
    params.push(filters.week)
    index++
  }
  if (filters.highStress) {
    conditions.push(
      `(${s}.stress_level >= 9 OR ${c}.distress >= 9)`
    )
  }

  return {
    clause: conditions.length > 0 ? ` AND ${conditions.join(" AND ")}` : "",
    params,
  }
}

/** High-stress table: always distress >= 9, plus shared filters (except highStress duplicate). */
export function buildHighStressTableFilterClause(
  filters: AnalyticsFilters
): SqlFilterClause {
  const withoutHighStressToggle: AnalyticsFilters = {
    ...filters,
    highStress: false,
  }
  const base = buildCheckInFilterClause(withoutHighStressToggle)
  return {
    clause: `${base.clause} AND c.distress >= 9`,
    params: base.params,
  }
}

export function buildParticipantUserFilterClause(
  filters: AnalyticsFilters,
  u = "u",
  paramOffset = 1
): SqlFilterClause {
  if (!filters.q) {
    return { clause: "", params: [] }
  }
  return {
    clause: ` AND ${u}.email ILIKE $${paramOffset}`,
    params: [`%${filters.q}%`],
  }
}

/** Check-in row filters only (no email); for JOIN ON / correlated subqueries. */
export function buildCheckInRowFilterClause(
  filters: AnalyticsFilters,
  c = "c",
  paramOffset = 1
): SqlFilterClause {
  return buildCheckInFilterClause(
    { ...filters, q: null },
    { c, u: "u", paramOffset }
  )
}

/** Stampley session row filters only (no email). */
export function buildSessionRowFilterClause(
  filters: AnalyticsFilters,
  options: { s?: string; c?: string; paramOffset?: number } = {}
): SqlFilterClause {
  const s = options.s ?? "s"
  const c = options.c ?? "c_sess"
  return buildSessionFilterClause(
    { ...filters, q: null },
    { s, u: "u", c, paramOffset: options.paramOffset }
  )
}

export function sqlJoinOn(clause: SqlFilterClause): string {
  if (!clause.clause) return "TRUE"
  return clause.clause.replace(/^ AND /, "")
}
