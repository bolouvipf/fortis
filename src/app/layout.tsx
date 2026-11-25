import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import { site } from "@/lib/site";
import { absoluteUrl, getSiteUrl } from "@/lib/urls";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "FORTIS — BTP, comptabilité, formation et commerce",
    template: "%s · FORTIS",
  },
  description: site.description,
  applicationName: "FORTIS",
  authors: [{ name: "FORTIS" }],
  creator: "FORTIS",
  keywords: [
    "FORTIS",
    "BTP Bénin",
    "comptabilité Bénin",
    "formation Archicad",
    "quittance de formation",
    "prestations administratives",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "FORTIS",
    title: "FORTIS — Bâtir. Gérer. Développer.",
    description: site.description,
    images: [
      {
        url: "/logo.jpg",
        width: 300,
        height: 300,
        alt: "Logo FORTIS",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "FORTIS — Bâtir. Gérer. Développer.",
    description: site.description,
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0f4d3f",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FORTIS",
  url: getSiteUrl(),
  logo: absoluteUrl("/logo.jpg"),
  slogan: site.tagline,
  description: site.description,
  email: site.email,
  telephone: "+2290154085128",
  areaServed: { "@type": "Country", name: "Bénin" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+2290164670966",
      contactType: "customer service",
      areaServed: "BJ",
      availableLanguage: "fr",
    },
    {
      "@type": "ContactPoint",
      telephone: "+2290154085128",
      contactType: "billing support",
      areaServed: "BJ",
      availableLanguage: "fr",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
