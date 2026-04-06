import Papa from "papaparse"
import type { Incubator } from "./types"
import { FALLBACK_DATA } from "./fallback-data"

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1fxCg9P0tjIVeJByas0YFZeRYk7ErLCy_PtXnmiBZ7Ig/gviz/tq?tqx=out:csv"

const CACHE_KEY = "incub_match_data"
const CACHE_TTL = 5 * 60 * 1000 // 5 min

interface CacheEntry {
  data: Incubator[]
  timestamp: number
}

function splitCsv(value: string): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function mapRow(row: Record<string, string>): Incubator {
  return {
    nom: row["Nom"] || "",
    alumniNotables: row["Alumni notables"] || "",
    linkedin: row["LinkedIn"] || "",
    region: row["Région"] || "",
    secteur: row["Secteur / Spécialité"] || "",
    siteWeb: row["Site Web"] || "",
    ville: row["Ville (texte)"] || "",
    stadeAccepte: splitCsv(row["Stade accepté"] || ""),
    typeStructure: row["Type de structure"] || "",
    dureeMois: row["Durée (mois)"] || "",
    coutEur: row["Coût (EUR)"] || "",
    equityPct: row["Equity (%)"] || "",
    profilFounder: splitCsv(row["Profil founder"] || ""),
    techNonTech: row["Tech / Non-tech"] || "",
    avantages: splitCsv(row["Avantages"] || ""),
    themesDetailles: row["Thèmes détaillés"] || "",
    departement: row["Département"] || "",
    adresse: row["Adresse"] || "",
    actif: row["Actif"] !== "FALSE",
    source: row["Source"] || "",
  }
}

function getCache(): CacheEntry | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() - entry.timestamp > CACHE_TTL) return null
    return entry
  } catch {
    return null
  }
}

function setCache(data: Incubator[]) {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // sessionStorage full or unavailable
  }
}

export async function fetchIncubators(): Promise<Incubator[]> {
  // Check cache
  const cached = getCache()
  if (cached) return cached.data

  try {
    const response = await fetch(SHEET_CSV_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const csvText = await response.text()

    const { data } = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
    })

    const incubators = data
      .map(mapRow)
      .filter((inc) => inc.nom && inc.actif)

    if (incubators.length === 0) throw new Error("No data")

    setCache(incubators)
    return incubators
  } catch {
    return FALLBACK_DATA
  }
}
