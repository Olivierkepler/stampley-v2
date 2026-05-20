"use client";

import StepButtons from "./StepButtons";

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
];

const options = [
  {
    value: 0,
    label: "Not at all",
    description: "Did not occur",
  },
  {
    value: 1,
    label: "Several days",
    description: "Occurred occasionally",
  },
  {
    value: 2,
    label: "More than half the days",
    description: "Occurred frequently",
  },
  {
    value: 3,
    label: "Nearly every day",
    description: "Occurred almost daily",
  },
];

export default function PHQStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: any) {
  const answeredQuestions = questions.filter((_, index) => {
    const name = `phq${index + 1}`;
    return formData[name] !== undefined;
  }).length;

  const progress = Math.round((answeredQuestions / questions.length) * 100);

  return (
    <section>
      {/* Header */}
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

        {/* Progress */}
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

      {/* Instructions */}
      <div className="border-b border-gray-300 bg-[#f8fafc] px-6 py-4">
        <p className="text-sm leading-6 text-gray-700">
          Please select the response that best describes how often you
          experienced each symptom during the past two weeks.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6 px-6 py-8">
        {questions.map((question, index) => {
          const name = `phq${index + 1}`;

          return (
            <div
              key={name}
              className="border border-gray-300 bg-white"
            >
              {/* Question Header */}
              <div className="border-b border-gray-300 bg-gray-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-gray-300 bg-white text-sm font-semibold text-gray-700">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="divide-y divide-gray-200">
                {options.map((option) => {
                  const selected = formData[name] === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-4 px-5 py-4 transition ${
                        selected
                          ? "bg-[#f0f6fc]"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
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
                        className="mt-1 h-4 w-4 accent-[#005ea8]"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <p
                            className={`text-sm font-medium ${
                              selected
                                ? "text-[#003e73]"
                                : "text-gray-900"
                            }`}
                          >
                            {option.label}
                          </p>

                          <span className="border border-gray-300 bg-white px-2 py-1 text-xs text-gray-500">
                            Score {option.value}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="border-t border-gray-300 bg-amber-50 px-6 py-5">
        <p className="text-sm leading-6 text-amber-900">
          If you are experiencing emotional distress or thoughts of self-harm,
          please contact a healthcare provider or emergency support service
          immediately.
        </p>
      </div>

      {/* Footer */}
      <StepButtons prevStep={prevStep} nextStep={nextStep} />
    </section>
  );
}