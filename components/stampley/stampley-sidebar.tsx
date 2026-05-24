"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PanelLeftClose,
  PanelLeft,
  Target,
  FileBarChart,
  CheckCircle2,
  Circle,
  CircleDot,
} from "lucide-react"

type DomainKey = "Emotional" | "Regimen" | "Physician" | "Interpersonal"

const DDS_FOCUS: Record<
  DomainKey,
  { label: string; description: string }
> = {
  Emotional: {
    label: "Emotional",
    description:
      "Feelings, burnout, worry, and the emotional weight of living with diabetes.",
  },
  Regimen: {
    label: "Regimen",
    description:
      "Routines, medication, food, glucose, and day-to-day self-management.",
  },
  Physician: {
    label: "Physician",
    description:
      "Your care team, appointments, and feeling heard by healthcare providers.",
  },
  Interpersonal: {
    label: "Interpersonal",
    description:
      "Family, friends, support, and feeling understood by people around you.",
  },
}

type StepStatus = "completed" | "active" | "pending"

interface SessionStep {
  label: string
  status: StepStatus
}

export interface StampleySidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  setActiveView?: (view: "chat" | "results") => void
  currentDomain: string | null
  distress: number
  mood: number
  energy: number
  chatStarted: boolean
  checkInCompleted: boolean
  reflection?: string
  copingAction?: string
  userMessageCount?: number
  conversationPhase?: "opening" | "exploration" | "coping" | "closure"
  highStress?: boolean
  subscale?: string
  dayNumber?: number
  weekNumber?: number
}

function isDomainKey(value: string | null): value is DomainKey {
  return (
    value === "Emotional" ||
    value === "Regimen" ||
    value === "Physician" ||
    value === "Interpersonal"
  )
}

function getSessionSteps(
  chatStarted: boolean,
  checkInCompleted: boolean
): SessionStep[] {
  if (checkInCompleted) {
    return [
      { label: "Daily data collected", status: "completed" },
      { label: "Stampley chat started", status: "completed" },
      { label: "Check-in saved", status: "completed" },
      { label: "Session complete", status: "completed" },
    ]
  }

  if (chatStarted) {
    return [
      { label: "Daily data collected", status: "completed" },
      { label: "Stampley chat started", status: "completed" },
      { label: "Check-in not saved yet", status: "active" },
      { label: "Complete Check-in to finish", status: "pending" },
    ]
  }

  return [
    { label: "Daily data collected", status: "completed" },
    { label: "Stampley chat started", status: "pending" },
    { label: "Check-in not saved yet", status: "pending" },
    { label: "Complete Check-in to finish", status: "pending" },
  ]
}

function derivePhaseFromUserReplies(
  userMessageCount?: number
): "opening" | "exploration" | "coping" | "closure" {
  const count = Math.max(0, userMessageCount ?? 0)
  if (count === 0) return "opening"
  if (count === 1) return "exploration"
  if (count === 2) return "coping"
  return "closure"
}

function getSupportLevel(stress: number): {
  label: "Low" | "Moderate" | "Elevated" | "High support"
  detail: string
} {
  if (stress >= 9) {
    return {
      label: "High support",
      detail: "High stress today — shorter, steadier support.",
    }
  }
  if (stress >= 7) {
    return { label: "Elevated", detail: "More support and gentle structure." }
  }
  if (stress >= 4) {
    return { label: "Moderate", detail: "Balanced reflection + small steps." }
  }
  return { label: "Low", detail: "Light reflection and encouragement." }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/[0.08] bg-white px-2 py-1 text-[10px] font-medium text-black">
      {children}
    </span>
  )
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "completed") {
    return (
      <CheckCircle2
        size={14}
        strokeWidth={1.8}
        className="shrink-0 text-black"
      />
    )
  }
  if (status === "active") {
    return (
      <CircleDot
        size={14}
        strokeWidth={1.8}
        className="shrink-0 text-black"
      />
    )
  }
  return (
    <Circle
      size={14}
      strokeWidth={1.8}
      className="shrink-0 text-black/20"
    />
  )
}

function SidebarCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={` border border-black/[0.07] bg-white p-3.5 shadow-[0_1px_4px_rgba(10,10,15,0.04)] ${className}`}
    >
      {children}
    </motion.div>
  )
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2  text-[8px] uppercase tracking-[0.18em] text-black">
      {children}
    </p>
  )
}

