// actions/pre-survey.ts

"use server";

import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function submitPreSurvey(data: {
  age: number;
  gender: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await query(
    `
    INSERT INTO pre_survey_responses (
      user_id,
      age,
      gender
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id)
    DO UPDATE SET
      age = EXCLUDED.age,
      gender = EXCLUDED.gender
    `,
    [session.user.id, data.age, data.gender]
  );

  return { success: true };
}