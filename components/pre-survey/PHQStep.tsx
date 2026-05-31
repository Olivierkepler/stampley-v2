"use client"

import StepButtons from "./StepButtons"

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could notice, or the opposite — being so fidgety or restless that you move around more than usual",
  "Thoughts that you would be better off dead or hurting yourself in some way",
]

const options = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
]

export default function PHQStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: any) {
  const answeredQuestions = questions.filter((_, index) => {
    const name = `phq${index + 1}`
    return formData[name] !== undefined
  }).length

  const progress = Math.round((answeredQuestions / questions.length) * 100)

  return (
    <section className="bg-white">
      <div className="border-b border-gray-300 bg-[#003e73] px-6 py-5 text-white">
        <p className="text-xs font-['Poppins', sans-serif] uppercase tracking-[0.18em] text-blue-100">
          Section E
        </p>

        <h1 className="mt-2 text-2xl font-['Poppins', sans-serif]">
          Patient Health Questionnaire-9 (PHQ-9)
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-50 font-['Poppins', sans-serif]">
          Over the last 2 weeks, how often have you been bothered by the
          following problems?
        </p>
      </div>

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
          {answeredQuestions} of {questions.length} questions answered
        </p>
      </div>

      <div className="px-6 py-6">
        <div className="overflow-x-auto border border-gray-300 bg-white">
          <table className="w-full min-w-[880px] border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="w-[45%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  Question
                </th>

                {options.map((option) => (
                  <th
                    key={option.value}
                    className="px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500"
                  >
                    <span className="block text-gray-900">
                      {option.label}
                    </span>

                    <span className="mt-1 block text-[10px] font-normal text-gray-400">
                      Score {option.value}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {questions.map((question, index) => {
                const name = `phq${index + 1}`

                return (
                  <tr
                    key={name}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-gray-300 bg-gray-50 text-[11px] font-semibold text-gray-600">
                          {index + 1}
                        </span>

                        <p className="text-[13px] font-medium leading-5 text-gray-900">
                          {question}
                        </p>
                      </div>
                    </td>

                    {options.map((option) => {
                      const selected = formData[name] === option.value

                      return (
                        <td
                          key={option.value}
                          className={`px-3 py-4 text-center align-middle transition ${
                            selected ? "bg-[#f0f6fc]" : "bg-white"
                          }`}
                        >
                          <label className="inline-flex cursor-pointer items-center justify-center">
                            <input
                              type="radio"
                              name={name}
                              value={option.value}
                              checked={selected}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  [name]: option.value,
                                })
                              }
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
                              {selected ? (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              ) : null}
                            </span>

                            <span className="sr-only">{option.label}</span>
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

      <div className="border-t border-amber-200 bg-amber-50 px-6 py-5">
        <p className="text-sm leading-6 text-amber-900">
          If you are experiencing emotional distress or thoughts of self-harm,
          please contact a healthcare provider or emergency support service
          immediately.
        </p>
      </div>

      <div className="bg-gray-50">
        <StepButtons prevStep={prevStep} nextStep={nextStep} />
      </div>
    </section>
  )
}