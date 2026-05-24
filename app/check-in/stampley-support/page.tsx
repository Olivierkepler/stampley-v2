"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Phone,
  Wind,
  BookOpen,
  Loader2,
  Mail,
  Copy,
  Check,
  Activity,
  ShieldCheck,
  ArrowUp,
  Menu,
  SquarePen,
  Trash2,
} from "lucide-react"
import { useCheckInStore } from "@/store/checkin-store"
import { useCheckInSubmit } from "@/components/check-in/CheckInSubmitContext"
import {
  getConversations,
  saveConversations,
  type StoredConversation,
  type StoredMessage,
  type StampleyResponseData,
} from "@/store/conversation-storage"
import { StampleySidebar } from "@/components/stampley/stampley-sidebar"
import {
  deriveConversationPhase,
  formatAssistantMessageForHistory,
  type StampleyHistoryMessage,
} from "@/lib/stampley-prompt"
import {
  backupFromSessionPayload,
  backupUnsavedTranscript,
  clearUnsavedTranscript,
  resendUnsavedTranscriptIfPresent,
  saveStampleySessionWithRetry,
} from "@/lib/stampley-transcript-backup"
import {
  clearActiveChatDraft,
  fetchCheckedInToday,
  readActiveChatDraft,
  writeActiveChatDraft,
  type ActiveChatSnapshot,
} from "@/lib/stampley-active-chat-draft"

type SavedMetrics = {
  distress: number
  mood: number
  energy: number
  domain: string | null
  contextTags: string[]
  reflection: string
  copingAction: string
  weekNumber: number
  dayNumber: number
  subscale: string
}

const DUPLICATE_CHECK_IN_MESSAGE =
  "You have already completed today's check-in."

const materialSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
}

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

function ensureUniqueTitle(base: string, existing: string[]): string {
  const set = new Set(existing.map((t) => t.toLowerCase()))
  if (!set.has(base.toLowerCase())) return base
  let n = 2
  while (set.has(`${base} (${n})`.toLowerCase())) n++
  return `${base} (${n})`
}

function buildChatSessionSummary(
  snapshot: SavedMetrics,
  userCount: number,
  assistantCount: number
): string {
  const parts = [
    `Stress ${snapshot.distress}/10, mood ${snapshot.mood}/10, energy ${snapshot.energy}/10.`,
    snapshot.domain ? `Focus domain: ${snapshot.domain}.` : null,
    snapshot.reflection?.trim()
      ? `Reflection: ${snapshot.reflection.trim()}`
      : null,
    snapshot.copingAction?.trim()
      ? `Coping action: ${snapshot.copingAction.trim()}`
      : null,
    `Stampley chat: ${userCount} participant reply${userCount === 1 ? "" : "ies"}, ${assistantCount} Stampley turn${assistantCount === 1 ? "" : "s"}.`,
  ].filter(Boolean)
  return parts.join(" ")
}

function buildStampleyHistory(
  msgs: StoredMessage[]
): StampleyHistoryMessage[] {
  return msgs
    .map((m) => {
      if (m.role === "user") {
        const content = m.content?.trim()
        if (!content) return null
        return { role: "user" as const, content }
      }
      const content = formatAssistantMessageForHistory(m.data)
      if (!content) return null
      return { role: "assistant" as const, content }
    })
    .filter((m): m is StampleyHistoryMessage => m !== null)
}

function getRequiredDailyReplies(isHighStress: boolean) {
  return isHighStress ? 1 : 3
}

function hasCompletedDailyReflection({
  userMessageCount,
  isHighStress,
}: {
  userMessageCount: number
  isHighStress: boolean
}) {
  return userMessageCount >= getRequiredDailyReplies(isHighStress)
}

