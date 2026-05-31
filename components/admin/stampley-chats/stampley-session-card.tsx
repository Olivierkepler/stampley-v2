"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

export type StampleyAssistantData = {
  greeting?: string
  validation?: string
  reflection_question?: string
  micro_skill?: string
  education_chip?: string
  closure?: string
}

export type StampleyChatMessage = {
  id?: string
  role: "user" | "assistant"
  content?: string
  timestamp?: string
  data?: StampleyAssistantData
}

export type AdminStampleySession = {
  id: string
  userId: string
  email: string
  checkInDate: string | null
  domain: string | null
  stressLevel: number | null
  mood: number | null
  energy: number | null
  userMessageCount: number
  assistantMessageCount: number
  summary: string | null
  createdAt: string
  messages: StampleyChatMessage[]
}

function formatDate(value: string | null): string {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString()
}

function formatDateTime(value: string | null): string {
  if (!value) return "—"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString()
}

function formatTimestamp(value: string | undefined): string | null {
  if (!value?.trim()) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

const ASSISTANT_FIELDS: Array<{
  key: keyof StampleyAssistantData
  label: string
}> = [
  { key: "greeting", label: "Greeting" },
  { key: "validation", label: "Validation" },
  { key: "reflection_question", label: "Reflection question" },
  { key: "micro_skill", label: "Micro skill" },
  { key: "education_chip", label: "Education chip" },
  { key: "closure", label: "Closure" },
]

function AssistantMessageBody({ data }: { data?: StampleyAssistantData }) {
  if (!data) {
    return (
      <p className="text-sm leading-6 text-slate-600">
        No structured assistant content stored.
      </p>
    )
  }

  const fields = ASSISTANT_FIELDS.filter((f) => {
    const value = data[f.key]
    return typeof value === "string" && value.trim().length > 0
  })

  if (fields.length === 0) {
    return (
      <p className="text-sm leading-6 text-slate-600">
        No structured assistant content stored.
      </p>
    )
  }

  return (
    <dl className="space-y-3">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </dt>
          <dd className="mt-1 text-sm leading-6 text-slate-800">
            {data[key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function TranscriptView({ messages }: { messages: StampleyChatMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="text-sm text-slate-500">Transcript not available.</p>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        const ts = formatTimestamp(msg.timestamp)
        const isUser = msg.role === "user"

        return (
          <div
            key={msg.id ?? `${msg.role}-${index}`}
            className={`border px-4 py-3 ${
              isUser
                ? "border-slate-200 bg-slate-50"
                : "border-blue-100 bg-blue-50/40"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                {isUser ? "Participant" : "Stampley"}
              </p>
              {ts ? (
                <p className="text-xs text-slate-500">{ts}</p>
              ) : null}
            </div>

            <div className="mt-2">
              {isUser ? (
                <p className="text-sm leading-6 text-slate-800 whitespace-pre-wrap">
                  {msg.content?.trim() || "—"}
                </p>
              ) : (
                <AssistantMessageBody data={msg.data} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function StampleySessionCard({ session }: { session: AdminStampleySession }) {
  const [expanded, setExpanded] = useState(false)
  const highStress =
    session.stressLevel != null && Number(session.stressLevel) >= 9

  return (
    <article className="border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/admin/users/${session.userId}`}
                className="text-sm font-semibold text-slate-900 underline-offset-2 hover:underline"
              >
                {session.email}
              </Link>
              {highStress ? (
                <span className="border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700">
                  High stress
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Saved {formatDateTime(session.createdAt)}
              {session.checkInDate
                ? ` · Check-in ${formatDate(session.checkInDate)}`
                : null}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="border border-slate-200 bg-white px-2 py-1 font-medium text-slate-700">
              {session.domain ?? "No domain"}
            </span>
            <span className="border border-slate-200 bg-white px-2 py-1 text-slate-600">
              Stress {session.stressLevel ?? "—"}
            </span>
            <span className="border border-slate-200 bg-white px-2 py-1 text-slate-600">
              Mood {session.mood ?? "—"}
            </span>
            <span className="border border-slate-200 bg-white px-2 py-1 text-slate-600">
              Energy {session.energy ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Participant messages
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {session.userMessageCount}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Stampley turns
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {session.assistantMessageCount}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Summary
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {session.summary?.trim() || "No summary stored."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex cursor-pointer items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" aria-hidden />
              Hide transcript
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" aria-hidden />
              View transcript
            </>
          )}
        </button>

        {expanded ? (
          <div className="border-t border-slate-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Chat transcript
            </p>
            <TranscriptView messages={session.messages} />
          </div>
        ) : null}
      </div>
    </article>
  )
}
