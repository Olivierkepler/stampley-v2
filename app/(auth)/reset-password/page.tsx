"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { resetPassword } from "@/actions/password-reset"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="f-body relative flex min-h-screen overflow-hidden bg-[#f5f2ec]">
          <div className="grain hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between px-14 py-12 bg-[#0a0a0f] text-white">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div
                className="mesh-drift absolute"
                style={{
                  width: "140%",
                  height: "140%",
                  top: "-20%",
                  left: "-20%",
                  background: [
                    "radial-gradient(ellipse 600px 500px at 20% 30%, rgba(61,90,128,0.35) 0%, transparent 70%)",
                    "radial-gradient(ellipse 500px 600px at 80% 70%, rgba(157,120,85,0.2) 0%, transparent 70%)",
                    "radial-gradient(ellipse 400px 400px at 50% 50%, rgba(61,90,128,0.15) 0%, transparent 70%)",
                  ].join(", "),
                }}
              />
            </div>

            <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none">
              <svg viewBox="0 0 800 900" fill="none" className="w-full h-full">
                <path d="M-50 200 C200 180, 400 260, 850 200" stroke="white" strokeWidth="0.8" />
                <path d="M-50 280 C200 260, 450 340, 850 280" stroke="white" strokeWidth="0.6" />
                <path d="M-50 360 C180 340, 420 400, 850 360" stroke="white" strokeWidth="0.5" />
                <path d="M-50 440 C220 420, 380 480, 850 440" stroke="white" strokeWidth="0.4" />
                <path d="M-50 520 C240 500, 400 560, 850 530" stroke="white" strokeWidth="0.5" />
                <path d="M-50 600 C200 580, 440 640, 850 610" stroke="white" strokeWidth="0.6" />
                <path d="M-50 680 C180 660, 460 720, 850 690" stroke="white" strokeWidth="0.4" />
                <path d="M-50 760 C220 740, 400 800, 850 770" stroke="white" strokeWidth="0.3" />
              </svg>
            </div>

            <div className="relative z-[2] flex flex-col justify-between h-full">
              <div className="anim-brand flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  <span className="f-mono text-[10px] tracking-[0.2em] text-white/60">APP</span>
                </div>
                <span className="f-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/40 select-none">
                  AIDES-T2D Study Portal
                </span>
              </div>

              <div className="anim-hero max-w-[520px]">
                <p className="f-mono mb-7 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-[#5b7ea1]">
                  <span className="inline-block h-px w-7 bg-[#5b7ea1] opacity-50" />
                  Participant Account Recovery
                </p>
                <h1
                  className="f-display mb-6 font-light leading-[1.08] text-white/[0.93] select-none"
                  style={{ fontSize: "clamp(38px, 4.2vw, 62px)", letterSpacing: "-0.02em" }}
                >
                  Reset link
                  <br />
                  <em className="italic font-light text-white/30">is invalid.</em>
                </h1>
                <p className="max-w-[380px] text-sm font-light leading-[1.75] text-white/[0.32]">
                  This password reset link is missing or invalid. Request a new one to continue securely.
                </p>
              </div>

              <div className="anim-tips max-w-[420px]">
                <p className="f-mono mb-4 text-[9px] uppercase tracking-[0.22em] text-white/25 select-none">
                  What to do next
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    "Go back to forgot password",
                    "Enter your email again",
                    "Use the newest email link only",
                    "Old links may expire or be single-use",
                  ].map((tip) => (
                    <div key={tip} className="flex items-center gap-3">
                      <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#3d5a80]/50 bg-[#3d5a80]/10">
                        <svg className="h-[9px] w-[9px] stroke-[#5b7ea1]" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      <span className="text-[12px] font-light text-white/45">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="anim-stats flex items-center">
                {[
                  { value: "1×", label: "Single-use link" },
                  { value: "Safe", label: "Secure flow" },
                  { value: "Fast", label: "Request again" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col gap-[5px] px-8 ${i === 0 ? "pl-0" : "border-l border-white/[0.07]"}`}
                  >
                    <span className="f-display text-[26px] font-normal leading-none tracking-[-0.02em] text-white/[0.85]">
                      {stat.value}
                    </span>
                    <span className="f-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-11 right-12 z-[2] f-mono text-[8.5px] uppercase tracking-[0.2em] text-white/[0.08] select-none">
              Secure · HIPAA Compliant · IRB Approved
            </div>
          </div>

          <div className="dot-pattern relative flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:shrink-0 lg:bg-[#fefdfb] lg:px-14 lg:py-16 lg:shadow-[inset_1px_0_0_rgba(10,10,15,0.04),-32px_0_80px_rgba(10,10,15,0.04)]">
            <div className="anim-form relative z-10 w-full max-w-[380px]">
              <div className="mb-10">
                <div className="f-mono mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/60 select-none">
                  <span className="inline-block h-2 w-2 rounded-[3px] border-[1.5px] border-[#3d5a80] opacity-50" />
                  Participant Password Reset
                </div>
                <h2
                  className="f-display mb-2 text-[36px] font-normal leading-[1.1] text-[#0a0a0f]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Invalid reset link.
                </h2>
                <p className="text-[13px] font-light leading-[1.6] text-black/60">
                  This password reset link is invalid or missing. Please request a new one.
                </p>
              </div>

              <Link
                href="/forgot-password"
                className="btn-shimmer relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] border-none bg-[#0a0a0f] px-6 py-[14px] f-body text-[13px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_4px_16px_rgba(10,10,15,0.18),0_1px_3px_rgba(10,10,15,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-[#1a1a24]"
              >
                Request New Link
              </Link>

              <div className="mt-8 flex flex-col gap-5">
                <p className="text-center text-[12.5px] font-light text-black/70">
                  <Link
                    href="/login"
                    className="font-medium text-[#0a0a0f] no-underline border-b border-black/20 transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80]"
                  >
                    ← Back to sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (success) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="f-body relative flex min-h-screen overflow-hidden bg-[#f5f2ec]">
          <div className="grain hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between px-14 py-12 bg-[#0a0a0f] text-white">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div
                className="mesh-drift absolute"
                style={{
                  width: "140%",
                  height: "140%",
                  top: "-20%",
                  left: "-20%",
                  background: [
                    "radial-gradient(ellipse 600px 500px at 20% 30%, rgba(61,90,128,0.35) 0%, transparent 70%)",
                    "radial-gradient(ellipse 500px 600px at 80% 70%, rgba(157,120,85,0.2) 0%, transparent 70%)",
                    "radial-gradient(ellipse 400px 400px at 50% 50%, rgba(61,90,128,0.15) 0%, transparent 70%)",
                  ].join(", "),
                }}
              />
            </div>

            <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none">
              <svg viewBox="0 0 800 900" fill="none" className="w-full h-full">
                <path d="M-50 200 C200 180, 400 260, 850 200" stroke="white" strokeWidth="0.8" />
                <path d="M-50 280 C200 260, 450 340, 850 280" stroke="white" strokeWidth="0.6" />
                <path d="M-50 360 C180 340, 420 400, 850 360" stroke="white" strokeWidth="0.5" />
                <path d="M-50 440 C220 420, 380 480, 850 440" stroke="white" strokeWidth="0.4" />
                <path d="M-50 520 C240 500, 400 560, 850 530" stroke="white" strokeWidth="0.5" />
                <path d="M-50 600 C200 580, 440 640, 850 610" stroke="white" strokeWidth="0.6" />
                <path d="M-50 680 C180 660, 460 720, 850 690" stroke="white" strokeWidth="0.4" />
                <path d="M-50 760 C220 740, 400 800, 850 770" stroke="white" strokeWidth="0.3" />
              </svg>
            </div>

            <div className="relative z-[2] flex flex-col justify-between h-full">
              <div className="anim-brand flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  <span className="f-mono text-[10px] tracking-[0.2em] text-white/60">APP</span>
                </div>
                <span className="f-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/40 select-none">
                  AIDES-T2D Study Portal
                </span>
              </div>

              <div className="anim-hero max-w-[520px]">
                <p className="f-mono mb-7 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-[#5b7ea1]">
                  <span className="inline-block h-px w-7 bg-[#5b7ea1] opacity-50" />
                  Participant Account Recovery
                </p>
                <h1
                  className="f-display mb-6 font-light leading-[1.08] text-white/[0.93] select-none"
                  style={{ fontSize: "clamp(38px, 4.2vw, 62px)", letterSpacing: "-0.02em" }}
                >
                  Password updated,
                  <br />
                  <em className="italic font-light text-white/30">you’re all set.</em>
                </h1>
                <p className="max-w-[380px] text-sm font-light leading-[1.75] text-white/[0.32]">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
              </div>

              <div className="anim-tips max-w-[420px]">
                <p className="f-mono mb-4 text-[9px] uppercase tracking-[0.22em] text-white/25 select-none">
                  Security status
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    "Reset token was accepted",
                    "Password is now updated",
                    "Old password no longer works",
                    "You can sign in immediately",
                  ].map((tip) => (
                    <div key={tip} className="flex items-center gap-3">
                      <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-[#3d5a80]/50 bg-[#3d5a80]/10">
                        <svg className="h-[9px] w-[9px] stroke-[#5b7ea1]" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      <span className="text-[12px] font-light text-white/45">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="anim-stats flex items-center">
                {[
                  { value: "1×", label: "Token used" },
                  { value: "AES", label: "Encrypted store" },
                  { value: "Safe", label: "Bcrypt hashed" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col gap-[5px] px-8 ${i === 0 ? "pl-0" : "border-l border-white/[0.07]"}`}
                  >
                    <span className="f-display text-[26px] font-normal leading-none tracking-[-0.02em] text-white/[0.85]">
                      {stat.value}
                    </span>
                    <span className="f-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-11 right-12 z-[2] f-mono text-[8.5px] uppercase tracking-[0.2em] text-white/[0.08] select-none">
              Secure · HIPAA Compliant · IRB Approved
            </div>
          </div>

          <div className="dot-pattern relative flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:shrink-0 lg:bg-[#fefdfb] lg:px-14 lg:py-16 lg:shadow-[inset_1px_0_0_rgba(10,10,15,0.04),-32px_0_80px_rgba(10,10,15,0.04)]">
            <div className="anim-form relative z-10 w-full max-w-[380px]">
              <div className="anim-success flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="pulse-ring relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#3d5a80]/20 bg-[#3d5a80]/[0.06]">
                    <svg className="h-[30px] w-[30px]" viewBox="0 0 24 24" fill="none" stroke="#3d5a80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="f-mono mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/50 select-none">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                  Password Updated
                </div>

                <h2
                  className="f-display mb-3 text-[34px] font-normal leading-[1.1] text-[#0a0a0f]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Password reset successfully.
                </h2>

                <p className="text-[13px] font-light leading-[1.7] text-black/55 mb-6">
                  Your password has been updated. You can now sign in with your new password.
                </p>

                <div className="mt-8 w-full border-t border-black/[0.08] pt-6">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full rounded-[10px] border border-black/[0.1] bg-transparent py-[13px] f-body text-[12.5px] font-medium text-black/70 transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.03]"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    formData.append("token", token!)
    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  return (
    <>
      <style>{sharedStyles}</style>

      <div className="f-body relative flex min-h-screen overflow-hidden bg-[#f5f2ec]">
        <div className="grain hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between px-14 py-12 bg-[#0a0a0f] text-white">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="mesh-drift absolute"
              style={{
                width: "140%",
                height: "140%",
                top: "-20%",
                left: "-20%",
                background: [
                  "radial-gradient(ellipse 600px 500px at 20% 30%, rgba(61,90,128,0.35) 0%, transparent 70%)",
                  "radial-gradient(ellipse 500px 600px at 80% 70%, rgba(157,120,85,0.2) 0%, transparent 70%)",
                  "radial-gradient(ellipse 400px 400px at 50% 50%, rgba(61,90,128,0.15) 0%, transparent 70%)",
                ].join(", "),
              }}
            />
          </div>

          <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none">
            <svg viewBox="0 0 800 900" fill="none" className="w-full h-full">
              <path d="M-50 200 C200 180, 400 260, 850 200" stroke="white" strokeWidth="0.8" />
              <path d="M-50 280 C200 260, 450 340, 850 280" stroke="white" strokeWidth="0.6" />
              <path d="M-50 360 C180 340, 420 400, 850 360" stroke="white" strokeWidth="0.5" />
              <path d="M-50 440 C220 420, 380 480, 850 440" stroke="white" strokeWidth="0.4" />
              <path d="M-50 520 C240 500, 400 560, 850 530" stroke="white" strokeWidth="0.5" />
              <path d="M-50 600 C200 580, 440 640, 850 610" stroke="white" strokeWidth="0.6" />
              <path d="M-50 680 C180 660, 460 720, 850 690" stroke="white" strokeWidth="0.4" />
              <path d="M-50 760 C220 740, 400 800, 850 770" stroke="white" strokeWidth="0.3" />
            </svg>
          </div>

          <div className="relative z-[2] flex flex-col justify-between h-full">
            <div className="anim-brand flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                <span className="f-mono text-[10px] tracking-[0.2em] text-white/60">APP</span>
              </div>
              <span className="f-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/40 select-none">
                AIDES-T2D Study Portal
              </span>
            </div>

            <div className="anim-hero max-w-[520px]">
              <p className="f-mono mb-7 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-[#5b7ea1]">
                <span className="inline-block h-px w-7 bg-[#5b7ea1] opacity-50" />
                Participant Account Recovery
              </p>
              <h1
                className="f-display mb-6 font-light leading-[1.08] text-white/[0.93] select-none"
                style={{ fontSize: "clamp(38px, 4.2vw, 62px)", letterSpacing: "-0.02em" }}
              >
                Choose a
                <br />
                new password,{" "}
                <em className="italic font-light text-white/30">one last step.</em>
              </h1>
              <p className="max-w-[380px] text-sm font-light leading-[1.75] text-white/[0.32]">
                Create a strong, unique password to secure your participant account. This link is single-use and expires shortly.
              </p>
            </div>

            <div className="anim-tips max-w-[420px]">
              <p className="f-mono mb-4 text-[9px] uppercase tracking-[0.22em] text-white/25 select-none">
                Password tips
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  { check: true, text: "At least 8 characters long" },
                  { check: true, text: "Mix of uppercase and lowercase letters" },
                  { check: true, text: "At least one number or symbol" },
                  { check: false, text: "Avoid passwords used on other sites" },
                ].map((tip) => (
                  <div key={tip.text} className="flex items-center gap-3">
                    <div
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
                        tip.check ? "border-[#3d5a80]/50 bg-[#3d5a80]/10" : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      {tip.check ? (
                        <svg className="h-[9px] w-[9px] stroke-[#5b7ea1]" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg className="h-[9px] w-[9px] stroke-white/20" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[12px] font-light ${tip.check ? "text-white/45" : "text-white/20"}`}>
                      {tip.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="anim-stats flex items-center">
              {[
                { value: "1×", label: "Single-use link" },
                { value: "AES", label: "Encrypted store" },
                { value: "Safe", label: "Bcrypt hashed" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex flex-col gap-[5px] px-8 ${i === 0 ? "pl-0" : "border-l border-white/[0.07]"}`}
                >
                  <span className="f-display text-[26px] font-normal leading-none tracking-[-0.02em] text-white/[0.85]">
                    {stat.value}
                  </span>
                  <span className="f-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-11 right-12 z-[2] f-mono text-[8.5px] uppercase tracking-[0.2em] text-white/[0.08] select-none">
            Secure · HIPAA Compliant · IRB Approved
          </div>
        </div>

        <div className="dot-pattern relative flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:shrink-0 lg:bg-[#fefdfb] lg:px-14 lg:py-16 lg:shadow-[inset_1px_0_0_rgba(10,10,15,0.04),-32px_0_80px_rgba(10,10,15,0.04)]">
          <div className="anim-form relative z-10 w-full max-w-[380px]">
            <div className="mb-10">
              <div className="f-mono mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/60 select-none">
                <span className="inline-block h-2 w-2 rounded-[3px] border-[1.5px] border-[#3d5a80] opacity-50" />
                Participant Password Reset
              </div>
              <h2
                className="f-display mb-2 text-[36px] font-normal leading-[1.1] text-[#0a0a0f]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Set new password.
              </h2>
              <p className="text-[13px] font-light leading-[1.6] text-black/60">
                Choose a strong password to regain access to your check-in dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-100/80 bg-red-50/60 px-4 py-3 text-[12.5px] leading-relaxed text-[#9b2226]">
                <svg className="mt-[1px] h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="13" />
                  <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={loading}
                  className="styled-input f-body w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] px-4 text-[13.5px] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/40 focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
                />
                <p className="text-[10.5px] text-black/35 font-light pl-1">Minimum 8 characters</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={loading}
                  className="styled-input f-body w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] px-4 text-[13.5px] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/40 focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
                />
              </div>

              <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] px-4 py-4">
                <p className="f-mono mb-3 text-[9px] uppercase tracking-[0.16em] text-black/45">
                  Password requirements
                </p>
                <div className="space-y-2">
                  {[
                    "At least 8 characters",
                    "Both passwords must match",
                  ].map((item) => (
                    <p key={item} className="text-[11.5px] text-black/55 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/25" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-shimmer relative mt-1 w-full cursor-pointer overflow-hidden rounded-[10px] border-none bg-[#0a0a0f] px-6 py-[14px] f-body text-[13px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_4px_16px_rgba(10,10,15,0.18),0_1px_3px_rgba(10,10,15,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:not-disabled:-translate-y-px hover:not-disabled:bg-[#1a1a24] hover:not-disabled:shadow-[0_8px_28px_rgba(10,10,15,0.25),0_2px_6px_rgba(10,10,15,0.15)] active:not-disabled:translate-y-0 active:not-disabled:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="spinner inline-block h-3.5 w-3.5 rounded-full border-[1.5px] border-white/20 border-t-white" />
                      <span className="text-[11px] tracking-[0.12em]">Updating...</span>
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-5">
              <p className="text-center text-[12.5px] font-light text-black/70">
                <Link
                  href="/login"
                  className="font-medium text-[#0a0a0f] no-underline border-b border-black/20 transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80]"
                >
                  ← Back to sign in
                </Link>
              </p>

              <div className="mt-1 flex items-center justify-center gap-5 border-t border-black/[0.08] pt-6">
                {[
                  { label: "IRB Approved", type: "shield" },
                  { label: "HIPAA", type: "shield" },
                  { label: "256-bit SSL", type: "lock" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-1.5">
                    <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round">
                      {badge.type === "lock" ? (
                        <>
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </>
                      ) : (
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      )}
                    </svg>
                    <span className="f-mono text-[8.5px] uppercase tracking-[0.14em] text-black/50">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <>
          <style>{sharedStyles}</style>
          <div className="min-h-screen flex items-center justify-center bg-[#f5f2ec]">
            <div className="text-sm text-black/50">Loading...</div>
          </div>
        </>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
  .f-display { font-family: 'Fraunces', Georgia, serif; }
  .f-mono    { font-family: 'JetBrains Mono', monospace; }
  .f-body    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes meshDrift {
    0%   { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(30px, -20px) rotate(2deg); }
  }
  .mesh-drift { animation: meshDrift 25s ease-in-out infinite alternate; }

  .grain::after {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
    opacity: 0.7; pointer-events: none; z-index: 1;
  }

  .dot-pattern::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(10,10,15,0.04) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.5; pointer-events: none;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }

  .anim-brand { opacity: 0; animation: fadeDown 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; }
  .anim-hero  { opacity: 0; animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.25s forwards; }
  .anim-tips  { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; }
  .anim-stats { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s forwards; }
  .anim-form  { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; }
  .anim-success { opacity: 0; animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; }

  .btn-shimmer::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    transition: left 0.6s ease;
  }
  .btn-shimmer:hover:not(:disabled)::before { left: 120%; }

  .styled-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f5f2ec inset !important;
    -webkit-text-fill-color: #0a0a0f !important;
  }
  .styled-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px #fefdfb inset !important;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.7s linear infinite; }

  @keyframes pulseRing {
    0%   { transform: scale(0.95); opacity: 0.6; }
    100% { transform: scale(1.15); opacity: 0; }
  }
  .pulse-ring::before {
    content: '';
    position: absolute; inset: -8px;
    border-radius: 50%;
    border: 1.5px solid rgba(61,90,128,0.3);
    animation: pulseRing 2s ease-out infinite;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 4px; }
`