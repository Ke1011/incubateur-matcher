import { Hero } from "@/components/landing/hero"
import { SocialProof } from "@/components/landing/social-proof"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/shared/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Navbar */}
      <header className="flex h-14 items-center justify-between border-b border-bg-border px-5">
        <span className="text-sm font-bold text-text-primary">
          incub<span className="text-accent-green">.</span>match
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/annuaire"
            className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            Annuaire
          </Link>
          <Button href="/quiz" className="text-[13px] h-9 px-4">
            Faire le matching →
          </Button>
        </div>
      </header>

      <Hero />
      <SocialProof />
      <HowItWorks />

      {/* Final CTA */}
      <section className="px-5 py-20 text-center">
        <div className="mx-auto max-w-[460px]">
          <h2 className="mb-6 text-[26px] font-extrabold leading-tight text-text-primary md:text-[34px]">
            Votre prochain incubateur est dans cette liste.
          </h2>
          <Button href="/quiz" size="lg" className="w-full sm:w-auto">
            Lancer le matching — 3 min →
          </Button>
          <p className="mt-4 flex items-center justify-center gap-3 text-[12px] text-text-muted">
            <span>Gratuit</span>
            <span>·</span>
            <span>Aucune CB</span>
            <span>·</span>
            <span>Résultats immédiats</span>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
