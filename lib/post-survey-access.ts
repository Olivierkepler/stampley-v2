import "server-only"

import { query } from "@/lib/db"
import { STUDY_TOTAL_CHECKINS } from "@/lib/check-in-utils"

export type PostSurveyAccessStatus = {
  totalCheckins: number
  studyComplete: boolean
  postSurveyCompleted: boolean
}

export async function getPostSurveyAccessStatus(
  userId: string
): Promise<PostSurveyAccessStatus> {
  const [progressResult, postResult] = await Promise.all([
    query(
      `SELECT total_checkins FROM user_study_progress WHERE user_id = $1`,
      [userId]
    ),
    query(
      `SELECT completed_at FROM post_survey_responses WHERE user_id = $1`,
      [userId]
    ),
  ])

  const totalCheckins = Number(progressResult.rows[0]?.total_checkins ?? 0)
  const studyComplete = totalCheckins >= STUDY_TOTAL_CHECKINS
  const postSurveyCompleted = Boolean(postResult.rows[0]?.completed_at)

  return { totalCheckins, studyComplete, postSurveyCompleted }
}
