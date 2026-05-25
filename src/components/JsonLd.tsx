import { siteConfig, absoluteUrl } from "@/lib/site-config";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Free tool to preview Open Graph and Twitter Card metadata. Scan any URL and see link thumbnails for WhatsApp, X, Reddit, Bluesky, and Telegram.",
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: siteConfig.portfolioUrl,
    },
    featureList: [
      "Open Graph preview",
      "Twitter Card preview",
      "WhatsApp link preview",
      "URL thumbnail checker",
      "Social media share preview",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
