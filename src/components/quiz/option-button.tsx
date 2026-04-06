"use client"

interface OptionButtonProps {
  label: string
  icon?: string
  selected: boolean
  onClick: () => void
}

export function OptionButton({ label, icon, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[10px] border-[1.5px] px-5 py-4 text-left text-[15px] font-medium transition-all duration-150 cursor-pointer min-h-[56px] ${
        selected
          ? "border-accent-green bg-accent-green/5 text-text-primary scale-[0.98]"
          : "border-bg-border bg-bg-elevated text-text-secondary hover:border-[#2A2A34] hover:text-text-primary hover:bg-bg-hover hover:-translate-y-px"
      }`}
    >
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <span className="flex-1">{label}</span>
      <div
        className={`h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] transition-colors ${
          selected
            ? "border-accent-green bg-accent-green"
            : "border-bg-border"
        }`}
      >
        {selected && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        )}
      </div>
    </button>
  )
}
