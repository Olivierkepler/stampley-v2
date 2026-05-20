"use server";

import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function submitPreSurvey(data: any) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const phqTotal =
    Number(data.phq1) +
    Number(data.phq2) +
    Number(data.phq3) +
    Number(data.phq4) +
    Number(data.phq5) +
    Number(data.phq6) +
    Number(data.phq7) +
    Number(data.phq8) +
    Number(data.phq9);

  const phqSeverity =
    phqTotal <= 4 ? "Minimal" :
    phqTotal <= 9 ? "Mild" :
    phqTotal <= 14 ? "Moderate" :
    phqTotal <= 19 ? "Moderately Severe" :
    "Severe";

  const needsFollowup = Number(data.phq9) > 0 || phqTotal >= 15;

  await query(
    `
    INSERT INTO pre_survey_responses (
      user_id,
      consent_status,
      
      diagnosis_verified,
      diagnosis_file_url,
      diagnosis_duration,
      age,
      gender,
      race,
      ethnicity,
      marital_status,
      education,
      employment_status,
      household_income,
      insurance_type,
      medical_forms_confidence,
      reading_help_frequency,
      diabetes_duration,
      current_treatments,
      attended_diabetes_classes,
      diabetes_tools_used,
      overall_health_rating,
      owns_smartphone,
      internet_usage,
      app_comfort,
      telehealth_used,
      mental_health_apps_used,
      smartphone_app_comfort,
      digital_health_tools_used,
      voice_tech_comfort,
      communication_preference,
      phq1, phq2, phq3, phq4, phq5, phq6, phq7, phq8, phq9,
      phq_total,
      phq_severity,
      needs_mental_health_followup,
      completed_at
    )
 VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
  $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
  $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
  $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
  $41,$42,NOW()
)
    ON CONFLICT (user_id)
    DO UPDATE SET
      consent_status = EXCLUDED.consent_status,
      
      diagnosis_verified = EXCLUDED.diagnosis_verified,
      diagnosis_file_url = EXCLUDED.diagnosis_file_url,
      diagnosis_duration = EXCLUDED.diagnosis_duration,
      age = EXCLUDED.age,
      gender = EXCLUDED.gender,
      race = EXCLUDED.race,
      ethnicity = EXCLUDED.ethnicity,
      marital_status = EXCLUDED.marital_status,
      education = EXCLUDED.education,
      employment_status = EXCLUDED.employment_status,
      household_income = EXCLUDED.household_income,
      insurance_type = EXCLUDED.insurance_type,
      medical_forms_confidence = EXCLUDED.medical_forms_confidence,
      reading_help_frequency = EXCLUDED.reading_help_frequency,
      diabetes_duration = EXCLUDED.diabetes_duration,
      current_treatments = EXCLUDED.current_treatments,
      attended_diabetes_classes = EXCLUDED.attended_diabetes_classes,
      diabetes_tools_used = EXCLUDED.diabetes_tools_used,
      overall_health_rating = EXCLUDED.overall_health_rating,
      owns_smartphone = EXCLUDED.owns_smartphone,
      internet_usage = EXCLUDED.internet_usage,
      app_comfort = EXCLUDED.app_comfort,
      telehealth_used = EXCLUDED.telehealth_used,
      mental_health_apps_used = EXCLUDED.mental_health_apps_used,
      smartphone_app_comfort = EXCLUDED.smartphone_app_comfort,
      digital_health_tools_used = EXCLUDED.digital_health_tools_used,
      voice_tech_comfort = EXCLUDED.voice_tech_comfort,
      communication_preference = EXCLUDED.communication_preference,
      phq1 = EXCLUDED.phq1,
      phq2 = EXCLUDED.phq2,
      phq3 = EXCLUDED.phq3,
      phq4 = EXCLUDED.phq4,
      phq5 = EXCLUDED.phq5,
      phq6 = EXCLUDED.phq6,
      phq7 = EXCLUDED.phq7,
      phq8 = EXCLUDED.phq8,
      phq9 = EXCLUDED.phq9,
      phq_total = EXCLUDED.phq_total,
      phq_severity = EXCLUDED.phq_severity,
      needs_mental_health_followup = EXCLUDED.needs_mental_health_followup,
      completed_at = NOW()
    `,
    [
      session.user.id,
      data.consent_status,
     
      data.diagnosis_verified,
      data.diagnosis_file_url,
      data.diagnosis_duration,
      Number(data.age),
      data.gender,
      data.race,
      data.ethnicity,
      data.marital_status,
      data.education,
      data.employment_status,
      data.household_income,
      data.insurance_type,
      data.medical_forms_confidence,
      data.reading_help_frequency,
      data.diabetes_duration,
      data.current_treatments,
      data.attended_diabetes_classes,
      data.diabetes_tools_used,
      data.overall_health_rating,
      data.owns_smartphone,
      data.internet_usage,
      data.app_comfort,
      data.telehealth_used,
      data.mental_health_apps_used,
      data.smartphone_app_comfort,
      data.digital_health_tools_used,
      data.voice_tech_comfort,
      data.communication_preference,
      data.phq1,
      data.phq2,
      data.phq3,
      data.phq4,
      data.phq5,
      data.phq6,
      data.phq7,
      data.phq8,
      data.phq9,
      phqTotal,
      phqSeverity,
      needsFollowup,
    ]
  );

  return { success: true };
}