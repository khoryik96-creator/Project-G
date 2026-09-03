export type Route =
  | { view: 'library' }
  | { view: 'bookmarks' }
  | { view: 'reader'; chapterId: string };

export function readRoute(): Route {
  if (typeof window === 'undefined') return { view: 'library' };

  const raw = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));

  if (raw.startsWith('reader/')) {
    const chapterId = raw.slice('reader/'.length);
    if (chapterId) return { view: 'reader', chapterId };
  }

  if (raw === 'bookmarks') return { view: 'bookmarks' };
  return { view: 'library' };
}

export function routeHash(route: Route): string {
  if (route.view === 'reader') return `#/reader/${encodeURIComponent(route.chapterId)}`;
  return `#/${route.view}`;
}
