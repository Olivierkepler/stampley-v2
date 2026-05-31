import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getPostSurveyAccessStatus } from "@/lib/post-survey-access"

export default async function PostSurveyResultsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const access = await getPostSurveyAccessStatus(session.user.id)

  if (!access.studyComplete) {
    redirect("/dashboard")
  }

  if (!access.postSurveyCompleted) {
    redirect("/survey/post-survey")
  }

  return (
    <main
      className="min-h-screen bg-[#f8fafc]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <header className="border-b border-black/[0.06] bg-[#003e73] text-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-8">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center bg-white">
            <Image
              src="/images/stampleyLogo.png"
              alt="AIDES-T2D"
              width={30}
              height={30}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
              AIDES-T2D Research Study
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white">
              Post-Study Survey Complete
            </h1>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="border border-black/[0.06] bg-white p-8 shadow-[0_4px_24px_rgba(10,10,15,0.05)]">
          <h2 className="text-xl font-semibold text-[#003e73]">
            Thank you for your participation
          </h2>
          <p className="mt-4 text-sm leading-7 text-gray-700">
            Your post-study survey responses have been saved. Your feedback
            helps us understand how the study platform and Stampley supported
            participants managing type 2 diabetes.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-600">
            If you indicated interest in future research, the study team may
            reach out using the contact details you provided.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex bg-[#005ea8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004b87]"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
