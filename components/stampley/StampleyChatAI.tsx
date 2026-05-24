"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence } from "framer-motion"
import { Wind, BookOpen, Copy, Check } from "lucide-react"

export type StampleyResponse = {
  greeting: string
  validation: string
  reflection_question: string
  micro_skill: string
  education_chip: string
  closure: string
}

type Props = {
  response: StampleyResponse
  reflectionReply?: string
}

export default function StampleyChatAI({ response, reflectionReply }: Props) {
  const [expandedCard, setExpandedCard] = useState<"skill" | "edu" | null>(
    "skill"
  )
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${response.greeting}\n\n${response.validation}\n\n${response.reflection_question}`
    )

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="flex w-full gap-3.5 bg">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-black/[0.08] bg-white shadow-[0_1px_3px_rgba(10,10,15,0.06)]">
      <Image
  src="/images/stampleyLogo.png"
  alt="Stampley"
  width={0}
  height={0}
  sizes="100vw"
  className="h-5 w-auto object-contain"
/>
      </div>

      <div className="min-w-0 flex-1 space-y-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-[JetBrains_Mono,monospace] text-[11px] uppercase tracking-[0.14em] text-black/50">
              Stampley
            </span>
          </div>

          <div className="space-y-3 text-[16px] font-light leading-[1.7] text-[#0a0a0f] md:text-[17px]">
            <p>{response.greeting}</p>
            <p className="text-black/60">{response.validation}</p>
            <p className="font-normal text-[#0a0a0f]/85">
              {response.reflection_question}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* <div className="flex items-center gap-1.5">
            <ChipButton
              active={expandedCard === "skill"}
              onClick={() =>
                setExpandedCard(expandedCard === "skill" ? null : "skill")
              }
              icon={<Wind size={12} strokeWidth={2} />}
              label="Skill"
            />

            <ChipButton
              active={expandedCard === "edu"}
              onClick={() =>
                setExpandedCard(expandedCard === "edu" ? null : "edu")
              }
              icon={<BookOpen size={12} strokeWidth={2} />}
              label="Insight"
            />

            <div className="flex-1" />

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-transparent p-1.5 text-black/30 transition-all hover:border-black/[0.08] hover:text-black/55"
              aria-label="Copy response"
            >
              {copied ? (
                <Check size={13} strokeWidth={2} className="text-emerald-600" />
              ) : (
                <Copy size={13} strokeWidth={1.5} />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {expandedCard === "skill" && (
              <ExpandableCard
                key="skill"
                icon={<Wind size={14} strokeWidth={1.8} />}
                title="Try this skill"
                value={response.micro_skill}
              />
            )}

            {expandedCard === "edu" && (
              <ExpandableCard
                key="edu"
                icon={<BookOpen size={14} strokeWidth={1.8} />}
                title="Did you know?"
                value={response.education_chip}
              />
            )}
          </AnimatePresence> */}
        </div>

        {reflectionReply && (
          <div className="rounded-[14px] border border-black/[0.07] bg-white p-4 shadow-[0_1px_4px_rgba(10,10,15,0.04)]">
            <p className="mb-2 font-[JetBrains_Mono,monospace] text-[8.5px] uppercase tracking-[0.16em] text-black/35">
              Saved private reflection
            </p>
            <p className="text-[14px] font-light leading-[1.7] text-black/60">
              {reflectionReply}
            </p>
          </div>
        )}

        <div className="rounded-[14px] border border-[#3d5a80]/15 bg-white p-4">
          <p className="text-[14px] font-light leading-[1.75] text-[#0a0a0f]/70">
            {response.closure}
          </p>
        </div>
      </div>
    </section>
  )
}