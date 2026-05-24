import { redirectIfAlreadyCheckedInToday } from "@/lib/check-in-flow-guard"

export default async function ContextualFactorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await redirectIfAlreadyCheckedInToday()
  return children
}
