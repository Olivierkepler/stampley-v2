export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { query } from "@/lib/db"
import OpenAI from "openai"
import { buildStampleyPrompt } from "@/lib/stampley-prompt"
import type { Domain } from "@/store/checkin-store"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      distress, mood, energy,
      contextTags, reflection, copingAction,
      domain, subscale, dayNumber, weekNumber,
    } = body

    // Get participant first name from email
    const userResult = await query(
      "SELECT email FROM users WHERE id = $1",
      [session.user.id]
    )
    const email = userResult.rows[0]?.email ?? ""
    const firstName = email.split("@")[0].split(".")[0]
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

    // Build prompt
    const prompt = buildStampleyPrompt({
      firstName: formattedName,
      distress,
      mood,
      energy,
      domain: domain as Domain,
      subscale,
      reflection,
      copingAction,
      contextTags,
      dayNumber,
      weekNumber,
    })

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    })

    const raw = completion.choices[0]?.message?.content ?? ""

    // Parse JSON response
    let stampleyResponse
    try {
      stampleyResponse = JSON.parse(raw)
    } catch {
      console.error("[stampley] JSON parse failed:", raw)
      // Return fallback
      stampleyResponse = getFallbackResponse(formattedName, domain as Domain)
    }

    return NextResponse.json({ success: true, response: stampleyResponse })

  } catch (error) {
    console.error("[stampley/generate]", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}

function getFallbackResponse(name: string, domain: Domain) {
  const domainMessages: Record<Domain, string> = {
    Emotional: "managing the emotional weight of diabetes takes real courage. You showed up today and that matters.",
    Regimen: "keeping up with your diabetes routine is genuinely hard work. Every effort counts, even the small ones.",
    Physician: "navigating your healthcare can feel overwhelming sometimes. Your concerns are always valid.",
    Interpersonal: "feeling unsupported can make everything harder. Reaching out — even small steps — makes a difference.",
  }

  return {
    greeting: `Hi ${name}, thank you for checking in today. This space is just for you — no judgment, no pressure.`,
    validation: `I can see today had its challenges. What you're feeling makes complete sense given everything you're managing.`,
    reflection_question: `What's one thing from today you'd like to leave behind as you move into tomorrow?`,
    micro_skill: `Try taking one slow, deep breath right now — in for 4 counts, hold for 4, out for 4. You can do this anytime things feel heavy.`,
    education_chip: `Living with diabetes means ${domainMessages[domain]}`,
    closure: `You've already done something meaningful today by checking in. For tomorrow, try giving yourself one small moment of kindness. I'll be here when you're ready. 💙`,
  }
}