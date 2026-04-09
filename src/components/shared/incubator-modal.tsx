"use client"

import { useEffect } from "react"
import { X, ExternalLink, Link2, MapPin, Clock, Euro, Percent, Users, Cpu, Gift, Building } from "lucide-react"
import type { Incubator } from "@/lib/types"
import { Badge } from "@/components/shared/badge"
import { Button } from "@/components/shared/button"
import { useGateContext } from "@/components/gate/gate-provider"

interface IncubatorModalProps {
  incubator: Incubator | null
  onClose: () => void
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-bg-border last:border-0">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-text-muted" />
      <div>
        <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{label}</p>
        <p className="text-[13px] text-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export function IncubatorModal({ incubator, onClose }: IncubatorModalProps) {
  const { isUnlocked, setShowGate } = useGateContext()

  // Lock body scroll
  useEffect(() => {
    if (incubator) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [incubator])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  if (!incubator) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-[560px] max-h-[85vh] overflow-y-auto rounded-t-[20px] sm:rounded-[20px] border border-bg-border bg-bg-elevated shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-bg-border bg-bg-elevated/95 backdrop-blur-sm p-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bg-subtle text-lg font-bold text-text-secondary">
              {incubator.nom.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-[17px] font-extrabold text-text-primary leading-tight truncate">
                {incubator.nom}
              </h2>
              <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                <MapPin className="h-3 w-3 shrink-0" />
                {incubator.ville && <span>{incubator.ville}</span>}
                {incubator.ville && incubator.region && <span>·</span>}
                {incubator.region && <span>{incubator.region}</span>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {incubator.typeStructure && <Badge label={incubator.typeStructure} />}
            {incubator.stadeAccepte.map((s) => (
              <Badge key={s} label={s} color="#22C55E" />
            ))}
            {incubator.secteur && incubator.secteur !== "Généraliste" && (
              <Badge label={incubator.secteur} color="#3B82F6" />
            )}
            {incubator.themesDetailles && incubator.themesDetailles.split(",").map((t) => t.trim()).filter(Boolean).map((theme) => (
              <Badge key={theme} label={theme} color="#8B5CF6" />
            ))}
          </div>

          {/* Description */}
          {incubator.alumniNotables && (
            <p className="text-[13px] leading-relaxed text-text-secondary mb-5">
              {incubator.alumniNotables}
            </p>
          )}

          {/* Details — gated */}
          {isUnlocked ? (
            <>
              {/* Programme */}
              <div className="rounded-lg border border-bg-border bg-bg-base p-4 mb-4">
                <h3 className="text-[13px] font-bold text-text-primary mb-2">Programme</h3>
                <DetailRow icon={Building} label="Type" value={incubator.typeStructure} />
                <DetailRow icon={Clock} label="Durée" value={incubator.dureeMois ? `${incubator.dureeMois} mois` : ""} />
                <DetailRow icon={Euro} label="Coût" value={incubator.coutEur === "0" ? "Gratuit" : incubator.coutEur} />
                <DetailRow icon={Percent} label="Equity" value={incubator.equityPct === "0" ? "Aucune prise de participation" : incubator.equityPct ? `${incubator.equityPct}%` : ""} />
                <DetailRow icon={Users} label="Profil" value={incubator.profilFounder.join(", ")} />
                <DetailRow icon={Cpu} label="Tech" value={incubator.techNonTech} />
                <DetailRow icon={Gift} label="Avantages" value={incubator.avantages.join(", ")} />
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-2 mb-5">
                {incubator.siteWeb && (
                  <Button href={incubator.siteWeb} external className="text-[13px] h-10">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Site web
                  </Button>
                )}
                {incubator.linkedin && (
                  <Button href={incubator.linkedin} external variant="ghost" className="text-[13px] h-10">
                    <Link2 className="h-3.5 w-3.5 mr-1.5" />
                    LinkedIn
                  </Button>
                )}
              </div>

              {/* CTA */}
              <div className="rounded-lg border border-accent-green/15 bg-accent-green-dim/50 p-4">
                <p className="text-[13px] font-semibold text-text-primary mb-1">
                  Vous lancez votre startup ?
                </p>
                <p className="text-[12px] text-text-secondary mb-3">
                  Je coache des founders de l&apos;idée aux premiers clients en 45 jours.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button href="https://kemil.fr/book" external className="text-[12px] h-9 px-4">
                    Réserver un coaching →
                  </Button>
                  <Button href="https://wantd-waitlist.vercel.app/" external variant="ghost" className="text-[12px] h-9 px-4">
                    Découvrir WANTD →
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Locked state */
            <div className="relative py-4">
              <div className="blur-md opacity-30 select-none pointer-events-none space-y-3">
                <div className="h-4 bg-bg-subtle rounded w-3/4" />
                <div className="h-4 bg-bg-subtle rounded w-1/2" />
                <div className="h-4 bg-bg-subtle rounded w-2/3" />
                <div className="h-4 bg-bg-subtle rounded w-1/2" />
                <div className="h-4 bg-bg-subtle rounded w-3/4" />
                <div className="h-4 bg-bg-subtle rounded w-1/3" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setShowGate(true)}
                  className="flex items-center gap-2 rounded-[10px] border border-accent-green/30 bg-bg-elevated px-5 py-3 text-[14px] font-bold text-text-primary shadow-lg transition-all hover:border-accent-green hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                >
                  🔒 Débloquer la fiche complète
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
