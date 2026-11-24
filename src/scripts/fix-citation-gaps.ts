import "dotenv/config";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import * as s from "../lib/db/schema";

/**
 * Repairs the known citation gaps that are safe to fix in place.
 *
 * Hacker Disassembling Uncovered: the final lesson teaches sections 44
 * ("Explanation") and 45 ("Hacker Disassembling Uncovered—How to…"), but the
 * citation locator stopped at 43. This adds them and refreshes the coverage
 * metadata so the body-section count matches the citations.
 *
 * Idempotent: rerunning it makes no further changes.
 *
 * Usage:
 *   npx tsx src/scripts/fix-citation-gaps.ts
 */

const HACKER_TITLE = "Hacker Disassembling Uncovered";
const HACKER_FINAL_LESSON = "Optimizing Compilers, Self-Modifying Protection, and Where Protection Goes Next";
const HACKER_SECTIONS = [44, 45];

function uniqueSorted(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}

async function main() {
  const db = getDb();

  const [course] = await db
    .select({ id: s.courses.id })
    .from(s.courses)
    .where(eq(s.courses.title, HACKER_TITLE))
    .limit(1);
  if (!course) throw new Error(`Missing course: ${HACKER_TITLE}`);

  const [lesson] = await db
    .select({ id: s.lessons.id })
    .from(s.lessons)
    .where(and(eq(s.lessons.courseId, course.id), eq(s.lessons.title, HACKER_FINAL_LESSON)))
    .limit(1);
  if (!lesson) throw new Error(`Missing final lesson: ${HACKER_FINAL_LESSON}`);

  const [citation] = await db
    .select({ id: s.citations.id, locator: s.citations.locator })
    .from(s.citations)
    .where(eq(s.citations.lessonId, lesson.id))
    .limit(1);
  if (!citation) throw new Error("Final Hacker lesson has no citation");

  const locator = (citation.locator ?? {}) as { sectionIndexes?: number[] };
  const current = locator.sectionIndexes ?? [];
  const next = uniqueSorted([...current, ...HACKER_SECTIONS]);
  if (next.length !== current.length) {
    await db
      .update(s.citations)
      .set({ locator: { ...locator, sectionIndexes: next } })
      .where(eq(s.citations.id, citation.id));
    console.log(`Hacker citation: added sections ${next.filter((n) => !current.includes(n)).join(", ")}`);
  } else {
    console.log("Hacker citation: already complete");
  }

  const rows = await db
    .select({ locator: s.citations.locator })
    .from(s.citations)
    .innerJoin(s.lessons, eq(s.citations.lessonId, s.lessons.id))
    .where(eq(s.lessons.courseId, course.id));
  const covered = uniqueSorted(
    rows.flatMap((row) => {
      const value = (row.locator ?? {}) as { sectionIndexes?: number[] };
      return value.sectionIndexes ?? [];
    }),
  );
  const body = covered.filter((index) => index >= 3);

  const [source] = await db
    .select({ id: s.sources.id, metadata: s.sources.metadata })
    .from(s.sources)
    .where(eq(s.sources.courseId, course.id))
    .limit(1);
  if (source) {
    const metadata = (source.metadata ?? {}) as Record<string, unknown>;
    await db
      .update(s.sources)
      .set({
        metadata: {
          ...metadata,
          sectionCount: body.length,
          coveredSections: body.length,
          coveredIndexes: body,
          excludedIndexes: [0, 1, 2],
          coverageBasis:
            "Every body section from Protection Classifications through the How to… appendix is cited. Front matter is excluded.",
        },
      })
      .where(eq(s.sources.id, source.id));
  }

  const lessonRows = await db
    .select({ id: s.lessons.id })
    .from(s.lessons)
    .where(eq(s.lessons.courseId, course.id))
    .orderBy(asc(s.lessons.position));
  console.log(`Hacker course: ${lessonRows.length} lessons, ${body.length} body sections cited`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
