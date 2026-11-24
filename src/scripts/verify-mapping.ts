import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { asc, eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import * as s from "../lib/db/schema";
import { parseSections } from "../lib/ingest";

/**
 * Verifies that each book course still maps to its source book in the
 * database: every lesson has a citation, every teaching (non-excluded) section
 * is cited, and PDF page ranges overlap every teaching page section.
 *
 * Excluded indexes come from the verified `sources.metadata.excludedIndexes`
 * written by `export-curated-courses.ts` and `persist-book-courses.ts`.
 *
 * Usage:
 *   DATABASE_URL=postgres://... npx tsx src/scripts/verify-mapping.ts
 */

type BookSpec = {
  title: string;
  cache: string;
  kind: "pdf" | "epub";
};

const BOOKS: BookSpec[] = [
  { title: "From Day Zero to Zero Day", cache: "zero-day", kind: "pdf" },
  { title: "Fundamentals of Software Architecture", cache: "fundamentals", kind: "epub" },
  { title: "Structured Computer Organization", cache: "computer-organization", kind: "pdf" },
  {
    title: "Code: The Hidden Language of Computer Hardware and Software",
    cache: "code-hidden-language",
    kind: "epub",
  },
  { title: "Hacker Disassembling Uncovered", cache: "hacker-disassembling", kind: "epub" },
  { title: "Designing Data-Intensive Applications", cache: "ddia", kind: "epub" },
];

const CACHE = path.resolve(__dirname, "../../.cache/books");

async function main() {
  const db = getDb();
  let failures = 0;

  for (const spec of BOOKS) {
    const [course] = await db
      .select({ id: s.courses.id })
      .from(s.courses)
      .where(eq(s.courses.title, spec.title))
      .limit(1);
    console.log(`\n=== ${spec.title}`);
    if (!course) {
      console.log("  NO COURSE ROW FOUND");
      failures += 1;
      continue;
    }

    const rows = await db
      .select({
        module: s.modules.title,
        lesson: s.lessons.title,
        position: s.lessons.position,
        label: s.citations.label,
        locator: s.citations.locator,
      })
      .from(s.modules)
      .innerJoin(s.lessons, eq(s.lessons.moduleId, s.modules.id))
      .leftJoin(s.citations, eq(s.citations.lessonId, s.lessons.id))
      .where(eq(s.modules.courseId, course.id))
      .orderBy(asc(s.modules.position), asc(s.lessons.position));

    const [source] = await db
      .select({ metadata: s.sources.metadata })
      .from(s.sources)
      .where(eq(s.sources.courseId, course.id))
      .limit(1);
    const metadata = (source?.metadata ?? {}) as Record<string, unknown>;
    const excluded = new Set<number>(
      Array.isArray(metadata.excludedIndexes) ? (metadata.excludedIndexes as number[]) : [],
    );

    let missingCitation = 0;
    let lastModule = "";
    const cited = new Set<number>();
    const pageRanges: [number, number][] = [];

    for (const row of rows) {
      if (row.module !== lastModule) {
        console.log(`  -- ${row.module}`);
        lastModule = row.module;
      }
      if (!row.label) {
        missingCitation += 1;
        console.log(`     ${row.position}. ${row.lesson}  [NO CITATION]`);
        continue;
      }
      const locator = (row.locator ?? {}) as {
        pageStart?: number | null;
        pageEnd?: number | null;
        sectionIndexes?: number[];
      };
      const indexes = locator.sectionIndexes ?? [];
      for (const index of indexes) cited.add(index);
      if (typeof locator.pageStart === "number") {
        pageRanges.push([locator.pageStart, locator.pageEnd ?? locator.pageStart]);
      }
      const where = indexes.length
        ? `sections ${indexes.join(",")}`
        : typeof locator.pageStart === "number"
          ? `pp. ${locator.pageStart}-${locator.pageEnd}`
          : "locator has no range (text course)";
      console.log(`     ${row.position}. ${row.lesson}  -> ${where}`);
    }

    const file = path.join(CACHE, `${spec.cache}.txt`);
    if (!fs.existsSync(file)) {
      console.log(`  no cached text at ${file}`);
      failures += 1;
      continue;
    }
    const sections = parseSections({ kind: spec.kind, text: fs.readFileSync(file, "utf8") });
    const body = sections.map((_, index) => index).filter((index) => !excluded.has(index));
    const missing = body.filter((index) => !cited.has(index));

    console.log(
      `  lessons: ${rows.length}, citations missing: ${missingCitation}, ` +
        `body sections cited: ${body.length - missing.length}/${body.length}`,
    );
    if (missingCitation) failures += 1;
    if (missing.length) {
      failures += 1;
      console.log(
        `  GAPS: ${missing.map((index) => `[${index}] ${sections[index].title}`).join(" | ")}`,
      );
    }

    if (spec.kind === "pdf") {
      const gaps = sections
        .map((section, index) => ({ section, index }))
        .filter(({ index }) => !excluded.has(index))
        .filter(({ section }) => {
          const start = section.pageStart;
          if (typeof start !== "number") return false;
          const end = section.pageEnd ?? start;
          return !pageRanges.some(([a, b]) => start <= b && end >= a);
        });
      console.log(
        `  page ranges: ${pageRanges.length}; teaching page sections uncovered: ${gaps.length}`,
      );
      if (gaps.length) {
        failures += 1;
        console.log(
          `  PAGE GAPS: ${gaps
            .map(({ section }) => `pp.${section.pageStart}-${section.pageEnd}`)
            .join(", ")}`,
        );
      }
    }
  }

  console.log(failures === 0 ? "\nOK: all book courses map completely." : `\nFAILED: ${failures} check(s).`);
  if (failures > 0) process.exit(1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
