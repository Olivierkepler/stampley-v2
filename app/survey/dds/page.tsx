import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import DDSClient from "./dds-client"
import Link from "next/link"
import Image from "next/image"

export default async function Page() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const preSurveyResult = await query(
    "SELECT id FROM pre_survey_responses WHERE user_id = $1",
    [session.user.id]
  )

  if (preSurveyResult.rows.length === 0) {
    redirect("/survey/pre-survey")
  }

  const ddsResult = await query(
    "SELECT id FROM dds_responses WHERE user_id = $1",
    [session.user.id]
  )

  if (ddsResult.rows.length > 0) {
    redirect("/survey/dds/results")
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#003e73] px-6 py-5 text-white">
     <div className="flex items-center gap-4">
     <Link
          href="/"
              className={`flex h-13 w-13 shrink-0 items-center justify-center bg-white backdrop-blur-sm`}
            >
          <Image
            src="/images/stampleyLogo.png"
            alt="AIDES-T2D"
            width={30}
            height={30}
            className="h-auto w-auto object-contain"
            priority
          />
        </Link> 

        <div className="min-w-0">
          <p className="text-[10px] font-['Poppins',sans-serif] uppercase leading-tight tracking-[0.22em] text-white/70">
            AIDES-T2D Research Study
          </p>

          <h1 className="text-[20px] font-['Poppins',sans-serif] leading-tight tracking-[-0.03em] text-white">
            Diabetes Distress Scale (DDS-17)
          </h1>

          <p className="text-[13px] font-['Poppins',sans-serif] leading-tight text-white/70">
            Tell us how diabetes has affected your emotional well-being,
            daily routines, healthcare experiences, and support system
            during the past month.
          </p>
        </div>
     </div>
          </div>
         
       <DDSClient />
    </main>
  )
}
