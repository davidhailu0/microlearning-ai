import "dotenv/config";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { demoUserId } from "@/lib/env";

/**
 * Seeds the demo learner and streak only.
 *
 * The curated demo library was removed, so this script no longer creates
 * courses. Use the generation flow or the book-course persistence scripts to
 * add real courses.
 */
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

  console.log("Done. Start the app with `npm run dev`.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
