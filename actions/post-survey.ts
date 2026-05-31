"use server"

import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import { calculateDDSScores, type DDSAnswers } from "@/lib/dds-scoring"
import {
  calculatePhqSeverity,
  calculatePhqTotal,
  calculateSusScore,
  hasNumericAnswer,
  type PhqAnswers,
  type SusAnswers,
} from "@/lib/post-survey-scoring"
import { getPostSurveyAccessStatus } from "@/lib/post-survey-access"
import { redirect } from "next/navigation"

function parseDdsAnswers(raw: Record<string, unknown>): DDSAnswers | null {
  const answers = {} as DDSAnswers
  for (let i = 1; i <= 17; i++) {
    const key = `q${i}` as keyof DDSAnswers
    const value = raw[key]
    if (!hasNumericAnswer(value) || value < 1 || value > 6) return null
    answers[key] = value
  }
  return answers
}

function parsePhqAnswers(raw: Record<string, unknown>): PhqAnswers | null {
  const answers = {} as PhqAnswers
  for (let i = 1; i <= 9; i++) {
    const key = `phq${i}` as keyof PhqAnswers
    const value = raw[key]
    if (!hasNumericAnswer(value) || value < 0 || value > 3) return null
    answers[key] = value
  }
  return answers
}

function parseSusAnswers(raw: Record<string, unknown>): SusAnswers | null {
  const answers = {} as SusAnswers
  for (let i = 1; i <= 10; i++) {
    const key = `sus${i}` as keyof SusAnswers
    const value = raw[key]
    if (!hasNumericAnswer(value) || value < 1 || value > 5) return null
    answers[key] = value
  }
  return answers
}

function parseStampleyFeedback(raw: Record<string, unknown>): Record<string, number> | null {
  const feedback: Record<string, number> = {}
  for (let i = 1; i <= 5; i++) {
    const key = `se${i}`
    const value = raw[key]
    if (!hasNumericAnswer(value) || value < 1 || value > 5) return null
    feedback[key] = value
  }
  return feedback
}

export async function submitPostSurvey(data: {
  dds: Record<string, unknown>
  phq: Record<string, unknown>
  sus: Record<string, unknown>
  stampley: Record<string, unknown>
  openReflection: string
  futureResearchContact: boolean | null
  contactName: string
  contactEmail: string
  contactPhone: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const access = await getPostSurveyAccessStatus(session.user.id)
  if (!access.studyComplete) {
    throw new Error("Post-survey is available after completing all 20 check-ins.")
  }
  if (access.postSurveyCompleted) {
    redirect("/survey/post-survey/results")
  }

  const ddsAnswers = parseDdsAnswers(data.dds)
  const phqAnswers = parsePhqAnswers(data.phq)
  const susAnswers = parseSusAnswers(data.sus)
  const stampleyFeedback = parseStampleyFeedback(data.stampley)

  if (!ddsAnswers || !phqAnswers || !susAnswers || !stampleyFeedback) {
    return { error: "Please complete all required survey sections." }
  }

  if (data.futureResearchContact === null) {
    return { error: "Please indicate whether you would like future research contact." }
  }

  const ddsScores = calculateDDSScores(ddsAnswers)
  const phqTotal = calculatePhqTotal(phqAnswers)
  const phqSeverity = calculatePhqSeverity(phqTotal)
  const susScore = calculateSusScore(susAnswers)

  await query(
    `INSERT INTO post_survey_responses (
      id, user_id,
      dds_answers, dds_scores,
      phq_answers, phq_total, phq_severity,
      sus_answers, sus_score,
      stampley_feedback,
      open_reflection,
      future_research_contact,
      contact_name, contact_email, contact_phone,
      completed_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid()::text, $1,
      $2::jsonb, $3::jsonb,
      $4::jsonb, $5, $6,
      $7::jsonb, $8,
      $9::jsonb,
      $10,
      $11,
      $12, $13, $14,
      NOW(), NOW(), NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      dds_answers = EXCLUDED.dds_answers,
      dds_scores = EXCLUDED.dds_scores,
      phq_answers = EXCLUDED.phq_answers,
      phq_total = EXCLUDED.phq_total,
      phq_severity = EXCLUDED.phq_severity,
      sus_answers = EXCLUDED.sus_answers,
      sus_score = EXCLUDED.sus_score,
      stampley_feedback = EXCLUDED.stampley_feedback,
      open_reflection = EXCLUDED.open_reflection,
      future_research_contact = EXCLUDED.future_research_contact,
      contact_name = EXCLUDED.contact_name,
      contact_email = EXCLUDED.contact_email,
      contact_phone = EXCLUDED.contact_phone,
      completed_at = NOW(),
      updated_at = NOW()`,
    [
      session.user.id,
      JSON.stringify(ddsAnswers),
      JSON.stringify(ddsScores),
      JSON.stringify(phqAnswers),
      phqTotal,
      phqSeverity,
      JSON.stringify(susAnswers),
      susScore,
      JSON.stringify(stampleyFeedback),
      data.openReflection.trim() || null,
      data.futureResearchContact,
      data.contactName.trim() || null,
      data.contactEmail.trim() || null,
      data.contactPhone.trim() || null,
    ]
  )

  return { success: true }
}
