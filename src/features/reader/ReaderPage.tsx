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

interface DialoguePalette {
  color: string;
  background: string;
  shadow: string;
}

const namedDialoguePalettes: Record<string, { night: DialoguePalette; paper: DialoguePalette }> = {
  'Xu Kai': {
    night: { color: '#e3bd72', background: 'rgba(227, 189, 114, 0.09)', shadow: 'rgba(227, 189, 114, 0.08)' },
    paper: { color: '#7a571d', background: 'rgba(122, 87, 29, 0.08)', shadow: 'rgba(122, 87, 29, 0.06)' },
  },
  'Jian Yue': {
    night: { color: '#ef8f9f', background: 'rgba(239, 143, 159, 0.09)', shadow: 'rgba(239, 143, 159, 0.08)' },
    paper: { color: '#98384b', background: 'rgba(152, 56, 75, 0.08)', shadow: 'rgba(152, 56, 75, 0.06)' },
  },
};

const fallbackDialoguePalettes = [
  {
    night: { color: '#90c9d8', background: 'rgba(144, 201, 216, 0.08)', shadow: 'rgba(144, 201, 216, 0.07)' },
    paper: { color: '#356f7d', background: 'rgba(53, 111, 125, 0.07)', shadow: 'rgba(53, 111, 125, 0.05)' },
  },
  {
    night: { color: '#b9a2e8', background: 'rgba(185, 162, 232, 0.08)', shadow: 'rgba(185, 162, 232, 0.07)' },
    paper: { color: '#674d9b', background: 'rgba(103, 77, 155, 0.07)', shadow: 'rgba(103, 77, 155, 0.05)' },
  },
  {
    night: { color: '#8fd0ae', background: 'rgba(143, 208, 174, 0.08)', shadow: 'rgba(143, 208, 174, 0.07)' },
    paper: { color: '#3f795d', background: 'rgba(63, 121, 93, 0.07)', shadow: 'rgba(63, 121, 93, 0.05)' },
  },
  {
    night: { color: '#e7a87a', background: 'rgba(231, 168, 122, 0.08)', shadow: 'rgba(231, 168, 122, 0.07)' },
    paper: { color: '#91582f', background: 'rgba(145, 88, 47, 0.07)', shadow: 'rgba(145, 88, 47, 0.05)' },
  },
];

function paletteForSpeaker(speaker: string, theme: ReaderPreferences['theme']): DialoguePalette {
  const named = namedDialoguePalettes[speaker];
  if (named) return named[theme];

  let hash = 0;
  for (const character of speaker) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return fallbackDialoguePalettes[hash % fallbackDialoguePalettes.length][theme];
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
              const palette = paletteForSpeaker(segment.speaker, preferences.theme);
              const dialogueStyle: CSSProperties = {
                border: `1px solid ${palette.color}`,
                borderLeft: `4px solid ${palette.color}`,
                borderRadius: '14px',
                background: palette.background,
                padding: '14px 16px',
                boxShadow: `0 10px 28px ${palette.shadow}`,
              };

              return (
                <blockquote
                  className={`dialogue dialogue--${segment.accent ?? 'neutral'}`}
                  style={dialogueStyle}
                  key={`${chapter.id}-${index}`}
                >
                  <strong style={{ color: palette.color }}>{segment.speaker}</strong>
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
