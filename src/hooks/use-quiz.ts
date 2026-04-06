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

  const answer = useCallback(
    (key: keyof UserAnswers, value: string) => {
      setState((prev) => {
        const newAnswers = { ...prev.answers, [key]: value }
        const isLast = prev.currentStep === questions.length - 1

        if (isLast) {
          // Save to sessionStorage
          sessionStorage.setItem("quiz_answers", JSON.stringify(newAnswers))
          return { ...prev, answers: newAnswers, isComplete: true }
        }

        // Auto-advance after brief delay
        return { ...prev, answers: newAnswers }
      })

      // Auto-advance (non-last question)
      if (state.currentStep < questions.length - 1) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            direction: "forward",
            currentStep: prev.currentStep + 1,
          }))
        }, 120)
      }
    },
    [state.currentStep]
  )

  const goBack = useCallback(() => {
    if (state.currentStep > 0) {
      setState((prev) => ({
        ...prev,
        direction: "backward",
        currentStep: prev.currentStep - 1,
      }))
    }
  }, [state.currentStep])

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
