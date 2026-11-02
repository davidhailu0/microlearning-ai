/** Draft shapes for hand-authored book courses (mirror lib/ai/schema.ts). */

export type DraftDiagram = {
  type: "process" | "cycle" | "hierarchy" | "compare";
  title: string;
  nodes: { id: string; label: string; emphasis: boolean }[];
  edges: { from: string; to: string; label: string }[];
};

export type DraftLesson = {
  title: string;
  objective: string;
  hook: string;
  paragraphs: string[];
  bullets: string[];
  takeaway: string;
  diagram: DraftDiagram | null;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  flashcards: { front: string; back: string }[];
  sourceRef: {
    label: string;
    pageStart: number | null;
    pageEnd: number | null;
    note: string;
    sectionIndexes: number[];
  };
  /** EPUB only: chapter heading(s) used to resolve section indexes at persist time. */
  chapters?: string[];
  estimatedMinutes?: number;
};

export type DraftModule = {
  title: string;
  summary: string;
  lessons: DraftLesson[];
};

export type DraftCourse = {
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  coverEmoji: string;
  tags: string[];
  modules: DraftModule[];
};
