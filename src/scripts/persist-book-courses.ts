import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { parseSections } from "@/lib/ingest";
import { demoUserId } from "@/lib/env";
import { persistCourseDraft } from "@/lib/repo";
import {
  courseDraftSchema,
  lessonDraftSchema,
  moduleDraftSchema,
  sourceRefSchema,
} from "@/lib/ai/schema";
import type { DraftCourse, DraftLesson } from "./book-courses/types";
import { zeroDayCourse } from "./book-courses/zero-day";
import { fundamentalsCourse } from "./book-courses/fundamentals";
import { osCourse } from "./book-courses/build-your-own-os";
import { nnCourse } from "./book-courses/build-your-own-neural-network";
import { processorCourse } from "./book-courses/build-your-own-processor";
import { plCourse } from "./book-courses/build-your-own-programming-language";
import { bcCourse } from "./book-courses/build-your-own-blockchain";
import { dbCourse } from "./book-courses/build-your-own-database";

/** 
 * Persists the five book courses authored for this project:
 *   - From Day Zero to Zero Day (PDF)
 *   - Fundamentals of Software Architecture, 2E (EPUB)
 *   - Build Your Own Operating System (text)
 *   - Build Your Own Neural Network (text)
 *   - Build Your Own Processor (text)
 * 
 * EPUB lessons carry `chapters` hints; we resolve them into
 * sourceRef.sectionIndexes by locating each `# Chapter N.` heading inside
 * the parsed section text (the same sections persistCourseDraft stores in
 * citations), so citations point at real source sections.
 */

const lessonSchema = lessonDraftSchema.extend({
  sourceRef: sourceRefSchema,
  chapters: z.array(z.string()).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
});
const moduleSchema = moduleDraftSchema.extend({ lessons: z.array(lessonSchema) });
const courseSchema = courseDraftSchema.extend({
  modules: z.array(moduleSchema).min(3).max(5),
});

const CACHE = path.resolve(__dirname, "../../.cache/books");

function resolveEpubSections(course: DraftCourse, text: string) {
  const sections = parseSections({ kind: "epub", text });
  const found: number[][] = [];

  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      const indexes = new Set<number>();
      for (const chapter of lesson.chapters ?? []) {
        const marker = `# ${chapter}.`;
        sections.forEach((section, index) => {
          if (section.text.includes(marker)) indexes.add(index);
        });
      }
      // Only overwrite the authored value when we actually resolved something.
      if (indexes.size > 0) {
        lesson.sourceRef.sectionIndexes = [...indexes].sort((a, b) => a - b);
      }
      found.push(lesson.sourceRef.sectionIndexes);
    }
  }

  const covered = new Set(found.flat());
  return { sectionCount: sections.length, coveredSections: covered.size };
}

async function persistOne(args: {
  draft: DraftCourse;
  sourceKind: "pdf" | "epub" | "text";
  sourceTitle: string;
  sourceAuthor: string;
  wordCount: number;
  charCount: number;
  cachedText?: string;
}) {
  const parsed = courseSchema.parse(args.draft) as unknown as DraftCourse;

  let coverageNote: Record<string, unknown> = {
    authoredBy: "book distillation (hand-authored from the source text)",
  };
  if (args.cachedText) {
    const resolved = resolveEpubSections(parsed, args.cachedText);
    coverageNote = { ...coverageNote, ...resolved };
    console.log(
      `  resolved EPUB citations: ${resolved.coveredSections}/${resolved.sectionCount} sections referenced`,
    );
  }

  const { courseId, lessonIds } = await persistCourseDraft({
    draft: parsed as never,
    userId: demoUserId,
    sourceKind: args.sourceKind,
    sourceTitle: args.sourceTitle,
    sourceAuthor: args.sourceAuthor,
    wordCount: args.wordCount,
    charCount: args.charCount,
    metadata: coverageNote,
  });

  const lessonCount = parsed.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  console.log(`  ✓ ${args.sourceTitle}`);
  console.log(`    course:   ${courseId}`);
  console.log(`    modules:  ${parsed.modules.length}`);
  console.log(`    lessons:  ${lessonCount} (${lessonIds.length} persisted)`);
  return courseId;
}

async function main() {
  console.log("Persisting book courses…");

  const zeroDayId = await persistOne({
    draft: zeroDayCourse,
    sourceKind: "pdf",
    sourceTitle: "From Day Zero to Zero Day",
    sourceAuthor: "Eugene Lim",
    wordCount: 99_807,
    charCount: 664_105,
  });

  const fundamentalsId = await persistOne({
    draft: fundamentalsCourse,
    sourceKind: "epub",
    sourceTitle: "Fundamentals of Software Architecture",
    sourceAuthor: "Mark Richards and Neal Ford",
    wordCount: 147_300,
    charCount: 1_016_784,
    cachedText: fs.readFileSync(path.join(CACHE, "fundamentals.txt"), "utf8"),
  });

  const osId = await persistOne({
    draft: osCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Operating System",
    sourceAuthor: "CodeCrafters community",
    wordCount: 45_000,
    charCount: 300_000,
  });

  const nnId = await persistOne({
    draft: nnCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Neural Network",
    sourceAuthor: "CodeCrafters community",
    wordCount: 55_000,
    charCount: 350_000,
  });

  const procId = await persistOne({
    draft: processorCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Processor",
    sourceAuthor: "CodeCrafters community",
    wordCount: 40_000,
    charCount: 250_000,
  });

  const plId = await persistOne({
    draft: plCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Programming Language",
    sourceAuthor: "CodeCrafters community",
    wordCount: 50_000,
    charCount: 350_000,
  });

  const bcId = await persistOne({
    draft: bcCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Blockchain",
    sourceAuthor: "CodeCrafters community",
    wordCount: 45_000,
    charCount: 300_000,
  });

  const dbId = await persistOne({
    draft: dbCourse,
    sourceKind: "text",
    sourceTitle: "Build Your Own Database",
    sourceAuthor: "CodeCrafters community",
    wordCount: 55_000,
    charCount: 400_000,
  });

  console.log("\nDone.");
  console.log(`  zero-day course:      ${zeroDayId}`);
  console.log(`  fundamentals course:  ${fundamentalsId}`);
  console.log(`  OS course:            ${osId}`);
  console.log(`  NN course:            ${nnId}`);
  console.log(`  Processor course:     ${procId}`);
  console.log(`  Programming Language: ${plId}`);
  console.log(`  Blockchain:           ${bcId}`);
  console.log(`  Database:             ${dbId}`);
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