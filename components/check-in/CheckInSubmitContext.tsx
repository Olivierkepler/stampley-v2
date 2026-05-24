"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

export type CheckInSubmitMeta = {
  submitting: boolean
  loading: boolean
  checkInSaved: boolean
  submitted: boolean
  label?: string
}

export const DEFAULT_CHECK_IN_SUBMIT_META: CheckInSubmitMeta = {
  submitting: false,
  loading: false,
  checkInSaved: false,
  submitted: false,
}

type CheckInSubmitContextValue = {
  register: (fn: (() => void) | null, meta?: CheckInSubmitMeta) => void
  onSubmit: () => void
  meta: CheckInSubmitMeta
}

const CheckInSubmitContext = createContext<CheckInSubmitContextValue | null>(
  null
)

export function CheckInSubmitProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [handler, setHandler] = useState<(() => void) | null>(null)
  const [meta, setMeta] = useState<CheckInSubmitMeta>(
    DEFAULT_CHECK_IN_SUBMIT_META
  )

  const register = useCallback(
    (fn: (() => void) | null, nextMeta?: CheckInSubmitMeta) => {
      setHandler(() => fn)
      if (nextMeta) {
        setMeta(nextMeta)
      } else if (fn === null) {
        setMeta(DEFAULT_CHECK_IN_SUBMIT_META)
      }
    },
    []
  )

  const onSubmit = useCallback(() => {
    handler?.()
  }, [handler])

  const value = useMemo(
    () => ({ register, onSubmit, meta }),
    [register, onSubmit, meta]
  )

  return (
    <CheckInSubmitContext.Provider value={value}>
      {children}
    </CheckInSubmitContext.Provider>
  )
}

export function useCheckInSubmit() {
  const ctx = useContext(CheckInSubmitContext)
  if (!ctx) {
    throw new Error(
      "useCheckInSubmit must be used within CheckInSubmitProvider"
    )
  }
  return ctx
}
