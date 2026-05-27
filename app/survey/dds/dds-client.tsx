"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { submitDDS } from "@/actions/dds"
import Image from "next/image"
import Link from "next/link"

const QUESTIONS = [
  { id: "q1", text: "Feeling that diabetes is taking up too much of my mental and physical energy every day.", domain: "Emotional" },
  { id: "q2", text: "Feeling that my doctor doesn't know enough about diabetes and diabetes care.", domain: "Physician" },
  { id: "q3", text: "Feeling angry, scared, and/or depressed when I think about living with diabetes.", domain: "Emotional" },
  { id: "q4", text: "Feeling that my doctor doesn't give me clear enough directions on how to manage my diabetes.", domain: "Physician" },
  { id: "q5", text: "Feeling that I am not testing my blood sugars frequently enough.", domain: "Regimen" },
  { id: "q6", text: "Feeling that I am often failing with my diabetes routine.", domain: "Regimen" },
  { id: "q7", text: "Feeling that friends or family are not supportive enough of my self-care efforts.", domain: "Interpersonal" },
  { id: "q8", text: "Feeling that diabetes controls my life.", domain: "Emotional" },
  { id: "q9", text: "Feeling that my doctor doesn't take my concerns seriously enough.", domain: "Physician" },
  { id: "q10", text: "Not feeling confident in my day-to-day ability to manage diabetes.", domain: "Regimen" },
  { id: "q11", text: "Feeling that I will end up with serious long-term complications, no matter what I do.", domain: "Emotional" },
  { id: "q12", text: "Feeling that I am not sticking closely enough to a good meal plan.", domain: "Regimen" },
  { id: "q13", text: "Feeling that friends or family don't appreciate how difficult living with diabetes can be.", domain: "Interpersonal" },
  { id: "q14", text: "Feeling overwhelmed by the demands of living with diabetes.", domain: "Emotional" },
  { id: "q15", text: "Feeling that I don't have a doctor who I can see regularly enough about my diabetes.", domain: "Physician" },
  { id: "q16", text: "Not feeling motivated to keep up my diabetes self-management.", domain: "Regimen" },
  { id: "q17", text: "Feeling that friends or family don't give me the emotional support that I would like.", domain: "Interpersonal" },
]

const SCALE = [
  { value: 1, label: "Not a Problem" },
  { value: 2, label: "Slight Problem" },
  { value: 3, label: "Moderate Problem" },
  { value: 4, label: "Somewhat Serious Problem" },
  { value: 5, label: "Serious Problem" },
  { value: 6, label: "Very Serious Problem" },
]

const DOMAIN_ORDER = ["Emotional", "Physician", "Regimen", "Interpersonal"] as const

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  Emotional:
    "Questions about overwhelm, fear, burnout, and emotional burden.",
  Physician:
    "Questions about communication, support, and confidence in your healthcare team.",
  Regimen:
    "Questions about routines, meal plans, testing, and self-management.",
  Interpersonal:
    "Questions about support from family, friends, and people around you.",
}

const SCORE_GROUPS = [
  { label: "Total DDS", items: QUESTIONS.map((q) => q.id), divisor: 17 },
  { label: "Emotional", items: ["q1", "q3", "q8", "q11", "q14"], divisor: 5 },
  { label: "Physician", items: ["q2", "q4", "q9", "q15"], divisor: 4 },
  { label: "Regimen", items: ["q5", "q6", "q10", "q12", "q16"], divisor: 5 },
  { label: "Interpersonal", items: ["q7", "q13", "q17"], divisor: 3 },
]

function getLiveScorePreview(
  answers: Record<string, number>,
  items: string[],
  divisor: number
) {
  const answeredValues = items
    .map((item) => answers[item])
    .filter((value): value is number => typeof value === "number")

  const answeredCount = answeredValues.length
  const previewMean =
    answeredCount > 0
      ? answeredValues.reduce((sum, value) => sum + value, 0) / answeredCount
      : null

  return {
    answeredCount,
    divisor,
    previewMean,
    complete: answeredCount === divisor,
  }
}

