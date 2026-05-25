import type { FetchErrorCode } from "@/lib/fetch-errors";
import type { ScanPhase } from "@/lib/fetch-og";

export type Locale = "fr" | "en";

type ErrorHelpMessages = Record<FetchErrorCode, { title: string; body: string }>;

const errorHelpFr: ErrorHelpMessages = {
  invalid_url: {
    title: "URL invalide",
    body: "L'adresse saisie n'est pas reconnue. Vérifiez qu'elle contient un domaine valide (ex. exemple.com ou https://exemple.com/page). Évitez les espaces et caractères spéciaux non encodés.",
  },
  unsupported_protocol: {
    title: "Protocole non supporté",
    body: "Seules les URLs http:// et https:// sont acceptées. Les liens file://, ftp:// ou mailto: ne peuvent pas être analysés depuis le navigateur.",
  },
  timeout: {
    title: "Délai dépassé",
    body: "Le site met trop de temps à répondre (limite de 60 secondes). Plateformes vidéo, pages lourdes ou protections anti-bot peuvent nécessiter plus de temps que nous ne pouvons allouer.",
  },
  cors_blocked: {
    title: "Blocage CORS",
    body: "Le navigateur empêche la lecture directe de cette page pour des raisons de sécurité (politique CORS). Les proxies publics n'ont pas pu contourner le blocage : le site refuse peut-être les crawlers ou filtre les requêtes externes.",
  },
  fetch_failed: {
    title: "Page inaccessible",
    body: "Impossible de télécharger le HTML. Causes fréquentes : site hors ligne, erreur 403/404, pare-feu, protection anti-bot, ou page nécessitant une connexion. Testez l'URL dans un navigateur privé.",
  },
  generic: {
    title: "Erreur inattendue",
    body: "Une erreur non identifiée s'est produite. Réessayez dans quelques instants ou testez une autre URL.",
  },
};

const errorHelpEn: ErrorHelpMessages = {
  invalid_url: {
    title: "Invalid URL",
    body: "The address you entered is not valid. Make sure it includes a proper domain (e.g. example.com or https://example.com/page). Avoid spaces and unencoded special characters.",
  },
  unsupported_protocol: {
    title: "Unsupported protocol",
    body: "Only http:// and https:// URLs are supported. Links such as file://, ftp://, or mailto: cannot be scanned from the browser.",
  },
  timeout: {
    title: "Request timed out",
    body: "The site took too long to respond (60 second limit). Video platforms, heavy pages, or anti-bot protection may need more time than we can allow.",
  },
  cors_blocked: {
    title: "CORS blocked",
    body: "The browser blocks direct access to this page for security reasons (CORS policy). Public proxies could not bypass it: the site may reject crawlers or filter external requests.",
  },
  fetch_failed: {
    title: "Page unreachable",
    body: "Could not download the HTML. Common causes: site offline, 403/404 errors, firewall, anti-bot protection, or login-required pages. Try opening the URL in a private browser window.",
  },
  generic: {
    title: "Unexpected error",
    body: "An unidentified error occurred. Try again in a moment or use a different URL.",
  },
};

