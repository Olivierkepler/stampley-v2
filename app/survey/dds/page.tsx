import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import PreSurveyClient from "../pre-survey/pre-survey-client";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const preSurveyResult = await query(
    "SELECT id FROM pre_survey_responses WHERE user_id = $1",
    [session.user.id]
  );

  if (preSurveyResult.rows.length > 0) {
    redirect("/check-in");
  }

  return <PreSurveyClient />;
}
