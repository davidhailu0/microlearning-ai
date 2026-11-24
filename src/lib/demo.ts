import { emptyCard, gradeStoredCard, previewIntervals, type Grade } from "@/lib/fsrs";
import { buildDiagramBlock, buildExampleBlock } from "@/lib/lesson-aids";
import { checkpointRanges } from "@/lib/checkpoints";
import { demoUserId } from "@/lib/env";
import { levelForXp } from "@/lib/text";
import type { CourseDraft, LessonDraft } from "@/lib/ai/schema";
import type {
  ActiveCourse,
  Block,
  CheckpointReview,
  CourseDetail,
  CourseSummary,
  DashboardData,
  DueCard,
  JobView,
  LessonDetail,
  QuizView,
  UserCourse,
} from "@/lib/types";

/* ------------------------------------------------------------------- types */

type DemoQuiz = {
  id: string;
  question: string;
  options: { id: string; label: string; isCorrect: boolean }[];
  explanation: string;
  passScore: number;
  points: number;
};

type DemoCard = { id: string; front: string; back: string; concept: string };

type DemoLessonRecord = {
  id: string;
  courseId: string;
  moduleId: string;
  position: number;
  title: string;
  objective: string;
  hook: string;
  summary: string;
  takeaway: string;
  estimatedMinutes: number;
  xpReward: number;
  blocks: Block[];
  quiz: DemoQuiz | null;
  extraQuiz: DemoQuiz | null;
  cards: DemoCard[];
  sourceRef: LessonDetail["sourceRef"];
  audioUrl: string | null;
  audioStatus: "none" | "queued" | "generating" | "ready" | "failed";
};

type DemoModuleRecord = {
  id: string;
  courseId: string;
  position: number;
  title: string;
  summary: string;
};

type DemoCourseRecord = {
  summary: CourseSummary;
  sourceTitle: string | null;
  sourceAuthor: string | null;
  sourceUrl: string | null;
  coverage: CourseDetail["coverage"];
  createdAt: string;
  modules: DemoModuleRecord[];
  lessons: DemoLessonRecord[];
  completed: Set<string>;
  checkpointReviews: Map<number, { score: number; total: number; completedAt: string }>;
  currentLessonId: string | null;
};

type DemoJob = JobView & { payload: Record<string, unknown> };

type DemoState = {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    xp: number;
    timezone: string;
  };
  streak: { current: number; longest: number; lastActiveDate: string | null };
  courses: Map<string, DemoCourseRecord>;
  cards: Map<string, { flashcardId: string; front: string; back: string; concept: string; courseId: string; lessonId: string | null }>;
  cardStates: Map<string, ReturnType<typeof emptyCard>>;
  jobs: Map<string, DemoJob>;
  stats: { lessonsThisWeek: number; minutesThisWeek: number; reviewsToday: number };
};

const g = globalThis as unknown as { __lumenDemo?: DemoState };

function state(): DemoState {
  g.__lumenDemo ??= seed();
  return g.__lumenDemo;
}

/* -------------------------------------------------------------------- seed */

