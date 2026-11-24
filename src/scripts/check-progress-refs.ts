import "dotenv/config";
import { getDb } from "../lib/db";
import { courses, modules, lessons, lessonProgress, courseProgress, cardStates, quizzes, questions } from "../lib/db/schema";
import { count, eq, sql } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const db = getDb();
  const out: string[] = [];

  // Which courses have progress attached?
  out.push("=== COURSE_PROGRESS (which course is the user on?) ===");
  const cp = await db.select().from(courseProgress);
  for (const r of cp) {
    const c = await db.select().from(courses).where(eq(courses.id, r.courseId));
    out.push(`  course=${c[0]?.title ?? r.courseId} [${String(r.courseId).slice(0,8)}] lessonsDone=${r.completedLessons}/${r.totalLessons} pct=${r.percent}`);
  }

  out.push("");
  out.push("=== LESSON_PROGRESS (which lessons completed?) ===");
  const lp = await db.select().from(lessonProgress);
  for (const r of lp) {
    const l = await db.select().from(lessons).where(eq(lessons.id, r.lessonId));
    const mod = l[0] ? await db.select().from(modules).where(eq(modules.id, l[0].moduleId)) : [];
    const c = mod[0] ? await db.select().from(courses).where(eq(courses.id, mod[0].courseId)) : [];
    out.push(`  "${l[0]?.title}" in "${c[0]?.title}" [${String(r.courseId).slice(0,8)}] status=${r.status} completed=${r.completedAt}`);
  }

  out.push("");
  out.push("=== CARD_STATES (FSRS) ===");
  const cs = await db.select().from(cardStates);
  for (const r of cs) {
    out.push(`  card=${String(r.flashcardId).slice(0,8)} state=${r.state} due=${r.due} reps=${r.reps}`);
  }

  // Duplicate course groups
  out.push("");
  out.push("=== DUPLICATE COURSE GROUPS (title + kind) ===");
  const all = await db.select().from(courses);
  const groups: Record<string, typeof all> = {};
  for (const c of all) {
    const key = `${c.sourceKind}::${c.sourceTitle}`;
    (groups[key] ??= []).push(c);
  }
  for (const [key, list] of Object.entries(groups)) {
    if (list.length > 1) {
      out.push(`  ${key}: ${list.length} copies`);
      for (const c of list) {
        const m = await db.select({ n: count(modules.id) }).from(modules).where(eq(modules.courseId, c.id));
        const l = await db.select({ n: count(lessons.id) }).from(lessons)
          .innerJoin(modules, eq(lessons.moduleId, modules.id))
          .where(eq(modules.courseId, c.id));
        out.push(`    [${String(c.id).slice(0,8)}] "${c.title}" modules=${m[0].n} lessons=${l[0].n} created=${c.createdAt}`);
      }
    } else {
      out.push(`  ${key}: 1 copy [${String(list[0].id).slice(0,8)}]`);
    }
  }

  // Metadata column check
  out.push("");
  out.push("=== COURSE METADATA COLUMN ===");
  const anyCourse = all.find(c => String(c.id).startsWith("6594a96a")) ?? all[0];
  out.push(`  keys: ${Object.keys(anyCourse).join(", ")}`);
  out.push(`  metadata value: ${JSON.stringify((anyCourse as unknown as Record<string, unknown>).metadata)}`);

  fs.writeFileSync(path.resolve(__dirname, "../../progress-refs.txt"), out.join("\n"));
  console.log("done");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
