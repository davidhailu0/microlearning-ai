import { and, asc, desc, eq, gt, gte, lt, sql, type ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { dbEnabled, getDb } from "./db";
import * as s from "./db/schema";
import {
  demoCourse,
  demoCreateJob,
  demoDashboard,
  demoDueCards,
  demoGradeCard,
  demoJob,
  demoJobPayload,
  demoLesson,
  demoSubmitQuiz,
  demoUpdateJob,
  demoCompleteLesson,
  demoUserCourses,
  addDemoCourse,
} from "./demo";
import { env } from "./env";
import { emptyCard, gradeStoredCard, previewIntervals, type Grade } from "./fsrs";
import { levelForXp, slugify } from "./text";
import type { CourseDraft } from "./ai/schema";
import type {
  ActiveCourse,
  Block,
  CourseDetail,
  CourseSummary,
  DashboardData,
  DueCard,
  JobView,
  LessonDetail,
  UserCourse,
} from "./types";

const demo = () => !dbEnabled();

type Tx = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof s,
  ExtractTablesWithRelations<typeof s>
>;

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

function toSummary(row: typeof s.courses.$inferSelect): CourseSummary {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    level: row.level,
    coverEmoji: row.coverEmoji,
    coverColor: row.coverColor,
    estimatedMinutes: row.estimatedMinutes,
    lessonCount: row.lessonCount,
    isCurated: row.isCurated,
    sourceKind: row.sourceKind,
    tags: row.tags,
  };
}

async function touchActivity(
  tx: Tx,
  userId: string,
  delta: { xp?: number; lessons?: number; reviews?: number; minutes?: number; reason?: string },
) {
  const xp = delta.xp ?? 0;
  const lessons = delta.lessons ?? 0;
  const reviews = delta.reviews ?? 0;
  const minutes = delta.minutes ?? 0;
  const day = today();

  if (xp || lessons || reviews || minutes) {
    await tx
      .insert(s.dailyActivity)
      .values({
        userId,
        activityDate: day,
        xpEarned: xp,
        lessonsCompleted: lessons,
        reviewsCompleted: reviews,
        minutesLearned: minutes,
      })
      .onConflictDoUpdate({
        target: [s.dailyActivity.userId, s.dailyActivity.activityDate],
        set: {
          xpEarned: sql`${s.dailyActivity.xpEarned} + ${xp}`,
          lessonsCompleted: sql`${s.dailyActivity.lessonsCompleted} + ${lessons}`,
          reviewsCompleted: sql`${s.dailyActivity.reviewsCompleted} + ${reviews}`,
          minutesLearned: sql`${s.dailyActivity.minutesLearned} + ${minutes}`,
        },
      });
  }

  if (xp) {
    await tx
      .update(s.users)
      .set({ xp: sql`${s.users.xp} + ${xp}`, updatedAt: new Date() })
      .where(eq(s.users.id, userId));
    await tx.insert(s.xpEvents).values({
      userId,
      amount: xp,
      reason: delta.reason ?? "activity",
    });
  }

  const [streak] = await tx
    .select()
    .from(s.streaks)
    .where(eq(s.streaks.userId, userId))
    .limit(1);

  let current = streak?.current ?? 0;
  if (streak?.lastActiveDate !== day) {
    current = streak?.lastActiveDate === yesterday() ? current + 1 : 1;
  }

  await tx
    .insert(s.streaks)
    .values({
      userId,
      current,
      longest: Math.max(streak?.longest ?? 0, current),
      lastActiveDate: day,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: s.streaks.userId,
      set: {
        current,
        longest: sql`greatest(${s.streaks.longest}, ${current})`,
        lastActiveDate: day,
        updatedAt: new Date(),
      },
    });
}

export async function ensureUser(userId: string, profile?: { name?: string; email?: string }) {
  if (demo()) return;
  await getDb()
    .insert(s.users)
    .values({
      id: userId,
      name: profile?.name ?? "Learner",
      email: profile?.email ?? null,
    })
    .onConflictDoNothing();
}

/* --------------------------------------------------------------- dashboard */

/**
 * Every course this user generated, newest first — independent of whether they
 * have started it. This is what makes PDF/link generations findable later.
 */
