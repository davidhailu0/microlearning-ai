import "dotenv/config";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { buildDiagramBlock, buildExampleBlock } from "@/lib/lesson-aids";
import type { Block } from "@/lib/types";

/**
 * Adds a worked example and, where missing, a process diagram to every lesson.
 * Existing authored diagrams and examples are left untouched. Safe to rerun.
 *
 * Usage: npx tsx src/scripts/add-lesson-aids.ts
 */

type LessonStep = { title: string; detail: string };

type Entry =
  | { row: typeof s.contentBlocks.$inferSelect; block: Block }
  | { block: Block };

async function main() {
  const db = getDb();
  const lessons = await db
    .select({ id: s.lessons.id, title: s.lessons.title })
    .from(s.lessons)
    .orderBy(asc(s.lessons.courseId), asc(s.lessons.position));

  let addedExamples = 0;
  let addedDiagrams = 0;

  for (const lesson of lessons) {
    const rows = await db
      .select()
      .from(s.contentBlocks)
      .where(eq(s.contentBlocks.lessonId, lesson.id))
      .orderBy(asc(s.contentBlocks.position));

    const hasExample = rows.some((row) => row.type === "example");
    const hasDiagram = rows.some((row) => row.type === "diagram");
    if (hasExample && hasDiagram) continue;

    const stepsBlock = rows.find((row) => row.type === "steps");
    const steps =
      ((stepsBlock?.payload as { items?: LessonStep[] } | undefined)?.items ?? []) as LessonStep[];

    const example = hasExample ? null : buildExampleBlock(steps);
    const diagram = hasDiagram ? null : buildDiagramBlock(lesson.title, steps);
    if (!example && !diagram) continue;

    const entries: Entry[] = rows.map((row) => ({
      row,
      block: row.payload as unknown as Block,
    }));

    if (example) {
      const stepsIndex = entries.findIndex((entry) => entry.block.type === "steps");
      const insertAt = stepsIndex >= 0 ? stepsIndex : Math.max(0, entries.length - 1);
      entries.splice(insertAt, 0, { block: example });
    }

    if (diagram) {
      const takeawayIndex = entries.findIndex((entry) => entry.block.type === "takeaway");
      entries.splice(takeawayIndex >= 0 ? takeawayIndex : entries.length, 0, { block: diagram });
    }

    await db.transaction(async (tx) => {
      let position = 0;
      for (const entry of entries) {
        if ("row" in entry) {
          if (entry.row.position !== position) {
            await tx
              .update(s.contentBlocks)
              .set({ position })
              .where(eq(s.contentBlocks.id, entry.row.id));
          }
        } else {
          await tx.insert(s.contentBlocks).values({
            lessonId: lesson.id,
            position,
            type: entry.block.type,
            payload: entry.block as unknown as Record<string, unknown>,
          });
        }
        position += 1;
      }
    });

    if (example) addedExamples += 1;
    if (diagram) addedDiagrams += 1;
  }

  console.log(
    `Lesson aids: ${addedExamples} example(s), ${addedDiagrams} diagram(s) added across ${lessons.length} lessons.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