export const messages = {
  fr: {
    meta: {
      title: "Check Thumbnail — Prévisualiser URL, OG preview & thumbnails",
      description:
        "Outil gratuit pour prévisualiser une URL : scan Open Graph, Twitter Card et thumbnails WhatsApp, X, Reddit, Bluesky, Telegram.",
    },
    header: {
      subtitle:
        "Prévisualisez gratuitement le rendu d’un lien partagé : OG preview, thumbnails URL et cartes sociales (WhatsApp, X, Reddit, Bluesky, Telegram) avant publication.",
      seoLine:
        "Vérificateur de métadonnées Open Graph · scan link preview · check thumbnail",
    },
    faq: {
      title: "Comment ça marche ?",
      intro:
        "Transparence avant le scan : voici ce que fait cet outil, ses limites et vos droits.",
      items: [
        {
          id: "how-it-works",
          question: "Comment fonctionne ce vérificateur ?",
          answer:
            "Vous collez une adresse web publique. L'outil télécharge la page (ou son code HTML), lit les balises prévues pour les réseaux sociaux (Open Graph, Twitter Card), puis affiche un aperçu du titre, de la description et de l'image telles qu'elles peuvent apparaître sur WhatsApp, X, Reddit, Bluesky ou Telegram. Aucun compte n'est requis.",
        },
        {
          id: "what-is-cors",
          question: "C'est quoi le CORS ?",
          answer:
            "CORS est une règle de sécurité des navigateurs : un site web ne peut pas lire librement le contenu d'un autre site sans autorisation. C'est pour vous protéger (empêcher un site malveillant de lire vos données ailleurs). Conséquence : notre outil, qui tourne dans votre navigateur, peut être bloqué quand il essaie de lire directement certaines pages.",
        },
        {
          id: "proxies",
          question: "Pourquoi parle-t-on de « proxy » pendant le scan ?",
          answer:
            "Si la lecture directe échoue à cause du CORS, l'outil passe par un service intermédiaire (proxy) qui récupère la page à votre place, puis renvoie le HTML. Ce n'est pas magique : certains sites bloquent aussi les proxies. C'est indiqué dans la barre de progression pour que vous sachiez ce qui se passe.",
        },
        {
          id: "og-tags",
          question: "Que sont les balises Open Graph et Twitter Card ?",
          answer:
            "Ce sont des informations cachées dans le code HTML d'une page (titre, description, image) que Facebook, X, WhatsApp et d'autres utilisent pour fabriquer l'aperçu quand on partage un lien. Si le site ne les renseigne pas correctement, le partage aura un mauvais rendu — ce n'est pas un bug de notre outil.",
        },
        {
          id: "accuracy",
          question: "Les aperçus sont-ils exacts à 100 % ?",
          answer:
            "Non, ce sont des simulations visuelles basées sur les métadonnées trouvées. Chaque application (WhatsApp, X, etc.) peut recadrer l'image, tronquer le texte ou mettre à jour son design. L'aperçu vous aide à anticiper le rendu, pas à le garantir au pixel près.",
        },
        {
          id: "legal",
          question: "Est-ce légal ?",
          answer:
            "L'outil ne lit que des pages accessibles publiquement sur Internet, de la même manière qu'un moteur de recherche ou un réseau social lors d'un partage de lien. Vous restez responsable des URLs que vous testez : n'analysez pas de contenus auxquels vous n'avez pas le droit d'accéder. Nous ne contournons pas de paywall ni de zone de connexion privée.",
        },
        {
          id: "free",
          question: "Est-ce gratuit ?",
          answer:
            "Oui, l'utilisation de Check Thumbnail est gratuite. Le site est hébergé sur GitHub Pages ; les éventuels proxies publics sont des services tiers soumis à leurs propres limites.",
        },
        {
          id: "privacy",
          question: "Mes données sont-elles enregistrées ?",
          answer:
            "Non. Les URLs que vous saisissez ne sont pas stockées sur un serveur dédié à cet outil : le traitement se fait dans votre navigateur. La langue choisie (FR/EN) est mémorisée localement sur votre appareil. Aucun compte, aucune base de données utilisateur.",
        },
        {
          id: "failures",
          question: "Pourquoi le scan échoue parfois ?",
          answer:
            "Causes fréquentes : URL incorrecte, site hors ligne, page protégée par mot de passe, blocage anti-robot, CORS strict, ou page dont le contenu est chargé uniquement en JavaScript (sans balises OG dans le HTML initial). Le bouton « ? » à côté d'une erreur détaille la raison probable.",
        },
        {
          id: "urls",
          question: "Quelles URLs puis-je tester ?",
          answer:
            "Des liens commençant par http:// ou https://, pointant vers une page web publique. Les liens locaux (fichiers sur votre ordinateur), e-mails (mailto:) ou FTP ne sont pas pris en charge.",
        },
      ],
    },
    form: {
      placeholder: "https://exemple.com/article",
      check: "Check",
      scanning: "Scan…",
    },
    loading: {
      title: "Analyse en cours",
      phases: {
        validating: "Validation de l'URL…",
        fetching_direct: "Récupération directe de la page…",
        fetching_proxy: "Contournement CORS via proxy…",
        slow_wait: "Le site met plus de temps que prévu…",
        parsing: "Extraction des métadonnées OG…",
        done: "Terminé",
      } satisfies Record<ScanPhase, string>,
      slowReasons: {
        video:
          "Plateforme vidéo détectée (YouTube, Vimeo, etc.) : la page est volumineuse et charge lentement. Nous patientons encore (jusqu'à 60 s)…",
        proxy:
          "Le contournement CORS via proxy prend plus de temps : le site ou l'intermédiaire répond lentement. Encore un peu de patience…",
        heavy:
          "Ce site répond lentement (page lourde, serveur distant ou protection anti-bot). L'analyse continue jusqu'à 60 secondes…",
      },
    },
    errors: {
      invalid_url: "URL invalide — vérifiez le format de l'adresse.",
      unsupported_protocol: "Protocole non supporté — utilisez http:// ou https://.",
      timeout: "Délai dépassé (60 s) — le site ne répond pas à temps.",
      cors_blocked: "Accès bloqué par CORS — la page refuse la lecture externe.",
      fetch_failed: "Page inaccessible — impossible de récupérer le contenu.",
      generic: "Erreur lors du scan.",
    },
    errorHelp: {
      label: "Pourquoi cette erreur ?",
      ...errorHelpFr,
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
      title: "Check Thumbnail — URL preview, OG preview & thumbnails",
      description:
        "Free tool to preview any URL: Open Graph, Twitter Card, and thumbnails for WhatsApp, X, Reddit, Bluesky, and Telegram.",
    },
    header: {
      subtitle:
        "Preview how a shared link will look: OG preview, URL thumbnails, and social cards (WhatsApp, X, Reddit, Bluesky, Telegram) before you publish.",
      seoLine:
        "Open Graph checker · link preview scanner · thumbnail URL tool",
    },
    faq: {
      title: "How does it work?",
      intro:
        "Transparency before you scan: what this tool does, its limits, and your rights.",
      items: [
        {
          id: "how-it-works",
          question: "How does this checker work?",
          answer:
            "You paste a public web address. The tool fetches the page (or its HTML), reads the tags meant for social networks (Open Graph, Twitter Card), then shows a preview of the title, description, and image as they may appear on WhatsApp, X, Reddit, Bluesky, or Telegram. No account required.",
        },
        {
          id: "what-is-cors",
          question: "What is CORS?",
          answer:
            "CORS is a browser security rule: one website cannot freely read another site's content without permission. It protects you (e.g. stopping a malicious site from reading your data elsewhere). As a result, our tool, which runs in your browser, may be blocked when it tries to read some pages directly.",
        },
        {
          id: "proxies",
          question: "Why does the scan mention a « proxy »?",
          answer:
            "If direct reading fails because of CORS, the tool uses an intermediary service (proxy) that fetches the page on your behalf and returns the HTML. It is not magic: some sites block proxies too. The progress bar shows this step so you know what is happening.",
        },
        {
          id: "og-tags",
          question: "What are Open Graph and Twitter Card tags?",
          answer:
            "Hidden information in a page's HTML (title, description, image) that Facebook, X, WhatsApp, and others use to build the preview when a link is shared. If the site does not set them properly, shares will look wrong — that is not a bug in our tool.",
        },
        {
          id: "accuracy",
          question: "Are the previews 100% accurate?",
          answer:
            "No — they are visual simulations based on the metadata found. Each app (WhatsApp, X, etc.) may crop the image, truncate text, or change its design. The preview helps you anticipate the result, not guarantee it pixel-perfect.",
        },
        {
          id: "legal",
          question: "Is this legal?",
          answer:
            "The tool only reads publicly accessible pages on the Internet, similar to a search engine or social network when previewing a link. You remain responsible for the URLs you test: do not scan content you are not allowed to access. We do not bypass paywalls or private login areas.",
        },
        {
          id: "free",
          question: "Is it free?",
          answer:
            "Yes, Check Thumbnail is free to use. The site is hosted on GitHub Pages; any public proxies used are third-party services with their own limits.",
        },
        {
          id: "privacy",
          question: "Is my data stored?",
          answer:
            "No. URLs you enter are not saved on a dedicated server for this tool — processing happens in your browser. Your language choice (FR/EN) is stored locally on your device. No account, no user database.",
        },
        {
          id: "failures",
          question: "Why does a scan sometimes fail?",
          answer:
            "Common reasons: invalid URL, site offline, password-protected page, anti-bot protection, strict CORS, or a page that loads content only via JavaScript (no OG tags in the initial HTML). The « ? » button next to an error explains the likely cause.",
        },
        {
          id: "urls",
          question: "Which URLs can I test?",
          answer:
            "Links starting with http:// or https:// pointing to a public web page. Local file links, email links (mailto:), or FTP are not supported.",
        },
      ],
    },
    form: {
      placeholder: "https://example.com/article",
      check: "Check",
      scanning: "Scanning…",
    },
    loading: {
      title: "Scanning",
      phases: {
        validating: "Validating URL…",
        fetching_direct: "Fetching page directly…",
        fetching_proxy: "Bypassing CORS via proxy…",
        slow_wait: "This is taking longer than expected…",
        parsing: "Extracting OG metadata…",
        done: "Done",
      } satisfies Record<ScanPhase, string>,
      slowReasons: {
        video:
          "Video platform detected (YouTube, Vimeo, etc.): the page is heavy and loads slowly. Still waiting (up to 60 s)…",
        proxy:
          "CORS proxy bypass is taking longer: the site or intermediary is responding slowly. Please hold on…",
        heavy:
          "This site is responding slowly (heavy page, remote server, or anti-bot protection). Scan continues for up to 60 seconds…",
      },
    },
    errors: {
      invalid_url: "Invalid URL — check the address format.",
      unsupported_protocol: "Unsupported protocol — use http:// or https://.",
      timeout: "Timed out (60 s) — the site did not respond in time.",
      cors_blocked: "CORS blocked — the page refuses external access.",
      fetch_failed: "Page unreachable — could not fetch content.",
      generic: "Error while scanning.",
    },
    errorHelp: {
      label: "Why this error?",
      ...errorHelpEn,
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
