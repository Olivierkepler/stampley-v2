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
    <section>
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Section E
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Patient Health Questionnaire-9 (PHQ-9)
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          Over the last 2 weeks, how often have you been bothered by the
          following problems?
        </p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{progress}% completed</span>
          </div>

          <div className="h-2 border border-gray-300 bg-white">
            <div
              className="h-full bg-[#005ea8] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-300 bg-[#f8fafc] px-6 py-4">
        <p className="text-sm leading-6 text-gray-700">
          Please select one response for each row.
        </p>
      </div>

      <div className="px-6 py-8">
        <div className="overflow-x-auto border border-gray-300 bg-white">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="w-[42%] px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                  Question
                </th>

                {options.map((option) => (
                  <th
                    key={option.value}
                    className="px-4 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-gray-500"
                  >
                    <span className="block text-gray-900">{option.label}</span>
                    <span className="mt-1 block font-normal text-gray-400">
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
                    <td className="px-4 py-5 align-top">
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-600">
                          {index + 1}
                        </span>

                        <p className="text-sm font-medium leading-6 text-gray-900">
                          {question}
                        </p>
                      </div>
                    </td>

                    {options.map((option) => {
                      const selected = formData[name] === option.value

                      return (
                        <td
                          key={option.value}
                          className={`px-4 py-5 text-center align-middle transition ${
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
                              className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                                selected
                                  ? "border-[#005ea8] bg-[#005ea8]"
                                  : "border-gray-400 bg-white hover:border-[#005ea8]"
                              }`}
                              aria-hidden="true"
                            >
                              {selected && (
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                              )}
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

      <div className="border-t border-gray-300 bg-amber-50 px-6 py-5">
        <p className="text-sm leading-6 text-amber-900">
          If you are experiencing emotional distress or thoughts of self-harm,
          please contact a healthcare provider or emergency support service
          immediately.
        </p>
      </div>

      <StepButtons prevStep={prevStep} nextStep={nextStep} />
    </section>
  )
}