"use client";

import { useState } from "react";
import ConsentStep from "@/components/pre-survey/ConsentStep";
import DemographicsStep from "@/components/pre-survey/DemographicsStep";
import HealthLiteracyStep from "@/components/pre-survey/HealthLiteracyStep";
import DiabetesHistoryStep from "@/components/pre-survey/DiabetesHistoryStep";
import TechnologyStep from "@/components/pre-survey/TechnologyStep";
import PHQStep from "@/components/pre-survey/PHQStep";
import ReviewStep from "@/components/pre-survey/ReviewStep";
import PreSurveyShell from "@/components/pre-survey/PreSurveyShell";

export default function PreSurveyClient() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    consent_status: "",
    diagnosis_verified: false,
    diagnosis_file_url: "",

    diagnosis_duration: "",
    age: "",
    gender: "",
    race: [] as string[],
    ethnicity: "",
    marital_status: "",
    education: "",
    employment_status: "",
    household_income: "",
    insurance_type: "",

    medical_forms_confidence: "",
    reading_help_frequency: "",

    diabetes_duration: "",
    current_treatments: [] as string[],
    attended_diabetes_classes: false,
    diabetes_tools_used: [] as string[],
    overall_health_rating: "",

    owns_smartphone: false,
    internet_usage: "",
    app_comfort: "",
    telehealth_used: false,
    mental_health_apps_used: false,

    smartphone_app_comfort: 0,
    digital_health_tools_used: false,
    voice_tech_comfort: 0,
    communication_preference: "",

    phq1: 0,
    phq2: 0,
    phq3: 0,
    phq4: 0,
    phq5: 0,
    phq6: 0,
    phq7: 0,
    phq8: 0,
    phq9: 0,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 7));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <PreSurveyShell currentStep={step}>
      {step === 1 && (
        <ConsentStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <DemographicsStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 3 && (
        <HealthLiteracyStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 4 && (
        <DiabetesHistoryStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 5 && (
        <TechnologyStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 6 && (
        <PHQStep
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 7 && (
        <ReviewStep formData={formData} prevStep={prevStep} />
      )}
    </PreSurveyShell>
  );
}