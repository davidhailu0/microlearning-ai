import "dotenv/config";
import { z } from "zod";
import {
  courseDraftSchema,
  lessonDraftSchema,
  moduleDraftSchema,
  sourceRefSchema,
} from "@/lib/ai/schema";
import { computerOrganizationCourse } from "./book-courses/computer-organization";
import { codeHiddenLanguageCourse } from "./book-courses/code-hidden-language";
import { hackerDisassemblingCourse } from "./book-courses/hacker-disassembling";
import { ddiaCourse } from "./book-courses/ddia";

/** Validates the hand-authored drafts against the same schemas persist uses. */

const lessonSchema = lessonDraftSchema.extend({
  sourceRef: sourceRefSchema,
  chapters: z.array(z.string()).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
});
const moduleSchema = moduleDraftSchema.extend({ lessons: z.array(lessonSchema) });
const courseSchema = courseDraftSchema.extend({
  modules: z.array(moduleSchema).min(3).max(8),
});

const drafts = [
  ["computer-organization", computerOrganizationCourse],
  ["code-hidden-language", codeHiddenLanguageCourse],
  ["hacker-disassembling", hackerDisassemblingCourse],
  ["ddia", ddiaCourse],
] as const;

let failed = false;

for (const [name, draft] of drafts) {
  const result = courseSchema.safeParse(draft);
  const lessons = draft.modules.reduce((n, m) => n + m.lessons.length, 0);
  if (result.success) {
    console.log(`✓ ${name}: ${draft.modules.length} modules, ${lessons} lessons`);
    continue;
  }
  failed = true;
  console.log(`✗ ${name}: ${result.error.issues.length} issue(s)`);
  for (const issue of result.error.issues) {
    console.log(`   ${issue.path.join(".")}: ${issue.message}`);
  }
}

process.exit(failed ? 1 : 0);
