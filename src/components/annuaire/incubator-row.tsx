"use client"

import Link from "next/link"
import { MapPin, ExternalLink, Link2, Lock } from "lucide-react"
import type { Incubator } from "@/lib/types"
import { Badge } from "@/components/shared/badge"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

interface IncubatorRowProps {
  incubator: Incubator
  isUnlocked: boolean
  onUnlock: () => void
}

export function IncubatorRow({ incubator, isUnlocked, onUnlock }: IncubatorRowProps) {
  return (
    <div className="group rounded-[14px] border-[1.5px] border-bg-border bg-bg-elevated p-4 md:p-5 transition-all hover:border-[#2A2A34] hover:bg-[#141418] hover:-translate-y-px">
      {/* Top row: name + meta */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-sm font-bold text-text-secondary">
            {incubator.nom.charAt(0)}
          </div>
          <div>
            <Link href={`/incubateur/${slugify(incubator.nom)}`} className="text-[15px] font-bold text-text-primary hover:text-accent-green transition-colors">
              {incubator.nom}
            </Link>
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

      {/* Details zone */}
      {isUnlocked ? (
        <div className="animate-blur-reveal">
          <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-text-secondary">
            {incubator.stadeAccepte.length > 0 && (
              <span>Stade : {incubator.stadeAccepte.join(", ")}</span>
            )}
            {incubator.dureeMois && <span>Durée : {incubator.dureeMois} mois</span>}
            {incubator.coutEur && <span>Coût : {incubator.coutEur}</span>}
            {incubator.equityPct && <span>Equity : {incubator.equityPct}%</span>}
          </div>

          {incubator.avantages.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {incubator.avantages.map((av) => (
                <span
                  key={av}
                  className="rounded-full bg-bg-subtle px-2 py-0.5 text-[11px] font-medium text-text-secondary"
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
                className="flex items-center gap-1 text-[12px] text-accent-blue hover:underline"
              >
                <ExternalLink className="h-3 w-3" /> Site web
              </a>
            )}
            {incubator.linkedin && (
              <a
                href={incubator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[12px] text-accent-blue hover:underline"
              >
                <Link2 className="h-3 w-3" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="blur-sm opacity-50 select-none pointer-events-none">
            <div className="mb-2 flex gap-4 text-[12px] text-text-secondary">
              <span>████████ ██████</span>
              <span>██████ ████</span>
            </div>
            <div className="flex gap-2 text-[12px] text-text-secondary">
              <span>████████████</span>
              <span>████████</span>
            </div>
          </div>
          <button
            onClick={onUnlock}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-md border border-bg-border bg-bg-elevated/80 px-3 py-1.5 text-[12px] font-semibold text-text-secondary transition-all hover:border-accent-green hover:text-accent-green"
          >
            <Lock className="h-3 w-3" /> Débloquer
          </button>
        </div>
      )}
    </div>
  )
}
