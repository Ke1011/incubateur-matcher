"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Link2, MapPin, Clock, Euro, Percent, Users, Cpu, Gift, Building } from "lucide-react"
import { fetchIncubators } from "@/lib/fetch-incubators"
import { useGateContext } from "@/components/gate/gate-provider"
import { EmailGate } from "@/components/gate/email-gate"
import { Badge } from "@/components/shared/badge"
import { Button } from "@/components/shared/button"
import { CtaBanner } from "@/components/shared/cta-banner"
import type { Incubator } from "@/lib/types"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3 border-b border-bg-border last:border-0">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-text-muted" />
      <div>
        <p className="text-[12px] font-medium text-text-muted uppercase tracking-wider">{label}</p>
        <p className="text-[14px] text-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function IncubateurPage() {
  const params = useParams()
  const slug = params.slug as string
  const [incubator, setIncubator] = useState<Incubator | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { isUnlocked, setShowGate } = useGateContext()

  useEffect(() => {
    fetchIncubators().then((data) => {
      const found = data.find((inc) => slugify(inc.nom) === slug)
      if (found) {
        setIncubator(found)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-bg-border border-t-accent-green animate-spin-slow" />
      </div>
    )
  }

  if (notFound || !incubator) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Incubateur non trouvé</h1>
        <p className="text-sm text-text-secondary mb-6">Cet incubateur n&apos;existe pas dans notre base.</p>
        <Button href="/annuaire">← Retour à l&apos;annuaire</Button>
      </div>
    )
  }

  const hasDetails = incubator.dureeMois || incubator.coutEur || incubator.equityPct || incubator.avantages.length > 0 || incubator.siteWeb

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Navbar */}
      <header className="flex h-14 items-center justify-between border-b border-bg-border px-5">
        <Link href="/annuaire" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-bold text-text-primary">
            incub<span className="text-accent-green">.</span>match
          </span>
        </Link>
        <Button href="/quiz" className="text-[13px] h-9 px-4">
          Faire le matching →
        </Button>
      </header>

      <main className="mx-auto max-w-[700px] px-5 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-bg-elevated border border-bg-border text-xl font-bold text-text-secondary">
              {incubator.nom.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] md:text-[28px] font-extrabold text-text-primary leading-tight mb-1">
                {incubator.nom}
              </h1>
              <div className="flex items-center gap-2 text-[13px] text-text-secondary flex-wrap">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {incubator.ville && <span>{incubator.ville}</span>}
                {incubator.ville && incubator.region && <span>·</span>}
                {incubator.region && <span>{incubator.region}</span>}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {incubator.typeStructure && <Badge label={incubator.typeStructure} />}
            {incubator.stadeAccepte.map((s) => (
              <Badge key={s} label={s} color="#22C55E" />
            ))}
            {incubator.secteur && incubator.secteur !== "Généraliste" && (
              <Badge label={incubator.secteur} color="#3B82F6" />
            )}
          </div>

          {/* Description */}
          {incubator.alumniNotables && (
            <p className="text-[15px] leading-relaxed text-text-secondary">
              {incubator.alumniNotables}
            </p>
          )}
        </div>

        {/* Details section — gated */}
        {isUnlocked ? (
          <div className="animate-blur-reveal">
            {/* Programme details */}
            <div className="rounded-[14px] border border-bg-border bg-bg-elevated p-5 md:p-6 mb-6">
              <h2 className="text-[15px] font-bold text-text-primary mb-1">Détails du programme</h2>
              <p className="text-[12px] text-text-muted mb-4">Informations collectées et vérifiées</p>

              <DetailRow icon={Building} label="Type" value={incubator.typeStructure} />
              <DetailRow icon={Clock} label="Durée" value={incubator.dureeMois ? `${incubator.dureeMois} mois` : ""} />
              <DetailRow icon={Euro} label="Coût" value={incubator.coutEur === "0" ? "Gratuit" : incubator.coutEur} />
              <DetailRow icon={Percent} label="Equity" value={incubator.equityPct === "0" ? "Aucune prise de participation" : incubator.equityPct ? `${incubator.equityPct}%` : ""} />
              <DetailRow icon={Users} label="Profil accepté" value={incubator.profilFounder.join(", ")} />
              <DetailRow icon={Cpu} label="Tech / Non-tech" value={incubator.techNonTech} />
              <DetailRow
                icon={Gift}
                label="Avantages"
                value={incubator.avantages.join(", ")}
              />
            </div>

            {/* Stade & secteur */}
            {(incubator.stadeAccepte.length > 0 || incubator.secteur) && (
              <div className="rounded-[14px] border border-bg-border bg-bg-elevated p-5 md:p-6 mb-6">
                <h2 className="text-[15px] font-bold text-text-primary mb-4">Critères d&apos;admission</h2>
                {incubator.stadeAccepte.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[12px] font-medium text-text-muted uppercase tracking-wider mb-2">Stade accepté</p>
                    <div className="flex flex-wrap gap-1.5">
                      {incubator.stadeAccepte.map((s) => (
                        <Badge key={s} label={s} color="#22C55E" />
                      ))}
                    </div>
                  </div>
                )}
                {incubator.secteur && (
                  <div>
                    <p className="text-[12px] font-medium text-text-muted uppercase tracking-wider mb-2">Secteur</p>
                    <p className="text-[14px] text-text-primary">{incubator.secteur}</p>
                    {incubator.themesDetailles && (
                      <p className="text-[12px] text-text-secondary mt-1">{incubator.themesDetailles}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 mb-8">
              {incubator.siteWeb && (
                <Button href={incubator.siteWeb} external variant="primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visiter le site
                </Button>
              )}
              {incubator.linkedin && (
                <Button href={incubator.linkedin} external variant="ghost">
                  <Link2 className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              )}
            </div>

            {/* CTA Banner */}
            <CtaBanner />
          </div>
        ) : (
          /* Locked state */
          <div className="relative">
            <div className="blur-md opacity-40 select-none pointer-events-none">
              <div className="rounded-[14px] border border-bg-border bg-bg-elevated p-5 mb-6">
                <h2 className="text-[15px] font-bold text-text-primary mb-4">Détails du programme</h2>
                <div className="space-y-3">
                  <div className="h-4 bg-bg-subtle rounded w-3/4" />
                  <div className="h-4 bg-bg-subtle rounded w-1/2" />
                  <div className="h-4 bg-bg-subtle rounded w-2/3" />
                  <div className="h-4 bg-bg-subtle rounded w-1/2" />
                  <div className="h-4 bg-bg-subtle rounded w-3/4" />
                </div>
              </div>
              <div className="rounded-[14px] border border-bg-border bg-bg-elevated p-5 mb-6">
                <h2 className="text-[15px] font-bold text-text-primary mb-4">Critères d&apos;admission</h2>
                <div className="space-y-3">
                  <div className="h-4 bg-bg-subtle rounded w-1/2" />
                  <div className="h-4 bg-bg-subtle rounded w-2/3" />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setShowGate(true)}
                className="flex items-center gap-2 rounded-[14px] border border-accent-green/30 bg-bg-elevated/95 px-6 py-4 text-[15px] font-bold text-text-primary backdrop-blur-sm shadow-lg transition-all hover:border-accent-green hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
              >
                🔒 Débloquer la fiche complète
              </button>
            </div>
          </div>
        )}

        {/* Back to annuaire */}
        <div className="mt-8 pt-6 border-t border-bg-border">
          <Link href="/annuaire" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">
            ← Retour à l&apos;annuaire
          </Link>
        </div>
      </main>

      <EmailGate variant="annuaire" />
    </div>
  )
}
