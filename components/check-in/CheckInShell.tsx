"use client"

import PageTransition from "@/components/navigation/PageTransition"
import StepDock from "@/components/navigation/StepDock"
import { CheckInSubmitProvider } from "@/components/check-in/CheckInSubmitContext"
import WeeklyDomainSync from "@/components/check-in/WeeklyDomainSync"

export default function CheckInShell({ children }: { children: React.ReactNode }) {
  return (
    <CheckInSubmitProvider>
      <WeeklyDomainSync />
      <PageTransition>{children}</PageTransition>
      <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <StepDock />
        </div>
      </div>
    </CheckInSubmitProvider>
  )
}
