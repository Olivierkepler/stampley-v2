import { create } from 'zustand';

// --- 1. CLINICAL DATA & DOMAIN SUBSCALES ---
export type FocusDomain = 
  | "Physician-related distress" 
  | "Regimen-related distress" 
  | "Emotional burden" 
  | "Interpersonal distress" 
  | null;

// The Item Bank: Rotating subscales to prevent survey fatigue
export const DOMAIN_SUBSCALES: Record<NonNullable<FocusDomain>, string[]> = {
  "Emotional burden": ["Feeling overwhelmed", "Feeling discouraged", "General burnout", "Low motivation"],
  "Regimen-related distress": ["Tracking fatigue", "Frustration with eating rules", "Medication routine burnout", "Anxiety about numbers"],
  "Interpersonal distress": ["Tension with family/friends", "Unsolicited advice", "Feeling isolated", "Friction at work/school"],
  "Physician-related distress": ["Feeling unheard by doctor", "Anxiety before appointments", "Confusing medical advice", "Feeling rushed during visits"]
};

interface AffectData {
  distress: number | null; // 0-10
  mood: number | null;     // 10-0
  energy: number | null;   // 0-10
}

interface ContextTags {
  doctorAppt: boolean; bloodSugar: boolean; missedMedication: boolean;
  stress: boolean; conflict: boolean; supported: boolean; unwell: boolean;
}

/** Human-readable labels for each context tag (for chat prompt). */
export const CONTEXT_TAG_LABELS: Record<keyof ContextTags, string> = {
  doctorAppt: "Doctor's appointment",
  bloodSugar: "High or low blood sugar",
  missedMedication: "Missed a medication or meal",
  stress: "Stress at work or school",
  conflict: "Conflict or tension with someone",
  supported: "Felt supported by someone",
  unwell: "Felt physically unwell or tired",
};

interface NarrativeData { reflection: string; copingAction: string; }

// --- 2. STORE STATE & ACTIONS INTERFACE ---
interface CheckInState {
  // Current Session Data
  affect: AffectData;
  contextTags: ContextTags;
  narrative: NarrativeData;
  focusDomain: FocusDomain;
  activeSubscale: string | null; // Today's rotated topic
  isSubmitting: boolean;

  // Longitudinal Memory (The Clinical Engine)
  previousDayDistress: number | null;
  consecutiveHighDistressDays: number;
  needsSafetyEscalation: boolean;
  suggestedNextDomain: FocusDomain;

  // Actions
  setAffect: (metric: keyof AffectData, value: number) => void;
  toggleContextTag: (tag: keyof ContextTags) => void;
  setNarrative: (field: keyof NarrativeData, text: string) => void;
  setFocusDomain: (domain: FocusDomain) => void;
  initializeDailySubscale: () => void;
  submitCheckIn: () => Promise<boolean>;
  resetStore: () => void;
}

// --- 3. INITIAL STATE ---
const initialState = {
  affect: { distress: null, mood: null, energy: null },
  contextTags: { doctorAppt: false, bloodSugar: false, missedMedication: false, stress: false, conflict: false, supported: false, unwell: false },
  narrative: { reflection: "", copingAction: "" },
  focusDomain: null,
  activeSubscale: null,
  isSubmitting: false,

  // Production-safe defaults until historical values load from persistence.
  previousDayDistress: null,
  consecutiveHighDistressDays: 0,
  needsSafetyEscalation: false,
  suggestedNextDomain: null,
};

// --- 4. CREATE THE ZUSTAND STORE ---
export const useCheckInStore = create<CheckInState>((set, get) => ({
  ...initialState,

  setAffect: (metric, value) => set((state) => ({ affect: { ...state.affect, [metric]: value } })),
  
  toggleContextTag: (tag) => set((state) => ({ contextTags: { ...state.contextTags, [tag]: !state.contextTags[tag] } })),
  
  setNarrative: (field, text) => set((state) => ({ narrative: { ...state.narrative, [field]: text } })),
  
  setFocusDomain: (domain) => {
    set({ focusDomain: domain });
    get().initializeDailySubscale(); // Pick a subscale when domain is chosen
  },

  // Pick a random subscale based on the chosen domain (Step 3 of your logic)
  initializeDailySubscale: () => {
    const domain = get().focusDomain;
    if (domain) {
      const subscales = DOMAIN_SUBSCALES[domain];
      const randomSubscale = subscales[Math.floor(Math.random() * subscales.length)];
      set({ activeSubscale: randomSubscale });
    }
  },

  submitCheckIn: async () => {
    set({ isSubmitting: true });
    
    try {
      const { affect, previousDayDistress, consecutiveHighDistressDays } = get();
      const currentDistress = affect.distress || 0;

      // SAFETY & ESCALATION LOGIC (Step 6 of your protocol)
      let newConsecutiveDays = consecutiveHighDistressDays;
      let triggerSafety = false;

      if (currentDistress >= 9) {
        newConsecutiveDays += 1;
        if (newConsecutiveDays >= 2) {
          triggerSafety = true; // Flags the UI to show the "Get Help" banner
        }
      } else {
        newConsecutiveDays = 0; // Reset if they are under 9
      }

      set({ 
        consecutiveHighDistressDays: newConsecutiveDays,
        needsSafetyEscalation: triggerSafety
      });

      // Save check-in submission to Postgres (auth-scoped)
      const response = await fetch("/api/check-in/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: get().focusDomain,
          subscale: get().activeSubscale,
          affect: get().affect,
          narrative: get().narrative,
          contextTags: get().contextTags,
          needsSafetyEscalation: triggerSafety,
          previousDayDistress: get().previousDayDistress,
          consecutiveHighDistressDays: newConsecutiveDays,
        }),
      });
      if (!response.ok) {
        let message = "Failed to save check-in submission";
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          try {
            const data = await response.json();
            message = (data.error ?? data.message ?? message) as string;
          } catch {
            // Keep fallback message when response isn't valid JSON.
          }
        }
        throw new Error(message);
      }

      // Preserve existing UX delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
      
    } catch (error) {
      console.error("Failed to submit check-in data", error);
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  resetStore: () => set({ ...initialState, previousDayDistress: get().affect.distress }), // Save today's distress for tomorrow
}));