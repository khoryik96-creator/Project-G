import type { Chapter } from '../../domain/types';
import { allChapters, seasons } from '../../domain/storyIndex';

interface LibraryPageProps {
  continueChapter: Chapter | null;
  query: string;
  onQueryChange: (query: string) => void;
  onOpenChapter: (chapterId: string) => void;
}

function matchesQuery(chapter: Chapter, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [chapter.title, chapter.summary, ...chapter.tags]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}

export function LibraryPage({ continueChapter, query, onQueryChange, onOpenChapter }: LibraryPageProps) {
  const matchingCount = allChapters.filter((chapter) => matchesQuery(chapter, query)).length;

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Project G reader</p>
          <h2>Short chapters. Clean reading. No clutter.</h2>
          <p className="hero-panel__copy">
            The starter is structured for serialized light fiction: seasons stay easy to browse, progress is local to the device,
            and the reading surface is designed for phones first.
          </p>
        </div>
        <div className="hero-stats" aria-label="Novel statistics">
          <span><strong>{seasons.length}</strong> seasons</span>
          <span><strong>{allChapters.length}</strong> chapters</span>
        </div>
      </section>

      {continueChapter ? (
        <button className="continue-card" type="button" onClick={() => onOpenChapter(continueChapter.id)}>
          <span className="continue-card__label">Continue reading</span>
          <strong>S{continueChapter.season} · Ch {continueChapter.number} — {continueChapter.title}</strong>
          <span>{continueChapter.summary}</span>
        </button>
      ) : null}

      <section className="archive-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Archive</p>
            <h2>Seasons & chapters</h2>
          </div>
          <span>{query ? `${matchingCount} matches` : `${allChapters.length} total`}</span>
        </div>

        <label className="search-field">
          <span className="sr-only">Search chapters</span>
          <input
            type="search"
            placeholder="Search title, summary or tag…"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>

        <div className="season-list">
          {seasons.map((season) => {
            const visibleChapters = season.chapters.filter((chapter) => matchesQuery(chapter, query));
            if (visibleChapters.length === 0) return null;

            return (
              <details className="season-card" key={season.id} open={Boolean(query) || season.number === 1}>
                <summary>
                  <div>
                    <span>Season {String(season.number).padStart(2, '0')}</span>
                    <strong>{season.title}</strong>
                    <small>{season.subtitle}</small>
                  </div>
                  <span>{visibleChapters.length} ch</span>
                </summary>
                <p className="season-card__description">{season.description}</p>
                <div className="chapter-list">
                  {visibleChapters.map((chapter) => (
                    <button className="chapter-row" type="button" key={chapter.id} onClick={() => onOpenChapter(chapter.id)}>
                      <span className="chapter-row__number">{String(chapter.number).padStart(2, '0')}</span>
                      <span className="chapter-row__body">
                        <strong>{chapter.title}</strong>
                        <small>{chapter.summary}</small>
                        <span className="tag-row">
                          {chapter.tags.map((tag) => <em key={tag}>{tag}</em>)}
                        </span>
                      </span>
                      <span className="chapter-row__time">{chapter.readingMinutes} min</span>
                    </button>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
