import fs from "node:fs";
import path from "node:path";
import { parseSections } from "@/lib/ingest";
import type { DraftCourse, DraftLesson } from "./book-courses/types";
import { zeroDayCourse } from "./book-courses/zero-day";
import { fundamentalsCourse } from "./book-courses/fundamentals";
import { codeHiddenLanguageCourse } from "./book-courses/code-hidden-language";
import { hackerDisassemblingCourse } from "./book-courses/hacker-disassembling";
import { computerOrganizationCourse } from "./book-courses/computer-organization";
import { ddiaCourse } from "./book-courses/ddia";
import { osCourse } from "./book-courses/build-your-own-os";
import { nnCourse } from "./book-courses/build-your-own-neural-network";
import { processorCourse } from "./book-courses/build-your-own-processor";
import { plCourse } from "./book-courses/build-your-own-programming-language";
import { bcCourse } from "./book-courses/build-your-own-blockchain";
import { dbCourse } from "./book-courses/build-your-own-database";
import { bookCourseSteps } from "./book-courses/book-course-steps";
import { courseSteps } from "./book-courses/course-steps";
import { bookCourseMetadata } from "./book-courses/book-course-metadata";

const CACHE = path.resolve(__dirname, "../../.cache/books");

type BookDef = {
  key: string;
  draft: DraftCourse;
  cache: string;
  kind: "pdf" | "epub";
  /** EPUB body section range; omitted means derive all non-index sections. */
  expected?: number[];
};

const BOOKS: BookDef[] = [
  { key: "From Day Zero to Zero Day", draft: zeroDayCourse, cache: "zero-day", kind: "pdf" },
  { key: "Fundamentals of Software Architecture", draft: fundamentalsCourse, cache: "fundamentals", kind: "epub" },
  { key: "Code", draft: codeHiddenLanguageCourse, cache: "code-hidden-language", kind: "epub" },
  { key: "Hacker Disassembling", draft: hackerDisassemblingCourse, cache: "hacker-disassembling", kind: "epub" },
  { key: "Structured Computer Organization", draft: computerOrganizationCourse, cache: "computer-organization", kind: "pdf" },
  { key: "Designing Data-Intensive Applications", draft: ddiaCourse, cache: "ddia", kind: "epub" },
];

const ONLINE: { key: string; draft: DraftCourse }[] = [
  { key: "Build Your Own Operating System", draft: osCourse },
  { key: "Build Your Own Neural Network", draft: nnCourse },
  { key: "Build Your Own Processor", draft: processorCourse },
  { key: "Build Your Own Programming Language", draft: plCourse },
  { key: "Build Your Own Blockchain", draft: bcCourse },
  { key: "Build Your Own Database", draft: dbCourse },
];

function lessons(course: DraftCourse): DraftLesson[] {
  return course.modules.flatMap((module) => module.lessons);
}

function ranges(nums: number[]): string {
  if (!nums.length) return "none";
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const out: string[] = [];
  let start = sorted[0];
  let prev = start;
  for (const n of sorted.slice(1)) {
    if (n === prev + 1) {
      prev = n;
      continue;
    }
    out.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = prev = n;
  }
  out.push(start === prev ? `${start}` : `${start}-${prev}`);
  return out.join(",");
}

function resolveChapters(course: DraftCourse, text: string) {
  const sections = parseSections({ kind: "epub", text });
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
    for (const [number, start] of chapterOffsets) if (start <= offset) chapter = number;
    sectionChapter.push(chapter);
  }
  const body = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => !/Index|Colophon/i.test(section.title))
    .map(({ index }) => index);
  const chapterSections = new Map<number, number[]>();
  for (const index of body) {
    const chapter = sectionChapter[index];
    chapterSections.set(chapter, [...(chapterSections.get(chapter) ?? []), index]);
  }
  const cited = new Set<number>();
  for (const lesson of lessons(course)) {
    for (const label of lesson.chapters ?? []) {
      const chapter = Number(label.match(/\d+/)?.[0] ?? 0);
      for (const index of chapterSections.get(chapter) ?? []) cited.add(index);
    }
    for (const index of lesson.sourceRef?.sectionIndexes ?? []) cited.add(index);
  }
  return { sections, body, chapterCount: chapterOffsets.size, cited };
}

