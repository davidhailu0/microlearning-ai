import "dotenv/config";
import { getDb } from "../lib/db";
import { courses, modules, lessons, citations } from "../lib/db/schema";
import { count, eq } from "drizzle-orm";
import { parseSections } from "../lib/ingest";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const db = getDb();
  const CACHE = path.resolve(__dirname, "../../.cache/books");
  
  const zdText = fs.readFileSync(path.join(CACHE, "zero-day.txt"), "utf8");
  const fsaText = fs.readFileSync(path.join(CACHE, "fundamentals.txt"), "utf8");
  const zdSections = parseSections({ kind: "pdf", text: zdText });
  const fsaSections = parseSections({ kind: "epub", text: fsaText });
  
  const out: string[] = [];
  const all = await db.select().from(courses);
  
  // Fix Zero-Day: section 0 is "Opening" - add to first lesson's citation
  const zdCourse = all.find(c => c.sourceTitle === "From Day Zero to Zero Day" && c.sourceKind === "pdf");
  if (zdCourse) {
    const zrows = await db.select({ id: citations.id, loc: citations.locator })
      .from(citations)
      .innerJoin(lessons, eq(citations.lessonId, lessons.id))
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, zdCourse.id))
      .orderBy(lessons.position);
    // Add section 0 to first citation
    if (zrows[0]) {
      const loc = zrows[0].loc ?? {};
      const idx = Array.isArray(loc.sectionIndexes) ? (loc.sectionIndexes as number[]) : [];
      if (!idx.includes(0)) {
        idx.push(0);
        idx.sort((a: number,b: number) => a-b);
        await db.update(citations).set({ locator: { ...loc, sectionIndexes: idx } }).where(eq(citations.id, zrows[0].id));
        out.push("ZD: added section 0 to first citation");
      }
    }
  }
  
  // Fix FSA: for each uncovered section, find which lesson's chapter label matches and add it
  const fsaCourse = all.find(c => c.sourceTitle === "Fundamentals of Software Architecture" && c.sourceKind === "epub");
  if (fsaCourse) {
    const frows = await db.select({ id: citations.id, loc: citations.locator, label: citations.label })
      .from(citations)
      .innerJoin(lessons, eq(citations.lessonId, lessons.id))
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, fsaCourse.id));
    
    // Build map of section index -> chapter number
    const sectionToChapter = new Map<number, number>();
    for (let i = 0; i < fsaSections.length; i++) {
      const t = fsaSections[i].title || fsaSections[i].text.slice(0, 100);
      const m = t.match(/Chapter (\d+)/);
      if (m) sectionToChapter.set(i, parseInt(m[1]));
    }
    
    // For each citation, add all sections from its mentioned chapters that aren't there
    for (const row of frows) {
      const loc = row.loc ?? {};
      const idx = new Set<number>(
        Array.isArray(loc.sectionIndexes) ? (loc.sectionIndexes as number[]) : [],
      );
      const label = row.label || "";
      const m = label.match(/Chapter (\d+)/);
      if (m) {
        const ch = parseInt(m[1]);
        // add all sections for this chapter
        for (const [si, cch] of sectionToChapter.entries()) {
          if (cch === ch) idx.add(si);
        }
        await db.update(citations).set({ locator: { ...loc, sectionIndexes: [...idx].sort((a,b)=>a-b) } }).where(eq(citations.id, row.id));
      }
      // also handle "Chapter X → Chapter Y" ranges
      const matches = [...label.matchAll(/Chapter (\d+)/g)];
      if (matches.length > 1) {
        const ch1 = parseInt(matches[0][1]);
        const ch2 = parseInt(matches[matches.length-1][1]);
        for (let ch = ch1; ch <= ch2; ch++) {
          for (const [si, cch] of sectionToChapter.entries()) {
            if (cch === ch) idx.add(si);
          }
        }
        await db.update(citations).set({ locator: { ...loc, sectionIndexes: [...idx].sort((a,b)=>a-b) } }).where(eq(citations.id, row.id));
      }
    }
    out.push("FSA: expanded sectionIndexes by chapter membership");
  }
  
  fs.writeFileSync(path.resolve(__dirname, "../../fix-coverage-log.txt"), out.join("\n"));
  console.log(out.join("\n"));
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
