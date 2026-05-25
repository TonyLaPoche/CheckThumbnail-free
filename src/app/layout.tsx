import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Check Thumbnail — Preview OG & réseaux sociaux",
  description: "Scannez une URL et prévisualisez og:title, image et cartes WhatsApp, X, Reddit, Bluesky, Telegram.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
