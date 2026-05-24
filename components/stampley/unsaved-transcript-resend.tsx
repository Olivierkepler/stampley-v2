"use client"

import { useEffect, useRef } from "react"
import { resendUnsavedTranscriptIfPresent } from "@/lib/stampley-transcript-backup"

/** Silently retries any backed-up Stampley transcript on mount. */
export function UnsavedTranscriptResend() {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    void resendUnsavedTranscriptIfPresent()
  }, [])

  return null
}
