import "dotenv/config";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { bookCourseSteps } from "./book-courses/book-course-steps";
import { courseSteps } from "./book-courses/course-steps";

const stepBank = { ...courseSteps, ...bookCourseSteps };

/**
 * Enriches existing book courses in place without re-inserting the course:
 *  - normalizes note text and splits long paragraphs at sentence boundaries
 *  - inserts a "Do it yourself" steps block for hands-on courses
 *  - adds recall questions until each lesson has three questions
 *
 * Idempotent: rerunning it does not duplicate blocks or questions.
 *
 * Usage: npx tsx src/scripts/enrich-book-courses.ts
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
  "A Short History of Money",
  "Design for Attention",
  "How LLMs Actually Work",
  "Networks That Shape Us",
  "Probability Without Formulas",
  "The Psychology of Habit",
  "Thinking in Systems",
];

const MAX_PARAGRAPH_CHARS = 620;

function tidy(text: string) {
  // Preserve punctuation exactly: SQL snippets and file suffixes are content.
  return text.replace(/\s+/g, " ").trim();
}

function clip(text: string, max: number) {
  const clean = tidy(text);
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

function splitSentences(text: string) {
  const clean = tidy(text);
  if (clean.length <= MAX_PARAGRAPH_CHARS) return [clean];

  const sentences = clean.match(/[^.!?]+[.!?]+["')\]]?/g) ?? [clean];
  const paragraphs: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence.trim()}` : sentence.trim();
    if (next.length > MAX_PARAGRAPH_CHARS && current) {
      paragraphs.push(current);
      current = sentence.trim();
    } else {
      current = next;
    }
  }
  if (current) paragraphs.push(current);
  return paragraphs;
}

function splitParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => tidy(block))
    .filter(Boolean)
    .flatMap((block) => splitSentences(block));
}

type Quiz = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type LessonMeta = {
  id: string;
  title: string;
  bullets: string[];
  cards: { front: string; back: string }[];
};

function buildExtraQuestions(lesson: LessonMeta, lessonIndex: number, all: LessonMeta[]): Quiz[] {
  const others = all.filter((other) => other.id !== lesson.id);
  const extras: Quiz[] = [];

  const add = (question: string, correct: string | undefined, pool: (string | undefined)[]) => {
    if (!correct) return;
    const answer = clip(correct, 480);
    const distractors = [
      ...new Set(
        pool
          .filter((item): item is string => Boolean(item))
          .map((item) => clip(item, 480)),
      ),
    ]
      .filter((item) => item !== answer)
      .slice(0, 3);
    if (distractors.length < 3) return;

    const correctIndex = (lessonIndex + extras.length) % 4;
    const options = [...distractors];
    options.splice(correctIndex, 0, answer);

    extras.push({
      question,
      options,
      correctIndex,
      explanation: clip(`The lesson states: “${correct}”`, 1000),
    });
  };

  add(
    `Which statement is a key claim of “${lesson.title}”?`,
    lesson.bullets[0],
    others.map((other) => other.bullets[0]),
  );

  const card = lesson.cards[0];
  if (card) {
    add(
      `Which statement best explains “${card.front}”?`,
      card.back,
      others.map((other) => other.cards[0]?.back),
    );
  }

  return extras;
}

async function main() {
  const db = getDb();
  let lessonsTouched = 0;
  let blocksRewritten = 0;
  let questionsAdded = 0;
  let stepsAdded = 0;

  for (const title of TARGETS) {
    const [course] = await db
      .select({ id: s.courses.id, title: s.courses.title })
      .from(s.courses)
      .where(eq(s.courses.title, title))
      .limit(1);
    if (!course) {
      console.log(`! missing course: ${title}`);
      continue;
    }

    const lessonRows = await db
      .select({ id: s.lessons.id, title: s.lessons.title })
      .from(s.lessons)
      .where(eq(s.lessons.courseId, course.id))
      .orderBy(asc(s.lessons.position));

    const meta: LessonMeta[] = [];
    for (const lesson of lessonRows) {
      const [blocks, cards] = await Promise.all([
        db
          .select()
          .from(s.contentBlocks)
          .where(eq(s.contentBlocks.lessonId, lesson.id))
          .orderBy(asc(s.contentBlocks.position)),
        db.select().from(s.flashcards).where(eq(s.flashcards.lessonId, lesson.id)),
      ]);
      const bullets = blocks.find((block) => block.type === "bullets") as
        | { payload: { items?: string[] } }
        | undefined;
      meta.push({
        id: lesson.id,
        title: lesson.title,
        bullets: bullets?.payload.items ?? [],
        cards: cards.map((card) => ({ front: card.front, back: card.back })),
      });
    }

    for (const [lessonIndex, lesson] of lessonRows.entries()) {
      const [blocks, cards, quizRows] = await Promise.all([
        db
          .select()
          .from(s.contentBlocks)
          .where(eq(s.contentBlocks.lessonId, lesson.id))
          .orderBy(asc(s.contentBlocks.position)),
        db.select().from(s.flashcards).where(eq(s.flashcards.lessonId, lesson.id)),
        db.select().from(s.quizzes).where(eq(s.quizzes.lessonId, lesson.id)).limit(1),
      ]);

      const hook = blocks.find((block) => block.type === "hook")?.payload as
        | { text: string }
        | undefined;
      const takeaway = blocks.find((block) => block.type === "takeaway")?.payload as
        | { text: string }
        | undefined;
      const diagram = blocks.find((block) => block.type === "diagram")?.payload;
      const bulletBlock = blocks.find((block) => block.type === "bullets")?.payload as
        | { items: string[] }
        | undefined;
      const existingSteps = blocks.find((block) => block.type === "steps")?.payload as
        | { title?: string; items: { title: string; detail: string }[] }
        | undefined;
      const paragraphs = blocks
        .filter((block) => block.type === "paragraph")
        .flatMap((block) => splitParagraphs((block.payload as { text: string }).text));

      const steps =
        existingSteps?.items ??
        stepBank[course.title]?.[lesson.title]?.map((step) => ({
          title: tidy(step.title),
          detail: tidy(step.detail),
        }));

      const rebuilt: Record<string, unknown>[] = [];
      if (hook) rebuilt.push({ type: "hook", text: tidy(hook.text) });
      for (const paragraph of paragraphs) rebuilt.push({ type: "paragraph", text: paragraph });
      if (bulletBlock?.items?.length) {
        rebuilt.push({ type: "bullets", items: bulletBlock.items.map((item) => tidy(item)) });
      }
      if (steps?.length) {
        rebuilt.push({ type: "steps", title: "Do it yourself", items: steps });
        if (!existingSteps) stepsAdded += 1;
      }
      if (diagram) rebuilt.push(diagram);
      if (takeaway) rebuilt.push({ type: "takeaway", text: tidy(takeaway.text) });

      const before = blocks.map((block) => JSON.stringify(block.payload)).join("|");
      const after = rebuilt.map((block) => JSON.stringify(block)).join("|");
      if (before !== after) {
        await db.delete(s.contentBlocks).where(eq(s.contentBlocks.lessonId, lesson.id));
        await db.insert(s.contentBlocks).values(
          rebuilt.map((block, index) => ({
            lessonId: lesson.id,
            position: index,
            type: block.type as never,
            payload: block,
          })),
        );
        blocksRewritten += 1;
      }

      if (quizRows[0]) {
        const questions = await db
          .select({ id: s.questions.id, prompt: s.questions.prompt })
          .from(s.questions)
          .where(eq(s.questions.quizId, quizRows[0].id))
          .orderBy(asc(s.questions.position));

        if (questions.length < 3) {
          const extras = buildExtraQuestions(meta[lessonIndex], lessonIndex, meta).slice(
            0,
            3 - questions.length,
          );
          const existingPrompts = new Set(questions.map((question) => question.prompt));

          for (const [offset, quiz] of extras.entries()) {
            if (existingPrompts.has(quiz.question)) continue;
            const [question] = await db
              .insert(s.questions)
              .values({
                quizId: quizRows[0].id,
                position: questions.length + offset,
                type: "single_choice",
                prompt: quiz.question,
                explanation: quiz.explanation,
                points: 10,
              })
              .returning();
            await db.insert(s.quizOptions).values(
              quiz.options.map((label, index) => ({
                questionId: question.id,
                position: index,
                label,
                isCorrect: index === quiz.correctIndex,
              })),
            );
            questionsAdded += 1;
          }
        }
      }

      // Keep the flashcards used for question generation in sync with the DB.
      meta[lessonIndex].cards = cards.map((card) => ({ front: card.front, back: card.back }));
      lessonsTouched += 1;
    }

    console.log(`✓ ${course.title}`);
  }

  console.log(
    `\nlessons=${lessonsTouched} blocksRewritten=${blocksRewritten} stepsAdded=${stepsAdded} questionsAdded=${questionsAdded}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