function auditBook(book: BookDef) {
  const file = path.join(CACHE, `${book.cache}.txt`);
  if (!fs.existsSync(file)) return { book, error: "missing cached source text" };
  const text = fs.readFileSync(file, "utf8");
  const course = book.draft;
  const all = lessons(course);
  const pages = all.flatMap((lesson) => {
    const start = lesson.sourceRef?.pageStart;
    const end = lesson.sourceRef?.pageEnd;
    return typeof start === "number" && typeof end === "number" ? [[start, end] as const] : [];
  });
  const sectionIndexes = all.flatMap((lesson) => lesson.sourceRef?.sectionIndexes ?? []);

  let sections = parseSections({ kind: book.kind, text });
  let body = sections.map((_, index) => index);
  let chapterCount = 0;
  let cited = new Set<number>(sectionIndexes);

  if (book.kind === "epub" && all.some((lesson) => (lesson.chapters ?? []).length)) {
    const resolved = resolveChapters(course, text);
    sections = resolved.sections;
    body = resolved.body;
    chapterCount = resolved.chapterCount;
    cited = resolved.cited;
  }

  // PDF page coverage: check each parsed section's page span against cited ranges.
  let uncoveredPageSections: number[] = [];
  if (book.kind === "pdf") {
    uncoveredPageSections = sections
      .map((section, index) => ({ section, index }))
      .filter(({ section }) => {
        const start = section.pageStart;
        const end = section.pageEnd ?? start;
        if (start == null) return false;
        return !pages.some(([a, b]) => start <= b && (end ?? start) >= a);
      })
      .map(({ index }) => index);
  }

  // Some PDF drafts cite parsed section indexes instead of page ranges.
  if (book.kind === "pdf" && sectionIndexes.length) {
    body = sections.map((_, index) => index);
    cited = new Set(sectionIndexes);
  }

  // Verified metadata names the non-teaching sections (front matter, appendices,
  // index). Excluding them makes the body count the number of sections a
  // learner is actually expected to cover.
  const verifiedExclusions = bookCourseMetadata[course.title]?.excludedIndexes;
  const excludedIndexes = new Set<number>(
    Array.isArray(verifiedExclusions) ? (verifiedExclusions as number[]) : [],
  );
  if (excludedIndexes.size === 0) {
    for (let index = 0; index < sections.length; index += 1) {
      if (/(^|– )Index( \(|$)|Colophon/i.test(sections[index].title)) {
        excludedIndexes.add(index);
      }
    }
  }
  body = body.filter((index) => !excludedIndexes.has(index));

  const missing = body.filter((index) => !cited.has(index));
  const covered = body.filter((index) => cited.has(index));

  const generic = all.filter((lesson) =>
    /\(part \d+\)|^xxii\.|NUL Null|Move P To X|Key Flow/i.test(lesson.title),
  );
  // Same guard persist-book-courses.ts uses before writing to the database.
  const persistBlocked = all.filter((lesson) => /\(part \d+\)|\bNUL Null\b|^Move P To X\b/.test(lesson.title));
  const stepsCovered = all.filter((lesson) => (lesson.steps?.length ?? 0) > 0).length;
  const generatedSteps = course.title in bookCourseSteps || course.title in courseSteps;

  return {
    book,
    course,
    all,
    sections,
    body,
    chapterCount,
    pages,
    cited,
    covered,
    missing,
    uncoveredPageSections,
    excludedIndexes: [...excludedIndexes].sort((a, b) => a - b),
    generic,
    persistBlocked,
    stepsCovered,
    generatedSteps,
  };
}

const lines: string[] = [];
const say = (line = "") => lines.push(line);

say("=== SOURCE MATERIAL INVENTORY ===");
const root = path.resolve(__dirname, "../../..");
const rootSources = fs.readdirSync(root).filter((f) => /\.(epub|pdf)$/i.test(f));
const cacheSources = fs.readdirSync(CACHE).filter((f) => f.endsWith(".txt"));
say(`Root book files (${rootSources.length}):`);
for (const f of rootSources) say(`  ${f}`);
say(`Cached parsed texts (${cacheSources.length}): ${cacheSources.join(", ")}`);
say();

say("=== BOOK COURSES ===");
const results = BOOKS.map(auditBook);
for (const r of results) {
  if ("error" in r) {
    say(`\n## ${r.book.key}\n  ERROR: ${r.error}`);
    continue;
  }
  const { book, all, sections, body, chapterCount, pages, covered, missing, uncoveredPageSections, excludedIndexes, generic } = r;
  const lessonCount = all.length;
  const modules = book.draft.modules.length;
  const withQuiz = all.filter((l) => l.quiz?.options?.length === 4 && l.quiz.options[l.quiz.correctIndex] != null).length;
  const withCards = all.filter((l) => (l.flashcards?.length ?? 0) >= 2).length;
  const withCitation = all.filter((l) => (l.sourceRef?.label ?? "").length > 0).length;
  const withDiagram = all.filter((l) => l.diagram).length;
  say(`\n## ${book.key}`);
  say(`  file: .cache/books/${book.cache}.txt | draft: ${book.draft.title}`);
  say(`  course: ${modules} modules, ${lessonCount} lessons`);
  say(`  structure: quiz ${withQuiz}/${lessonCount}, flashcards>=2 ${withCards}/${lessonCount}, label ${withCitation}/${lessonCount}, diagrams ${withDiagram}/${lessonCount}`);
  say(`  source: ${sections.length} parsed sections${chapterCount ? `, ${chapterCount} chapters` : ""}`);
  say(`  excluded non-teaching sections (${excludedIndexes.length}): ${excludedIndexes.length ? ranges(excludedIndexes) : "none"}`);
  if (book.kind === "epub") {
    say(`  coverage: ${covered.length}/${body.length} body sections cited (${((covered.length / Math.max(1, body.length)) * 100).toFixed(1)}%)`);
    say(`  cited sections: ${ranges([...r.cited])}`);
    say(`  uncovered body sections (${missing.length}): ${missing.length ? ranges(missing) : "none"}`);
    for (const index of missing.slice(0, 60)) {
      say(`    [${index}] ${(sections[index]?.title ?? "").slice(0, 90)}`);
    }
  } else {
    if (pages.length) {
      const minPage = Math.min(...pages.map(([a]) => a));
      const maxPage = Math.max(...pages.map(([, b]) => b));
      const trueGaps = uncoveredPageSections.filter((index) => !excludedIndexes.includes(index));
      const excludedGaps = uncoveredPageSections.filter((index) => excludedIndexes.includes(index));
      say(`  page ranges: ${pages.length} ranges spanning pp. ${minPage}-${maxPage}`);
      say(`  page coverage gaps (teaching sections): ${trueGaps.length ? ranges(trueGaps) : "none"}`);
      if (excludedGaps.length) {
        say(`  excluded page sections (front/back matter): ${ranges(excludedGaps)}`);
      }
      for (const index of trueGaps.slice(0, 20)) {
        const section = sections[index];
        say(`    [${index}] pp.${section?.pageStart}-${section?.pageEnd} ${(section?.title ?? "").slice(0, 80)}`);
      }
    }
    say(`  section-index coverage: ${covered.length}/${body.length} cited; uncovered: ${missing.length ? ranges(missing) : "none"}`);
    for (const index of missing.slice(0, 20)) {
      say(`    [${index}] ${(sections[index]?.title ?? "").slice(0, 90)}`);
    }
  }
  if (generic.length) {
    say(`  WARNING: ${generic.length} generated/placeholder-looking lesson titles, e.g. "${generic[0].title}"`);
  }
  if (r.persistBlocked.length) {
    say(`  BLOCKED: persist-book-courses.ts would refuse this draft (${r.persistBlocked.length} placeholder titles, e.g. "${r.persistBlocked[0].title}")`);
  }
  const stepData = (bookCourseSteps as Record<string, Record<string, unknown>>)[book.draft.title];
  if (stepData) {
    const keys = Object.keys(stepData);
    const titles = new Set(all.map((l) => l.title));
    const matched = keys.filter((k) => titles.has(k));
    say(`  hands-on steps authored for ${keys.length} lesson titles; matched in current draft: ${matched.length}`);
    const unmatched = keys.filter((k) => !titles.has(k));
    if (unmatched.length) say(`    unmatched step keys (first 5): ${unmatched.slice(0, 5).join(" | ")}`);
  } else if (r.stepsCovered === 0) {
    say("  WARNING: no hands-on steps authored for this course");
  }
}

say("\n=== ONLINE / BUILD-YOUR-OWN COURSES ===");
for (const { key, draft } of ONLINE) {
  const all = lessons(draft);
  const stepsAuthored = courseSteps[draft.title] ?? {};
  const stepKeys = Object.keys(stepsAuthored);
  const titles = new Set(all.map((l) => l.title));
  const matched = stepKeys.filter((k) => titles.has(k));
  const withQuiz = all.filter((l) => l.quiz?.options?.length === 4).length;
  const withCards = all.filter((l) => (l.flashcards?.length ?? 0) >= 2).length;
  const withDiagram = all.filter((l) => l.diagram).length;
  const totalSteps = all.reduce(
    (n, lesson) => n + (lesson.steps?.length ?? stepsAuthored[lesson.title]?.length ?? 0),
    0,
  );
  say(`\n## ${key}`);
  say(`  ${draft.modules.length} modules, ${all.length} lessons, ${totalSteps} hands-on steps`);
  say(`  structure: quiz ${withQuiz}/${all.length}, flashcards>=2 ${withCards}/${all.length}, diagrams ${withDiagram}/${all.length}`);
  say(`  hands-on step sets: ${stepKeys.length}; matched to current lessons: ${matched.length}`);
  const unmatched = stepKeys.filter((k) => !titles.has(k));
  if (unmatched.length) say(`    unmatched: ${unmatched.slice(0, 5).join(" | ")}`);
  const lessonsWithoutSteps = all.filter((l) => !(l.steps?.length) && !stepsAuthored[l.title]);
  if (lessonsWithoutSteps.length) {
    say(`  lessons without steps: ${lessonsWithoutSteps.length} (first: ${lessonsWithoutSteps[0].title})`);
  }
}

say("\n=== TOTALS ===");
const bookLessons = results.reduce((n, r) => ("all" in r && r.all ? n + r.all.length : n), 0);
const onlineLessons = ONLINE.reduce((n, { draft }) => n + lessons(draft).length, 0);
say(`  books: ${BOOKS.length}; book lessons: ${bookLessons}`);
say(`  online courses: ${ONLINE.length}; online lessons: ${onlineLessons}`);
say(`  total authored lessons: ${bookLessons + onlineLessons}`);

const outPath = path.resolve(__dirname, "../../source-coverage-report.txt");
fs.writeFileSync(outPath, lines.join("\n"));
console.log(lines.join("\n"));
console.log(`\nwritten to ${outPath}`);
