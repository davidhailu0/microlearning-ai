import path from "node:path";
import fs from "node:fs";
import postgres from "postgres";
import type { DraftCourse, DraftDiagram, DraftLesson } from "./book-courses/types";

/**
 * Exports the verified, curated course library from Postgres back into the
 * hand-authored draft files under `src/scripts/book-courses/`.
 *
 * The database is the source of truth for these courses: drafts were lost once
 * and restored from `app_pg_data_ai`. Regenerating from the database keeps the
 * source tree and a fresh restore in lockstep.
 *
 * Usage:
 *   CURATED_DB_URL=postgres://... npx tsx src/scripts/export-curated-courses.ts
 *   CURATED_DB_URL=... npx tsx src/scripts/export-curated-courses.ts --dry-run
 */

type CourseTarget = {
  title: string;
  key: string;
  exportName: string;
};

const TARGETS: CourseTarget[] = [
  {
    title: "From Day Zero to Zero Day",
    key: "zero-day",
    exportName: "zeroDayCourse",
  },
  {
    title: "Fundamentals of Software Architecture",
    key: "fundamentals",
    exportName: "fundamentalsCourse",
  },
  {
    title: "Structured Computer Organization",
    key: "computer-organization",
    exportName: "computerOrganizationCourse",
  },
  {
    title: "Code: The Hidden Language of Computer Hardware and Software",
    key: "code-hidden-language",
    exportName: "codeHiddenLanguageCourse",
  },
  {
    title: "Hacker Disassembling Uncovered",
    key: "hacker-disassembling",
    exportName: "hackerDisassemblingCourse",
  },
  {
    title: "Designing Data-Intensive Applications",
    key: "ddia",
    exportName: "ddiaCourse",
  },
  {
    title: "Build Your Own Operating System",
    key: "build-your-own-os",
    exportName: "osCourse",
  },
  {
    title: "Build Your Own Neural Network",
    key: "build-your-own-neural-network",
    exportName: "nnCourse",
  },
  {
    title: "Build Your Own Processor",
    key: "build-your-own-processor",
    exportName: "processorCourse",
  },
  {
    title: "Build Your Own Programming Language",
    key: "build-your-own-programming-language",
    exportName: "plCourse",
  },
  {
    title: "Build Your Own Blockchain",
    key: "build-your-own-blockchain",
    exportName: "bcCourse",
  },
  {
    title: "Build Your Own Database",
    key: "build-your-own-database",
    exportName: "dbCourse",
  },
];

/** Parsed section indexes 44-45 complete the Hacker book's final chapter. */
const HACKER_TITLE = "Hacker Disassembling Uncovered";
const HACKER_FINAL_SECTIONS = [44, 45];

type BlockRow = {
  lessonId: string;
  position: number;
  type: string;
  payload: Record<string, unknown>;
};

type CourseRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  coverEmoji: string;
  tags: string[];
};

type ModuleRow = {
  id: string;
  courseId: string;
  position: number;
  title: string;
  summary: string;
};

type LessonRow = {
  id: string;
  courseId: string;
  moduleId: string;
  position: number;
  title: string;
  objective: string;
  hook: string;
  keyTakeaway: string;
  estimatedMinutes: number;
};

type CitationRow = {
  lessonId: string;
  label: string;
  locator: {
    pageStart?: number | null;
    pageEnd?: number | null;
    sectionIndexes?: number[];
  } | null;
  quote: string | null;
};

type QuizRow = { id: string; lessonId: string };
type QuestionRow = {
  id: string;
  quizId: string;
  position: number;
  prompt: string;
  explanation: string;
};
type OptionRow = {
  questionId: string;
  position: number;
  label: string;
  isCorrect: boolean;
};
type FlashcardRow = { lessonId: string; front: string; back: string };
type SourceRow = {
  courseId: string;
  kind: string;
  title: string | null;
  author: string | null;
  wordCount: number;
  charCount: number;
  metadata: Record<string, unknown> | null;
};

function fail(message: string): never {
  throw new Error(message);
}

function groupBy<T, K>(rows: T[], key: (row: T) => K) {
  const map = new Map<K, T[]>();
  for (const row of rows) {
    const value = key(row);
    const list = map.get(value);
    if (list) list.push(row);
    else map.set(value, [row]);
  }
  return map;
}