export async function listUserCourses(userId: string, limit = 50): Promise<UserCourse[]> {
  if (demo()) return demoUserCourses(limit);

  const db = getDb();
  const rows = await db
    .select({ course: s.courses, progress: s.courseProgress })
    .from(s.courses)
    .leftJoin(
      s.courseProgress,
      and(eq(s.courseProgress.courseId, s.courses.id), eq(s.courseProgress.userId, userId)),
    )
    .where(
      and(
        eq(s.courses.ownerId, userId),
        eq(s.courses.isCurated, false),
        eq(s.courses.isPublished, true),
      ),
    )
    .orderBy(desc(s.courses.createdAt))
    .limit(limit);

  return rows.map(({ course, progress }) => ({
    ...toSummary(course),
    percent: progress?.percent ?? 0,
    completedLessons: progress?.completedLessons ?? 0,
    currentLessonId: progress?.currentLessonId ?? null,
    createdAt: course.createdAt.toISOString(),
    lastActivityAt: progress?.lastActivityAt?.toISOString() ?? null,
    sourceTitle: course.sourceTitle,
  }));
}

export async function getShellData(userId: string) {
  if (demo()) {
    const data = demoDashboard();
    return { user: data.user, streak: data.streak, dueCount: data.dueCount };
  }

  const db = getDb();
  const [user] = await db.select().from(s.users).where(eq(s.users.id, userId)).limit(1);
  const [streak] = await db.select().from(s.streaks).where(eq(s.streaks.userId, userId)).limit(1);
  const [dueRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.cardStates)
    .where(and(eq(s.cardStates.userId, userId), lt(s.cardStates.due, new Date())));

  return {
    user: {
      id: user?.id ?? userId,
      name: user?.name ?? "Learner",
      avatarUrl: user?.avatarUrl ?? null,
      xp: user?.xp ?? 0,
      level: levelForXp(user?.xp ?? 0),
    },
    streak: { current: streak?.current ?? 0, longest: streak?.longest ?? 0, friendStreak: 0 },
    dueCount: dueRow?.count ?? 0,
  };
}

export async function getDashboard(userId: string): Promise<DashboardData> {
  if (demo()) return demoDashboard();

  const db = getDb();
  await ensureUser(userId);
  const now = new Date();

  const [user] = await db.select().from(s.users).where(eq(s.users.id, userId)).limit(1);
  const [streak] = await db.select().from(s.streaks).where(eq(s.streaks.userId, userId)).limit(1);

  const [dueRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.cardStates)
    .where(and(eq(s.cardStates.userId, userId), lt(s.cardStates.due, now)));

  const [friendRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.friendships)
    .where(and(eq(s.friendships.userId, userId), eq(s.friendships.status, "accepted")));

  const curatedRows = await db
    .select()
    .from(s.courses)
    .where(and(eq(s.courses.isCurated, true), eq(s.courses.isPublished, true)))
    .orderBy(desc(s.courses.createdAt))
    .limit(6);

  const activeRows = await db
    .select({
      course: s.courses,
      progress: s.courseProgress,
      lessonTitle: s.lessons.title,
    })
    .from(s.courseProgress)
    .innerJoin(s.courses, eq(s.courses.id, s.courseProgress.courseId))
    .leftJoin(s.lessons, eq(s.lessons.id, s.courseProgress.currentLessonId))
    .where(eq(s.courseProgress.userId, userId))
    .orderBy(desc(s.courseProgress.lastActivityAt))
    .limit(3);

  const weekStart = new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
  const [week] = await db
    .select({
      lessons: sql<number>`coalesce(sum(${s.dailyActivity.lessonsCompleted}), 0)::int`,
      minutes: sql<number>`coalesce(sum(${s.dailyActivity.minutesLearned}), 0)::int`,
    })
    .from(s.dailyActivity)
    .where(
      and(eq(s.dailyActivity.userId, userId), gte(s.dailyActivity.activityDate, weekStart)),
    );

  const [reviewsToday] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.dailyActivity)
    .where(
      and(eq(s.dailyActivity.userId, userId), eq(s.dailyActivity.activityDate, today())),
    );

  const active: ActiveCourse[] = activeRows.map(({ course, progress, lessonTitle }) => ({
    ...toSummary(course),
    percent: progress.percent,
    completedLessons: progress.completedLessons,
    currentLessonId: progress.currentLessonId,
    currentLessonTitle: lessonTitle,
    lastActivityAt: progress.lastActivityAt.toISOString(),
  }));

  const history = await listUserCourses(userId, 6);

  return {
    user: {
      id: user?.id ?? userId,
      name: user?.name ?? "Learner",
      avatarUrl: user?.avatarUrl ?? null,
      xp: user?.xp ?? 0,
      level: levelForXp(user?.xp ?? 0),
    },
    streak: {
      current: streak?.current ?? 0,
      longest: streak?.longest ?? 0,
      friendStreak: friendRow?.count ?? 0,
    },
    dueCount: dueRow?.count ?? 0,
    active,
    history,
    curated: curatedRows.map(toSummary),
    stats: {
      lessonsThisWeek: week?.lessons ?? 0,
      minutesThisWeek: week?.minutes ?? 0,
      reviewsToday: reviewsToday?.count ?? 0,
    },
  };
}

