"use client";

import StepButtons from "./StepButtons";

export default function DemographicsStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: any) {
  return (
    <section>
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Section A
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Demographics
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          Please complete the following background questions. Select the option
          that best describes you.
        </p>
      </div>

      <div className="space-y-6 px-6 py-8">
        <SelectField
          number="1."
          label="How long ago were you diagnosed with type 2 diabetes?"
          name="diagnosis_duration"
          value={formData.diagnosis_duration}
          options={[
            "Less than 1 year ago",
            "1–5 years ago",
            "6–10 years ago",
            "More than 10 years ago",
            "Not sure",
          ]}
          setFormData={setFormData}
          formData={formData}
        />

        <TextField
          number="2."
          label="What is your age in years?"
          name="age"
          type="number"
          placeholder="Enter age"
          value={formData.age}
          setFormData={setFormData}
          formData={formData}
        />

        <SelectField
          number="3."
            label="Sex assigned at birth"
          name="gender"
          value={formData.gender}
          options={["Female", "Male", "Prefer not to answer"]}
          setFormData={setFormData}
          formData={formData}
        />

        <MultiSelectField
          number="4."
          label="Which race do you identify with?"
          name="race"
          values={formData.race}
          options={[
            "American Indian or Alaska Native",
            "Asian",
            "Black or African American",
            "Native Hawaiian or Other Pacific Islander",
            "White",
            "Multiracial",
            "Other",
            "Prefer not to answer",
          ]}
          setFormData={setFormData}
          formData={formData}
        />

        <SelectField
          number="5."
          label="Are you of Hispanic, Latino, or Spanish origin?"
          name="ethnicity"
          value={formData.ethnicity}
          options={["Yes", "No", "Prefer not to answer"]}
          setFormData={setFormData}
          formData={formData}
        />

        <SelectField
          number="6."
          label="What is your current marital status?"
          name="marital_status"
          value={formData.marital_status}
          options={[
            "Single",
            "Married",
            "Living with partner",
            "Separated",
            "Divorced",
            "Widowed",
            "Prefer not to answer",
          ]}
          setFormData={setFormData}
          formData={formData}
        />

        <SelectField
          number="7."
          label="What is the highest level of education you completed?"
          name="education"
          value={formData.education}
          options={[
            "Less than high school",
            "High school diploma or GED",
            "Some college",
            "Associate degree",
            "Bachelor’s degree",
            "Graduate or professional degree",
            "Prefer not to answer",
          ]}
          setFormData={setFormData}
          formData={formData}
        />

        <SelectField
          number="8."
          label="What is your current employment status?"
          name="employment_status"
          value={formData.employment_status}
          options={[
            "Employed full-time",
            "Employed part-time",
            "Self-employed",
            "Unemployed",
            "Student",
            "Retired",
            "Unable to work",
            "Prefer not to answer",
          ]}
          setFormData={setFormData}
          formData={formData}
        />

        <SelectField
          number="9."
          label="What is your annual household income?"
          name="household_income"
          value={formData.household_income}
          options={[
            "Less than $25,000",
            "$25,000–$49,999",
            "$50,000–$74,999",
            "$75,000–$99,999",
            "$100,000 or more",
            "Prefer not to answer",
          ]}
          setFormData={setFormData}
          formData={formData}
        />

        <SelectField
          number="10."
          label="What type of health insurance do you currently have?"
          name="insurance_type"
          value={formData.insurance_type}
          options={[
            "Private insurance",
            "Medicaid",
            "Medicare",
            "Military/Veterans insurance",
            "No insurance",
            "Other",
            "Not sure",
            "Prefer not to answer",
          ]}
          setFormData={setFormData}
          formData={formData}
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
        <label className="text-sm font-semibold text-gray-900">
          <span className="mr-2 text-gray-500">{number}</span>
          {label}
        </label>
      </div>

      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function TextField({
  number,
  label,
  name,
  value,
  type = "text",
  placeholder,
  formData,
  setFormData,
}: any) {
  return (
    <FieldWrapper number={number} label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          setFormData({
            ...formData,
            [name]: e.target.value,
          })
        }
        className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#005ea8]"
      />
    </FieldWrapper>
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