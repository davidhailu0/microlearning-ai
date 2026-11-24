import "dotenv/config";
import { getDb } from "../lib/db";
import * as s from "../lib/db/schema";
import { eq, sql } from "drizzle-orm";

const db = getDb();

async function main() {
  const rows = await db
    .select({
      id: s.courses.id,
      title: s.courses.title,
      slug: s.courses.slug,
      sourceKind: s.courses.sourceKind,
      sourceTitle: s.courses.sourceTitle,
      isPublished: s.courses.isPublished,
      createdAt: s.courses.createdAt,
    })
    .from(s.courses)
    .orderBy(s.courses.title, s.courses.createdAt);

  console.log("TOTAL COURSES:", rows.length, "\n");

  for (const c of rows) {
    const r = await db.execute(sql`
      select
        (select count(*) from lessons where course_id = ${c.id})::int as lessons,
        (select count(*) from flashcards where course_id = ${c.id})::int as cards,
        (select count(*) from citations ci join lessons l on l.id = ci.lesson_id where l.course_id = ${c.id})::int as cites,
        (select count(*) from questions q join quizzes qz on qz.id = q.quiz_id join lessons l on l.id = qz.lesson_id where l.course_id = ${c.id})::int as qs,
        (select count(*) from modules where course_id = ${c.id})::int as mods
    `);
    const counts = r as unknown as {
      lessons: number;
      cards: number;
      cites: number;
      qs: number;
      mods: number;
    }[];
    const x = counts[0];
    console.log(
      `${c.isPublished ? "PUB" : "UNP"} | ${c.title}\n     slug=${c.slug} kind=${c.sourceKind} src=${c.sourceTitle ?? "-"}\n     mods=${x.mods} lessons=${x.lessons} cards=${x.cards} cites=${x.cites} qs=${x.qs} created=${c.createdAt.toISOString().slice(0, 19)}\n`
    );
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
