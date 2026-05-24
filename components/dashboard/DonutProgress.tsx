type DonutProgressProps = {
    percent: number
    completed: number
    total: number
    label?: string
    bgColor?: string
  }
  
  export default function DonutProgress({
    percent,
    completed,
    total,
    label = "Complete",
    bgColor = "#003e73",
  }: DonutProgressProps) {
    const safePercent = Math.min(Math.max(percent, 0), 100)
  
    return (
      <div className="flex justify-start lg:justify-end">
        <div className="relative flex h-[190px] w-[190px] items-center justify-center">
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "9999px",
              background: `conic-gradient(
                #ffffff ${safePercent}%,
                rgba(255,255,255,0.12) 0
              )`,
            }}
          />
  
          <div
            className="absolute inset-[18px]"
            style={{
              borderRadius: "9999px",
              backgroundColor: bgColor,
            }}
          />
  
          <div className="relative z-10 text-center">
            <p className="font-display text-[40px] font-light text-white">
              {Math.round(safePercent)}%
            </p>
  
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/60">
              {label}
            </p>
  
            <p className="mt-2 text-xs text-white/55">
              {completed} / {total} check-ins
            </p>
          </div>
        </div>
      </div>
    )
  }