import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type Domain = "Emotional" | "Regimen" | "Physician" | "Interpersonal"

const CHECK_IN_DRAFT_KEY = "stampley-checkin-draft"

export const checkInInitialState = {
  distress: undefined as number | undefined,
  mood: undefined as number | undefined,
  energy: undefined as number | undefined,
  contextTags: [] as string[],
  reflection: "",
  copingAction: "",
  domain: null as Domain | null,
}

export interface CheckInState {
  // Step 1 — Daily Metrics
  distress: number | undefined
  mood: number | undefined
  energy: number | undefined
  // Step 2 — Contextual Factors
  contextTags: string[]
  // Step 3 — Clinical Narrative
  reflection: string
  copingAction: string
  // Step 4 — Weekly Domain
  domain: Domain | null
  // Actions
  setDistress: (v: number) => void
  setMood: (v: number) => void
  setEnergy: (v: number) => void
  setContextTags: (tags: string[]) => void
  setReflection: (v: string) => void
  setCopingAction: (v: string) => void
  setDomain: (d: Domain) => void
  clearDomain: () => void
  reset: () => void
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set) => ({
      ...checkInInitialState,
      setDistress: (v) => set({ distress: v }),
      setMood: (v) => set({ mood: v }),
      setEnergy: (v) => set({ energy: v }),
      setContextTags: (tags) => set({ contextTags: tags }),
      setReflection: (v) => set({ reflection: v }),
      setCopingAction: (v) => set({ copingAction: v }),
      setDomain: (d) => set({ domain: d }),
      clearDomain: () => set({ domain: null }),
      reset: () => {
        set({ ...checkInInitialState })
        void useCheckInStore.persist.clearStorage()
      },
    }),
    {
      name: CHECK_IN_DRAFT_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? sessionStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        distress: state.distress,
        mood: state.mood,
        energy: state.energy,
        contextTags: state.contextTags,
        reflection: state.reflection,
        copingAction: state.copingAction,
        domain: state.domain,
      }),
    }
  )
)
