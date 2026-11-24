import fs from "node:fs/promises";
import path from "node:path";
import { and, eq, inArray } from "drizzle-orm";
import { dbEnabled, getDb } from "./db";
import * as s from "./db/schema";
import { parseSections, type SourceSection } from "./ingest";

/**
 * The six source books are kept as parsed text in `.cache/books`. The cache is
 * a local reading companion, not a database table: the lesson already stores
 * the section indexes, so the reader can resolve the exact passages on demand.
 */
const BOOKS: Record<string, { file: string; kind: "epub" | "pdf" }> = {
  "Fundamentals of Software Architecture": { file: "fundamentals", kind: "epub" },
  "Structured Computer Organization": { file: "computer-organization", kind: "pdf" },
  "Code: The Hidden Language of Computer Hardware and Software": {
    file: "code-hidden-language",
    kind: "epub",
  },
  "Designing Data-Intensive Applications": { file: "ddia", kind: "epub" },
  "Hacker Disassembling Uncovered": { file: "hacker-disassembling", kind: "epub" },
  "From Day Zero to Zero Day": { file: "zero-day", kind: "pdf" },
};

const sectionCache = new Map<string, Promise<SourceSection[]>>();

async function readCache(file: string) {
  const candidates = [
    path.join(process.cwd(), ".cache", "books", `${file}.txt`),
    path.join(process.cwd(), "app", ".cache", "books", `${file}.txt`),
  ];

  for (const candidate of candidates) {
    try {
      return await fs.readFile(/* turbopackIgnore: true */ candidate, "utf8");
    } catch {
      /* try the next project layout */
    }
  }
  return null;
}

function loadSections(courseTitle: string) {
  const book = BOOKS[courseTitle];
  if (!book) return null;

  let pending = sectionCache.get(book.file);
  if (!pending) {
    pending = readCache(book.file).then((text) =>
      text ? parseSections({ kind: book.kind, text }) : [],
    );
    sectionCache.set(book.file, pending);
  }
  return pending;
}

/** Used by the one-off cache-to-database sync script. */
export async function getCachedSourceSections(courseTitle: string) {
  return (await loadSections(courseTitle)) ?? [];
}

async function loadDbSections(courseTitle: string, indexes: number[]): Promise<ReadingPassage[]> {
  if (!dbEnabled() || indexes.length === 0) return [];

  const db = getDb();
  const [course] = await db
    .select({ id: s.courses.id })
    .from(s.courses)
    .where(eq(s.courses.title, courseTitle))
    .limit(1);
  if (!course) return [];

  const rows = await db
    .select()
    .from(s.sourceSections)
    .where(
      and(
        eq(s.sourceSections.courseId, course.id),
        inArray(s.sourceSections.sectionIndex, indexes),
      ),
    );

  return rows.map((row) => ({
    index: row.sectionIndex,
    title: row.title,
    text: row.text,
    wordCount: row.wordCount,
    pageStart: row.pageStart ?? undefined,
    pageEnd: row.pageEnd ?? undefined,
  }));
}

/**
 * PDF extracts wrap every visual line, and EPUB exports sometimes preserve
 * single newlines inside paragraphs. Rejoin those lines while keeping real
 * paragraph breaks and heading lines separate.
 */
export function reflowSourceText(text: string) {
  const normalized = text.replace(/\r/g, "").replace(/-\n(?=[a-z])/g, "");
  const paragraphs: string[] = [];

  for (const part of normalized.split(/\n{2,}/)) {
    const lines = part
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let buffer: string[] = [];

    const flush = () => {
      const paragraph = buffer.join(" ").replace(/\s+/g, " ").trim();
      if (paragraph) paragraphs.push(paragraph);
      buffer = [];
    };

    for (const line of lines) {
      if (/^#{1,3}\s+/.test(line)) {
        flush();
        paragraphs.push(line);
      } else {
        buffer.push(line);
      }
    }
    flush();
  }

  return paragraphs;
}

export type ReadingPassage = Pick<
  SourceSection,
  "index" | "title" | "text" | "wordCount" | "pageStart" | "pageEnd"
>;

export async function getSourceReading(
  courseTitle: string,
  sectionIndexes: number[],
): Promise<{ sections: ReadingPassage[] } | null> {
  const wanted = new Set(sectionIndexes);
  if (wanted.size === 0) return null;

  const cached = (await loadSections(courseTitle)) ?? [];
  const byIndex = new Map<number, ReadingPassage>();
  for (const section of cached) {
    if (!wanted.has(section.index)) continue;
    byIndex.set(section.index, {
      index: section.index,
      title: section.title,
      text: section.text,
      wordCount: section.wordCount,
      pageStart: section.pageStart,
      pageEnd: section.pageEnd,
    });
  }

  // The cache is a local convenience; deployed databases carry the same
  // sections so the reader keeps working on a fresh machine.
  const missing = [...wanted].filter((index) => !byIndex.has(index));
  if (missing.length > 0) {
    for (const section of await loadDbSections(courseTitle, missing)) {
      byIndex.set(section.index, section);
    }
  }

  const selected = [...byIndex.values()].sort((a, b) => a.index - b.index);
  return selected.length > 0 ? { sections: selected } : null;
}
