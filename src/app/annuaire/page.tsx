"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useGateContext } from "@/components/gate/gate-provider"
import { DynamicHeader } from "@/components/annuaire/dynamic-header"
import { TabNav } from "@/components/annuaire/tab-nav"
import { FilterBar } from "@/components/annuaire/filter-bar"
import { IncubatorRow } from "@/components/annuaire/incubator-row"
import { EmailGate } from "@/components/gate/email-gate"
import { CtaBanner } from "@/components/shared/cta-banner"
import { fetchIncubators } from "@/lib/fetch-incubators"
import { filterIncubators, type FilterParams } from "@/lib/filters"
import { categories } from "@/lib/categories"
import type { Incubator } from "@/lib/types"
import { useFilters } from "@/hooks/use-filters"
import Link from "next/link"
import { ArrowLeft, SearchX } from "lucide-react"

function AnnuaireContent() {
  const [incubators, setIncubators] = useState<Incubator[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tous")
  const { isUnlocked, setShowGate } = useGateContext()
  const { filters, search, setFilter, resetFilters } = useFilters()

  useEffect(() => {
    fetchIncubators().then((data) => {
      setIncubators(data)
      setLoading(false)
    })
  }, [])

  // Trigger gate on scroll
  useEffect(() => {
    if (isUnlocked) return

    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrollPercent > 0.4) {
        setShowGate(true)
        window.removeEventListener("scroll", handleScroll)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isUnlocked, setShowGate])

  const activeCategory = categories.find((c) => c.id === activeTab) || categories[0]

  const filtered = useMemo(() => {
    const params: FilterParams = {
      search: filters.search,
      region: filters.region,
      secteur: filters.secteur,
      stade: filters.stade,
    }

    // Apply category filter
    if (activeCategory.filterKey) {
      params.categoryFilter = {
        key: activeCategory.filterKey,
        values: activeCategory.filterValues,
      }
    }

    return filterIncubators(incubators, params)
  }, [incubators, filters, activeCategory])

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Navbar */}
      <header className="flex h-14 items-center justify-between border-b border-bg-border px-5">
        <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-bold text-text-primary">
            incub<span className="text-accent-green">.</span>match
          </span>
        </Link>
        <Link
          href="/quiz"
          className="rounded-lg bg-accent-green px-4 py-2 text-[13px] font-bold text-bg-base transition-all hover:bg-accent-green-hover"
        >
          Faire le matching →
        </Link>
      </header>

      {/* Dynamic header */}
      <DynamicHeader category={activeCategory} />

      {/* Tabs */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <FilterBar
        search={search}
        onFilterChange={setFilter}
        region={filters.region}
        secteur={filters.secteur}
        stade={filters.stade}
      />

      {/* Results counter */}
      <div className="px-5 py-3">
        <div className="mx-auto max-w-[900px]">
          <p className="text-[12px] text-text-muted">
            <span className="font-semibold text-text-secondary">{filtered.length}</span> incubateurs
            {loading && " · Chargement..."}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="px-5 pb-12">
        <div className="mx-auto max-w-[900px] space-y-3">
          {filtered.length === 0 && !loading ? (
            <div className="flex flex-col items-center py-16 text-center">
              <SearchX className="mb-4 h-12 w-12 text-text-muted" />
              <p className="mb-2 text-base font-semibold text-text-primary">
                Aucun résultat pour cette combinaison
              </p>
              <p className="mb-4 text-sm text-text-secondary">
                Essayez d&apos;élargir vos filtres.
              </p>
              <button
                onClick={resetFilters}
                className="rounded-lg border border-bg-border px-4 py-2 text-[13px] font-semibold text-text-secondary hover:border-accent-green hover:text-accent-green transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filtered.map((inc) => (
              <IncubatorRow
                key={inc.nom}
                incubator={inc}
                isUnlocked={isUnlocked}
                onUnlock={() => setShowGate(true)}
              />
            ))
          )}

          {/* CTA at bottom */}
          {filtered.length > 0 && isUnlocked && (
            <div className="pt-8">
              <CtaBanner />
            </div>
          )}
        </div>
      </div>

      <EmailGate variant="annuaire" />
    </div>
  )
}

export default function AnnuairePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-base" />}>
      <AnnuaireContent />
    </Suspense>
  )
}
