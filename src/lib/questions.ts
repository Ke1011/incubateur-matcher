import type { Question } from "./types"

export const questions: Question[] = [
  {
    id: "stade",
    question: "Où en êtes-vous avec votre projet ?",
    options: [
      { value: "Idéation", label: "Je cherche une idée", icon: "🤔" },
      { value: "Idéation", label: "J'ai une idée mais j'ai rien fait concrètement", icon: "💡" },
      { value: "Pré-seed", label: "J'ai commencé à parler à ma cible (discovery)", icon: "🔍" },
      { value: "Pré-seed", label: "J'ai validé mon discovery, pas encore de MVP", icon: "✅" },
      { value: "Seed", label: "Je suis en train de construire mon MVP", icon: "🛠️" },
      { value: "Seed", label: "J'ai un MVP, je cherche mes premiers clients", icon: "🚀" },
      { value: "Growth", label: "J'ai déjà des clients / du revenu", icon: "💰" },
    ],
  },
  {
    id: "secteur",
    question: "Quel est votre secteur principal ?",
    options: [
      { value: "Tech", label: "Tech / IA / SaaS", icon: "💻" },
      { value: "DeepTech", label: "DeepTech (hardware, quantique, spatial...)", icon: "🔬" },
      { value: "Santé", label: "Santé / Biotech / Pharma / Medtech", icon: "🧬" },
      { value: "Fintech", label: "Fintech / AssurTech", icon: "💳" },
      { value: "Impact", label: "Impact / Greentech / Social", icon: "🌍" },
      { value: "FoodTech", label: "FoodTech / AgriTech", icon: "🌾" },
      { value: "Industrie", label: "Industrie / Mobilité / Défense", icon: "🏭" },
      { value: "Luxe", label: "Luxe / Mode / Beauté", icon: "✨" },
      { value: "Autre", label: "Autre / Généraliste", icon: "📦" },
    ],
  },
  {
    id: "localisation",
    question: "Où êtes-vous basé ?",
    options: [
      { value: "Île-de-France", label: "Île-de-France (Paris et alentours)", icon: "🗼" },
      { value: "Auvergne-Rhône-Alpes", label: "Auvergne-Rhône-Alpes (Lyon, Grenoble...)", icon: "⛰️" },
      { value: "Nouvelle-Aquitaine", label: "Nouvelle-Aquitaine (Bordeaux...)", icon: "🍷" },
      { value: "Occitanie", label: "Occitanie (Toulouse, Montpellier...)", icon: "☀️" },
      { value: "Hauts-de-France", label: "Hauts-de-France (Lille...)", icon: "🏭" },
      { value: "Autre", label: "Autre région", icon: "🗺️" },
      { value: "Flexible", label: "Flexible / Open au remote", icon: "🌐" },
    ],
  },
  {
    id: "priorite",
    question: "Qu'attendez-vous d'un incubateur ?",
    subtitle: "Sélectionnez jusqu'à 2 réponses.",
    multiSelect: 2,
    options: [
      { value: "Réseau", label: "Réseau corpo et introductions", icon: "🤝" },
      { value: "Mentorat", label: "Mentorat et accompagnement", icon: "🧠" },
      { value: "Financement", label: "Financement et accès aux VCs", icon: "💰" },
      { value: "Bureau", label: "Espace de travail", icon: "🏢" },
      { value: "Autre", label: "Autre (préciser)", icon: "✏️" },
    ],
  },
  {
    id: "duree",
    question: "Quelle durée d'accompagnement recherchez-vous ?",
    options: [
      { value: "Court", label: "Programme court (3-6 mois)", icon: "⚡" },
      { value: "Long", label: "Accompagnement long (12-24 mois)", icon: "📅" },
      { value: "Flexible", label: "Sans engagement de durée", icon: "♾️" },
    ],
  },
  {
    id: "equity",
    question: "Êtes-vous ouvert à céder de l'equity ?",
    options: [
      { value: "Non", label: "Non, programmes sans equity uniquement", icon: "🛡️" },
      { value: "Faible", label: "Oui, si la valeur est réelle (≤ 5%)", icon: "📊" },
      { value: "Ouvert", label: "Ouvert selon l'opportunité", icon: "🤝" },
    ],
  },
  {
    id: "profil",
    question: "Quel est votre principal blocage aujourd'hui ?",
    subtitle: "Cela nous aide à prioriser les incubateurs les plus utiles pour vous.",
    options: [
      { value: "Validation", label: "Valider mon idée / trouver mon marché", icon: "🔍" },
      { value: "Build", label: "Construire mon produit / MVP", icon: "🔧" },
      { value: "Clients", label: "Trouver mes premiers clients", icon: "🎯" },
      { value: "Financement", label: "Trouver du financement", icon: "💰" },
      { value: "Aucun", label: "Pas de blocage particulier", icon: "✅" },
      { value: "Inconnu", label: "Je ne sais pas", icon: "🤷" },
    ],
  },
]
