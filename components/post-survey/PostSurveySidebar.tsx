"use client"

const steps = [
  "Introduction",
  "DDS-17",
  "PHQ-9",
  "System Usability",
  "Stampley Experience",
  "Open Reflection",
  "Future Contact",
]

export default function PostSurveySidebar({
  currentStep,
}: {
  currentStep: number
}) {
  return (
    <aside className="border border-gray-300 bg-[#f7f9fb]">
      <div className="border-b border-gray-300 bg-gray-100 px-4 py-3">
        <h2 className="text-sm font-bold text-gray-800">Form Progress</h2>
      </div>

      <ol className="divide-y divide-gray-300">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const active = currentStep === stepNumber
          const completed = currentStep > stepNumber

          return (
            <li
              key={step}
              className={`flex gap-3 px-4 py-3 text-sm ${
                active
                  ? "border-l-4 border-[#005ea8] bg-white font-bold text-[#003e73]"
                  : completed
                    ? "text-gray-700"
                    : "text-gray-500"
              }`}
            >
              <span>{completed ? "✓" : stepNumber}.</span>
              <span>{step}</span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