function blocksFromDraft(draft: LessonDraft): Block[] {
  const blocks: Block[] = [{ type: "hook", text: draft.hook }];
  for (const paragraph of draft.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
  blocks.push({ type: "bullets", items: draft.bullets });
  const example = buildExampleBlock(draft.steps);
  if (example) blocks.push(example);
  if (draft.steps?.length) {
    blocks.push({ type: "steps", title: "Do it yourself", items: draft.steps });
  }
  if (draft.diagram) {
    blocks.push({ type: "diagram", diagram: draft.diagram });
  } else {
    const diagram = buildDiagramBlock(draft.title, draft.steps);
    if (diagram) blocks.push(diagram);
  }
  blocks.push({ type: "takeaway", text: draft.takeaway });
  return blocks;
}

export function addDemoCourse(
  draft: CourseDraft,
  meta: {
    sourceKind: string;
    sourceTitle?: string;
    sourceAuthor?: string;
    sourceUrl?: string;
    metadata?: Record<string, unknown>;
  },
): string {
  const store = state();
  const courseId = crypto.randomUUID();
  const summary: CourseSummary = {
    id: courseId,
    title: draft.title,
    description: draft.description,
    category: draft.category || "General",
    level: draft.level,
    coverEmoji: draft.coverEmoji || "📘",
    coverColor: "amber",
    estimatedMinutes: draft.modules.reduce(
      (sum, module) =>
        sum +
        module.lessons.reduce(
          (lessonSum, lesson) => lessonSum + (lesson.estimatedMinutes ?? 3),
          0,
        ),
      0,
    ),
    lessonCount: draft.modules.reduce((sum, module) => sum + module.lessons.length, 0),
    isCurated: false,
    sourceKind: meta.sourceKind,
    tags: draft.tags,
  };

  const modules: DemoModuleRecord[] = draft.modules.map((module, moduleIndex) => ({
    id: crypto.randomUUID(),
    courseId,
    position: moduleIndex,
    title: module.title,
    summary: module.summary,
  }));

  let position = 0;
  const lessons: DemoLessonRecord[] = [];
  for (const [moduleIndex, module] of draft.modules.entries()) {
    for (const item of module.lessons) {
      const id = crypto.randomUUID();
      const quizId = crypto.randomUUID();
      const cards: DemoCard[] = item.flashcards.map((card) => ({
        id: crypto.randomUUID(),
        front: card.front,
        back: card.back,
        concept: item.title,
      }));

      lessons.push({
        id,
        courseId,
        moduleId: modules[moduleIndex].id,
        position: position++,
        title: item.title,
        objective: item.objective,
        hook: item.hook,
        summary: item.takeaway,
        takeaway: item.takeaway,
        estimatedMinutes: item.estimatedMinutes ?? 3,
        xpReward: 20,
        blocks: blocksFromDraft(item),
        quiz: {
          id: quizId,
          question: item.quiz.question,
          options: item.quiz.options.map((label, index) => ({
            id: crypto.randomUUID(),
            label,
            isCorrect: index === item.quiz.correctIndex,
          })),
          explanation: item.quiz.explanation,
          passScore: 60,
          points: 10,
        },
        extraQuiz: null,
        cards,
        sourceRef: item.sourceRef ?? null,
        audioUrl: null,
        audioStatus: "none" as const,
      });

      for (const card of cards) {
        store.cards.set(card.id, {
          flashcardId: card.id,
          front: card.front,
          back: card.back,
          concept: card.concept,
          courseId,
          lessonId: id,
        });
      }
    }
  }

  // Every demo lesson gets a second checkpoint question from its first card.
  const allCards = lessons.flatMap((lesson) => lesson.cards);
  for (const lesson of lessons) {
    const card = lesson.cards[0];
    if (!card) continue;
    const distractors = [
      ...new Set(
        allCards
          .filter((other) => other.id !== card.id && other.back !== card.back)
          .map((other) => other.back),
      ),
    ].slice(0, 3);
    if (distractors.length < 3) continue;

    const correctIndex = lesson.position % 4;
    const labels = [...distractors];
    labels.splice(correctIndex, 0, card.back);
    lesson.extraQuiz = {
      id: crypto.randomUUID(),
      question: `What does “${card.front}” mean?`,
      options: labels.map((label, index) => ({
        id: crypto.randomUUID(),
        label,
        isCorrect: index === correctIndex,
      })),
      explanation: `${card.front}: ${card.back}`,
      passScore: 60,
      points: 10,
    };
  }

  const metaRecord = meta.metadata as
    | { bookMode?: boolean; sections?: number; words?: number; throughline?: string }
    | undefined;

  store.courses.set(courseId, {
    summary,
    sourceTitle: meta.sourceTitle ?? null,
    sourceAuthor: meta.sourceAuthor ?? null,
    sourceUrl: meta.sourceUrl ?? null,
    coverage:
      metaRecord?.bookMode && metaRecord.sections
        ? {
            sections: metaRecord.sections,
            words: metaRecord.words ?? 0,
            throughline: metaRecord.throughline ?? null,
          }
        : null,
    createdAt: new Date().toISOString(),
    modules,
    lessons,
    completed: new Set(),
    checkpointReviews: new Map(),
    currentLessonId: lessons[0]?.id ?? null,
  });

  return courseId;
}

/**
 * Cards are authored with the course but only enter the review schedule once
 * the learner finishes the lesson. Otherwise a freshly generated course would
 * dump dozens of unseen cards into today's queue.
 */
export function ensureDemoCardStates(lessonId: string) {
  const store = state();
  const course = [...store.courses.values()].find((item) =>
    item.lessons.some((lesson) => lesson.id === lessonId),
  );
  if (!course) return;

  const lesson = course.lessons.find((item) => item.id === lessonId);
  if (!lesson) return;

  const now = new Date();
  for (const card of lesson.cards) {
    if (store.cardStates.has(card.id)) continue;
    store.cardStates.set(card.id, emptyCard(now));
  }
}

function seed(): DemoState {
  const store: DemoState = {
    user: {
      id: demoUserId,
      name: "Alex Rivera",
      email: "alex@example.com",
      avatarUrl: null,
      xp: 2480,
      timezone: "UTC",
    },
    streak: { current: 7, longest: 21, lastActiveDate: null },
    courses: new Map(),
    cards: new Map(),
    cardStates: new Map(),
    jobs: new Map(),
    stats: { lessonsThisWeek: 0, minutesThisWeek: 0, reviewsToday: 0 },
  };

  g.__lumenDemo = store;

  return store;
}

/* ---------------------------------------------------------------- reading */

function summaryOf(course: DemoCourseRecord): CourseSummary {
  return {
    ...course.summary,
    lessonCount: course.lessons.length,
    estimatedMinutes: course.lessons.reduce(
      (sum, lesson) => sum + lesson.estimatedMinutes,
      0,
    ),
  };
}

function percentOf(course: DemoCourseRecord) {
  if (!course.lessons.length) return 0;
  return Math.round((course.completed.size / course.lessons.length) * 100);
}

export function demoUserCourses(limit = 50): UserCourse[] {
  return [...state().courses.values()]
    .filter((course) => !course.summary.isCurated)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((course) => ({
      ...summaryOf(course),
      percent: percentOf(course),
      completedLessons: course.completed.size,
      currentLessonId: course.currentLessonId,
      createdAt: course.createdAt,
      lastActivityAt: null,
      sourceTitle: course.sourceTitle,
    }));
}

export function demoDashboard(): DashboardData {
  const store = state();
  const now = Date.now();
  const dueCount = [...store.cardStates.values()].filter(
    (card) => new Date(card.due).getTime() <= now,
  ).length;

  const active: ActiveCourse[] = [...store.courses.values()]
    .filter((course) => course.completed.size > 0 && course.completed.size < course.lessons.length)
    .map((course) => {
      const current = course.lessons.find((lesson) => lesson.id === course.currentLessonId);
      return {
        ...summaryOf(course),
        percent: percentOf(course),
        completedLessons: course.completed.size,
        currentLessonId: course.currentLessonId,
        currentLessonTitle: current?.title ?? null,
        lastActivityAt: new Date(now - 2 * 3_600_000).toISOString(),
      };
    });

  return {
    user: {
      id: store.user.id,
      name: store.user.name,
      avatarUrl: store.user.avatarUrl,
      xp: store.user.xp,
      level: levelForXp(store.user.xp),
    },
    streak: {
      current: store.streak.current,
      longest: store.streak.longest,
      friendStreak: 3,
    },
    dueCount,
    active,
    history: demoUserCourses(6),
    stats: store.stats,
  };
}

export function demoCourse(courseId: string): CourseDetail | null {
  const record = state().courses.get(courseId);
  if (!record) return null;

  return {
    ...summaryOf(record),
    percent: percentOf(record),
    completedLessons: record.completed.size,
    nextLessonId:
      record.lessons.find((lesson) => !record.completed.has(lesson.id))?.id ?? null,
    coverage: record.coverage,
    modules: record.modules.map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      lessons: record.lessons
        .filter((lesson) => lesson.moduleId === module.id)
        .map((lesson) => ({
          id: lesson.id,
          position: lesson.position,
          title: lesson.title,
          objective: lesson.objective,
          estimatedMinutes: lesson.estimatedMinutes,
          completed: record.completed.has(lesson.id),
        })),
    })),
    checkpointReviews: [...record.checkpointReviews.entries()].map(([index, review]) => ({
      index,
      ...review,
    })),
  };
}

