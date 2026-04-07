"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useQuiz } from "@/hooks/use-quiz"
import { useGateContext } from "@/components/gate/gate-provider"
import { QuizShell } from "@/components/quiz/quiz-shell"
import { QuestionCard } from "@/components/quiz/question-card"
import { ResultsList } from "@/components/results/results-list"
import { IncubatorModal } from "@/components/shared/incubator-modal"
import { EmailGate } from "@/components/gate/email-gate"
import { CtaBanner } from "@/components/shared/cta-banner"
import { Button } from "@/components/shared/button"
import { fetchIncubators } from "@/lib/fetch-incubators"
import { rankIncubators } from "@/lib/scoring"
import type { Incubator, ScoredIncubator, UserAnswers } from "@/lib/types"

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
  const [selectedIncubator, setSelectedIncubator] = useState<Incubator | null>(null)
  const [quizDataSent, setQuizDataSent] = useState(false)

  // Show results first (card 1 visible, 2-5 blurred), then trigger gate after 2s
  useEffect(() => {
    if (!isUnlocked) {
      const timer = setTimeout(() => setShowGate(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [isUnlocked, setShowGate])

  // Send quiz answers to lead sheet once unlocked
  useEffect(() => {
    if (isUnlocked && !quizDataSent) {
      const answers = sessionStorage.getItem("quiz_answers")
      if (answers) {
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: "",
            email: localStorage.getItem("incub_match_email") || "",
            linkedin: "",
            profil: "",
            stade: "",
            source: "quiz_answers",
            quizAnswers: answers,
          }),
        }).catch(() => {})
        setQuizDataSent(true)
      }
    }
  }, [isUnlocked, quizDataSent])

  // Persist results to localStorage
  useEffect(() => {
    localStorage.setItem("incub_match_results", JSON.stringify(results.map((r) => r.nom)))
  }, [results])

  const handleCardClick = useCallback((inc: Incubator) => {
    setSelectedIncubator(inc)
  }, [])

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Navbar */}
      <header className="flex h-14 items-center justify-between border-b border-bg-border px-5">
        <Link href="/" className="text-sm font-bold text-text-primary">
          incub<span className="text-accent-green">.</span>match
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/annuaire" className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
            Explorer l&apos;annuaire
          </Link>
          <a
            href="https://kemil.fr/book"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            Me faire accompagner
          </a>
        </div>
      </header>

      <div className="px-5 py-12">
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
        <ResultsList results={results} onCardClick={handleCardClick} />

        {/* Actions */}
        {isUnlocked && (
          <div className="mt-8 flex flex-col gap-4 animate-fade-in-up delay-500">
            {/* Link to annuaire */}
            <div className="flex flex-wrap gap-3">
              <Button href="/annuaire" variant="ghost">
                Explorer l&apos;annuaire complet →
              </Button>
              <Button href="/quiz" variant="ghost" onClick={() => {
                sessionStorage.removeItem("quiz_answers")
                localStorage.removeItem("incub_match_results")
              }}>
                Refaire le matching
              </Button>
            </div>

            {/* CTA Banner */}
            <div className="mt-4">
              <CtaBanner />
            </div>
          </div>
        )}
      </div>
      </div>

      <IncubatorModal
        incubator={selectedIncubator}
        onClose={() => setSelectedIncubator(null)}
      />
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
        questionNumber={quiz.currentStep + 1}
        selected={quiz.answers[quiz.currentQuestion.id]}
        onSelect={(value) => quiz.answer(quiz.currentQuestion.id, value)}
        direction={quiz.direction}
      />
    </QuizShell>
  )
}