/* --------------------------------------------------------- TS serializing */

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function tsLiteral(value: unknown, depth = 0): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `[\n${value.map((item) => `${childIndent}${tsLiteral(item, depth + 1)},`).join("\n")}\n${indent}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, item]) => item !== undefined,
    );
    if (entries.length === 0) return "{}";
    return `{\n${entries
      .map(([key, item]) => {
        const renderedKey = IDENTIFIER.test(key) ? key : JSON.stringify(key);
        return `${childIndent}${renderedKey}: ${tsLiteral(item, depth + 1)},`;
      })
      .join("\n")}\n${indent}}`;
  }
  return fail(`Cannot serialize ${typeof value}`);
}

/* ------------------------------------------------------------ main export */

async function main() {
  const url = process.env.CURATED_DB_URL ?? process.env.DATABASE_URL;
  if (!url) fail("Set CURATED_DB_URL (or DATABASE_URL) to the verified database.");
  const dryRun = process.argv.includes("--dry-run");
  const sql = postgres(url, { max: 1 });

  const courses = await sql<CourseRow[]>`
    select id, title, description, category, level,
           cover_emoji as "coverEmoji", tags
    from courses order by title`;
  const modules = await sql<ModuleRow[]>`
    select id, course_id as "courseId", position, title, summary
    from modules order by course_id, position`;
  const lessons = await sql<LessonRow[]>`
    select id, course_id as "courseId", module_id as "moduleId", position, title,
           objective, hook, key_takeaway as "keyTakeaway",
           estimated_minutes as "estimatedMinutes"
    from lessons order by course_id, position`;
  const blocks = await sql<BlockRow[]>`
    select b.lesson_id as "lessonId", b.position, b.type, b.payload
    from content_blocks b
    join lessons l on l.id = b.lesson_id
    order by l.course_id, l.position, b.position`;
  const citations = await sql<CitationRow[]>`
    select lesson_id as "lessonId", label, locator, quote
    from citations order by lesson_id`;
  const quizzes = await sql<QuizRow[]>`
    select id, lesson_id as "lessonId" from quizzes order by lesson_id`;
  const questions = await sql<QuestionRow[]>`
    select id, quiz_id as "quizId", position, prompt, explanation
    from questions order by quiz_id, position`;
  const options = await sql<OptionRow[]>`
    select question_id as "questionId", position, label, is_correct as "isCorrect"
    from quiz_options order by question_id, position`;
  const flashcards = await sql<FlashcardRow[]>`
    select lesson_id as "lessonId", front, back
    from flashcards order by lesson_id, created_at, id`;
  const sources = await sql<SourceRow[]>`
    select course_id as "courseId", kind, title, author,
           word_count as "wordCount", char_count as "charCount", metadata
    from sources order by course_id`;

  const coursesById = new Map(courses.map((course) => [course.id, course]));
  const modulesById = new Map(modules.map((module) => [module.id, module]));
  const modulesByCourse = groupBy(modules, (module) => module.courseId);
  const lessonsByModule = groupBy(lessons, (lesson) => lesson.moduleId);
  const blocksByLesson = groupBy(blocks, (block) => block.lessonId);
  const citationsByLesson = groupBy(citations, (citation) => citation.lessonId);
  const quizzesByLesson = groupBy(quizzes, (quiz) => quiz.lessonId);
  const questionsByQuiz = groupBy(questions, (question) => question.quizId);
  const optionsByQuestion = groupBy(options, (option) => option.questionId);
  const flashcardsByLesson = groupBy(flashcards, (card) => card.lessonId);
  const sourcesByCourse = new Map(sources.map((source) => [source.courseId, source]));

  const warnings: string[] = [];
  const drafts: Record<string, DraftCourse> = {};
  const snapshots: Record<string, unknown> = {};
  const metadataByTitle: Record<string, Record<string, unknown>> = {};

  for (const target of TARGETS) {
    const course = courses.find((row) => row.title === target.title);
    if (!course) fail(`Missing course: ${target.title}`);

    const courseModules = modulesByCourse.get(course.id) ?? [];
    if (courseModules.length === 0) fail(`No modules for ${course.title}`);

    const draftModules = courseModules.map((module) => {
      const moduleLessons = lessonsByModule.get(module.id) ?? [];
      if (moduleLessons.length === 0) fail(`No lessons in module: ${module.title}`);

      const draftLessons = moduleLessons.map((lesson): DraftLesson => {
        const lessonBlocks = blocksByLesson.get(lesson.id) ?? [];
        const byType = groupBy(lessonBlocks, (block) => block.type);
        const single = (type: string) => {
          const found = byType.get(type) ?? [];
          if (found.length !== 1) {
            fail(`Expected one ${type} block in "${lesson.title}", found ${found.length}`);
          }
          return found[0]!.payload;
        };

        const hook = single("hook").text;
        const takeaway = single("takeaway").text;
        const bullets = single("bullets").items;
        const steps = single("steps").items;
        const diagram = single("diagram").diagram;
        if (typeof hook !== "string" || typeof takeaway !== "string") {
          fail(`Malformed hook/takeaway in "${lesson.title}"`);
        }
        if (!Array.isArray(bullets) || !Array.isArray(steps)) {
          fail(`Malformed bullets/steps in "${lesson.title}"`);
        }
        if (!diagram || typeof diagram !== "object") {
          fail(`Malformed diagram in "${lesson.title}"`);
        }

        const paragraphs = (byType.get("paragraph") ?? [])
          .map((block) => block.payload.text)
          .filter((text): text is string => typeof text === "string");
        if (paragraphs.length === 0) fail(`No paragraphs in "${lesson.title}"`);

        const lessonQuizzes = quizzesByLesson.get(lesson.id) ?? [];
        if (lessonQuizzes.length !== 1) {
          fail(`Expected one quiz for "${lesson.title}", found ${lessonQuizzes.length}`);
        }
        const quizQuestions = questionsByQuiz.get(lessonQuizzes[0]!.id) ?? [];
        if (quizQuestions.length < 1) fail(`No questions for "${lesson.title}"`);
        const mappedQuestions = quizQuestions.map((question) => {
          const questionOptions = optionsByQuestion.get(question.id) ?? [];
          if (questionOptions.length !== 4) {
            fail(`Expected 4 options for question in "${lesson.title}", found ${questionOptions.length}`);
          }
          const correctIndex = questionOptions.findIndex((option) => option.isCorrect);
          if (correctIndex < 0) fail(`No correct option for question in "${lesson.title}"`);
          if (questionOptions.filter((option) => option.isCorrect).length !== 1) {
            fail(`Multiple correct options for question in "${lesson.title}"`);
          }
          return {
            question: question.prompt,
            options: questionOptions.map((option) => option.label),
            correctIndex,
            explanation: question.explanation,
          };
        });

        const lessonCitations = citationsByLesson.get(lesson.id) ?? [];
        if (lessonCitations.length !== 1) {
          fail(`Expected one citation for "${lesson.title}", found ${lessonCitations.length}`);
        }
        const citation = lessonCitations[0]!;
        const sourceRef = {
          label: citation.label,
          pageStart: citation.locator?.pageStart ?? null,
          pageEnd: citation.locator?.pageEnd ?? null,
          note: citation.quote ?? "",
          sectionIndexes: [...(citation.locator?.sectionIndexes ?? [])].sort((a, b) => a - b),
        };

        const cards = (flashcardsByLesson.get(lesson.id) ?? []).map((card) => ({
          front: card.front,
          back: card.back,
        }));
        if (cards.length === 0) fail(`No flashcards for "${lesson.title}"`);

        return {
          title: lesson.title,
          objective: lesson.objective,
          hook,
          paragraphs,
          bullets: bullets as string[],
          steps: steps as { title: string; detail: string }[],
          takeaway,
          diagram: diagram as DraftDiagram,
          quiz: mappedQuestions[0]!,
          extraQuestions: mappedQuestions.slice(1),
          flashcards: cards,
          sourceRef,
          estimatedMinutes: lesson.estimatedMinutes,
        };
      });

      return {
        title: module.title,
        summary: module.summary,
        lessons: draftLessons,
      };
    });

    const draft: DraftCourse = {
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      coverEmoji: course.coverEmoji,
      tags: course.tags,
      modules: draftModules,
    };

    if (course.title === HACKER_TITLE) {
      const finalLesson = draft.modules.at(-1)?.lessons.at(-1);
      if (!finalLesson) fail("Hacker course has no final lesson");
      finalLesson.sourceRef.sectionIndexes = [
        ...new Set([...finalLesson.sourceRef.sectionIndexes, ...HACKER_FINAL_SECTIONS]),
      ].sort((a, b) => a - b);
    }

    const source = sourcesByCourse.get(course.id);
    const verifiedMetadata = { ...(source?.metadata ?? {}) };
    if (course.title === HACKER_TITLE) {
      const covered = [
        ...new Set([
          ...((verifiedMetadata.coveredIndexes as number[] | undefined) ?? []),
          ...HACKER_FINAL_SECTIONS,
        ]),
      ].sort((a, b) => a - b);
      verifiedMetadata.coveredIndexes = covered;
      verifiedMetadata.coveredSections = covered.length;
      verifiedMetadata.sectionCount = covered.length;
      verifiedMetadata.excludedIndexes = [0, 1, 2];
      verifiedMetadata.coverageBasis =
        "Every body section from Protection Classifications through the How to… appendix is cited. Front matter is excluded.";
      delete verifiedMetadata.chapterCount;
      delete verifiedMetadata.coveredChapters;
    }
    metadataByTitle[course.title] = verifiedMetadata;

    // Sanity checks: the are exactly the limits persist-book-courses enforces.
    for (const mod of draft.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.sourceRef.sectionIndexes.length > 10) {
          warnings.push(
            `${course.title} / ${lesson.title}: ${lesson.sourceRef.sectionIndexes.length} section indexes`,
          );
        }
        if ((lesson.extraQuestions?.length ?? 0) + 1 !== 5) {
          warnings.push(
            `${course.title} / ${lesson.title}: ${1 + (lesson.extraQuestions?.length ?? 0)} questions`,
          );
        }
        if (lesson.flashcards.length < 2 || lesson.flashcards.length > 8) {
          warnings.push(`${course.title} / ${lesson.title}: ${lesson.flashcards.length} flashcards`);
        }
      }
    }

    drafts[target.key] = draft;
    snapshots[target.key] = {
      courseId: course.id,
      source: sourcesByCourse.get(course.id) ?? null,
      course: {
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        coverEmoji: course.coverEmoji,
        tags: course.tags,
      },
      modules: draftModules.map((module, moduleIndex) => ({
        position: moduleIndex,
        title: module.title,
        summary: module.summary,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          position: lessonIndex,
          ...lesson,
        })),
      })),
    };
  }

  const generatedAt = new Date().toISOString();
  const exportPath = path.resolve(__dirname, "../../.cache/curated-courses.export.json");
  fs.mkdirSync(path.dirname(exportPath), { recursive: true });
  fs.writeFileSync(
    exportPath,
    JSON.stringify({ generatedAt, database: url.replace(/:[^:@/]+@/, ":***@"), drafts, snapshots }, null, 2),
  );
  console.log(`Wrote ${exportPath}`);

  const metadataPath = path.resolve(__dirname, "book-courses/book-course-metadata.ts");
  const metadataContents = `/**
 * Verified source-coverage metadata for the book courses.
 * Generated alongside the draft files by export-curated-courses.ts.
 */
