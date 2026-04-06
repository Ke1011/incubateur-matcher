"use client"

import { useState, useEffect } from "react"
import { useQuiz } from "@/hooks/use-quiz"
import { useGateContext } from "@/components/gate/gate-provider"
import { QuizShell } from "@/components/quiz/quiz-shell"
import { QuestionCard } from "@/components/quiz/question-card"
import { ResultsList } from "@/components/results/results-list"
import { EmailGate } from "@/components/gate/email-gate"
import { CtaBanner } from "@/components/shared/cta-banner"
import { fetchIncubators } from "@/lib/fetch-incubators"
import { rankIncubators } from "@/lib/scoring"
import type { ScoredIncubator, UserAnswers } from "@/lib/types"

function LoadingAnimation() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-base px-5">
      <div className="mb-6 h-16 w-16 rounded-full border-[3px] border-bg-border border-t-accent-green animate-spin-slow" />
      <p className="text-sm text-text-secondary animate-fade-in">
        Analyse de 361 incubateurs...
      </p>
    </div>
  )
}

function ResultsView({ results }: { results: ScoredIncubator[] }) {
  const { isUnlocked, setShowGate } = useGateContext()

  // Gate is mandatory before showing results
  useEffect(() => {
    if (!isUnlocked) {
      setShowGate(true)
    }
  }, [isUnlocked, setShowGate])

  // Don't show results until unlocked
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center px-5">
        <div className="text-center animate-fade-in-up">
          <h1 className="mb-2 text-2xl font-extrabold text-text-primary">
            Vos résultats sont prêts !
          </h1>
          <p className="text-[13px] text-text-secondary">
            Remplissez le formulaire pour accéder à votre top 5 personnalisé.
          </p>
        </div>
        <EmailGate variant="quiz" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base px-5 py-12">
      <div className="mx-auto max-w-[640px]">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="mb-2 text-2xl font-extrabold text-text-primary md:text-[28px]">
            Votre top 5 incubateurs
          </h1>
          <p className="text-[13px] text-text-secondary">
            Basé sur vos réponses et notre scoring propriétaire
          </p>
        </div>

        {/* Results */}
        <ResultsList results={results} />

        {/* CTA Banner */}
        {isUnlocked && (
          <div className="mt-10 animate-fade-in-up delay-500">
            <CtaBanner />
          </div>
        )}
      </div>

      <EmailGate variant="quiz" />
    </div>
  )
}

export default function QuizPage() {
  const quiz = useQuiz()
  const [results, setResults] = useState<ScoredIncubator[] | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (quiz.isComplete && !results) {
      setIsCalculating(true)

      const calculate = async () => {
        const incubators = await fetchIncubators()
        const answers = quiz.answers as UserAnswers
        const ranked = rankIncubators(incubators, answers)

        // Show loading for at least 1.5s
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setResults(ranked)
        setIsCalculating(false)
      }

      calculate()
    }
  }, [quiz.isComplete, quiz.answers, results])

  // Calculating state
  if (isCalculating) return <LoadingAnimation />

  // Results state
  if (results) return <ResultsView results={results} />

  // Quiz state
  return (
    <QuizShell
      currentStep={quiz.currentStep}
      totalSteps={quiz.totalSteps}
      onBack={quiz.goBack}
      canGoBack={quiz.currentStep > 0}
    >
      <QuestionCard
        question={quiz.currentQuestion}
        selected={quiz.answers[quiz.currentQuestion.id]}
        onSelect={(value) => quiz.answer(quiz.currentQuestion.id, value)}
        direction={quiz.direction}
      />
    </QuizShell>
  )
}
