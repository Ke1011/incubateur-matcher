"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProgressBar } from "@/components/shared/progress-bar"

interface QuizShellProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  onBack: () => void
  canGoBack: boolean
}

export function QuizShell({ children, currentStep, totalSteps, onBack, canGoBack }: QuizShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-bg-border px-5">
        <div className="flex items-center gap-3">
          {canGoBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/" className="text-sm font-bold text-text-primary">
              incub<span className="text-accent-green">.</span>match
            </Link>
          )}
        </div>
        <span className="text-[13px] text-text-secondary">
          Question {currentStep + 1}/{totalSteps}
        </span>
      </header>

      {/* Progress */}
      <ProgressBar current={currentStep} total={totalSteps} />

      {/* Content */}
      <main className="flex flex-1 items-start justify-center px-5 pt-12 pb-20 md:pt-20">
        <div className="w-full max-w-[560px]">{children}</div>
      </main>
    </div>
  )
}
