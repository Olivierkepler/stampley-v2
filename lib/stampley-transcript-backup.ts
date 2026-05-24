import type { StoredMessage } from "@/store/conversation-storage"

export const UNSAVED_TRANSCRIPT_STORAGE_KEY = "stampley-unsaved-transcript"

export const STAMPLEY_SESSION_MAX_ATTEMPTS = 3
export const STAMPLEY_SESSION_RETRY_DELAY_MS = 500

export type StampleySessionSavePayload = {
  checkInSubmissionId: string
  domain: string | null
  stressLevel: number
  mood: number
  energy: number
  userMessageCount: number
  assistantMessageCount: number
  summary: string
  messages: StoredMessage[]
}

export type UnsavedTranscriptBackup = {
  checkInSubmissionId: string
  messages: StoredMessage[]
  summary: string
  metrics: {
    domain: string | null
    distress: number
    mood: number
    energy: number
    contextTags: string[]
    reflection: string
    copingAction: string
    weekNumber: number
    dayNumber: number
    subscale: string
  }
  userMessageCount: number
  assistantMessageCount: number
  timestamp: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function backupUnsavedTranscript(backup: UnsavedTranscriptBackup): void {
  const storage = getSessionStorage()
  if (!storage) return
  try {
    storage.setItem(UNSAVED_TRANSCRIPT_STORAGE_KEY, JSON.stringify(backup))
  } catch (err) {
    console.error("[stampley/transcript-backup] failed to write backup:", err)
  }
}

export function readUnsavedTranscript(): UnsavedTranscriptBackup | null {
  const storage = getSessionStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(UNSAVED_TRANSCRIPT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as UnsavedTranscriptBackup
    if (
      typeof parsed.checkInSubmissionId !== "string" ||
      !parsed.checkInSubmissionId.trim()
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearUnsavedTranscript(): void {
  const storage = getSessionStorage()
  if (!storage) return
  try {
    storage.removeItem(UNSAVED_TRANSCRIPT_STORAGE_KEY)
  } catch (err) {
    console.error("[stampley/transcript-backup] failed to clear backup:", err)
  }
}

export async function saveStampleySessionWithRetry(
  payload: StampleySessionSavePayload,
  options?: { maxAttempts?: number; delayMs?: number }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const maxAttempts = options?.maxAttempts ?? STAMPLEY_SESSION_MAX_ATTEMPTS
  const delayMs = options?.delayMs ?? STAMPLEY_SESSION_RETRY_DELAY_MS
  let lastError = "Unknown error"

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch("/api/stampley/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        if (attempt > 1) {
          console.info(
            `[stampley/session] saved on retry attempt ${attempt}/${maxAttempts}`
          )
        }
        return { ok: true }
      }

      lastError = await res.text()
      console.warn(
        `[stampley/session] attempt ${attempt}/${maxAttempts} failed:`,
        lastError
      )
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
      console.warn(
        `[stampley/session] attempt ${attempt}/${maxAttempts} error:`,
        lastError
      )
    }

    if (attempt < maxAttempts) {
      await delay(delayMs)
    }
  }

  console.error(
    `[stampley/session] all ${maxAttempts} attempts failed for check-in ${payload.checkInSubmissionId}:`,
    lastError
  )
  return { ok: false, error: lastError }
}

export function backupFromSessionPayload(
  payload: StampleySessionSavePayload,
  metrics: UnsavedTranscriptBackup["metrics"]
): UnsavedTranscriptBackup {
  return {
    checkInSubmissionId: payload.checkInSubmissionId,
    messages: payload.messages,
    summary: payload.summary,
    metrics,
    userMessageCount: payload.userMessageCount,
    assistantMessageCount: payload.assistantMessageCount,
    timestamp: new Date().toISOString(),
  }
}

export function sessionPayloadFromBackup(
  backup: UnsavedTranscriptBackup
): StampleySessionSavePayload {
  return {
    checkInSubmissionId: backup.checkInSubmissionId,
    domain: backup.metrics.domain,
    stressLevel: backup.metrics.distress,
    mood: backup.metrics.mood,
    energy: backup.metrics.energy,
    userMessageCount: backup.userMessageCount,
    assistantMessageCount: backup.assistantMessageCount,
    summary: backup.summary,
    messages: backup.messages,
  }
}

/** Attempt to upload a previously backed-up transcript. Clears backup on success. */
export async function resendUnsavedTranscriptIfPresent(): Promise<boolean> {
  const backup = readUnsavedTranscript()
  if (!backup) return false

  console.info(
    `[stampley/transcript-backup] resending unsaved transcript for check-in ${backup.checkInSubmissionId} (saved ${backup.timestamp})`
  )

  const result = await saveStampleySessionWithRetry(
    sessionPayloadFromBackup(backup)
  )

  if (result.ok) {
    clearUnsavedTranscript()
    console.info(
      `[stampley/transcript-backup] resend succeeded for check-in ${backup.checkInSubmissionId}`
    )
    return true
  }

  console.warn(
    `[stampley/transcript-backup] resend failed for check-in ${backup.checkInSubmissionId}; backup retained`
  )
  return false
}
