"use client";

export default function StepButtons({
  prevStep,
  nextStep,
  nextLabel = "Continue",
  submit = false,
}: {
  prevStep?: () => void;
  nextStep?: () => void;
  nextLabel?: string;
  submit?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-300 bg-gray-50 px-6 py-4">
      {prevStep ? (
        <button
          type="button"
          onClick={prevStep}
          className="border border-gray-500 bg-white px-5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
        >
          Back
        </button>
      ) : (
        <div />
      )}

      <button
        type={submit ? "submit" : "button"}
        onClick={submit ? undefined : nextStep}
        className="bg-[#005ea8] px-6 py-2 text-sm font-semibold text-white hover:bg-[#004b87]"
      >
        {nextLabel}
      </button>
    </div>
  );
}