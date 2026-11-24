import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import * as s from "../lib/db/schema";

/**
 * Fills the last three bullet-point gaps that the text-distillation pass could
 * not fill from existing paragraphs. Idempotent: an addition already present
 * in the lesson's bullets block is skipped.
 *
 * Usage: npx tsx src/scripts/fix-practice-gaps.ts
 */

const ADDITIONS = [
  {
    courseTitle: "Build Your Own Operating System",
    lessonTitle: "Bootloader Basics: Real Mode to Protected Mode",
    bullet:
      "The boot sector is only 512 bytes, so it must load the rest of the kernel from disk using BIOS services before jumping to it.",
  },
  {
    courseTitle: "Build Your Own Operating System",
    lessonTitle: "Writing a Minimal Bootloader",
    bullet:
      "The sector must end with the 0xAA55 signature, or the BIOS will refuse to treat it as bootable.",
  },
  {
    courseTitle: "Fundamentals of Software Architecture",
    lessonTitle: "What Architects Are Expected to Do",
    bullet:
      "Architects translate business goals into technical direction and explain trade-offs in language both engineers and executives can act on.",
  },
];

async function main() {
  const db = getDb();

  for (const addition of ADDITIONS) {
    const [lesson] = await db
      .select({ id: s.lessons.id })
      .from(s.lessons)
      .innerJoin(s.courses, eq(s.courses.id, s.lessons.courseId))
      .where(
        and(
          eq(s.courses.title, addition.courseTitle),
          eq(s.lessons.title, addition.lessonTitle),
        ),
      )
      .limit(1);
    if (!lesson) {
      console.log(`! missing lesson: ${addition.courseTitle} / ${addition.lessonTitle}`);
      continue;
    }

    const [block] = await db
      .select({ id: s.contentBlocks.id, payload: s.contentBlocks.payload })
      .from(s.contentBlocks)
      .where(and(eq(s.contentBlocks.lessonId, lesson.id), eq(s.contentBlocks.type, "bullets")))
      .limit(1);
    if (!block) {
      console.log(`! no bullets block: ${addition.lessonTitle}`);
      continue;
    }

    const payload = block.payload as { type?: string; items?: string[] };
    const items = payload.items ?? [];
    if (items.includes(addition.bullet)) {
      console.log(`= ${addition.lessonTitle}: bullet already present`);
      continue;
    }

    await db
      .update(s.contentBlocks)
      .set({ payload: { ...payload, type: "bullets", items: [...items, addition.bullet] } })
      .where(eq(s.contentBlocks.id, block.id));
    console.log(`+ ${addition.lessonTitle}: ${items.length} -> ${items.length + 1} bullets`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
