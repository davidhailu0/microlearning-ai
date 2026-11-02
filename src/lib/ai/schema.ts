import { z } from "zod";

export const diagramSchema = z.object({
  type: z.enum(["process", "cycle", "hierarchy", "compare"]),
  title: z.string().max(120),
  nodes: z
    .array(
      z.object({
        id: z.string().max(24),
        label: z.string().max(60),
        emphasis: z.boolean(),
      }),
    )
    .min(2)
    .max(10),
  edges: z
    .array(
      z.object({
        from: z.string().max(24),
        to: z.string().max(24),
        label: z.string().max(40),
      }),
    )
    .max(12),
});

export const quizDraftSchema = z.object({
  question: z.string().max(500),
  options: z.array(z.string().max(300)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().max(800),
});

export const flashcardDraftSchema = z.object({
  front: z.string().max(500),
  back: z.string().max(900),
});

/** Resolved citation stored on a lesson and written to the citations table. */
export const sourceRefSchema = z.object({
  label: z.string().max(200),
  pageStart: z.number().int().positive().nullable(),
  pageEnd: z.number().int().positive().nullable(),
  note: z.string().max(600),
  sectionIndexes: z.array(z.number().int().min(0)).max(10),
});

export const lessonDraftSchema = z.object({
  title: z.string().max(180),
  objective: z.string().max(500),
  hook: z.string().max(500),
  // Length is capped after parsing (see normalize/finalize), not in the JSON
  // schema: one over-long paragraph should not fail a whole book generation.
  paragraphs: z.array(z.string().max(4000)).min(1).max(4),
  bullets: z.array(z.string().max(600)).min(3).max(4),
  takeaway: z.string().max(600),
  diagram: diagramSchema.nullable(),
  quiz: quizDraftSchema,
  flashcards: z.array(flashcardDraftSchema).length(2),
});

export const moduleDraftSchema = z.object({
  title: z.string().max(180),
  // Presentation metadata again: weaker models emit modules without a summary.
  summary: z.string().max(600).default(""),
  lessons: z.array(lessonDraftSchema).min(1).max(8),
});

export const courseDraftSchema = z.object({
  title: z.string().max(120),
  // Free/small models routinely omit presentation metadata. Default it here
  // and fill a useful description during normalization instead of failing.
  description: z.string().max(400).default(""),
  category: z.string().max(60).default("General"),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  coverEmoji: z.string().max(8).default("📘"),
  tags: z.array(z.string().max(30)).max(5).default([]),
  modules: z.array(moduleDraftSchema).min(3).max(5),
});

/* ------------------------------------------------------------- book mode */

/**
 * The model identifies which parsed sections a lesson came from; the pipeline
 * resolves that index list into a human-readable chapter/page citation.
 */
export const bookSourceRefDraftSchema = z.object({
  sectionIndexes: z.array(z.number().int().min(0)).max(8),
  note: z.string().max(600),
});

export const bookLessonDraftSchema = lessonDraftSchema.extend({
  sourceRef: bookSourceRefDraftSchema,
});

export const bookSectionDigestSchema = z.object({
  sectionIndex: z.number().int().min(0),
  summary: z.string().max(1400),
  keyEvidence: z.array(z.string().max(500)).min(1).max(4),
});

export const bookModuleDraftSchema = z.object({
  title: z.string().max(180),
  summary: z.string().max(600).default(""),
  lessons: z.array(bookLessonDraftSchema).min(1).max(8),
  sectionDigests: z.array(bookSectionDigestSchema).min(1).max(10),
});

export const bookPlanSchema = z.object({
  title: z.string().max(180),
  description: z.string().max(700).default(""),
  category: z.string().max(80).default(""),
  coverEmoji: z.string().max(8).default(""),
  tags: z.array(z.string().max(40)).max(8).default([]),
  throughline: z.string().max(1400),
  argumentMoves: z.array(z.string().max(500)).min(3).max(6),
  readingPromise: z.string().max(600),
  modules: z
    .array(
      z.object({
        chunkIndex: z.number().int().min(0),
        title: z.string().max(180),
        summary: z.string().max(600).default(""),
      }),
    )
    .min(1)
    .max(20),
});

export const bookLessonsSchema = z.object({
  lessons: z.array(bookLessonDraftSchema).min(1).max(3),
});

export type DiagramDraft = z.infer<typeof diagramSchema>;

export type SourceRef = z.infer<typeof sourceRefSchema>;

/** Final lesson shape persisted by Lumen (short or book mode). */
export type LessonDraft = z.infer<typeof lessonDraftSchema> & {
  sourceRef?: SourceRef | null;
  estimatedMinutes?: number;
};

export type ModuleDraft = Omit<z.infer<typeof moduleDraftSchema>, "lessons"> & {
  lessons: LessonDraft[];
};

export type CourseDraft = Omit<z.infer<typeof courseDraftSchema>, "modules"> & {
  modules: ModuleDraft[];
};

export type BookLessonDraft = z.infer<typeof bookLessonDraftSchema>;
export type BookSectionDigest = z.infer<typeof bookSectionDigestSchema>;
export type BookModuleDraft = z.infer<typeof bookModuleDraftSchema>;
export type BookPlan = z.infer<typeof bookPlanSchema>;
