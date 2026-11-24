/**
 * Replaces quiz distractors that leaked in from a different course.
 *
 * `boost-book-practice.ts` used to draw distractor steps and bullets from one
 * global pool covering every book course, so a processor quiz could offer
 * "Implement insertion with splits" (a B+-tree step) as an option. The
 * generator is now scoped per course; this script repairs rows already written.
 *
 * A distractor is contaminated when its normalised text matches a bullet, step
 * title, or step detail that belongs to another course. Contaminated options are
 * replaced with a same-course candidate of the same kind (step title for a step
 * question, detail for a detail question, bullet for a claim question) so the
 * question still makes sense.
 *
 * Correct answers are never modified.
 *
 * Usage:
 *   npx tsx src/scripts/repair-quiz-distractors.ts --dry-run
 *   npx tsx src/scripts/repair-quiz-distractors.ts
 */
import "dotenv/config";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { asc, eq, inArray } from "drizzle-orm";

const dryRun = process.argv.includes("--dry-run");

type Kind = "bullet" | "step-title" | "step-detail" | "unknown";

type Snippet = {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonPosition: number;
  kind: Kind;
  raw: string;
  norm: string;
};

const norm = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const unwrap = (value: unknown): Record<string, unknown> => {
  let current = value;
  while (typeof current === "string") {
    try {
      current = JSON.parse(current);
    } catch {
      return {};
    }
  }
  return current && typeof current === "object" ? (current as Record<string, unknown>) : {};
};

/** Length above which a containment match is meaningful rather than coincidental. */
const CONTAINMENT_MIN = 40;

/** Candidate answers that are boilerplate rather than lesson-specific content. */
const GENERIC_STEPS = new Set(["set up the project", "run the finished artifact"]);

function questionKindOf(prompt: string): Kind {
  if (/what does the hands-on step/i.test(prompt)) return "step-detail";
  if (/hands-on step/i.test(prompt)) return "step-title";
  if (/key claim|best explains/i.test(prompt)) return "bullet";
  return "unknown";
}

function matches(a: string, b: string) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= CONTAINMENT_MIN && b.includes(a)) return true;
  if (b.length >= CONTAINMENT_MIN && a.includes(b)) return true;
  return false;
}

