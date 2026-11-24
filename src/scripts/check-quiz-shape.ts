import { zeroDayCourse } from "./book-courses/zero-day";
import { fundamentalsCourse } from "./book-courses/fundamentals";
import type { DraftLesson } from "./book-courses/types";
import fs from "node:fs";
import path from "node:path";

const out: string[] = [];
const zl: DraftLesson = zeroDayCourse.modules[0].lessons[0];
out.push("=== Zero-Day Lesson 1 quiz shape ===");
out.push(JSON.stringify(zl.quiz, null, 2));
out.push("");
out.push("=== Zero-Day Lesson 1 sourceRef ===");
out.push(JSON.stringify(zl.sourceRef, null, 2));
out.push("");
const fl: DraftLesson = fundamentalsCourse.modules[0].lessons[0];
out.push("=== FSA Lesson 1 quiz shape ===");
out.push(JSON.stringify(fl.quiz, null, 2));
out.push("");
out.push("=== FSA Lesson 1 sourceRef + chapters ===");
out.push(JSON.stringify({ sourceRef: fl.sourceRef, chapters: fl.chapters }, null, 2));
out.push("");
out.push("=== FSA course sourceKind field keys ===");
out.push(JSON.stringify(Object.keys(fundamentalsCourse)));
out.push(
  JSON.stringify({
    sourceKind: fundamentalsCourse.sourceKind,
    sourceKindAlt: (fundamentalsCourse as unknown as Record<string, unknown>).source_kind,
  }),
);

fs.writeFileSync(path.resolve(__dirname, "../../quiz-report.txt"), out.join("\n"));
console.log("ok");
