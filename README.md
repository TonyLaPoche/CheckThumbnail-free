# Check Thumbnail Web

Outil local pour scanner une URL et prévisualiser les métadonnées Open Graph / Twitter Card telles qu’elles peuvent apparaître sur **WhatsApp**, **X (Twitter)**, **Reddit**, **Bluesky** et **Telegram**.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000), collez une URL et cliquez sur **Check**.

## Fonctionnement

- L’API `/api/check` récupère le HTML côté serveur (évite les blocages CORS du navigateur).
- Extraction via Cheerio : `og:*`, `twitter:*`, titre, description, image, canonical, etc.
- Les cartes de preview imitent le layout et les couleurs typiques de chaque plateforme.

## Limites

- Certaines pages bloquent les bots ou exigent JavaScript pour injecter les meta tags.
- Les previews sont une approximation visuelle ; le rendu final peut varier selon l’app et la région.
