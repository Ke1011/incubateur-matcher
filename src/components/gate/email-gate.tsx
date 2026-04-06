"use client"

import { useState, useCallback } from "react"
import { Lock, Check } from "lucide-react"
import { useGateContext } from "./gate-provider"

interface EmailGateProps {
  variant?: "quiz" | "annuaire"
}

const PROFIL_OPTIONS = [
  "Ex-CDI cadre+ (conseil, finance, corporate)",
  "Étudiant / Jeune diplômé",
  "Serial entrepreneur",
  "En poste — side project",
  "Autre",
]

const STADE_OPTIONS = [
  "J'ai une idée",
  "J'ai un MVP",
  "J'ai mes premiers clients",
  "Je cherche à accélérer",
]

export function EmailGate({ variant = "quiz" }: EmailGateProps) {
  const { showGate, unlock } = useGateContext()
  const [form, setForm] = useState({
    prenom: "",
    email: "",
    profil: "",
    stade: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleBackdropClick = useCallback(() => {
    setShaking(true)
    setTimeout(() => setShaking(false), 200)
  }, [])

  const isValid = form.prenom && form.email.includes("@") && form.profil && form.stade

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
            profil: form.profil,
            stade: form.stade,
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

          {/* Profil */}
          <select
            value={form.profil}
            onChange={(e) => setForm((f) => ({ ...f, profil: e.target.value }))}
            required
            className={`h-11 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-4 text-[14px] outline-none transition-all focus:border-accent-green appearance-none cursor-pointer ${
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

          {/* Stade */}
          <select
            value={form.stade}
            onChange={(e) => setForm((f) => ({ ...f, stade: e.target.value }))}
            required
            className={`h-11 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-4 text-[14px] outline-none transition-all focus:border-accent-green appearance-none cursor-pointer ${
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
