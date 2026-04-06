interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = ((current + 1) / total) * 100

  return (
    <div className="h-0.5 w-full bg-bg-border">
      <div
        className="h-full bg-accent-green progress-fill"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemax={total}
      />
    </div>
  )
}
