# Project G

> **Live reader:** https://khoryik96-creator.github.io/Project-G/

A mobile-first light/short novel reader built with **React 19 + TypeScript + ESLint + Vite**.

The architecture is intentionally similar to the Lucy / Despicable Heretic reader: typed manuscript data, static hash routing, device-local bookmarks, Continue Reading, mobile navigation and GitHub Pages deployment — but without the legacy dual-reader migration layer.

## Included

- Responsive library grouped by season
- Chapter search
- Reader deep links that survive GitHub Pages refreshes
- Previous / next chapter navigation
- Bookmarks persisted in local storage
- Continue Reading persisted in local storage
- Night / paper reading themes
- Reader font-size and text-width controls
- React + TypeScript strict mode
- ESLint flat config
- GitHub Actions quality gate
- GitHub Pages deployment workflow

## Local development

```bash
npm install
npm run dev
```

Quality check:

```bash
npm run check
```

Production build:

```bash
npm run build
```

## Add the real novel

Replace the starter manuscript in `src/content/story.ts`. Keep UI code free of canon-specific facts. For a large novel, follow `ARCHITECTURE.md` and split prose by season with generated lightweight metadata.

## GitHub Pages

**Reader URL:** https://khoryik96-creator.github.io/Project-G/

The Vite base path is already configured for `/Project-G/`. Merging changes into `main` triggers the included Pages workflow. If this repository has never used Pages before, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** once.
