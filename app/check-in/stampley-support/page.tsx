"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCheckInStore } from "@/store/checkin-store"

type StampleyResponse = {
  greeting: string
  validation: string
  reflection_question: string
  micro_skill: string
  education_chip: string
  closure: string
}

export default function StampleySupportPage() {
  const router = useRouter()
  const store = useCheckInStore()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [stampleyResponse, setStampleyResponse] = useState<StampleyResponse | null>(null)
  const [reflectionReply, setReflectionReply] = useState("")
  const [showEducation, setShowEducation] = useState(false)
  const [needsSafety, setNeedsSafety] = useState(false)
  const [subscale, setSubscale] = useState("")
  const [dayNumber, setDayNumber] = useState(1)
  const [weekNumber, setWeekNumber] = useState(1)

  async function handleSubmit() {
    setSubmitting(true)
    setError("")

    try {
      const submitRes = await fetch("/api/check-in/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distress: store.distress,
          mood: store.mood,
          energy: store.energy,
          contextTags: store.contextTags,
          reflection: store.reflection,
          copingAction: store.copingAction,
          domain: store.domain,
        }),
      })

      if (!submitRes.ok) throw new Error("Failed to submit check-in")

      const submitData = await submitRes.json()
      setNeedsSafety(submitData.needsSafetyEscalation)
      setSubscale(submitData.subscale ?? "")
      setDayNumber(submitData.dayNumber ?? 1)
      setWeekNumber(submitData.weekNumber ?? 1)

      setSubmitting(false)
      setLoading(true)

      const stampleyRes = await fetch("/api/stampley/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distress: store.distress,
          mood: store.mood,
          energy: store.energy,
          contextTags: store.contextTags,
          reflection: store.reflection,
          copingAction: store.copingAction,
          domain: store.domain,
          subscale: submitData.subscale,
          dayNumber: submitData.dayNumber,
          weekNumber: submitData.weekNumber,
        }),
      })

      const stampleyData = await stampleyRes.json()
      setStampleyResponse(stampleyData.response)
      setSubmitted(true)
      store.reset()
    } catch (e) {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  const shell = "rounded-[28px] border border-black/[0.08] bg-[#fefdfb] shadow-[0_2px_16px_rgba(10,10,15,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]"
  const softCard = "rounded-[22px] border border-black/[0.08] bg-white/80 shadow-[0_1px_8px_rgba(10,10,15,0.04)]"
  const brown = "#8B6F47"
  const brownSoft = "rgba(139,111,71,0.08)"
  const brownSoft2 = "rgba(139,111,71,0.12)"

  if (submitted && needsSafety) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
        `}</style>

        <div className="max-w-3xl mx-auto w-full px-4 lg:px-0 py-8" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
          <div className={shell + " p-6 md:p-8 space-y-6"}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-6" style={{ background: `${brown}55` }} />
                <span
                  className="text-[9px] uppercase tracking-[0.24em]"
                  style={{ color: `${brown}CC`, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Immediate Support
                </span>
              </div>

              <h1
                className="text-[30px] font-light tracking-[-0.02em] text-[#0a0a0f]/75 mb-2"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                We want to make sure <em className="italic text-black/25">you&apos;re okay</em>
              </h1>

              <p className="text-[13.5px] font-light leading-[1.7] text-black/50">
                It sounds like things may feel especially heavy right now. You do not have to handle this alone.
              </p>
            </div>

            <div className="rounded-[22px] border border-red-200/70 bg-red-50/80 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-[14px] font-medium text-red-800">
                  Support options right now
                </p>
              </div>

              <p className="text-[13px] leading-[1.8] text-red-700">
                If you need immediate support, please use one of the options below.
              </p>

              <div className="space-y-3">
                <a
                  href="sms:741741&body=HOME"
                  className="flex items-center gap-3 rounded-[16px] border border-red-100 bg-white px-4 py-3 text-[13px] text-red-700 hover:bg-red-50 transition"
                >
                  <span className="text-base">📱</span>
                  <span>Crisis Text Line — Text HOME to 741741</span>
                </a>

                <a
                  href="tel:18006624357"
                  className="flex items-center gap-3 rounded-[16px] border border-red-100 bg-white px-4 py-3 text-[13px] text-red-700 hover:bg-red-50 transition"
                >
                  <span className="text-base">📞</span>
                  <span>SAMHSA Helpline — 1-800-662-4357</span>
                </a>
              </div>
            </div>

            {stampleyResponse && (
              <div className={softCard + " p-5"}>
                <p className="text-[13.5px] leading-[1.8] text-black/60">
                  {stampleyResponse.closure}
                </p>
              </div>
            )}

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-[16px] py-[14px] text-[13px] font-medium text-white transition hover:opacity-95"
              style={{ background: "#0a0a0f" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  if (submitted && stampleyResponse) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
        `}</style>

        <div className="max-w-3xl mx-auto w-full px-4 lg:px-0 py-8" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
          <div className={shell + " p-6 md:p-8 space-y-5"}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg border"
                style={{ background: brownSoft, borderColor: brownSoft2 }}
              >
                🤎
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#0a0a0f]">Stampley</p>
                <p className="text-[11px] text-black/35">Your daily support companion</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[22px] border p-5"
              style={{ background: brownSoft, borderColor: brownSoft2 }}
            >
              <p className="text-[13.5px] leading-[1.8]" style={{ color: "#6b5235" }}>
                {stampleyResponse.greeting}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={softCard + " p-5"}
            >
              <p
                className="text-[9px] uppercase tracking-[0.22em] mb-3"
                style={{ color: `${brown}B3`, fontFamily: "'JetBrains Mono', monospace" }}
              >
                What I noticed
              </p>
              <p className="text-[13.5px] text-black/65 leading-[1.8]">
                {stampleyResponse.validation}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={softCard + " p-5 space-y-4"}
            >
              <div className="flex items-center gap-2">
                <span>🪞</span>
                <p
                  className="text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: `${brown}B3`, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Reflect
                </p>
              </div>

              <p
                className="text-[17px] font-light text-[#0a0a0f]/80 leading-snug"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {stampleyResponse.reflection_question}
              </p>

              <textarea
                value={reflectionReply}
                onChange={(e) => setReflectionReply(e.target.value)}
                placeholder="Your response (optional)..."
                rows={4}
                className="w-full rounded-[18px] border border-black/[0.08] bg-[#fefdfb] px-4 py-4 text-[13px] text-black/75 outline-none resize-none transition placeholder:text-black/25 focus:border-[rgba(139,111,71,0.35)] focus:ring-4"
                style={{ boxShadow: "0 1px 6px rgba(10,10,15,0.03)" }}
              />
              <p className="text-[11px] text-black/35">
                Optional — Stampley reads your response but won&apos;t reply back.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={softCard + " p-5"}
            >
              <div className="flex items-center gap-2 mb-3">
                <span>🧘</span>
                <p
                  className="text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: `${brown}B3`, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Try This
                </p>
              </div>
              <p className="text-[13.5px] text-black/65 leading-[1.8]">
                {stampleyResponse.micro_skill}
              </p>
            </motion.div>

            <button
              onClick={() => setShowEducation(!showEducation)}
              className={softCard + " w-full p-4 text-left flex items-center justify-between hover:bg-black/[0.01] transition"}
            >
              <div className="flex items-center gap-2">
                <span>💡</span>
                <p className="text-[13px] font-medium text-black/70">Learn more about this</p>
              </div>
              <svg
                className={`w-4 h-4 text-black/35 transition-transform ${showEducation ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {showEducation && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-[20px] border border-black/[0.06] bg-[#f7f3ed] p-5">
                    <p className="text-[13.5px] text-black/60 leading-[1.8]">
                      {stampleyResponse.education_chip}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[22px] border p-5"
              style={{ background: brownSoft, borderColor: brownSoft2 }}
            >
              <p className="text-[13.5px] leading-[1.8]" style={{ color: "#6b5235" }}>
                {stampleyResponse.closure}
              </p>
            </motion.div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-[16px] py-[14px] text-[13px] font-medium text-white transition hover:opacity-95"
              style={{ background: "#0a0a0f" }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="max-w-3xl mx-auto w-full px-4 lg:px-0 py-8" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
        <div className={shell + " p-6 md:p-8 space-y-6"}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-6" style={{ background: `${brown}55` }} />
              <span
                className="text-[9px] uppercase tracking-[0.24em]"
                style={{ color: `${brown}CC`, fontFamily: "'JetBrains Mono', monospace" }}
              >
                Step 5 of 5
              </span>
            </div>

            <h2
              className="text-[30px] font-light tracking-[-0.02em] text-[#0a0a0f]/75"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Review & <em className="italic text-black/25">Submit</em>
            </h2>

            <p className="text-[13.5px] font-light text-black/50 mt-2 leading-[1.7]">
              Review your check-in, then submit to hear from Stampley.
            </p>
          </div>

          {(submitting || loading) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[22px] border p-7 text-center space-y-4"
              style={{ background: brownSoft, borderColor: brownSoft2 }}
            >
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center animate-pulse"
                style={{ background: brownSoft2 }}
              >
                <span className="text-xl">🤎</span>
              </div>

              <p className="text-[14px] font-medium" style={{ color: "#6b5235" }}>
                {submitting ? "Saving your check-in..." : "Stampley is preparing your response..."}
              </p>

              <p className="text-[12px]" style={{ color: "#8b6f47" }}>
                This takes a few seconds
              </p>
            </motion.div>
          )}

          {!submitting && !loading && (
            <div className="grid gap-3">
              <div className={softCard + " px-5 py-4 flex justify-between items-center"}>
                <p className="text-[13px] text-black/45">Distress</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      store.distress >= 7 ? "bg-red-500" : store.distress >= 4 ? "bg-amber-500" : "bg-green-500"
                    }`}
                  />
                  <p className="text-[13px] font-semibold text-[#0a0a0f]">{store.distress}/10</p>
                </div>
              </div>

              <div className={softCard + " px-5 py-4 flex justify-between items-center"}>
                <p className="text-[13px] text-black/45">Mood</p>
                <p className="text-[13px] font-semibold text-[#0a0a0f]">{store.mood}/10</p>
              </div>

              <div className={softCard + " px-5 py-4 flex justify-between items-center"}>
                <p className="text-[13px] text-black/45">Energy</p>
                <p className="text-[13px] font-semibold text-[#0a0a0f]">{store.energy}/10</p>
              </div>

              <div className={softCard + " px-5 py-4 flex justify-between items-center"}>
                <p className="text-[13px] text-black/45">Context Tags</p>
                <p className="text-[13px] font-semibold text-[#0a0a0f]">
                  {store.contextTags.length > 0 ? `${store.contextTags.length} selected` : "None"}
                </p>
              </div>

              <div className={softCard + " px-5 py-4 flex justify-between items-center"}>
                <p className="text-[13px] text-black/45">Domain</p>
                <p className="text-[13px] font-semibold text-[#0a0a0f]">{store.domain ?? "—"}</p>
              </div>

              {store.reflection && (
                <div className={softCard + " px-5 py-4"}>
                  <p className="text-[13px] text-black/45 mb-2">Reflection</p>
                  <p className="text-[13px] text-black/65 leading-[1.8] line-clamp-3">{store.reflection}</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-[16px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          {!submitting && !loading && (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/check-in/weekly-domain")}
                className="flex-1 rounded-[16px] border border-black/[0.08] bg-[#fefdfb] py-[14px] text-[13px] font-medium text-black/55 hover:bg-black/[0.02] transition"
              >
                ← Back
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 rounded-[16px] py-[14px] text-[13px] font-medium text-white transition hover:opacity-95"
                style={{ background: "#0a0a0f" }}
              >
                Submit & Hear from Stampley
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}