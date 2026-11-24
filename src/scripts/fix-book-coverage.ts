import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import * as s from "../lib/db/schema";
import { parseSections } from "../lib/ingest";
import { fundamentalsCourse } from "./book-courses/fundamentals";

const CACHE = path.resolve(__dirname, "../../.cache/books");

function readCache(name: string) {
  return fs.readFileSync(path.join(CACHE, `${name}.txt`), "utf8");
}

function uniqueSorted(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function splitEvenly<T>(items: T[], groups: number): T[][] {
  if (groups <= 0) return [];
  const base = Math.floor(items.length / groups);
  const remainder = items.length % groups;
  const out: T[][] = [];
  let cursor = 0;
  for (let i = 0; i < groups; i++) {
    const size = base + (i < remainder ? 1 : 0);
    out.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  return out;
}

type CitationRow = {
  citationId: string;
  lessonId: string;
  lessonTitle: string;
  label: string;
  locator: unknown;
};

async function citationsFor(courseId: string): Promise<CitationRow[]> {
  const db = getDb();
  return db
    .select({
      citationId: s.citations.id,
      lessonId: s.lessons.id,
      lessonTitle: s.lessons.title,
      label: s.citations.label,
      locator: s.citations.locator,
    })
    .from(s.citations)
    .innerJoin(s.lessons, eq(s.citations.lessonId, s.lessons.id))
    .innerJoin(s.modules, eq(s.lessons.moduleId, s.modules.id))
    .where(eq(s.modules.courseId, courseId))
    .orderBy(s.modules.position, s.lessons.position);
}

async function courseByTitle(title: string) {
  const db = getDb();
  const rows = await db
    .select({ id: s.courses.id, title: s.courses.title })
    .from(s.courses)
    .where(eq(s.courses.sourceTitle, title));
  if (rows.length !== 1) {
    throw new Error(`Expected one "${title}" course, found ${rows.length}.`);
  }
  return rows[0];
}

async function updateLocator(citationId: string, current: unknown, sectionIndexes: number[]) {
  const db = getDb();
  const locator = (current ?? {}) as Record<string, unknown>;
  await db
    .update(s.citations)
    .set({ locator: { ...locator, sectionIndexes } })
    .where(eq(s.citations.id, citationId));
}

async function updateSourceMetadata(courseId: string, patch: Record<string, unknown>) {
  const db = getDb();
  const rows = await db
    .select({ id: s.sources.id, metadata: s.sources.metadata })
    .from(s.sources)
    .where(eq(s.sources.courseId, courseId));
  if (rows.length === 0) throw new Error(`No source row for course ${courseId}.`);
  for (const row of rows) {
    const current = (row.metadata ?? {}) as Record<string, unknown>;
    await db
      .update(s.sources)
      .set({ metadata: { ...current, ...patch } })
      .where(eq(s.sources.id, row.id));
  }
}

/** Map each Fundamentals section to the chapter it belongs to. */
function fundamentalsChapterMap(text: string) {
  const sections = parseSections({ kind: "epub", text });
  const headings = [...text.matchAll(/^# Chapter (\d+)\./gm)]
    .map((match) => ({ chapter: Number(match[1]), offset: match.index ?? 0 }))
    .sort((a, b) => a.offset - b.offset);

  const chapters = new Map<number, number>();
  for (const heading of headings) {
    if (!chapters.has(heading.chapter)) chapters.set(heading.chapter, heading.offset);
  }

  const sectionChapter: number[] = [];
  for (const section of sections) {
    let offset = text.indexOf(section.text.slice(0, 100));
    if (offset < 0) offset = text.indexOf(section.text.slice(0, 40));
    if (offset < 0) throw new Error(`Could not locate section "${section.title}" in Fundamentals text.`);

    let chapter = 1;
    for (const [number, start] of chapters) {
      if (start <= offset) chapter = number;
    }
    sectionChapter.push(chapter);
  }

  const body = sections
    .map((section, index) => ({ index, section }))
    .filter(({ section }) => !/Index|Colophon/i.test(section.title))
    .map(({ index }) => index);

  const chapterSections = new Map<number, number[]>();
  for (const index of body) {
    const chapter = sectionChapter[index];
    const list = chapterSections.get(chapter) ?? [];
    list.push(index);
    chapterSections.set(chapter, list);
  }

  return { sections, body, chapterSections };
}

async function fixFundamentals() {
  console.log("\nFundamentals of Software Architecture");
  const course = await courseByTitle("Fundamentals of Software Architecture");
  const text = readCache("fundamentals");
  const { sections, body, chapterSections } = fundamentalsChapterMap(text);

  const lessonChapters = new Map<string, number[]>();
  for (const courseModule of fundamentalsCourse.modules) {
    for (const lesson of courseModule.lessons) {
      lessonChapters.set(
        lesson.title,
        (lesson.chapters ?? []).map((chapter) => Number(chapter.match(/\d+/)?.[0] ?? 0)).filter(Boolean),
      );
    }
  }

  const rows = await citationsFor(course.id);
  let updated = 0;
  for (const row of rows) {
    const fromTitle = lessonChapters.get(row.lessonTitle) ?? [];
    const fromLabel = [...row.label.matchAll(/Chapter\s+(\d+)/g)].map((m) => Number(m[1]));
    const chapters = uniqueSorted([...fromTitle, ...fromLabel]);
    const indexes = uniqueSorted(chapters.flatMap((chapter) => chapterSections.get(chapter) ?? []));
    if (indexes.length === 0) {
      console.warn(`  ! no sections resolved for "${row.lessonTitle}"`);
      continue;
    }
    await updateLocator(row.citationId, row.locator, indexes);
    updated += 1;
  }

  // Re-read is not needed: report the union we just wrote.
  const coveredNow = uniqueSorted((await citationsFor(course.id)).flatMap((row) => {
    const locator = (row.locator ?? {}) as { sectionIndexes?: number[] };
    return locator.sectionIndexes ?? [];
  }));

  await updateSourceMetadata(course.id, {
    sectionCount: body.length,
    coveredSections: body.filter((index) => coveredNow.includes(index)).length,
    coveredIndexes: body.filter((index) => coveredNow.includes(index)),
    chapterCount: 27,
    coveredChapters: [...chapterSections.keys()].filter((chapter) => chapter >= 1 && chapter <= 27).length,
    excludedIndexes: sections.map((_, index) => index).filter((index) => !body.includes(index)),
    coverageBasis:
      "All 27 chapters and every body section are cited. Index and colophon are excluded as back matter.",
  });

  const missingChapters = Array.from({ length: 27 }, (_, i) => i + 1).filter(
    (chapter) => !chapterSections.has(chapter),
  );
  console.log(`  citations updated: ${updated}/${rows.length}`);
  console.log(`  chapters: ${27 - missingChapters.length}/27${missingChapters.length ? ` (missing ${missingChapters.join(", ")})` : ""}`);
  console.log(`  body sections: ${body.filter((index) => coveredNow.includes(index)).length}/${body.length}`);
}

/** Map each Structured Computer Organization content section to its chapter. */
function computerOrganizationChapterMap(text: string) {
  const sections = parseSections({ kind: "pdf", text });
  const sectionChapter: number[] = [];
  let current = 1;

  for (let index = 0; index < sections.length; index++) {
    const head = sections[index].text.slice(0, 2500);
    const match = head.match(/CHAP\.\s*(\d+)/) ?? head.match(/SEC\.\s*(\d+)\./);
    if (match) current = Number(match[1]);
    sectionChapter.push(current);
  }

  // The PDF parser yields six front-matter chunks, 34 chapter chunks, four
  // appendix chunks, and one index chunk. Only the chapter chunks are taught.
  const body = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => (section.pageStart ?? 0) >= 24 && (section.pageStart ?? 0) < 695)
    .map(({ index }) => index);

  const chapterSections = new Map<number, number[]>();
  for (const index of body) {
    const chapter = sectionChapter[index];
    const list = chapterSections.get(chapter) ?? [];
    list.push(index);
    chapterSections.set(chapter, list);
  }

  return { sections, body, chapterSections };
}

async function fixComputerOrganization() {
  console.log("\nStructured Computer Organization");
  const course = await courseByTitle("Structured Computer Organization");
  const text = readCache("computer-organization");
  const { sections, body, chapterSections } = computerOrganizationChapterMap(text);

  const rows = await citationsFor(course.id);
  const byChapter = new Map<number, CitationRow[]>();
  for (const row of rows) {
    const chapter = Number(row.label.match(/Ch\.\s*(\d+)/)?.[1] ?? 0);
    if (!chapter) {
      console.warn(`  ! no chapter in label for "${row.lessonTitle}"`);
      continue;
    }
    const list = byChapter.get(chapter) ?? [];
    list.push(row);
    byChapter.set(chapter, list);
  }

  let updated = 0;
  for (const [chapter, chapterRows] of byChapter) {
    const indexes = chapterSections.get(chapter) ?? [];
    const slices = splitEvenly(indexes, chapterRows.length);
    for (let i = 0; i < chapterRows.length; i++) {
      if (slices[i].length === 0) continue;
      await updateLocator(chapterRows[i].citationId, chapterRows[i].locator, slices[i]);
      updated += 1;
    }
  }

  const coveredNow = uniqueSorted((await citationsFor(course.id)).flatMap((row) => {
    const locator = (row.locator ?? {}) as { sectionIndexes?: number[] };
    return locator.sectionIndexes ?? [];
  }));

  await updateSourceMetadata(course.id, {
    sectionCount: body.length,
    coveredSections: body.filter((index) => coveredNow.includes(index)).length,
    coveredIndexes: body.filter((index) => coveredNow.includes(index)),
    chapterCount: 8,
    coveredChapters: [...chapterSections.keys()].filter((chapter) => chapter >= 1 && chapter <= 8).length,
    excludedIndexes: sections.map((_, index) => index).filter((index) => !body.includes(index)),
    coverageBasis:
      "All 8 chapters and every chapter body section are cited. Front matter, appendices, and index are excluded.",
  });

  const missingChapters = Array.from({ length: 8 }, (_, i) => i + 1).filter(
    (chapter) => !chapterSections.has(chapter),
  );
  console.log(`  citations updated: ${updated}/${rows.length}`);
  console.log(`  chapters: ${8 - missingChapters.length}/8${missingChapters.length ? ` (missing ${missingChapters.join(", ")})` : ""}`);
  console.log(`  body sections: ${body.filter((index) => coveredNow.includes(index)).length}/${body.length}`);
}

type SourceBook = {
  title: string;
  cacheName: string;
  kind: "epub" | "pdf";
  body: (sections: { title: string }[]) => number[];
  chapterStarts?: number[];
  chapterCount?: number;
  coverageBasis: string;
};

const SOURCE_BOOKS: SourceBook[] = [
  {
    title: "Code: The Hidden Language of Computer Hardware and Software",
    cacheName: "code-hidden-language",
    kind: "epub",
    // 0-3 are opening/contents/preface/diversity statement; 32 is the index.
    body: () => Array.from({ length: 28 }, (_, index) => index + 4),
    chapterStarts: Array.from({ length: 28 }, (_, index) => index + 4),
    chapterCount: 28,
    coverageBasis:
      "All 28 chapters are cited. Front matter and the index are excluded as non-teaching material.",
  },
  {
    title: "Designing Data-Intensive Applications",
    cacheName: "ddia",
    kind: "epub",
    // 0-1 preface/outline; 50-51 glossary and index.
    body: () => Array.from({ length: 48 }, (_, index) => index + 2),
    chapterStarts: [2, 5, 9, 13, 16, 22, 25, 29, 34, 38, 42, 46],
    chapterCount: 12,
    coverageBasis:
      "All 12 chapters and every body section are cited. Preface, glossary, and index are excluded.",
  },
  {
    title: "Hacker Disassembling Uncovered",
    cacheName: "hacker-disassembling",
    kind: "epub",
    // 0-2 opening/title/preface; 44-45 are the answer appendix and back-matter pitch.
    body: () => Array.from({ length: 41 }, (_, index) => index + 3),
    coverageBasis:
      "Every body section from Protection Classifications through the final protection discussion is cited. Front matter and back matter are excluded.",
  },
  {
    title: "From Day Zero to Zero Day",
    cacheName: "zero-day",
    kind: "pdf",
    // 0 is the opening pages; 1 is the introduction; 2-15 are Chapters 0-10.
    body: () => Array.from({ length: 15 }, (_, index) => index + 1),
    chapterStarts: [2, 3, 4, 6, 8, 10, 11, 12, 13, 14, 15],
    chapterCount: 11,
    coverageBasis:
      "The introduction and all 11 chapters (0-10) are cited. Only the opening pages are excluded.",
  },
];

function countCoveredChapters(
  chapterStarts: number[] | undefined,
  body: number[],
  covered: Set<number>,
) {
  if (!chapterStarts?.length) return null;
  return chapterStarts.filter((start, index) => {
    const end = chapterStarts[index + 1] ?? Number.POSITIVE_INFINITY;
    return body.some((section) => section >= start && section < end && covered.has(section));
  }).length;
}

async function fixSourceBook(book: SourceBook) {
  console.log(`\n${book.title}`);
  const course = await courseByTitle(book.title);
  const sections = parseSections({ kind: book.kind, text: readCache(book.cacheName) });
  const body = book.body(sections);
  const bodySet = new Set(body);
  const rows = await citationsFor(course.id);

  let updated = 0;
  for (const row of rows) {
    const locator = (row.locator ?? {}) as { sectionIndexes?: number[] };
    const current = locator.sectionIndexes ?? [];
    const kept = uniqueSorted(current.filter((index) => bodySet.has(index)));
    if (kept.length !== current.length) {
      await updateLocator(row.citationId, row.locator, kept);
      updated += 1;
    }
  }

  const covered = new Set(
    (await citationsFor(course.id)).flatMap((row) => {
      const locator = (row.locator ?? {}) as { sectionIndexes?: number[] };
      return locator.sectionIndexes ?? [];
    }),
  );
  const coveredBody = body.filter((index) => covered.has(index));
  const coveredChapters = countCoveredChapters(book.chapterStarts, body, covered);

  await updateSourceMetadata(course.id, {
    sectionCount: body.length,
    coveredSections: coveredBody.length,
    coveredIndexes: coveredBody,
    ...(book.chapterCount ? { chapterCount: book.chapterCount } : {}),
    ...(coveredChapters !== null ? { coveredChapters } : {}),
    excludedIndexes: sections.map((_, index) => index).filter((index) => !bodySet.has(index)),
    coverageBasis: book.coverageBasis,
  });

  console.log(`  citations updated: ${updated}/${rows.length}`);
  if (book.chapterCount) console.log(`  chapters: ${coveredChapters}/${book.chapterCount}`);
  console.log(`  body sections: ${coveredBody.length}/${body.length}`);
}

async function main() {
  await fixFundamentals();
  await fixComputerOrganization();
  for (const book of SOURCE_BOOKS) await fixSourceBook(book);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
