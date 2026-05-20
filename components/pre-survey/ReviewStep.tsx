"use client";

import { useState } from "react";
import { submitPreSurvey } from "@/actions/pre-survey";
import StepButtons from "./StepButtons";

export default function ReviewStep({ formData, prevStep }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await submitPreSurvey(formData);
      window.location.href = "/check-in";
    } catch (error) {
      console.error("Pre-survey submit failed:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-b border-gray-300 bg-gray-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Final Step
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Review & Submit
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
          Please review your responses before submitting. After submission, you
          will continue to the daily check-in.
        </p>
      </div>

      <div className="space-y-6 px-6 py-8">
        <div className="border border-[#c7d8ea] bg-[#f0f6fc] p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#003e73]">
            Submission Notice
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-700">
            By submitting this form, your pre-survey responses will be securely
            saved as part of your AIDES-T2D study record.
          </p>
        </div>

        <ReviewRow label="Consent Status" value={formData.consent_status} />
        <ReviewRow label="Age" value={formData.age} />
        <ReviewRow label="Gender" value={formData.gender} />
        <ReviewRow label="Diagnosis Duration" value={formData.diagnosis_duration} />
        <ReviewRow label="Health Insurance" value={formData.insurance_type} />
        <ReviewRow label="Internet Usage" value={formData.internet_usage} />
        <ReviewRow label="Communication Preference" value={formData.communication_preference} />
      </div>

      <StepButtons
        prevStep={prevStep}
        submit
        nextLabel={isSubmitting ? "Submitting..." : "Submit Pre-Survey"}
      />
    </form>
  );
}

function ReviewRow({ label, value }: { label: string; value: any }) {
  const displayValue = Array.isArray(value)
    ? value.length > 0
      ? value.join(", ")
      : "Not answered"
    : value || "Not answered";

  return (
    <div className="border border-gray-300 bg-white">
      <div className="border-b border-gray-300 bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
      </div>

      <div className="px-4 py-4">
        <p className="text-sm leading-6 text-gray-700">{displayValue}</p>
      </div>
    </div>
  );
}