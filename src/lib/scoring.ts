import type { Incubator, ScoredIncubator, UserAnswers } from "./types"

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some((kw) => lower.includes(kw.toLowerCase()))
}

// ─── KEYWORD MAPS ───

const SECTOR_KEYWORDS: Record<string, string[]> = {
  Tech: ["Tech", "SaaS", "Numérique", "Digital", "IA", "Logiciel", "Data"],
  DeepTech: ["DeepTech", "Deep Tech", "Quantique", "Spatial", "Hardware", "Cyber"],
  Santé: ["Santé", "HealthTech", "Biotech", "Medtech", "Pharma", "e-santé", "Soins"],
  Fintech: ["Fintech", "Finance", "AssurTech", "Banque", "Assurance", "Crypto"],
  Impact: ["Impact", "ESS", "Solidarité", "Social", "GreenTech", "CleanTech", "Environnement", "Durabilité"],
  FoodTech: ["FoodTech", "AgriTech", "Agriculture", "Alimentaire", "Nutrition"],
  Industrie: ["Industrie", "Mobilité", "Défense", "Aéronautique", "Spatial", "Automobile"],
  Luxe: ["Luxe", "Mode", "Beauté", "Cosmétique", "Fashion"],
  Autre: [],
}

const BLOCAGE_KEYWORDS: Record<string, string[]> = {
  Validation: ["Mentorat", "Réseau", "Coaching", "Accompagnement"],
  Build: ["Bureau", "Crédits cloud", "Tech", "Espace"],
  Clients: ["Réseau", "Mentorat", "Financement"],
  Financement: ["Financement", "Subvention", "Bourse", "Prêt"],
  Aucun: [],
  Inconnu: [],
}

const PRIORITE_KEYWORDS: Record<string, string[]> = {
  Réseau: ["Réseau", "Networking"],
  Mentorat: ["Mentorat", "Coaching", "Accompagnement"],
  Financement: ["Financement", "Subvention", "Bourse", "Prêt"],
  Bureau: ["Bureau", "Coworking", "Hébergement", "Espace"],
}

// ─── STEP 1: FILTERS (binary, eliminatory) ───

function passesFilters(inc: Incubator, answers: UserAnswers): boolean {
  // Stade filter — ELIMINATORY
  if (inc.stadeAccepte.length > 0) {
    if (!inc.stadeAccepte.some((s) => s === answers.stade)) {
      return false
    }
  }
  // No data = passes (benefit of the doubt, but penalized in scoring)

  // Localisation filter — semi-eliminatory
  if (answers.localisation !== "Flexible" && answers.localisation !== "Autre") {
    if (inc.region && inc.region !== "Partout en France" && inc.region !== answers.localisation) {
      // Only eliminate if we KNOW the region doesn't match
      // If region is empty, let it through (penalized in scoring)
      if (inc.region) return false
    }
  }

  return true
}

// ─── STEP 2: SCORING (pertinence, dynamic max) ───

interface ScoreDimension {
  points: number
  maxPoints: number
  hasData: boolean
}

function scoreSecteur(inc: Incubator, answers: UserAnswers): ScoreDimension {
  const MAX = 25
  if (answers.secteur === "Autre") {
    return { points: 15, maxPoints: MAX, hasData: true }
  }
  const keywords = SECTOR_KEYWORDS[answers.secteur] || []
  if (keywords.length === 0) return { points: 15, maxPoints: MAX, hasData: true }

  const combined = `${inc.secteur} ${inc.themesDetailles}`
  if (!combined.trim()) return { points: 0, maxPoints: 0, hasData: false } // no data → exclude from max

  if (containsAny(combined, keywords)) {
    return { points: 25, maxPoints: MAX, hasData: true }
  }
  if (inc.secteur === "Généraliste") {
    return { points: 12, maxPoints: MAX, hasData: true }
  }
  return { points: 0, maxPoints: MAX, hasData: true }
}

function scoreBlocage(inc: Incubator, answers: UserAnswers): ScoreDimension {
  const MAX = 25
  const blocage = answers.profil // Q7 stores in "profil" field
  if (blocage === "Aucun" || blocage === "Inconnu") {
    return { points: 12, maxPoints: MAX, hasData: true }
  }

  const kw = BLOCAGE_KEYWORDS[blocage] || []
  if (kw.length === 0) return { points: 12, maxPoints: MAX, hasData: true }

  if (inc.avantages.length === 0) return { points: 0, maxPoints: 0, hasData: false }

  const avStr = inc.avantages.join(" ")
  if (containsAny(avStr, kw)) {
    return { points: 25, maxPoints: MAX, hasData: true }
  }
  return { points: 5, maxPoints: MAX, hasData: true }
}

