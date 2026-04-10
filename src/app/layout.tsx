import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { GateProvider } from "@/components/gate/gate-provider"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Trouve ton incubateur | incub.match",
  description:
    "+550 incubateurs et accélérateurs en France. Quiz de matching personnalisé + annuaire complet avec filtres. Gratuit.",
  metadataBase: new URL("https://incubateur.kemil.fr"),
  openGraph: {
    title: "Quel incubateur pour ta startup ?",
    description:
      "Quiz gratuit — +550 incubateurs analysés. Trouve ton match en 2 min.",
    images: ["/og-image.png"],
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quel incubateur pour ta startup ?",
    description: "Quiz gratuit — +550 incubateurs analysés.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        <GateProvider>{children}</GateProvider>
      </body>
    </html>
  )
}
