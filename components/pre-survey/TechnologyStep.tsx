"use client";

import StepButtons from "./StepButtons";

export default function TechnologyStep({
  formData,
  setFormData,
  nextStep,
  prevStep,
}: any) {
  return (
    <section>
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Section D
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Technology Experience
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          These questions help us understand your comfort level with digital
          tools, mobile apps, telehealth, and voice-based technology.
        </p>
      </div>

      <div className="space-y-6 px-6 py-8">
        <YesNoField
          number="1."
          label="Do you own a smartphone?"
          name="owns_smartphone"
          value={formData.owns_smartphone}
          formData={formData}
          setFormData={setFormData}
        />

        <SelectField
          number="2."
          label="How often do you use the internet?"
          name="internet_usage"
          value={formData.internet_usage}
          options={[
            "Daily",
            "Several times per week",
            "About once per week",
            "Less than once per week",
            "Rarely or never",
          ]}
          formData={formData}
          setFormData={setFormData}
        />

        <SelectField
          number="3."
          label="How comfortable are you using websites or mobile apps?"
          name="app_comfort"
          value={formData.app_comfort}
          options={[
            "Very comfortable",
            "Somewhat comfortable",
            "Neutral",
            "Somewhat uncomfortable",
            "Very uncomfortable",
          ]}
          formData={formData}
          setFormData={setFormData}
        />

        <YesNoField
          number="4."
          label="Have you used telehealth services before?"
          name="telehealth_used"
          value={formData.telehealth_used}
          formData={formData}
          setFormData={setFormData}
        />

        <YesNoField
          number="5."
          label="Have you ever used online tools or apps for emotional or mental health support?"
          name="mental_health_apps_used"
          value={formData.mental_health_apps_used}
          formData={formData}
          setFormData={setFormData}
        />

        <ScaleField
          number="6."
          label="How comfortable are you using smartphone apps?"
          name="smartphone_app_comfort"
          value={formData.smartphone_app_comfort}
          formData={formData}
          setFormData={setFormData}
        />

        <YesNoField
          number="7."
          label="Have you used digital tools or apps to help manage your health before?"
          name="digital_health_tools_used"
          value={formData.digital_health_tools_used}
          formData={formData}
          setFormData={setFormData}
        />

        <ScaleField
          number="8."
          label="How comfortable are you using voice-based technology?"
          name="voice_tech_comfort"
          value={formData.voice_tech_comfort}
          formData={formData}
          setFormData={setFormData}
        />

        <SelectField
          number="9."
          label="When communicating with digital tools, which format do you generally prefer?"
          name="communication_preference"
          value={formData.communication_preference}
          options={[
            "Text-based messages",
            "Voice-based interaction",
            "Visual buttons and menus",
            "A combination of text and voice",
            "No preference",
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

        {options.map((option: string) => {
          const isBlocked =
            option === "Not sure" || option === "Prefer not to answer";

          return (
            <option
              key={option}
              value={option}
              disabled={isBlocked}
              aria-disabled={isBlocked ? "true" : undefined}
              className={isBlocked ? "cursor-not-allowed opacity-50" : undefined}
            >
              {option}
            </option>
          );
        })}
      </select>
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

function ScaleField({
  number,
  label,
  name,
  value,
  formData,
  setFormData,
}: any) {
  return (
    <FieldWrapper number={number} label={label}>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>0 = Not comfortable</span>
          <span>10 = Very comfortable</span>
        </div>

        <input
          type="range"
          min={0}
          max={10}
          value={value}
          onChange={(e) =>
            setFormData({
              ...formData,
              [name]: Number(e.target.value),
            })
          }
          className="w-full accent-[#005ea8]"
        />

        <div className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900">
          Selected value: {value}
        </div>
      </div>
    </FieldWrapper>
  );
}