import { create } from "zustand"

export type Domain = "Emotional" | "Regimen" | "Physician" | "Interpersonal"

export interface CheckInState {
  // Step 1 — Daily Metrics
  distress: number
  mood: number
  energy: number
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
  reset: () => void
}

export const useCheckInStore = create<CheckInState>((set) => ({
  distress: 5,
  mood: 5,
  energy: 5,
  contextTags: [],
  reflection: "",
  copingAction: "",
  domain: null,
  setDistress: (v) => set({ distress: v }),
  setMood: (v) => set({ mood: v }),
  setEnergy: (v) => set({ energy: v }),
  setContextTags: (tags) => set({ contextTags: tags }),
  setReflection: (v) => set({ reflection: v }),
  setCopingAction: (v) => set({ copingAction: v }),
  setDomain: (d) => set({ domain: d }),
  reset: () => set({
    distress: 5,
    mood: 5,
    energy: 5,
    contextTags: [],
    reflection: "",
    copingAction: "",
    domain: null,
  }),
}))