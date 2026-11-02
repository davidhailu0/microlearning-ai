import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ enums */

export const sourceKind = pgEnum("source_kind", [
  "prompt",
  "text",
  "url",
  "pdf",
  "epub",
  "curated",
]);

export const courseLevel = pgEnum("course_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const blockType = pgEnum("block_type", [
  "hook",
  "paragraph",
  "bullets",
  "takeaway",
  "callout",
  "quote",
  "diagram",
  "stat",
  "definition",
  "comparison",
  "image",
]);

export const questionType = pgEnum("question_type", [
  "single_choice",
  "multi_choice",
  "true_false",
]);

export const reviewState = pgEnum("review_state", [
  "new",
  "learning",
  "review",
  "relearning",
]);

export const audioStatus = pgEnum("audio_status", [
  "none",
  "queued",
  "generating",
  "ready",
  "failed",
]);

export const jobKind = pgEnum("job_kind", ["course_generation", "tts"]);

export const jobStatus = pgEnum("job_status", [
  "queued",
  "running",
  "succeeded",
  "failed",
]);

/* ------------------------------------------------------- users & gamification */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email"),
  name: text("name").notNull().default("Learner"),
  avatarUrl: text("avatar_url"),
  timezone: text("timezone").notNull().default("UTC"),
  xp: integer("xp").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const streaks = pgTable("streaks", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  current: integer("current_streak").notNull().default(0),
  longest: integer("longest_streak").notNull().default(0),
  lastActiveDate: date("last_active_date", { mode: "string" }),
  freezes: integer("freezes").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dailyActivity = pgTable(
  "daily_activity",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activityDate: date("activity_date", { mode: "string" }).notNull(),
    xpEarned: integer("xp_earned").notNull().default(0),
    lessonsCompleted: integer("lessons_completed").notNull().default(0),
    reviewsCompleted: integer("reviews_completed").notNull().default(0),
    minutesLearned: integer("minutes_learned").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.activityDate] })],
);

export const friendships = pgTable(
  "friendships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendId: uuid("friend_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("accepted"),
    sharedStreak: integer("shared_streak").notNull().default(0),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("friendships_pair_idx").on(t.userId, t.friendId)],
);

export const xpEvents = pgTable(
  "xp_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    courseId: uuid("course_id"),
    lessonId: uuid("lesson_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("xp_events_user_idx").on(t.userId, t.createdAt)],
);

/* ----------------------------------------------------------------- courses */

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    category: text("category").notNull().default("General"),
    level: courseLevel("level").notNull().default("beginner"),
    coverEmoji: text("cover_emoji").notNull().default("📘"),
    coverColor: text("cover_color").notNull().default("amber"),
    isCurated: boolean("is_curated").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(true),
    sourceKind: sourceKind("source_kind").notNull().default("prompt"),
    sourceUrl: text("source_url"),
    sourceTitle: text("source_title"),
    sourceAuthor: text("source_author"),
    language: text("language").notNull().default("en"),
    estimatedMinutes: integer("estimated_minutes").notNull().default(3),
    lessonCount: integer("lesson_count").notNull().default(0),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("courses_slug_idx").on(t.slug),
    index("courses_curated_idx").on(t.isCurated, t.isPublished),
    index("courses_owner_idx").on(t.ownerId),
  ],
);

export const modules = pgTable(
  "modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("modules_position_idx").on(t.courseId, t.position)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    objective: text("objective").notNull().default(""),
    hook: text("hook").notNull().default(""),
    summary: text("summary").notNull().default(""),
    keyTakeaway: text("key_takeaway").notNull().default(""),
    estimatedMinutes: integer("estimated_minutes").notNull().default(3),
    xpReward: integer("xp_reward").notNull().default(20),
    audioUrl: text("audio_url"),
    audioStatus: audioStatus("audio_status").notNull().default("none"),
    audioDurationSec: integer("audio_duration_sec"),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("lessons_position_idx").on(t.courseId, t.position),
    index("lessons_module_idx").on(t.moduleId),
  ],
);

export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    type: blockType("type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("content_blocks_lesson_idx").on(t.lessonId, t.position)],
);

