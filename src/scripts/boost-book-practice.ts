import "dotenv/config";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { asc, eq, inArray } from "drizzle-orm";

/**
 * Raises practice density for the twelve book-based courses:
 *  - at least 6 bullet points per lesson, distilled from that lesson's notes
 *  - at least 5 flashcards per lesson, adding implementation cards from steps
 *  - at least 5 quiz questions per lesson, adding step and recall questions
 *
 * Only book-based courses are targeted. The curated demo library has been
 * removed, so there is no templated demo content to inflate here.
 *
 * Idempotent: rerunning only fills gaps below the targets.
 *
 * Usage: npx tsx src/scripts/boost-book-practice.ts
 */

const TARGETS = [
  "Structured Computer Organization",
  "Code: The Hidden Language of Computer Hardware and Software",
  "Hacker Disassembling Uncovered",
  "From Day Zero to Zero Day",
  "Fundamentals of Software Architecture",
  "Build Your Own Operating System",
  "Build Your Own Processor",
  "Build Your Own Database",
  "Build Your Own Neural Network",
  "Build Your Own Programming Language",
  "Build Your Own Blockchain",
  "Designing Data-Intensive Applications",
];

const TARGET_BULLETS = 6;
const TARGET_CARDS = 5;
const TARGET_QUESTIONS = 5;

type Step = { title: string; detail: string };
type StepRecord = Step & { lessonId: string; courseId: string };
type QuestionDraft = {
  prompt: string;
  correct: string;
  distractors: string[];
  explanation: string;
};

function tidy(text: string) {
  // Preserve punctuation exactly: SQL snippets and file suffixes are content.
  return text.replace(/\s+/g, " ").trim();
}