export function demoCheckpointReview(
  courseId: string,
  checkpointIndex: number,
): CheckpointReview | null {
  const record = state().courses.get(courseId);
  if (!record) return null;

  const ranges = checkpointRanges(record.lessons.length);
  const range = ranges[checkpointIndex - 1];
  if (!range) return null;

  const group = record.lessons.slice(range.start, range.end);
  const questions: CheckpointReview["questions"] = [];
  const toQuestion = (quiz: DemoQuiz, lesson: DemoLessonRecord): CheckpointReview["questions"][number] => ({
    id: quiz.id,
    questionId: quiz.id,
    question: quiz.question,
    options: quiz.options.map(({ id, label }) => ({ id, label })),
    passScore: quiz.passScore,
    points: quiz.points,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonPosition: lesson.position + 1,
  });

  for (const lesson of group) {
    if (lesson.quiz) questions.push(toQuestion(lesson.quiz, lesson));
    if (lesson.extraQuiz) questions.push(toQuestion(lesson.extraQuiz, lesson));
  }
  const saved = record.checkpointReviews.get(checkpointIndex);

  return {
    courseId,
    courseTitle: record.summary.title,
    index: checkpointIndex,
    totalCheckpoints: ranges.length,
    fromLesson: group[0].position + 1,
    toLesson: group[group.length - 1].position + 1,
    locked: group.some((lesson) => !record.completed.has(lesson.id)),
    completedLessons: group.filter((lesson) => record.completed.has(lesson.id)).length,
    totalLessons: group.length,
    lessons: group.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      position: lesson.position + 1,
      takeaway: lesson.takeaway,
    })),
    questions,
    completed: Boolean(saved),
    bestScore: saved?.score ?? null,
    bestTotal: saved?.total ?? null,
  };
}