function scorePriorite(inc: Incubator, answers: UserAnswers): ScoreDimension {
  const MAX = 20
  if (!answers.priorite) return { points: 0, maxPoints: 0, hasData: false }
  if (inc.avantages.length === 0) return { points: 0, maxPoints: 0, hasData: false }

  // Fix: split comma-separated multi-select values
  const selectedPriorities = answers.priorite.split(",").map((s) => s.trim())
  const avStr = inc.avantages.join(" ")

  let matched = 0
  for (const prio of selectedPriorities) {
    // Handle "Autre: xxx" — skip
    if (prio.startsWith("Autre")) continue
    const kw = PRIORITE_KEYWORDS[prio]
    if (kw && containsAny(avStr, kw)) {
      matched++
    }
  }

  const validPriorities = selectedPriorities.filter((p) => !p.startsWith("Autre")).length
  if (validPriorities === 0) return { points: 10, maxPoints: MAX, hasData: true }

  const points = Math.round((matched / validPriorities) * MAX)
  return { points, maxPoints: MAX, hasData: true }
}

function scoreEquity(inc: Incubator, answers: UserAnswers): ScoreDimension {
  const MAX = 15
  if (!inc.equityPct && inc.equityPct !== "0") return { points: 0, maxPoints: 0, hasData: false }

  const eqPct = parseFloat(inc.equityPct) || 0

  if (answers.equity === "Non") {
    return { points: eqPct === 0 ? 15 : 0, maxPoints: MAX, hasData: true }
  }
  if (answers.equity === "Faible") {
    return { points: eqPct <= 5 ? 15 : 5, maxPoints: MAX, hasData: true }
  }
  // Ouvert
  return { points: 15, maxPoints: MAX, hasData: true }
}

function scoreDuree(inc: Incubator, answers: UserAnswers): ScoreDimension {
  const MAX = 15
  if (!inc.dureeMois) return { points: 0, maxPoints: 0, hasData: false }

  // Parse duration (can be "6", "6-12", "12-24", etc.)
  const parts = inc.dureeMois.split("-").map((s) => parseInt(s.trim()))
  const minDuree = parts[0] || 0
  const maxDuree = parts[parts.length - 1] || minDuree

  if (answers.duree === "Court") {
    // 3-6 months preferred
    if (maxDuree <= 6) return { points: 15, maxPoints: MAX, hasData: true }
    if (minDuree <= 6) return { points: 10, maxPoints: MAX, hasData: true }
    return { points: 3, maxPoints: MAX, hasData: true }
  }
  if (answers.duree === "Long") {
    // 12-24 months preferred
    if (minDuree >= 12) return { points: 15, maxPoints: MAX, hasData: true }
    if (maxDuree >= 12) return { points: 10, maxPoints: MAX, hasData: true }
    return { points: 3, maxPoints: MAX, hasData: true }
  }
  // Flexible
  return { points: 12, maxPoints: MAX, hasData: true }
}

// ─── MAIN SCORING FUNCTION ───

export function scoreIncubator(inc: Incubator, answers: UserAnswers): ScoredIncubator | null {
  // Step 1: Filters
  if (!passesFilters(inc, answers)) return null

  // Step 2: Score each dimension
  const dimensions: ScoreDimension[] = [
    scoreSecteur(inc, answers),
    scoreBlocage(inc, answers),
    scorePriorite(inc, answers),
    scoreEquity(inc, answers),
    scoreDuree(inc, answers),
  ]

  // Dynamic max: only count dimensions where incubator HAS data
  let totalPoints = 0
  let totalMax = 0

  for (const dim of dimensions) {
    if (dim.hasData) {
      totalPoints += dim.points
      totalMax += dim.maxPoints
    }
  }

  // If no data at all, give a low base score
  if (totalMax === 0) {
    return {
      ...inc,
      score: 10,
      maxScore: 100,
      matchPercent: 10,
    }
  }

  const matchPercent = Math.min(100, Math.round((totalPoints / totalMax) * 100))

  return {
    ...inc,
    score: totalPoints,
    maxScore: totalMax,
    matchPercent,
  }
}

export function rankIncubators(
  incubators: Incubator[],
  answers: UserAnswers,
  limit = 5
): ScoredIncubator[] {
  const scored = incubators
    .map((inc) => scoreIncubator(inc, answers))
    .filter((r): r is ScoredIncubator => r !== null)
    .sort((a, b) => b.matchPercent - a.matchPercent) // sort by percent, not raw score

  return scored.slice(0, limit)
}
