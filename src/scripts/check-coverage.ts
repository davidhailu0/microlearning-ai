import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { getDb } from "../lib/db";
import { courses, modules, lessons, citations, sources } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { parseSections } from "../lib/ingest";

/**
 * Writes `coverage.txt`: the database's current course inventory plus the
 * per-course body coverage computed from parsed source sections and citation
 * locators. Run against the database you want to audit:
 *
 *   DATABASE_URL=postgres://... npx tsx src/scripts/check-coverage.ts
 */

const CACHE = path.resolve(__dirname, "../../.cache/books");

const BOOK_CACHE: Record<string, string> = {
  "From Day Zero to Zero Day": "zero-day",
  "Fundamentals of Software Architecture": "fundamentals",
  "Structured Computer Organization": "computer-organization",
  "Code: The Hidden Language of Computer Hardware and Software": "code-hidden-language",
  "Hacker Disassembling Uncovered": "hacker-disassembling",
  "Designing Data-Intensive Applications": "ddia",
};

const SECTION_KEYS: { title: string; key: string; kind: "pdf" | "epub" }[] = Object.entries(
  BOOK_CACHE,
).map(([title, key]) => ({
  title,
  key,
  kind: title === "From Day Zero to Zero Day" || title === "Structured Computer Organization"
    ? "pdf"
    : "epub",
}));

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart <= bEnd && aEnd >= bStart;
}

