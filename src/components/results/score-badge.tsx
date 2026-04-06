interface ScoreBadgeProps {
  percent: number
  rank: number
}

export function ScoreBadge({ percent, rank }: ScoreBadgeProps) {
  const color =
    percent >= 80
      ? "text-accent-green bg-accent-green-dim border-accent-green/20"
      : percent >= 60
        ? "text-accent-amber bg-[#2D1B00] border-[#78350F]"
        : "text-text-secondary bg-bg-subtle border-bg-border"

  return (
    <div className="flex items-center gap-3">
      {rank === 1 && (
        <span className="rounded-[4px] bg-accent-green px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-bg-base">
          #1 match
        </span>
      )}
      <span className={`rounded-[4px] border px-2 py-0.5 text-[13px] font-bold ${color}`}>
        {percent}%
      </span>
    </div>
  )
}