/* ------------------------------------------------------------------ course */

export async function getCourse(
  courseId: string,
  userId: string,
): Promise<CourseDetail | null> {
  if (demo()) return demoCourse(courseId);

  const db = getDb();
  const [course] = await db.select().from(s.courses).where(eq(s.courses.id, courseId)).limit(1);
  if (!course) return null;

  const [modules, lessons, progress, completed, sourceRow] = await Promise.all([
    db.select().from(s.modules).where(eq(s.modules.courseId, courseId)).orderBy(asc(s.modules.position)),
    db.select().from(s.lessons).where(eq(s.lessons.courseId, courseId)).orderBy(asc(s.lessons.position)),
    db
      .select()
      .from(s.courseProgress)
      .where(and(eq(s.courseProgress.userId, userId), eq(s.courseProgress.courseId, courseId)))
      .limit(1),
    db
      .select({ lessonId: s.lessonProgress.lessonId })
      .from(s.lessonProgress)
      .where(
        and(
          eq(s.lessonProgress.userId, userId),
          eq(s.lessonProgress.courseId, courseId),
          eq(s.lessonProgress.status, "completed"),
        ),
      ),
    db
      .select({ metadata: s.sources.metadata })
      .from(s.sources)
      .where(eq(s.sources.courseId, courseId))
      .limit(1),
  ]);

  const completedSet = new Set(completed.map((row) => row.lessonId));
  const next = lessons.find((lesson) => !completedSet.has(lesson.id));
  const coverageMeta = sourceRow[0]?.metadata as
    | { bookMode?: boolean; sections?: number; words?: number; throughline?: string }
    | undefined;

  return {
    ...toSummary(course),
    percent: progress[0]?.percent ?? 0,
    completedLessons: completedSet.size,
    nextLessonId: next?.id ?? null,
    coverage:
      coverageMeta?.bookMode && coverageMeta.sections
        ? {
            sections: coverageMeta.sections,
            words: coverageMeta.words ?? 0,
            throughline: coverageMeta.throughline ?? null,
          }
        : null,
    modules: modules.map((module) => ({
      id: module.id,
      title: module.title,
      summary: module.summary,
      lessons: lessons
        .filter((lesson) => lesson.moduleId === module.id)
        .map((lesson) => ({
          id: lesson.id,
          position: lesson.position,
          title: lesson.title,
          objective: lesson.objective,
          estimatedMinutes: lesson.estimatedMinutes,
          completed: completedSet.has(lesson.id),
        })),
    })),
  };
}

/* ------------------------------------------------------------------ lesson */

