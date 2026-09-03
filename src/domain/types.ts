export type ReaderTheme = 'night' | 'paper';
export type ReaderWidth = 'compact' | 'comfortable';

export interface ReaderPreferences {
  theme: ReaderTheme;
  fontScale: number;
  width: ReaderWidth;
}

export interface ParagraphSegment {
  kind: 'paragraph';
  text: string;
}

export interface DialogueSegment {
  kind: 'dialogue';
  speaker: string;
  text: string;
  accent?: 'primary' | 'secondary' | 'neutral';
}

export interface BreakSegment {
  kind: 'break';
  label?: string;
}

export type StorySegment = ParagraphSegment | DialogueSegment | BreakSegment;

export interface Chapter {
  id: string;
  season: number;
  number: number;
  title: string;
  summary: string;
  readingMinutes: number;
  tags: string[];
  segments: StorySegment[];
}

export interface Season {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  chapters: Chapter[];
}
