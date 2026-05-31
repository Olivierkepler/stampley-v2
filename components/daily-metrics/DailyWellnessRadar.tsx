"use client"

import { useSyncExternalStore, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts"
import {
  computeWellnessPercent,
  hasAllDailyMetrics,
  stressWellnessScore,
} from "@/lib/wellness-score"

const CHART_WIDTH = 240
const CHART_HEIGHT = 160

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { metric: string; value: number } }>
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="z-50 rounded-xl border border-slate-200 bg-white p-2.5 shadow-md">
        <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {payload[0].payload.metric}
        </p>
        <p className="text-[14px] font-bold text-[#1a73e8]">
          Score:{" "}
          <span className="text-slate-900">{payload[0].payload.value}</span>
          <span className="ml-1 text-[11px] font-normal text-slate-400">
            / 10
          </span>
        </p>
      </div>
    )
  }
  return null
}

export interface DailyWellnessRadarProps {
  affect: {
    mood: number | undefined
    energy: number | undefined
    distress: number | undefined
  }
}

function getInsightText(
  mood: number,
  energy: number,
  distress: number
): string {
  if (distress >= 7 && mood <= 4) {
    return "High stress and lower mood indicate a tough day. Please be kind to yourself."
  }
  if (distress >= 7) {
    return "You're carrying a lot of stress right now. Remember to lean on your coping tools."
  }
  if (energy <= 3 && mood <= 4) {
    return "Your energy and mood are running low. Make sure to prioritize rest and recovery."
  }
  if (energy <= 3) {
    return "You're feeling physically drained today. Take things one step at a time."
  }
  if (mood >= 7 && energy >= 7) {
    return "High energy and a positive mood! You're in a great spot today."
  }
  if (mood >= 6 && distress <= 4) {
    return "Manageable stress and a solid mood. You're navigating today well!"
  }
  return "Your daily metrics are currently balanced and steady."
}

function useIsClientReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function DailyWellnessRadar({ affect }: DailyWellnessRadarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const mounted = useIsClientReady()

  const { mood, energy, distress } = affect
  const metricsComplete = hasAllDailyMetrics(distress, mood, energy)
  const wellness = computeWellnessPercent(distress, mood, energy)
  const showChart = mounted && metricsComplete

  const radarData = [
    { metric: "Mood", value: mood as number, fullMark: 10 },
    { metric: "Energy", value: energy as number, fullMark: 10 },
    {
      metric: "Low Stress",
      value: stressWellnessScore(distress as number),
      fullMark: 10,
    },
  ]

  const insightText = metricsComplete
    ? getInsightText(mood as number, energy as number, distress as number)
    : "Complete all three sliders to see your wellness snapshot."

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full cursor-default flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Wellness {wellness}%
      </p>

      <div className="-mt-2 flex h-[160px] min-h-[160px] w-full items-center justify-center">
        {showChart ? (
          <RadarChart
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            cx={CHART_WIDTH / 2}
            cy={CHART_HEIGHT / 2}
            outerRadius="65%"
            data={radarData}
          >
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
              tickSize={12}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Metrics"
              dataKey="value"
              stroke="#1a73e8"
              strokeWidth={2}
              fill="#1a73e8"
              fillOpacity={0.15}
              activeDot={{
                r: 4,
                fill: "#1a73e8",
                stroke: "white",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </RadarChart>
        ) : (
          <div className="flex h-full w-full max-w-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 text-center opacity-60">
            <p className="text-[11px] font-medium leading-relaxed text-slate-500">
              Complete all three sliders to see your wellness snapshot.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="insight-text"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-1 max-w-[240px] px-2 pb-2 text-center text-[12.5px] font-medium leading-relaxed text-slate-500">
              {insightText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
