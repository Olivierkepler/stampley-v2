"use server"

import { query } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { calculateDDSScores, type DDSAnswers } from "@/lib/dds-scoring"

export async function submitDDS(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    const answers: DDSAnswers = {
      q1: parseInt(formData.get("q1") as string),
      q2: parseInt(formData.get("q2") as string),
      q3: parseInt(formData.get("q3") as string),
      q4: parseInt(formData.get("q4") as string),
      q5: parseInt(formData.get("q5") as string),
      q6: parseInt(formData.get("q6") as string),
      q7: parseInt(formData.get("q7") as string),
      q8: parseInt(formData.get("q8") as string),
      q9: parseInt(formData.get("q9") as string),
      q10: parseInt(formData.get("q10") as string),
      q11: parseInt(formData.get("q11") as string),
      q12: parseInt(formData.get("q12") as string),
      q13: parseInt(formData.get("q13") as string),
      q14: parseInt(formData.get("q14") as string),
      q15: parseInt(formData.get("q15") as string),
      q16: parseInt(formData.get("q16") as string),
      q17: parseInt(formData.get("q17") as string),
    }

    const valid = Object.values(answers).every(v => v >= 1 && v <= 6)
    if (!valid) return { error: "Please answer all questions" }

    const scores = calculateDDSScores(answers)

    await query(
      `INSERT INTO dds_responses (
        id, user_id,
        q1, q2, q3, q4, q5, q6, q7, q8, q9,
        q10, q11, q12, q13, q14, q15, q16, q17,
        emotional_score, physician_score, regimen_score,
        interpersonal_score, total_score, recommended_domain,
        created_at
      ) VALUES (
        gen_random_uuid()::text, $1,
        $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        q1=$2, q2=$3, q3=$4, q4=$5, q5=$6, q6=$7,
        q7=$8, q8=$9, q9=$10, q10=$11, q11=$12,
        q12=$13, q13=$14, q14=$15, q15=$16, q16=$17,
        q17=$18, emotional_score=$19, physician_score=$20,
        regimen_score=$21, interpersonal_score=$22,
        total_score=$23, recommended_domain=$24`,
      [
        session.user.id,
        answers.q1, answers.q2, answers.q3, answers.q4,
        answers.q5, answers.q6, answers.q7, answers.q8,
        answers.q9, answers.q10, answers.q11, answers.q12,
        answers.q13, answers.q14, answers.q15, answers.q16,
        answers.q17,
        scores.emotional, scores.physician, scores.regimen,
        scores.interpersonal, scores.total, scores.recommendedDomain,
      ]
    )

    revalidatePath("/survey/dds")
    return { success: true, scores }

  } catch (error) {
    console.error("[submitDDS]", error)
    return { error: "Failed to save responses. Please try again." }
  }
}

export async function confirmDomain(domain: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  try {
    await query(
      "UPDATE dds_responses SET confirmed_domain = $1 WHERE user_id = $2",
      [domain, session.user.id]
    )

    await query(
      `INSERT INTO user_weekly_domains (id, user_id, week_number, domain, started_at)
       VALUES (gen_random_uuid()::text, $1, 1, $2, NOW())
       ON CONFLICT (user_id, week_number) DO UPDATE SET domain = $2`,
      [session.user.id, domain]
    )

    await query(
      `INSERT INTO user_study_progress (
        id, user_id, study_start_date, current_week,
        total_checkins, consecutive_high_distress_days, updated_at
      ) VALUES (
        gen_random_uuid()::text, $1, CURRENT_DATE, 1, 0, 0, NOW()
      ) ON CONFLICT (user_id) DO NOTHING`,
      [session.user.id]
    )

    return { success: true }
  } catch (error) {
    console.error("[confirmDomain]", error)
    return { error: "Failed to confirm domain." }
  }
}