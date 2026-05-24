import type { StoredMessage } from "@/store/conversation-storage"

export const ACTIVE_CHAT_DRAFT_STORAGE_KEY = "stampley-active-chat-draft"

export const ACTIVE_CHAT_DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000

export type ActiveChatSnapshot = {
  distress: number
  mood: number
  energy: number
  domain: string | null
  contextTags: string[]
  reflection: string
  copingAction: string
  weekNumber: number
  dayNumber: number
  subscale: string
}

export type ActiveChatDraft = {
  chatStarted: true
  chatSnapshot: ActiveChatSnapshot
  messages: StoredMessage[]
  currentConvId: string | null
  expandedCard: string | null
  activeView: "chat" | "results"
  weekNumber: number
  dayNumber: number
  subscale: string
  timestamp: string
}

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function isValidMessage(msg: unknown): msg is StoredMessage {
  if (typeof msg !== "object" || msg === null) return false
  const m = msg as StoredMessage
  return (
    typeof m.id === "string" &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.timestamp === "string"
  )
}

function isValidSnapshot(snapshot: unknown): snapshot is ActiveChatSnapshot {
  if (typeof snapshot !== "object" || snapshot === null) return false
  const s = snapshot as ActiveChatSnapshot
  return (
    Number.isFinite(Number(s.distress)) &&
    Number.isFinite(Number(s.mood)) &&
    Number.isFinite(Number(s.energy)) &&
    (s.domain === null || typeof s.domain === "string") &&
    Array.isArray(s.contextTags) &&
    typeof s.reflection === "string" &&
    typeof s.copingAction === "string" &&
    Number.isFinite(Number(s.weekNumber)) &&
    Number.isFinite(Number(s.dayNumber)) &&
    typeof s.subscale === "string"
  )
}

export function readActiveChatDraft(): ActiveChatDraft | null {
  const storage = getSessionStorage()
  if (!storage) return null

  try {
    const raw = storage.getItem(ACTIVE_CHAT_DRAFT_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as ActiveChatDraft

    if (parsed.chatStarted !== true) return null
    if (!isValidSnapshot(parsed.chatSnapshot)) return null
    if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return null
    }
    if (!parsed.messages.every(isValidMessage)) return null

    const ts = Date.parse(parsed.timestamp)
    if (!Number.isFinite(ts)) return null
    if (Date.now() - ts > ACTIVE_CHAT_DRAFT_MAX_AGE_MS) {
      clearActiveChatDraft()
      return null
    }

    const activeView =
      parsed.activeView === "results" ? "results" : "chat"

    return {
      chatStarted: true,
      chatSnapshot: parsed.chatSnapshot,
      messages: parsed.messages,
      currentConvId:
        typeof parsed.currentConvId === "string"
          ? parsed.currentConvId
          : null,
      expandedCard:
        typeof parsed.expandedCard === "string" ? parsed.expandedCard : null,
      activeView,
      weekNumber: Number(parsed.weekNumber) || parsed.chatSnapshot.weekNumber,
      dayNumber: Number(parsed.dayNumber) || parsed.chatSnapshot.dayNumber,
      subscale:
        typeof parsed.subscale === "string"
          ? parsed.subscale
          : parsed.chatSnapshot.subscale,
      timestamp: parsed.timestamp,
    }
  } catch {
    clearActiveChatDraft()
    return null
  }
}

export function writeActiveChatDraft(draft: ActiveChatDraft): void {
  const storage = getSessionStorage()
  if (!storage) return

  try {
    storage.setItem(ACTIVE_CHAT_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  } catch (err) {
    console.error("[stampley/active-chat-draft] failed to save:", err)
  }
}

export function clearActiveChatDraft(): void {
  const storage = getSessionStorage()
  if (!storage) return

  try {
    storage.removeItem(ACTIVE_CHAT_DRAFT_STORAGE_KEY)
  } catch (err) {
    console.error("[stampley/active-chat-draft] failed to clear:", err)
  }
}

export async function fetchCheckedInToday(): Promise<boolean | null> {
  try {
    const res = await fetch("/api/check-in/today", { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return Boolean(data.checkedInToday)
  } catch {
    return null
  }
}
