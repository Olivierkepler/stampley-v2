"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MessageSquareText, PanelLeftClose, PanelLeft,
  SquarePen, Target, FileBarChart, Clock, Plus
} from "lucide-react";

import { useCheckInStore } from "../hooks/useCheckInStore";
import type { StoredConversation } from "./conversationStorage";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  conversations: StoredConversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  setActiveView: (view: "chat" | "report") => void;
}

function groupConversations(conversations: StoredConversation[], query: string) {
  const filtered = conversations
    .filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (filtered.length === 0) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;

  const groups: Record<string, StoredConversation[]> = { "Today": [], "Yesterday": [], "Earlier": [] };

  filtered.forEach(c => {
    const chatDate = new Date(c.updatedAt).getTime();
    if (chatDate >= today) groups["Today"].push(c);
    else if (chatDate >= yesterday) groups["Yesterday"].push(c);
    else groups["Earlier"].push(c);
  });

  return Object.entries(groups).filter(([_, chats]) => chats.length > 0);
}

export default function Sidebar({
  isOpen, setIsOpen, conversations, currentConversationId, onSelectConversation, onNewChat, setActiveView
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { focusDomain } = useCheckInStore();

  const groupedChats = useMemo(
    () => groupConversations(conversations, searchQuery),
    [conversations, searchQuery]
  );

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
        animate={{ width: isCollapsed ? 72 : 280 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed md:relative z-50 h-full bg-[#fefdfb] border-r border-black/[0.07] flex flex-col overflow-hidden select-none font-[Outfit,system-ui,sans-serif]"
      >
        {/* ── HEADER ── */}
        <div className={`h-16 flex items-center shrink-0 px-4 border-b border-black/[0.05] ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <span className="font-[JetBrains_Mono,monospace] text-[10.5px] uppercase tracking-[0.2em] text-black/40 select-none px-1">
              Stampley
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-black/[0.07] text-black/35 hover:bg-black/[0.04] hover:text-black/60 transition-all duration-200"
          >
            {isCollapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        {/* ── PRIMARY ACTIONS ── */}
        <div className="px-3 pt-4 space-y-1.5 shrink-0">
          {/* New chat */}
          <button
            onClick={onNewChat}
            className={`flex items-center w-full transition-all duration-150 group
              ${isCollapsed
                ? "h-9 w-9 justify-center mx-auto rounded-[10px] border border-black/[0.08] bg-[#fefdfb] text-black/40 hover:bg-black/[0.04] hover:text-black/60"
                : "h-9 px-3 rounded-[10px] border border-black/[0.08] bg-[#fefdfb] text-[12.5px] font-medium text-black/60 hover:bg-black/[0.04] hover:text-black/80 shadow-[0_1px_3px_rgba(10,10,15,0.04)]"
              }`}
          >
            <Plus size={15} className="shrink-0" />
            {!isCollapsed && <span className="ml-2.5 flex-1 text-left font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-[0.12em]">New chat</span>}
          </button>

          {/* Report */}
          <button
            onClick={() => setActiveView("report")}
            className={`flex items-center w-full transition-all duration-150
              ${isCollapsed
                ? "h-9 w-9 justify-center mx-auto rounded-[10px] text-black/35 hover:bg-black/[0.04] hover:text-black/55"
                : "h-9 px-3 rounded-[10px] text-black/45 hover:bg-black/[0.04] hover:text-black/70 text-[12px]"
              }`}
          >
            <FileBarChart size={15} className="shrink-0" />
            {!isCollapsed && (
              <span className="ml-2.5 font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-[0.12em]">
                Results report
              </span>
            )}
          </button>
        </div>

        {/* ── SEARCH ── */}
        {!isCollapsed && (
          <div className="px-3 mt-4 shrink-0">
            <div className="relative group">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-[#3d5a80] transition-colors" />
              <input
                placeholder="Search history…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-black/[0.03] border border-black/[0.07] rounded-[9px] text-[12px] text-[#0a0a0f] placeholder:text-black/30 outline-none transition-all duration-200 focus:border-[#3d5a80]/30 focus:bg-[#fefdfb] focus:shadow-[0_0_0_3px_rgba(61,90,128,0.07)] font-[Outfit,system-ui,sans-serif]"
              />
            </div>
          </div>
        )}

        {/* ── CONVERSATION HISTORY ── */}
        <div className="flex-1 overflow-y-auto mt-4 px-2 [scrollbar-width:thin] [scrollbar-color:rgba(10,10,15,0.08)_transparent]">
          {isCollapsed ? (
            <div className="flex flex-col items-center pt-2">
              <Clock size={14} className="text-black/20" />
            </div>
          ) : (
            groupedChats.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 pt-6 text-center">
                <MessageSquareText size={18} className="text-black/15" />
                <p className="font-[JetBrains_Mono,monospace] text-[9px] uppercase tracking-[0.18em] text-black/25 select-none">
                  No conversations yet
                </p>
              </div>
            ) : (
              groupedChats.map(([label, chats]) => (
                <div key={label} className="mb-5">
                  <p className="px-3 font-[JetBrains_Mono,monospace] text-[8.5px] uppercase tracking-[0.2em] text-black/25 mb-2 select-none">
                    {label}
                  </p>
                  {chats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => onSelectConversation(chat.id)}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] text-[12.5px] transition-all duration-150 group
                        ${currentConversationId === chat.id
                          ? "bg-[#3d5a80]/[0.07] text-[#3d5a80] border border-[#3d5a80]/15"
                          : "text-black/50 hover:bg-black/[0.04] hover:text-black/70 border border-transparent"
                        }`}
                    >
                      <MessageSquareText
                        size={13}
                        className={`shrink-0 transition-opacity ${
                          currentConversationId === chat.id
                            ? "text-[#3d5a80]"
                            : "text-black/25 group-hover:text-black/45"
                        }`}
                      />
                      <span className="truncate flex-1 text-left font-light">{chat.title}</span>
                    </button>
                  ))}
                </div>
              ))
            )
          )}
        </div>

        {/* ── FOOTER: Active Focus Widget ── */}
        {!isCollapsed && (
          <div className="p-3 border-t border-black/[0.06] shrink-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-[JetBrains_Mono,monospace] text-[8.5px] uppercase tracking-[0.2em] text-black/30 select-none">
                Active Focus
              </span>
              <Target size={11} className="text-[#9d7855]/60" />
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#fefdfb] border border-black/[0.07] rounded-[11px] shadow-[0_1px_3px_rgba(10,10,15,0.04)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#9d7855]/70 shrink-0" />
              <span className="text-[12px] font-light text-black/60 truncate">
                {focusDomain || "General Support"}
              </span>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}