export default function StampleySupportPage() {
  const router = useRouter()
  const store = useCheckInStore()
  const { register } = useCheckInSubmit()
  const submitInFlightRef = useRef(false)
  const startChatInFlightRef = useRef(false)
  const skipDraftPersistRef = useRef(true)
  const restoreDraftRanRef = useRef(false)

  const [loading, setLoading] = useState(false)
  const [completingCheckIn, setCompletingCheckIn] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const [error, setError] = useState("")
  const [chatSnapshot, setChatSnapshot] = useState<SavedMetrics | null>(null)

  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState<StoredMessage[]>([])
  const [conversations, setConversations] = useState<StoredConversation[]>([])
  const [currentConvId, setCurrentConvId] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<"chat" | "results">("chat")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [needsSafety, setNeedsSafety] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [isAlertDismissed, setIsAlertDismissed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isBusy = completingCheckIn || loading
  const chatReady = chatStarted

  const metrics = chatSnapshot ?? {
    distress: store.distress,
    mood: store.mood,
    energy: store.energy,
    domain: store.domain,
    contextTags: store.contextTags,
    reflection: store.reflection,
    copingAction: store.copingAction,
    weekNumber: 1,
    dayNumber: 1,
    subscale: "",
  }

  const inChatSafety =
    (chatSnapshot?.distress ?? metrics.distress) >= 9

  const weekNumber = chatSnapshot?.weekNumber ?? 1
  const dayNumber = chatSnapshot?.dayNumber ?? 1
  const subscale = chatSnapshot?.subscale ?? ""

  const userMessageCount = messages.filter((m) => m.role === "user").length
  const conversationPhase =
    userMessageCount === 0
      ? ("opening" as const)
      : userMessageCount === 1
        ? ("exploration" as const)
        : userMessageCount === 2
          ? ("coping" as const)
          : ("closure" as const)

  const requiredDailyReplies = getRequiredDailyReplies(inChatSafety)

  const dailyReflectionComplete = hasCompletedDailyReflection({
    userMessageCount,
    isHighStress: inChatSafety,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading, expandedCard, showSupport, isAlertDismissed])

  useEffect(() => {
    setConversations(getConversations())
  }, [])

  useEffect(() => {
    void resendUnsavedTranscriptIfPresent()
  }, [])

  useEffect(() => {
    if (restoreDraftRanRef.current) return
    restoreDraftRanRef.current = true

    void (async () => {
      try {
        const checkedInToday = await fetchCheckedInToday()
        if (checkedInToday === true) {
          clearActiveChatDraft()
          return
        }

        const draft = readActiveChatDraft()
        if (!draft) return

        setChatSnapshot(draft.chatSnapshot as SavedMetrics)
        setChatStarted(true)
        setMessages(draft.messages)
        setCurrentConvId(draft.currentConvId)
        setExpandedCard(draft.expandedCard)
        setActiveView(draft.activeView)
        setError("")
      } finally {
        skipDraftPersistRef.current = false
      }
    })()
  }, [])

  useEffect(() => {
    if (skipDraftPersistRef.current) return
    if (!chatStarted || !chatSnapshot) return
    if (messages.length === 0) return

    writeActiveChatDraft({
      chatStarted: true,
      chatSnapshot: chatSnapshot as ActiveChatSnapshot,
      messages,
      currentConvId,
      expandedCard,
      activeView,
      weekNumber: chatSnapshot.weekNumber,
      dayNumber: chatSnapshot.dayNumber,
      subscale: chatSnapshot.subscale,
      timestamp: new Date().toISOString(),
    })
  }, [
    chatStarted,
    chatSnapshot,
    messages,
    currentConvId,
    expandedCard,
    activeView,
  ])

  useEffect(() => {
    if (messages.length === 0) return
    const updatedAt = new Date().toISOString()
    if (currentConvId === null) {
      const firstUser = messages.find((m) => m.role === "user")
      const baseTitle =
        firstUser?.content?.slice(0, 40) ?? "Stampley session"
      const newId = Date.now().toString()
      setConversations((prev) => {
        const title = ensureUniqueTitle(
          baseTitle,
          prev.map((c) => c.title)
        )
        const newConv: StoredConversation = {
          id: newId,
          title,
          updatedAt,
          messages: [...messages],
        }
        const next = [...prev, newConv]
        saveConversations(next)
        return next
      })
      setCurrentConvId(newId)
    } else {
      setConversations((prev) => {
        const next = prev.map((c) =>
          c.id === currentConvId
            ? { ...c, messages: [...messages], updatedAt }
            : c
        )
        saveConversations(next)
        return next
      })
    }
  }, [messages, currentConvId])

  const generateStampleyResponse = useCallback(
    async (history: StampleyHistoryMessage[], m: SavedMetrics) => {
      const res = await fetch("/api/stampley/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distress: m.distress,
          mood: m.mood,
          energy: m.energy,
          contextTags: m.contextTags,
          reflection: m.reflection,
          copingAction: m.copingAction,
          domain: m.domain,
          subscale: m.subscale,
          dayNumber: m.dayNumber,
          weekNumber: m.weekNumber,
          messageHistory: history,
          conversationPhase: deriveConversationPhase(history),
        }),
      })

      if (!res.ok) throw new Error("Stampley generation failed")

      const data = await res.json()
      if (!data.response) throw new Error("Stampley generation failed")

      return data.response as StampleyResponseData
    },
    []
  )

  const buildSnapshotFromStore = useCallback((): Omit<
    SavedMetrics,
    "weekNumber" | "dayNumber" | "subscale"
  > => {
    return {
      distress: store.distress,
      mood: store.mood,
      energy: store.energy,
      domain: store.domain,
      contextTags: store.contextTags,
      reflection: store.reflection,
      copingAction: store.copingAction,
    }
  }, [store])

  const fetchStudyContext = useCallback(
    async (domain: string | null): Promise<Pick<
      SavedMetrics,
      "weekNumber" | "dayNumber" | "subscale"
    >> => {
      const res = await fetch("/api/check-in/study-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Failed to load study context"
        )
      }
      const data = await res.json()
      return {
        weekNumber: Number(data.weekNumber) || 1,
        dayNumber: Number(data.dayNumber) || 1,
        subscale: typeof data.subscale === "string" ? data.subscale : "",
      }
    },
    []
  )

  const handleStartChat = useCallback(async () => {
    if (
      loading ||
      chatStarted ||
      completingCheckIn ||
      startChatInFlightRef.current
    ) {
      return
    }

    startChatInFlightRef.current = true
    setLoading(true)
    setError("")

    const snapshot = buildSnapshotFromStore()
    if (!snapshot.domain) {
      setError(
        "Please complete Step 4 and select a focus domain before starting Stampley."
      )
      startChatInFlightRef.current = false
      setLoading(false)
      return
    }

    try {
      const studyContext = await fetchStudyContext(snapshot.domain)
      const fullSnapshot: SavedMetrics = {
        ...snapshot,
        ...studyContext,
      }
      setChatSnapshot(fullSnapshot)

      const response = await generateStampleyResponse([], fullSnapshot)

      const msgId = Date.now().toString()
      setMessages([
        {
          id: msgId,
          role: "assistant",
          data: response,
          timestamp: getCurrentTime(),
        },
      ])
      setExpandedCard(`${msgId}-skill`)
      setChatStarted(true)
      setActiveView("chat")
    } catch {
      setError("Something went wrong starting Stampley. Please try again.")
      setChatSnapshot(null)
    } finally {
      setLoading(false)
      startChatInFlightRef.current = false
    }
  }, [
    loading,
    chatStarted,
    completingCheckIn,
    buildSnapshotFromStore,
    fetchStudyContext,
    generateStampleyResponse,
  ])

  const handleCompleteCheckIn = useCallback(async () => {
    if (
      completingCheckIn ||
      loading ||
      !chatStarted ||
      !chatSnapshot ||
      submitInFlightRef.current
    ) {
      return
    }

    if (!dailyReflectionComplete) {
      setError(
        "Please answer Stampley's daily reflection questions before completing today's check-in."
      )
      return
    }

    submitInFlightRef.current = true
    setCompletingCheckIn(true)
    setError("")

    try {
      const submitRes = await fetch("/api/check-in/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distress: chatSnapshot.distress,
          mood: chatSnapshot.mood,
          energy: chatSnapshot.energy,
          contextTags: chatSnapshot.contextTags,
          reflection: chatSnapshot.reflection,
          copingAction: chatSnapshot.copingAction,
          domain: chatSnapshot.domain,
        }),
      })

      if (submitRes.status === 409) {
        setError(DUPLICATE_CHECK_IN_MESSAGE)
        return
      }

      if (!submitRes.ok) throw new Error("Failed to submit check-in")

      const submitData = await submitRes.json()
      const checkInSubmissionId =
        submitData.checkInSubmissionId ?? submitData.id

      if (!checkInSubmissionId) {
        throw new Error("Check-in saved but no submission id returned")
      }

      setNeedsSafety(Boolean(submitData.needsSafetyEscalation))

      const userMessageCount = messages.filter((m) => m.role === "user").length
      const assistantMessageCount = messages.filter(
        (m) => m.role === "assistant"
      ).length

      const summary = buildChatSessionSummary(
        chatSnapshot,
        userMessageCount,
        assistantMessageCount
      )

      const sessionPayload = {
        checkInSubmissionId,
        domain: chatSnapshot.domain,
        stressLevel: chatSnapshot.distress,
        mood: chatSnapshot.mood,
        energy: chatSnapshot.energy,
        userMessageCount,
        assistantMessageCount,
        summary,
        messages,
      }

      const sessionSave = await saveStampleySessionWithRetry(sessionPayload)

      clearActiveChatDraft()

      if (sessionSave.ok) {
        clearUnsavedTranscript()
      } else {
        backupUnsavedTranscript(
          backupFromSessionPayload(sessionPayload, {
            domain: chatSnapshot.domain,
            distress: chatSnapshot.distress,
            mood: chatSnapshot.mood,
            energy: chatSnapshot.energy,
            contextTags: chatSnapshot.contextTags,
            reflection: chatSnapshot.reflection,
            copingAction: chatSnapshot.copingAction,
            weekNumber: chatSnapshot.weekNumber,
            dayNumber: chatSnapshot.dayNumber,
            subscale: chatSnapshot.subscale,
          })
        )
      }

      store.reset()
      router.push("/dashboard")
    } catch {
      setError("Something went wrong saving your check-in. Please try again.")
    } finally {
      setCompletingCheckIn(false)
      submitInFlightRef.current = false
    }
  }, [
    completingCheckIn,
    loading,
    chatStarted,
    chatSnapshot,
    messages,
    store,
    router,
    dailyReflectionComplete,
  ])

  useEffect(() => {
    register(handleStartChat, {
      submitting: completingCheckIn,
      loading,
      checkInSaved: false,
      submitted: chatStarted,
      label: "Start Stampley Chat",
    })
    return () => register(null)
  }, [
    register,
    handleStartChat,
    completingCheckIn,
    loading,
    chatStarted,
  ])

  async function handleSend() {
    if (!inputText.trim() || loading || !chatSnapshot) return

    const text = inputText.trim()
    setInputText("")
    const userMsg: StoredMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: getCurrentTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setExpandedCard(null)

    const history = buildStampleyHistory([...messages, userMsg])

    try {
      const response = await generateStampleyResponse(history, chatSnapshot)
      const msgId = Date.now().toString()
      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          role: "assistant",
          data: response,
          timestamp: getCurrentTime(),
        },
      ])
      setExpandedCard(`${msgId}-skill`)
    } catch {
      const msgId = Date.now().toString()
      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          role: "assistant",
          data: {
            validation: "I'm having a little trouble connecting right now.",
            reflection_question: "Would you like to try again?",
            micro_skill: "Take one slow breath — in for 4, hold 4, out for 4.",
            education_chip: "Connectivity issues can happen. Your data is safe.",
          },
          timestamp: getCurrentTime(),
        },
      ])
      setExpandedCard(`${msgId}-skill`)
    } finally {
      setLoading(false)
    }
  }

  function handleNewChat() {
    if (loading) return
    clearActiveChatDraft()
    setMessages([])
    setCurrentConvId(null)
    setExpandedCard(null)
    setInputText("")
    setActiveView("chat")
  }

  function handleSelectConversation(id: string) {
    const conv = conversations.find((c) => c.id === id)
    if (!conv) return
    setMessages(conv.messages)
    setCurrentConvId(conv.id)
    setExpandedCard(null)
    setActiveView("chat")
  }

  function handleCopy(msg: StoredMessage) {
    if (!msg.data) return
    navigator.clipboard.writeText(
      `${msg.data.greeting ? `${msg.data.greeting}\n\n` : ""}${msg.data.validation}\n\n${msg.data.reflection_question}`
    )
    setCopiedId(msg.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!chatReady) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
        `}</style>

        <motion.div
          className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white text-[#0a0a0f] antialiased"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/[0.06] bg-[#ffffff] px-4 backdrop-blur-md md:h-16 md:px-6">
            <div className="min-w-0">
              <p className="font-['Poppins', sans-serif] text-[8.5px] uppercase tracking-[0.18em] text-black/35">
                Step 5 of 5
              </p>
              <h1 className="truncate font-[Fraunces,Georgia,serif] text-[17px] font-light tracking-[-0.02em] text-[#0a0a0f]/80 md:text-[19px]">
                Stampley Support
              </h1>
            </div>
          </header>

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto">
            <motion.div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
              <section className="flex items-center gap-3 rounded-[14px] border border-black/[0.07] bg-white px-4 py-3 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#3d5a80]/[0.08] text-[#3d5a80]">
                  <Activity size={15} strokeWidth={1.5} />
                </div>
                <motion.div className="min-w-0 flex-1">
                  <p className="mb-0.5 font-['Poppins', sans-serif] text-[8.5px] uppercase tracking-[0.18em] text-black/35">
                    Today&apos;s metrics
                 
                    
                  </p>
                  <p className="text-[12.5px] font-light text-black/65">
                    Distress {metrics.distress} · Mood {metrics.mood} · Energy{" "}
                    {metrics.energy}
                    {metrics.domain ? (
                      <span className="ml-1.5 text-[11px] text-black/30">
                        · {metrics.domain}
                      </span>
                    ) : null}
                  </p>
                </motion.div>
              </section>

              {!isBusy && !chatStarted && (
                <section className="space-y-3">
                  <div className="rounded-[16px] border border-black/[0.07] bg-white p-5 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
                    <div className="mb-4 flex items-center gap-3">
                      <CardIcon />
                      <div>
                        <p className="font-['Poppins', sans-serif] text-[8.5px] uppercase tracking-[0.18em] text-black/35">
                          Ready for Stampley
                        </p>
                        <h2 className="font-[Fraunces,Georgia,serif] text-[22px] font-light tracking-[-0.02em] text-black/80">
                          Your check-in is ready to discuss.
                        </h2>
                      </div>
                    </div>
                    <p className="text-[14px] font-light leading-[1.75] text-black/55">
                      Review your summary below, then use the button in the dock
                      to start chatting with Stampley. Your check-in will be
                      saved when you tap Complete Check-in at the end.
                    </p>
                  </div>

                  <div className="grid gap-2.5">
                    <ReviewRow
                      label="Context tags"
                      value={
                        store.contextTags.length > 0
                          ? `${store.contextTags.length} selected`
                          : "None"
                      }
                    />
                    <ReviewRow label="Domain" value={store.domain ?? "—"} />
                    {store.reflection && (
                      <ReviewBlock label="Reflection" value={store.reflection} />
                    )}
                    {store.copingAction && (
                      <ReviewBlock
                        label="Coping action"
                        value={store.copingAction}
                      />
                    )}
                  </div>
                </section>
              )}

              {isBusy && !chatStarted && <LoadingCard />}

              {error && !chatStarted && (
                <ErrorBanner message={error} />
              )}
            </motion.div>
            </div>
          </main>

        </motion.div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>

<div
  className="flex h-full min-h-0 w-full overflow-hidden bg-white"
  style={{
    fontFamily: "'Outfit', system-ui, sans-serif",
  }}
>
        <StampleySidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          setActiveView={(v) => setActiveView(v as "chat" | "results")}
          currentDomain={metrics.domain}
          distress={metrics.distress}
          mood={metrics.mood}
          energy={metrics.energy}
          chatStarted={chatStarted}
          checkInCompleted={false}
          reflection={metrics.reflection}
          copingAction={metrics.copingAction}
          userMessageCount={userMessageCount}
          conversationPhase={conversationPhase}
          highStress={inChatSafety}
          subscale={subscale}
          dayNumber={dayNumber}
          weekNumber={weekNumber}
        />

        
<main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <header
            className="flex h-16 shrink-0 items-center justify-between px-4"
            style={{
              background: "#ffffff",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(10,10,5,0.06)",
            }}
          >
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200 md:hidden"
              style={{
                border: "1px solid rgba(10,10,5,0.07)",
                color: "rgba(10,10,5,0.38)",
                fontFamily: "'Poppins', sans-serif",
              }}
              aria-label="Toggle sidebar"
            >
              <Menu size={15} strokeWidth={1.5} />
            </button>

            <motion.div className="hidden min-w-0 md:block">
              <p className="font-['Poppins', sans-serif] text-[8px] uppercase tracking-[0.18em] text-black/35">
                Step 5 · Stampley Support
              </p>
              <p className="font-['Poppins', sans-serif] text-[9px] uppercase tracking-[0.12em] text-[#3d5a80]">
                {subscale
                  ? `Week ${weekNumber} · Day ${dayNumber} · ${subscale}`
                  : "Chat in progress · not saved yet"}
              </p>
            </motion.div>

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
                  type="button"
                  onClick={() => setActiveView(view)}
                  className="rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-all duration-200"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background:
                      activeView === view
                        ? "white"
                        : "transparent",
                    color:
                      activeView === view
                        ? "rgba(10,10,5,0.7)"
                        : "rgba(10,10,5,0.35)",
                    boxShadow:
                      activeView === view
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
                type="button"
                onClick={handleNewChat}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200 disabled:opacity-30"
                style={{ color: "rgba(10,10,5,0.35)" }}
                aria-label="Clear chat"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={handleNewChat}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200 disabled:opacity-30"
                style={{ color: "rgba(10,10,5,0.35)" }}
                aria-label="New chat"
              >
                <SquarePen size={14} strokeWidth={1.5} />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                <div
              className="flex-1 min-h-0 overflow-y-auto  bg-[#ffffff]"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(10,10,5,0.1) transparent",
                  }}
                >
                  <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-52 pt-6 md:px-6">
                    <MetricsBar metrics={metrics} />

                    {inChatSafety && (
                      <SafetyCard
                        showSupport={showSupport}
                        setShowSupport={setShowSupport}
                        isAlertDismissed={isAlertDismissed}
                        setIsAlertDismissed={setIsAlertDismissed}
                      />
                    )}

                    {messages.map((msg) => (
                      <ChatMessage
                        key={msg.id}
                        msg={msg}
                        expandedCard={expandedCard}
                        setExpandedCard={setExpandedCard}
                        copiedId={copiedId}
                        onCopy={handleCopy}
                      />
                    ))}

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-black/[0.08] bg-white">
                          <Image
                            src="/images/stampleyLogo.png"
                            alt="Stampley"
                            width={18}
                            height={18}
                            className="object-contain opacity-40 grayscale"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-[13.5px] font-light text-black/40">
                          <Loader2 size={13} className="animate-spin" />
                          <span>Stampley is thinking…</span>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4 shrink-0" />

                    {error && (
                      <ErrorBanner message={error} />
                    )}
                  </div>
                </div>

                <ChatInputDock
                  inputText={inputText}
                  setInputText={setInputText}
                  onSend={handleSend}
                  onComplete={handleCompleteCheckIn}
                  loading={loading}
                  completingCheckIn={completingCheckIn}
                  canComplete={dailyReflectionComplete}
                  metrics={metrics}
                  requiredDailyReplies={requiredDailyReplies}
                  userMessageCount={userMessageCount}
                />
              </motion.div>
            )}

            {activeView === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="flex min-h-0 flex-1 flex-col overflow-y-auto"
              >
                <div className="mx-auto max-w-2xl space-y-4 px-6 py-8 ">
                  <h2
                    className="text-[22px] font-light tracking-[-0.02em]"
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      color: "rgba(10,10,5,0.65)",
                    }}
                  >
                    Today&apos;s results
                  </h2>
                  <p className="text-[13px] font-light text-black/45">
                    Review your entries below. Tap Complete Check-in in the
                    Chat tab to save today&apos;s check-in.
                  </p>
                  {[
                    { label: "Distress", value: `${metrics.distress} / 10` },
                    { label: "Mood", value: `${metrics.mood} / 10` },
                    { label: "Energy", value: `${metrics.energy} / 10` },
                    { label: "Domain", value: metrics.domain ?? "—" },
                    {
                      label: "Context tags",
                      value:
                        metrics.contextTags.length > 0
                          ? `${metrics.contextTags.length} selected`
                          : "None",
                    },
                    { label: "Reflection", value: metrics.reflection || "—" },
                    {
                      label: "Coping action",
                      value: metrics.copingAction || "—",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[16px] px-5 py-4"
                      style={{
                        background:
                          "white",
                        border: "1px solid rgba(10,10,5,0.07)",
                      }}
                    >
                      <p
                        className="mb-1 text-[9px] uppercase tracking-[0.2em]"
                        style={{
                          color: "rgba(10,10,5,0.3)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
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
                    type="button"
                    onClick={() => setActiveView("chat")}
                    className="mt-2 w-full rounded-[16px] py-4 text-[13px] font-semibold uppercase tracking-[0.07em] text-white transition-all hover:-translate-y-px"
                    style={{
                      background: "linear-gradient(135deg, #1a1a18, #0a0a0f)",
                      boxShadow: "0 6px 20px rgba(10,10,5,0.2)",
                      fontFamily: "'Outfit', system-ui, sans-serif",
                    }}
                  >
                    Return to Chat to Complete Check-in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  )
}

function CardIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#3d5a80]/[0.08] text-[#3d5a80]">
      <ShieldCheck size={16} strokeWidth={1.6} />
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[14px] border border-black/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
      <p className="text-[12px] text-black/40">{label}</p>
      <p className="text-right text-[13px] font-medium text-black/70">{value}</p>
    </div>
  )
}

function ReviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-black/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
      <p className="mb-2 text-[12px] text-black/40">{label}</p>
      <p className="line-clamp-4 text-[13px] leading-[1.75] text-black/60">
        {value}
      </p>
    </div>
  )
}

function LoadingCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3.5 rounded-[16px] border border-black/[0.07] bg-white px-5 py-6 shadow-[0_1px_4px_rgba(10,10,15,0.04)]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-black/[0.08] bg-white">
        <Image
          src="/images/stampleyLogo.png"
          alt="Stampley"
          width={22}
          height={22}
          className="object-contain opacity-50 grayscale"
        />
      </div>
      <div>
        <div className="flex items-center gap-2 text-[14px] font-light text-black/55">
          <Loader2 size={15} className="animate-spin text-[#3d5a80]" />
          <span>Stampley is preparing your response…</span>
        </div>
        <p className="mt-1 text-[12px] text-black/35">
          This usually takes a few seconds.
        </p>
      </div>
    </motion.section>
  )
}

function ErrorBanner({ message }: { message: string }) {
  const isDuplicate = message === DUPLICATE_CHECK_IN_MESSAGE

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[14px] border px-4 py-3 text-[13px] leading-[1.65] ${
        isDuplicate
          ? "border-amber-200/70 bg-amber-50/90 text-amber-900"
          : "border-red-200/70 bg-red-50/90 text-red-700"
      }`}
    >
      {message}
    </motion.section>
  )
}

