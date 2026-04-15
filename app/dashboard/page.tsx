import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  if (session.user?.role === "PARTICIPANT") {
    const ddsResult = await query(
      "SELECT confirmed_domain FROM dds_responses WHERE user_id = $1",
      [session.user.id]
    )
    if (ddsResult.rows.length === 0) redirect("/survey/dds")
    if (!ddsResult.rows[0].confirmed_domain) redirect("/survey/dds/results")
  }

  const todayCheckin = await query(
    `SELECT id FROM check_in_submissions
     WHERE user_id = $1 AND check_in_date = CURRENT_DATE`,
    [session.user?.id]
  )
  const checkedInToday = todayCheckin.rows.length > 0

  const domainResult = await query(
    `SELECT domain FROM user_weekly_domains
     WHERE user_id = $1 ORDER BY week_number DESC LIMIT 1`,
    [session.user?.id]
  )
  const currentDomain = domainResult.rows[0]?.domain ?? null

  const progressResult = await query(
    `SELECT total_checkins, current_week
     FROM user_study_progress WHERE user_id = $1`,
    [session.user?.id]
  )
  const progress = progressResult.rows[0] ?? null

  const firstName = session.user?.email?.split("@")[0]?.split(".")[0] ?? ""
  const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const DOMAIN_META: Record<string, {
    emoji: string; label: string; desc: string
    accent: string; accentRgb: string
    bg: string; border: string; glow: string
  }> = {
    Emotional:     {
      emoji: "💙", label: "Emotional Burden",  desc: "Managing feelings around diabetes",
      accent: "#4a6080", accentRgb: "74,96,128",
      bg: "linear-gradient(135deg,#f0f4f9 0%,#e8eef6 100%)",
      border: "rgba(74,96,128,0.14)", glow: "rgba(74,96,128,0.08)",
    },
    Regimen:       {
      emoji: "📋", label: "Regimen-Related",   desc: "Medications, blood sugar & meal planning",
      accent: "#7c6a52", accentRgb: "124,106,82",
      bg: "linear-gradient(135deg,#f5f0e8 0%,#ede5d6 100%)",
      border: "rgba(124,106,82,0.14)", glow: "rgba(124,106,82,0.08)",
    },
    Physician:     {
      emoji: "🩺", label: "Physician-Related", desc: "Your healthcare team relationship",
      accent: "#4a6a52", accentRgb: "74,106,82",
      bg: "linear-gradient(135deg,#eef4ef 0%,#e2ede4 100%)",
      border: "rgba(74,106,82,0.14)", glow: "rgba(74,106,82,0.08)",
    },
    Interpersonal: {
      emoji: "🤝", label: "Interpersonal",     desc: "Support from family and friends",
      accent: "#7a5a6a", accentRgb: "122,90,106",
      bg: "linear-gradient(135deg,#f5eff3 0%,#ede2e9 100%)",
      border: "rgba(122,90,106,0.14)", glow: "rgba(122,90,106,0.08)",
    },
  }

  const domainMeta = currentDomain ? DOMAIN_META[currentDomain] : null
  const checkinPct = progress ? Math.min((progress.total_checkins / 28) * 100, 100) : 0
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .card {
          background: rgba(255,252,246,0.85);
          border: 1.5px solid rgba(10,10,5,0.07);
          border-radius: 20px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 4px 24px rgba(10,10,5,0.05),
            0 1px 4px rgba(10,10,5,0.04);
        }

        .card-elevated {
          background: rgba(255,252,246,0.95);
          border: 1.5px solid rgba(10,10,5,0.08);
          border-radius: 20px;
          box-shadow:
            0 1px 0 rgba(255,255,255,1) inset,
            0 8px 32px rgba(10,10,5,0.07),
            0 2px 8px rgba(10,10,5,0.05);
        }

        .mono { font-family: 'JetBrains Mono', monospace; }
        .serif { font-family: 'Fraunces', Georgia, serif; }
        .sans { font-family: 'Outfit', system-ui, sans-serif; }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(145deg, #1c1c1a, #0d0d0c);
          color: rgba(255,252,245,0.92);
          border-radius: 13px;
          padding: 11px 22px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'Outfit', system-ui, sans-serif;
          text-decoration: none;
          border: none;
          cursor: pointer;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 6px 20px rgba(10,10,5,0.22),
            0 2px 6px rgba(10,10,5,0.12);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .btn-primary:hover {
          transform: translateY(-1.5px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 10px 28px rgba(10,10,5,0.28),
            0 3px 8px rgba(10,10,5,0.14);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.5);
          color: rgba(10,10,5,0.5);
          border: 1.5px solid rgba(10,10,5,0.1);
          border-radius: 13px;
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: 'Outfit', system-ui, sans-serif;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 2px 8px rgba(10,10,5,0.04);
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.8);
          color: rgba(10,10,5,0.7);
          transform: translateY(-1px);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(10,10,5,0.06), transparent);
        }

        .pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 100px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          background: rgba(10,10,5,0.045);
          border: 1px solid rgba(10,10,5,0.07);
          color: rgba(10,10,5,0.4);
        }

        @keyframes checkPop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .check-icon { animation: checkPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .s1 { animation: fadeSlideUp 0.4s ease both; }
        .s2 { animation: fadeSlideUp 0.4s 0.06s ease both; }
        .s3 { animation: fadeSlideUp 0.4s 0.12s ease both; }
        .s4 { animation: fadeSlideUp 0.4s 0.18s ease both; }
        .s5 { animation: fadeSlideUp 0.4s 0.24s ease both; }
      `}</style>

      <div
        className="min-h-screen sans"
        style={{ background: "linear-gradient(155deg,#fefdfb 0%,#f6f2eb 60%,#f0ebe0 100%)" }}
      >
        {/* ── Navbar ── */}
        <nav
          style={{
            background: "rgba(254,253,251,0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(10,10,5,0.06)",
            position: "sticky", top: 0, zIndex: 30,
          }}
        >
          <div style={{
            maxWidth: 680, margin: "0 auto", padding: "0 24px",
            height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg,#1c1c1a,#3a3a36)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(10,10,5,0.2)", flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="rgba(255,252,245,0.7)" strokeWidth="1.5"/>
                  <path d="M7 4v3l2 1.5" stroke="rgba(255,252,245,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="mono" style={{
                fontSize: 11, letterSpacing: "0.28em",
                color: "rgba(10,10,5,0.4)", textTransform: "uppercase", fontWeight: 500,
              }}>
                AIDES-T2D
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <form action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}>
                <button type="submit" className="btn-ghost" style={{ padding: "6px 14px", fontSize: 11 }}>
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </nav>

        {/* ── Body ── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 24px 60px" , marginTop: "100px"}}>

          {/* Header */}
          <div className="s1" style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 18, height: 1, background: "rgba(10,10,5,0.18)", display: "block" }} />
              <span className="mono" style={{
                fontSize: 9, letterSpacing: "0.28em",
                color: "rgba(10,10,5,0.28)", textTransform: "uppercase",
              }}>
                {today}
              </span>
            </div>
            <h1 className="serif" style={{
              fontSize: 38, fontWeight: 300, lineHeight: 1.08,
              letterSpacing: "-0.025em", color: "rgba(10,10,5,0.78)", margin: 0,
            }}>
              Welcome back,{" "}
              <em style={{ fontStyle: "italic", color: "rgba(10,10,5,0.32)" }}>
                {formattedName}
              </em>
            </h1>
            {session.user?.role === "PARTICIPANT" && (
              <p className="sans" style={{
                fontSize: 13, color: "rgba(10,10,5,0.38)",
                marginTop: 8, marginBottom: 0, lineHeight: 1.5,
              }}>
                {checkedInToday
                  ? "You've completed today's check-in. Great consistency!"
                  : "Your daily check-in is ready — it only takes a few minutes."}
              </p>
            )}
          </div>

          {/* Study Progress */}
          {progress && session.user?.role === "PARTICIPANT" && (
            <div className="card s2" style={{ padding: "22px 24px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span className="mono" style={{
                  fontSize: 9, letterSpacing: "0.26em",
                  color: "rgba(10,10,5,0.3)", textTransform: "uppercase",
                }}>
                  Study Progress
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="pill">Week {progress.current_week} / 4</span>
                  <span className="pill">{progress.total_checkins} / 28 check-ins</span>
                </div>
              </div>

              {/* Per-week segment bars */}
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {[1, 2, 3, 4].map((w) => {
                  const weekCheckins = Math.min(Math.max(progress.total_checkins - (w - 1) * 7, 0), 7)
                  const pct = (weekCheckins / 7) * 100
                  const isPast = w < progress.current_week
                  const isCurrent = w === progress.current_week
                  return (
                    <div key={w} style={{ flex: 1 }}>
                      <div style={{
                        height: 6, borderRadius: 100, overflow: "hidden",
                        background: "rgba(10,10,5,0.07)", marginBottom: 6,
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 100,
                          width: `${isPast ? 100 : isCurrent ? pct : 0}%`,
                          background: isPast
                            ? "rgba(10,10,5,0.45)"
                            : "linear-gradient(90deg,rgba(10,10,5,0.3),rgba(10,10,5,0.55))",
                          transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                        }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span className="mono" style={{
                          fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase",
                          color: w <= progress.current_week ? "rgba(10,10,5,0.38)" : "rgba(10,10,5,0.18)",
                        }}>
                          W{w}
                        </span>
                        {isCurrent && (
                          <span style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: "rgba(10,10,5,0.45)", display: "inline-block",
                            boxShadow: "0 0 0 2px rgba(10,10,5,0.1)",
                          }} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ height: 2, borderRadius: 100, background: "rgba(10,10,5,0.06)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 100, width: `${checkinPct}%`,
                  background: "linear-gradient(90deg,rgba(10,10,5,0.2),rgba(10,10,5,0.5))",
                  transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
              <div style={{ textAlign: "right", marginTop: 6 }}>
                <span className="mono" style={{ fontSize: 9, color: "rgba(10,10,5,0.28)", letterSpacing: "0.12em" }}>
                  {Math.round(checkinPct)}% complete
                </span>
              </div>
            </div>
          )}

          {/* Weekly Domain */}
          {domainMeta && session.user?.role === "PARTICIPANT" && (
            <div className="s3" style={{
              borderRadius: 20, padding: "22px 24px", marginBottom: 14,
              position: "relative", overflow: "hidden",
              border: `1.5px solid ${domainMeta.border}`,
              background: domainMeta.bg,
              boxShadow: `0 4px 24px ${domainMeta.glow}, 0 1px 0 rgba(255,255,255,0.7) inset`,
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 140, height: 140, borderRadius: "50%", pointerEvents: "none",
                background: `radial-gradient(circle, rgba(${domainMeta.accentRgb},0.12) 0%, transparent 70%)`,
              }} />
              <div style={{
                position: "absolute", bottom: -20, left: -20,
                width: 100, height: 100, borderRadius: "50%", pointerEvents: "none",
                background: `radial-gradient(circle, rgba(${domainMeta.accentRgb},0.07) 0%, transparent 70%)`,
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, position: "relative" }}>
                <div style={{ flex: 1 }}>
                  <span className="mono" style={{
                    fontSize: 9, letterSpacing: "0.26em", color: "rgba(10,10,5,0.3)",
                    textTransform: "uppercase", display: "block", marginBottom: 12,
                  }}>
                    This Week's Focus
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{domainMeta.emoji}</span>
                    <div>
                      <p className="serif" style={{
                        fontSize: 17, fontWeight: 400, lineHeight: 1.25,
                        letterSpacing: "-0.015em", color: "rgba(10,10,5,0.76)", margin: 0,
                      }}>
                        {domainMeta.label}
                      </p>
                      <p className="sans" style={{
                        fontSize: 12, color: "rgba(10,10,5,0.4)", marginTop: 3, marginBottom: 0,
                      }}>
                        {domainMeta.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {progress && (
                  <div style={{
                    flexShrink: 0, width: 48, height: 52, borderRadius: 14,
                    background: "rgba(255,255,255,0.65)",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 8px rgba(10,10,5,0.08)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                  }}>
                    <span className="serif" style={{
                      fontSize: 22, fontWeight: 300, color: "rgba(10,10,5,0.6)", lineHeight: 1,
                    }}>
                      {progress.current_week}
                    </span>
                    <span className="mono" style={{
                      fontSize: 7, letterSpacing: "0.18em", color: "rgba(10,10,5,0.3)", textTransform: "uppercase",
                    }}>
                      week
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Daily Check-in */}
          <div className="s4" style={{ marginBottom: 14 }}>
            {checkedInToday ? (
              <div className="card" style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="check-icon" style={{
                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                    background: "linear-gradient(135deg,#edf4ef,#deeee2)",
                    border: "1.5px solid rgba(74,107,90,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(74,107,90,0.1)",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9.5l3.5 3.5 6.5-7" stroke="rgba(50,100,70,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="serif" style={{
                      fontSize: 16, fontWeight: 400, margin: 0,
                      letterSpacing: "-0.01em", color: "rgba(10,10,5,0.7)",
                    }}>
                      Check-in complete
                    </p>
                    <p className="sans" style={{
                      fontSize: 12, color: "rgba(10,10,5,0.35)", marginTop: 3, marginBottom: 0,
                    }}>
                      You've checked in today. See you tomorrow 👋
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-elevated" style={{ padding: "24px 26px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                  <div>
                    <span className="mono" style={{
                      fontSize: 9, letterSpacing: "0.26em", color: "rgba(10,10,5,0.28)",
                      textTransform: "uppercase", display: "block", marginBottom: 8,
                    }}>
                      Daily Check-in
                    </span>
                    <p className="serif" style={{
                      fontSize: 18, fontWeight: 400, margin: "0 0 5px",
                      letterSpacing: "-0.015em", color: "rgba(10,10,5,0.75)", lineHeight: 1.2,
                    }}>
                      How are you feeling today?
                    </p>
                    <p className="sans" style={{ fontSize: 12, color: "rgba(10,10,5,0.35)", margin: 0 }}>
                      Takes about 5 minutes
                    </p>
                  </div>
                  <Link href="/check-in" className="btn-primary">
                    Start
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Card */}
          {session.user?.role === "ADMIN" && (
            <div className="card s5" style={{ padding: "20px 24px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: "rgba(10,10,5,0.05)", border: "1.5px solid rgba(10,10,5,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="rgba(10,10,5,0.4)" strokeWidth="1.4"/>
                      <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="rgba(10,10,5,0.4)" strokeWidth="1.4"/>
                      <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="rgba(10,10,5,0.4)" strokeWidth="1.4"/>
                      <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="rgba(10,10,5,0.25)" strokeWidth="1.4" strokeDasharray="2 1.5"/>
                    </svg>
                  </div>
                  <div>
                    <span className="mono" style={{
                      fontSize: 9, letterSpacing: "0.24em", color: "rgba(10,10,5,0.28)",
                      textTransform: "uppercase", display: "block", marginBottom: 4,
                    }}>
                      Admin Portal
                    </span>
                    <p className="serif" style={{
                      fontSize: 15, fontWeight: 400, margin: 0,
                      letterSpacing: "-0.01em", color: "rgba(10,10,5,0.65)",
                    }}>
                      Manage users &amp; study keys
                    </p>
                  </div>
                </div>
                <Link href="/admin" className="btn-ghost" style={{ flexShrink: 0 }}>
                  Open
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <div className="divider" style={{ marginBottom: 20 }} />
            <p className="mono" style={{
              fontSize: 10, color: "rgba(10,10,5,0.2)", letterSpacing: "0.14em", margin: 0,
            }}>
              AIDES-T2D · University of Massachusetts Boston
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
