import { Button } from "./button"

export function CtaBanner() {
  return (
    <div className="rounded-[14px] border border-accent-green/20 bg-gradient-to-br from-accent-green-dim to-bg-base p-6 md:p-8">
      <p className="mb-1 text-[15px] font-semibold text-text-primary">
        Besoin d&apos;aide pour postuler ?
      </p>
      <p className="mb-4 text-[13px] leading-relaxed text-text-secondary">
        Je coache des ex-corporate dans leur transition startup. Réservez un appel
        stratégique de 30 min.
      </p>
      <Button href="https://kemil.fr/book" external>
        Réserver un appel sur kemil.fr →
      </Button>
    </div>
  )
}
