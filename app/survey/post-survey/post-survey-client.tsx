"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PostSurveyShell from "@/components/post-survey/PostSurveyShell"
import MatrixRadioTable from "@/components/post-survey/MatrixRadioTable"
import StepButtons from "@/components/pre-survey/StepButtons"
import { submitPostSurvey } from "@/actions/post-survey"
import { hasNumericAnswer } from "@/lib/post-survey-scoring"
import {
  POST_DDS_QUESTIONS,
  POST_DDS_SCALE,
  POST_PHQ_QUESTIONS,
  POST_PHQ_SCALE,
  POST_SUS_QUESTIONS,
  POST_STAMPLEY_QUESTIONS,
  POST_LIKERT_5_SCALE,
} from "@/lib/post-survey-constants"

type PostSurveyFormData = {
  dds: Record<string, number | undefined>
  phq: Record<string, number | undefined>
  sus: Record<string, number | undefined>
  stampley: Record<string, number | undefined>
  openReflection: string
  futureResearchContact: boolean | null
  contactName: string
  contactEmail: string
  contactPhone: string
}

const STEP_VALIDATION_MESSAGE =
  "Please answer all required questions before continuing."

const PHQ_ROWS = POST_PHQ_QUESTIONS.map((text, index) => ({
  id: `phq${index + 1}`,
  text,
}))

const SUS_ROWS = POST_SUS_QUESTIONS.map((text, index) => ({
  id: `sus${index + 1}`,
  text,
}))

const STAMPLEY_ROWS = POST_STAMPLEY_QUESTIONS.map((text, index) => ({
  id: `se${index + 1}`,
  text,
}))

function countAnswered(
  answers: Record<string, number | undefined>,
  keys: string[]
): number {
  return keys.filter((key) => hasNumericAnswer(answers[key])).length
}

function validateStep(
  step: number,
  formData: PostSurveyFormData
): { valid: boolean; missingFields: string[] } {
  const missing: string[] = []

  switch (step) {
    case 1:
      break

    case 2:
      for (let i = 1; i <= 17; i++) {
        const key = `q${i}`
        if (!hasNumericAnswer(formData.dds[key])) missing.push(key)
      }
      break

    case 3:
      for (let i = 1; i <= 9; i++) {
        const key = `phq${i}`
        if (!hasNumericAnswer(formData.phq[key])) missing.push(key)
      }
      break

    case 4:
      for (let i = 1; i <= 10; i++) {
        const key = `sus${i}`
        if (!hasNumericAnswer(formData.sus[key])) missing.push(key)
      }
      break

    case 5:
      for (let i = 1; i <= 5; i++) {
        const key = `se${i}`
        if (!hasNumericAnswer(formData.stampley[key])) missing.push(key)
      }
      break

    case 6:
      break

    case 7:
      if (formData.futureResearchContact === null) {
        missing.push("futureResearchContact")
      }
      break

    default:
      break
  }

  return { valid: missing.length === 0, missingFields: missing }
}

function SectionHeader({
  section,
  title,
  description,
}: {
  section: string
  title: string
  description: string
}) {
  return (
    <div className="border-b border-gray-300 bg-[#003e73] px-6 py-5 text-white">
      <p className="text-xs font-['Poppins',sans-serif] uppercase tracking-[0.18em] text-blue-100">
        {section}
      </p>
      <h1 className="mt-2 text-2xl font-['Poppins',sans-serif]">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-50 font-['Poppins',sans-serif]">
        {description}
      </p>
    </div>
  )
}

function ProgressBar({
  answered,
  total,
}: {
  answered: number
  total: number
}) {
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0

  return (
    <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
        <span>Completion Progress</span>
        <span>{progress}% completed</span>
      </div>
      <div className="h-2 overflow-hidden border border-gray-300 bg-white">
        <div
          className="h-full bg-[#005ea8] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {answered} of {total} questions answered
      </p>
    </div>
  )
}

