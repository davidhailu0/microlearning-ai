import "dotenv/config";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { getCachedSourceSections } from "@/lib/source-reading";

/**
 * Copies the parsed book sections from `.cache/books` into Postgres so the
 * source reader survives deployment or a fresh checkout without the cache.
 *
 * Usage: npx tsx src/scripts/sync-source-sections.ts
 */

async function main() {
  const db = getDb();
  const courses = await db
    .select({ id: s.courses.id, title: s.courses.title })
    .from(s.courses)
    .orderBy(asc(s.courses.title));

  let stored = 0;
  for (const course of courses) {
    const sections = await getCachedSourceSections(course.title);
    if (sections.length === 0) continue;

    await db.transaction(async (tx) => {
      await tx.delete(s.sourceSections).where(eq(s.sourceSections.courseId, course.id));
      for (let start = 0; start < sections.length; start += 40) {
        const chunk = sections.slice(start, start + 40);
        await tx.insert(s.sourceSections).values(
          chunk.map((section) => ({
            courseId: course.id,
            sectionIndex: section.index,
            title: section.title,
            text: section.text,
            wordCount: section.wordCount,
            pageStart: section.pageStart,
            pageEnd: section.pageEnd,
          })),
        );
      }
    });

    stored += sections.length;
    console.log(`  ✓ ${course.title}: ${sections.length} sections`);
  }

  console.log(`Stored ${stored} source sections.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