export function StampleySidebar({
  isOpen,
  setIsOpen,
  setActiveView,
  currentDomain,
  distress,
  mood,
  energy,
  chatStarted,
  checkInCompleted,
  reflection,
  copingAction,
  userMessageCount,
  conversationPhase,
  highStress,
  subscale,
  dayNumber,
  weekNumber,
}: StampleySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const domainFocus = isDomainKey(currentDomain)
    ? DDS_FOCUS[currentDomain]
    : null

  const sessionSteps = getSessionSteps(chatStarted, checkInCompleted)
  const resolvedPhase =
    conversationPhase ?? derivePhaseFromUserReplies(userMessageCount)
  const supportLevel = getSupportLevel(distress)
  const isHighStress = highStress ?? distress >= 9

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white backdrop-blur-[2px] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 68 : 272 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="relative z-50 flex h-full min-h-0 shrink-0 select-none flex-col overflow-hidden"
        style={{
          background: "#ffffff",
          borderRight: "1px solid rgba(10,10,5,0.07)",
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          className={`flex h-16 shrink-0 items-center px-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
          style={{ borderBottom: "1px solid rgba(10,10,5,0.05)" }}
        >
          {!isCollapsed && (
            <span className="px-1 font-[JetBrains_Mono,monospace] text-[10px] uppercase tracking-[0.22em] text-black">
              Session
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-black/[0.07] text-black transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft size={14} strokeWidth={1.5} />
            ) : (
              <PanelLeftClose size={14} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {isCollapsed ? (
          <div className="flex flex-1 flex-col items-center gap-4 px-2 py-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-black"
              title={`Stress ${distress}/10`}
            >
              <Target size={14} strokeWidth={1.5} />
            </div>
            {sessionSteps.map((step) => (
              <StepIcon key={step.label} status={step.status} />
            ))}
            {setActiveView && (
              <button
                type="button"
                onClick={() => setActiveView("results")}
                className="mt-auto flex h-9 w-9 items-center justify-center rounded-[10px] text-black"
                aria-label="View results"
              >
                <FileBarChart size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(10,10,5,0.08) transparent",
            }}
          >
               {/* DDS focus */}
               <SidebarCard className="p-4">
              <MonoLabel>DDS focus</MonoLabel>
              {domainFocus ? (
                <>
                  <p className="mb-1.5 font-[Fraunces,Georgia,serif] text-[14px] font-light text-black">
                    {domainFocus.label}
                  </p>
                  <p className="text-[12px] font-light leading-[1.65] text-black">
                    {domainFocus.description}
                  </p>
                </>
              ) : (
                <p className="text-[12px] font-light leading-[1.65] text-black/45">
                  Your focus domain will appear here once selected.
                </p>
              )}
            </SidebarCard>
            {/* What you're doing */}
            {/* <SidebarCard>
              <MonoLabel>What you&apos;re doing</MonoLabel>
              <p className="font-[Fraunces,Georgia,serif] text-[15px] font-light leading-[1.55] text-black/70">
                You&apos;re using Stampley to reflect on today&apos;s check-in
                before saving it.
              </p>
            </SidebarCard> */}

            {/* Today's status */}
            <SidebarCard className="p-4">
              <MonoLabel>Today&apos;s status</MonoLabel>
              <motion.div className="space-y-2">
                <MetricRow label="Stress" value={`${distress}/10`}  />
                <MetricRow label="Mood" value={`${mood}/10`} />
                <MetricRow label="Energy" value={`${energy}/10`} />
                <MetricRow
                  label="Focus domain"
                  value={currentDomain ?? "—"}
                  accent
                />
              </motion.div>
              {(dayNumber || weekNumber || subscale) && (
                <p className="mt-2.5 font-[JetBrains_Mono,monospace] text-[8px] uppercase tracking-[0.12em] text-black/30">
                  {weekNumber ? `Week ${weekNumber}` : ""}
                  {dayNumber ? ` · Day ${dayNumber}` : ""}
                  {subscale ? ` · ${subscale}` : ""}
                </p>
              )}
            </SidebarCard>

            {/* Today’s questions */}
            <SidebarCard className="p-4">
              <MonoLabel>Today&apos;s questions</MonoLabel>
              <div className="space-y-1.5">
                <p className="text-[12px] font-light leading-[1.65] text-black">
                  Expected:{" "}
                  <span className="font-medium text-black/70">2–4</span>{" "}
                  questions
                </p>
                <p className="text-[12px] font-light leading-[1.65] text-black">
                  High stress:{" "}
                  <span className="font-medium text-black/70">1–2</span>{" "}
                  shorter questions
                </p>
                <p className="mt-2 text-[12px] font-light text-black/50">
                  Opening → Exploration → Coping → Closure
                </p>
              </div>
            </SidebarCard>

            {/* Why Stampley asks */}
            {/* <SidebarCard>
              <MonoLabel>Why Stampley asks</MonoLabel>
              <p className="text-[12px] font-light leading-[1.65] text-black">
                Stampley uses your daily check-in to help you reflect on
                today&apos;s stress, mood, energy, and diabetes-related focus
                area. It does not replace medical care or score DDS-17 daily.
              </p>
            </SidebarCard> */}

            {/* Today’s support level */}
            {/* <SidebarCard
              className={
                isHighStress ? "border-black/15 bg-black/[0.04]" : ""
              }
            >
              <MonoLabel>Today&apos;s support level</MonoLabel>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-[Fraunces,Georgia,serif] text-[16px] font-light text-black">
                    {supportLevel.label}
                  </p>
                  <p className="mt-1 text-[12px] font-light leading-[1.55] text-black">
                    {supportLevel.detail}
                  </p>
                </div>
                <div className="shrink-0 rounded-[10px] border border-black/[0.07] bg-white px-2.5 py-2 text-center">
                  <p className="font-[JetBrains_Mono,monospace] text-[8px] uppercase tracking-[0.14em] text-black/30">
                    Stress
                  </p>
                  <p className="text-[12px] font-semibold text-black/70">
                    {distress}/10
                  </p>
                </div>
              </div>
            </SidebarCard> */}

            {/* What shapes your result */}
            {/* <SidebarCard>
              <MonoLabel>What shapes your result</MonoLabel>
              <div className="flex flex-wrap gap-1.5">
                <Chip>stress level</Chip>
                <Chip>mood</Chip>
                <Chip>energy</Chip>
                <Chip>DDS focus domain</Chip>
                <Chip>{reflection?.trim() ? "reflection" : "reflection (none)"}</Chip>
                <Chip>
                  {copingAction?.trim() ? "coping action" : "coping action (none)"}
                </Chip>
                <Chip>chat replies: {Math.max(0, userMessageCount ?? 0)}</Chip>
              </div>
            </SidebarCard> */}

            {/* Progress */}
            <SidebarCard
  className="p-4 font-['Poppins', sans-serif]"
 
>
  <MonoLabel>Progress</MonoLabel>

  <div className="space-y-2">
    <MetricRow
      label="Questions answered"
      value={`${Math.max(0, userMessageCount ?? 0)}`}
    />

    <MetricRow
      label="Current phase"
      value={resolvedPhase}
      accent
    />

    <p className="text-[12px] font-light leading-[1.65] text-black">
      Complete Check-in saves today&apos;s record.
    </p>
  </div>
</SidebarCard>
         

            {/* Session progress */}
            <SidebarCard className="p-4">
              <MonoLabel>Session progress</MonoLabel>
              <ul className="space-y-2.5">
                {sessionSteps.map((step) => (
                  <li key={step.label} className="flex items-start gap-2.5">
                    <StepIcon status={step.status} />
                    <span
                      className={`text-[12px] font-light leading-[1.5] ${
                        step.status === "active"
                          ? "font-medium text-black"
                          : step.status === "completed"
                            ? "text-black"
                            : "text-black"
                      }`}
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ul>
            </SidebarCard>

            {/* Reminder */}
            {/* <SidebarCard className="border-black/15 bg-black/[0.04]">
              <MonoLabel>Reminder</MonoLabel>
              <p className="text-[12px] font-light leading-[1.65] text-black/60">
                Your check-in is saved only after you click{" "}
                <span className="font-medium text-black">
                  Complete Check-in
                </span>
                .
              </p>
            </SidebarCard> */}

            {setActiveView && (
              <button
                type="button"
                onClick={() => setActiveView("results")}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] text-black/45 transition-all hover:border-black/20 hover:text-black"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <FileBarChart size={13} strokeWidth={1.5} />
                View results summary
              </button>
            )}
          </div>
        )}
      </motion.aside>
    </>
  )
}

function MetricRow({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[12px] text-black">{label}</span>
      <span
        className={`text-[12px] font-medium ${
          accent ? "text-black" : "text-black"
        }`}
      >
        {value}
      </span>
    </div>
  )
}
