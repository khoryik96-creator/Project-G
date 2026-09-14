# Project G

> **Live reader / mobile app:** https://khoryik96-creator.github.io/Project-G/

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
- Installable Progressive Web App (PWA)
- Home-screen / standalone app launch on supported mobile browsers
- Offline caching for previously loaded app resources and chapters
- React + TypeScript strict mode
- ESLint flat config
- GitHub Actions quality gate
- GitHub Pages deployment workflow

## Install on mobile

Open the live reader on your phone. On supported Android browsers, an **Install** button appears in the Project G mobile header once the browser marks the app as installable. Tap it to add Project G to your home screen and launch it in standalone app mode.

If the in-app Install button is not shown, use the browser menu and choose **Install app** or **Add to Home screen**. On iPhone/iPad, open the site in Safari, use **Share**, then **Add to Home Screen**.

Bookmarks, Continue Reading, and reading preferences remain stored on the device/browser profile used to install the app.

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

## Story content

The active manuscript is assembled through the newest `src/content/story-v*.ts` file referenced by `src/domain/storyIndex.ts`. `STORY_CANON.md` is the canon source of truth when older manuscript revisions conflict.

## GitHub Pages

**Reader URL:** https://khoryik96-creator.github.io/Project-G/

The Vite base path is already configured for `/Project-G/`. Merging changes into `main` triggers the included Pages workflow. If this repository has never used Pages before, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** once.
