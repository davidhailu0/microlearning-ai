import "dotenv/config";
import { getDb } from "../lib/db";
import * as s from "../lib/db/schema";
import { sql } from "drizzle-orm";

const NEW_TITLES = [
  "Structured Computer Organization",
  "Code: The Hidden Language of Computer Hardware and Software",
  "Hacker Disassembling Uncovered",
];

async function main() {
  const db = getDb();

  const rows = await db
    .select({
      id: s.courses.id,
      title: s.courses.title,
      createdAt: s.courses.createdAt,
      lessons: sql<number>`(select count(*) from lessons where course_id = ${s.courses.id})::int`,
    })
    .from(s.courses)
    .orderBy(s.courses.title, s.courses.createdAt);

  const byTitle = new Map<string, typeof rows>();
  for (const r of rows) {
    const list = byTitle.get(r.title) ?? [];
    list.push(r);
    byTitle.set(r.title, list);
  }

  const toDelete: { id: string; title: string; reason: string }[] = [];

  for (const [title, list] of byTitle) {
    // Rebuild targets: drop every existing copy so the fresh persist is the only one.
    if (NEW_TITLES.includes(title)) {
      for (const r of list) toDelete.push({ id: r.id, title, reason: "rebuild" });
      continue;
    }
    if (list.length <= 1) continue;
    // Keep the copy with the most lessons, then the newest.
    const keep = [...list].sort(
      (a, b) => b.lessons - a.lessons || b.createdAt.getTime() - a.createdAt.getTime(),
    )[0];
    for (const r of list) {
      if (r.id !== keep.id) toDelete.push({ id: r.id, title, reason: "duplicate" });
    }
  }

  console.log(`Deleting ${toDelete.length} course rows…`);
  for (const d of toDelete) {
    await db.execute(sql`delete from xp_events where course_id = ${d.id}::uuid`);
    await db.execute(sql`delete from jobs where course_id = ${d.id}::uuid`);
    await db.delete(s.courses).where(sql`${s.courses.id} = ${d.id}::uuid`);
    console.log(`  - [${d.reason}] ${d.title} (${d.id})`);
  }

  const after = await db.select({ id: s.courses.id }).from(s.courses);
  console.log(`\nCourses remaining: ${after.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
