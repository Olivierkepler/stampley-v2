"use client";

import PreSurveySidebar from "./PreSurveySidebar";

export default function PreSurveyShell({
  currentStep,
  children,
}: {
  currentStep: number;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white ">
      <div className="mx-auto  ">
        <div className="mb-6 border border-gray-300 bg-white">
          <div className="border-b border-gray-300 bg-[#003e73] px-6 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest">
              AIDES-T2D Research Study
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              Participant Pre-Survey Form
            </h1>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[280px_1fr]">
            <PreSurveySidebar currentStep={currentStep} />

            <div className="border border-gray-300 bg-white">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}