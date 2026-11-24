import "dotenv/config";
import { getDb } from "../lib/db";
import { courses, modules, lessons, citations } from "../lib/db/schema";
import { count, eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const db = getDb();
  const out: string[] = [];
  const CACHE = path.resolve(__dirname, "../../.cache/books");

  // 1. What chapters exist in the FSA book text?
  const fsaText = fs.readFileSync(path.join(CACHE, "fundamentals.txt"), "utf8");
  const chapterMarkers = [...fsaText.matchAll(/^# (Chapter \d+)\./gm)].map(m => m[1]);
  const uniqChapters = [...new Set(chapterMarkers)];
  out.push(`=== FSA BOOK: ${uniqChapters.length} unique chapter markers ===`);
  out.push(`  ${uniqChapters.join(", ")}`);

  // 2. What chapters do the lessons cite (labels + chapter hints)?
  const all = await db.select().from(courses);
  const fsaCopies = all.filter(c => c.sourceTitle === "Fundamentals of Software Architecture");
  let best: (typeof all)[number] | null = null;
  let bestN = -1;
  for (const c of fsaCopies) {
    const l = await db.select({ n: count(lessons.id) }).from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id)).where(eq(modules.courseId, c.id));
    if (l[0].n > bestN) { bestN = l[0].n; best = c; }
  }
  const rows = await db.select({ label: citations.label, loc: citations.locator }).from(citations)
    .innerJoin(lessons, eq(citations.lessonId, lessons.id))
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(modules.courseId, best!.id));

  // extract "Chapter N" mentions from labels
  const citedChapters = new Set<string>();
  for (const r of rows) {
    for (const m of (r.label ?? "").matchAll(/Chapter (\d+)/g)) citedChapters.add(`Chapter ${m[1]}`);
  }
  out.push("");
  out.push(`=== FSA LESSON CITATION LABELS: ${rows.length} rows, chapters mentioned: ${citedChapters.size} ===`);
  out.push(`  ${[...citedChapters].sort((a,b)=>parseInt(a.split(" ")[1])-parseInt(b.split(" ")[1])).join(", ")}`);

  const missingChapters = uniqChapters.filter(ch => !citedChapters.has(ch));
  out.push("");
  out.push(`=== FSA CHAPTERS NOT MENTIONED IN ANY CITATION LABEL: ${missingChapters.length} ===`);
  out.push(`  ${missingChapters.join(", ") || "NONE"}`);

  // 3. Same for Zero-Day
  const zdText = fs.readFileSync(path.join(CACHE, "zero-day.txt"), "utf8");
  const zdMarkers = [...zdText.matchAll(/^# (Chapter \d+):/gm)].map(m => m[1]);
  const zdUniq = [...new Set(zdMarkers)];
  out.push("");
  out.push(`=== ZERO-DAY BOOK: ${zdUniq.length} unique chapter markers ===`);
  out.push(`  ${zdUniq.join(", ")}`);
  const zdCopies = all.filter(c => c.sourceTitle === "From Day Zero to Zero Day" && c.sourceKind === "pdf");
  let zbest: (typeof all)[number] | null = null;
  let zbestN = -1;
  for (const c of zdCopies) {
    const l = await db.select({ n: count(lessons.id) }).from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id)).where(eq(modules.courseId, c.id));
    if (l[0].n > zbestN) { zbestN = l[0].n; zbest = c; }
  }
  const zrows = await db.select({ label: citations.label }).from(citations)
    .innerJoin(lessons, eq(citations.lessonId, lessons.id))
    .innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(modules.courseId, zbest!.id));
  const zdCited = new Set<string>();
  for (const r of zrows) {
    for (const m of (r.label ?? "").matchAll(/Chapter (\d+)/g)) zdCited.add(`Chapter ${m[1]}`);
  }
  out.push(`  cited in labels: ${[...zdCited].sort((a,b)=>parseInt(a.split(" ")[1])-parseInt(b.split(" ")[1])).join(", ")}`);
  const zdMissing = zdUniq.filter(ch => !zdCited.has(ch));
  out.push(`  NOT cited: ${zdMissing.join(", ") || "NONE"}`);

  // 4. Dashboard behavior with duplicates
  out.push("");
  out.push("=== listUserCourses (what the dashboard shows) ===");
  const { listUserCourses } = await import("../lib/repo");
  const { demoUserId } = await import("../lib/env");
  const uc = await listUserCourses(demoUserId, 100);
  out.push(`  courses returned: ${uc.length}`);
  for (const c of uc) out.push(`    - ${c.title} (${c.sourceKind ?? "?"})`);

  fs.writeFileSync(path.resolve(__dirname, "../../chapters.txt"), out.join("\n"));
  console.log("done");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
