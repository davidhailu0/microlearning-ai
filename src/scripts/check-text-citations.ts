import { osCourse } from "./book-courses/build-your-own-os";
import { nnCourse } from "./book-courses/build-your-own-neural-network";
import { processorCourse } from "./book-courses/build-your-own-processor";
import { plCourse } from "./book-courses/build-your-own-programming-language";
import { bcCourse } from "./book-courses/build-your-own-blockchain";
import { dbCourse } from "./book-courses/build-your-own-database";
import { fundamentalsCourse } from "./book-courses/fundamentals";
import type { DraftCourse, DraftLesson } from "./book-courses/types";
import fs from "node:fs";
import path from "node:path";

const out: string[] = [];
const all: DraftCourse[] = [osCourse, nnCourse, processorCourse, plCourse, bcCourse, dbCourse, fundamentalsCourse];
out.push("=== sourceRef presence per course (draft level) ===");
for (const c of all) {
  const lessons: DraftLesson[] = c.modules.flatMap((m) => m.lessons);
  const withRef = lessons.filter((l) => l.sourceRef && Object.keys(l.sourceRef).length > 0).length;
  const withLabel = lessons.filter((l) => l.sourceRef?.label).length;
  const withIdx = lessons.filter((l) => (l.sourceRef?.sectionIndexes?.length ?? 0) > 0).length;
  const withChapters = lessons.filter((l) => (l.chapters?.length ?? 0) > 0).length;
  out.push(`${c.title}: lessons=${lessons.length} withSourceRef=${withRef} withLabel=${withLabel} withSectionIndexes=${withIdx} withChapterHints=${withChapters}`);
  const sample: DraftLesson = lessons[0];
  out.push(`  sample sourceRef: ${JSON.stringify(sample.sourceRef)}`);
  if (sample.chapters) out.push(`  sample chapters: ${JSON.stringify(sample.chapters)}`);
}
fs.writeFileSync(path.resolve(__dirname, "../../text-citations.txt"), out.join("\n"));
console.log("ok");
