import type { GenerateInput } from "@/lib/types";
import type { BookPlan } from "./schema";
import type { SourceSection } from "@/lib/ingest";

export const SYSTEM_PROMPT = `You are the course architect for Lumen, a micro-learning app.

Turn the supplied material into a short, coherent course a curious adult can finish in one sitting.

Hard rules:
- 3 to 5 modules. 2 to 4 lessons per module (2 is better than padding).
- Every lesson is a 3-minute read: one idea, at most ~450 words.
- Exactly 3 bullets, each a complete claim — never a fragment.
- Exactly 1 multiple-choice quiz question with exactly 4 options and one correct answer.
- Exactly 2 flashcards: one definition/recall card and one application card.
- A diagram only when the idea is genuinely a process, cycle, hierarchy, or comparison. Otherwise null. Never force one.
- Ground every factual claim in the supplied material. If the material does not support a claim, omit it. Never invent numbers, names, or citations.
- Write in the language of the source material.
- Distill, do not summarize chapter by chapter. The course should feel designed, not scraped.
- Voice: second person, concrete, short sentences, zero hype. Explain like a sharp friend, not a textbook.
- The opening lesson establishes the central question. The final lesson lands the synthesis.
- Titles are specific ("Why systems surprise us"), not generic ("Introduction").`;

