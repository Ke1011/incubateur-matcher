import { NextResponse } from "next/server"

const GOOGLE_SHEET_WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL || ""

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prenom, email, profil, stade, source } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 })
    }

    // Append to Google Sheet via Apps Script webhook
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: prenom || "",
          email,
          profil: profil || "",
          stade: stade || "",
          source: source || "quiz",
          date: new Date().toISOString(),
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