function clip(text: string, max: number) {
  const clean = tidy(text);
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

function norm(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function sentences(text: string) {
  if (typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
    return Array.from(segmenter.segment(text), (part) => tidy(part.segment)).filter(Boolean);
  }
  return (text.match(/[^.!?]+[.!?]+["')\]]?/g) ?? [text]).map(tidy).filter(Boolean);
}

function scoreSentence(text: string) {
  let score = 0;
  for (const marker of [
    "because",
    "means",
    "requires",
    "allows",
    "causes",
    "depends",
    "tradeoff",
    "cost",
    "risk",
    "when",
    "if ",
    "must",
    "never",
    "always",
    "instead",
    "but ",
  ]) {
    if (text.toLowerCase().includes(marker)) score += 1;
  }
  if (/\d/.test(text)) score += 1;
  if (/[;:]/.test(text)) score += 1;
  if (text.length >= 90) score += 1;
  return score;
}

function pickNewBullets(
  paragraphs: string[],
  existing: string[],
  takeaway: string | undefined,
  needed: number,
) {
  if (needed <= 0) return [];

  const seen = [...existing, takeaway ?? ""].map(norm).filter(Boolean);
  const blocked = /^(this (lesson|chapter|section)|in this|the useful version|so the skill|you will|by the end|think of)\b/i;

  const candidates: { text: string; index: number; score: number }[] = [];
  let index = 0;
  for (const paragraph of paragraphs) {
    for (const sentence of sentences(paragraph)) {
      const text = tidy(sentence);
      index += 1;
      if (text.length < 65 || text.length > 240) continue;
      if (blocked.test(text)) continue;
      const key = norm(text);
      if (!key) continue;
      if (seen.some((item) => item.length > 24 && (item.includes(key) || key.includes(item)))) {
        continue;
      }
      candidates.push({ text, index, score: scoreSentence(text) });
    }
  }

  const ranked = [...candidates].sort((a, b) => b.score - a.score || a.index - b.index);
  const chosen = ranked.slice(0, needed).sort((a, b) => a.index - b.index);
  return chosen.map((item) => item.text);
}

function stepItems(block: { payload: unknown }): Step[] {
  const payload = block.payload as { items?: Step[] };
  return Array.isArray(payload.items) ? payload.items : [];
}

function addCard(
  cards: { front: string; back: string }[],
  steps: Step[],
  lessonTitle: string,
  courseId: string,
  lessonId: string,
  db: ReturnType<typeof getDb>,
) {
  const used = new Set(cards.map((card) => norm(card.front)));
  const additions: { front: string; back: string }[] = [];

  for (const step of steps) {
    if (cards.length + additions.length >= TARGET_CARDS) break;
    const title = tidy(step.title).replace(/[.!?]+$/, "");
    const front = `How do you ${title.charAt(0).toLowerCase()}${title.slice(1)}?`;
    if (used.has(norm(front))) continue;
    used.add(norm(front));
    additions.push({ front, back: clip(step.detail, 900) });
  }

  return db
    .insert(s.flashcards)
    .values(
      additions.map((card) => ({
        lessonId,
        courseId,
        concept: lessonTitle,
        front: card.front,
        back: card.back,
      })),
    )
    .returning({ id: s.flashcards.id });
}

async function addQuestions(
  db: ReturnType<typeof getDb>,
  quizId: string,
  existingPrompts: Set<string>,
  drafts: QuestionDraft[],
  startPosition: number,
  wanted: number,
) {
  let added = 0;

  for (const draft of drafts) {
    if (added >= wanted) break;
    if (existingPrompts.has(draft.prompt)) continue;

    const answer = clip(draft.correct, 480);
    const distractors = [
      ...new Set(draft.distractors.map((item) => clip(item, 480)).filter(Boolean)),
    ].filter((item) => item !== answer);
    if (distractors.length < 3) continue;

    const correctIndex = (startPosition + added) % 4;
    const options = distractors.slice(0, 3);
    options.splice(correctIndex, 0, answer);

    const [question] = await db
      .insert(s.questions)
      .values({
        quizId,
        position: startPosition + added,
        type: "single_choice",
        prompt: draft.prompt,
        explanation: clip(draft.explanation, 1000),
        points: 10,
      })
      .returning({ id: s.questions.id });

    await db.insert(s.quizOptions).values(
      options.map((label, index) => ({
        questionId: question.id,
        position: index,
        label,
        isCorrect: index === correctIndex,
      })),
    );

    existingPrompts.add(draft.prompt);
    added += 1;
  }

  return added;
}

async function main() {
  const db = getDb();

  const courses = await db
    .select({ id: s.courses.id, title: s.courses.title })
    .from(s.courses)
    .where(inArray(s.courses.title, TARGETS));

  if (courses.length !== TARGETS.length) {
    const found = new Set(courses.map((course) => course.title));
    for (const title of TARGETS) {
      if (!found.has(title)) console.log(`! missing course: ${title}`);
    }
  }

  const courseIds = courses.map((course) => course.id);
  const lessonRows = await db
    .select({ id: s.lessons.id, courseId: s.lessons.courseId, title: s.lessons.title })
    .from(s.lessons)
    .where(inArray(s.lessons.courseId, courseIds))
    .orderBy(asc(s.lessons.courseId), asc(s.lessons.position));

  const lessonIds = lessonRows.map((lesson) => lesson.id);
  const allBlocks = await db
    .select({
      id: s.contentBlocks.id,
      lessonId: s.contentBlocks.lessonId,
      type: s.contentBlocks.type,
      payload: s.contentBlocks.payload,
    })
    .from(s.contentBlocks)
    .where(inArray(s.contentBlocks.lessonId, lessonIds))
    .orderBy(asc(s.contentBlocks.position));

  const courseByLesson = new Map(lessonRows.map((lesson) => [lesson.id, lesson.courseId]));

  const stepPool: StepRecord[] = [];
  const bulletPool: { lessonId: string; courseId: string; text: string }[] = [];
  for (const block of allBlocks) {
    const courseId = courseByLesson.get(block.lessonId);
    if (!courseId) continue;
    if (block.type === "steps") {
      for (const step of stepItems(block)) {
        stepPool.push({
          lessonId: block.lessonId,
          courseId,
          title: tidy(step.title),
          detail: tidy(step.detail),
        });
      }
    }
    if (block.type === "bullets") {
      for (const item of (block.payload as { items?: string[] }).items ?? []) {
        bulletPool.push({ lessonId: block.lessonId, courseId, text: tidy(item) });
      }
    }
  }
  const stepsByLesson = new Map<string, Step[]>();
  for (const step of stepPool) {
    const list = stepsByLesson.get(step.lessonId) ?? [];
    list.push(step);
    stepsByLesson.set(step.lessonId, list);
  }

  let bulletsAdded = 0;
  let cardsAdded = 0;
  let questionsAdded = 0;
  let lessonsTouched = 0;

  for (const [lessonIndex, lesson] of lessonRows.entries()) {
    const blocks = allBlocks.filter((block) => block.lessonId === lesson.id);
    const bulletBlock = blocks.find((block) => block.type === "bullets");
    const takeaway = blocks.find((block) => block.type === "takeaway")?.payload as
      | { text?: string }
      | undefined;

    const existingBullets = (bulletBlock?.payload as { items?: string[] } | undefined)?.items ?? [];
    const missingBullets = Math.max(0, TARGET_BULLETS - existingBullets.length);
    const newBullets = pickNewBullets(
      blocks
        .filter((block) => block.type === "paragraph")
        .map((block) => (block.payload as { text?: string }).text ?? ""),
      existingBullets,
      takeaway?.text,
      missingBullets,
    );

    if (bulletBlock && newBullets.length) {
      await db
        .update(s.contentBlocks)
        .set({ payload: { type: "bullets", items: [...existingBullets, ...newBullets] } })
        .where(eq(s.contentBlocks.id, bulletBlock.id));
      bulletsAdded += newBullets.length;
    }

    const cards = await db
      .select({ front: s.flashcards.front, back: s.flashcards.back })
      .from(s.flashcards)
      .where(eq(s.flashcards.lessonId, lesson.id));

    const steps = stepsByLesson.get(lesson.id) ?? [];
    if (cards.length < TARGET_CARDS && steps.length) {
      const inserted = await addCard(
        cards,
        steps,
        lesson.title,
        lesson.courseId,
        lesson.id,
        db,
      );
      cardsAdded += inserted.length;
    }

    const [quiz] = await db
      .select({ id: s.quizzes.id })
      .from(s.quizzes)
      .where(eq(s.quizzes.lessonId, lesson.id))
      .limit(1);

    let addedQuestions = 0;
    if (quiz) {
      const existingQuestions = await db
        .select({ prompt: s.questions.prompt, position: s.questions.position })
        .from(s.questions)
        .where(eq(s.questions.quizId, quiz.id))
        .orderBy(asc(s.questions.position));

      const wanted = Math.max(0, TARGET_QUESTIONS - existingQuestions.length);
      if (wanted > 0) {
        const others = stepPool.filter(
          (step) => step.lessonId !== lesson.id && step.courseId === lesson.courseId,
        );
        const drafts: QuestionDraft[] = [];

        if (steps[0]) {
          drafts.push({
            prompt: `Which of these is a hands-on step in “${lesson.title}”?`,
            correct: steps[0].title,
            distractors: others.map((step) => step.title),
            explanation: `“${steps[0].title}” is part of this lesson's sequence: ${steps[0].detail}`,
          });
        }

        if (steps[1]) {
          drafts.push({
            prompt: `What does the hands-on step “${steps[1].title}” involve?`,
            correct: steps[1].detail,
            distractors: others.map((step) => step.detail),
            explanation: `The lesson describes “${steps[1].title}” as: ${steps[1].detail}`,
          });
        }

        const extraBullet =
          newBullets[0] ?? existingBullets[existingBullets.length - 1] ?? existingBullets[0];
        if (extraBullet) {
          const sameLesson = new Set(existingBullets.map(norm));
          drafts.push({
            prompt: `Which statement is another key claim of “${lesson.title}”?`,
            correct: extraBullet,
            distractors: bulletPool
              .filter(
                (item) =>
                  item.lessonId !== lesson.id &&
                  item.courseId === lesson.courseId &&
                  !sameLesson.has(norm(item.text)) &&
                  norm(item.text) !== norm(extraBullet),
              )
              .map((item) => item.text),
            explanation: `The lesson states: “${extraBullet}”`,
          });
        }

        addedQuestions = await addQuestions(
          db,
          quiz.id,
          new Set(existingQuestions.map((question) => question.prompt)),
          drafts,
          existingQuestions.length,
          wanted,
        );
        questionsAdded += addedQuestions;
      }
    }

    if (newBullets.length || addedQuestions || cards.length < TARGET_CARDS) {
      lessonsTouched += 1;
    }
    void lessonIndex;
  }

  console.log(
    `lessons=${lessonsTouched} bulletsAdded=${bulletsAdded} cardsAdded=${cardsAdded} questionsAdded=${questionsAdded}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
