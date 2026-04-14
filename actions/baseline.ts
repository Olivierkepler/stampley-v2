"use server"

import { query } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function submitDemographics(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    await query(
      `INSERT INTO baseline_demographics (
        id, user_id, age, sex, race_ethnicity,
        education, income_band, employment, created_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        age=$2, sex=$3, race_ethnicity=$4,
        education=$5, income_band=$6, employment=$7`,
      [
        session.user.id,
        formData.get("age") ? parseInt(formData.get("age") as string) : null,
        formData.get("sex") || null,
        formData.get("race_ethnicity") || null,
        formData.get("education") || null,
        formData.get("income_band") || null,
        formData.get("employment") || null,
      ]
    )
    return { success: true }
  } catch (error) {
    console.error("[submitDemographics]", error)
    return { error: "Failed to save. Please try again." }
  }
}

export async function submitDiabetesProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    const medications = formData.getAll("medications") as string[]
    await query(
      `INSERT INTO baseline_diabetes_profile (
        id, user_id, years_since_diagnosis,
        current_medications, uses_insulin,
        most_recent_a1c, created_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        years_since_diagnosis=$2,
        current_medications=$3,
        uses_insulin=$4,
        most_recent_a1c=$5`,
      [
        session.user.id,
        formData.get("years_since_diagnosis")
          ? parseInt(formData.get("years_since_diagnosis") as string)
          : null,
        JSON.stringify(medications),
        formData.get("uses_insulin") === "true",
        formData.get("most_recent_a1c") || null,
      ]
    )
    return { success: true }
  } catch (error) {
    console.error("[submitDiabetesProfile]", error)
    return { error: "Failed to save. Please try again." }
  }
}

export async function submitTechnology(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    await query(
      `INSERT INTO baseline_technology (
        id, user_id, smartphone_type, smartphone_comfort,
        internet_access, input_preference, created_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        smartphone_type=$2, smartphone_comfort=$3,
        internet_access=$4, input_preference=$5`,
      [
        session.user.id,
        formData.get("smartphone_type") || null,
        formData.get("smartphone_comfort")
          ? parseInt(formData.get("smartphone_comfort") as string)
          : null,
        formData.get("internet_access") || null,
        formData.get("input_preference") || null,
      ]
    )
    return { success: true }
  } catch (error) {
    console.error("[submitTechnology]", error)
    return { error: "Failed to save. Please try again." }
  }
}

export async function submitEngagement(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    const preferredDays = formData.getAll("preferred_days") as string[]
    await query(
      `INSERT INTO baseline_engagement (
        id, user_id, preferred_checkin_days,
        preferred_reminder_time, reminder_consent,
        input_preference, created_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        preferred_checkin_days=$2,
        preferred_reminder_time=$3,
        reminder_consent=$4,
        input_preference=$5`,
      [
        session.user.id,
        JSON.stringify(preferredDays),
        formData.get("preferred_reminder_time") || null,
        formData.get("reminder_consent") === "true",
        formData.get("input_preference") || null,
      ]
    )
    return { success: true }
  } catch (error) {
    console.error("[submitEngagement]", error)
    return { error: "Failed to save. Please try again." }
  }
}

export async function submitPHQ2(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    const q1 = parseInt(formData.get("q1") as string)
    const q2 = parseInt(formData.get("q2") as string)
    const total = q1 + q2
    const positiveScreen = total >= 3

    await query(
      `INSERT INTO phq2_responses (
        id, user_id, q1, q2, total_score,
        positive_screen, created_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        q1=$2, q2=$3, total_score=$4, positive_screen=$5`,
      [session.user.id, q1, q2, total, positiveScreen]
    )
    return { success: true, positiveScreen }
  } catch (error) {
    console.error("[submitPHQ2]", error)
    return { error: "Failed to save. Please try again." }
  }
}

export async function submitGAD2(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    const q1 = parseInt(formData.get("q1") as string)
    const q2 = parseInt(formData.get("q2") as string)
    const total = q1 + q2
    const positiveScreen = total >= 3

    await query(
      `INSERT INTO gad2_responses (
        id, user_id, q1, q2, total_score,
        positive_screen, created_at
      ) VALUES (
        gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW()
      ) ON CONFLICT (user_id) DO UPDATE SET
        q1=$2, q2=$3, total_score=$4, positive_screen=$5`,
      [session.user.id, q1, q2, total, positiveScreen]
    )
    return { success: true, positiveScreen }
  } catch (error) {
    console.error("[submitGAD2]", error)
    return { error: "Failed to save. Please try again." }
  }
}