"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts"

type TrendPoint = {
  date: string
  distress: number
  mood: number
  energy: number
}

type DomainPoint = {
  domain: string
  count: number
}

export default function ParticipantCharts({
  trendData,
  domainData,
}: {
  trendData: TrendPoint[]
  domainData: DomainPoint[]
}) {
  const hasTrendData = trendData.length > 0
  const hasDomainData = domainData.length > 0

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="dashboard-card p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Distress Trend</p>
            <h2 className="mt-3 text-lg font-semibold text-black/85">
              Daily distress over time
            </h2>
          </div>

          <p className="text-xs text-black/45">Scale: 0–10</p>
        </div>

        <div className="mt-6 h-[240px] sm:h-[280px]">
          {hasTrendData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="distress"
                  name="Distress"
                  stroke="#003e73"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No distress data yet." />
          )}
        </div>
      </div>

      <div className="dashboard-card p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Mood & Energy</p>
            <h2 className="mt-3 text-lg font-semibold text-black/85">
              Daily mood and energy
            </h2>
          </div>

          <p className="text-xs text-black/45">Scale: 0–10</p>
        </div>

        <div className="mt-6 h-[240px] sm:h-[280px]">
          {hasTrendData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={28} />
                <Line
                  type="monotone"
                  dataKey="mood"
                  name="Mood"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  name="Energy"
                  stroke="#ca8a04"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No mood or energy data yet." />
          )}
        </div>
      </div>

      <div className="dashboard-card p-6 sm:p-8 lg:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Focus Domain History</p>
            <h2 className="mt-3 text-lg font-semibold text-black/85">
              Focus areas recorded during check-ins
            </h2>
          </div>

          <p className="text-xs text-black/45">Total check-ins by domain</p>
        </div>

        <div className="mt-6 h-[260px] sm:h-[300px]">
          {hasDomainData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="domain" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Check-ins" fill="#003e73" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No focus domain data yet." />
          )}
        </div>
      </div>
    </section>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center border border-dashed border-black/10 bg-black/[0.015]">
      <p className="text-sm text-black/45">{message}</p>
    </div>
  )
}