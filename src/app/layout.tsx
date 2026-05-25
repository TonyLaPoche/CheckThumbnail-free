import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { I18nProvider } from "@/i18n/context";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

const title = "Check Thumbnail — Prévisualiser URL, OG preview & thumbnails réseaux sociaux";
const description =
  "Outil gratuit pour prévisualiser une URL : scan Open Graph, Twitter Card, thumbnails WhatsApp, X, Reddit, Bluesky et Telegram. Vérifiez og:title, og:image avant de partager un lien.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: {
    default: title,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  keywords: [
    "prévisualiser url",
    "preview url",
    "og preview",
    "open graph preview",
    "thumbnail url",
    "link preview",
    "social media preview",
    "twitter card preview",
    "whatsapp link preview",
    "scan url metadata",
    "vérifier og image",
    "check thumbnail",
  ],
  authors: [{ name: siteConfig.author, url: siteConfig.portfolioUrl }],
  creator: siteConfig.author,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  category: "technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <JsonLd />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
