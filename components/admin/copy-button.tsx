"use client"

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded px-2 py-1 transition"
    >
      Copy
    </button>
  )
}