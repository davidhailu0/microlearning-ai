import fs from "node:fs";
import path from "node:path";
import type { DraftCourse } from "./book-courses/types";
import { zeroDayCourse } from "./book-courses/zero-day";
import { fundamentalsCourse } from "./book-courses/fundamentals";
import { computerOrganizationCourse } from "./book-courses/computer-organization";
import { codeHiddenLanguageCourse } from "./book-courses/code-hidden-language";
import { hackerDisassemblingCourse } from "./book-courses/hacker-disassembling";
import { ddiaCourse } from "./book-courses/ddia";
import { osCourse } from "./book-courses/build-your-own-os";
import { nnCourse } from "./book-courses/build-your-own-neural-network";
import { processorCourse } from "./book-courses/build-your-own-processor";
import { plCourse } from "./book-courses/build-your-own-programming-language";
import { bcCourse } from "./book-courses/build-your-own-blockchain";
import { dbCourse } from "./book-courses/build-your-own-database";

const courses: DraftCourse[] = [
  zeroDayCourse,
  fundamentalsCourse,
  computerOrganizationCourse,
  codeHiddenLanguageCourse,
  hackerDisassemblingCourse,
  ddiaCourse,
  osCourse,
  nnCourse,
  processorCourse,
  plCourse,
  bcCourse,
  dbCourse,
];

function validQuiz(quiz: DraftCourse["modules"][number]["lessons"][number]["quiz"]) {
  return (
    Boolean(quiz) &&
    quiz.options.length === 4 &&
    Number.isInteger(quiz.correctIndex) &&
    quiz.correctIndex >= 0 &&
    quiz.correctIndex < quiz.options.length
  );
}

const out: string[] = [];
out.push("=== STATIC MAPPING CHECK (source files) ===");
let totalLessons = 0;
let bulletsBad = 0;
let quizBad = 0;
let fcBad = 0;
let noCitation = 0;
let noDiagram = 0;
let supplementalCitations = 0;

for (const c of courses) {
  const lessons = c.modules.flatMap((m) => m.lessons);
  totalLessons += lessons.length;

  const bulletsBadHere = lessons.filter(
    (l) => !l.bullets || l.bullets.length < 3 || l.bullets.length > 16,
  ).length;
  const quizBadHere = lessons.filter((l) => {
    if (!validQuiz(l.quiz)) return true;
    return (l.extraQuestions ?? []).some((question) => !validQuiz(question));
  }).length;
  const fcBadHere = lessons.filter(
    (l) => !l.flashcards || l.flashcards.length < 2 || l.flashcards.length > 8,
  ).length;
  const noCitationHere = lessons.filter((l) => !l.sourceRef?.label?.trim()).length;
  const noDiagramHere = lessons.filter((l) => !l.diagram).length;
  const supplementalHere = lessons.filter(
    (l) => l.sourceRef?.label && (l.sourceRef.sectionIndexes?.length ?? 0) === 0,
  ).length;

  bulletsBad += bulletsBadHere;
  quizBad += quizBadHere;
  fcBad += fcBadHere;
  noCitation += noCitationHere;
  noDiagram += noDiagramHere;
  supplementalCitations += supplementalHere;

  const secs = lessons.flatMap((l) => l.sourceRef?.sectionIndexes ?? []);
  const uniq = [...new Set(secs)];
  const questions = lessons.reduce((n, l) => n + 1 + (l.extraQuestions?.length ?? 0), 0);
  const cards = lessons.reduce((n, l) => n + l.flashcards.length, 0);

  out.push("");
  out.push(`${c.title}`);
  out.push(
    `  modules=${c.modules.length} lessons=${lessons.length} questions=${questions} flashcards=${cards}`,
  );
  out.push(
    `  bullets_bad=${bulletsBadHere} quiz_bad=${quizBadHere} flashcard_bad=${fcBadHere} missing_citation=${noCitationHere}`,
  );
  out.push(`  citations: unique sectionIndexes=${uniq.length} supplemental=${supplementalHere}`);
  out.push(`  diagrams: ${lessons.length - noDiagramHere}/${lessons.length} lessons have diagrams`);
}

out.push("");
out.push(`=== TOTALS: ${courses.length} courses, ${totalLessons} lessons ===`);
out.push(`  bullet violations:    ${bulletsBad} (must be 0; 3-16 per lesson)`);
out.push(`  quiz violations:      ${quizBad} (must be 0; 4 options and a valid correctIndex)`);
out.push(`  flashcard violations: ${fcBad} (must be 0; 2-8 per lesson)`);
out.push(`  lessons w/o citation: ${noCitation} (must be 0)`);
out.push(`  supplemental cites:   ${supplementalCitations} (text-source lessons without parsed section ranges)`);
out.push(`  lessons w/o diagram:  ${noDiagram} (must be 0)`);

const reportPath = path.resolve(__dirname, "../../mapping-report.txt");
fs.writeFileSync(reportPath, out.join("\n"));
console.log(out.join("\n"));
console.log("\nwritten to", reportPath);
