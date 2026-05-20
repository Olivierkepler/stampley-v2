"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Wind, BookOpen, ChevronDown, SquarePen,
  Loader2, ExternalLink, Menu, Mail, Check, Copy, ArrowUp, Trash2, Activity, FileBarChart
} from "lucide-react";
import { useCheckInStore, CONTEXT_TAG_LABELS } from "../hooks/useCheckInStore";
import { getConversations, saveConversations, type StoredConversation } from "../stampley-support/conversationStorage";
import { useCheckInUserId } from "../CheckInUserScope";
import SupportSidebar from "../stampley-support/StampleySupportPage";
import CheckInResults from "./CheckInResults";
import Image from "next/image";
import { VoiceController } from "./VoiceController";
import StampleyVoiceContainer from "@/components/ui/StampleyVoiceContainer";

interface AiResponseData {
  validationText: string;
  reflectionText: string;
  followUpQuestion: string;
  microSkill: { title: string; description: string };
  education: { title: string; description: string };
  resourceLink: string | null;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  data?: AiResponseData;
  timestamp: string;
}

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function ensureUniqueTitle(baseTitle: string, existingTitles: string[]): string {
  const set = new Set(existingTitles.map((t) => t.toLowerCase()));
  if (!set.has(baseTitle.toLowerCase())) return baseTitle;
  let n = 2;
  while (set.has(`${baseTitle} (${n})`.toLowerCase())) n++;
  return `${baseTitle} (${n})`;
}