async function main() {
  const db = getDb();
  const out: string[] = [];

  const allCourses = await db.select().from(courses).orderBy(courses.title);
  const allSources = await db.select().from(sources);

  out.push(`=== COURSE INVENTORY (${allCourses.length}) ===`);
  for (const course of allCourses) {
    const moduleRows = await db
      .select({ id: modules.id, title: modules.title })
      .from(modules)
      .where(eq(modules.courseId, course.id));
    const lessonRows = await db
      .select({ id: lessons.id, title: lessons.title })
      .from(lessons)
      .where(eq(lessons.courseId, course.id));
    const citationRows = await db
      .select({ id: citations.id, label: citations.label })
      .from(citations)
      .innerJoin(lessons, eq(citations.lessonId, lessons.id))
      .where(eq(lessons.courseId, course.id));
    const source = allSources.find((row) => row.courseId === course.id);
    out.push(
      `  [${course.id.slice(0, 8)}] ${course.title} | ${course.sourceKind} | ` +
        `${moduleRows.length} modules, ${lessonRows.length} lessons, ` +
        `${citationRows.length} citations | ${course.estimatedMinutes} min`,
    );
    if (source?.metadata) {
      const metadata = source.metadata as Record<string, unknown>;
      if (metadata.coverageBasis) out.push(`    coverage: ${String(metadata.coverageBasis)}`);
    }
  }

  out.push("");
  out.push("=== BOOK BODY COVERAGE (parsed sections vs citation indexes) ===");
  for (const spec of SECTION_KEYS) {
    const course = allCourses.find((row) => row.title === spec.title);
    if (!course) {
      out.push(`  ${spec.title}: NOT IN DB`);
      continue;
    }
    const file = path.join(CACHE, `${spec.key}.txt`);
    if (!fs.existsSync(file)) {
      out.push(`  ${spec.title}: no cached text (${file})`);
      continue;
    }
    const text = fs.readFileSync(file, "utf8");
    const sections = parseSections({ kind: spec.kind, text });
    const source = allSources.find((row) => row.courseId === course.id);
    const metadata = (source?.metadata ?? {}) as Record<string, unknown>;
    const excluded = new Set<number>(
      Array.isArray(metadata.excludedIndexes) ? (metadata.excludedIndexes as number[]) : [],
    );
    if (excluded.size === 0) {
      // Fallback for sources without verified metadata: title-based exclusions.
      for (let index = 0; index < sections.length; index += 1) {
        if (/(^|– )Index( \(|$)|Colophon/i.test(sections[index].title)) {
          excluded.add(index);
        }
      }
    }
    const body = sections.map((_, index) => index).filter((index) => !excluded.has(index));

    const rows = await db
      .select({ locator: citations.locator })
      .from(citations)
      .innerJoin(lessons, eq(citations.lessonId, lessons.id))
      .where(eq(lessons.courseId, course.id));
    const cited = new Set<number>();
    for (const row of rows) {
      const locator = (row.locator ?? {}) as { sectionIndexes?: number[] };
      for (const index of locator.sectionIndexes ?? []) cited.add(index);
    }
    const missingBody = body.filter((index) => !cited.has(index));
    out.push(
      `  ${spec.title}: ${body.length - missingBody.length}/${body.length} body sections cited; ` +
        `${sections.length} parsed, ${excluded.size} excluded`,
    );
    if (missingBody.length) {
      out.push(
        `    missing body sections: ${missingBody
          .map((index) => `[${index}] ${sections[index].title}`)
          .join(" | ")}`,
      );
    }

    if (spec.kind === "pdf") {
      const ranges: [number, number][] = [];
      for (const row of rows) {
        const locator = (row.locator ?? {}) as { pageStart?: number | null; pageEnd?: number | null };
        if (typeof locator.pageStart === "number") {
          ranges.push([locator.pageStart, locator.pageEnd ?? locator.pageStart]);
        }
      }
      const pageSections = sections.filter(
        (section) => typeof section.pageStart === "number" && !excluded.has(sections.indexOf(section)),
      );
      const gaps = pageSections.filter(
        (section) => !ranges.some(([a, b]) => overlap(a, b, section.pageStart!, section.pageEnd ?? section.pageStart!)),
      );
      const min = Math.min(...ranges.map(([start]) => start));
      const max = Math.max(...ranges.map(([, end]) => end));
      out.push(
        `    page ranges: ${ranges.length} citations spanning pp. ${min}-${max}; ` +
          `${gaps.length} body page section(s) uncovered`,
      );
      if (gaps.length) {
        out.push(`    page gaps: ${gaps.map((section) => `${section.pageStart}-${section.pageEnd}`).join(", ")}`);
      }
    }
  }

  out.push("");
  out.push("=== TEXT COURSES: citation presence ===");
  const textCourses = allCourses.filter((course) => course.sourceKind === "text");
  for (const course of textCourses) {
    const lessonRows = await db
      .select({ id: lessons.id, title: lessons.title })
      .from(lessons)
      .where(eq(lessons.courseId, course.id));
    const rows = await db
      .select({ label: citations.label, locator: citations.locator })
      .from(citations)
      .innerJoin(lessons, eq(citations.lessonId, lessons.id))
      .where(eq(lessons.courseId, course.id));
    const labelled = rows.filter((row) => row.label.trim()).length;
    const withSections = rows.filter((row) => {
      const locator = (row.locator ?? {}) as { sectionIndexes?: number[] };
      return (locator.sectionIndexes ?? []).length > 0;
    }).length;
    out.push(
      `  ${course.title}: ${labelled}/${lessonRows.length} lessons labelled; ` +
        `${withSections} have parsed section indexes (text sources use step citations)`,
    );
  }

  out.push("");
  out.push("=== SOURCES TABLE ===");
  for (const source of allSources) {
    out.push(
      `  [${source.kind}] ${source.title} by ${source.author ?? "?"} | ` +
        `words=${source.wordCount} chars=${source.charCount}`,
    );
  }

  const totalLessons = allCourses.reduce((sum, course) => sum + course.lessonCount, 0);
  out.push("");
  out.push("=== TOTALS ===");
  out.push(`  courses: ${allCourses.length}; lessons (denormalized): ${totalLessons}`);
  out.push(`  citations: ${(await db.select({ id: citations.id }).from(citations)).length}`);

  fs.writeFileSync(path.resolve(__dirname, "../../coverage.txt"), out.join("\n"));
  console.log(out.join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
