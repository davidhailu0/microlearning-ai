import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { parseSections } from "@/lib/ingest";
import { demoUserId } from "@/lib/env";
import { persistCourseDraft } from "@/lib/repo";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  courseDraftSchema,
  lessonDraftSchema,
  moduleDraftSchema,
  sourceRefSchema,
} from "@/lib/ai/schema";
import type { DraftCourse, DraftLesson } from "./book-courses/types";
import { zeroDayCourse } from "./book-courses/zero-day";
import { fundamentalsCourse } from "./book-courses/fundamentals";
import { computerOrganizationCourse } from "./book-courses/computer-organization";
import { codeHiddenLanguageCourse } from "./book-courses/code-hidden-language";
import { hackerDisassemblingCourse } from "./book-courses/hacker-disassembling";
import { ddiaCourse } from "./book-courses/ddia";
import { osCourse } from "./book-courses/build-your-own-os";
import { nnCourse } from "./book-courses/build-your-own-neural-network";
import { processorCourse } from "./book-courses/build-your-own-processor";
import { plCourse } from "./book-courses/build-your-own-programming-language";
import { bcCourse } from "./book-courses/build-your-own-blockchain";
import { dbCourse } from "./book-courses/build-your-own-database";
import { courseSteps } from "./book-courses/course-steps";
import { bookCourseMetadata } from "./book-courses/book-course-metadata";

/**
 * Persists the hand-authored book courses.
 *
 * Usage:
 *   npx tsx src/scripts/persist-book-courses.ts                    # all books
 *   npx tsx src/scripts/persist-book-courses.ts co code            # only these keys
 *   npx tsx src/scripts/persist-book-courses.ts --replace          # replace existing
 *
 * Persisting is insert-only by default: running it twice creates duplicate
 * courses. Pass --replace to delete the existing course with the same
 * sourceTitle (and its modules/lessons/quizzes/cards) before inserting.
 *
 * Content is normalized and long paragraphs are split at sentence boundaries
 * so lesson notes render as properly spaced prose instead of a wall of text.
 * Two additional recall questions are generated per lesson from its first
 * bullet and first flashcard, giving every lesson three questions total.
 */

type Quiz = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const lessonSchema = lessonDraftSchema.extend({
  sourceRef: sourceRefSchema,
  chapters: z.array(z.string()).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
});
const moduleSchema = moduleDraftSchema.extend({ lessons: z.array(lessonSchema) });
const courseSchema = courseDraftSchema.extend({
  modules: z.array(moduleSchema).min(3).max(8),
});