function MetricsBar({ metrics }: { metrics: SavedMetrics }) {
  return (
    <div
      className="flex items-center gap-3 rounded-[14px] px-4 py-3"
      style={{
        background: "white",
        border: "1px solid rgba(10,10,5,0.07)",
        boxShadow: "0 1px 4px rgba(10,10,5,0.04)",
      }}
    >
      <motion.div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-black/[0.05]">
        <Activity size={14} strokeWidth={1.5} className="text-black/45" />
      </motion.div>
      <div>
        <p
          className="mb-0.5 text-[8px] uppercase tracking-[0.2em]"
          style={{
            color: "rgba(10,10,5,0.28)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Today&apos;s metrics
        </p>
        <p className="text-[12px] font-light text-black/55">
          Distress {metrics.distress} · Mood {metrics.mood} · Energy{" "}
          {metrics.energy}
          {metrics.domain ? (
            <span className="ml-2 text-[10px] text-black/25">
              · {metrics.domain}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  )
}

function ReflectionSummaryCard({
  metrics,
  userMessageCount,
}: {
  metrics: SavedMetrics
  userMessageCount: number
}) {
  const reflectionPreview = metrics.reflection?.trim()
  const copingPreview = metrics.copingAction?.trim()

  return (
    <motion.div
      className="rounded-[12px] border border-black/[0.07] bg-white px-3.5 py-3 shadow-[0_1px_4px_rgba(10,10,15,0.04)]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={materialSpring}
    >
      <p className="mb-2 font-['Poppins', sans-serif] text-[8px] uppercase tracking-[0.18em] text-black/35">
        Today&apos;s reflection summary
      </p>
      <p className="text-[12px] font-light text-black/55">
        Stress {metrics.distress}/10 · Mood {metrics.mood}/10 · Energy{" "}
        {metrics.energy}
        {metrics.domain ? (
          <span className="text-black/40"> · {metrics.domain}</span>
        ) : null}
      </p>
      {reflectionPreview ? (
        <p className="mt-1.5 line-clamp-2 text-[12px] font-light leading-[1.55] text-black/50">
          {reflectionPreview}
        </p>
      ) : null}
      {copingPreview ? (
        <p className="mt-1 line-clamp-1 text-[11px] font-light text-black/40">
          Coping: {copingPreview}
        </p>
      ) : null}
      {userMessageCount > 0 ? (
        <p className="mt-2 font-['Poppins', sans-serif] text-[8px] uppercase tracking-[0.12em] text-black/30">
          {userMessageCount} chat{" "}
          {userMessageCount === 1 ? "reply" : "replies"} with Stampley
        </p>
      ) : null}
    </motion.div>
  )
}

function ChatInputDock({
  inputText,
  setInputText,
  onSend,
  onComplete,
  loading,
  completingCheckIn,
  canComplete,
  metrics,
  userMessageCount,
  requiredDailyReplies,
}: {
  inputText: string
  setInputText: (v: string) => void
  onSend: () => void
  onComplete: () => void
  loading: boolean
  completingCheckIn: boolean
  canComplete: boolean
  metrics: SavedMetrics
  userMessageCount: number
  requiredDailyReplies: number
}) {
  const inputDisabled = loading || completingCheckIn
  const remainingReplies = Math.max(requiredDailyReplies - userMessageCount, 0)

  return (
    <div className="shrink-0 w-full  bg-white px-4 pb-4 pt-3 md:px-6 md:pb-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-[26px] border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(10,10,15,0.07)] transition-all duration-200 focus-within:border-[#3d5a80]/30 focus-within:shadow-[0_8px_30px_rgba(61,90,128,0.10)]">
          <div className="flex items-center gap-2 px-4 py-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="Reply to Stampley..."
              disabled={inputDisabled}
              className="h-8 flex-1 bg-transparent text-[15px] font-light text-[#0a0a0f] outline-none placeholder:text-black/30 disabled:opacity-40"
              style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            />
  
            <button
              type="button"
              onClick={onSend}
              disabled={!inputText.trim() || inputDisabled}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-150 ${
                inputText.trim() && !inputDisabled
                  ? "bg-[#0a0a0f] text-white hover:bg-black"
                  : "cursor-not-allowed bg-black/[0.06] text-black/25"
              }`}
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <ArrowUp size={15} strokeWidth={2.3} />
              )}
            </button>
          </div>
        </div>
  
        <button
          type="button"
          onClick={onComplete}
          disabled={inputDisabled || !canComplete}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-[16px] px-6 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
            inputDisabled || !canComplete
              ? "cursor-not-allowed border border-[#cfd9e5] bg-[#eef3f8] text-[#7c8da1]"
              : "bg-[#3d5a80] text-white shadow-[0_6px_18px_rgba(61,90,128,0.22)] hover:-translate-y-px hover:bg-[#2f4a6e]"
          }`}
          style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
          {completingCheckIn ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Completing check-in…
            </>
          ) : (
            "Complete Check-in"
          )}
        </button>
  
        <p className="mt-2 text-center text-[11px] text-black/40">
          {!canComplete
            ? `Continue chatting with Stampley. Answer ${remainingReplies} more question${
                remainingReplies === 1 ? "" : "s"
              } to complete today’s reflection.`
            : "You can complete today’s check-in when you’re ready."}
        </p>
  
        <p
          className="mt-3 hidden select-none text-center text-[8.5px] uppercase tracking-[0.16em] text-black/25 md:block"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Stampley may make mistakes · not a substitute for professional care
        </p>
      </div>
    </div>
  )
}

function ChatMessage({
  msg,
  expandedCard,
  setExpandedCard,
  copiedId,
  onCopy,
}: {
  msg: StoredMessage
  expandedCard: string | null
  setExpandedCard: (v: string | null) => void
  copiedId: string | null
  onCopy: (msg: StoredMessage) => void
}) {
  if (msg.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={materialSpring}
        className="flex w-full justify-end"
      >
        <div className="flex max-w-[78%] flex-col items-end gap-1">
          <div
            className="rounded-[18px] rounded-tr-[5px] px-5 py-3 text-[13.5px] font-light leading-relaxed"
            style={{
              background: "white",
              border: "1px solid rgba(10,10,5,0.08)",
              color: "rgba(10,10,5,0.78)",
              boxShadow: "0 1px 4px rgba(10,10,5,0.06)",
            }}
          >
            {msg.content}
          </div>
          <span
            className="px-2 text-[9px]"
            style={{
              color: "rgba(10,10,5,0.22)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {msg.timestamp}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={materialSpring}
      className="flex w-full gap-3"
    >
      <motion.div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(10,10,15,0.06)]">
        <Image
          src="/images/stampleyLogo.png"
          alt="Stampley"
          width={20}
          height={20}
          className="object-contain"
        />
      </motion.div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{
              color: "rgba(10,10,5,0.45)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Stampley
          </span>
          <span
            className="text-[9px]"
            style={{
              color: "rgba(10,10,5,0.22)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {msg.timestamp}
          </span>
        </div>

        {msg.data && (
          <>
            <div className="space-y-3 text-[14.5px] font-light leading-[1.72] text-black/75">
              {msg.data.greeting && <p>{msg.data.greeting}</p>}
              <p className="text-black/60">{msg.data.validation}</p>
              <p className="font-normal text-black/85">
                {msg.data.reflection_question}
              </p>
              {msg.data.closure && (
                <p className="text-black/50 italic">{msg.data.closure}</p>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <ChipButton
                active={expandedCard === `${msg.id}-skill`}
                onClick={() =>
                  setExpandedCard(
                    expandedCard === `${msg.id}-skill`
                      ? null
                      : `${msg.id}-skill`
                  )
                }
                icon={<Wind size={11} strokeWidth={2} />}
                label="Skill"
              />
              <ChipButton
                active={expandedCard === `${msg.id}-edu`}
                onClick={() =>
                  setExpandedCard(
                    expandedCard === `${msg.id}-edu` ? null : `${msg.id}-edu`
                  )
                }
                icon={<BookOpen size={11} strokeWidth={2} />}
                label="Insight"
              />
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => onCopy(msg)}
                className="rounded-full p-1.5 text-black/30 transition-all hover:text-black/55"
                aria-label="Copy response"
              >
                {copiedId === msg.id ? (
                  <Check
                    size={12}
                    strokeWidth={2}
                    className="text-emerald-600"
                  />
                ) : (
                  <Copy size={12} strokeWidth={1.5} />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {expandedCard === `${msg.id}-skill` && (
                <ExpandableCard
                  key="skill"
                  icon={<Wind size={13} strokeWidth={1.8} />}
                  title="Micro-skill"
                  value={msg.data.micro_skill}
                />
              )}
              {expandedCard === `${msg.id}-edu` && (
                <ExpandableCard
                  key="edu"
                  icon={<BookOpen size={13} strokeWidth={1.8} />}
                  title="Insight"
                  value={msg.data.education_chip}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  )
}

function ChipButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-all duration-200"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: active ? "rgba(10,10,5,0.07)" : "transparent",
        border: active
          ? "1px solid rgba(10,10,5,0.1)"
          : "1px solid rgba(10,10,5,0.08)",
        color: active ? "rgba(10,10,5,0.6)" : "rgba(10,10,5,0.35)",
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function ExpandableCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div
        className="mt-1 rounded-[14px] p-4"
        style={{
          background: "white",
          border: "1px solid rgba(10,10,5,0.07)",
          boxShadow: "0 1px 4px rgba(10,10,5,0.04)",
        }}
      >
        <div className="mb-2 flex items-center gap-2 text-black/40">
          {icon}
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {title}
          </span>
        </div>
        <p className="text-[13.5px] font-light leading-relaxed text-black/60">
          {value}
        </p>
      </div>
    </motion.div>
  )
}

function SafetyCard({
  showSupport,
  setShowSupport,
  isAlertDismissed,
  setIsAlertDismissed,
}: {
  showSupport: boolean
  setShowSupport: (value: boolean) => void
  isAlertDismissed: boolean
  setIsAlertDismissed: (value: boolean) => void
}) {
  return (
    <AnimatePresence>
      {!isAlertDismissed && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="relative flex items-start gap-4 overflow-hidden rounded-[16px] border border-[#3d5a80]/20 bg-[#3d5a80]/[0.04] p-5"
        >
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setIsAlertDismissed(true)}
            className="absolute right-3 top-3 cursor-pointer rounded-full p-1.5 text-black/30 transition-all hover:bg-black/[0.05] hover:text-black/55"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M6 6l8 8M6 14L14 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#3d5a80]/10 text-[#3d5a80]">
            <Phone size={16} strokeWidth={1.5} />
          </div>

          <div className="min-w-0 flex-1 pr-6">
            <h3 className="mb-1 font-[Fraunces,Georgia,serif] text-[17px] font-light text-[#0a0a0f]/80">
              Support is available
            </h3>
            <p className="mb-4 text-[15px] font-light leading-[1.65] text-black/55">
              Your stress level is very high today. You don&apos;t have to carry
              this alone. If you need immediate support, resources are available
              right now.
            </p>

            <button
              type="button"
              onClick={() => setShowSupport(!showSupport)}
              className="rounded-full border border-[#3d5a80]/30 bg-[#3d5a80]/[0.06] px-4 py-2 font-['Poppins', sans-serif] text-[10px] uppercase tracking-[0.14em] text-[#3d5a80] transition-all duration-200 hover:bg-[#3d5a80]/10"
            >
              {showSupport ? "Hide Resources" : "View Resources"}
            </button>

            <AnimatePresence>
              {showSupport && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <motion.div className="space-y-2.5 rounded-[12px] border border-black/[0.07] bg-white p-4">
                    <a
                      href="sms:741741&body=HOME"
                      className="flex items-center gap-2 rounded-[10px] border border-[#3d5a80]/25 bg-[#3d5a80]/[0.04] px-4 py-2.5 text-[12.5px] font-medium text-[#3d5a80] transition-all hover:bg-[#3d5a80]/[0.08]"
                    >
                      Crisis Text Line — Text HOME to 741741
                    </a>
                    <a
                      href="tel:18006624357"
                      className="flex items-center gap-2 rounded-[10px] border border-[#3d5a80]/25 bg-[#3d5a80]/[0.04] px-4 py-2.5 text-[12.5px] font-medium text-[#3d5a80] transition-all hover:bg-[#3d5a80]/[0.08]"
                    >
                      <Phone size={14} strokeWidth={1.5} />
                      SAMHSA Helpline — 1-800-662-4357
                    </a>
                    <a
                      href="mailto:pcrg@umb.edu"
                      className="flex items-center gap-2 rounded-[10px] border border-[#3d5a80]/25 bg-[#3d5a80]/[0.04] px-4 py-2.5 text-[12.5px] font-medium text-[#3d5a80] transition-all hover:bg-[#3d5a80]/[0.08]"
                    >
                      <Mail size={14} strokeWidth={1.5} />
                      pcrg@umb.edu
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
