import type { Chapter } from '../../domain/types';

interface BookmarksPageProps {
  chapters: Chapter[];
  onOpenChapter: (chapterId: string) => void;
}

export function BookmarksPage({ chapters, onOpenChapter }: BookmarksPageProps) {
  return (
    <div className="page-stack">
      <section className="section-heading section-heading--large">
        <div>
          <p className="eyebrow">Saved locally</p>
          <h2>Bookmarks</h2>
        </div>
        <span>{chapters.length} saved</span>
      </section>

      {chapters.length > 0 ? (
        <div className="bookmark-grid">
          {chapters.map((chapter) => (
            <button className="bookmark-card" key={chapter.id} type="button" onClick={() => onOpenChapter(chapter.id)}>
              <span>S{chapter.season} · Ch {chapter.number}</span>
              <strong>{chapter.title}</strong>
              <p>{chapter.summary}</p>
              <small>{chapter.readingMinutes} min read</small>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>☆</span>
          <h3>No bookmarks yet</h3>
          <p>Save a chapter from the reader and it will appear here on this device.</p>
        </div>
      )}
    </div>
  );
}
