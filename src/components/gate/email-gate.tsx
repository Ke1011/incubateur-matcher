"use client"

import { useState, useCallback, useEffect } from "react"
import { Lock, Check, ChevronDown } from "lucide-react"
import { useGateContext } from "./gate-provider"

interface EmailGateProps {
  variant?: "quiz" | "annuaire"
}

const PROFIL_OPTIONS = [
  "Salarié.e, je réfléchis à lancer ma startup",
  "Ex-CDI, j'ai quitté mon job pour lancer ma startup",
  "Étudiant / Jeune diplômé",
  "Serial Entrepreneur",
  "VC / Investisseur",
  "Autre (préciser)",
]

const STADE_OPTIONS = [
  "Je cherche une idée",
  "💡 J'ai une idée (ou plusieurs) mais j'ai rien fait concrètement",
  "🔍 J'ai commencé à parler à ma cible (faire du discovery)",
  "✅ J'ai validé mon discovery, mais pas encore de MVP",
  "🛠️ Je suis en train de construire mon MVP",
  "🚀 J'ai un MVP, je cherche mes premiers clients",
  "💰 J'ai déjà des clients / du revenu",
  "Autre (préciser)",
]

export function EmailGate({ variant = "quiz" }: EmailGateProps) {
  const { showGate, unlock } = useGateContext()
  const [form, setForm] = useState({
    prenom: "",
    email: "",
    linkedin: "",
    profil: "",
    profilAutre: "",
    stade: "",
    stadeAutre: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [shaking, setShaking] = useState(false)

  // Lock body scroll when gate is open (fix iOS Safari scroll-behind)
  useEffect(() => {
    if (showGate) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [showGate])

  const handleBackdropClick = useCallback(() => {
    setShaking(true)
    setTimeout(() => setShaking(false), 200)
  }, [])

  const profilComplete = form.profil && (form.profil !== "Autre (préciser)" || form.profilAutre)
  const stadeComplete = form.stade && (form.stade !== "Autre (préciser)" || form.stadeAutre)
  const isValid = form.prenom && form.email.includes("@") && profilComplete && stadeComplete

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!isValid) return

      setIsLoading(true)

      // Send lead data to API
      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: form.prenom,
            email: form.email,
            linkedin: form.linkedin,
            profil: form.profil === "Autre (préciser)" ? `Autre: ${form.profilAutre}` : form.profil,
            stade: form.stade === "Autre (préciser)" ? `Autre: ${form.stadeAutre}` : form.stade,
            source: variant,
          }),
        })
      } catch {
        // Silent fail — don't block the user
      }

      unlock(form.email)
      setIsLoading(false)
    },
    [form, isValid, unlock]
  )

  if (!showGate) return null

  const title =
    variant === "quiz"
      ? "Débloquez vos résultats complets"
      : "Débloque tous les incubateurs !"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className={`w-full max-w-[440px] rounded-[20px] border border-bg-border bg-bg-elevated p-8 md:p-10 shadow-2xl my-8 ${
          shaking ? "animate-shake" : "animate-scale-in"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lock icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-green-dim">
            <Lock className="h-5 w-5 text-accent-green" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-[20px] font-extrabold leading-tight text-text-primary">
          {title}
        </h2>

        {/* Checklist */}
        <div className="mb-5 space-y-2">
          {[
            "Fiches incubateurs détaillées",
            "Sites web + LinkedIn directs",
            "Conditions d'admission et contacts",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-accent-green" />
              <span className="text-[12px] text-accent-green">{item}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Prénom */}
          <input
            type="text"
            value={form.prenom}
            onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
            placeholder="Prénom"
            required
            className="h-11 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-4 text-[14px] text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
          />

          {/* Email */}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email professionnel"
            required
            className="h-11 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-4 text-[14px] text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
          />

          {/* LinkedIn (optionnel) */}
          <input
            type="url"
            value={form.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
            placeholder="LinkedIn (optionnel)"
            className="h-11 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-4 text-[14px] text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
          />

          {/* Profil */}
          <div className="relative">
            <select
              value={form.profil}
              onChange={(e) => setForm((f) => ({ ...f, profil: e.target.value }))}
              required
              className={`h-11 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-4 pr-10 text-[14px] outline-none transition-all focus:border-accent-green appearance-none cursor-pointer ${
                form.profil ? "text-text-primary" : "text-text-muted"
              }`}
            >
              <option value="" disabled>
                Votre profil
              </option>
              {PROFIL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>

          {/* Profil — champ texte si "Autre" */}
          {form.profil === "Autre (préciser)" && (
            <input
              type="text"
              value={form.profilAutre}
              onChange={(e) => setForm((f) => ({ ...f, profilAutre: e.target.value }))}
              placeholder="Précisez votre profil..."
              required
              className="h-11 w-full rounded-lg border-[1.5px] border-accent-green/30 bg-bg-subtle px-4 text-[14px] text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)] animate-fade-in"
            />
          )}

          {/* Stade */}
          <div className="relative">
            <select
              value={form.stade}
              onChange={(e) => setForm((f) => ({ ...f, stade: e.target.value }))}
              required
              className={`h-11 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-4 pr-10 text-[14px] outline-none transition-all focus:border-accent-green appearance-none cursor-pointer ${
                form.stade ? "text-text-primary" : "text-text-muted"
              }`}
            >
              <option value="" disabled>
                Stade de votre projet
              </option>
              {STADE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>

          {/* Stade — champ texte si "Autre" */}
          {form.stade === "Autre (préciser)" && (
            <input
              type="text"
              value={form.stadeAutre}
              onChange={(e) => setForm((f) => ({ ...f, stadeAutre: e.target.value }))}
              placeholder="Précisez votre stade..."
              required
              className="h-11 w-full rounded-lg border-[1.5px] border-accent-green/30 bg-bg-subtle px-4 text-[14px] text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)] animate-fade-in"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="flex h-12 w-full items-center justify-center rounded-[10px] bg-accent-green text-[14px] font-bold text-bg-base shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all hover:bg-accent-green-hover hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 mt-1"
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-bg-base border-t-transparent animate-spin-slow" />
            ) : (
              "Accéder gratuitement →"
            )}
          </button>
        </form>

        {/* Reassurance */}
        <p className="mt-3 text-center text-[11px] text-text-muted">
          🔒 Vos données restent confidentielles · Zéro spam
        </p>
      </div>
    </div>
  )
}
