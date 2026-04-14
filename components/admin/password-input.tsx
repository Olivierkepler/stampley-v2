"use client"

import { useState } from "react"

export function PasswordInput() {
  const [show, setShow] = useState(false)

  return (
    <div className="flex flex-col gap-2 lg:col-span-3">
      <label
        htmlFor="password"
        className="text-sm font-medium text-slate-700"
      >
        Password
      </label>

      <div className="relative">
        <input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          required
          className="h-12 w-full rounded-[18px] border border-slate-200 bg-white/90 px-4 pr-11 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        />

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Toggle password visibility"
        >
          {show ? (
            // Eye Off
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a17.29 17.29 0 013.7-4.7M6.7 6.7A17.29 17.29 0 0112 5c5 0 9 7 9 7a17.29 17.29 0 01-4.2 5.3M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88M3 3l18 18"
              />
            </svg>
          ) : (
            // Eye
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}