export function demoRecordCheckpointReview(
  courseId: string,
  checkpointIndex: number,
  score: number,
  total: number,
) {
  const record = state().courses.get(courseId);
  if (!record) return;
  const previous = record.checkpointReviews.get(checkpointIndex);
  record.checkpointReviews.set(checkpointIndex, {
    score: Math.max(previous?.score ?? 0, score),
    total,
    completedAt: previous?.completedAt ?? new Date().toISOString(),
  });
}

function quizView(quiz: DemoQuiz): QuizView {
  return {
    id: quiz.id,
    questionId: quiz.id,
    question: quiz.question,
    options: quiz.options.map(({ id, label }) => ({ id, label })),
    passScore: quiz.passScore,
    points: quiz.points,
  };
}

export function demoLesson(lessonId: string): LessonDetail | null {
  const store = state();
  for (const course of store.courses.values()) {
    const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;
    const record = course.lessons[index];
    const moduleRecord = course.modules.find((item) => item.id === record.moduleId);

    return {
      id: record.id,
      courseId: course.summary.id,
      courseTitle: course.summary.title,
      moduleTitle: moduleRecord?.title ?? "",
      position: record.position,
      totalLessons: course.lessons.length,
      title: record.title,
      objective: record.objective,
      takeaway: record.takeaway,
      estimatedMinutes: record.estimatedMinutes,
      xpReward: record.xpReward,
      blocks: record.blocks,
      audioUrl: record.audioUrl,
      audioStatus: record.audioStatus,
      quiz: record.quiz ? quizView(record.quiz) : null,
      extraQuizzes: record.extraQuiz ? [quizView(record.extraQuiz)] : [],
      sourceRef: record.sourceRef,
      nextLessonId: course.lessons[index + 1]?.id ?? null,
      prevLessonId: course.lessons[index - 1]?.id ?? null,
      completed: course.completed.has(record.id),
    };
  }
  return null;
}

