export type DiagramType = "process" | "cycle" | "hierarchy" | "compare";

export type DiagramSpec = {
  type: DiagramType;
  title: string;
  nodes: { id: string; label: string; emphasis: boolean }[];
  edges: { from: string; to: string; label: string }[];
};

export type Block =
  | { type: "hook"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "takeaway"; text: string }
  | { type: "callout"; text: string; tone?: "info" | "warning" | "success" }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "diagram"; diagram: DiagramSpec }
  | { type: "stat"; value: string; label: string; source?: string }
  | { type: "definition"; term: string; text: string }
  | {
      type: "comparison";
      left: { title: string; points: string[] };
      right: { title: string; points: string[] };
    }
  | { type: "image"; url: string; alt: string; caption?: string };

export type CourseSummary = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  coverEmoji: string;
  coverColor: string;
  estimatedMinutes: number;
  lessonCount: number;
  isCurated: boolean;
  sourceKind: string;
  tags: string[];
};

export type ActiveCourse = CourseSummary & {
  percent: number;
  completedLessons: number;
  currentLessonId: string | null;
  currentLessonTitle: string | null;
  lastActivityAt: string;
};

/** A course the user generated, shown in their history regardless of progress. */
export type UserCourse = CourseSummary & {
  percent: number;
  completedLessons: number;
  currentLessonId: string | null;
  createdAt: string;
  lastActivityAt: string | null;
  sourceTitle: string | null;
};

export type DashboardData = {
  user: { id: string; name: string; avatarUrl: string | null; xp: number; level: number };
  streak: { current: number; longest: number; friendStreak: number };
  dueCount: number;
  active: ActiveCourse[];
  history: UserCourse[];
  curated: CourseSummary[];
  stats: { lessonsThisWeek: number; minutesThisWeek: number; reviewsToday: number };
};

export type LessonOutlineItem = {
  id: string;
  position: number;
  title: string;
  objective: string;
  estimatedMinutes: number;
  completed: boolean;
};

export type CourseDetail = CourseSummary & {
  percent: number;
  completedLessons: number;
  nextLessonId: string | null;
  /** Present when the course was generated from a whole book. */
  coverage: {
    sections: number;
    words: number;
    throughline: string | null;
  } | null;
  modules: {
    id: string;
    title: string;
    summary: string;
    lessons: LessonOutlineItem[];
  }[];
};

export type QuizView = {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  passScore: number;
  points: number;
};

export type LessonDetail = {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  position: number;
  totalLessons: number;
  title: string;
  objective: string;
  takeaway: string;
  estimatedMinutes: number;
  xpReward: number;
  blocks: Block[];
  audioUrl: string | null;
  audioStatus: "none" | "queued" | "generating" | "ready" | "failed";
  quiz: QuizView | null;
  /** Chapter/page provenance for book-derived lessons. */
  sourceRef: {
    label: string;
    pageStart: number | null;
    pageEnd: number | null;
    note: string;
    sectionIndexes: number[];
  } | null;
  nextLessonId: string | null;
  prevLessonId: string | null;
  completed: boolean;
};

export type DueCard = {
  flashcardId: string;
  lessonId: string | null;
  courseId: string;
  courseTitle: string;
  concept: string;
  front: string;
  back: string;
  due: string;
  state: string;
  reps: number;
  retrievability: number;
  previews: { hard: string; good: string; easy: string };
};

export type GenerateInput = {
  kind: "prompt" | "text" | "url";
  /** Original file format after client-side ingestion, so history can label it. */
  sourceKind?: "pdf" | "epub";
  prompt?: string;
  text?: string;
  url?: string;
  title?: string;
  lessonCount?: number;
  level?: "beginner" | "intermediate" | "advanced";
};

export type JobView = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  stage: string;
  progress: number;
  courseId: string | null;
  error: string | null;
  result: { courseId?: string; lessonId?: string } | null;
};