export function buildUserPrompt(args: {
  input: GenerateInput;
  sourceText?: string;
  title?: string;
  author?: string;
  wordCount?: number;
}) {
  const { input, sourceText, title, author, wordCount } = args;

  const meta = [
    title ? `Source title: ${title}` : null,
    author ? `Author: ${author}` : null,
    wordCount ? `Source length: ~${wordCount.toLocaleString()} words` : null,
    `Requested level: ${input.level ?? "beginner"}`,
    input.lessonCount ? `Target lesson count: ${input.lessonCount}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (!sourceText) {
    return `Create a course from this request:

"${input.prompt}"

${meta}

Use well-established knowledge. Be accurate and concrete. Prefer a small number of sharp lessons over broad coverage.`;
  }

  return `Create a course from the following source material.

${meta}

<source>
${sourceText}
</source>

Build the course around the source's own argument. Quote sparingly; paraphrase in plain language. Do not cover everything — choose the through-line that makes the book worth 30 minutes.`;
}

/**
 * Long books are never sent whole. Keep headings (they carry the structure)
 * and sample paragraphs from each section up to the character budget.
 */
export function buildSourceDigest(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;

  const lines = text.split("\n");
  const headings = lines.filter((line) => /^#{1,4}\s|^\[page \d+\]$/.test(line.trim()));

  if (headings.length >= 4) {
    const head = headings.join("\n").slice(0, Math.floor(maxChars * 0.3));
    const body = text.slice(0, Math.floor(maxChars * 0.7));
    return `${head}\n\n[...structure above; sampled text below...]\n\n${body}`;
  }

  const head = text.slice(0, Math.floor(maxChars * 0.6));
  const tail = text.slice(-Math.floor(maxChars * 0.35));
  return `${head}\n\n[...middle omitted for length...]\n\n${tail}`;
}

/* -------------------------------------------------------------- book mode */

export const BOOK_SYSTEM_PROMPT = `You are the reading-companion architect for Lumen.

Your job is not to summarise a book. Your job is to give a learner the working understanding of someone who read it end to end: the central argument, how each chapter builds it, the evidence the author actually uses, the strongest objections, and the places where the argument is fragile.

Hard rules:
- Cover the whole book. Every section in a batch must be represented by at least one lesson. Never skip a chapter because it is difficult, unglamorous, or feels like connective tissue.
- Depth is cumulative, not three unrelated summaries. Write for someone who has not read the book at every level. Beginner establishes the claim and why it matters. Intermediate adds mechanism, evidence, and examples. Advanced adds the author's reasoning, the counterargument, the limits, and links across chapters.
- Ground every factual claim in the supplied text. Use the author's specific numbers, names, studies, cases, and examples. If the text does not support a claim, omit it. Never invent a quote, page, study, or statistic.
- Each lesson makes one move in the argument and takes 4–6 minutes to read: 3–4 paragraphs of 200–300 words each, then 3–4 claim-level bullets and a takeaway. Prefer depth over a list of topics. No filler, no restating the prompt.
- Give 3–4 bullets, each a complete claim. Give exactly 1 four-option quiz and 2 flashcards.
- Use the author's terms, then define them in plain language. No hype, no "in this chapter we will".
- The course should feel designed as an argument, not scraped chapter by chapter, while still covering every chapter.
- Titles are specific claims ("Scarcity changes what a market can see"), never generic ("Introduction", "Chapter 3 summary").`;

const DEPTH: Record<string, string> = {
  beginner: `Depth: BEGINNER, but cumulative. Each lesson states the chapter's central claim, why the author needs it, and one concrete example. Define every term. End by connecting the claim to the book's throughline.`,
  intermediate: `Depth: INTERMEDIATE, but cumulative. Each lesson still establishes the foundation, then adds the mechanism: how the claim works, what evidence supports it, and where the author's example comes from. Assume no prior reading.`,
  advanced: `Depth: ADVANCED, but cumulative. Each lesson still establishes the foundation, then adds the author's reasoning in detail: the evidence, the alternative explanations they reject, the caveats, and how the claim connects to other chapters. Include the strongest objection where the text supports one.`,
};

export function sectionManifest(sections: SourceSection[]) {
  return sections
    .map((section) => {
      const pages =
        section.pageStart != null
          ? `pages ${section.pageStart}${section.pageEnd && section.pageEnd !== section.pageStart ? `–${section.pageEnd}` : ""}`
          : "no page numbers";
      return `[section ${section.index}] ${section.title} | ${pages} | ${section.wordCount.toLocaleString()} words`;
    })
    .join("\n");
}

export type BookChunk = {
  index: number;
  sections: SourceSection[];
  targetLessons: number;
  moduleTitle?: string;
  moduleSummary?: string;
};

export function buildBookPlanPrompt(args: {
  sourceTitle: string;
  author?: string;
  level: string;
  totalWords: number;
  sections: SourceSection[];
  chunks: BookChunk[];
}) {
  const blockDescriptions = args.chunks
    .map((chunk) => {
      const titles = chunk.sections.map((section) => section.title).join("; ");
      const words = chunk.sections.reduce((sum, section) => sum + section.wordCount, 0);
      const opening = chunk.sections[0]?.text.replace(/\[page \d+\]/g, "").trim().slice(0, 320);
      return `Block ${chunk.index} — ${titles}\n  ${chunk.sections.length} sections, ~${words.toLocaleString()} words. Opens: "${opening.replace(/\s+/g, " ")}…"`;
    })
    .join("\n\n");

  return `Plan the reading companion for this book.

Book: ${args.sourceTitle}
${args.author ? `Author: ${args.author}` : ""}
Length: ~${args.totalWords.toLocaleString()} words across ${args.sections.length} sections
Requested depth: ${args.level}

The book is split into ${args.chunks.length} study blocks. Every section has been assigned to exactly one block so nothing is dropped.

${blockDescriptions}

Return:
- title, description, category, coverEmoji, tags for the course.
- throughline: the book's central argument in 2–3 sentences, including what it is arguing against.
- argumentMoves: 4–6 steps in the order the book builds them. Each step must be a claim, not a chapter label.
- readingPromise: what the learner will be able to explain, distinguish, or apply after the course.
- modules: exactly one entry per block. chunkIndex must match the block number. Titles name the intellectual move ("Scarcity changes what a market can see"), never "Chapters 4–6". Summaries say what the block establishes and how it advances the throughline.

Be concrete about this book. A plan that could describe any book is wrong.`;
}

export function buildBookFramePrompt(args: {
  plan: BookPlan;
  sourceTitle: string;
  sectionCount: number;
}) {
  return `Write exactly 2 orientation lessons for the reading companion of "${args.sourceTitle}".

The book's throughline:
${args.plan.throughline}

The argument moves:
${args.plan.argumentMoves.map((move, index) => `${index + 1}. ${move}`).join("\n")}

What the learner will be able to do:
${args.plan.readingPromise}

The course then covers ${args.sectionCount} sections in ${args.plan.modules.length} blocks.

Lesson 1 — the question. What problem is the book trying to solve? Why is the obvious answer insufficient? What is at stake? This should make the reader want the rest of the argument. Do not preview chapters.

Lesson 2 — the argument in one page. Reconstruct the throughline and the sequence of moves as a compact argument. The reader should be able to explain the book's position to a friend after this lesson.

Set sourceRef.sectionIndexes to the sections that best support each lesson (you may use [] for an argument-level overview). sourceRef.note explains which part of the book the lesson draws on.`;
}

export function buildBookModulePrompt(args: {
  plan: BookPlan;
  chunk: BookChunk;
  sourceTitle: string;
  level: string;
}) {
  const { plan, chunk, sourceTitle, level } = args;
  const sectionText = chunk.sections
    .map(
      (section) =>
        `[section ${section.index}] ${section.title}\n${section.text}`,
    )
    .join("\n\n");

  return `Write the lessons for one block of the reading companion for "${sourceTitle}".

Overall throughline:
${plan.throughline}

This block: ${chunk.moduleTitle ?? chunk.sections.map((section) => section.title).join(" · ")}
What this block must establish: ${chunk.moduleSummary ?? "Advance the throughline using these sections."}

${DEPTH[level] ?? DEPTH.beginner}

Write exactly ${chunk.targetLessons} lesson${chunk.targetLessons === 1 ? "" : "s"}.

Coverage contract:
- The block contains ${chunk.sections.length} sections, listed below.
- Every section must appear in at least one lesson's sourceRef.sectionIndexes.
- A lesson may draw on more than one section, but do not let a long section crowd out a short one.
- Do not write a lesson that could have been written without reading the text below.

For every section, also return a sectionDigest: a 2–3 sentence summary of its actual argument plus 1–4 pieces of concrete evidence (numbers, names, studies, cases, or claims) that the final synthesis will need.

<source>
${sectionText}
</source>`;
}

export function buildBookSynthesisPrompt(args: {
  plan: BookPlan;
  sourceTitle: string;
  level: string;
  digests: { sectionIndex: number; title: string; summary: string; keyEvidence: string[] }[];
  moduleTitles: string[];
}) {
  const evidence = args.digests
    .map(
      (digest) =>
        `[section ${digest.sectionIndex}] ${digest.title}\n${digest.summary}\nEvidence: ${digest.keyEvidence.join("; ")}`,
    )
    .join("\n\n");

  return `Write the 2 closing lessons for the reading companion for "${args.sourceTitle}".

Throughline:
${args.plan.throughline}

Argument moves:
${args.plan.argumentMoves.map((move, index) => `${index + 1}. ${move}`).join("\n")}

Blocks already taught:
${args.moduleTitles.map((title, index) => `${index + 1}. ${title}`).join("\n")}

What the book established, section by section:
${evidence}

Lesson 1 — What the book establishes. Reconstruct the full argument as a single chain: the problem, each major move, and the conclusion. Name the strongest evidence the author actually uses. This is the lesson that should make the reader able to defend the thesis in a conversation.

Lesson 2 — Where the argument is weakest, and how to use it. Identify the strongest objection or the place the evidence thins out (only where the book itself leaves that opening). Then explain how to apply the argument to a new case, and what to watch for. Do not invent criticisms the text does not support.

${DEPTH[args.level] ?? DEPTH.beginner}

Set sourceRef.sectionIndexes to the sections each synthesis lesson draws on.`;
}

