// import {
//     ClipboardCheck,
//     MessageCircleHeart,
//     Sparkles,
//     CalendarCheck,
//   } from "lucide-react"
  
//   const steps = [
//     {
//       icon: ClipboardCheck,
//       number: "01",
//       title: "Sign up for the study",
//       text: "Complete a quick volunteer application to see if AIDES-T2D is a good fit for you.",
//     },
//     {
//       icon: CalendarCheck,
//       number: "02",
//       title: "Check in daily",
//       text: "For 28 days, spend about 5 minutes sharing how you feel, your mood, energy, and diabetes-related stress.",
//     },
//     {
//       icon: MessageCircleHeart,
//       number: "03",
//       title: "Receive support from Stampley",
//       text: "Stampley responds with compassionate guidance, encouragement, and a small skill tailored to your needs.",
//     },
//     {
//       icon: Sparkles,
//       number: "04",
//       title: "Reflect and grow",
//       text: "Your daily reflections help explore how AI-driven support may reduce diabetes distress over time.",
//     },
//   ]
  
//   const flowSteps = ["Register", "Baseline", "Check-ins", "Stampley"]
  
//   export default function HowItWorksSection() {
//     return (
//       <section className="relative overflow-hidden bg-white px-6 py-20 md:px-12 lg:px-24">
//         <div className="mx-auto max-w-7xl">
//           {/* Header */}
//           <div className="mb-14 max-w-2xl">
//             <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-blue-900/70">
//               How It Works
//             </p>
  
//             <h2 className="text-4xl font-light tracking-tight text-slate-950 md:text-5xl">
//               Simple daily support, built around you.
//             </h2>
  
//             <p className="mt-5 text-lg leading-relaxed text-slate-600">
//               AIDES-T2D is designed to fit into your day with short check-ins,
//               personalized emotional support, and gentle reflection.
//             </p>
//           </div>
  
//           {/* Cards */}
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
//             {steps.map(({ icon: Icon, number, title, text }) => (
//               <div
//                 key={title}
//                 className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.1)]"
//               >
//                 <div className="mb-8 flex items-start justify-between">
//                   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900 text-white">
//                     <Icon size={24} strokeWidth={1.8} />
//                   </div>
  
//                   <span className="text-sm font-semibold tracking-[0.2em] text-slate-300">
//                     {number}
//                   </span>
//                 </div>
  
//                 <h3 className="mb-4 text-xl font-semibold tracking-tight text-slate-950">
//                   {title}
//                 </h3>
  
//                 <p className="text-sm leading-relaxed text-slate-600">
//                   {text}
//                 </p>
  
//                 <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-blue-900/30 to-transparent" />
//               </div>
//             ))}
//           </div>
  
//           {/* Process Flow */}
//           <div className="mt-16 overflow-hidden rounded-[40px] border border-blue-100 bg-gradient-to-r from-slate-50 via-white to-cyan-50 px-8 py-10 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
//             <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
//               {flowSteps.map((step, index) => (
//                 <div
//                   key={step}
//                   className="flex items-center gap-5 md:gap-8"
//                 >
//                   <div className="rounded-full border border-blue-200 bg-white px-8 py-5 shadow-[0_6px_20px_rgba(37,99,235,0.08)]">
//                     <span className="text-lg font-semibold tracking-[0.18em] text-blue-900">
//                       {step}
//                     </span>
//                   </div>
  
//                   {index !== flowSteps.length - 1 && (
//                     <span className="text-4xl font-extralight text-blue-300">
//                       →
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     )
//   }