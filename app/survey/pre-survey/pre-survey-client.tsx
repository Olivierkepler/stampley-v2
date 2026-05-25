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

type PreSurveyFormData = {
  consent_status: string;
  diagnosis_verified: boolean;
  diagnosis_file_url: string;
  diagnosis_duration: string;
  age: string;
  gender: string;
  race: string[];
  ethnicity: string;
  marital_status: string;
  education: string;
  employment_status: string;
  household_income: string;
  insurance_type: string;
  medical_forms_confidence: string;
  reading_help_frequency: string;
  diabetes_duration: string;
  current_treatments: string[];
  attended_diabetes_classes: boolean;
  diabetes_tools_used: string[];
  overall_health_rating: string;
  owns_smartphone: boolean;
  internet_usage: string;
  app_comfort: string;
  telehealth_used: boolean;
  mental_health_apps_used: boolean;
  smartphone_app_comfort: number;
  digital_health_tools_used: boolean;
  voice_tech_comfort: number;
  communication_preference: string;
  phq1: number;
  phq2: number;
  phq3: number;
  phq4: number;
  phq5: number;
  phq6: number;
  phq7: number;
  phq8: number;
  phq9: number;
};

function isFilled(value: string): boolean {
  return value.trim() !== "";
}

function isNonEmptyArray(value: string[]): boolean {
  return Array.isArray(value) && value.length > 0;
}

function isValidPhq(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 3;
}

function validateStep(
  step: number,
  formData: PreSurveyFormData
): { valid: boolean; missingFields: string[] } {
  const missing: string[] = [];

  switch (step) {
    case 1:
      if (formData.consent_status !== "I consent to participate") {
        missing.push("consent_status");
      }
      break;

    case 2:
      if (!isFilled(formData.diagnosis_duration)) {
        missing.push("diagnosis_duration");
      }
      {
        const age = formData.age.trim();
        if (!age || !Number.isFinite(Number(age)) || Number(age) <= 0) {
          missing.push("age");
        }
      }
      if (!isFilled(formData.gender)) missing.push("gender");
      if (!isNonEmptyArray(formData.race)) missing.push("race");
      if (!isFilled(formData.ethnicity)) missing.push("ethnicity");
      if (!isFilled(formData.marital_status)) missing.push("marital_status");
      if (!isFilled(formData.education)) missing.push("education");
      if (!isFilled(formData.employment_status)) {
        missing.push("employment_status");
      }
      if (!isFilled(formData.household_income)) {
        missing.push("household_income");
      }
      if (!isFilled(formData.insurance_type)) missing.push("insurance_type");
      break;

    case 3:
      if (!isFilled(formData.medical_forms_confidence)) {
        missing.push("medical_forms_confidence");
      }
      if (!isFilled(formData.reading_help_frequency)) {
        missing.push("reading_help_frequency");
      }
      break;

    case 4:
      if (!isFilled(formData.diabetes_duration)) {
        missing.push("diabetes_duration");
      }
      if (!isNonEmptyArray(formData.current_treatments)) {
        missing.push("current_treatments");
      }
      if (!isNonEmptyArray(formData.diabetes_tools_used)) {
        missing.push("diabetes_tools_used");
      }
      if (!isFilled(formData.overall_health_rating)) {
        missing.push("overall_health_rating");
      }
      break;

    case 5:
      if (!isFilled(formData.internet_usage)) missing.push("internet_usage");
      if (!isFilled(formData.app_comfort)) missing.push("app_comfort");
      if (!isFilled(formData.communication_preference)) {
        missing.push("communication_preference");
      }
      break;

    case 6:
      for (let i = 1; i <= 9; i++) {
        const key = `phq${i}` as keyof PreSurveyFormData;
        const value = formData[key];
        if (!isValidPhq(value as number)) {
          missing.push(`phq${i}`);
        }
      }
      break;

    case 7:
      break;

    default:
      break;
  }

  return { valid: missing.length === 0, missingFields: missing };
}

const STEP_VALIDATION_MESSAGE =
  "Please answer all required questions before continuing.";

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

  const [stepError, setStepError] = useState("");

  const nextStep = () => {
    const { valid } = validateStep(step, formData);
    if (!valid) {
      setStepError(STEP_VALIDATION_MESSAGE);
      return;
    }
    setStepError("");
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setStepError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <PreSurveyShell currentStep={step}>
      {stepError ? (
        <p className="px-6 pt-4 text-sm text-red-700" role="alert">
          {stepError}
        </p>
      ) : null}

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