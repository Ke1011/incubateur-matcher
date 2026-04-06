"use client"

import { ExternalLink, Link2, MapPin } from "lucide-react"
import type { ScoredIncubator } from "@/lib/types"
import { Badge } from "@/components/shared/badge"
import { ScoreBadge } from "./score-badge"

interface IncubatorCardProps {
  incubator: ScoredIncubator
  rank: number
  blurred: boolean
  onUnlock?: () => void
  delay?: number
}

export function IncubatorCard({ incubator, rank, blurred, onUnlock, delay = 0 }: IncubatorCardProps) {
  return (
    <div
      className={`animate-card-enter rounded-[14px] border bg-bg-elevated p-5 md:p-6 transition-all ${
        rank === 1
          ? "border-accent-green/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          : "border-bg-border shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
      } ${blurred ? "relative overflow-hidden" : "hover:border-[#2A2A34] hover:bg-[#141418] hover:-translate-y-0.5"}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-sm font-bold text-text-secondary">
            {incubator.nom.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{incubator.nom}</h3>
            <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
              <MapPin className="h-3 w-3" />
              {incubator.ville && <span>{incubator.ville}</span>}
              {incubator.ville && incubator.region && <span>·</span>}
              {incubator.region && <span>{incubator.region}</span>}
            </div>
          </div>
        </div>
        <ScoreBadge percent={incubator.matchPercent} rank={rank} />
      </div>

      {/* Score explanation */}
      {!blurred && (
        <p className="mb-3 text-[11px] text-text-muted">
          Match basé sur{" "}
          {[
            incubator.stadeAccepte.length > 0 && "stade",
            incubator.secteur && "secteur",
            incubator.region && "localisation",
            incubator.avantages.length > 0 && "avantages",
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {incubator.typeStructure && <Badge label={incubator.typeStructure} />}
        {incubator.stadeAccepte.slice(0, 2).map((s) => (
          <Badge key={s} label={s} color="#22C55E" />
        ))}
        {incubator.equityPct === "0" && <Badge label="0% equity" color="#3B82F6" />}
      </div>

      {/* Details (blurrable) */}
      <div className={blurred ? "blur-sm opacity-50 select-none pointer-events-none" : ""}>
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-text-secondary">
          {incubator.dureeMois && <span>Durée : {incubator.dureeMois} mois</span>}
          {incubator.coutEur && <span>Coût : {incubator.coutEur}</span>}
          {incubator.equityPct && incubator.equityPct !== "0" && (
            <span>Equity : {incubator.equityPct}%</span>
          )}
        </div>

        {incubator.avantages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {incubator.avantages.map((av) => (
              <span
                key={av}
                className="rounded-full bg-bg-subtle px-2.5 py-0.5 text-[11px] font-medium text-text-secondary"
              >
                {av}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {incubator.siteWeb && (
            <a
              href={incubator.siteWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-accent-blue hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Voir le site
            </a>
          )}
          {incubator.linkedin && (
            <a
              href={incubator.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-accent-blue hover:underline"
            >
              <Link2 className="h-3 w-3" />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Blur overlay */}
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-bg-base/60 to-bg-base rounded-[14px]">
          <button
            onClick={onUnlock}
            className="flex items-center gap-2 rounded-lg border border-bg-border bg-bg-elevated/80 px-4 py-2.5 text-[13px] font-semibold text-text-primary backdrop-blur-sm transition-all hover:border-accent-green hover:text-accent-green"
          >
            🔒 Débloquer
          </button>
        </div>
      )}
    </div>
  )
}
