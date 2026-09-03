import { seasons } from '../content/story';

export { seasons };

export const allChapters = seasons.flatMap((season) => season.chapters);
export const chapterMap = new Map(allChapters.map((chapter) => [chapter.id, chapter] as const));

export function getChapterNeighbors(chapterId: string) {
  const index = allChapters.findIndex((chapter) => chapter.id === chapterId);

  if (index < 0) {
    return { previous: null, next: null };
  }

  return {
    previous: allChapters[index - 1] ?? null,
    next: allChapters[index + 1] ?? null,
  };
}
