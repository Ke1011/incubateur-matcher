"use client"

import type { Incubator, ScoredIncubator } from "@/lib/types"
import { IncubatorCard } from "./incubator-card"
import { useGateContext } from "@/components/gate/gate-provider"

interface ResultsListProps {
  results: ScoredIncubator[]
  onCardClick: (inc: Incubator) => void
}

export function ResultsList({ results, onCardClick }: ResultsListProps) {
  const { isUnlocked, setShowGate } = useGateContext()

  return (
    <div className="space-y-4">
      {results.map((inc, i) => (
        <IncubatorCard
          key={inc.nom}
          incubator={inc}
          rank={i + 1}
          blurred={!isUnlocked && i > 0}
          onUnlock={() => setShowGate(true)}
          onClick={() => {
            if (isUnlocked || i === 0) onCardClick(inc)
            else setShowGate(true)
          }}
          delay={i * 100}
        />
      ))}
    </div>
  )
}
