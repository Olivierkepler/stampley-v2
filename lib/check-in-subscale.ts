import type { Domain } from "@/store/checkin-store"

export const DOMAIN_SUBSCALES: Record<Domain, string[]> = {
  Emotional: [
    "Feeling Overwhelmed",
    "Feeling Discouraged",
    "Feeling Burned Out",
    "Fear of Complications",
    "Mental Energy Drain",
  ],
  Regimen: [
    "Blood Sugar Testing",
    "Routine Failure",
    "Management Confidence",
    "Meal Plan Adherence",
    "Self-Management Motivation",
  ],
  Physician: [
    "Doctor Knowledge",
    "Care Directions",
    "Doctor Responsiveness",
    "Doctor Access",
  ],
  Interpersonal: [
    "Social Support for Self-Care",
    "Family Appreciation",
    "Emotional Support from Others",
  ],
}

const VALID_DOMAINS: Domain[] = [
  "Emotional",
  "Regimen",
  "Physician",
  "Interpersonal",
]

export function isCheckInDomain(domain: unknown): domain is Domain {
  return (
    typeof domain === "string" &&
    VALID_DOMAINS.includes(domain as Domain)
  )
}

/** Subscale for the study day within the weekly domain (matches submit route). */
export function getSubscaleForDay(
  domain: string,
  dayNumber: number
): string {
  const subscales = isCheckInDomain(domain)
    ? DOMAIN_SUBSCALES[domain]
    : ["General"]
  if (subscales.length === 0) return "General"
  const safeDay = Number.isFinite(dayNumber) && dayNumber >= 1 ? dayNumber : 1
  const idx = (safeDay - 1) % subscales.length
  return subscales[idx] ?? subscales[0] ?? "General"
}