async function main() {
  const db = getDb();

  const courses = await db
    .select({ id: s.courses.id, title: s.courses.title })
    .from(s.courses)
    .orderBy(asc(s.courses.title));

  const courseTitle = new Map(courses.map((course) => [course.id, course.title]));

  const lessons = await db
    .select({
      id: s.lessons.id,
      courseId: s.lessons.courseId,
      title: s.lessons.title,
      position: s.lessons.position,
    })
    .from(s.lessons)
    .where(
      inArray(
        s.lessons.courseId,
        courses.map((course) => course.id),
      ),
    )
    .orderBy(asc(s.lessons.courseId), asc(s.lessons.position));

  const lessonMeta = new Map(
    lessons.map((lesson) => [
      lesson.id,
      {
        courseId: lesson.courseId,
        title: lesson.title,
        position: lesson.position,
      },
    ]),
  );

  const blocks = await db
    .select({
      lessonId: s.contentBlocks.lessonId,
      position: s.contentBlocks.position,
      type: s.contentBlocks.type,
      payload: s.contentBlocks.payload,
    })
    .from(s.contentBlocks)
    .where(
      inArray(
        s.contentBlocks.lessonId,
        lessons.map((lesson) => lesson.id),
      ),
    )
    .orderBy(asc(s.contentBlocks.lessonId), asc(s.contentBlocks.position));

  const snippets: Snippet[] = [];
  const addSnippet = (lessonId: string, kind: Kind, raw: string) => {
    const meta = lessonMeta.get(lessonId);
    if (!meta) return;
    const text = raw.replace(/\s+/g, " ").trim();
    const key = norm(text);
    if (!key) return;
    snippets.push({
      courseId: meta.courseId,
      courseTitle: courseTitle.get(meta.courseId) ?? "",
      lessonId,
      lessonTitle: meta.title,
      lessonPosition: meta.position,
      kind,
      raw: text,
      norm: key,
    });
  };

  for (const block of blocks) {
    const payload = unwrap(block.payload);
    if (block.type === "bullets") {
      for (const item of (payload.items as string[] | undefined) ?? []) {
        addSnippet(block.lessonId, "bullet", String(item));
      }
    }
    if (block.type === "steps") {
      for (const step of (payload.items as { title?: string; detail?: string }[] | undefined) ?? []) {
        if (step?.title) addSnippet(block.lessonId, "step-title", step.title);
        if (step?.detail) addSnippet(block.lessonId, "step-detail", step.detail);
      }
    }
  }

  const courseSnippets = new Map<string, Snippet[]>();
  for (const snippet of snippets) {
    const list = courseSnippets.get(snippet.courseId) ?? [];
    list.push(snippet);
    courseSnippets.set(snippet.courseId, list);
  }

  /** Snippets that belong to some course other than `courseId`. */
  const foreign = new Map<string, Snippet[]>();
  for (const course of courses) {
    foreign.set(
      course.id,
      snippets.filter((snippet) => snippet.courseId !== course.id),
    );
  }

  const findForeign = (courseId: string, text: string): Snippet | undefined => {
    const key = norm(text);
    if (!key) return undefined;
    return foreign.get(courseId)?.find((snippet) => matches(key, snippet.norm));
  };

  const quizzes = await db
    .select({ id: s.quizzes.id, lessonId: s.quizzes.lessonId })
    .from(s.quizzes)
    .where(
      inArray(
        s.quizzes.lessonId,
        lessons.map((lesson) => lesson.id),
      ),
    );

  const quizIds = quizzes.map((quiz) => quiz.id);
  const questions = await db
    .select({
      id: s.questions.id,
      quizId: s.questions.quizId,
      position: s.questions.position,
      prompt: s.questions.prompt,
    })
    .from(s.questions)
    .where(inArray(s.questions.quizId, quizIds))
    .orderBy(asc(s.questions.quizId), asc(s.questions.position));

  const options = await db
    .select({
      id: s.quizOptions.id,
      questionId: s.quizOptions.questionId,
      position: s.quizOptions.position,
      label: s.quizOptions.label,
      isCorrect: s.quizOptions.isCorrect,
    })
    .from(s.quizOptions)
    .where(
      inArray(
        s.quizOptions.questionId,
        questions.map((question) => question.id),
      ),
    )
    .orderBy(asc(s.quizOptions.questionId), asc(s.quizOptions.position));

  const quizLesson = new Map(quizzes.map((quiz) => [quiz.id, quiz.lessonId]));
  const optionsByQuestion = new Map<string, typeof options>();
  for (const option of options) {
    const list = optionsByQuestion.get(option.questionId) ?? [];
    list.push(option);
    optionsByQuestion.set(option.questionId, list);
  }

  const stats = new Map<string, { questions: number; contaminated: number; replaced: number }>();
  const replacements: { optionId: string; label: string; from: string; to: string; course: string; lesson: string; prompt: string }[] = [];
  const unresolved: string[] = [];

  for (const question of questions) {
    const lessonId = quizLesson.get(question.quizId);
    if (!lessonId) continue;
    const meta = lessonMeta.get(lessonId);
    if (!meta) continue;
    const title = courseTitle.get(meta.courseId) ?? "";

    const stat = stats.get(title) ?? { questions: 0, contaminated: 0, replaced: 0 };
    stat.questions += 1;

    const questionOptions = optionsByQuestion.get(question.id) ?? [];
    const correct = questionOptions.find((option) => option.isCorrect);
    if (!correct) {
      stats.set(title, stat);
      continue;
    }

    const questionKind: Kind = questionKindOf(question.prompt);

    const contaminated = questionOptions.filter(
      (option) => !option.isCorrect && findForeign(meta.courseId, option.label),
    );
    if (contaminated.length) stat.contaminated += 1;

    const used = new Set(questionOptions.map((option) => norm(option.label)));
    const correctNorm = norm(correct.label);
    used.add(correctNorm);

    // Candidate distractors: same course, different lesson, same kind, never
    // themselves foreign, and not already present in this question.
    const candidates = (courseSnippets.get(meta.courseId) ?? [])
      .filter((snippet) => snippet.lessonId !== lessonId)
      .sort((a, b) => {
        if (a.lessonPosition !== b.lessonPosition) return a.lessonPosition - b.lessonPosition;
        return a.raw.localeCompare(b.raw);
      })
      .filter((snippet) => {
        if (snippet.norm === correctNorm) return false;
        if (used.has(snippet.norm)) return false;
        if (snippet.kind !== "bullet" && GENERIC_STEPS.has(snippet.norm)) return false;
        if (findForeign(meta.courseId, snippet.raw)) return false;
        return true;
      });

    const sameKind = candidates.filter((snippet) =>
      questionKind === "unknown" ? true : snippet.kind === questionKind,
    );
    const pool = sameKind.length >= contaminated.length ? sameKind : candidates;

    // Deterministic offset so consecutive questions do not all reuse one candidate.
    const seed = [...question.id].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 100003, 7);
    let cursor = pool.length ? seed % pool.length : 0;
    const nextCandidate = () => {
      for (let tries = 0; tries < pool.length; tries++) {
        const candidate = pool[(cursor + tries) % pool.length]!;
        if (!used.has(candidate.norm)) {
          cursor = (cursor + tries + 1) % pool.length;
          return candidate;
        }
      }
      return undefined;
    };

    for (const option of contaminated) {
      const candidate = nextCandidate();
      if (!candidate) {
        unresolved.push(
          `${title} > ${meta.title} | ${question.prompt} | no same-course candidate for “${option.label}”`,
        );
        continue;
      }
      used.add(candidate.norm);
      stat.replaced += 1;
      replacements.push({
        optionId: option.id,
        label: candidate.raw,
        from: option.label,
        to: candidate.raw,
        course: title,
        lesson: meta.title,
        prompt: question.prompt,
      });
    }

    stats.set(title, stat);
  }

  for (const replacement of replacements) {
    console.log(
      `${replacement.course} > ${replacement.lesson}\n  Q: ${replacement.prompt}\n  - ${replacement.from}\n  + ${replacement.to}\n`,
    );
  }

  console.log("---");
  for (const [title, stat] of stats) {
    console.log(
      `${title}: ${stat.contaminated}/${stat.questions} contaminated, ${stat.replaced} option(s) replaced`,
    );
  }
  const totalContaminated = [...stats.values()].reduce((sum, stat) => sum + stat.contaminated, 0);
  const totalQuestions = [...stats.values()].reduce((sum, stat) => sum + stat.questions, 0);
  console.log(
    `TOTAL: ${totalContaminated}/${totalQuestions} contaminated question(s), ${replacements.length} option(s) replaced`,
  );
  if (unresolved.length) {
    console.log(`\n${unresolved.length} unresolved:`);
    for (const line of unresolved) console.log(`  ${line}`);
  }

  if (dryRun) {
    console.log("\nDry run: no rows written.");
    return;
  }

  for (const replacement of replacements) {
    await db
      .update(s.quizOptions)
      .set({ label: replacement.label })
      .where(eq(s.quizOptions.id, replacement.optionId));
  }
  console.log(`\nUpdated ${replacements.length} quiz option(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
