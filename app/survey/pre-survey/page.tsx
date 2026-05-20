// app/survey/pre-survey/page.tsx

"use client";

import { useState } from "react";
import { submitPreSurvey } from "@/actions/pre-survey";

export default function PreSurveyPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await submitPreSurvey({
      age: Number(age),
      gender,
    });

    window.location.href = "/survey/dds";
  }

  return (
    <main className="min-h-screen bg-[#fefdfb] px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-8 rounded-2xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold">Pre-Survey</h1>

        <div>
          <label className="block font-semibold">What is your age?</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-2 w-full rounded border p-3"
            required
          />
        </div>

        <div>
          <p className="font-semibold">What is your gender?</p>

          {["Male", "Female", "Prefer not to answer"].map((option) => (
            <label key={option} className="mt-2 block">
              <input
                type="radio"
                name="gender"
                value={option}
                onChange={(e) => setGender(e.target.value)}
                required
              />{" "}
              {option}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="rounded bg-[#8B6F47] px-6 py-3 text-white"
        >
          Continue
        </button>
      </form>
    </main>
  );
}