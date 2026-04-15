"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu, SquarePen, Trash2, ArrowUp,
  Loader2, Wind, BookOpen, Copy, Check,
  Activity, ChevronDown
} from "lucide-react"
import { useCheckInStore } from "@/store/checkin-store"
import {
  getConversations, saveConversations,
  type StoredConversation, type StoredMessage,
  type StampleyResponseData
} from "@/store/conversation-storage"
import { StampleySidebar } from "@/components/stampley/stampley-sidebar"

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

function ensureUniqueTitle(base: string, existing: string[]): string {
  const set = new Set(existing.map(t => t.toLowerCase()))
  if (!set.has(base.toLowerCase())) return base
  let n = 2
  while (set.has(`${base} (${n})`.toLowerCase())) n++
  return `${base} (${n})`
}

export default function StampleySupportPage() {
  const router = useRouter()
  const store = useCheckInStore()

  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState<StoredMessage[]>([])
  const [conversations, setConversations] = useState<StoredConversation[]>([])
  const [currentConvId, setCurrentConvId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<"chat" | "results">("chat")
  const [submitted, setSubmitted] = useState(false)
  const [needsSafety, setNeedsSafety] = useState(false)
  const [subscale, setSubscale] = useState("")
  const [dayNumber, setDayNumber] = useState(1)
  const [weekNumber, setWeekNumber] = useState(1)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasFetchedInitial = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading, expandedCard])

  useEffect(() => {
    const saved = getConversations()
    setConversations(saved)
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    const updatedAt = new Date().toISOString()
    if (currentConvId === null) {
      const firstUser = messages.find(m => m.role === "user")
      const baseTitle = firstUser?.content?.slice(0, 40) ?? "Stampley session"
      const newId = Date.now().toString()
      setConversations(prev => {
        const title = ensureUniqueTitle(baseTitle, prev.map(c => c.title))
        const newConv: StoredConversation = {
          id: newId, title, updatedAt, messages: [...messages]
        }
        const next = [...prev, newConv]
        saveConversations(next)
        return next
      })
      setCurrentConvId(newId)
    } else {
      setConversations(prev => {
        const next = prev.map(c =>
          c.id === currentConvId
            ? { ...c, messages: [...messages], updatedAt }
            : c
        )
        saveConversations(next)
        return next
      })
    }
  }, [messages])

  async function handleSubmitCheckin() {
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/check-in/submit", {
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
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setNeedsSafety(data.needsSafetyEscalation)
      setSubscale(data.subscale ?? "")
      setDayNumber(data.dayNumber ?? 1)
      setWeekNumber(data.weekNumber ?? 1)
      setSubmitted(true)
      setSubmitting(false)
      await fetchInitialGreeting(data.subscale, data.dayNumber, data.weekNumber)
    } catch {
      setError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  async function fetchInitialGreeting(sub: string, day: number, week: number) {
    if (hasFetchedInitial.current) return
    hasFetchedInitial.current = true
    setIsLoading(true)
    await generateStampleyResponse([], sub, day, week)
  }

  async function generateStampleyResponse(
    history: { role: string; content: string }[],
    sub?: string,
    day?: number,
    week?: number
  ) {
    try {
      const res = await fetch("/api/stampley/generate", {
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
          subscale: sub ?? subscale,
          dayNumber: day ?? dayNumber,
          weekNumber: week ?? weekNumber,
          messageHistory: history,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      const msgId = Date.now().toString()
      setMessages(prev => [...prev, {
        id: msgId,
        role: "assistant",
        data: data.response,
        timestamp: getCurrentTime(),
      }])
      setExpandedCard(`${msgId}-skill`)
    } catch {
      const msgId = Date.now().toString()
      setMessages(prev => [...prev, {
        id: msgId,
        role: "assistant",
        data: {
          validation: "I'm having a little trouble connecting right now.",
          reflection_question: "Would you like to try again?",
          micro_skill: "Take one slow breath — in for 4, hold 4, out for 4.",
          education_chip: "Connectivity issues can happen. Your data is safe.",
        },
        timestamp: getCurrentTime(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSend() {
    if (!inputText.trim() || isLoading) return
    const text = inputText.trim()
    setInputText("")
    const userMsg: StoredMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: getCurrentTime(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setExpandedCard(null)

    const history = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.role === "user"
        ? (m.content ?? "")
        : `Validation: "${m.data?.validation}". Question: "${m.data?.reflection_question}". Skill: "${m.data?.micro_skill}".`,
    }))

    await generateStampleyResponse(history)
  }

  function handleNewChat() {
    setMessages([])
    setCurrentConvId(null)
    setExpandedCard(null)
    setInputText("")
    setSubmitted(false)
    setNeedsSafety(false)
    hasFetchedInitial.current = false
    setActiveView("chat")
    store.reset()
  }

  function handleSelectConversation(id: string) {
    const conv = conversations.find(c => c.id === id)
    if (!conv) return
    setMessages(conv.messages)
    setCurrentConvId(conv.id)
    setExpandedCard(null)
    setActiveView("chat")
    setSubmitted(true)
  }

  function handleCopy(msg: StoredMessage) {
    if (!msg.data) return
    navigator.clipboard.writeText(
      `${msg.data.validation}\n\n${msg.data.reflection_question}`
    )
    setCopiedId(msg.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!submitted) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');`}</style>
        <div
          className="space-y-6"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-5 bg-black/20" />
              <span
                className="text-[9px] uppercase tracking-[0.28em]"
                style={{ color: "rgba(10,10,5,0.3)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                Step 5 of 5
              </span>
            </div>
            <h2
              className="text-[26px] font-light leading-tight tracking-[-0.02em]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", color: "rgba(10,10,5,0.72)" }}
            >
              Review &{" "}
              <em className="italic font-light" style={{ color: "rgba(10,10,5,0.28)" }}>
                submit
              </em>
            </h2>
            <p
              className="text-[13px] font-light mt-1.5 leading-relaxed"
              style={{ color: "rgba(10,10,5,0.4)" }}
            >
              Submit your check-in and begin your session with Stampley.
            </p>
          </div>

          <div
            className="rounded-[20px] overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
              border: "1.5px solid rgba(10,10,5,0.07)",
              boxShadow: "0 2px 12px rgba(10,10,5,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {[
              { label: "Distress", value: `${store.distress}/10`, accent: store.distress >= 7 ? "rgba(122,90,90,0.7)" : store.distress >= 4 ? "rgba(124,106,82,0.7)" : "rgba(90,107,90,0.7)" },
              { label: "Mood", value: `${store.mood}/10`, accent: "rgba(10,10,5,0.55)" },
              { label: "Energy", value: `${store.energy}/10`, accent: "rgba(10,10,5,0.55)" },
              { label: "Context Tags", value: store.contextTags.length > 0 ? `${store.contextTags.length} selected` : "None", accent: "rgba(10,10,5,0.55)" },
              { label: "Domain", value: store.domain ?? "—", accent: "rgba(10,10,5,0.55)" },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                className="px-6 py-3.5 flex justify-between items-center"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(10,10,5,0.05)" : "none",
                }}
              >
                <p
                  className="text-[12.5px]"
                  style={{ color: "rgba(10,10,5,0.4)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {item.label}
                </p>
                <p
                  className="text-[13px] font-medium"
                  style={{ color: item.accent }}
                >
                  {item.value}
                </p>
              </div>
            ))}
            {store.reflection && (
              <div
                className="px-6 py-4"
                style={{ borderTop: "1px solid rgba(10,10,5,0.05)" }}
              >
                <p
                  className="text-[11px] uppercase tracking-[0.16em] mb-1.5"
                  style={{ color: "rgba(10,10,5,0.3)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Reflection
                </p>
                <p
                  className="text-[13px] font-light leading-relaxed line-clamp-2"
                  style={{ color: "rgba(10,10,5,0.55)" }}
                >
                  {store.reflection}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div
              className="p-3 rounded-[14px] text-[13px]"
              style={{
                background: "rgba(122,90,90,0.07)",
                border: "1px solid rgba(122,90,90,0.15)",
                color: "rgba(122,90,90,0.8)",
              }}
            >
              {error}
            </div>
          )}

          {submitting && (
            <div
              className="rounded-[20px] p-6 text-center space-y-3"
              style={{
                background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                border: "1.5px solid rgba(10,10,5,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center mx-auto text-xl animate-pulse"
                style={{ background: "rgba(10,10,5,0.05)", border: "1px solid rgba(10,10,5,0.08)" }}
              >
                💙
              </div>
              <p
                className="text-[13px]"
                style={{ color: "rgba(10,10,5,0.45)", fontFamily: "'Outfit', system-ui, sans-serif" }}
              >
                {submitting ? "Saving your check-in…" : "Stampley is preparing…"}
              </p>
            </div>
          )}

          {!submitting && (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/check-in/weekly-domain")}
                className="flex-1 rounded-[16px] py-[14px] text-[13px] font-medium transition-all duration-200"
                style={{
                  border: "1.5px solid rgba(10,10,5,0.09)",
                  color: "rgba(10,10,5,0.38)",
                  background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmitCheckin}
                className="flex-1 rounded-[16px] py-[14px] text-[13px] font-semibold uppercase tracking-[0.07em] text-white transition-all duration-300 hover:-translate-y-px relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #1a1a18 0%, #0a0a0f 100%)",
                  boxShadow: "0 6px 20px rgba(10,10,5,0.2)",
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                Submit & Chat with Stampley 💙
              </button>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');`}</style>

      <div
        className="fixed inset-0 top-0 flex overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #fefdfb 0%, #f5f2ec 100%)",
          fontFamily: "'Outfit', system-ui, sans-serif",
          zIndex: 50,
        }}
      >
        <StampleySidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          conversations={conversations}
          currentConversationId={currentConvId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          setActiveView={(v) => setActiveView(v as "chat" | "results")}
          currentDomain={store.domain}
        />

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header
            className="shrink-0 h-14 flex items-center justify-between px-4"
            style={{
              background: "rgba(254,253,251,0.88)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(10,10,5,0.06)",
            }}
          >
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200"
              style={{
                border: "1px solid rgba(10,10,5,0.07)",
                color: "rgba(10,10,5,0.38)",
              }}
            >
              <Menu size={15} strokeWidth={1.5} />
            </button>

            <div
              className="flex items-center gap-0.5 rounded-full p-1"
              style={{
                background: "rgba(10,10,5,0.04)",
                border: "1px solid rgba(10,10,5,0.06)",
              }}
            >
              {(["chat", "results"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className="px-4 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 uppercase tracking-[0.08em]"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background: activeView === view
                      ? "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)"
                      : "transparent",
                    color: activeView === view
                      ? "rgba(10,10,5,0.7)"
                      : "rgba(10,10,5,0.35)",
                    boxShadow: activeView === view
                      ? "0 1px 4px rgba(10,10,5,0.08)"
                      : "none",
                  }}
                >
                  {view === "chat" ? "Chat" : "Results"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleNewChat}
                className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200"
                style={{ color: "rgba(10,10,5,0.35)" }}
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNewChat}
                className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200"
                style={{ color: "rgba(10,10,5,0.35)" }}
              >
                <SquarePen size={14} strokeWidth={1.5} />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeView === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div
                  className="flex-1 overflow-y-auto"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(10,10,5,0.1) transparent" }}
                >
                  <div className="max-w-3xl mx-auto px-4 md:px-6 pt-6 pb-4 flex flex-col gap-6">
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-[14px]"
                      style={{
                        background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                        border: "1px solid rgba(10,10,5,0.07)",
                        boxShadow: "0 1px 4px rgba(10,10,5,0.04)",
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-[9px] shrink-0"
                        style={{
                          background: "rgba(10,10,5,0.05)",
                          border: "1px solid rgba(10,10,5,0.08)",
                        }}
                      >
                        <Activity size={14} strokeWidth={1.5} style={{ color: "rgba(10,10,5,0.45)" }} />
                      </div>
                      <div>
                        <p
                          className="text-[8px] uppercase tracking-[0.2em] mb-0.5"
                          style={{ color: "rgba(10,10,5,0.28)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          Today's metrics
                        </p>
                        <p
                          className="text-[12px] font-light"
                          style={{ color: "rgba(10,10,5,0.55)" }}
                        >
                          Distress {store.distress} · Mood {store.mood} · Energy {store.energy}
                          <span
                            className="ml-2 text-[10px]"
                            style={{ color: "rgba(10,10,5,0.25)" }}
                          >
                            used by Stampley
                          </span>
                        </p>
                      </div>
                    </div>

                    {needsSafety && (
                      <div
                        className="rounded-[18px] p-5"
                        style={{
                          background: "rgba(122,90,90,0.05)",
                          border: "1px solid rgba(122,90,90,0.15)",
                        }}
                      >
                        <p
                          className="text-[13px] font-medium mb-1"
                          style={{ color: "rgba(122,90,90,0.8)", fontFamily: "'Fraunces', Georgia, serif" }}
                        >
                          Support is available
                        </p>
                        <p
                          className="text-[12px] font-light leading-relaxed mb-3"
                          style={{ color: "rgba(10,10,5,0.45)" }}
                        >
                          Your distress has been high. You don't have to carry this alone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href="mailto:pcrg@umb.edu"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] text-[11.5px] font-medium transition-all"
                            style={{
                              background: "rgba(122,90,90,0.07)",
                              border: "1px solid rgba(122,90,90,0.2)",
                              color: "rgba(122,90,90,0.75)",
                            }}
                          >
                            📧 pcrg@umb.edu
                          </a>
                          <a
                            href="tel:6172874067"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] text-[11.5px] font-medium transition-all"
                            style={{
                              background: "rgba(122,90,90,0.07)",
                              border: "1px solid rgba(122,90,90,0.2)",
                              color: "rgba(122,90,90,0.75)",
                            }}
                          >
                            📞 (617) 287-4067
                          </a>
                        </div>
                      </div>
                    )}

                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "user" ? (
                          <div className="flex flex-col items-end gap-1 max-w-[78%]">
                            <div
                              className="px-5 py-3 rounded-[18px] rounded-tr-[5px] text-[13.5px] font-light leading-relaxed"
                              style={{
                                background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                                border: "1px solid rgba(10,10,5,0.08)",
                                color: "rgba(10,10,5,0.78)",
                                boxShadow: "0 1px 4px rgba(10,10,5,0.06)",
                              }}
                            >
                              {msg.content}
                            </div>
                            <span
                              className="text-[9px] px-2"
                              style={{ color: "rgba(10,10,5,0.22)", fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {msg.timestamp}
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-3 w-full max-w-[100%]">
                            <div
                              className="shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center mt-1 text-base"
                              style={{
                                background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                                border: "1px solid rgba(10,10,5,0.08)",
                                boxShadow: "0 1px 3px rgba(10,10,5,0.06)",
                              }}
                            >
                              💙
                            </div>

                            <div className="flex flex-col gap-2 w-full min-w-0">
                              <div className="flex items-center gap-2 pt-1 mb-0.5">
                                <span
                                  className="text-[11px] uppercase tracking-[0.14em]"
                                  style={{ color: "rgba(10,10,5,0.45)", fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                  Stampley
                                </span>
                                <span
                                  className="text-[9px]"
                                  style={{ color: "rgba(10,10,5,0.22)", fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                  {msg.timestamp}
                                </span>
                              </div>

                              {msg.data && (
                                <div
                                  className="text-[14.5px] font-light leading-[1.72] space-y-3"
                                  style={{ color: "rgba(10,10,5,0.78)", fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                  {msg.data.greeting && (
                                    <p style={{ color: "rgba(10,10,5,0.78)" }}>{msg.data.greeting}</p>
                                  )}
                                  <p style={{ color: "rgba(10,10,5,0.65)" }}>{msg.data.validation}</p>
                                  <p style={{ color: "rgba(10,10,5,0.78)", fontWeight: 400 }}>
                                    {msg.data.reflection_question}
                                  </p>
                                  {msg.data.closure && (
                                    <p style={{ color: "rgba(10,10,5,0.5)", fontStyle: "italic" }}>
                                      {msg.data.closure}
                                    </p>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-1.5 mt-1">
                                <button
                                  onClick={() => setExpandedCard(
                                    expandedCard === `${msg.id}-skill` ? null : `${msg.id}-skill`
                                  )}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-all duration-200"
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    background: expandedCard === `${msg.id}-skill`
                                      ? "rgba(10,10,5,0.07)"
                                      : "transparent",
                                    border: expandedCard === `${msg.id}-skill`
                                      ? "1px solid rgba(10,10,5,0.1)"
                                      : "1px solid rgba(10,10,5,0.08)",
                                    color: expandedCard === `${msg.id}-skill`
                                      ? "rgba(10,10,5,0.6)"
                                      : "rgba(10,10,5,0.35)",
                                  }}
                                >
                                  <Wind size={11} strokeWidth={2} />
                                  <span className="uppercase tracking-[0.1em]">Skill</span>
                                </button>

                                <button
                                  onClick={() => setExpandedCard(
                                    expandedCard === `${msg.id}-edu` ? null : `${msg.id}-edu`
                                  )}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition-all duration-200"
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    background: expandedCard === `${msg.id}-edu`
                                      ? "rgba(10,10,5,0.07)"
                                      : "transparent",
                                    border: expandedCard === `${msg.id}-edu`
                                      ? "1px solid rgba(10,10,5,0.1)"
                                      : "1px solid rgba(10,10,5,0.08)",
                                    color: expandedCard === `${msg.id}-edu`
                                      ? "rgba(10,10,5,0.6)"
                                      : "rgba(10,10,5,0.35)",
                                  }}
                                >
                                  <BookOpen size={11} strokeWidth={2} />
                                  <span className="uppercase tracking-[0.1em]">Insight</span>
                                </button>

                                <div className="flex-1" />

                                <button
                                  onClick={() => handleCopy(msg)}
                                  className="p-1.5 rounded-full transition-all"
                                  style={{ color: "rgba(10,10,5,0.28)" }}
                                >
                                  {copiedId === msg.id
                                    ? <Check size={12} strokeWidth={2} style={{ color: "rgba(90,107,90,0.7)" }} />
                                    : <Copy size={12} strokeWidth={1.5} />
                                  }
                                </button>
                              </div>

                              <AnimatePresence mode="wait">
                                {expandedCard === `${msg.id}-skill` && (
                                  <motion.div
                                    key="skill"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div
                                      className="rounded-[14px] p-4 mt-1"
                                      style={{
                                        background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                                        border: "1px solid rgba(10,10,5,0.07)",
                                        boxShadow: "0 1px 4px rgba(10,10,5,0.04)",
                                      }}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <Wind size={13} strokeWidth={1.8} style={{ color: "rgba(10,10,5,0.4)" }} />
                                        <span
                                          className="text-[11px] uppercase tracking-[0.14em] font-semibold"
                                          style={{ color: "rgba(10,10,5,0.45)", fontFamily: "'JetBrains Mono', monospace" }}
                                        >
                                          Micro-skill
                                        </span>
                                      </div>
                                      <p
                                        className="text-[13.5px] font-light leading-relaxed"
                                        style={{ color: "rgba(10,10,5,0.6)" }}
                                      >
                                        {msg.data?.micro_skill}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                {expandedCard === `${msg.id}-edu` && (
                                  <motion.div
                                    key="edu"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div
                                      className="rounded-[14px] p-4 mt-1"
                                      style={{
                                        background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                                        border: "1px solid rgba(10,10,5,0.07)",
                                        boxShadow: "0 1px 4px rgba(10,10,5,0.04)",
                                      }}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <BookOpen size={13} strokeWidth={1.8} style={{ color: "rgba(10,10,5,0.4)" }} />
                                        <span
                                          className="text-[11px] uppercase tracking-[0.14em] font-semibold"
                                          style={{ color: "rgba(10,10,5,0.45)", fontFamily: "'JetBrains Mono', monospace" }}
                                        >
                                          Insight
                                        </span>
                                      </div>
                                      <p
                                        className="text-[13.5px] font-light leading-relaxed"
                                        style={{ color: "rgba(10,10,5,0.6)" }}
                                      >
                                        {msg.data?.education_chip}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-8 h-8 rounded-[9px] flex items-center justify-center text-base"
                          style={{
                            background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                            border: "1px solid rgba(10,10,5,0.08)",
                            opacity: 0.5,
                          }}
                        >
                          💙
                        </div>
                        <div
                          className="flex items-center gap-2 text-[13.5px] font-light"
                          style={{ color: "rgba(10,10,5,0.38)" }}
                        >
                          <Loader2 size={13} className="animate-spin" />
                          <span>Stampley is thinking…</span>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4 shrink-0" />
                  </div>
                </div>

                <div
                  className="shrink-0 px-4 pb-4 pt-3 md:px-6"
                  style={{ background: "rgba(245,242,236,0.9)", backdropFilter: "blur(8px)" }}
                >
                  <div
                    className="flex items-center gap-2 max-w-3xl mx-auto rounded-[20px] transition-all duration-300"
                    style={{
                      background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                      border: "1.5px solid rgba(10,10,5,0.08)",
                      boxShadow: "0 2px 12px rgba(10,10,5,0.06)",
                    }}
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Reply to Stampley…"
                      disabled={isLoading}
                      className="flex-1 h-[50px] pl-5 bg-transparent outline-none text-[13.5px] font-light disabled:opacity-40"
                      style={{
                        color: "rgba(10,10,5,0.75)",
                        fontFamily: "'Outfit', system-ui, sans-serif",
                      }}
                    />
                    <div className="pr-2">
                      <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || isLoading}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{
                          background: inputText.trim() && !isLoading
                            ? "linear-gradient(135deg, #1a1a18, #0a0a0f)"
                            : "rgba(10,10,5,0.05)",
                          color: inputText.trim() && !isLoading
                            ? "rgba(255,252,245,0.9)"
                            : "rgba(10,10,5,0.2)",
                          boxShadow: inputText.trim() && !isLoading
                            ? "0 2px 8px rgba(10,10,5,0.2)"
                            : "none",
                        }}
                      >
                        {isLoading
                          ? <Loader2 size={14} className="animate-spin" />
                          : <ArrowUp size={15} strokeWidth={2} />
                        }
                      </button>
                    </div>
                  </div>

                  <p
                    className="text-center text-[8.5px] uppercase tracking-[0.16em] mt-2.5 hidden md:block select-none"
                    style={{ color: "rgba(10,10,5,0.2)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Stampley may make mistakes · not a substitute for professional care
                  </p>
                </div>
              </motion.div>
            )}

            {activeView === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto"
              >
                <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
                  <h2
                    className="text-[22px] font-light tracking-[-0.02em]"
                    style={{ fontFamily: "'Fraunces', Georgia, serif", color: "rgba(10,10,5,0.65)" }}
                  >
                    Today's results
                  </h2>
                  {[
                    { label: "Distress", value: `${store.distress} / 10` },
                    { label: "Mood", value: `${store.mood} / 10` },
                    { label: "Energy", value: `${store.energy} / 10` },
                    { label: "Domain", value: store.domain ?? "—" },
                    { label: "Reflection", value: store.reflection || "—" },
                    { label: "Coping Action", value: store.copingAction || "—" },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="rounded-[16px] px-5 py-4"
                      style={{
                        background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                        border: "1px solid rgba(10,10,5,0.07)",
                      }}
                    >
                      <p
                        className="text-[9px] uppercase tracking-[0.2em] mb-1"
                        style={{ color: "rgba(10,10,5,0.3)", fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-[14px] font-light"
                        style={{ color: "rgba(10,10,5,0.65)" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full rounded-[16px] py-4 text-[13px] font-semibold uppercase tracking-[0.07em] text-white mt-2 transition-all hover:-translate-y-px"
                    style={{
                      background: "linear-gradient(135deg, #1a1a18, #0a0a0f)",
                      boxShadow: "0 6px 20px rgba(10,10,5,0.2)",
                      fontFamily: "'Outfit', system-ui, sans-serif",
                    }}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  )
}