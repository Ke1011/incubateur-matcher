const steps = [
  {
    number: "1",
    title: "Répondez à 7 questions",
    description: "Secteur, stade, type d'accompagnement, localisation...",
  },
  {
    number: "2",
    title: "Notre algo analyse +550 incubateurs",
    description: "Score de compatibilité sur 12 critères pondérés.",
  },
  {
    number: "3",
    title: "Recevez votre top 5 personnalisé",
    description: "Débloquez les contacts et candidatez directement.",
  },
]

export function HowItWorks() {
  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto max-w-[800px]">
        {/* Label */}
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-green">
          Comment ça marche
        </p>

        {/* Title */}
        <h2 className="mb-12 text-[26px] font-extrabold text-text-primary md:text-[34px]">
          3 étapes. 3 minutes.
        </h2>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-start">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-accent-green/20 bg-accent-green-dim text-[16px] font-bold text-accent-green">
                {step.number}
              </div>
              <h3 className="mb-1.5 text-[17px] font-bold text-text-primary">{step.title}</h3>
              <p className="text-[14px] leading-relaxed text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
