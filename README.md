# Check Thumbnail Web

Outil pour scanner une URL et prévisualiser les métadonnées Open Graph / Twitter Card sur **WhatsApp**, **X (Twitter)**, **Reddit**, **Bluesky** et **Telegram**.

**Démo en ligne :** [https://tonylapoche.github.io/CheckThumbnail-free/](https://tonylapoche.github.io/CheckThumbnail-free/)

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Hébergement GitHub Pages

Le site est exporté en **statique** (`output: 'export'`) et déployé automatiquement via GitHub Actions à chaque push sur `main`.

### Activation (une seule fois sur GitHub)

1. Repo **Settings** → **Pages**
2. **Build and deployment** → Source : **GitHub Actions**
3. Poussez sur `main` : le workflow `.github/workflows/deploy-pages.yml` build et publie le dossier `out/`

URL publique : `https://<votre-user>.github.io/CheckThumbnail-free/`

### Build local identique à la CI

```bash
npm run build:pages
npx serve out
```

## Fonctionnement

- Récupération du HTML dans le navigateur (proxy CORS si le site bloque les requêtes directes).
- Parsing des balises `og:*`, `twitter:*`, titre, description, image, etc.
- Previews stylées par plateforme.

## Limites

- GitHub Pages ne permet pas d’API serveur : le scan passe par le navigateur + proxies CORS publics.
- Certaines pages bloquent les bots ou chargent les meta en JavaScript uniquement.
- Les previews restent une approximation du rendu réel.
