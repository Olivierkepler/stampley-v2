"use client";

import StepButtons from "./StepButtons";

export default function HealthLiteracyStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: any) {
  return (
    <section>
      {/* Header */}
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Section B
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Health Literacy
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          These questions help us understand how comfortable you are managing
          health-related information and medical materials.
        </p>
      </div>

      {/* Body */}
      <div className="space-y-6 px-6 py-8">
        <SelectField
          number="1."
          label="How confident are you filling out medical forms by yourself?"
          name="medical_forms_confidence"
          value={formData.medical_forms_confidence}
          options={[
            "Extremely confident",
            "Quite confident",
            "Somewhat confident",
            "A little confident",
            "Not at all confident",
          ]}
          helperText="Select the option that best reflects your confidence level."
          formData={formData}
          setFormData={setFormData}
        />

        <SelectField
          number="2."
          label="How often do you need help reading health-related materials?"
          name="reading_help_frequency"
          value={formData.reading_help_frequency}
          options={[
            "Never",
            "Rarely",
            "Sometimes",
            "Often",
            "Always",
          ]}
          helperText="This includes prescription labels, appointment instructions, and educational materials."
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      {/* Footer */}
      <StepButtons prevStep={prevStep} nextStep={nextStep} />
    </section>
  );
}

function FieldWrapper({
  number,
  label,
  helperText,
  children,
}: {
  number: string;
  label: string;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="border-b border-gray-300 bg-gray-50 px-4 py-3">
        <label className="text-sm font-semibold leading-6 text-gray-900">
          <span className="mr-2 text-gray-500">{number}</span>
          {label}
        </label>

        {helperText && (
          <p className="mt-2 text-xs leading-5 text-gray-500">
            {helperText}
          </p>
        )}
      </div>

      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function SelectField({
  number,
  label,
  helperText,
  name,
  value,
  options,
  formData,
  setFormData,
}: any) {
  return (
    <FieldWrapper
      number={number}
      label={label}
      helperText={helperText}
    >
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