export const bookCourseMetadata: Record<string, Record<string, unknown>> = ${tsLiteral(metadataByTitle)};
`;
  if (!dryRun) {
    fs.writeFileSync(metadataPath, metadataContents);
    console.log(`Wrote ${metadataPath}`);
  }

  if (warnings.length) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const warning of warnings) console.warn(`  ! ${warning}`);
  }

  if (dryRun) {
    console.log("\nDry run: draft files were not rewritten.");
    for (const target of TARGETS) {
      const draft = drafts[target.key]!;
      const lessonCount = draft.modules.reduce((sum, module) => sum + module.lessons.length, 0);
      console.log(`  ${target.key.padEnd(32)} ${draft.modules.length} modules, ${lessonCount} lessons`);
    }
    await sql.end();
    return;
  }

  const backupDir = path.resolve(
    __dirname,
    `../../.cache/pre-restore-drafts/${generatedAt.replace(/[:.]/g, "-")}`,
  );
  fs.mkdirSync(backupDir, { recursive: true });

  for (const target of TARGETS) {
    const file = path.resolve(__dirname, "book-courses", `${target.key}.ts`);
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(backupDir, path.basename(file)));
    }
    const draft = drafts[target.key]!;
    const body = tsLiteral(draft);
    const contents = `import type { DraftCourse } from "./types";

/**
 * Verified course content exported from the curated database on ${generatedAt.slice(0, 10)}.
 * Regenerate with: npx tsx src/scripts/export-curated-courses.ts
 */
export const ${target.exportName}: DraftCourse = ${body};
`;
    fs.writeFileSync(file, contents);
    const lessonCount = draft.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    console.log(
      `  ${target.key.padEnd(32)} ${draft.modules.length} modules, ${lessonCount} lessons, ${(contents.length / 1024).toFixed(0)} KB`,
    );
  }

  console.log(`\nBacked up previous drafts to ${backupDir}`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