export async function getLesson(
  lessonId: string,
  userId: string,
): Promise<LessonDetail | null> {
  if (demo()) return demoLesson(lessonId);

  const db = getDb();
  const [row] = await db
    .select({ lesson: s.lessons, module: s.modules, course: s.courses })
    .from(s.lessons)
    .innerJoin(s.modules, eq(s.modules.id, s.lessons.moduleId))
    .innerJoin(s.courses, eq(s.courses.id, s.lessons.courseId))
    .where(eq(s.lessons.id, lessonId))
    .limit(1);

  if (!row) return null;

  const [blocks, quizRows, totalRow, prevRow, nextRow, progressRow, citationRows] =
    await Promise.all([
      db
        .select()
        .from(s.contentBlocks)
        .where(eq(s.contentBlocks.lessonId, lessonId))
        .orderBy(asc(s.contentBlocks.position)),
      db.select().from(s.quizzes).where(eq(s.quizzes.lessonId, lessonId)).limit(1),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(s.lessons)
        .where(eq(s.lessons.courseId, row.course.id)),
      db
        .select({ id: s.lessons.id })
        .from(s.lessons)
        .where(
          and(eq(s.lessons.courseId, row.course.id), lt(s.lessons.position, row.lesson.position)),
        )
        .orderBy(desc(s.lessons.position))
        .limit(1),
      db
        .select({ id: s.lessons.id })
        .from(s.lessons)
        .where(
          and(eq(s.lessons.courseId, row.course.id), gt(s.lessons.position, row.lesson.position)),
        )
        .orderBy(asc(s.lessons.position))
        .limit(1),
      db
        .select()
        .from(s.lessonProgress)
        .where(and(eq(s.lessonProgress.userId, userId), eq(s.lessonProgress.lessonId, lessonId)))
        .limit(1),
      db
        .select()
        .from(s.citations)
        .where(eq(s.citations.lessonId, lessonId))
        .limit(1),
    ]);

  let quiz = null;
  if (quizRows[0]) {
    const [question] = await db
      .select()
      .from(s.questions)
      .where(eq(s.questions.quizId, quizRows[0].id))
      .orderBy(asc(s.questions.position))
      .limit(1);

    if (question) {
      const options = await db
        .select()
        .from(s.quizOptions)
        .where(eq(s.quizOptions.questionId, question.id))
        .orderBy(asc(s.quizOptions.position));

      quiz = {
        id: quizRows[0].id,
        question: question.prompt,
        options: options.map((option) => ({ id: option.id, label: option.label })),
        passScore: quizRows[0].passScore,
        points: question.points,
      };
    }
  }

  const citation = citationRows[0];
  const locator = citation?.locator as
    | { pageStart?: number | null; pageEnd?: number | null; sectionIndexes?: number[] }
    | undefined;

  return {
    id: row.lesson.id,
    courseId: row.course.id,
    courseTitle: row.course.title,
    moduleTitle: row.module.title,
    position: row.lesson.position,
    totalLessons: totalRow[0]?.count ?? 0,
    title: row.lesson.title,
    objective: row.lesson.objective,
    takeaway: row.lesson.keyTakeaway,
    estimatedMinutes: row.lesson.estimatedMinutes,
    xpReward: row.lesson.xpReward,
    blocks: blocks.map((block) => block.payload as unknown as Block),
    audioUrl: row.lesson.audioUrl,
    audioStatus: row.lesson.audioStatus,
    quiz,
    sourceRef: citation
      ? {
          label: citation.label,
          pageStart: locator?.pageStart ?? null,
          pageEnd: locator?.pageEnd ?? null,
          note: citation.quote ?? "",
          sectionIndexes: locator?.sectionIndexes ?? [],
        }
      : null,
    nextLessonId: nextRow[0]?.id ?? null,
    prevLessonId: prevRow[0]?.id ?? null,
    completed: progressRow[0]?.status === "completed",
  };
}

/* ------------------------------------------------------------------ review */

export async function getDueCards(userId: string): Promise<DueCard[]> {
  if (demo()) return demoDueCards();

  const db = getDb();
  const now = new Date();

  const rows = await db
    .select({
      state: s.cardStates,
      card: s.flashcards,
      courseTitle: s.courses.title,
    })
    .from(s.cardStates)
    .innerJoin(s.flashcards, eq(s.flashcards.id, s.cardStates.flashcardId))
    .innerJoin(s.courses, eq(s.courses.id, s.flashcards.courseId))
    .where(and(eq(s.cardStates.userId, userId), lt(s.cardStates.due, now)))
    .orderBy(asc(s.cardStates.due))
    .limit(40);

  return rows.map(({ state, card, courseTitle }) => ({
    flashcardId: card.id,
    lessonId: card.lessonId,
    courseId: card.courseId,
    courseTitle,
    concept: card.concept,
    front: card.front,
    back: card.back,
    due: state.due.toISOString(),
    state: state.state,
    reps: state.reps,
    retrievability: state.retrievability,
    previews: previewIntervals(
      {
        due: state.due,
        stability: state.stability,
        difficulty: state.difficulty,
        elapsedDays: state.elapsedDays,
        scheduledDays: state.scheduledDays,
        learningSteps: state.learningSteps,
        reps: state.reps,
        lapses: state.lapses,
        state: state.state,
        lastReview: state.lastReview,
      },
      now,
    ),
  }));
}

