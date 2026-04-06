interface BadgeProps {
  label: string
  color?: string
  className?: string
}

const TYPE_STYLES: Record<string, string> = {
  Incubateur: "bg-[#052E16] text-[#4ADE80] border-[#14532D]",
  Accélérateur: "bg-[#1E1B4B] text-[#818CF8] border-[#312E81]",
  Pépinière: "bg-[#2D1B00] text-[#FCD34D] border-[#78350F]",
  SATT: "bg-[#0D2D2B] text-[#2DD4BF] border-[#115E59]",
  "Startup Studio": "bg-[#2E1065] text-[#A78BFA] border-[#4C1D95]",
  Réseau: "bg-[#2D1B00] text-[#FCD34D] border-[#78350F]",
  "Programme crédits": "bg-[#1E3A5F] text-[#60A5FA] border-[#1E40AF]",
  "CVC/Accélérateur": "bg-[#1E1B4B] text-[#818CF8] border-[#312E81]",
  "Pôle compétitivité": "bg-[#1E3A5F] text-[#60A5FA] border-[#1E40AF]",
}

export function Badge({ label, color, className = "" }: BadgeProps) {
  const style = TYPE_STYLES[label] || "bg-bg-subtle text-text-secondary border-bg-border"

  return (
    <span
      className={`inline-flex items-center rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${style} ${className}`}
      style={color ? { borderColor: `${color}33`, color, backgroundColor: `${color}15` } : undefined}
    >
      {label}
    </span>
  )
}
