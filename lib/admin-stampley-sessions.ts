import type {
  StampleyAssistantData,
  StampleyChatMessage,
  AdminStampleySession,
} from "@/components/admin/stampley-chats/stampley-session-card"

function parseAssistantData(raw: unknown): StampleyAssistantData | undefined {
  if (!raw || typeof raw !== "object") return undefined
  const d = raw as Record<string, unknown>
  const data: StampleyAssistantData = {}

  for (const key of [
    "greeting",
    "validation",
    "reflection_question",
    "micro_skill",
    "education_chip",
    "closure",
  ] as const) {
    const value = d[key]
    if (typeof value === "string" && value.trim()) {
      data[key] = value
    }
  }

  return Object.keys(data).length > 0 ? data : undefined
}

export function parseStoredStampleyMessages(raw: unknown): StampleyChatMessage[] {
  if (!Array.isArray(raw) || raw.length === 0) return []

  return raw.flatMap((item, index): StampleyChatMessage[] => {
    if (!item || typeof item !== "object") return []
    const m = item as Record<string, unknown>
    const role = m.role
    if (role !== "user" && role !== "assistant") return []

    return [
      {
        id: typeof m.id === "string" ? m.id : `${role}-${index}`,
        role,
        content: typeof m.content === "string" ? m.content : undefined,
        timestamp: typeof m.timestamp === "string" ? m.timestamp : undefined,
        data: role === "assistant" ? parseAssistantData(m.data) : undefined,
      },
    ]
  })
}

export function mapStampleySessionRow(
  row: Record<string, unknown>
): AdminStampleySession {
  const messages = parseStoredStampleyMessages(row.messages)

  return {
    id: String(row.id),
    userId: String(row.user_id),
    email: String(row.email ?? ""),
    checkInDate: row.check_in_date
      ? new Date(String(row.check_in_date)).toISOString()
      : null,
    domain: row.domain != null ? String(row.domain) : null,
    stressLevel:
      row.stress_level != null && row.stress_level !== ""
        ? Number(row.stress_level)
        : null,
    mood:
      row.mood != null && row.mood !== "" ? Number(row.mood) : null,
    energy:
      row.energy != null && row.energy !== ""
        ? Number(row.energy)
        : null,
    userMessageCount: Number(row.user_message_count ?? 0),
    assistantMessageCount: Number(row.assistant_message_count ?? 0),
    summary: row.summary != null ? String(row.summary) : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    messages,
  }
}