export async function gradeCard(userId: string, flashcardId: string, grade: Grade) {
  if (demo()) return demoGradeCard(flashcardId, grade);

  const db = getDb();
  const now = new Date();

  const result = await db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(s.cardStates)
      .where(
        and(eq(s.cardStates.userId, userId), eq(s.cardStates.flashcardId, flashcardId)),
      )
      .limit(1);

    const base = existing
      ? {
          due: existing.due,
          stability: existing.stability,
          difficulty: existing.difficulty,
          elapsedDays: existing.elapsedDays,
          scheduledDays: existing.scheduledDays,
          learningSteps: existing.learningSteps,
          reps: existing.reps,
          lapses: existing.lapses,
          state: existing.state,
          lastReview: existing.lastReview,
        }
      : emptyCard(now);

    const next = gradeStoredCard(base, grade, now);

    await tx
      .insert(s.cardStates)
      .values({
        userId,
        flashcardId,
        due: next.due,
        stability: next.stability,
        difficulty: next.difficulty,
        elapsedDays: next.elapsedDays,
        scheduledDays: next.scheduledDays,
        learningSteps: next.learningSteps,
        reps: next.reps,
        lapses: next.lapses,
        state: next.state as typeof s.cardStates.$inferInsert.state,
        lastReview: next.lastReview,
        retrievability: next.retrievability,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [s.cardStates.userId, s.cardStates.flashcardId],
        set: {
          due: next.due,
          stability: next.stability,
          difficulty: next.difficulty,
          elapsedDays: next.elapsedDays,
          scheduledDays: next.scheduledDays,
          learningSteps: next.learningSteps,
          reps: next.reps,
          lapses: next.lapses,
          state: next.state as typeof s.cardStates.$inferInsert.state,
          lastReview: next.lastReview,
          retrievability: next.retrievability,
          updatedAt: now,
        },
      });

    await tx.insert(s.reviews).values({
      userId,
      flashcardId,
      rating: next.review.rating,
      state: next.review.state,
      due: next.review.due,
      stability: next.review.stability,
      difficulty: next.review.difficulty,
      elapsedDays: next.review.elapsed_days,
      lastElapsedDays: next.review.last_elapsed_days,
      scheduledDays: next.review.scheduled_days,
      learningSteps: next.review.learning_steps,
      review: next.review.review,
    });

    await touchActivity(tx, userId, { xp: 8, reviews: 1, reason: "flashcard_review" });

    return next;
  });

  return {
    nextDue: result.due.toISOString(),
    interval: result.scheduledDays ? `${result.scheduledDays}d` : "soon",
    previews: previewIntervals(
      {
        due: result.due,
        stability: result.stability,
        difficulty: result.difficulty,
        elapsedDays: result.elapsedDays,
        scheduledDays: result.scheduledDays,
        learningSteps: result.learningSteps,
        reps: result.reps,
        lapses: result.lapses,
        state: result.state,
        lastReview: result.lastReview,
      },
      now,
    ),
  };
}

/* -------------------------------------------------------------------- quiz */

export async function submitQuiz(userId: string, quizId: string, optionId: string) {
  if (demo()) return demoSubmitQuiz(quizId, optionId);

  const db = getDb();
  const [quiz] = await db.select().from(s.quizzes).where(eq(s.quizzes.id, quizId)).limit(1);
  if (!quiz) throw new Error("Quiz not found");

  const [question] = await db
    .select()
    .from(s.questions)
    .where(eq(s.questions.quizId, quizId))
    .orderBy(asc(s.questions.position))
    .limit(1);
  if (!question) throw new Error("Question not found");

  const options = await db
    .select()
    .from(s.quizOptions)
    .where(eq(s.quizOptions.questionId, question.id));

  const correct = options.find((option) => option.isCorrect);
  const isCorrect = correct?.id === optionId;

  await db.transaction(async (tx) => {
    await tx.insert(s.quizAttempts).values({
      userId,
      quizId,
      score: isCorrect ? question.points : 0,
      maxScore: question.points,
      answers: { [question.id]: optionId },
    });
    if (isCorrect) {
      await touchActivity(tx, userId, {
        xp: question.points,
        reason: "quiz_correct",
      });
    }
  });

  return {
    correct: Boolean(isCorrect),
    correctOptionId: correct?.id ?? null,
    explanation: question.explanation,
    points: isCorrect ? question.points : 0,
  };
}

/* ---------------------------------------------------------------- complete */

