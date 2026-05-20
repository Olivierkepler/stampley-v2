"use client";

import StepButtons from "./StepButtons";

export default function DiabetesHistoryStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: any) {
  return (
    <section>
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Section C
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Diabetes and Health History
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          These questions help us understand your diabetes history, current
          treatment, and overall health background.
        </p>
      </div>

      <div className="space-y-6 px-6 py-8">
        <SelectField
          number="1."
          label="How long have you been living with Type 2 Diabetes?"
          name="diabetes_duration"
          value={formData.diabetes_duration}
          options={[
            "Less than 1 year",
            "1–5 years",
            "6–10 years",
            "More than 10 years",
            "Not sure",
          ]}
          formData={formData}
          setFormData={setFormData}
        />

        <MultiSelectField
          number="2."
          label="What treatments are you currently using for your diabetes?"
          name="current_treatments"
          values={formData.current_treatments}
          options={[
            "Lifestyle changes only",
            "Oral medication",
            "Insulin",
            "Non-insulin injectable medication",
            "Diet or meal planning",
            "Physical activity plan",
            "Other",
            "None currently",
          ]}
          formData={formData}
          setFormData={setFormData}
        />

        <YesNoField
          number="3."
          label="Have you attended diabetes education classes before?"
          name="attended_diabetes_classes"
          value={formData.attended_diabetes_classes}
          formData={formData}
          setFormData={setFormData}
        />

        <MultiSelectField
          number="4."
          label="Do you currently use any of the following?"
          name="diabetes_tools_used"
          values={formData.diabetes_tools_used}
          options={[
            "Blood glucose meter",
            "Continuous glucose monitor",
            "Insulin pump",
            "Medication reminder app",
            "Food tracking app",
            "Fitness tracker",
            "Patient portal",
            "None of these",
          ]}
          formData={formData}
          setFormData={setFormData}
        />

        <SelectField
          number="5."
          label="How would you rate your overall health?"
          name="overall_health_rating"
          value={formData.overall_health_rating}
          options={[
            "Excellent",
            "Very good",
            "Good",
            "Fair",
            "Poor",
          ]}
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <StepButtons prevStep={prevStep} nextStep={nextStep} />
    </section>
  );
}

function FieldWrapper({
  number,
  label,
  children,
}: {
  number: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="border-b border-gray-300 bg-gray-50 px-4 py-3">
        <label className="text-sm font-semibold leading-6 text-gray-900">
          <span className="mr-2 text-gray-500">{number}</span>
          {label}
        </label>
      </div>

      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function SelectField({
  number,
  label,
  name,
  value,
  options,
  formData,
  setFormData,
}: any) {
  return (
    <FieldWrapper number={number} label={label}>
      <select
        value={value}
        onChange={(e) =>
          setFormData({
            ...formData,
            [name]: e.target.value,
          })
        }
        className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#005ea8]"
      >
        <option value="">Select one</option>

        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

function MultiSelectField({
  number,
  label,
  name,
  values,
  options,
  formData,
  setFormData,
}: any) {
  function toggleOption(option: string) {
    const current = Array.isArray(values) ? values : [];

    const updated = current.includes(option)
      ? current.filter((item: string) => item !== option)
      : [...current, option];

    setFormData({
      ...formData,
      [name]: updated,
    });
  }

  return (
    <FieldWrapper number={number} label={label}>
      <p className="mb-3 text-xs text-gray-500">
        Select all that apply.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option: string) => {
          const selected = values?.includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() => toggleOption(option)}
              className={`border px-4 py-3 text-left text-sm transition ${
                selected
                  ? "border-[#005ea8] bg-[#f0f6fc] font-semibold text-[#003e73]"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {selected ? "✓ " : ""}
              {option}
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}

function YesNoField({
  number,
  label,
  name,
  value,
  formData,
  setFormData,
}: any) {
  return (
    <FieldWrapper number={number} label={label}>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "Yes", value: true },
          { label: "No", value: false },
        ].map((option) => {
          const selected = value === option.value;

          return (
            <button
              type="button"
              key={option.label}
              onClick={() =>
                setFormData({
                  ...formData,
                  [name]: option.value,
                })
              }
              className={`border px-4 py-3 text-left text-sm transition ${
                selected
                  ? "border-[#005ea8] bg-[#f0f6fc] font-semibold text-[#003e73]"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {selected ? "✓ " : ""}
              {option.label}
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}