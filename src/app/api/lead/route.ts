import { NextResponse } from "next/server"

const GOOGLE_SHEET_WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL || ""

// Simple in-memory rate limiter (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5 // max requests per window
const RATE_WINDOW = 60 * 1000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 })
    }

    const body = await request.json()
    const { prenom, email, linkedin, profil, stade, source } = body

    // Validation
    if (!email || !email.includes("@") || email.length > 200) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 })
    }
    if (!prenom || prenom.length > 100) {
      return NextResponse.json({ error: "Prénom invalide" }, { status: 400 })
    }

    // Sanitize inputs (max 500 chars each)
    const sanitize = (val: string, max = 500) => (val || "").slice(0, max)

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.error("[LEAD] LEAD_WEBHOOK_URL not configured — lead lost:", email)
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 })
    }

    const webhookRes = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom: sanitize(prenom, 100),
        email: sanitize(email, 200),
        linkedin: sanitize(linkedin, 300),
        profil: sanitize(profil),
        stade: sanitize(stade),
        source: sanitize(source, 50),
        date: new Date().toISOString(),
      }),
    })

    if (!webhookRes.ok) {
      console.error("[LEAD] Webhook failed:", webhookRes.status, await webhookRes.text())
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[LEAD] Error:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
