# Project G — Architecture

## Goal

Project G is a static, mobile-first light/short novel reader. It borrows the strongest ideas from the Lucy / Despicable Heretic reader without carrying over story-specific canon or migration baggage.

The application uses React, TypeScript, ESLint and Vite and is designed to deploy directly to GitHub Pages. No backend is required for public reading, local bookmarks or continue-reading state.

## Source-of-truth hierarchy

1. `src/content/story.ts` — manuscript content and chapter metadata.
2. `src/domain/` — typed story contracts and indexes derived from the manuscript.
3. `src/features/` — presentation and reader behavior.
4. `src/app/` — routing, shell and site configuration.
5. Browser storage — device-local user state only; never canon.

The UI must not invent facts that are absent from the manuscript/domain layer.

## Reader state

Local storage keys are versioned from the start:

- `projectG.bookmarks.v1`
- `projectG.lastRead.v1`
- `projectG.preferences.v1`

If cross-device sync is ever required, add an explicit migration rather than silently changing these contracts.

## Routing

The app uses hash routes so it works on GitHub Pages without SPA rewrite rules:

- `#/library`
- `#/bookmarks`
- `#/reader/<chapter-id>`

## Mobile-first behavior

- Desktop: persistent left navigation with a centered reading surface.
- Mobile: compact sticky header and fixed bottom navigation.
- Reader: responsive text width, adjustable type scale, paper/night theme, previous/next chapter controls.
- Library: searchable chapters grouped into collapsible seasons.

## Scaling the manuscript

The starter keeps content in one typed file because Project G is new. Once the manuscript becomes large, split it by season under `src/content/season-XX/` and generate a lightweight chapter manifest during build time. Full prose can then be lazy-loaded per season/chapter, following the same content-first pattern used in Lucy.

## Quality gate

Every pull request runs ESLint and a TypeScript/Vite production build. `main` also has a GitHub Pages deployment workflow.
