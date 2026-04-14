export type DDSAnswers = {
    q1: number; q2: number; q3: number; q4: number;
    q5: number; q6: number; q7: number; q8: number;
    q9: number; q10: number; q11: number; q12: number;
    q13: number; q14: number; q15: number; q16: number;
    q17: number;
  }
  
  export type DDSScores = {
    emotional: number
    physician: number
    regimen: number
    interpersonal: number
    total: number
    recommendedDomain: string
  }
  
  export function calculateDDSScores(answers: DDSAnswers): DDSScores {
    const emotional = parseFloat(
      ((answers.q1 + answers.q3 + answers.q8 + answers.q11 + answers.q14) / 5).toFixed(2)
    )
    const physician = parseFloat(
      ((answers.q2 + answers.q4 + answers.q9 + answers.q15) / 4).toFixed(2)
    )
    const regimen = parseFloat(
      ((answers.q5 + answers.q6 + answers.q10 + answers.q12 + answers.q16) / 5).toFixed(2)
    )
    const interpersonal = parseFloat(
      ((answers.q7 + answers.q13 + answers.q17) / 3).toFixed(2)
    )
    const total = parseFloat(
      ((answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5 +
        answers.q6 + answers.q7 + answers.q8 + answers.q9 + answers.q10 +
        answers.q11 + answers.q12 + answers.q13 + answers.q14 + answers.q15 +
        answers.q16 + answers.q17) / 17).toFixed(2)
    )
  
    const scores = [
      { domain: "Emotional", score: emotional },
      { domain: "Regimen", score: regimen },
      { domain: "Physician", score: physician },
      { domain: "Interpersonal", score: interpersonal },
    ]
  
    scores.sort((a, b) => b.score - a.score)
    const recommendedDomain = scores[0].domain
  
    return { emotional, physician, regimen, interpersonal, total, recommendedDomain }
  }