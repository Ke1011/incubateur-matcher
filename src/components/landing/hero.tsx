import { Button } from "@/components/shared/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(34,197,94,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[640px] text-center">
        {/* Badge */}
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-accent-green/15 bg-accent-green-dim px-4 py-1.5">
          <span className="text-[12px] font-semibold text-accent-green">
            ✦ 361 incubateurs indexés dans toute la France
          </span>
        </div>

        {/* H1 */}
        <h1 className="animate-fade-in-up delay-100 mb-5 text-[34px] font-extrabold leading-[1.05] tracking-tight text-text-primary md:text-[54px]">
          Trouvez l&apos;incubateur qui vous{" "}
          <span className="text-accent-green">mérite</span>.
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-200 mb-8 text-[15px] leading-relaxed text-text-secondary md:text-[17px] max-w-[520px] mx-auto">
          Vous lancez votre startup et vous cherchez le bon incubateur ?
          Répondez à 7 questions, on vous matche avec les programmes les plus pertinents.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-300 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/quiz" size="lg">
            Faire le matching →
          </Button>
          <Button href="/annuaire" variant="ghost" size="lg">
            Explorer la base
          </Button>
        </div>
      </div>
    </section>
  )
}
