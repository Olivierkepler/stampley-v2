import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import CollapsibleSidebar from "@/components/check-in/CollapsibleSidebar"
import CheckInShell from "@/components/check-in/CheckInShell"
import { redirectIfOnboardingIncomplete } from "@/lib/check-in-flow-guard"

import Image from "next/image"

export default async function CheckInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) redirect("/login")

  await redirectIfOnboardingIncomplete()
  return (
     <main className="flex flex-col h-screen verflow-hidden bg-white">
      {/* <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-black/[0.06] bg-white px-6 backdrop-blur-sm">
     
        
      </header> */}
  
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <CollapsibleSidebar />
  
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto ">
       
            <CheckInShell>{children}</CheckInShell>
          </div>
        </main>
      </div>
    </main>
  )
}