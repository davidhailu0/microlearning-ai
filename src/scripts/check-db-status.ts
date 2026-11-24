import "dotenv/config";
import { getDb } from "../lib/db";
import { courses, modules, lessons, citations, sources, quizzes, questions, quizOptions, flashcards, courseProgress, lessonProgress, cardStates, reviews, quizAttempts } from "../lib/db/schema";
import { count, eq, sql, inArray } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const db = getDb();
  const out: string[] = [];

  // 1. Courses
  const courseRows = await db.select().from(courses);
  out.push(`=== COURSES IN DB: ${courseRows.length} ===`);
  for (const c of courseRows) {
    out.push(`[${String(c.id).slice(0, 8)}] ${c.title} | kind=${c.sourceKind} | source="${c.sourceTitle}" | author="${c.sourceAuthor}"`);

  }

  // 2. Modules per course
  out.push("");
  out.push("=== MODULES PER COURSE ===");
  const modRows = await db
    .select({ course: courses.title, n: count(modules.id) })
    .from(modules)
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .groupBy(courses.title);
  for (const r of modRows) out.push(`  ${r.course}: ${r.n} modules`);

  // 3. Lessons per course
  out.push("");
  out.push("=== LESSONS PER COURSE ===");
  const lesRows = await db
    .select({ course: courses.title, n: count(lessons.id) })
    .from(lessons)
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .groupBy(courses.title);
  let totalLessons = 0;
  for (const r of lesRows) { out.push(`  ${r.course}: ${r.n} lessons`); totalLessons += r.n; }
  out.push(`  TOTAL: ${totalLessons}`);

  // 4. Citations per course (source_ref lives on lessons? check citations table)
  out.push("");
  out.push("=== CITATIONS TABLE PER COURSE ===");
  const citRows = await db
    .select({ course: courses.title, n: count(citations.id) })
    .from(citations)
    .innerJoin(lessons, eq(citations.lessonId, lessons.id))
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .groupBy(courses.title);
  for (const r of citRows) out.push(`  ${r.course}: ${r.n} citation rows`);
  const citTotal = await db.select({ n: count(citations.id) }).from(citations);
  out.push(`  TOTAL citations: ${citTotal[0].n}`);

  // 5. Quizzes / questions / options per course
  out.push("");
  out.push("=== QUIZZES PER COURSE ===");
  const quizRows = await db
    .select({ course: courses.title, n: count(quizzes.id) })
    .from(quizzes)
    .innerJoin(lessons, eq(quizzes.lessonId, lessons.id))
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .groupBy(courses.title);
  for (const r of quizRows) out.push(`  ${r.course}: ${r.n} quizzes`);

  const qTotal = await db.select({ n: count(questions.id) }).from(questions);
  out.push(`  TOTAL questions: ${qTotal[0].n} (expect 5x lessons = ${totalLessons * 5})`);
  const oTotal = await db.select({ n: count(quizOptions.id) }).from(quizOptions);
  out.push(`  TOTAL quiz options: ${oTotal[0].n} (expect 4x questions = ${qTotal[0].n * 4})`);

  // 6. Flashcards per course
  out.push("");
  out.push("=== FLASHCARDS PER COURSE ===");
  const fcRows = await db
    .select({ course: courses.title, n: count(flashcards.id) })
    .from(flashcards)
    .innerJoin(lessons, eq(flashcards.lessonId, lessons.id))
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .innerJoin(courses, eq(modules.courseId, courses.id))
    .groupBy(courses.title);
  for (const r of fcRows) out.push(`  ${r.course}: ${r.n} flashcards`);
  const fcTotal = await db.select({ n: count(flashcards.id) }).from(flashcards);
  out.push(`  TOTAL flashcards: ${fcTotal[0].n} (expect 5x lessons = ${totalLessons * 5})`);

  // 7. Sources
  out.push("");
  out.push("=== SOURCES TABLE ===");
  const srcRows = await db.select().from(sources);
  for (const s of srcRows) out.push(`  [${s.kind}] ${s.title} by ${s.author ?? "?"} | wordCount=${s.wordCount} charCount=${s.charCount}`);
  if (srcRows.length === 0) out.push("  (none)");

  // 8. Progress tracking
  out.push("");
  out.push("=== PROGRESS TRACKING ===");
  const lp = await db.select({ n: sql<number>`count(*)::int` }).from(lessonProgress);
  const cp = await db.select({ n: sql<number>`count(*)::int` }).from(courseProgress);
  const cs = await db.select({ n: sql<number>`count(*)::int` }).from(cardStates);
  const rv = await db.select({ n: sql<number>`count(*)::int` }).from(reviews);
  const qa = await db.select({ n: sql<number>`count(*)::int` }).from(quizAttempts);
  out.push(`  lesson_progress: ${lp[0].n}`);
  out.push(`  course_progress: ${cp[0].n}`);
  out.push(`  card_states (FSRS): ${cs[0].n}`);
  out.push(`  reviews: ${rv[0].n}`);
  out.push(`  quiz_attempts: ${qa[0].n}`);

  // 9. Roadmap files
  out.push("");
  out.push("=== ROADMAP FILES ===");
  const roadmaps = [
    "ROADMAP-FROM-DAY-ZERO-TO-ZERO-DAY.md",
    "ROADMAP-FUNDAMENTALS-OF-SOFTWARE-ARCHITECTURE.md",
    "ROADMAP-CODE-HIDDEN-LANGUAGE.md",
    "ROADMAP-HACKER-DISASSEMBLING.md",
    "ROADMAP-STRUCTURED-COMPUTER-ORGANIZATION.md",
    "ROADMAP-DESIGNING-DATA-INTENSIVE-APPLICATIONS.md",
  ];
  for (const name of roadmaps) {
    const file = path.resolve(__dirname, "../../..", name);
    out.push(`  ${name}: ${fs.existsSync(file) ? "EXISTS" : "MISSING"}`);
  }

  fs.writeFileSync(path.resolve(__dirname, "../../db-status.txt"), out.join("\n"));
  console.log("done");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