export async function completeLesson(userId: string, lessonId: string) {
  if (demo()) return demoCompleteLesson(lessonId);

  const db = getDb();
  const now = new Date();

  return db.transaction(async (tx) => {
    const [lesson] = await tx.select().from(s.lessons).where(eq(s.lessons.id, lessonId)).limit(1);
    if (!lesson) throw new Error("Lesson not found");

    await tx
      .insert(s.lessonProgress)
      .values({
        userId,
        lessonId,
        courseId: lesson.courseId,
        status: "completed",
        completedAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [s.lessonProgress.userId, s.lessonProgress.lessonId],
        set: { status: "completed", completedAt: now, updatedAt: now },
      });

    // Cards enter the schedule only once the lesson is finished.
    const lessonCards = await tx
      .select({ id: s.flashcards.id })
      .from(s.flashcards)
      .where(eq(s.flashcards.lessonId, lessonId));

    if (lessonCards.length > 0) {
      const fresh = emptyCard(now);
      await tx
        .insert(s.cardStates)
        .values(
          lessonCards.map((card) => ({
            userId,
            flashcardId: card.id,
            due: fresh.due,
            stability: fresh.stability,
            difficulty: fresh.difficulty,
            elapsedDays: fresh.elapsedDays,
            scheduledDays: fresh.scheduledDays,
            learningSteps: fresh.learningSteps,
            reps: fresh.reps,
            lapses: fresh.lapses,
            state: fresh.state as typeof s.cardStates.$inferInsert.state,
            lastReview: fresh.lastReview,
            retrievability: fresh.retrievability,
          })),
        )
        .onConflictDoNothing();
    }

    const [completedRow] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(s.lessonProgress)
      .where(
        and(
          eq(s.lessonProgress.userId, userId),
          eq(s.lessonProgress.courseId, lesson.courseId),
          eq(s.lessonProgress.status, "completed"),
        ),
      );

    const [totalRow] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(s.lessons)
      .where(eq(s.lessons.courseId, lesson.courseId));

    const [next] = await tx
      .select({ id: s.lessons.id })
      .from(s.lessons)
      .where(
        and(eq(s.lessons.courseId, lesson.courseId), gt(s.lessons.position, lesson.position)),
      )
      .orderBy(asc(s.lessons.position))
      .limit(1);

    const completed = completedRow?.count ?? 0;
    const total = totalRow?.count ?? 0;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    await tx
      .insert(s.courseProgress)
      .values({
        userId,
        courseId: lesson.courseId,
        currentLessonId: next?.id ?? null,
        completedLessons: completed,
        totalLessons: total,
        percent,
        lastActivityAt: now,
        completedAt: percent === 100 ? now : null,
      })
      .onConflictDoUpdate({
        target: [s.courseProgress.userId, s.courseProgress.courseId],
        set: {
          currentLessonId: next?.id ?? null,
          completedLessons: completed,
          totalLessons: total,
          percent,
          lastActivityAt: now,
          completedAt: percent === 100 ? now : null,
        },
      });

    await touchActivity(tx, userId, {
      xp: lesson.xpReward,
      lessons: 1,
      minutes: lesson.estimatedMinutes,
      reason: "lesson_complete",
    });

    return {
      nextLessonId: next?.id ?? null,
      percent,
      courseId: lesson.courseId,
    };
  });
}

/* --------------------------------------------------------------- persistence */

