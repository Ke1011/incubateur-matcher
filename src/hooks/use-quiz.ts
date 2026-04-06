"use client"

import { useState, useCallback } from "react"
import type { UserAnswers } from "@/lib/types"
import { questions } from "@/lib/questions"

interface QuizState {
  currentStep: number
  answers: Partial<UserAnswers>
  direction: "forward" | "backward"
  isComplete: boolean
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    answers: {},
    direction: "forward",
    isComplete: false,
  })

  const answer = useCallback((key: keyof UserAnswers, value: string) => {
    setState((prev) => {
      const newAnswers = { ...prev.answers, [key]: value }
      const isLast = prev.currentStep === questions.length - 1

      if (isLast) {
        sessionStorage.setItem("quiz_answers", JSON.stringify(newAnswers))
        return { ...prev, answers: newAnswers, isComplete: true }
      }

      // Auto-advance after brief delay (scheduled inside setState to avoid stale closure)
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
      if (prev.currentStep <= 0) return prev
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
