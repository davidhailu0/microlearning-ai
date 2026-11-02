import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { CURATED, curatedDraft, heroDraft } from "@/lib/demo";
import { completeLesson, persistCourseDraft } from "@/lib/repo";
import { demoUserId } from "@/lib/env";

const COLORS = ["amber", "emerald", "sky", "violet", "rose", "cyan"];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required. Run in demo mode (no seed) or set it.");
    process.exit(1);
  }

  const db = getDb();
  console.log("Seeding Lumen…");

  await db
    .insert(s.users)
    .values({
      id: demoUserId,
      name: "Alex Rivera",
      email: "alex@example.com",
      xp: 2480,
      timezone: "UTC",
    })
    .onConflictDoNothing();

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  await db
    .insert(s.streaks)
    .values({
      userId: demoUserId,
      current: 7,
      longest: 21,
      lastActiveDate: yesterday,
    })
    .onConflictDoNothing();

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.courses)
    .where(eq(s.courses.isCurated, true));

  if (count > 0) {
    console.log(`Curated library already seeded (${count} courses). Nothing to do.`);
    return;
  }

  const hero = await persistCourseDraft({
    draft: heroDraft(),
    userId: demoUserId,
    sourceKind: "curated",
    sourceTitle: "Thinking in Systems",
    sourceAuthor: "Lumen Library",
    isCurated: true,
    coverColor: "amber",
  });
  console.log(`  ✓ Thinking in Systems (${hero.lessonIds.length} lessons)`);

  for (const [index, entry] of CURATED.entries()) {
    const draft = curatedDraft(entry);

    const result = await persistCourseDraft({
      draft,
      userId: demoUserId,
      sourceKind: "curated",
      sourceTitle: entry.title,
      isCurated: true,
      coverColor: COLORS[(index + 1) % COLORS.length],
    });
    console.log(`  ✓ ${entry.title} (${result.lessonIds.length} lessons)`);
  }

  // A little history so the dashboard and review queue are not empty on day one.
  for (const lessonId of hero.lessonIds.slice(0, 2)) {
    await completeLesson(demoUserId, lessonId);
  }
  console.log("  ✓ seeded two completed lessons and their review cards");

  console.log("Done. Start the app with `npm run dev`.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
