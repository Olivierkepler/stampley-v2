import Navbar from "@/components/home/Navbar"
import HeroSection from "@/components/home/HeroSection"
import WhatIsSection from "@/components/home/WhatIsSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import MeetStampleySection from "@/components/home/MeetStampleySection"
import StudyDetailsSection from "@/components/home/StudyDetailsSection"
import ResearchTeamSection from "@/components/home/ResearchTeamSection"
import Footer from "@/components/home/Footer"

export default function HomePage() {
  return (
    <main
      style={{
        background: "linear-gradient(180deg, #fefdfb 0%, #f5f2ec 100%)",
        fontFamily: "'Outfit', system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,200;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');
      `}</style>
    
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <MeetStampleySection />
      <StudyDetailsSection />
      <ResearchTeamSection />
      <Footer />
    </main>
  )
}