import type { Incubator, ScoredIncubator, UserAnswers } from "./types"

function splitCsv(value: string): string[] {
  if (!value) return []
  return value.split(",").map((s) => s.trim()).filter(Boolean)
}

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some((kw) => lower.includes(kw.toLowerCase()))
}

const SECTOR_KEYWORDS: Record<string, string[]> = {
  Tech: ["Tech", "SaaS", "Numérique", "Digital", "IA", "Cyber", "DeepTech", "Logiciel", "Data"],
  Santé: ["Santé", "HealthTech", "Biotech", "Medtech", "Pharma", "e-santé", "Soins", "BioTech"],
  Impact: ["Impact", "ESS", "Solidarité", "Social", "GreenTech", "CleanTech", "Environnement", "Durabilité"],
  Autre: [],
}

const PRIORITE_KEYWORDS: Record<string, string[]> = {
  Réseau: ["Réseau", "Networking"],
  Mentorat: ["Mentorat", "Coaching", "Accompagnement"],
  Financement: ["Financement", "Subvention", "Bourse", "Prêt"],
  Bureau: ["Bureau", "Coworking", "Hébergement", "Espace"],
}

const REGION_METROPOLES = [
  "Auvergne-Rhône-Alpes",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur",
  "Hauts-de-France",
  "Bretagne",
]

const MAX_SCORE = 110

export function scoreIncubator(inc: Incubator, answers: UserAnswers): ScoredIncubator | null {
  let score = 0

  // Stade — 30 pts (éliminatoire)
  if (inc.stadeAccepte.length > 0) {
    if (inc.stadeAccepte.some((s) => s === answers.stade)) {
      score += 30
    } else {
      return null // éliminé
    }
  } else {
    score += 15 // pas d'info = match partiel
  }

  // Secteur — 20 pts
  if (answers.secteur === "Autre") {
    score += 10
  } else {
    const keywords = SECTOR_KEYWORDS[answers.secteur] || []
    const combined = `${inc.secteur} ${inc.themesDetailles}`
    if (containsAny(combined, keywords)) {
      score += 20
    } else if (inc.secteur === "Généraliste" || inc.secteur === "8. Multi-filières") {
      score += 10
    }
  }

  // Blocage / Profil — 20 pts
  // Q7 "blocage" maps to incubator advantages
  const BLOCAGE_KEYWORDS: Record<string, string[]> = {
    Validation: ["Mentorat", "Réseau", "Coaching"],
    Build: ["Bureau", "Crédits cloud", "Tech"],
    Clients: ["Réseau", "Mentorat", "Financement"],
    Financement: ["Financement", "Subvention", "Bourse", "Prêt"],
    Aucun: [],
  }
  if (answers.profil === "Aucun") {
    score += 10 // neutral
  } else {
    const blocageKw = BLOCAGE_KEYWORDS[answers.profil] || []
    if (blocageKw.length > 0 && inc.avantages.length > 0) {
      const avStr = inc.avantages.join(" ")
      if (containsAny(avStr, blocageKw)) {
        score += 20
      } else {
        score += 5
      }
    } else {
      score += 10
    }
  }

  // Profil founder compatibility (bonus from incubator data)
  if (inc.profilFounder.length > 0) {
    const acceptable = ["Tous", "Salarié"]
    if (inc.profilFounder.some((p) => acceptable.includes(p))) {
      score += 20
    }
  } else {
    score += 10
  }

  // Localisation — 15 pts
  if (answers.localisation === "Flexible") {
    score += 15
  } else if (answers.localisation === "Île-de-France") {
    if (inc.region === "Île-de-France" || inc.region === "Partout en France") score += 15
  } else if (answers.localisation === "Métropoles") {
    if (REGION_METROPOLES.includes(inc.region) || inc.region === "Partout en France") score += 15
  } else {
    if (inc.region && inc.region !== "Île-de-France") score += 10
  }

  // Tech / Non-tech — 10 pts
  const acceptedTech: Record<string, string[]> = {
    Tech: ["Tech", "Les deux"],
    "Non-tech": ["Non-tech", "Les deux"],
    "Les deux": ["Tech", "Non-tech", "Les deux"],
  }
  const userTechPref = acceptedTech["Les deux"] // quiz doesn't ask tech/non-tech, default accept all
  if (!inc.techNonTech || userTechPref.includes(inc.techNonTech)) {
    score += 10
  }

  // Equity — 5 pts
  const eqPct = parseFloat(inc.equityPct) || 0
  if (answers.equity === "Non") {
    if (eqPct === 0 || inc.equityPct === "" || inc.equityPct === "0") score += 5
  } else if (answers.equity === "Faible") {
    if (eqPct <= 5) score += 5
  } else {
    score += 5
  }

  // Priorité — bonus 0-10 pts
  const keywords = PRIORITE_KEYWORDS[answers.priorite] || []
  if (inc.avantages.length > 0) {
    const avStr = inc.avantages.join(" ")
    if (containsAny(avStr, keywords)) {
      score += 10
    }
  }

  const matchPercent = Math.min(100, Math.round((score / MAX_SCORE) * 100))

  return {
    ...inc,
    score,
    maxScore: MAX_SCORE,
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
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit)
}
