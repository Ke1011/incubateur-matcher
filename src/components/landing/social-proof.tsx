const stats = [
  { value: "361", label: "incubateurs indexés" },
  { value: "13", label: "régions couvertes" },
  { value: "7", label: "questions de matching" },
  { value: "2 min", label: "pour vos résultats" },
]

export function SocialProof() {
  return (
    <section className="border-y border-bg-border bg-bg-base px-5 py-10">
      <div className="mx-auto grid max-w-[800px] grid-cols-2 gap-px md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center py-4">
            <span className="text-[32px] font-extrabold text-text-primary">{stat.value}</span>
            <span className="text-[12px] font-medium text-text-secondary">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
