"use client";

import StepButtons from "./StepButtons";

export default function ConsentStep({
  formData,
  setFormData,
  nextStep,
}: any) {
  return (
    <section>
      {/* Header */}
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Section 1
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Consent to Participate
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          You are being invited to participate in the AIDES-T2D research study.
          Before continuing, please review the information below and indicate
          whether you consent to participate in this study.
        </p>
      </div>

      {/* Body */}
      <div className="space-y-8 px-6 py-8">
        {/* Notice Box */}
        <div className="border border-[#c7d8ea] bg-[#f0f6fc] p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#003e73]">
            Important Information
          </h2>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
            <li>
              • Your participation in this study is completely voluntary.
            </li>

            <li>
              • You may stop participating at any time without penalty.
            </li>

            <li>
              • Your responses will be kept confidential and used only for
              research purposes.
            </li>

            <li>
              • Some survey questions may ask about your emotional well-being
              and experiences managing diabetes.
            </li>
          </ul>
        </div>

        {/* Consent Question */}
        <div className="border border-gray-300">
          <div className="border-b border-gray-300 bg-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">
              Participant Consent
            </p>
          </div>

          <div className="space-y-4 px-5 py-5">
            {[
              {
                value: "I consent to participate",
                title: "I consent to participate",
                description:
                  "I have read the information above and voluntarily agree to participate in this research study.",
              },
              {
                value: "I do not consent",
                title: "I do not consent",
                description:
                  "I do not wish to participate in this research study.",
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`block cursor-pointer border p-4 transition ${
                  formData.consent_status === option.value
                    ? "border-[#005ea8] bg-[#f0f6fc]"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="consent_status"
                    value={option.value}
                    checked={formData.consent_status === option.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consent_status: e.target.value,
                      })
                    }
                    className="mt-1 h-4 w-4 accent-[#005ea8]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {option.title}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Acknowledgement */}
        <div className="rounded-sm border-l-4 border-[#005ea8] bg-[#f8fafc] px-4 py-4">
          <p className="text-sm leading-6 text-gray-700">
            By selecting{" "}
            <span className="font-semibold">
              “I consent to participate”
            </span>
            , you acknowledge that you understand the purpose of this study and
            agree to participate voluntarily.
          </p>
        </div>
      </div>

      {/* Footer Buttons */}
      <StepButtons nextStep={nextStep} />
    </section>
  );
}