import { redirectIfAlreadyCheckedInToday } from "@/lib/check-in-flow-guard"

export default async function StampleySupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await redirectIfAlreadyCheckedInToday()
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {children}
    </div>
  )
}
