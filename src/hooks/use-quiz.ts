"use client"

import { useState, useCallback, useEffect } from "react"
import type { UserAnswers } from "@/lib/types"
import { questions } from "@/lib/questions"

interface QuizState {
  currentStep: number
  answers: Partial<UserAnswers>
  direction: "forward" | "backward"
  isComplete: boolean
}

// Map gate stade options to quiz scoring values
const GATE_STADE_MAP: Record<string, string> = {
  "Je cherche une idée": "Idéation",
  "💡 J'ai une idée (ou plusieurs) mais j'ai rien fait concrètement": "Idéation",
  "🔍 J'ai commencé à parler à ma cible (faire du discovery)": "Pré-seed",
  "✅ J'ai validé mon discovery, mais pas encore de MVP": "Pré-seed",
  "🛠️ Je suis en train de construire mon MVP": "Seed",
  "🚀 J'ai un MVP, je cherche mes premiers clients": "Seed",
  "💰 J'ai déjà des clients / du revenu": "Growth",
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    answers: {},
    direction: "forward",
    isComplete: false,
  })

  // Check if gate already provided stade → pre-fill and skip Q1
  useEffect(() => {
    const gateStade = localStorage.getItem("incub_match_gate_stade")
    if (gateStade) {
      const mappedValue = GATE_STADE_MAP[gateStade]
      if (mappedValue) {
        setState((prev) => ({
          ...prev,
          currentStep: 1, // skip Q1
          answers: { ...prev.answers, stade: mappedValue },
        }))
      }
    }
  }, [])

  const answer = useCallback((key: keyof UserAnswers, value: string) => {
    setState((prev) => {
      const newAnswers = { ...prev.answers, [key]: value }
      const isLast = prev.currentStep === questions.length - 1

      if (isLast) {
        sessionStorage.setItem("quiz_answers", JSON.stringify(newAnswers))
        return { ...prev, answers: newAnswers, isComplete: true }
      }

      setTimeout(() => {
        setState((s) => ({
          ...s,
          direction: "forward",
          currentStep: s.currentStep + 1,
        }))
      }, 120)

      return { ...prev, answers: newAnswers }
    })
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => {
      // Don't go back to Q1 if it was pre-filled from gate
      const gateStade = localStorage.getItem("incub_match_gate_stade")
      const minStep = gateStade && GATE_STADE_MAP[gateStade] ? 1 : 0
      if (prev.currentStep <= minStep) return prev
      return {
        ...prev,
        direction: "backward",
        currentStep: prev.currentStep - 1,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      answers: {},
      direction: "forward",
      isComplete: false,
    })
    sessionStorage.removeItem("quiz_answers")
  }, [])

  return {
    currentStep: state.currentStep,
    totalSteps: questions.length,
    answers: state.answers,
    direction: state.direction,
    isComplete: state.isComplete,
    currentQuestion: questions[state.currentStep],
    answer,
    goBack,
    reset,
  }
}
