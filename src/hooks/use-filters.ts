"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export interface FilterState {
  search: string
  region: string
  secteur: string
  stade: string
}

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearchRaw] = useState(searchParams.get("q") || "")
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  const region = searchParams.get("region") || "Toutes"
  const secteur = searchParams.get("secteur") || "Tous"
  const stade = searchParams.get("stade") || "Tous"

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (key === "q") {
        if (value) params.set("q", value)
        else params.delete("q")
        setSearchRaw(value)
      } else {
        const defaultValues: Record<string, string> = {
          region: "Toutes",
          secteur: "Tous",
          stade: "Tous",
        }
        if (value === defaultValues[key]) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      const qs = params.toString()
      router.replace(qs ? `?${qs}` : "?", { scroll: false })
    },
    [searchParams, router]
  )

  const resetFilters = useCallback(() => {
    setSearchRaw("")
    setDebouncedSearch("")
    router.replace("?", { scroll: false })
  }, [router])

  const filters: FilterState = useMemo(
    () => ({
      search: debouncedSearch,
      region,
      secteur,
      stade,
    }),
    [debouncedSearch, region, secteur, stade]
  )

  return {
    filters,
    search,
    setFilter,
    resetFilters,
  }
}
