"use client"

import { MapPin, Lock } from "lucide-react"
import type { Incubator } from "@/lib/types"
import { Badge } from "@/components/shared/badge"

interface IncubatorRowProps {
  incubator: Incubator
  isUnlocked: boolean
  onUnlock: () => void
  onClick: () => void
}

export function IncubatorRow({ incubator, isUnlocked, onUnlock, onClick }: IncubatorRowProps) {
  return (
    <div
      className="group rounded-[14px] border-[1.5px] border-bg-border bg-bg-elevated p-4 md:p-5 transition-all hover:border-[#2A2A34] hover:bg-[#141418] hover:-translate-y-px cursor-pointer"
      onClick={onClick}
    >
      {/* Top row: name + meta */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-sm font-bold text-text-secondary">
            {incubator.nom.charAt(0)}
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-text-primary group-hover:text-accent-green transition-colors">
              {incubator.nom}
            </h3>
            <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
              <MapPin className="h-3 w-3" />
              {incubator.ville && <span>{incubator.ville}</span>}
              {incubator.ville && incubator.region && <span>·</span>}
              {incubator.region && <span>{incubator.region}</span>}
            </div>
          </div>
        </div>
        {incubator.typeStructure && <Badge label={incubator.typeStructure} />}
      </div>

      {/* Preview info */}
      {incubator.stadeAccepte.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {incubator.stadeAccepte.slice(0, 3).map((s) => (
            <Badge key={s} label={s} color="#22C55E" />
          ))}
        </div>
      )}

      {/* Locked hint */}
      {!isUnlocked && (
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-1">
          <Lock className="h-3 w-3" />
          <span>Cliquer pour voir la fiche complète</span>
        </div>
      )}
    </div>
  )
}
