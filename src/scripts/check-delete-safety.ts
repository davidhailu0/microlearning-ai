import "dotenv/config";
import { getDb } from "../lib/db";
import { xpEvents, dailyActivity, courses, modules, lessons, jobs, sources, streaks } from "../lib/db/schema";
import { count, eq, inArray, isNotNull } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const db = getDb();
  const out: string[] = [];

  const all = await db.select().from(courses);
  const bookCourses = all.filter(c => c.sourceKind !== "curated");

  // Keep one copy per (kind, source) group and flag extra duplicates for
  // deletion. Prefer the copy with the most lessons, then the newest one.
  const lessonCount = async (courseId: string) => {
    const rows = await db.select({ n: count(lessons.id) }).from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, courseId));
    return rows[0]?.n ?? 0;
  };
  const groups = new Map<string, typeof bookCourses>();
  for (const course of bookCourses) {
    const key = `${course.sourceKind}::${course.sourceTitle}`;
    groups.set(key, [...(groups.get(key) ?? []), course]);
  }
  const keepFull: string[] = [];
  const delIds: string[] = [];
  for (const group of groups.values()) {
    const scored = await Promise.all(
      group.map(async (course) => ({
        course,
        lessons: await lessonCount(course.id),
        created: new Date(course.createdAt).getTime(),
      })),
    );
    scored.sort((a, b) => b.lessons - a.lessons || b.created - a.created);
    keepFull.push(scored[0].course.id);
    delIds.push(...scored.slice(1).map((entry) => entry.course.id));
  }
  out.push(`book courses=${bookCourses.length} keep=${keepFull.length} delete=${delIds.length}`);

  // 1. xp_events referencing courses to delete
  const xp = await db.select().from(xpEvents).where(isNotNull(xpEvents.courseId));
  const xpBad = xp.filter(r => delIds.includes(r.courseId!));
  const xpKeep = xp.filter(r => keepFull.includes(r.courseId!));
  out.push(`xp_events with courseId: total=${xp.length} referencingKeep=${xpKeep.length} referencingDelete=${xpBad.length}`);

  // 2. jobs referencing delete set
  const jobRows = await db.select().from(jobs).where(isNotNull(jobs.courseId));
  const jobBad = jobRows.filter(r => delIds.includes(r.courseId!));
  out.push(`jobs with courseId: total=${jobRows.length} referencingDelete=${jobBad.length}`);

  // 3. lesson_progress / course_progress / cardStates on delete set
  const { lessonProgress, courseProgress, cardStates, flashcards, quizAttempts, quizzes } = await import("../lib/db/schema");
  const cp = await db.select().from(courseProgress);
  out.push(`course_progress rows=${cp.length} referencingDelete=${cp.filter(r => delIds.includes(r.courseId)).length}`);
  const lp = await db.select().from(lessonProgress);
  out.push(`lesson_progress rows=${lp.length} referencingDelete=${lp.filter(r => delIds.includes(r.courseId)).length}`);

  // 4. source file mtimes vs first-copy createdAt (which copy has latest content?)
  out.push("");
  out.push("=== source file mtimes ===");
  const dir = path.resolve(__dirname, "./book-courses");
  for (const f of fs.readdirSync(dir)) {
    const st = fs.statSync(path.join(dir, f));
    out.push(`  ${f}: ${st.mtime.toISOString()}`);
  }
  out.push("=== kept copies createdAt ===");
  for (const c of bookCourses) {
    if (keepFull.includes(c.id)) out.push(`  [${String(c.id).slice(0,8)}] ${c.title} created=${String(c.createdAt)}`);
  }

  // 5. verify kept ZD/FSA copies have full lesson counts
  out.push("");
  out.push("=== kept copy completeness ===");
  for (const id of keepFull) {
    const l = await db.select({ n: count(lessons.id) }).from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id)).where(eq(modules.courseId, id));
    const c = bookCourses.find(x => x.id === id)!;
    out.push(`  [${String(id).slice(0,8)}] ${c.title}: ${l[0].n} lessons`);
  }

  // 6. other users owning book courses?
  const owners = new Set(bookCourses.map(c => c.ownerId));
  out.push(`book course owners: ${[...owners].map(o => String(o)).join(", ")}`);

  fs.writeFileSync(path.resolve(__dirname, "../../delete-safety.txt"), out.join("\n"));
  console.log("done");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