export default function StampleySupportPage() {
  const router = useRouter();
  const { affect, focusDomain, activeSubscale, narrative, contextTags, needsSafetyEscalation } = useCheckInStore();
  const userId = useCheckInUserId();
  const contextTagLabels = (Object.keys(CONTEXT_TAG_LABELS) as (keyof typeof CONTEXT_TAG_LABELS)[])
    .filter((key) => contextTags[key])
    .map((key) => CONTEXT_TAG_LABELS[key]);

  const hasCheckInData = Boolean(focusDomain || narrative?.reflection);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "report" | "voice">("chat");
  const [showSupport, setShowSupport] = useState(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedInitial = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, showSupport, expandedCard]);

  useEffect(() => {
    if (!userId) return;
    setConversations(getConversations(userId));
  }, [userId]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (!userId) return;
    const updatedAt = new Date().toISOString();
    if (currentConversationId === null) {
      const firstUser = messages.find((m) => m.role === "user");
      const baseTitle = (firstUser?.content?.slice(0, 40) as string) || "New conversation";
      const newId = Date.now().toString();
      setConversations((prev) => {
        const existingTitles = prev.map((c) => c.title);
        const title = ensureUniqueTitle(baseTitle, existingTitles);
        const newConv: StoredConversation = { id: newId, title, updatedAt, messages: [...messages] };
        const next = [...prev, newConv];
        saveConversations(userId, next);
        return next;
      });
      setCurrentConversationId(newId);
    } else {
      setConversations((prev) => {
        const next = prev.map((c) =>
          c.id === currentConversationId ? { ...c, messages: [...messages], updatedAt } : c
        );
        saveConversations(userId, next);
        return next;
      });
    }
  }, [messages, userId]);

  const fetchInitialGreeting = async () => {
    setIsLoading(true);
    await generateAiResponse([]);
  };

  useEffect(() => {
    if (hasCheckInData && !hasFetchedInitial.current) {
      hasFetchedInitial.current = true;
      fetchInitialGreeting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckInData]);

  const generateAiResponse = async (history: { role: string; content: string }[]) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageHistory: history,
          patientState: {
            domain: focusDomain || "General",
            subscale: activeSubscale || "General distress",
            distress: affect.distress ?? 5,
            mood: affect.mood ?? null,
            energy: affect.energy ?? null,
            reflection: narrative.reflection || "I'm having a hard time today.",
            copingAction: narrative.copingAction || "",
            contextTagLabels,
            emotionKeywords: [],
          },
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const aiData: AiResponseData = await response.json();
      const newMessageId = Date.now().toString();
      setMessages((prev) => [...prev, { id: newMessageId, role: "assistant", data: aiData, timestamp: getCurrentTime() }]);
      setExpandedCard(`${newMessageId}-skill`);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMsgId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          role: "assistant",
          timestamp: getCurrentTime(),
          data: {
            validationText: "I'm having a little trouble connecting right now.",
            reflectionText: "But please know that what you're dealing with is valid.",
            followUpQuestion: "Would you like to try sending that again?",
            microSkill: { title: "Grounding Breath", description: "Take a slow breath in for 4 seconds, and out for 4 seconds." },
            education: { title: "System Note", description: "There was a brief connectivity error. Your data is safe." },
            resourceLink: null,
          },
        },
      ]);
      setExpandedCard(`${errorMsgId}-skill`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setInputText("");
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: userText, timestamp: getCurrentTime() };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);
    setExpandedCard(null);
    const formattedHistory = messages.map((msg) => {
      if (msg.role === "user") return { role: "user" as const, content: msg.content || "" };
      const d = msg.data;
      return {
        role: "assistant" as const,
        content: `[Stampley] Validation: "${d?.validationText ?? ""}". Reflection: "${d?.reflectionText ?? ""}". Follow-up question I asked: "${d?.followUpQuestion ?? ""}". Skill I offered: "${d?.microSkill?.title ?? ""}". Education chip: "${d?.education?.title ?? ""}".`,
      };
    });
    formattedHistory.push({ role: "user", content: userText });
    await generateAiResponse(formattedHistory);
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    setMessages(conv.messages);
    setCurrentConversationId(conv.id);
    setExpandedCard(null);
    setActiveView("chat");
  };

  const handleNewChat = () => {
    if (isLoading) return;
    if (!userId) return;
    if (messages.length > 0) {
      const updatedAt = new Date().toISOString();
      const firstUser = messages.find((m) => m.role === "user");
      const title = (firstUser?.content?.slice(0, 40) as string) || "New conversation";
      if (currentConversationId) {
        setConversations((prev) => {
          const next = prev.map((c) =>
            c.id === currentConversationId ? { ...c, messages: [...messages], updatedAt } : c
          );
          saveConversations(userId, next);
          return next;
        });
      } else {
        const existingTitles = conversations.map((c) => c.title);
        const uniqueTitle = ensureUniqueTitle(title, existingTitles);
        const newConv: StoredConversation = { id: Date.now().toString(), title: uniqueTitle, updatedAt, messages: [...messages] };
        setConversations((prev) => { const next = [...prev, newConv]; saveConversations(userId, next); return next; });
      }
    }
    setMessages([]);
    setCurrentConversationId(null);
    setExpandedCard(null);
    setInputText("");
    setShowSupport(false);
    setIsAlertDismissed(false);
    setActiveView("chat");
    if (hasCheckInData) { hasFetchedInitial.current = false; fetchInitialGreeting(); }
  };

  const handleClearMemory = () => { handleNewChat(); };

  const handleCopy = (msg: Message) => {
    if (!msg.data) return;
    navigator.clipboard.writeText(`${msg.data.validationText}\n\n${msg.data.reflectionText}\n\n${msg.data.followUpQuestion}`);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const materialSpring = { type: "spring", stiffness: 300, damping: 30 };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full top-20 overflow-hidden bg-[#f5f2ec] text-[#0a0a0f] antialiased font-[Outfit,system-ui,sans-serif] selection:bg-[#3d5a80]/15">

      <SupportSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        setActiveView={setActiveView}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">

        {/* ── HEADER ── */}
        <header className="sticky top-0 z-30 flex h-14 md:h-16 w-full items-center justify-between bg-[#fefdfb]/90 backdrop-blur-md px-4 border-b border-black/[0.06] transition-all">

          {/* Left — sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-black/[0.07] bg-transparent text-black/40 hover:bg-black/[0.04] hover:text-black/60 transition-all duration-200"
            aria-label="Toggle Sidebar"
          >
            <Menu size={17} strokeWidth={1.5} />
          </button>

          {/* Centre — view switcher */}
          <div className="flex items-center gap-0.5 rounded-full bg-black/[0.04] border border-black/[0.06] p-1">
            {(["chat", "voice", "report"] as const).map((view) => {
              const labels = { chat: "Chat", voice: "Talk", report: "Results" };
              const isActive = activeView === view;
              return (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200 cursor-pointer font-[JetBrains_Mono,monospace] tracking-[0.06em]
                    ${isActive
                      ? view === "voice"
                        ? "bg-[#3d5a80] text-white shadow-[0_2px_6px_rgba(61,90,128,0.25)]"
                        : "bg-[#fefdfb] text-[#0a0a0f] shadow-[0_1px_4px_rgba(10,10,15,0.08)]"
                      : "text-black/40 hover:text-black/65"
                    }`}
                >
                  {labels[view]}
                </button>
              );
            })}
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleClearMemory}
              disabled={isLoading || !hasCheckInData}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-transparent text-black/35 hover:border-red-200/60 hover:bg-red-50/60 hover:text-red-500 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Clear Chat Memory"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>

            <button
              onClick={handleClearMemory}
              disabled={isLoading || !hasCheckInData}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-transparent text-black/35 hover:border-black/[0.08] hover:bg-black/[0.04] hover:text-black/60 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="New Chat"
            >
              <SquarePen size={16} strokeWidth={1.5} />
            </button>

            <button
              onClick={() => setActiveView("report")}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-transparent text-black/35 hover:border-[#3d5a80]/20 hover:bg-[#3d5a80]/[0.04] hover:text-[#3d5a80] transition-all duration-200"
              aria-label="View Results"
            >
              <FileBarChart size={16} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* ── MAIN SCROLL AREA ── */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col [scrollbar-width:thin] [scrollbar-color:rgba(10,10,15,0.12)_transparent]">
          <AnimatePresence mode="wait">

            {/* CHAT VIEW */}
            {activeView === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col w-full min-h-0"
              >
                {!hasCheckInData ? (
                  /* ── Empty state ── */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full max-w-md mx-auto"
                  >
                    <div className="relative mb-7">
                      <div className="w-20 h-20 rounded-2xl border border-black/[0.08] bg-[#fefdfb] flex items-center justify-center shadow-[0_2px_12px_rgba(10,10,15,0.07)]">
                        <Image src="/images/stampleyLogo.png" alt="Stampley" width={44} height={44} className="object-contain" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="h-px w-5 bg-[#3d5a80]/30" />
                      <span className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.22em] text-[#3d5a80]/60">AIDES-T2D</span>
                      <span className="h-px w-5 bg-[#3d5a80]/30" />
                    </div>
                    <h2 className="font-[Fraunces,Georgia,serif] text-[26px] font-light tracking-[-0.02em] text-[#0a0a0f]/75 mb-3">
                      Let&apos;s check in <em className="italic font-light text-[#0a0a0f]/25">first.</em>
                    </h2>
                    <p className="text-[13.5px] font-light text-black/45 mb-8 leading-[1.7] max-w-sm">
                      Stampley needs to understand how you&apos;re feeling today to provide the best possible support. Complete your daily check-in to begin.
                    </p>
                    <button
                      onClick={() => router.push("/check-in/daily-metrics")}
                      className="flex items-center gap-2 bg-[#3d5a80] text-white px-7 py-3 rounded-full font-[JetBrains_Mono,monospace] text-[11px] uppercase tracking-[0.14em] hover:bg-[#2f4a6e] hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(61,90,128,0.25)] hover:shadow-[0_8px_20px_rgba(61,90,128,0.3)] transition-all duration-200 active:scale-[0.98]"
                    >
                      Go to Check-in
                      <ChevronDown size={14} className="-rotate-90" />
                    </button>
                  </motion.div>
                ) : (
                  /* ── Message list ── */
                  <div className="flex-1 flex flex-col gap-7 w-full max-w-3xl mx-auto px-4 md:px-6 pt-6 pb-4">

                    {/* Today's metrics bar */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-[14px] bg-[#fefdfb] border border-black/[0.07] shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
                      <div className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-[#3d5a80]/[0.08] text-[#3d5a80] shrink-0">
                        <Activity size={15} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-[JetBrains_Mono,monospace] text-[8.5px] uppercase tracking-[0.18em] text-black/35 mb-0.5">Today&apos;s metrics</p>
                        <p className="text-[12.5px] font-light text-black/65">
                          Distress {affect.distress != null ? affect.distress : "—"} · Mood {affect.mood != null ? affect.mood : "—"} · Energy {affect.energy != null ? affect.energy : "—"}
                          <span className="text-[11px] text-black/30 ml-1.5">used by Stampley</span>
                        </p>
                      </div>
                    </div>

                    {/* Safety alert */}
                    <AnimatePresence>
                      {needsSafetyEscalation && !isAlertDismissed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                          className="rounded-[16px] border border-[#3d5a80]/20 bg-[#3d5a80]/[0.04] p-5 flex items-start gap-4 relative overflow-hidden"
                        >
                          <button
                            aria-label="Dismiss"
                            onClick={() => setIsAlertDismissed(true)}
                            className="absolute top-3 right-3 text-black/30 hover:text-black/55 hover:bg-black/[0.05] rounded-full p-1.5 transition-all cursor-pointer"
                          >
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                              <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>

                          <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#3d5a80]/10 text-[#3d5a80] shrink-0 mt-0.5">
                            <Phone size={16} strokeWidth={1.5} />
                          </div>

                          <div className="flex-1 min-w-0 pr-6">
                            <h3 className="font-[Fraunces,Georgia,serif] text-[17px] font-light text-[#0a0a0f]/80 mb-1">Support is available</h3>
                            <p className="text-[17px] font-light text-black/55 leading-[1.65] mb-4">
                              I notice your distress has been very high. You don&apos;t have to carry this alone. If you need immediate human support, resources are available right now.
                            </p>

                            <button
                              onClick={() => setShowSupport(!showSupport)}
                              className="font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-[0.14em] px-4 py-2 rounded-full border border-[#3d5a80]/30 bg-[#3d5a80]/[0.06] text-[#3d5a80] hover:bg-[#3d5a80]/10 transition-all duration-200"
                            >
                              {showSupport ? "Hide Resources" : "View Resources"}
                            </button>

                            <AnimatePresence>
                              {showSupport && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden mt-4"
                                >
                                  <div className="bg-[#fefdfb] rounded-[12px] p-4 border border-black/[0.07]">
                                    <p className="text-[12.5px] font-light text-black/55 mb-4 leading-[1.65]">
                                      If you need assistance, our study team is here to help.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2.5">
                                      <a href="mailto:pcrg@umb.edu" className="flex items-center justify-center gap-2 text-[12.5px] font-medium text-[#3d5a80] border border-[#3d5a80]/25 bg-[#3d5a80]/[0.04] hover:bg-[#3d5a80]/[0.08] px-4 py-2.5 rounded-[10px] flex-1 transition-all duration-200">
                                        <Mail size={14} strokeWidth={1.5} /> pcrg@umb.edu
                                      </a>
                                      <a href="tel:6172874067" className="flex items-center justify-center gap-2 text-[12.5px] font-medium text-[#3d5a80] border border-[#3d5a80]/25 bg-[#3d5a80]/[0.04] hover:bg-[#3d5a80]/[0.08] px-4 py-2.5 rounded-[10px] flex-1 transition-all duration-200">
                                        <Phone size={14} strokeWidth={1.5} /> (617) 287-4067
                                      </a>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Messages */}
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={materialSpring as any}
                        className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {/* USER bubble */}
                        {msg.role === "user" ? (
                          <div className="flex flex-col items-end gap-1.5 max-w-[80%]">
                            <div className="bg-[#fefdfb] border border-black/[0.08] text-[#0a0a0f] px-5 py-3 rounded-[18px] rounded-tr-[5px] text-[14px] font-light leading-[1.65] shadow-[0_1px_4px_rgba(10,10,15,0.06)]">
                              {msg.content}
                            </div>
                            <span className="font-[JetBrains_Mono,monospace] text-[9px] text-black/25 px-2">{msg.timestamp}</span>
                          </div>
                        ) : (
                          /* STAMPLEY bubble */
                          <div className="flex gap-3.5 w-full max-w-[100%]">
                            <div className="shrink-0 w-8 h-8 flex items-center justify-center mt-1 rounded-[9px] border border-black/[0.08] bg-[#fefdfb] overflow-hidden shadow-[0_1px_3px_rgba(10,10,15,0.06)]">
                              <Image src="/images/stampleyLogo.png" alt="Stampley" width={20} height={20} className="object-contain" />
                            </div>

                            <div className="flex flex-col gap-2 w-full min-w-0">
                              <div className="flex items-center gap-2 pt-1 mb-0.5">
                                <span className="font-[JetBrains_Mono,monospace] text-[13px] uppercase tracking-[0.14em] text-black/50">Stampley</span>
                                <span className="font-[JetBrains_Mono,monospace] text-[9px] text-black/25">{msg.timestamp}</span>
                              </div>

                              <div className="text-[17px] font-light leading-[1.7] text-[#0a0a0f] space-y-3">
                                <p>{msg.data?.validationText}</p>
                                <p className="text-black/55">{msg.data?.reflectionText}</p>
                                <p className="font-normal">{msg.data?.followUpQuestion}</p>
                              </div>

                              {msg.data && (
                                <div className="mt-1 flex flex-col gap-2.5">
                                  {/* Chip row */}
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => setExpandedCard(expandedCard === `${msg.id}-skill` ? null : `${msg.id}-skill`)}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-[JetBrains_Mono,monospace] tracking-[0.08em] transition-all duration-200
                                        ${expandedCard === `${msg.id}-skill`
                                          ? "bg-[#3d5a80]/[0.08] text-[#3d5a80] border border-[#3d5a80]/20"
                                          : "text-black/40 border border-black/[0.08] hover:border-[#3d5a80]/20 hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.04]"
                                        }`}
                                    >
                                      <Wind size={12} strokeWidth={2} /> Skill
                                    </button>

                                    <button
                                      onClick={() => setExpandedCard(expandedCard === `${msg.id}-edu` ? null : `${msg.id}-edu`)}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-[JetBrains_Mono,monospace] tracking-[0.08em] transition-all duration-200
                                        ${expandedCard === `${msg.id}-edu`
                                          ? "bg-[#3d5a80]/[0.08] text-[#3d5a80] border border-[#3d5a80]/20"
                                          : "text-black/40 border border-black/[0.08] hover:border-[#3d5a80]/20 hover:text-[#3d5a80] hover:bg-[#3d5a80]/[0.04]"
                                        }`}
                                    >
                                      <BookOpen size={12} strokeWidth={2} /> Insight
                                    </button>

                                    <div className="flex-1" />

                                    {msg.data.resourceLink && msg.data.resourceLink !== "null" && (
                                      <a
                                        href={msg.data.resourceLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-full text-black/30 border border-transparent hover:border-black/[0.08] hover:text-black/55 transition-all"
                                      >
                                        <ExternalLink size={13} strokeWidth={1.5} />
                                      </a>
                                    )}

                                    <button
                                      onClick={() => handleCopy(msg)}
                                      className="p-1.5 rounded-full text-black/30 border border-transparent hover:border-black/[0.08] hover:text-black/55 transition-all"
                                    >
                                      {copiedId === msg.id
                                        ? <Check size={13} strokeWidth={2} className="text-emerald-600" />
                                        : <Copy size={13} strokeWidth={1.5} />}
                                    </button>
                                  </div>

                                  {/* Expandable cards */}
                                  <AnimatePresence mode="wait">
                                    {expandedCard === `${msg.id}-skill` && (
                                      <motion.div
                                        key="skill"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="bg-[#fefdfb] border border-black/[0.07] rounded-[14px] p-4 mt-1 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Wind size={14} strokeWidth={1.8} className="text-[#3d5a80]" />
                                            <span className="text-[17px] font-medium text-[#0a0a0f]/80">{msg.data.microSkill.title}</span>
                                          </div>
                                          <p className="text-[17px] font-light text-black/50 leading-[1.65]">{msg.data.microSkill.description}</p>
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
                                        <div className="bg-[#fefdfb] border border-black/[0.07] rounded-[14px] p-4 mt-1 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
                                          <div className="flex items-center gap-2 mb-2">
                                            <BookOpen size={14} strokeWidth={1.8} className="text-[#3d5a80]" />
                                            <span className="text-[17px] font-medium text-[#0a0a0f]/80">{msg.data.education.title}</span>
                                          </div>
                                          <p className="text-[17px] font-light text-black/50 leading-[1.65]">{msg.data.education.description}</p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3.5">
                        <div className="shrink-0 w-8 h-8 rounded-[9px] border border-black/[0.08] bg-[#fefdfb] flex items-center justify-center">
                          <Image src="/images/stampleyLogo.png" alt="Stampley" width={18} height={18} className="object-contain opacity-40 grayscale" />
                        </div>
                        <div className="flex items-center gap-2 text-black/40 text-[17px] font-light">
                          <Loader2 size={14} className="animate-spin" />
                          <span>Stampley is thinking…</span>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4 shrink-0" />
                  </div>
                )}
              </motion.div>
            )}

            {/* REPORT VIEW */}
            {activeView === "report" && (
              <motion.div
                key="report"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col w-full min-h-0"
              >
                <CheckInResults />
              </motion.div>
            )}

            {/* VOICE VIEW */}
            {activeView === "voice" && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex items-center justify-center"
              >
                <StampleyVoiceContainer />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── BOTTOM INPUT DOCK ── */}
        {activeView === "chat" && (
          <div className="shrink-0 px-4 pb-4 md:px-6 md:pb-6 pt-2 w-full z-10 flex flex-col items-center bg-[#f5f2ec]">
            <div className="flex items-center gap-2 w-full max-w-3xl bg-[#fefdfb] border border-black/[0.08] rounded-[22px] shadow-[0_2px_12px_rgba(10,10,15,0.07)] focus-within:border-[#3d5a80]/40 focus-within:shadow-[0_4px_20px_rgba(61,90,128,0.1)] transition-all duration-300">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={hasCheckInData ? "Message Stampley…" : "Complete your check-in first"}
                disabled={isLoading || !hasCheckInData}
                className="flex-1 h-[52px] pl-5 bg-transparent text-[#0a0a0f] placeholder:text-black/30 outline-none text-[14px] font-light disabled:opacity-40"
              />
              <div className="flex items-center gap-1 pr-2">
                <VoiceController isMuted={false} isSpeaking={false} onToggleMute={() => {}} />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading || !hasCheckInData}
                  className={`w-9 h-9 rounded-full flex shrink-0 items-center justify-center transition-all duration-200
                    ${inputText.trim() && !isLoading && hasCheckInData
                      ? "bg-[#3d5a80] text-white shadow-[0_2px_8px_rgba(61,90,128,0.25)] hover:bg-[#2f4a6e]"
                      : "bg-black/[0.05] text-black/20 cursor-not-allowed"
                    }`}
                >
                  {isLoading ? <Loader2 size={15} className="animate-spin" /> : <ArrowUp size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>

            <p className="font-[JetBrains_Mono,monospace] text-[8.5px] uppercase tracking-[0.14em] text-black/25 mt-3 hidden md:block select-none">
              Stampley may make mistakes · verify important information
            </p>
          </div>
        )}
      </main>
    </div>
  );
}