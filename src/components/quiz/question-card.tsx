"use client"

import { useState, useEffect } from "react"
import { OptionButton } from "./option-button"
import type { Question } from "@/lib/types"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  selected: string | undefined
  onSelect: (value: string) => void
  direction: "forward" | "backward"
}

export function QuestionCard({ question, questionNumber, selected, onSelect, direction }: QuestionCardProps) {
  const isMultiSelect = !!question.multiSelect
  const maxSelections = question.multiSelect || 1
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [autreText, setAutreText] = useState("")
  const [showAutreInput, setShowAutreInput] = useState(false)

  // Reset local state when question changes
  useEffect(() => {
    setMultiSelected(selected ? selected.split(",").filter(Boolean) : [])
    setAutreText("")
    setShowAutreInput(false)
  }, [question.id, selected])

  const handleSingleSelect = (value: string) => {
    if (value === "Autre") {
      setShowAutreInput(true)
    } else {
      setShowAutreInput(false)
      setAutreText("")
      onSelect(value)
    }
  }

  const handleMultiSelect = (value: string) => {
    if (value === "Autre") {
      // Toggle autre
      if (showAutreInput) {
        setShowAutreInput(false)
        setAutreText("")
      } else {
        setShowAutreInput(true)
      }
      return
    }

    setMultiSelected((prev) => {
      const isSelected = prev.includes(value)
      if (isSelected) {
        return prev.filter((v) => v !== value)
      }
      if (prev.length >= maxSelections) {
        return [...prev.slice(1), value]
      }
      return [...prev, value]
    })
  }

  const handleMultiConfirm = () => {
    const values = [...multiSelected]
    if (showAutreInput && autreText) {
      values.push(`Autre: ${autreText}`)
    }
    if (values.length > 0) {
      onSelect(values.join(","))
    }
  }

  const handleAutreConfirm = () => {
    if (autreText) {
      if (isMultiSelect) {
        handleMultiConfirm()
      } else {
        onSelect(`Autre: ${autreText}`)
      }
    }
  }

  const hasSelections = isMultiSelect
    ? multiSelected.length > 0 || (showAutreInput && autreText)
    : false

  return (
    <div
      key={question.id}
      className={direction === "forward" ? "animate-slide-right" : "animate-slide-left"}
    >
      <p className="mb-3 text-[13px] font-semibold text-accent-green">
        Question {questionNumber}
      </p>

      <h2 className="mb-2 text-2xl font-bold leading-tight text-text-primary md:text-[26px]">
        {question.question}
      </h2>

      {question.subtitle && (
        <p className="mb-6 text-sm text-text-secondary">{question.subtitle}</p>
      )}
      {!question.subtitle && <div className="mb-8" />}

      <div className="space-y-3">
        {question.options.map((opt) => (
          <OptionButton
            key={opt.value + opt.label}
            label={opt.label}
            icon={opt.icon}
            selected={
              isMultiSelect
                ? multiSelected.includes(opt.value) || (opt.value === "Autre" && showAutreInput)
                : selected === opt.value
            }
            onClick={() =>
              isMultiSelect ? handleMultiSelect(opt.value) : handleSingleSelect(opt.value)
            }
          />
        ))}
      </div>

      {showAutreInput && (
        <div className="mt-3 animate-fade-in">
          <input
            type="text"
            value={autreText}
            onChange={(e) => setAutreText(e.target.value)}
            placeholder="Précisez..."
            autoFocus
            className="h-11 w-full rounded-lg border-[1.5px] border-accent-green/30 bg-bg-subtle px-4 text-[14px] text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && autreText) handleAutreConfirm()
            }}
          />
          {!isMultiSelect && (
            <button
              onClick={handleAutreConfirm}
              disabled={!autreText}
              className="mt-2 h-10 w-full rounded-[10px] bg-accent-green text-[13px] font-bold text-bg-base transition-all hover:bg-accent-green-hover disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmer →
            </button>
          )}
        </div>
      )}

      {isMultiSelect && hasSelections && (
        <button
          onClick={handleMultiConfirm}
          className="mt-4 h-11 w-full rounded-[10px] bg-accent-green text-[14px] font-bold text-bg-base transition-all hover:bg-accent-green-hover active:scale-[0.97]"
        >
          Confirmer ({multiSelected.length + (showAutreInput && autreText ? 1 : 0)}/{maxSelections}) →
        </button>
      )}
    </div>
  )
}
