import type { CSSProperties } from 'react';
import type { Chapter, ReaderPreferences } from '../../domain/types';
import { allChapters } from '../../domain/storyIndex';

interface ReaderPageProps {
  chapter: Chapter;
  previous: Chapter | null;
  next: Chapter | null;
  isBookmarked: boolean;
  preferences: ReaderPreferences;
  onBack: () => void;
  onOpenChapter: (chapterId: string) => void;
  onToggleBookmark: () => void;
  onPreferencesChange: (preferences: ReaderPreferences) => void;
}

export function ReaderPage({
  chapter,
  previous,
  next,
  isBookmarked,
  preferences,
  onBack,
  onOpenChapter,
  onToggleBookmark,
  onPreferencesChange,
}: ReaderPageProps) {
  const chapterIndex = allChapters.findIndex((item) => item.id === chapter.id);
  const progress = Math.round(((chapterIndex + 1) / allChapters.length) * 100);
  const readerStyle = { '--reader-scale': preferences.fontScale } as CSSProperties;

  function setFontScale(fontScale: number) {
    onPreferencesChange({ ...preferences, fontScale: Math.min(1.25, Math.max(0.9, fontScale)) });
  }

  return (
    <div className="reader-page">
      <div className="reader-toolbar">
        <button type="button" className="text-button" onClick={onBack}>← Library</button>
        <div className="reader-toolbar__tools" aria-label="Reading controls">
          <button type="button" aria-label="Decrease font size" onClick={() => setFontScale(preferences.fontScale - 0.05)}>A−</button>
          <button type="button" aria-label="Increase font size" onClick={() => setFontScale(preferences.fontScale + 0.05)}>A+</button>
          <button
            type="button"
            onClick={() => onPreferencesChange({ ...preferences, width: preferences.width === 'compact' ? 'comfortable' : 'compact' })}
          >
            {preferences.width === 'compact' ? 'Wider' : 'Narrower'}
          </button>
          <button
            type="button"
            onClick={() => onPreferencesChange({ ...preferences, theme: preferences.theme === 'night' ? 'paper' : 'night' })}
          >
            {preferences.theme === 'night' ? 'Paper' : 'Night'}
          </button>
          <button type="button" className={isBookmarked ? 'is-active' : undefined} onClick={onToggleBookmark}>
            {isBookmarked ? '★ Saved' : '☆ Save'}
          </button>
        </div>
      </div>

      <div className="reader-progress" aria-label={`Reading progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <article
        className={`reader-card reader-card--${preferences.theme} reader-card--${preferences.width}`}
        style={readerStyle}
      >
        <header className="reader-header">
          <p>Season {chapter.season} · Chapter {chapter.number} · {chapter.readingMinutes} min</p>
          <h1>{chapter.title}</h1>
          <span>{chapter.summary}</span>
        </header>

        <div className="reader-prose">
          {chapter.segments.map((segment, index) => {
            if (segment.kind === 'break') {
              return <div className="scene-break" key={`${chapter.id}-${index}`}><span>{segment.label ?? '◆'}</span></div>;
            }

            if (segment.kind === 'dialogue') {
              return (
                <blockquote className={`dialogue dialogue--${segment.accent ?? 'neutral'}`} key={`${chapter.id}-${index}`}>
                  <strong>{segment.speaker}</strong>
                  <p>“{segment.text}”</p>
                </blockquote>
              );
            }

            return <p key={`${chapter.id}-${index}`}>{segment.text}</p>;
          })}
        </div>

        <footer className="reader-footer">
          <p>End of Chapter {chapter.number}</p>
          <div className="reader-footer__actions">
            {previous ? (
              <button type="button" onClick={() => onOpenChapter(previous.id)}>
                <span>Previous</span><strong>{previous.title}</strong>
              </button>
            ) : <span />}
            {next ? (
              <button type="button" onClick={() => onOpenChapter(next.id)}>
                <span>Next</span><strong>{next.title}</strong>
              </button>
            ) : <span />}
          </div>
        </footer>
      </article>
    </div>
  );
}
