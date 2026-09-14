import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from './siteConfig';
import { readRoute, routeHash, type Route } from './router';
import { BookmarksPage } from '../features/bookmarks/BookmarksPage';
import { LibraryPage } from '../features/library/LibraryPage';
import { ReaderPage } from '../features/reader/ReaderPage';
import {
  defaultPreferences,
  loadBookmarks,
  loadLastRead,
  loadPreferences,
  saveBookmarks,
  saveLastRead,
  savePreferences,
} from '../features/reader/storage';
import { allChapters, chapterMap, getChapterNeighbors } from '../domain/storyIndex';
import type { ReaderPreferences } from '../domain/types';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadBookmarks());
  const [lastRead, setLastRead] = useState<string | null>(() => loadLastRead());
  const [preferences, setPreferences] = useState<ReaderPreferences>(() => loadPreferences() ?? defaultPreferences);
  const [query, setQuery] = useState('');
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    const onInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    if (route.view !== 'reader' || !chapterMap.has(route.chapterId)) return;
    setLastRead(route.chapterId);
    saveLastRead(route.chapterId);
  }, [route]);

  useEffect(() => {
    savePreferences(preferences);
    document.documentElement.dataset.appTheme = preferences.theme;
  }, [preferences]);

  const currentChapter = route.view === 'reader' ? (chapterMap.get(route.chapterId) ?? null) : null;
  const continueChapter = lastRead ? (chapterMap.get(lastRead) ?? null) : allChapters[0] ?? null;
  const bookmarkedChapters = useMemo(
    () => bookmarks.map((id) => chapterMap.get(id)).filter((chapter) => chapter !== undefined),
    [bookmarks],
  );
  const canInstall = Boolean(installPrompt) && !isInstalled;

  function navigate(nextRoute: Route) {
    const nextHash = routeHash(nextRoute);
    if (window.location.hash === nextHash) {
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = nextHash;
  }

  function openChapter(chapterId: string) {
    navigate({ view: 'reader', chapterId });
  }

  async function installApp() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }

  function toggleBookmark(chapterId: string) {
    setBookmarks((current) => {
      const next = current.includes(chapterId)
        ? current.filter((id) => id !== chapterId)
        : [...current, chapterId];
      saveBookmarks(next);
      return next;
    });
  }

  let page;
  if (currentChapter) {
    const neighbors = getChapterNeighbors(currentChapter.id);
    page = (
      <ReaderPage
        chapter={currentChapter}
        previous={neighbors.previous}
        next={neighbors.next}
        isBookmarked={bookmarks.includes(currentChapter.id)}
        preferences={preferences}
        onBack={() => navigate({ view: 'library' })}
        onOpenChapter={openChapter}
        onToggleBookmark={() => toggleBookmark(currentChapter.id)}
        onPreferencesChange={setPreferences}
      />
    );
  } else if (route.view === 'bookmarks') {
    page = <BookmarksPage chapters={bookmarkedChapters} onOpenChapter={openChapter} />;
  } else {
    page = (
      <LibraryPage
        continueChapter={continueChapter}
        query={query}
        onQueryChange={setQuery}
        onOpenChapter={openChapter}
      />
    );
  }

  const activeView = currentChapter ? 'reader' : route.view;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" type="button" onClick={() => navigate({ view: 'library' })}>
          <span className="brand__mark">{siteConfig.mark}</span>
          <span><small>{siteConfig.eyebrow}</small><strong>{siteConfig.title}</strong></span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button className={activeView === 'library' ? 'is-active' : undefined} type="button" onClick={() => navigate({ view: 'library' })}>
            <span>01</span><strong>Library</strong>
          </button>
          <button className={activeView === 'bookmarks' ? 'is-active' : undefined} type="button" onClick={() => navigate({ view: 'bookmarks' })}>
            <span>02</span><strong>Bookmarks</strong><em>{bookmarks.length}</em>
          </button>
          {canInstall ? (
            <button type="button" onClick={() => void installApp()}>
              <span>↧</span><strong>Install app</strong>
            </button>
          ) : null}
        </nav>
        <div className="sidebar-note">
          <span className="status-dot" />
          <p>{isInstalled ? 'Installed app mode. Your reading progress stays on this device.' : siteConfig.description}</p>
        </div>
      </aside>

      <div className="main-column">
        <header className="mobile-header">
          <button className="mobile-brand" type="button" onClick={() => navigate({ view: 'library' })}>
            <span>{siteConfig.mark}</span><strong>{siteConfig.title}</strong>
          </button>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {canInstall ? (
              <button className="mobile-continue" type="button" onClick={() => void installApp()}>Install</button>
            ) : null}
            {continueChapter ? (
              <button className="mobile-continue" type="button" onClick={() => openChapter(continueChapter.id)}>Continue</button>
            ) : null}
          </div>
        </header>

        <main className="content">{page}</main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <button className={activeView === 'library' ? 'is-active' : undefined} type="button" onClick={() => navigate({ view: 'library' })}>
          <span>⌂</span><strong>Library</strong>
        </button>
        <button className={activeView === 'bookmarks' ? 'is-active' : undefined} type="button" onClick={() => navigate({ view: 'bookmarks' })}>
          <span>☆</span><strong>Saved</strong>
        </button>
        {currentChapter ? (
          <button className="is-active" type="button" onClick={() => openChapter(currentChapter.id)}>
            <span>¶</span><strong>Reading</strong>
          </button>
        ) : null}
      </nav>
    </div>
  );
}