const CACHE = path.resolve(__dirname, "../../.cache/books");

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readCache(name: string) {
  const file = path.join(CACHE, `${name}.txt`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : undefined;
}

/* ---------------------------------------------------------- text hygiene */

const MAX_PARAGRAPH_CHARS = 620;

function tidy(text: string) {
  // Curated drafts are exported verbatim from the verified database, so only
  // collapse whitespace here. Punctuation must survive exactly: SQL snippets
  // (`SELECT ... WHERE key = ?`), file suffixes (`.slk, .dbf`), and arithmetic
  // series (`1..N`) are all legitimate content.
  return text.replace(/\s+/g, " ").trim();
}

function clip(text: string, max: number) {
  const clean = tidy(text);
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

function splitSentences(text: string) {
  const clean = tidy(text);
  if (clean.length <= MAX_PARAGRAPH_CHARS) return [clean];

  const sentences = clean.match(/[^.!?]+[.!?]+["')\]]?/g) ?? [clean];
  const paragraphs: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence.trim()}` : sentence.trim();
    if (next.length > MAX_PARAGRAPH_CHARS && current) {
      paragraphs.push(current);
      current = sentence.trim();
    } else {
      current = next;
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs;
}

function splitParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => tidy(block))
    .filter(Boolean)
    .flatMap((block) => splitSentences(block));
}

/* ------------------------------------------------- generated extra quizzes */

function buildExtraQuestions(
  lesson: DraftLesson,
  lessonIndex: number,
  allLessons: DraftLesson[],
): Quiz[] {
  const others = allLessons.filter((other) => other !== lesson);
  const extras: Quiz[] = [];

  const add = (question: string, correct: string | undefined, pool: (string | undefined)[]) => {
    if (!correct) return;
    const answer = clip(correct, 480);
    const distractors = [...new Set(pool.filter((item): item is string => Boolean(item)).map((item) => clip(item, 480)))]
      .filter((item) => item !== answer)
      .slice(0, 3);
    if (distractors.length < 3) return;

    const correctIndex = (lessonIndex + extras.length) % 4;
    const options = [...distractors];
    options.splice(correctIndex, 0, answer);

    extras.push({
      question,
      options,
      correctIndex,
      explanation: clip(`The lesson states: “${correct}”`, 1000),
    });
  };

  add(
    `Which statement is a key claim of “${lesson.title}”?`,
    lesson.bullets[0],
    others.map((other) => other.bullets[0]),
  );

  const card = lesson.flashcards[0];
  if (card) {
    add(
      `Which statement best explains “${card.front}”?`,
      card.back,
      others.map((other) => other.flashcards[0]?.back),
    );
  }

  return extras;
}

const PLACEHOLDER_TITLE = /\(part \d+\)|\bNUL Null\b|^Move P To X\b/;

function prepareDraft(course: DraftCourse): DraftCourse {
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const placeholders = allLessons.filter((lesson) => PLACEHOLDER_TITLE.test(lesson.title));
  if (placeholders.length) {
    throw new Error(
      `Refusing to persist "${course.title}": ${placeholders.length} placeholder lesson title(s) found ` +
        `(for example "${placeholders[0].title}"). Rebuild the draft from the verified course content first.`,
    );
  }
  let lessonIndex = 0;

  return {
    ...course,
    modules: course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => {
        const prepared: DraftLesson = {
          ...lesson,
          title: tidy(lesson.title),
          objective: tidy(lesson.objective),
          hook: tidy(lesson.hook),
          paragraphs: lesson.paragraphs
            .flatMap((paragraph) => splitParagraphs(paragraph))
            .slice(0, 20),
          bullets: lesson.bullets.map((bullet) => tidy(bullet)),
          steps: (lesson.steps ?? courseSteps[course.title]?.[lesson.title])?.map((step) => ({
            title: tidy(step.title),
            detail: tidy(step.detail),
          })),
          takeaway: tidy(lesson.takeaway),
          quiz: {
            ...lesson.quiz,
            question: tidy(lesson.quiz.question),
            options: lesson.quiz.options.map((option) => tidy(option)),
            explanation: tidy(lesson.quiz.explanation),
          },
          extraQuestions:
            lesson.extraQuestions?.map((question) => ({
              ...question,
              question: tidy(question.question),
              options: question.options.map((option) => tidy(option)),
              explanation: tidy(question.explanation),
            })) ?? buildExtraQuestions(lesson, lessonIndex, allLessons),
          flashcards: lesson.flashcards.map((card) => ({
            front: tidy(card.front),
            back: tidy(card.back),
          })),
        };
        lessonIndex += 1;
        return prepared;
      }),
    })),
  };
}

/* ------------------------------------------------------------- coverage */

function resolveEpubSections(course: DraftCourse, text: string) {
  const sections = parseSections({ kind: "epub", text });

  // A long chapter can be split across several parsed sections. Map every
  // section back to the chapter that contains it, not just the section that
  // holds the `# Chapter N.` heading.
  const headings = [...text.matchAll(/^# Chapter (\d+)\./gm)]
    .map((match) => ({ chapter: Number(match[1]), offset: match.index ?? 0 }))
    .sort((a, b) => a.offset - b.offset);
  const chapterOffsets = new Map<number, number>();
  for (const heading of headings) {
    if (!chapterOffsets.has(heading.chapter)) chapterOffsets.set(heading.chapter, heading.offset);
  }

  const sectionChapter: number[] = [];
  for (const section of sections) {
    let offset = text.indexOf(section.text.slice(0, 100));
    if (offset < 0) offset = text.indexOf(section.text.slice(0, 40));
    let chapter = 1;
    for (const [number, start] of chapterOffsets) {
      if (start <= offset) chapter = number;
    }
    sectionChapter.push(chapter);
  }

  const body = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => !/Index|Colophon/i.test(section.title))
    .map(({ index }) => index);
  const bodySet = new Set(body);

  const chapterSections = new Map<number, number[]>();
  for (const index of body) {
    const chapter = sectionChapter[index];
    const list = chapterSections.get(chapter) ?? [];
    list.push(index);
    chapterSections.set(chapter, list);
  }

  const found: number[][] = [];
  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      const indexes = new Set<number>();
      for (const chapterLabel of lesson.chapters ?? []) {
        const chapter = Number(chapterLabel.match(/\d+/)?.[0] ?? 0);
        for (const index of chapterSections.get(chapter) ?? []) indexes.add(index);
      }
      // Only overwrite the authored value when we actually resolved something.
      if (indexes.size > 0) {
        lesson.sourceRef.sectionIndexes = [...indexes].sort((a, b) => a - b);
      }
      found.push(lesson.sourceRef.sectionIndexes.filter((index) => bodySet.has(index)));
    }
  }

  const covered = new Set(found.flat());
  return {
    sectionCount: body.length,
    coveredSections: covered.size,
    coveredIndexes: [...covered].sort((a, b) => a - b),
    chapterCount: chapterOffsets.size,
    coveredChapters: [...chapterSections.keys()].filter((chapter) => chapterOffsets.has(chapter)).length,
    excludedIndexes: sections.map((_, index) => index).filter((index) => !bodySet.has(index)),
  };
}

/* ------------------------------------------------------------- persisting */

async function persistOne(args: {
  draft: DraftCourse;
  sourceKind: "pdf" | "epub" | "text";
  sourceTitle: string;
  sourceAuthor: string;
  cachedText?: string;
  wordCount?: number;
  charCount?: number;
  replace: boolean;
}) {
  const parsed = courseSchema.parse(args.draft) as unknown as DraftCourse;

  if (args.replace) {
    const db = getDb();
    const existing = await db
      .select({ id: schema.courses.id })
      .from(schema.courses)
      .where(eq(schema.courses.sourceTitle, args.sourceTitle));

    for (const row of existing) {
      await db
        .update(schema.xpEvents)
        .set({ courseId: null })
        .where(eq(schema.xpEvents.courseId, row.id));
      await db.delete(schema.courses).where(eq(schema.courses.id, row.id));
    }
    if (existing.length) {
      console.log(`  − replaced ${existing.length} existing course row(s)`);
    }
  }

  let coverageNote: Record<string, unknown> = {
    authoredBy: "book distillation (hand-authored from the source text)",
  };
  // EPUB only: PDF page refs are authored directly, so parsing them as EPUB
  // sections would report misleading coverage.
  if (args.cachedText && args.sourceKind === "epub") {
    const resolved = resolveEpubSections(parsed, args.cachedText);
    coverageNote = { ...coverageNote, ...resolved };
    console.log(
      `  resolved citations: ${resolved.coveredSections}/${resolved.sectionCount} sections referenced`,
    );
  }
  // The verified metadata records the audited body-section counts. Derived
  // counts include front matter and appendices and would understate coverage.
  // When a verified entry exists, use it as-is instead of mixing in derived keys.
  const verifiedMetadata = bookCourseMetadata[args.sourceTitle];
  const metadata = verifiedMetadata ? { ...verifiedMetadata } : coverageNote;

  const { courseId, lessonIds } = await persistCourseDraft({
    draft: parsed as never,
    userId: demoUserId,
    sourceKind: args.sourceKind,
    sourceTitle: args.sourceTitle,
    sourceAuthor: args.sourceAuthor,
    wordCount: args.wordCount ?? (args.cachedText ? countWords(args.cachedText) : 0),
    charCount: args.charCount ?? args.cachedText?.length ?? 0,
    metadata,
  });

  const lessonCount = parsed.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const questionCount = parsed.modules.reduce(
    (sum, m) =>
      sum + m.lessons.reduce((n, lesson) => n + 1 + (lesson.extraQuestions?.length ?? 0), 0),
    0,
  );
  console.log(`  ✓ ${args.sourceTitle}`);
  console.log(`    course:   ${courseId}`);
  console.log(`    modules:  ${parsed.modules.length}`);
  console.log(`    lessons:  ${lessonCount} (${lessonIds.length} persisted)`);
  console.log(`    questions: ${questionCount}\n`);
  return courseId;
}

type Book = {
  key: string;
  draft: DraftCourse;
  sourceKind: "pdf" | "epub" | "text";
  sourceTitle: string;
  sourceAuthor: string;
  cache?: string;
  wordCount?: number;
  charCount?: number;
};

const books: Book[] = [
  {
    key: "zero-day",
    draft: zeroDayCourse,
    sourceKind: "pdf",
    sourceTitle: "From Day Zero to Zero Day",
    sourceAuthor: "Eugene Lim",
    cache: "zero-day",
    wordCount: 99_807,
    charCount: 664_105,
  },
  {
    key: "fundamentals",
    draft: fundamentalsCourse,
    sourceKind: "epub",
    sourceTitle: "Fundamentals of Software Architecture",
    sourceAuthor: "Mark Richards and Neal Ford",
    cache: "fundamentals",
    wordCount: 147_300,
    charCount: 1_016_784,
  },
  {
    key: "co",
    draft: computerOrganizationCourse,
    sourceKind: "pdf",
    sourceTitle: "Structured Computer Organization",
    sourceAuthor: "Andrew S. Tanenbaum and Todd Austin",
    cache: "computer-organization",
  },
  {
    key: "code",
    draft: codeHiddenLanguageCourse,
    sourceKind: "epub",
    sourceTitle: "Code: The Hidden Language of Computer Hardware and Software",
    sourceAuthor: "Charles Petzold",
    cache: "code-hidden-language",
  },
  {
    key: "hacker",
    draft: hackerDisassemblingCourse,
    sourceKind: "epub",
    sourceTitle: "Hacker Disassembling Uncovered",
    sourceAuthor: "Kris Kaspersky",
    cache: "hacker-disassembling",
  },
  {
    key: "ddia",
    draft: ddiaCourse,
    sourceKind: "epub",
    sourceTitle: "Designing Data-Intensive Applications",
    sourceAuthor: "Martin Kleppmann",
    cache: "ddia",
  },
  {
    key: "os",
    draft: osCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Operating System",
    sourceAuthor: "CodeCrafters community",
    wordCount: 45_000,
    charCount: 300_000,
  },
  {
    key: "nn",
    draft: nnCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Neural Network",
    sourceAuthor: "CodeCrafters community",
    wordCount: 55_000,
    charCount: 350_000,
  },
  {
    key: "processor",
    draft: processorCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Processor",
    sourceAuthor: "CodeCrafters community",
    wordCount: 40_000,
    charCount: 250_000,
  },
  {
    key: "pl",
    draft: plCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Programming Language",
    sourceAuthor: "CodeCrafters community",
    wordCount: 50_000,
    charCount: 350_000,
  },
  {
    key: "blockchain",
    draft: bcCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Blockchain",
    sourceAuthor: "CodeCrafters community",
    wordCount: 45_000,
    charCount: 300_000,
  },
  {
    key: "database",
    draft: dbCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Database",
    sourceAuthor: "CodeCrafters community",
    wordCount: 55_000,
    charCount: 400_000,
  },
];

async function main() {
  const args = process.argv.slice(2);
  const replace = args.includes("--replace");
  const wanted = args.filter((a) => !a.startsWith("-"));
  const selected = wanted.length
    ? books.filter((b) => wanted.includes(b.key))
    : books;

  if (wanted.length && selected.length !== wanted.length) {
    const known = new Set(books.map((b) => b.key));
    const unknown = wanted.filter((k) => !known.has(k));
    throw new Error(`Unknown book key(s): ${unknown.join(", ")}. Valid: ${[...known].join(", ")}`);
  }

  console.log(`Persisting ${selected.length} book course(s)${replace ? " (replace mode)" : ""}…\n`);
  const results: { key: string; id: string }[] = [];

  for (const book of selected) {
    const cachedText = book.cache ? readCache(book.cache) : undefined;
    if (book.cache && !cachedText) {
      console.warn(`  ! no cached text for "${book.key}" (expected .cache/books/${book.cache}.txt)`);
    }
    const id = await persistOne({
      draft: prepareDraft(book.draft),
      sourceKind: book.sourceKind,
      sourceTitle: book.sourceTitle,
      sourceAuthor: book.sourceAuthor,
      cachedText,
      wordCount: book.wordCount,
      charCount: book.charCount,
      replace,
    });
    results.push({ key: book.key, id });
  }

  console.log("Done.");
  for (const r of results) console.log(`  ${r.key.padEnd(12)} ${r.id}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:");
      for (const issue of error.issues.slice(0, 20)) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  });