export async function persistCourseDraft(args: {
  draft: CourseDraft;
  userId: string;
  sourceKind: "prompt" | "text" | "url" | "pdf" | "epub" | "curated";
  sourceTitle?: string;
  sourceAuthor?: string;
  sourceUrl?: string;
  wordCount?: number;
  charCount?: number;
  metadata?: Record<string, unknown>;
  isCurated?: boolean;
  coverColor?: string;
}): Promise<{ courseId: string; lessonIds: string[] }> {
  const { draft } = args;

  if (demo()) {
    const courseId = addDemoCourse(draft, {
      sourceKind: args.sourceKind,
      sourceTitle: args.sourceTitle,
      sourceAuthor: args.sourceAuthor,
      sourceUrl: args.sourceUrl,
      metadata: args.metadata,
    });
    if (args.isCurated) {
      // Demo seed marks curated courses via the dashboard seed, not here.
    }
    const detail = demoCourse(courseId);
    return {
      courseId,
      lessonIds: detail?.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)) ?? [],
    };
  }

  const db = getDb();
  await ensureUser(args.userId);

  return db.transaction(async (tx) => {
    const [course] = await tx
      .insert(s.courses)
      .values({
        ownerId: args.isCurated ? null : args.userId,
        slug: `${slugify(draft.title) || "course"}-${Math.random().toString(36).slice(2, 7)}`,
        title: draft.title,
        description: draft.description,
        category: draft.category || "General",
        level: draft.level,
        coverEmoji: draft.coverEmoji || "📘",
        coverColor: args.coverColor ?? "amber",
        isCurated: Boolean(args.isCurated),
        sourceKind: args.sourceKind,
        sourceTitle: args.sourceTitle,
        sourceAuthor: args.sourceAuthor,
        sourceUrl: args.sourceUrl,
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
        tags: draft.tags,
      })
      .returning();

    await tx.insert(s.sources).values({
      courseId: course.id,
      kind: args.sourceKind,
      title: args.sourceTitle,
      author: args.sourceAuthor,
      url: args.sourceUrl,
      wordCount: args.wordCount ?? 0,
      charCount: args.charCount ?? 0,
      metadata: args.metadata,
    });

    const lessonIds: string[] = [];
    let position = 0;

    for (const [moduleIndex, module] of draft.modules.entries()) {
      const [moduleRow] = await tx
        .insert(s.modules)
        .values({
          courseId: course.id,
          position: moduleIndex,
          title: module.title,
          summary: module.summary,
        })
        .returning();

      for (const item of module.lessons) {
        const [lessonRow] = await tx
          .insert(s.lessons)
          .values({
            courseId: course.id,
            moduleId: moduleRow.id,
            position: position++,
            title: item.title,
            objective: item.objective,
            hook: item.hook,
            summary: item.takeaway,
            keyTakeaway: item.takeaway,
            estimatedMinutes: item.estimatedMinutes ?? 3,
            xpReward: 20,
            audioStatus: env.ttsEnabled ? "queued" : "none",
          })
          .returning();

        lessonIds.push(lessonRow.id);

        const blocks: Block[] = [{ type: "hook", text: item.hook }];
        for (const paragraph of item.paragraphs) {
          blocks.push({ type: "paragraph", text: paragraph });
        }
        blocks.push({ type: "bullets", items: item.bullets });
        if (item.diagram) blocks.push({ type: "diagram", diagram: item.diagram });
        blocks.push({ type: "takeaway", text: item.takeaway });

        await tx.insert(s.contentBlocks).values(
          blocks.map((block, index) => ({
            lessonId: lessonRow.id,
            position: index,
            type: block.type,
            payload: block as unknown as Record<string, unknown>,
          })),
        );

        if (item.sourceRef) {
          await tx.insert(s.citations).values({
            lessonId: lessonRow.id,
            label: item.sourceRef.label,
            url: args.sourceUrl,
            locator: {
              pageStart: item.sourceRef.pageStart,
              pageEnd: item.sourceRef.pageEnd,
              sectionIndexes: item.sourceRef.sectionIndexes,
            },
            quote: item.sourceRef.note || null,
          });
        }

        const [quizRow] = await tx
          .insert(s.quizzes)
          .values({ lessonId: lessonRow.id })
          .returning();

        const [questionRow] = await tx
          .insert(s.questions)
          .values({
            quizId: quizRow.id,
            position: 0,
            type: "single_choice",
            prompt: item.quiz.question,
            explanation: item.quiz.explanation,
            points: 10,
          })
          .returning();

        await tx.insert(s.quizOptions).values(
          item.quiz.options.map((label, index) => ({
            questionId: questionRow.id,
            position: index,
            label,
            isCorrect: index === item.quiz.correctIndex,
          })),
        );

        for (const card of item.flashcards) {
          await tx
            .insert(s.flashcards)
            .values({
              lessonId: lessonRow.id,
              courseId: course.id,
              concept: item.title,
              front: card.front,
              back: card.back,
            })
            .returning();
        }

        if (env.ttsEnabled && !args.isCurated) {
          await tx.insert(s.jobs).values({
            kind: "tts",
            status: "queued",
            courseId: course.id,
            payload: { kind: "tts", lessonId: lessonRow.id, userId: args.userId },
          });
        }
      }
    }

    return { courseId: course.id, lessonIds };
  });
}

/* -------------------------------------------------------------------- jobs */

export async function createJob(
  kind: "course_generation" | "tts",
  payload: Record<string, unknown>,
) {
  if (demo()) return demoCreateJob(kind, payload);

  const [job] = await getDb()
    .insert(s.jobs)
    .values({ kind, payload })
    .returning({ id: s.jobs.id });
  return job.id;
}

export async function getJob(jobId: string): Promise<JobView | null> {
  if (demo()) return demoJob(jobId);

  const [job] = await getDb().select().from(s.jobs).where(eq(s.jobs.id, jobId)).limit(1);
  if (!job) return null;

  const result = (job.result ?? {}) as { stage?: string; progress?: number; courseId?: string };
  const progress =
    result.progress ??
    (job.status === "succeeded" ? 100 : job.status === "running" ? 50 : 0);

  return {
    id: job.id,
    status: job.status,
    stage: result.stage ?? job.status,
    progress,
    courseId: result.courseId ?? job.courseId,
    error: job.error,
    result: job.result as JobView["result"],
  };
}

