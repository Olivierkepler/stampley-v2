"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { submitDDS } from "@/actions/dds"

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
  { value: 2, label: "A Slight Problem" },
  { value: 3, label: "A Moderate Problem" },
  { value: 4, label: "Somewhat Serious" },
  { value: 5, label: "A Serious Problem" },
  { value: 6, label: "A Very Serious Problem" },
]

const DOMAIN_ORDER = ["Emotional", "Physician", "Regimen", "Interpersonal"] as const

const DOMAIN_STYLES: Record<string, { bg: string; text: string; border: string; description: string }> = {
  Emotional: {
    bg: "rgba(139,111,71,0.08)",
    text: "#8B6F47",
    border: "rgba(139,111,71,0.16)",
    description: "Questions about overwhelm, fear, burnout, and emotional burden.",
  },
  Physician: {
    bg: "rgba(124,94,60,0.08)",
    text: "#7C5E3C",
    border: "rgba(124,94,60,0.16)",
    description: "Questions about communication, support, and confidence in your healthcare team.",
  },
  Regimen: {
    bg: "rgba(166,124,82,0.08)",
    text: "#A67C52",
    border: "rgba(166,124,82,0.16)",
    description: "Questions about routines, meal plans, testing, and self-management.",
  },
  Interpersonal: {
    bg: "rgba(176,137,104,0.08)",
    text: "#B08968",
    border: "rgba(176,137,104,0.16)",
    description: "Questions about support from family, friends, and people around you.",
  },
}

export default function DDSSurveyPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0)

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({})

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
  const currentStyle = DOMAIN_STYLES[currentDomain]

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="min-h-screen bg-[#f7f3ed]"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
      >
        <div className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#fefdfb]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p
                  className="mb-2 text-[10px] uppercase tracking-[0.18em] text-black/35"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Baseline Assessment
                </p>
                <h1
                  className="text-[22px] font-medium tracking-[-0.02em] text-black/85"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Diabetes Distress Scale
                </h1>
                <p className="mt-1 text-[13px] leading-relaxed text-black/45">
                  Complete one category at a time.
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-black/65">
                  {totalAnswered}/17 completed
                </p>
                <p className="text-[11px] text-black/35">
                  Section {currentDomainIndex + 1} of {groupedQuestions.length}
                </p>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#8B6F47,#B08968)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
          {/* <div className="rounded-[28px] border border-[#8B6F47]/10 bg-[#fefdfb] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f6efe4] text-[#8B6F47]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
              </div>

              <div>
                <h2
                  className="mb-2 text-[17px] font-medium tracking-[-0.01em] text-black/80"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Instructions
                </h2>
                <p className="text-[13.5px] leading-[1.8] text-black/55">
                  Consider the degree to which each item has{" "}
                  <strong className="font-medium text-black/70">
                    distressed or bothered you during the past month
                  </strong>.
                </p>
                <p className="mt-3 text-[12px] text-black/40">
                  Rate each item from 1 (Not a Problem) to 6 (A Very Serious Problem).
                </p>
              </div>
            </div>
          </div> */}

          <section className="space-y-5">
            <div className="rounded-[24px] border border-black/[0.05] bg-[#fbf8f4] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        background: currentStyle.bg,
                        color: currentStyle.text,
                        borderColor: currentStyle.border,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {currentDomain}
                    </span>
                  </div>

                  <h2
                    className="text-[20px] font-medium tracking-[-0.02em] text-black/80"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {currentDomain} Distress
                  </h2>

                  <p className="mt-1 text-[13px] leading-relaxed text-black/45">
                    {currentStyle.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-black/60">
                    {currentSectionAnswered}/{currentQuestions.length}
                  </p>
                  <p className="text-[11px] text-black/35">answered</p>
                </div>
              </div>
            </div>

            {currentQuestions.map((q, index) => {
              const selectedValue = answers[q.id]
              const selectedLabel = SCALE.find((s) => s.value === selectedValue)?.label
              const isUnansweredError = !!error && selectedValue == null
              const questionNumber = globalQuestionNumberStart + index + 1

              return (
                <div
                  key={q.id}
                  ref={(el) => {
                    questionRefs.current[q.id] = el
                  }}
                  className={[
                    "rounded-[28px] border bg-[#fefdfb] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all",
                    isUnansweredError
                      ? "border-red-200 ring-4 ring-red-50"
                      : "border-black/[0.06]",
                  ].join(" ")}
                >
                  <div className="mb-5 flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f6efe4] text-[12px] font-semibold text-[#8B6F47]">
                      {questionNumber}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
                          style={{
                            background: currentStyle.bg,
                            color: currentStyle.text,
                            borderColor: currentStyle.border,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {q.domain}
                        </span>

                        {selectedValue != null && (
                          <span className="text-[11px] text-black/35">
                            Selected: {selectedLabel}
                          </span>
                        )}
                      </div>

                      <p className="text-[15px] leading-7 text-black/80">
                        {q.text}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {SCALE.map((option) => {
                      const selected = selectedValue === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleAnswer(q.id, option.value)}
                          aria-pressed={selected}
                          className={[
                            "h-14 rounded-2xl border text-sm font-semibold transition-all",
                            selected
                              ? "border-[#1f1a17] bg-[#1f1a17] text-white shadow-[0_6px_16px_rgba(31,26,23,0.16)]"
                              : "border-black/[0.08] bg-white text-black/60 hover:border-[#8B6F47]/35 hover:bg-[#faf7f2]",
                          ].join(" ")}
                        >
                          {option.value}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-3 flex justify-between gap-3 text-[11px] leading-relaxed text-black/35">
                    <span>Not a Problem</span>
                    <span className="text-right">A Very Serious Problem</span>
                  </div>
                </div>
              )
            })}
          </section>

          {error && (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pb-8">
            <button
              onClick={handlePreviousSection}
              disabled={currentDomainIndex === 0 || loading}
              className={[
                "flex-1 rounded-[18px] py-4 text-sm font-medium transition",
                currentDomainIndex === 0
                  ? "cursor-not-allowed bg-black/[0.08] text-black/30"
                  : "border border-black/[0.08] bg-white text-black/65 hover:bg-[#faf7f2]",
              ].join(" ")}
            >
              ← Back
            </button>

            {!isLastSection ? (
              <button
                onClick={handleNextSection}
                disabled={loading}
                className="flex-1 rounded-[18px] bg-[#1f1a17] py-4 text-sm font-medium text-white transition hover:bg-[#2a231f]"
              >
                {currentSectionComplete ? "Next Category →" : `Continue (${currentQuestions.length - currentSectionAnswered} remaining)`}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !allAnswered}
                className={[
                  "flex-1 rounded-[18px] py-4 text-sm font-medium transition",
                  allAnswered
                    ? "bg-[#1f1a17] text-white hover:bg-[#2a231f]"
                    : "cursor-not-allowed bg-black/[0.08] text-black/30",
                ].join(" ")}
              >
                {loading
                  ? "Calculating your results..."
                  : allAnswered
                  ? "See My Results →"
                  : `Answer all questions to continue (${remaining} remaining)`}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}