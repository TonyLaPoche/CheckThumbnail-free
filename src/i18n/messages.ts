export type Locale = "fr" | "en";

export const messages = {
  fr: {
    meta: {
      title: "Check Thumbnail — Preview OG & réseaux sociaux",
      description:
        "Scannez une URL et prévisualisez og:title, image et cartes WhatsApp, X, Reddit, Bluesky, Telegram.",
    },
    header: {
      subtitle:
        "Collez une URL pour analyser les balises Open Graph et Twitter Card, puis visualisez le rendu sur WhatsApp, X, Reddit, Bluesky et Telegram.",
    },
    form: {
      placeholder: "https://exemple.com/article",
      check: "Check",
      scanning: "Scan…",
    },
    errors: {
      invalid_url: "URL invalide.",
      fetch_failed:
        "Impossible de récupérer la page (CORS ou site inaccessible). Réessayez ou testez une autre URL.",
      generic: "Erreur lors du scan.",
    },
    metaPanel: {
      title: "Métadonnées extraites",
      subtitle: "Valeurs utilisées pour les previews ci-dessous",
      effectiveTitle: "Titre effectif :",
      description: "Description :",
      image: "Image :",
      finalUrl: "URL finale",
    },
    preview: {
      noOgImage: "Aucune image OG",
    },
    footer: {
      copyright: "© {year} Terrade Antoine",
      portfolio: "Portfolio",
    },
  },
  en: {
    meta: {
      title: "Check Thumbnail — OG & social preview",
      description:
        "Scan a URL and preview og:title, images and cards for WhatsApp, X, Reddit, Bluesky, and Telegram.",
    },
    header: {
      subtitle:
        "Paste a URL to analyze Open Graph and Twitter Card tags, then preview how it looks on WhatsApp, X, Reddit, Bluesky, and Telegram.",
    },
    form: {
      placeholder: "https://example.com/article",
      check: "Check",
      scanning: "Scanning…",
    },
    errors: {
      invalid_url: "Invalid URL.",
      fetch_failed:
        "Could not fetch the page (CORS or site unreachable). Try again or use another URL.",
      generic: "Error while scanning.",
    },
    metaPanel: {
      title: "Extracted metadata",
      subtitle: "Values used for the previews below",
      effectiveTitle: "Effective title:",
      description: "Description:",
      image: "Image:",
      finalUrl: "Final URL",
    },
    preview: {
      noOgImage: "No OG image",
    },
    footer: {
      copyright: "© {year} Terrade Antoine",
      portfolio: "Portfolio",
    },
  },
} as const;
