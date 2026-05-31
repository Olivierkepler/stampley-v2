import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPostSurveyAccessStatus } from "@/lib/post-survey-access"
import PostSurveyClient from "./post-survey-client"

export default async function PostSurveyPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const access = await getPostSurveyAccessStatus(session.user.id)

  if (!access.studyComplete) {
    redirect("/dashboard")
  }

  if (access.postSurveyCompleted) {
    redirect("/survey/post-survey/results")
  }

  return <PostSurveyClient />
}