export const citations = pgTable("citations", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  blockId: uuid("block_id").references(() => contentBlocks.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  url: text("url"),
  locator: jsonb("locator").$type<Record<string, unknown>>(),
  quote: text("quote"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  kind: sourceKind("kind").notNull(),
  title: text("title"),
  author: text("author"),
  url: text("url"),
  wordCount: integer("word_count").notNull().default(0),
  charCount: integer("char_count").notNull().default(0),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* --------------------------------------------------------------- quizzes */

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id").references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Check your understanding"),
  passScore: integer("pass_score").notNull().default(60),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    type: questionType("type").notNull().default("single_choice"),
    prompt: text("prompt").notNull(),
    explanation: text("explanation").notNull().default(""),
    points: integer("points").notNull().default(10),
  },
  (t) => [index("questions_quiz_idx").on(t.quizId, t.position)],
);

export const quizOptions = pgTable(
  "quiz_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    label: text("label").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (t) => [index("quiz_options_question_idx").on(t.questionId, t.position)],
);

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    maxScore: integer("max_score").notNull(),
    answers: jsonb("answers").$type<Record<string, string>>().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("quiz_attempts_user_idx").on(t.userId, t.completedAt)],
);

/* --------------------------------------------------- flashcards & FSRS */

export const flashcards = pgTable(
  "flashcards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    concept: text("concept").notNull().default(""),
    front: text("front").notNull(),
    back: text("back").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("flashcards_course_idx").on(t.courseId)],
);

/**
 * One FSRS state per (user, card). Keeping this separate from `flashcards`
 * lets curated cards be shared while every learner has independent scheduling.
 */
export const cardStates = pgTable(
  "card_states",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    flashcardId: uuid("flashcard_id")
      .notNull()
      .references(() => flashcards.id, { onDelete: "cascade" }),
    due: timestamp("due", { withTimezone: true }).notNull().defaultNow(),
    stability: real("stability").notNull().default(0),
    difficulty: real("difficulty").notNull().default(0),
    elapsedDays: integer("elapsed_days").notNull().default(0),
    scheduledDays: integer("scheduled_days").notNull().default(0),
    learningSteps: integer("learning_steps").notNull().default(0),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    state: reviewState("state").notNull().default("new"),
    lastReview: timestamp("last_review", { withTimezone: true }),
    retrievability: real("retrievability").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.flashcardId] }),
    index("card_states_due_idx").on(t.userId, t.due),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    flashcardId: uuid("flashcard_id")
      .notNull()
      .references(() => flashcards.id, { onDelete: "cascade" }),
    rating: smallint("rating").notNull(),
    state: smallint("state").notNull(),
    due: timestamp("due", { withTimezone: true }).notNull(),
    stability: real("stability").notNull(),
    difficulty: real("difficulty").notNull(),
    elapsedDays: integer("elapsed_days").notNull().default(0),
    lastElapsedDays: integer("last_elapsed_days").notNull().default(0),
    scheduledDays: integer("scheduled_days").notNull().default(0),
    learningSteps: integer("learning_steps").notNull().default(0),
    review: timestamp("review", { withTimezone: true }).notNull(),
    durationMs: integer("duration_ms").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("reviews_user_idx").on(t.userId, t.review)],
);

/* --------------------------------------------------------------- progress */

export const courseProgress = pgTable(
  "course_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    currentLessonId: uuid("current_lesson_id"),
    completedLessons: integer("completed_lessons").notNull().default(0),
    totalLessons: integer("total_lessons").notNull().default(0),
    percent: real("percent").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("in_progress"),
    cardIndex: integer("card_index").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

/* -------------------------------------------------------------- pipeline */

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: jobKind("kind").notNull(),
    status: jobStatus("status").notNull().default("queued"),
    courseId: uuid("course_id").references(() => courses.id, { onDelete: "cascade" }),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    result: jsonb("result").$type<Record<string, unknown>>(),
    error: text("error"),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(3),
    runAt: timestamp("run_at", { withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("jobs_poll_idx").on(t.status, t.runAt)],
);

export const audioAssets = pgTable("audio_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("lesson"),
  storagePath: text("storage_path"),
  publicUrl: text("public_url"),
  mimeType: text("mime_type").notNull().default("audio/mpeg"),
  durationSec: integer("duration_sec"),
  voice: text("voice"),
  status: audioStatus("status").notNull().default("none"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Course = typeof courses.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type ContentBlock = typeof contentBlocks.$inferSelect;
export type Flashcard = typeof flashcards.$inferSelect;
export type CardState = typeof cardStates.$inferSelect;
export type Job = typeof jobs.$inferSelect;
