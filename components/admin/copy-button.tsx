"use client"

import { useState } from "react"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs border rounded px-2 py-1 transition ${
        copied
          ? "text-green-600 border-green-200 bg-green-50"
          : "text-gray-500 hover:text-gray-900 border-gray-200"
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}