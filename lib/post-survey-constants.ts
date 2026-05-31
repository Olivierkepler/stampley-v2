/** Shared question copy for post-study survey (does not modify onboarding DDS). */

export const POST_DDS_QUESTIONS = [
  { id: "q1", text: "Feeling that diabetes is taking up too much of my mental and physical energy every day." },
  { id: "q2", text: "Feeling that my doctor doesn't know enough about diabetes and diabetes care." },
  { id: "q3", text: "Feeling angry, scared, and/or depressed when I think about living with diabetes." },
  { id: "q4", text: "Feeling that my doctor doesn't give me clear enough directions on how to manage my diabetes." },
  { id: "q5", text: "Feeling that I am not testing my blood sugars frequently enough." },
  { id: "q6", text: "Feeling that I am often failing with my diabetes routine." },
  { id: "q7", text: "Feeling that friends or family are not supportive enough of my self-care efforts." },
  { id: "q8", text: "Feeling that diabetes controls my life." },
  { id: "q9", text: "Feeling that my doctor doesn't take my concerns seriously enough." },
  { id: "q10", text: "Not feeling confident in my day-to-day ability to manage diabetes." },
  { id: "q11", text: "Feeling that I will end up with serious long-term complications, no matter what I do." },
  { id: "q12", text: "Feeling that I am not sticking closely enough to a good meal plan." },
  { id: "q13", text: "Feeling that friends or family don't appreciate how difficult living with diabetes can be." },
  { id: "q14", text: "Feeling overwhelmed by the demands of living with diabetes." },
  { id: "q15", text: "Feeling that I don't have a doctor who I can see regularly enough about my diabetes." },
  { id: "q16", text: "Not feeling motivated to keep up my diabetes self-management." },
  { id: "q17", text: "Feeling that friends or family don't give me the emotional support that I would like." },
] as const

export const POST_DDS_SCALE = [
  { value: 1, label: "Not a Problem" },
  { value: 2, label: "Slight Problem" },
  { value: 3, label: "Moderate Problem" },
  { value: 4, label: "Somewhat Serious Problem" },
  { value: 5, label: "Serious Problem" },
  { value: 6, label: "Very Serious Problem" },
] as const

export const POST_PHQ_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could notice, or the opposite — being so fidgety or restless that you move around more than usual",
  "Thoughts that you would be better off dead or hurting yourself in some way",
] as const

export const POST_PHQ_SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
] as const

export const POST_SUS_QUESTIONS = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
] as const

export const POST_STAMPLEY_QUESTIONS = [
  "Stampley helped me reflect on my diabetes-related feelings during check-ins.",
  "Stampley felt easy to use during my daily check-ins.",
  "Conversations with Stampley felt supportive and respectful.",
  "Stampley helped me feel less alone with my diabetes experience.",
  "I would recommend Stampley to others managing type 2 diabetes.",
] as const

export const POST_LIKERT_5_SCALE = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
] as const