export default function DDSClient() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0)

  const questionRefs = useRef<Record<string, HTMLTableRowElement | null>>({})

  const totalAnswered = Object.keys(answers).length
  const progress = Math.round((totalAnswered / 17) * 100)
  const allAnswered = totalAnswered === 17
  const remaining = 17 - totalAnswered

  const groupedQuestions = useMemo(() => {
    return DOMAIN_ORDER.map((domain) => ({
      domain,
      questions: QUESTIONS.filter((q) => q.domain === domain),
    }))
  }, [])

  const currentSection = groupedQuestions[currentDomainIndex]
  const currentDomain = currentSection.domain
  const currentQuestions = currentSection.questions
  const currentDomainDescription = DOMAIN_DESCRIPTIONS[currentDomain]

  const currentSectionAnswered = currentQuestions.filter((q) => answers[q.id] != null).length
  const currentSectionComplete = currentSectionAnswered === currentQuestions.length
  const isLastSection = currentDomainIndex === groupedQuestions.length - 1

  function handleAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (error) setError("")
  }

  function handleNextSection() {
    const firstUnanswered = currentQuestions.find((q) => answers[q.id] == null)
    if (firstUnanswered) {
      setError(`Please answer all ${currentDomain} questions before continuing.`)
      questionRefs.current[firstUnanswered.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      return
    }

    setError("")
    if (!isLastSection) {
      setCurrentDomainIndex((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function handlePreviousSection() {
    setError("")
    if (currentDomainIndex > 0) {
      setCurrentDomainIndex((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function handleSubmit() {
    if (!allAnswered) {
      const firstUnansweredDomainIndex = groupedQuestions.findIndex((section) =>
        section.questions.some((q) => answers[q.id] == null)
      )

      if (firstUnansweredDomainIndex !== -1) {
        setCurrentDomainIndex(firstUnansweredDomainIndex)
        const firstUnanswered = groupedQuestions[firstUnansweredDomainIndex].questions.find(
          (q) => answers[q.id] == null
        )
        setError("Please answer all 17 questions before continuing.")
        setTimeout(() => {
          if (firstUnanswered) {
            questionRefs.current[firstUnanswered.id]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
        }, 50)
      }
      return
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    Object.entries(answers).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    const result = await submitDDS(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/survey/dds/results")
    }
  }

  const globalQuestionNumberStart = groupedQuestions
    .slice(0, currentDomainIndex)
    .reduce((sum, section) => sum + section.questions.length, 0)
    const [showMobileProgress, setShowMobileProgress] = useState(false)

  return (

    
    <main className="min-h-screen bg-white ">
      <div className="mx-auto">
        <div className=" bg-white">
          {/* <div className="border-b border-gray-300 bg-[#003e73] px-6 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest">
              AIDES-T2D Research Study
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              Diabetes Distress Scale (DDS)
            </h1>
         
         
          </div> */}
<header className="bg-[#003e73] px-4 text-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] sm:px-6 lg:px-8">
  <div className="mx-auto flex max-w-7xl items-center gap-3 py-4 sm:gap-4 sm:py-5">
    
    <Link href="/" className="flex h-13 w-13 shrink-0 items-center justify-center bg-white backdrop-blur-sm">
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
      <p className="text-[10px] font-['Poppins',sans-serif] uppercase tracking-[0.22em] text-white/70 leading-tight">
        AIDES-T2D Research Study
      </p>

      <h1 className="text-[20px] font-['Poppins',sans-serif] tracking-[-0.03em] text-white leading-tight">
        Diabetes Distress Scale (DDS-17)
      </h1>

      <p className="text-[13px] font-['Poppins',sans-serif] leading-tight text-white/70">
        Tell us how diabetes has affected your emotional well-being,
        daily routines, healthcare experiences, and support system
        during the past month.
      </p>
    </div>
  </div>
</header>
      


          <div className="grid gap-6 p-6 lg:grid-cols-[280px_1fr] px-4 py-6 md:px-6 lg:px-30">
           
           {/* Mobile progress toggle */}
<div className="lg:hidden">
  <button
    type="button"
    onClick={() => setShowMobileProgress((prev) => !prev)}
    className="mb-4 flex w-full items-center justify-between border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800"
  >
    <span>Form Progress</span>
    <span>{showMobileProgress ? "✕" : "☰"}</span>
  </button>

  {showMobileProgress && (
    <div className="mb-4">
      {/* paste the aside content here */}
    </div>
  )}
</div>

{/* Desktop sidebar */}
<aside className="hidden border border-gray-300 bg-[#f7f9fb] lg:block">

{/*            
            <aside className="border border-gray-300 bg-[#f7f9fb]"> */}
              <div className="border-b border-gray-300 bg-gray-100 px-4 py-3">
                <h2 className="text-sm font-bold text-gray-800">Form Progress</h2>
              </div>

              <ol className="divide-y divide-gray-300">
                {groupedQuestions.map((section, index) => {
                  const active = currentDomainIndex === index
                  const completed = currentDomainIndex > index
                  const sectionAnswered = section.questions.filter(
                    (q) => answers[q.id] != null
                  ).length

                  return (
                    <li
                      key={section.domain}
                      className={`flex gap-3 px-4 py-3 text-sm ${
                        active
                          ? "border-l-4 border-[#005ea8] bg-white font-bold text-[#003e73]"
                          : completed
                            ? "text-gray-700"
                            : "text-gray-500"
                      }`}
                    >
                      <span>{completed ? "✓" : `${index + 1}.`}</span>
                      <span className="flex-1">
                        {section.domain}
                        <span className="mt-0.5 block text-xs font-normal text-gray-500">
                          {sectionAnswered}/{section.questions.length} answered
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ol>
{/* 
              <div className="border-t border-gray-300 px-4 py-4">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Overall progress</span>
                  <span>{progress}% completed</span>
                </div>
                <div className="h-2 border border-gray-300 bg-white">
                  <div
                    className="h-full bg-[#005ea8] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {totalAnswered}/17 questions completed
                </p>
              </div> */}

              <div className="border-t border-gray-300 px-4 py-4">
  <h3 className="text-sm font-bold text-gray-800">
    Live score preview
  </h3>

  <div className="mt-3 space-y-2 ">
    {SCORE_GROUPS.map((group) => {
      const score = getLiveScorePreview(
        answers,
        group.items,
        group.divisor
      )

      return (
        <div
          key={group.label}
          className="border border-gray-300 bg-white px-3 py-2"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-gray-800">
              {group.label}
            </p>

            <span className="text-[11px] text-gray-500">
              {score.answeredCount}/{score.divisor}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              {score.complete ? "Final preview" : "In progress"}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#003e73]">
                {score.previewMean == null
                  ? "—"
                  : score.previewMean.toFixed(2)}
              </span>

              {score.previewMean != null && score.previewMean >= 3 ? (
                <span className="border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  ≥ 3
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )
    })}
  </div>

  <p className="mt-3 text-[11px] leading-5 text-gray-500">
    Preview only. Final DDS scores are calculated after submission.
  </p>
</div>
            </aside>

            <section className="border border-gray-300 bg-white">
              <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Section {currentDomainIndex + 1} of {groupedQuestions.length}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {currentDomain} Distress
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
                  Consider how much each item has distressed or bothered you during
                  the past month.
                </p>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                  {currentDomainDescription}
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Section progress</span>
                    <span>
                      {currentSectionAnswered}/{currentQuestions.length} answered
                    </span>
                  </div>

                  <div className="h-2 border border-gray-300 bg-white">
                    <div
                      className="h-full bg-[#005ea8] transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (currentSectionAnswered / currentQuestions.length) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-300 bg-[#f8fafc] px-6 py-4">
                <p className="text-sm leading-6 text-gray-700">
                  Select one response for each question using the 1–6 scale below.
                </p>
              </div>

              <div className="px-6 py-6">
  <div className="overflow-x-auto border border-gray-300 bg-white">
    <table className="w-full min-w-[820px] border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-300 bg-gray-50">
          <th className="w-[48%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
            Question
          </th>

          {SCALE.map((option) => (
            <th
              key={option.value}
              className="w-[8.6%] px-2 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500"
            >
              <span className="block text-sm font-bold text-gray-900">
                {option.value}
              </span>
              <span className="mt-0.5 block text-[10px] font-normal leading-tight text-gray-400">
                {option.label}
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {currentQuestions.map((q, index) => {
          const selectedValue = answers[q.id]
          const isUnansweredError = !!error && selectedValue == null
          const questionNumber = globalQuestionNumberStart + index + 1

          return (
            <tr
              key={q.id}
              ref={(el) => {
                questionRefs.current[q.id] = el
              }}
              className={`border-b border-gray-200 last:border-b-0 ${
                isUnansweredError ? "bg-red-50" : "bg-white"
              }`}
            >
              <td className="px-4 py-3 align-middle">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-gray-300 bg-gray-50 text-[11px] font-semibold text-gray-600">
                    {questionNumber}
                  </span>

                  <p className="text-[13px] font-medium leading-5 text-gray-900">
                    {q.text}
                  </p>
                </div>
              </td>

              {SCALE.map((option) => {
                const selected = selectedValue === option.value
                const inputId = `${q.id}-${option.value}`

                return (
                  <td
                    key={option.value}
                    className={`px-2 py-3 text-center align-middle transition ${
                      selected ? "bg-[#f0f6fc]" : "bg-white"
                    }`}
                  >
                    <label
                      htmlFor={inputId}
                      className="inline-flex cursor-pointer items-center justify-center"
                    >
                      <input
                        type="radio"
                        id={inputId}
                        name={q.id}
                        value={option.value}
                        checked={selected}
                        onChange={() => handleAnswer(q.id, option.value)}
                        className="sr-only"
                      />

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                          selected
                            ? "border-[#005ea8] bg-[#005ea8]"
                            : "border-gray-400 bg-white hover:border-[#005ea8]"
                        }`}
                        aria-hidden="true"
                      >
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>

                      <span className="sr-only">
                        Question {questionNumber}: {option.label} Score{" "}
                        {option.value}
                      </span>
                    </label>
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
</div>
              {error ? (
                <p className="px-6 pb-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-between border-t border-gray-300 bg-gray-50 px-6 py-4">
                <button
                  type="button"
                  onClick={handlePreviousSection}
                  disabled={currentDomainIndex === 0 || loading}
                  className={`border px-5 py-2 text-sm font-semibold ${
                    currentDomainIndex === 0
                      ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                      : "border-gray-500 bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  Back
                </button>

                {!isLastSection ? (
                  <button
                    type="button"
                    onClick={handleNextSection}
                    disabled={loading}
                    className="bg-[#005ea8] px-6 py-2 text-sm font-semibold text-white hover:bg-[#004b87] disabled:opacity-60"
                  >
                    {currentSectionComplete
                      ? "Continue"
                      : `Continue (${currentQuestions.length - currentSectionAnswered} remaining)`}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !allAnswered}
                    className={`px-6 py-2 text-sm font-semibold text-white ${
                      allAnswered
                        ? "bg-[#005ea8] hover:bg-[#004b87]"
                        : "cursor-not-allowed bg-gray-400"
                    } disabled:opacity-60`}
                  >
                    {loading
                      ? "Calculating your results..."
                      : allAnswered
                        ? "See My Results"
                        : `Answer all questions to continue (${remaining} remaining)`}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
