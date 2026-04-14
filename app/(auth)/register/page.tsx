"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerWithKey } from "@/actions/register"

export default function RegisterPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const result = await registerWithKey(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/login?message=Account created! Please sign in.")
    }
  }

  return (
    <>
      <style>{`
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
          opacity: 0.7;
          pointer-events: none;
          z-index: 1;
        }

        .dot-pattern::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(10,10,15,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.5;
          pointer-events: none;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-brand  { opacity: 0; animation: fadeDown 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; }
        .anim-hero   { opacity: 0; animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.25s forwards; }
        .anim-steps  { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s forwards; }
        .anim-badges { opacity: 0; animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s forwards; }
        .anim-form   { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; }

        .input-group:focus-within .input-icon {
          stroke: #3d5a80;
          transform: translateY(-50%) scale(1.06);
        }

        .styled-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #f5f2ec inset !important;
          -webkit-text-fill-color: #0a0a0f !important;
        }
        .styled-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px #fefdfb inset !important;
        }

        .btn-shimmer::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transition: left 0.6s ease;
        }
        .btn-shimmer:hover:not(:disabled)::before { left: 120%; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }

        .step-line::after {
          content: '';
          position: absolute;
          left: 13px;
          top: 28px;
          width: 1px;
          height: calc(100% - 8px);
          background: linear-gradient(to bottom, rgba(61,90,128,0.25), transparent);
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 4px; }
      `}</style>

      <div className="f-body relative flex min-h-screen overflow-hidden bg-[#f5f2ec]">
        <div className="absolute left-6 top-6 z-20">
          <a
            href="/login"
            className="flex items-center gap-2 px-3 py-3 rounded-full cursor-pointer hover:scale-105 transition text-[#0a0a0f] text-sm font-medium shadow border border-white/10 hover:border-white/20"
            aria-label="Go to login"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#3d5a80]"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </a>
        </div>

        {/* LEFT — Dark editorial panel */}
        <div className="grain hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between px-14 py-18 bg-[#0a0a0f] text-white">
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
            <svg viewBox="0 0 800 900" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
                Study Portal
              </span>
            </div>

            <div className="anim-hero max-w-[520px]">
              <p className="f-mono mb-7 flex items-center gap-3 text-[9.5px] uppercase tracking-[0.28em] text-[#5b7ea1]">
                <span className="inline-block h-px w-7 bg-[#5b7ea1] opacity-50" />
                Participant Enrollment
              </p>
              <h1
                className="f-display mb-6 font-light leading-[1.08] text-white/[0.93] select-none"
                style={{ fontSize: "clamp(38px, 4.2vw, 62px)", letterSpacing: "-0.02em" }}
              >
                Begin your journey{" "}
                <em className="italic font-light text-white/30">
                  with the study.
                </em>
              </h1>
              <p className="max-w-[380px] text-sm font-light leading-[1.75] text-white/[0.32]">
                Your Study ID connects you to the program. Once registered,
                you can access your account and continue with your participant experience.
              </p>
            </div>

            <div className="anim-steps max-w-[400px]">
              <p className="f-mono mb-5 text-[9px] uppercase tracking-[0.22em] text-white/25 select-none">
                How it works
              </p>
              <div className="flex flex-col gap-0">
                {[
                  {
                    num: "01",
                    title: "Enter your Study ID",
                    desc: "Use the unique key provided by your research coordinator.",
                  },
                  {
                    num: "02",
                    title: "Create your account",
                    desc: "Set your email and password to access your portal securely.",
                  },
                  {
                    num: "03",
                    title: "Sign in and begin",
                    desc: "Once registered, return to login and access your account.",
                  },
                ].map((step, i) => (
                  <div key={step.num} className={`relative flex gap-5 pb-7 ${i < 2 ? "step-line" : ""}`}>
                    <div className="shrink-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#3d5a80]/40 bg-[#3d5a80]/10">
                      <span className="f-mono text-[8.5px] font-medium text-[#5b7ea1]">{step.num}</span>
                    </div>
                    <div className="pt-[3px]">
                      <p className="text-[12.5px] font-medium text-white/70 mb-[3px]">{step.title}</p>
                      <p className="text-[11.5px] font-light text-white/30 leading-[1.5]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anim-badges flex items-center gap-6">
              {[
                { value: "ID", label: "Required" },
                { value: "SSL", label: "Protected" },
                { value: "100%", label: "Confidential" },
              ].map((badge, i) => (
                <div
                  key={badge.label}
                  className={`flex flex-col gap-[5px] px-8 ${i === 0 ? "pl-0" : "border-l border-white/[0.07]"}`}
                >
                  <span className="f-display text-[26px] font-normal leading-none tracking-[-0.02em] text-white/[0.85]">
                    {badge.value}
                  </span>
                  <span className="f-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-11 right-12 z-[2] f-mono text-[8.5px] uppercase tracking-[0.2em] text-white/[0.08] select-none">
            Secure · Private · Verified
          </div>
        </div>

        {/* RIGHT — Form panel */}
        <div className="dot-pattern relative flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:shrink-0 lg:bg-[#fefdfb] lg:px-14 lg:py-16 lg:shadow-[inset_1px_0_0_rgba(10,10,15,0.04),-32px_0_80px_rgba(10,10,15,0.04)]">
          <div className="anim-form relative z-10 w-full max-w-[380px]">
            <div className="mb-10">
              <div className="f-mono mb-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/60 select-none">
                <span className="inline-block h-2 w-2 rounded-[3px] border-[1.5px] border-[#3d5a80] opacity-50" />
                Participant Registration
              </div>
              <h2
                className="f-display mb-2 text-[36px] font-normal leading-[1.1] text-[#0a0a0f]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Join the study.
              </h2>
              <p className="text-[13px] font-light leading-[1.6] text-black/60">
                Enter your Study ID to create your account.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-100/80 bg-red-50/60 px-4 py-3 text-[12.5px] leading-relaxed text-[#9b2226]">
                <svg
                  className="mt-[1px] h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="13" />
                  <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="studyId"
                  className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none"
                >
                  Study ID
                </label>
                <div className="input-group relative">
                  <svg
                    className="input-icon pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-black/40 transition-all duration-200"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                  <input
                    id="studyId"
                    name="studyId"
                    type="text"
                    placeholder="AIDES-XXXXXX"
                    required
                    disabled={loading}
                    className="styled-input f-mono w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] pl-[42px] pr-4 text-[13px] uppercase tracking-[0.1em] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/30 placeholder:normal-case placeholder:tracking-normal focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>
                <p className="text-[10.5px] text-black/35 font-light pl-1">
                  Provided by your research coordinator
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none"
                >
                  Email Address
                </label>
                <div className="input-group relative">
                  <svg
                    className="input-icon pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-black/40 transition-all duration-200"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2.5" />
                    <path d="m2 7 10 7 10-7" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    required
                    disabled={loading}
                    className="styled-input f-body w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] pl-[42px] pr-4 text-[13.5px] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/40 focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="f-mono text-[9.5px] uppercase tracking-[0.16em] text-black/70 select-none"
                >
                  Password
                </label>
                <div className="input-group relative">
                  <svg
                    className="input-icon pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 fill-none stroke-black/40 transition-all duration-200"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2.5" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    disabled={loading}
                    className="styled-input f-body w-full rounded-[10px] border border-black/[0.12] bg-[#f5f2ec] py-[13px] pl-[42px] pr-11 text-[13.5px] text-[#0a0a0f] outline-none transition-all duration-200 placeholder:text-black/40 focus:border-[#3d5a80] focus:bg-[#fefdfb] focus:shadow-[0_0_0_3.5px_rgba(61,90,128,0.12)] disabled:cursor-not-allowed disabled:opacity-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-black/40 transition-colors duration-200 hover:text-black/70"
                    aria-label="Toggle password visibility"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className="h-[15px] w-[15px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        className="h-[15px] w-[15px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[10.5px] text-black/35 font-light pl-1">
                  Minimum 8 characters
                </p>
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
                      <span className="text-[11px] tracking-[0.12em]">Creating account...</span>
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-5">
              <p className="text-center text-[12.5px] font-light text-black/70">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-md cursor-pointer text-lg text-[#0a0a0f] no-underline border-b border-black/20 transition-all duration-200 hover:border-[#3d5a80] hover:text-[#3d5a80]"
                >
                  Sign in
                </Link>
              </p>

              <div className="mt-1 flex items-center justify-center gap-5 border-t border-black/[0.08] pt-6">
                {[
                  {
                    label: "Private",
                    icon: (
                      <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Secure",
                    icon: (
                      <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Encrypted",
                    icon: (
                      <svg className="h-[11px] w-[11px] stroke-[#3d5a80] opacity-70" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    ),
                  },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-1.5">
                    {badge.icon}
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