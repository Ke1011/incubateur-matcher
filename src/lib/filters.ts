import type { Incubator } from "./types"

export interface FilterParams {
  search: string
  region: string
  secteur: string
  stade: string
  categoryFilter?: {
    key: string
    values: string[]
  }
}

export function filterIncubators(
  incubators: Incubator[],
  params: FilterParams
): Incubator[] {
  return incubators.filter((inc) => {
    // Search (nom + ville, case-insensitive)
    if (params.search) {
      const q = params.search.toLowerCase()
      const haystack = `${inc.nom} ${inc.ville} ${inc.alumniNotables}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }

    // Region
    if (params.region && params.region !== "Toutes") {
      if (inc.region !== params.region && inc.region !== "Partout en France") return false
    }

    // Secteur
    if (params.secteur && params.secteur !== "Tous") {
      if (inc.secteur !== params.secteur) return false
    }

    // Stade
    if (params.stade && params.stade !== "Tous") {
      if (!inc.stadeAccepte.includes(params.stade)) return false
    }

    // Category tab filter
    if (params.categoryFilter && params.categoryFilter.key) {
      const { key, values } = params.categoryFilter
      const field = inc[key as keyof Incubator]
      if (typeof field === "string") {
        if (!values.some((v) => field.includes(v))) return false
      }
    }

    return true
  })
}

export const REGIONS = [
  "Toutes",
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Provence-Alpes-Côte d'Azur",
  "Hauts-de-France",
  "Pays de la Loire",
  "Bretagne",
  "Grand Est",
  "Normandie",
  "Centre-Val de Loire",
  "Bourgogne-Franche-Comté",
  "Partout en France",
]

export const SECTEURS = [
  "Tous",
  "Généraliste",
  "Numérique/Tech",
  "DeepTech",
  "HealthTech",
  "GreenTech",
  "Impact Social",
  "FoodTech",
  "Industrie",
  "Finance/AssurTech",
  "Luxe/Mode",
  "Féminin",
  "Spatial",
]

export const STADES = [
  "Tous",
  "Idéation",
  "Pré-seed",
  "Seed",
  "Growth",
]