export async function updateJob(
  jobId: string,
  patch: {
    status?: JobView["status"];
    stage?: string;
    progress?: number;
    courseId?: string;
    error?: string | null;
    result?: Record<string, unknown>;
  },
) {
  if (demo()) {
    demoUpdateJob(jobId, {
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.stage ? { stage: patch.stage } : {}),
      ...(patch.progress != null ? { progress: patch.progress } : {}),
      ...(patch.courseId ? { courseId: patch.courseId } : {}),
      ...(patch.error !== undefined ? { error: patch.error } : {}),
      ...(patch.result ? { result: patch.result as JobView["result"] } : {}),
    });
    return;
  }

  const [job] = await getDb().select().from(s.jobs).where(eq(s.jobs.id, jobId)).limit(1);
  if (!job) return;

  const previous = (job.result ?? {}) as Record<string, unknown>;
  const result = {
    ...previous,
    ...(patch.stage ? { stage: patch.stage } : {}),
    ...(patch.progress != null ? { progress: patch.progress } : {}),
    ...(patch.result ?? {}),
  };

  await getDb()
    .update(s.jobs)
    .set({
      status: patch.status ?? job.status,
      courseId: patch.courseId ?? job.courseId,
      error: patch.error === undefined ? job.error : patch.error,
      result,
      updatedAt: new Date(),
      ...(patch.status === "running" ? { lockedAt: new Date() } : {}),
    })
    .where(eq(s.jobs.id, jobId));
}

export async function getJobPayload(jobId: string): Promise<Record<string, unknown> | null> {
  if (demo()) return demoJobPayload(jobId);

  const [job] = await getDb()
    .select({ payload: s.jobs.payload })
    .from(s.jobs)
    .where(eq(s.jobs.id, jobId))
    .limit(1);
  return job?.payload ?? null;
}

export async function getLessonScript(lessonId: string) {
  const db = getDb();
  const [lesson] = await db.select().from(s.lessons).where(eq(s.lessons.id, lessonId)).limit(1);
  if (!lesson) throw new Error("Lesson not found");

  const blocks = await db
    .select()
    .from(s.contentBlocks)
    .where(eq(s.contentBlocks.lessonId, lessonId))
    .orderBy(asc(s.contentBlocks.position));

  const lines = blocks
    .map((block) => {
      const payload = block.payload as Record<string, unknown>;
      if (payload.type === "bullets") return (payload.items as string[]).join(". ");
      if (typeof payload.text === "string") return payload.text;
      return "";
    })
    .filter(Boolean);

  return {
    lessonId,
    title: lesson.title,
    script: `${lesson.title}. ${lines.join(". ")}`.slice(0, 4000),
  };
}

export async function setLessonAudio(args: {
  lessonId: string;
  url: string | null;
  storagePath?: string;
  durationSec?: number;
  status: "queued" | "generating" | "ready" | "failed";
  error?: string;
}) {
  if (demo()) return;

  const db = getDb();
  await db
    .update(s.lessons)
    .set({
      audioUrl: args.url,
      audioStatus: args.status,
      audioDurationSec: args.durationSec ?? null,
    })
    .where(eq(s.lessons.id, args.lessonId));

  await db.insert(s.audioAssets).values({
    lessonId: args.lessonId,
    storagePath: args.storagePath,
    publicUrl: args.url,
    durationSec: args.durationSec,
    status: args.status,
    error: args.error,
  });
}

export async function claimNextJob() {
  if (demo()) return null;

  const rows = await getDb().execute(sql`
    update jobs
    set status = 'running', locked_at = now(), attempts = attempts + 1, updated_at = now()
    where id = (
      select id from jobs
      where status = 'queued' and run_at <= now()
      order by created_at asc
      limit 1
      for update skip locked
    )
    returning id
  `);

  const row = (rows as unknown as { id: string }[])[0];
  if (!row) return null;

  const [job] = await getDb().select().from(s.jobs).where(eq(s.jobs.id, row.id)).limit(1);
  return job ?? null;
}

export async function failJob(jobId: string, message: string) {
  if (demo()) {
    demoUpdateJob(jobId, { status: "failed", error: message, stage: "Failed" });
    return;
  }

  const db = getDb();
  const [job] = await db.select().from(s.jobs).where(eq(s.jobs.id, jobId)).limit(1);
  if (!job) return;

  const retry = !env.inlineJobs && job.attempts < job.maxAttempts;
  await db
    .update(s.jobs)
    .set({
      status: retry ? "queued" : "failed",
      error: message,
      runAt: new Date(Date.now() + job.attempts * 30_000),
      updatedAt: new Date(),
    })
    .where(eq(s.jobs.id, jobId));
}