export function demoDueCards(limit = 30): DueCard[] {
  const store = state();
  const now = new Date();
  const due: DueCard[] = [];

  for (const [id, card] of store.cards) {
    const cardState = store.cardStates.get(id);
    if (!cardState) continue;
    if (new Date(cardState.due).getTime() > now.getTime()) continue;

    const course = store.courses.get(card.courseId);
    due.push({
      flashcardId: id,
      lessonId: card.lessonId,
      courseId: card.courseId,
      courseTitle: course?.summary.title ?? "Course",
      concept: card.concept,
      front: card.front,
      back: card.back,
      due: new Date(cardState.due).toISOString(),
      state: cardState.state,
      reps: cardState.reps,
      retrievability: cardState.retrievability,
      previews: previewIntervals(cardState, now),
    });
  }

  return due
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, limit);
}

export function demoGradeCard(flashcardId: string, grade: Grade) {
  const store = state();
  const current = store.cardStates.get(flashcardId);
  if (!current) throw new Error("Card not found");

  const now = new Date();
  const next = gradeStoredCard(current, grade, now);
  store.cardStates.set(flashcardId, {
    due: next.due,
    stability: next.stability,
    difficulty: next.difficulty,
    elapsedDays: next.elapsedDays,
    scheduledDays: next.scheduledDays,
    learningSteps: next.learningSteps,
    reps: next.reps,
    lapses: next.lapses,
    state: next.state,
    lastReview: next.lastReview,
    retrievability: next.retrievability,
  });

  store.user.xp += 8;
  store.stats.reviewsToday += 1;

  return {
    nextDue: next.due.toISOString(),
    interval: next.scheduledDays ? `${next.scheduledDays}d` : "soon",
    previews: previewIntervals(store.cardStates.get(flashcardId)!, now),
  };
}

export function demoSubmitQuiz(quizId: string, optionId: string) {
  for (const course of state().courses.values()) {
    for (const lesson of course.lessons) {
      for (const quiz of [lesson.quiz, lesson.extraQuiz]) {
        if (!quiz || quiz.id !== quizId) continue;
        const correct = quiz.options.find((option) => option.isCorrect);
        const isCorrect = correct?.id === optionId;
        if (isCorrect) state().user.xp += quiz.points;
        return {
          correct: Boolean(isCorrect),
          correctOptionId: correct?.id ?? null,
          explanation: quiz.explanation,
          points: isCorrect ? quiz.points : 0,
        };
      }
    }
  }
  throw new Error("Quiz not found");
}

export function demoCompleteLesson(lessonId: string) {
  const store = state();
  for (const course of store.courses.values()) {
    const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;

    course.completed.add(lessonId);
    const next = course.lessons[index + 1] ?? null;
    course.currentLessonId = next?.id ?? null;
    store.user.xp += course.lessons[index].xpReward;
    ensureDemoCardStates(lessonId);

    return {
      nextLessonId: next?.id ?? null,
      percent: percentOf(course),
      courseId: course.summary.id,
    };
  }
  throw new Error("Lesson not found");
}

/* ------------------------------------------------------------------- jobs */

export function demoCreateJob(kind: "course_generation" | "tts", payload: Record<string, unknown>) {
  const id = crypto.randomUUID();
  state().jobs.set(id, {
    id,
    status: "queued",
    stage: kind === "course_generation" ? "Queued" : "Preparing audio",
    progress: 0,
    courseId: null,
    error: null,
    result: null,
    payload,
  });
  return id;
}

export function demoJob(id: string): JobView | null {
  const job = state().jobs.get(id);
  if (!job) return null;
  return {
    id: job.id,
    status: job.status,
    stage: job.stage,
    progress: job.progress,
    courseId: job.courseId,
    error: job.error,
    result: job.result,
  };
}

export function demoUpdateJob(id: string, patch: Partial<DemoJob>) {
  const job = state().jobs.get(id);
  if (!job) return;
  state().jobs.set(id, { ...job, ...patch });
}

export function demoJobPayload(id: string): Record<string, unknown> | null {
  return state().jobs.get(id)?.payload ?? null;
}
