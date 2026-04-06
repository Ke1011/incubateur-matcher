export interface Incubator {
  nom: string
  alumniNotables: string
  linkedin: string
  region: string
  secteur: string
  siteWeb: string
  ville: string
  stadeAccepte: string[]
  typeStructure: string
  dureeMois: string
  coutEur: string
  equityPct: string
  profilFounder: string[]
  techNonTech: string
  avantages: string[]
  themesDetailles: string
  departement: string
  adresse: string
  actif: boolean
  source: string
}

export interface ScoredIncubator extends Incubator {
  score: number
  maxScore: number
  matchPercent: number
}

export interface UserAnswers {
  stade: string
  secteur: string
  localisation: string
  priorite: string
  duree: string
  equity: string
  profil: string
}

export interface Question {
  id: keyof UserAnswers
  question: string
  subtitle?: string
  options: QuestionOption[]
}

export interface QuestionOption {
  value: string
  label: string
  icon?: string
}

export interface Category {
  id: string
  label: string
  color: string
  gradient: string
  title: string
  subtitle: string
  filterKey: string
  filterValues: string[]
}
