"use client"

import { useState } from "react"

interface Notification {
  id: string
  type: "alert" | "info" | "success"
  title: string
  message: string
  time: string
  read: boolean
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "High distress alert",
    message: "Participant reported distress ≥ 9 for 2 days",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "New participant registered",
    message: "test@gmail.com joined the study",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Study key used",
    message: "AIDES-TEST01 was claimed",
    time: "3 hours ago",
    read: true,
  },
]

const typeColor = {
  alert: "bg-red-500",
  info: "bg-blue-500",
  success: "bg-green-500",
}

export function Notifications() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 transition"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-900 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-gray-100 shadow-lg z-50">
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-400">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${
                      !n.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColor[n.type]}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? "font-medium text-gray-900" : "text-gray-700"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button className="text-xs text-gray-500 hover:text-gray-700 w-full text-center">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}