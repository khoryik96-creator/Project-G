import type { ReaderPreferences } from '../../domain/types';

const BOOKMARKS_KEY = 'projectG.bookmarks.v1';
const LAST_READ_KEY = 'projectG.lastRead.v1';
const PREFERENCES_KEY = 'projectG.preferences.v1';

export const defaultPreferences: ReaderPreferences = {
  theme: 'night',
  fontScale: 1,
  width: 'compact',
};

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Reading must keep working even when storage is unavailable.
  }
}

export function loadBookmarks(): string[] {
  const value = readJson<unknown>(BOOKMARKS_KEY);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function saveBookmarks(bookmarks: string[]) {
  writeJson(BOOKMARKS_KEY, bookmarks);
}

export function loadLastRead(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(LAST_READ_KEY);
  } catch {
    return null;
  }
}

export function saveLastRead(chapterId: string) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LAST_READ_KEY, chapterId);
  } catch {
    // Non-critical enhancement only.
  }
}

export function loadPreferences(): ReaderPreferences {
  const value = readJson<Partial<ReaderPreferences>>(PREFERENCES_KEY);
  const theme = value?.theme === 'paper' ? 'paper' : 'night';
  const width = value?.width === 'comfortable' ? 'comfortable' : 'compact';
  const fontScale = typeof value?.fontScale === 'number' && Number.isFinite(value.fontScale)
    ? Math.min(1.25, Math.max(0.9, value.fontScale))
    : defaultPreferences.fontScale;

  return { theme, width, fontScale };
}

export function savePreferences(preferences: ReaderPreferences) {
  writeJson(PREFERENCES_KEY, preferences);
}
