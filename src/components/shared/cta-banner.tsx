import { Button } from "./button"

export function CtaBanner() {
  return (
    <div className="rounded-[14px] border border-accent-green/20 bg-gradient-to-br from-accent-green-dim to-bg-base p-6 md:p-8">
      <p className="mb-1 text-[15px] font-semibold text-text-primary">
        Vous lancez votre startup ?
      </p>
      <p className="mb-4 text-[13px] leading-relaxed text-text-secondary">
        Je coache des founders de l&apos;idée aux premiers clients en 45 jours.
        Réservez un appel stratégique gratuit.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button href="https://kemil.fr/book" external>
          Réserver un coaching →
        </Button>
        <Button href="https://wantd-waitlist.vercel.app/" external variant="ghost">
          Découvrir WANTD →
        </Button>
      </div>
    </div>
  )
}
