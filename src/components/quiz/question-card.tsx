"use client"

import { OptionButton } from "./option-button"
import type { Question, UserAnswers } from "@/lib/types"

interface QuestionCardProps {
  question: Question
  selected: string | undefined
  onSelect: (value: string) => void
  direction: "forward" | "backward"
}

export function QuestionCard({ question, selected, onSelect, direction }: QuestionCardProps) {
  return (
    <div
      key={question.id}
      className={direction === "forward" ? "animate-slide-right" : "animate-slide-left"}
    >
      {/* Question number */}
      <p className="mb-3 text-[13px] font-semibold text-accent-green">
        Question {question.id === "stade" ? "1" : ""}
      </p>

      {/* Question text */}
      <h2 className="mb-2 text-2xl font-bold leading-tight text-text-primary md:text-[26px]">
        {question.question}
      </h2>

      {/* Subtitle */}
      {question.subtitle && (
        <p className="mb-6 text-sm text-text-secondary">{question.subtitle}</p>
      )}
      {!question.subtitle && <div className="mb-8" />}

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            icon={opt.icon}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
