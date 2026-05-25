import type { Metadata } from "next";
import { I18nProvider } from "@/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Check Thumbnail — Preview OG & réseaux sociaux",
  description:
    "Scannez une URL et prévisualisez og:title, image et cartes WhatsApp, X, Reddit, Bluesky, Telegram.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
