"use client"

import { Search } from "lucide-react"
import { REGIONS, SECTEURS, STADES } from "@/lib/filters"

interface FilterBarProps {
  search: string
  onFilterChange: (key: string, value: string) => void
  region: string
  secteur: string
  stade: string
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-lg border-[1.5px] border-bg-border bg-bg-subtle px-3 text-[13px] text-text-secondary outline-none transition-colors hover:border-[#2A2A34] focus:border-accent-green min-w-[110px] appearance-none cursor-pointer"
      aria-label={label}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt === options[0] ? label : opt}
        </option>
      ))}
    </select>
  )
}

export function FilterBar({ search, onFilterChange, region, secteur, stade }: FilterBarProps) {
  return (
    <div className="border-b border-bg-border bg-bg-base px-5 py-4">
      <div className="mx-auto flex max-w-[900px] flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onFilterChange("q", e.target.value)}
            placeholder="Rechercher par nom, ville, spécialité (IA, fintech, biotech...)"
            className="h-10 w-full rounded-lg border-[1.5px] border-bg-border bg-bg-subtle pl-10 pr-4 text-[14px] text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-2">
          <SelectFilter
            label="Région"
            value={region}
            options={REGIONS}
            onChange={(v) => onFilterChange("region", v)}
          />
          <SelectFilter
            label="Secteur"
            value={secteur}
            options={SECTEURS}
            onChange={(v) => onFilterChange("secteur", v)}
          />
          <SelectFilter
            label="Stade"
            value={stade}
            options={STADES}
            onChange={(v) => onFilterChange("stade", v)}
          />
        </div>
      </div>
    </div>
  )
}
