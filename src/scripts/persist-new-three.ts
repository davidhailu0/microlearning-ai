import "dotenv/config";
import { demoUserId } from "@/lib/env";
import { persistCourseDraft } from "@/lib/repo";
import type { DraftCourse } from "./book-courses/types";
import { computerOrganizationCourse } from "./book-courses/computer-organization";
import { codeHiddenLanguageCourse } from "./book-courses/code-hidden-language";
import { hackerDisassemblingCourse } from "./book-courses/hacker-disassembling";

/**
 * Persists the three later book courses. Drafts are persisted as authored, the
 * same way persist-book-courses.ts does; keep the two in sync when either
 * changes.
 */
type PersistArgs = {
  draft: DraftCourse;
  sourceKind: "pdf" | "epub" | "text";
  sourceTitle: string;
  sourceAuthor: string;
  wordCount: number;
  charCount: number;
};

async function persistOne(args: PersistArgs) {
  const { courseId, lessonIds } = await persistCourseDraft({
    draft: args.draft as never,
    userId: demoUserId,
    sourceKind: args.sourceKind,
    sourceTitle: args.sourceTitle,
    sourceAuthor: args.sourceAuthor,
    wordCount: args.wordCount,
    charCount: args.charCount,
  });
  console.log(`✓ ${args.draft.title} (${courseId}, ${lessonIds.length} lessons)`);
  return courseId;
}

async function main() {
  console.log("Persisting...\n");
  await persistOne({ draft: computerOrganizationCourse, sourceKind: "pdf", sourceTitle: "Structured Computer Organization", sourceAuthor: "Tanenbaum", wordCount: 400000, charCount: 2500000 });
  await persistOne({ draft: codeHiddenLanguageCourse, sourceKind: "epub", sourceTitle: "Code", sourceAuthor: "Petzold", wordCount: 150000, charCount: 900000 });
  await persistOne({ draft: hackerDisassemblingCourse, sourceKind: "epub", sourceTitle: "Hacker Disassembling", sourceAuthor: "Kaspersky", wordCount: 200000, charCount: 1200000 });
  console.log("Done");
}
main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
