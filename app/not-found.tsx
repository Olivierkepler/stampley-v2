export default function NotFound() {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        `}</style>
  
        <div
          className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf7f2_0%,#f7f3ed_45%,#fefdfb_100%)]"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.55),transparent_30%)]" />
  
          <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
            <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[36px] border border-black/[0.06] bg-[#fefdfb]/85 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-10">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-px w-8 bg-[#8B6F47]/35" />
                  <span
                    className="text-[10px] uppercase tracking-[0.22em] text-[#8B6F47]/80"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Error 404
                  </span>
                </div>
  
                <h1
                  className="text-[42px] font-medium leading-[0.98] tracking-[-0.04em] text-black/85 sm:text-[56px]"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  This page
                  <br />
                  <em className="font-light italic text-black/28">couldn’t be found.</em>
                </h1>
  
                <p className="mt-5 max-w-xl text-[15px] leading-8 text-black/52">
                  The page you’re looking for may have moved, expired, or never existed.
                  Let’s get you back to a part of the app that’s actually useful.
                </p>
  
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-[18px] bg-[#1f1a17] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#2a231f] shadow-[0_8px_20px_rgba(31,26,23,0.16)]"
                  >
                    Go to dashboard
                  </a>
  
                  {/* <a
                    href="/check-in"
                    className="inline-flex items-center justify-center rounded-[18px] border border-black/[0.08] bg-white/70 px-6 py-3.5 text-sm font-medium text-black/65 transition hover:bg-[#faf7f2]"
                  >
                    Start check-in
                  </a> */}
                </div>
  
                <div className="mt-8 rounded-[22px] border border-[#e7dac8] bg-[#f6efe4]/65 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#8B6F47]/80">
                    Helpful note
                  </p>
                  <p className="mt-2 text-[13px] leading-6 text-black/50">
                    If you typed the address manually, check for spelling mistakes. If you followed a link,
                    the destination may no longer be available.
                  </p>
                </div>
              </section>
  
              <aside className="rounded-[36px] border border-black/[0.06] bg-[#1f1a17] p-8 text-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-10">
                <p
                  className="text-[10px] uppercase tracking-[0.22em] text-white/35"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Navigation options
                </p>
  
                <div className="mt-6 space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Return to your dashboard",
                      text: "View your recent activity, assessments, and overall progress.",
                    },
                    {
                      step: "02",
                      title: "Continue your check-in",
                      text: "Jump back into your next guided support step without losing momentum.",
                    },
                    {
                      step: "03",
                      title: "Restart from home",
                      text: "Use the main app entry point if you want to reorient yourself.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium text-white/70">
                          {item.step}
                        </div>
                        <div>
                          <h2
                            className="text-[18px] font-medium tracking-[-0.02em] text-white"
                            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                          >
                            {item.title}
                          </h2>
                          <p className="mt-2 text-[13px] leading-6 text-white/58">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
  
                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
                    Status
                  </p>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-[14px] text-white/65">Page availability</span>
                    <span
                      className="text-[34px] font-semibold tracking-[-0.04em] text-white"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      404
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </>
    )
  }