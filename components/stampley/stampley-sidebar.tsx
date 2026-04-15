"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, MessageSquareText, PanelLeftClose, PanelLeft,
  Plus, Clock, Target, FileBarChart
} from "lucide-react"
import type { StoredConversation } from "@/store/conversation-storage"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  conversations: StoredConversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  setActiveView: (view: "chat" | "results") => void
  currentDomain: string | null
}

function groupConversations(conversations: StoredConversation[], query: string) {
  const filtered = conversations
    .filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  if (filtered.length === 0) return []

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterday = today - 86400000

  const groups: Record<string, StoredConversation[]> = {
    "Today": [], "Yesterday": [], "Earlier": []
  }

  filtered.forEach(c => {
    const t = new Date(c.updatedAt).getTime()
    if (t >= today) groups["Today"].push(c)
    else if (t >= yesterday) groups["Yesterday"].push(c)
    else groups["Earlier"].push(c)
  })

  return Object.entries(groups).filter(([, chats]) => chats.length > 0)
}

export function StampleySidebar({
  isOpen, setIsOpen, conversations, currentConversationId,
  onSelectConversation, onNewChat, setActiveView, currentDomain
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const groupedChats = useMemo(
    () => groupConversations(conversations, searchQuery),
    [conversations, searchQuery]
  )

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 68 : 272 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="relative z-50 h-full flex flex-col overflow-hidden select-none"
        style={{
          background: "linear-gradient(180deg, #fefdfb 0%, #faf8f4 100%)",
          borderRight: "1px solid rgba(10,10,5,0.07)",
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          className={`h-16 flex items-center shrink-0 px-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
          style={{ borderBottom: "1px solid rgba(10,10,5,0.05)" }}
        >
          {!isCollapsed && (
            <span
              className="text-[10px] uppercase tracking-[0.22em] px-1 select-none"
              style={{
                color: "rgba(10,10,5,0.35)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Stampley
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200"
            style={{
              border: "1px solid rgba(10,10,5,0.07)",
              color: "rgba(10,10,5,0.35)",
            }}
          >
            {isCollapsed
              ? <PanelLeft size={14} strokeWidth={1.5} />
              : <PanelLeftClose size={14} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* Primary actions */}
        <div className="px-3 pt-4 space-y-1.5 shrink-0">
          <button
            onClick={onNewChat}
            className={`flex items-center w-full transition-all duration-150 ${
              isCollapsed
                ? "h-9 w-9 justify-center mx-auto rounded-[10px]"
                : "h-9 px-3 rounded-[10px]"
            }`}
            style={{
              border: "1px solid rgba(10,10,5,0.08)",
              background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
              color: "rgba(10,10,5,0.55)",
              boxShadow: "0 1px 3px rgba(10,10,5,0.04)",
            }}
          >
            <Plus size={14} strokeWidth={2} className="shrink-0" />
            {!isCollapsed && (
              <span
                className="ml-2.5 text-[10px] uppercase tracking-[0.12em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                New chat
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("results")}
            className={`flex items-center w-full transition-all duration-150 ${
              isCollapsed ? "h-9 w-9 justify-center mx-auto rounded-[10px]" : "h-9 px-3 rounded-[10px]"
            }`}
            style={{ color: "rgba(10,10,5,0.4)" }}
          >
            <FileBarChart size={14} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && (
              <span
                className="ml-2.5 text-[10px] uppercase tracking-[0.12em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Results
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 mt-4 shrink-0">
            <div className="relative">
              <Search
                size={11}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(10,10,5,0.28)" }}
              />
              <input
                placeholder="Search history…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-[9px] text-[12px] outline-none transition-all duration-200"
                style={{
                  background: "rgba(10,10,5,0.03)",
                  border: "1px solid rgba(10,10,5,0.07)",
                  color: "rgba(10,10,5,0.7)",
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              />
            </div>
          </div>
        )}

        {/* Conversation history */}
        <div
          className="flex-1 overflow-y-auto mt-4 px-2"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(10,10,5,0.08) transparent" }}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center pt-2">
              <Clock size={13} style={{ color: "rgba(10,10,5,0.18)" }} />
            </div>
          ) : groupedChats.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 pt-6 text-center">
              <MessageSquareText size={16} style={{ color: "rgba(10,10,5,0.14)" }} />
              <p
                className="text-[9px] uppercase tracking-[0.2em] select-none"
                style={{ color: "rgba(10,10,5,0.22)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                No conversations yet
              </p>
            </div>
          ) : (
            groupedChats.map(([label, chats]) => (
              <div key={label} className="mb-5">
                <p
                  className="px-3 text-[8px] uppercase tracking-[0.2em] mb-2 select-none"
                  style={{ color: "rgba(10,10,5,0.22)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {label}
                </p>
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectConversation(chat.id)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] text-[12.5px] transition-all duration-150"
                    style={{
                      background: currentConversationId === chat.id
                        ? "rgba(10,10,5,0.05)"
                        : "transparent",
                      border: currentConversationId === chat.id
                        ? "1px solid rgba(10,10,5,0.08)"
                        : "1px solid transparent",
                      color: currentConversationId === chat.id
                        ? "rgba(10,10,5,0.7)"
                        : "rgba(10,10,5,0.45)",
                    }}
                  >
                    <MessageSquareText
                      size={12}
                      strokeWidth={1.5}
                      className="shrink-0"
                      style={{
                        color: currentConversationId === chat.id
                          ? "rgba(10,10,5,0.5)"
                          : "rgba(10,10,5,0.22)",
                      }}
                    />
                    <span className="truncate flex-1 text-left font-light">
                      {chat.title}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer — active focus */}
        {!isCollapsed && (
          <div
            className="p-3 shrink-0"
            style={{ borderTop: "1px solid rgba(10,10,5,0.06)" }}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span
                className="text-[8px] uppercase tracking-[0.2em] select-none"
                style={{ color: "rgba(10,10,5,0.28)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                Active Focus
              </span>
              <Target size={10} style={{ color: "rgba(10,10,5,0.25)" }} />
            </div>
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[11px]"
              style={{
                background: "linear-gradient(160deg, #fefdfb 0%, #f9f6f1 100%)",
                border: "1px solid rgba(10,10,5,0.07)",
                boxShadow: "0 1px 3px rgba(10,10,5,0.04)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "rgba(10,10,5,0.3)" }}
              />
              <span
                className="text-[12px] font-light truncate"
                style={{ color: "rgba(10,10,5,0.55)" }}
              >
                {currentDomain ?? "General Support"}
              </span>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  )
}