export default function PostSurveyClient() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [stepError, setStepError] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<PostSurveyFormData>({
    dds: {},
    phq: {},
    sus: {},
    stampley: {},
    openReflection: "",
    futureResearchContact: null,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  })

  const nextStep = () => {
    const { valid } = validateStep(step, formData)
    if (!valid) {
      setStepError(STEP_VALIDATION_MESSAGE)
      return
    }
    setStepError("")
    setStep((prev) => Math.min(prev + 1, 7))
  }

  const prevStep = () => {
    setStepError("")
    setSubmitError("")
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    const { valid } = validateStep(7, formData)
    if (!valid) {
      setStepError(STEP_VALIDATION_MESSAGE)
      return
    }

    setStepError("")
    setSubmitError("")
    setIsSubmitting(true)

    try {
      const result = await submitPostSurvey({
        dds: formData.dds,
        phq: formData.phq,
        sus: formData.sus,
        stampley: formData.stampley,
        openReflection: formData.openReflection,
        futureResearchContact: formData.futureResearchContact,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      })

      if (result?.error) {
        setSubmitError(result.error)
        return
      }

      router.push("/survey/post-survey/results")
    } catch {
      setSubmitError("Something went wrong while saving your responses. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const ddsKeys = POST_DDS_QUESTIONS.map((q) => q.id)
  const phqKeys = PHQ_ROWS.map((q) => q.id)
  const susKeys = SUS_ROWS.map((q) => q.id)
  const stampleyKeys = STAMPLEY_ROWS.map((q) => q.id)

  return (
    <PostSurveyShell currentStep={step}>
      {stepError ? (
        <p className="px-6 pt-4 text-sm text-red-700" role="alert">
          {stepError}
        </p>
      ) : null}
      {submitError ? (
        <p className="px-6 pt-4 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      ) : null}

      {step === 1 && (
        <section className="bg-white">
          <SectionHeader
            section="Introduction"
            title="Post-Study Survey"
            description="Thank you for completing all 20 check-ins in the AIDES-T2D study. This short survey asks about your diabetes distress, mood, experience with the study platform, and conversations with Stampley. Your responses help us improve future research."
          />
          <div className="space-y-4 px-6 py-6 text-sm leading-6 text-gray-700">
            <p>
              The survey includes validated questionnaires (DDS-17, PHQ-9, System
              Usability Scale) and a few questions about your experience with
              Stampley. Most sections require a response for each item.
            </p>
            <p>
              One section asks whether you would like to be contacted about
              future research — contact details are optional even if you select
              Yes.
            </p>
            <p className="text-gray-600">
              Estimated time: 10–15 minutes. You can use Back to review earlier
              sections before submitting.
            </p>
          </div>
          <StepButtons nextStep={nextStep} nextLabel="Begin Survey" />
        </section>
      )}

      {step === 2 && (
        <section className="bg-white">
          <SectionHeader
            section="Section 1"
            title="Diabetes Distress Scale (DDS-17)"
            description="Thinking about living with diabetes, indicate how much each item was a problem for you during the past month."
          />
          <ProgressBar
            answered={countAnswered(formData.dds, ddsKeys)}
            total={17}
          />
          <div className="px-6 py-6">
            <MatrixRadioTable
              rows={POST_DDS_QUESTIONS.map((q) => ({ id: q.id, text: q.text }))}
              scale={POST_DDS_SCALE}
              answers={formData.dds}
              onChange={(id, value) =>
                setFormData((prev) => ({
                  ...prev,
                  dds: { ...prev.dds, [id]: value },
                }))
              }
            />
          </div>
          <StepButtons prevStep={prevStep} nextStep={nextStep} />
        </section>
      )}

      {step === 3 && (
        <section className="bg-white">
          <SectionHeader
            section="Section 2"
            title="Patient Health Questionnaire-9 (PHQ-9)"
            description="Over the last 2 weeks, how often have you been bothered by the following problems?"
          />
          <ProgressBar
            answered={countAnswered(formData.phq, phqKeys)}
            total={9}
          />
          <div className="px-6 py-6">
            <MatrixRadioTable
              rows={PHQ_ROWS}
              scale={POST_PHQ_SCALE}
              answers={formData.phq}
              onChange={(id, value) =>
                setFormData((prev) => ({
                  ...prev,
                  phq: { ...prev.phq, [id]: value },
                }))
              }
            />
          </div>
          <StepButtons prevStep={prevStep} nextStep={nextStep} />
        </section>
      )}

      {step === 4 && (
        <section className="bg-white">
          <SectionHeader
            section="Section 3"
            title="System Usability Scale (SUS)"
            description="Please rate your agreement with each statement about using the AIDES-T2D study platform (check-ins, dashboard, and related tools)."
          />
          <ProgressBar
            answered={countAnswered(formData.sus, susKeys)}
            total={10}
          />
          <div className="px-6 py-6">
            <MatrixRadioTable
              rows={SUS_ROWS}
              scale={POST_LIKERT_5_SCALE}
              answers={formData.sus}
              onChange={(id, value) =>
                setFormData((prev) => ({
                  ...prev,
                  sus: { ...prev.sus, [id]: value },
                }))
              }
            />
          </div>
          <StepButtons prevStep={prevStep} nextStep={nextStep} />
        </section>
      )}

      {step === 5 && (
        <section className="bg-white">
          <SectionHeader
            section="Section 4"
            title="Stampley Experience"
            description="Please rate your agreement with each statement about your conversations with Stampley during daily check-ins."
          />
          <ProgressBar
            answered={countAnswered(formData.stampley, stampleyKeys)}
            total={5}
          />
          <div className="px-6 py-6">
            <MatrixRadioTable
              rows={STAMPLEY_ROWS}
              scale={POST_LIKERT_5_SCALE}
              answers={formData.stampley}
              onChange={(id, value) =>
                setFormData((prev) => ({
                  ...prev,
                  stampley: { ...prev.stampley, [id]: value },
                }))
              }
            />
          </div>
          <StepButtons prevStep={prevStep} nextStep={nextStep} />
        </section>
      )}

      {step === 6 && (
        <section className="bg-white">
          <SectionHeader
            section="Section 5"
            title="Open Reflection"
            description="Optional: share anything else about your experience in the study, Stampley, or managing diabetes during the past four weeks."
          />
          <div className="px-6 py-6">
            <label
              htmlFor="openReflection"
              className="block text-sm font-medium text-gray-800"
            >
              Your reflection (optional)
            </label>
            <textarea
              id="openReflection"
              rows={6}
              value={formData.openReflection}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  openReflection: e.target.value,
                }))
              }
              className="mt-3 w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-[#005ea8] focus:outline-none"
              placeholder="Share any thoughts you would like the research team to know..."
            />
          </div>
          <StepButtons prevStep={prevStep} nextStep={nextStep} />
        </section>
      )}

      {step === 7 && (
        <section className="bg-white">
          <SectionHeader
            section="Section 6"
            title="Future Research Contact"
            description="Would you like to be contacted about future diabetes or digital health research opportunities related to this study?"
          />
          <div className="space-y-6 px-6 py-6">
            <fieldset>
              <legend className="text-sm font-medium text-gray-800">
                Future research contact <span className="text-red-600">*</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-4">
                {[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ].map((option) => {
                  const selected =
                    formData.futureResearchContact === option.value
                  return (
                    <label
                      key={option.label}
                      className={`flex cursor-pointer items-center gap-2 border px-4 py-3 text-sm transition ${
                        selected
                          ? "border-[#005ea8] bg-[#f0f6fc] font-semibold text-[#003e73]"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[#005ea8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="futureResearchContact"
                        checked={selected}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            futureResearchContact: option.value,
                          }))
                        }
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                If you selected Yes, you may optionally provide contact details
                below. All fields in this section are optional.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Name (optional)
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactName: e.target.value,
                      }))
                    }
                    className="mt-2 w-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005ea8] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Email (optional)
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="mt-2 w-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005ea8] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    className="mt-2 w-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#005ea8] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-gray-300 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="cursor-pointer border border-gray-500 bg-white px-5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="cursor-pointer bg-[#005ea8] px-6 py-2 text-sm font-semibold text-white hover:bg-[#004b87] disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </button>
          </div>
        </section>
      )}
    </PostSurveyShell>
  )
}
