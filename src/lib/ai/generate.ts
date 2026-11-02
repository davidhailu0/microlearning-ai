import { zodResponseFormat } from "openai/helpers/zod";
import type { z } from "zod";
import { env } from "@/lib/env";
import type { GenerateInput } from "@/lib/types";
import { parseSections, sourceIsBook, type SourceSection } from "@/lib/ingest";
import { getAiClient, resolveModel } from "./client";
import {
  buildSourceDigest,
  buildBookFramePrompt,
  buildBookModulePrompt,
  buildBookPlanPrompt,
  buildBookSynthesisPrompt,
  buildUserPrompt,
  BOOK_SYSTEM_PROMPT,
  SYSTEM_PROMPT,
  type BookChunk,
} from "./prompts";
import {
  bookLessonsSchema,
  bookModuleDraftSchema,
  bookPlanSchema,
  courseDraftSchema,
  type BookLessonDraft,
  type BookModuleDraft,
  type BookPlan,
  type BookSectionDigest,
  type CourseDraft,
  type LessonDraft,
  type SourceRef,
} from "./schema";

export class GenerationError extends Error {
  constructor(
    message: string,
    readonly code = "generation_failed",
  ) {
    super(message);
    this.name = "GenerationError";
  }
}

type Format = "json_schema" | "json_object" | "plain";
type Message = { role: "system" | "user"; content: string };

/** Below this a course outline is too likely to be truncated to be useful. */
const MIN_OUTPUT_TOKENS = 1500;

const TIGHT_INSTRUCTION =
  "The output budget is tight: use exactly 3 modules with 2 lessons each, and one paragraph per lesson.";

function requestFormats(): Format[] {
  // Strict schema is the only format that reliably makes weaker models emit
  // every required field. Fall back to plain JSON, then prose, when the
  // provider rejects structured outputs.
  return ["json_schema", "json_object", "plain"];
}

function requestCompletion(messages: Message[], format: Format, maxTokens: number) {
  return getAiClient().chat.completions.create({
    model: resolveModel(env.model),
    temperature: 0.6,
    max_tokens: maxTokens,
    messages,
    ...(format === "json_schema"
      ? { response_format: zodResponseFormat(courseDraftSchema, "course") }
      : format === "json_object"
        ? { response_format: { type: "json_object" } }
        : {}),
  });
}

/**
 * Free models intermittently drop required fields. Before loosening the output
 * format (which loses schema adherence entirely), re-ask naming the exact
 * paths that failed — a short, targeted second chance at the strict format.
 */
const REPAIR_MAX_ATTEMPTS = 2;

const REPAIR_INSTRUCTION =
  "REPAIR: the previous JSON was missing or misshaped the fields listed below. " +
  "Every object must contain every field its schema requires. Return exactly one " +
  "JSON object with all fields present. Missing or invalid:";

/**
 * Free-router failures worth waiting out: openrouter free-model cooldowns are
 * ~2 minutes, and the router's own failover budget (180s) makes each doomed
 * request expensive. Waiting once or twice converts most of these into success.
 */
function isTransient(failure: GenerationError) {
  if (failure.code !== "provider_error") return false;
  return /rate.?limit|429|cooldown|timed.?out|non-JSON|EAI_AGAIN|50[234]|overloaded/i.test(
    failure.message,
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Long enough for a router rate-limit cooldown to lapse. */
const TRANSIENT_WAIT_MS = 60_000;

function repairNote(failure: GenerationError) {
  return `\n\n${REPAIR_INSTRUCTION} ${failure.message}`;
}

function isRepairable(failure: GenerationError) {
  return (
    failure.code === "generation_invalid" ||
    failure.code === "generation_malformed" ||
    failure.code === "generation_empty"
  );
}

/** First few schema misses, listed for both the error and the repair re-ask. */
function summarizeIssues(error: z.ZodError) {
  const parts = error.issues
    .slice(0, 4)
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`);
  const more = error.issues.length > 4 ? ` (+${error.issues.length - 4} more)` : "";
  return `${parts.join("; ")}${more}`;
}

export async function generateCourseDraft(args: {
  input: GenerateInput;
  sourceText?: string;
  title?: string;
  author?: string;
  wordCount?: number;
}): Promise<{ draft: CourseDraft; tokens: { input: number; output: number } }> {
  if (!env.aiEnabled) {
    return { draft: demoDraft(args.input, args.title ?? args.sourceText), tokens: { input: 0, output: 0 } };
  }

  const digest = args.sourceText
    ? buildSourceDigest(args.sourceText, env.maxSourceChars)
    : undefined;

  const systemPrompt = [
    SYSTEM_PROMPT,
    "Return exactly one JSON object matching the course schema. No prose, no markdown fences.",
    env.maxOutputTokens < 5000 ? TIGHT_INSTRUCTION : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const messages: Message[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: buildUserPrompt({
        input: args.input,
        sourceText: digest,
        title: args.title,
        author: args.author,
        wordCount: args.wordCount,
      }),
    },
  ];

  // OpenAI supports strict JSON schema; some OpenRouter-routed models only
  // support JSON mode (or nothing). Walk down the ladder instead of failing.
  const formats = requestFormats();

  // OpenRouter rejects a request whose max_tokens exceeds the key's remaining
  // credit, even if a smaller completion would fit. Back off on demand.
  let budget = env.maxOutputTokens;

  const attempt = async (format: Format) => {
    const completion = await requestCompletion(messages, format, budget);
    const draft = readDraft(completion);

    return {
      draft: normalizeDraft(draft),
      tokens: {
        input: completion.usage?.prompt_tokens ?? 0,
        output: completion.usage?.completion_tokens ?? 0,
      },
    };
  };

  let lastError: GenerationError | null = null;
  let transients = 0;

  for (const [index, format] of formats.entries()) {
    let repairs = 0;

    while (true) {
      try {
        return await attempt(format);
      } catch (error) {
        const failure = toGenerationError(error);

        // OpenRouter rejects a request whose max_tokens exceeds the key's
        // remaining credit; back off and retry with a smaller budget.
        const affordable = affordableTokens(failure);
        if (affordable !== null) {
          if (affordable < MIN_OUTPUT_TOKENS) {
            throw new GenerationError(
              `The provider key can only afford ~${affordable} output tokens, below the ${MIN_OUTPUT_TOKENS} needed for a full course. Add credits, raise the key limit, or choose a cheaper OPENAI_MODEL.`,
              "insufficient_credits",
            );
          }
          if (affordable < budget) {
            budget = Math.floor(affordable * 0.95);
            if (budget < 5000 && !messages[0].content.includes(TIGHT_INSTRUCTION)) {
              messages[0] = {
                role: "system",
                content: `${messages[0].content}\n\n${TIGHT_INSTRUCTION}`,
              };
            }
            continue;
          }
        }

        // Same-format repair before the format loosens: JSON mode is known to
        // drop required fields, so loosening first would trade one broken
        // outline for another.
        if (isRepairable(failure) && repairs < REPAIR_MAX_ATTEMPTS) {
          repairs += 1;
          messages[1] = {
            role: "user",
            content: `${messages[1].content}${repairNote(failure)}`,
          };
          continue;
        }

        // Short-source generation is one model call: waiting out a free-tier
        // cooldown here is far cheaper than failing the job outright.
        if (isTransient(failure) && transients < 2) {
          transients += 1;
          await wait(TRANSIENT_WAIT_MS);
          continue;
        }

        lastError = failure;
        const isLast = index === formats.length - 1;
        if (isLast || !canLoosenFormat(failure)) throw failure;
        break;
      }
    }
  }

  throw lastError ?? new GenerationError("Course generation failed.");
}

/** OpenRouter 402s name the completion budget the key can still afford. */
function affordableTokens(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const match = message.match(/can only afford (\d+)/i);
  return match ? Number(match[1]) : null;
}

function readDraft(completion: Awaited<ReturnType<typeof requestCompletion>>): CourseDraft {
  const choice = completion.choices[0];
  const content = choice?.message?.content?.trim();

  if (!content) {
    throw new GenerationError(
      choice?.message?.refusal ?? "The model returned an empty course.",
      "generation_empty",
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(unwrapJson(content));
  } catch {
    throw new GenerationError("The model returned malformed JSON.", "generation_malformed");
  }

  const parsed = courseDraftSchema.safeParse(json);
  if (!parsed.success) {
    throw new GenerationError(
      `The model returned an invalid outline (${summarizeIssues(parsed.error)}).`,
      "generation_invalid",
    );
  }

  return parsed.data;
}

function unwrapJson(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
}

/** Only retry when the provider rejected the output format or produced junk. */
function canLoosenFormat(failure: GenerationError) {
  if (
    failure.code === "generation_malformed" ||
    failure.code === "generation_empty" ||
    failure.code === "generation_invalid"
  ) {
    return true;
  }
  if (failure.code !== "provider_error") return false;

  const message = failure.message.toLowerCase();
  return /response_format|json_schema|structured|unsupported|invalid[_ ]format|not supported/.test(
    message,
  );
}

function toGenerationError(error: unknown): GenerationError {
  if (error instanceof GenerationError) return error;
  if (error instanceof Error) return new GenerationError(error.message, "provider_error");
  return new GenerationError("Course generation failed.", "provider_error");
}

function normalizeDraft(draft: CourseDraft): CourseDraft {
  const modules = draft.modules
    .slice(0, 5)
    .map((module) => {
      const lessons = module.lessons.slice(0, 4).map(normalizeLesson);
      return {
        ...module,
        // Weaker models omit module summaries; the first lesson's objective
        // reads the same on a course card.
        summary: clip(
          module.summary.trim() || lessons[0]?.objective || lessons[0]?.title || "",
          400,
        ),
        lessons,
      };
    })
    .filter((module) => module.lessons.length > 0);

  const uniqueModules = modules.filter(
    (module, index, all) =>
      all.findIndex((m) => m.title.toLowerCase() === module.title.toLowerCase()) === index,
  );

  if (uniqueModules.length < 3) {
    throw new GenerationError("The generated outline was too thin. Try again.", "generation_thin");
  }

  const title = draft.title.trim().slice(0, 120) || "Untitled course";
  const description =
    draft.description.trim() ||
    uniqueModules[0]?.summary.trim() ||
    `A ${draft.level} course on ${title}.`;

  return {
    ...draft,
    title,
    description: clip(description, 400),
    tags: Array.from(new Set(draft.tags.map((tag) => tag.trim()).filter(Boolean))).slice(0, 5),
    modules: uniqueModules,
  };
}

function normalizeLesson(lesson: LessonDraft): LessonDraft {
  return {
    ...lesson,
    title: clip(lesson.title, 120),
    objective: clip(lesson.objective, 220),
    hook: clip(lesson.hook, 220),
    bullets: lesson.bullets.slice(0, 4).map((bullet) => clip(bullet, 220)),
    paragraphs: lesson.paragraphs.filter(Boolean).slice(0, 4).map((paragraph) => clip(paragraph, 900)),
    takeaway: clip(lesson.takeaway, 260),
    quiz: {
      ...lesson.quiz,
      question: clip(lesson.quiz.question, 300),
      correctIndex: Math.min(3, Math.max(0, lesson.quiz.correctIndex)),
      options: lesson.quiz.options.slice(0, 4).map((option) => clip(option, 160)),
      explanation: clip(lesson.quiz.explanation, 400),
    },
    flashcards: lesson.flashcards
      .slice(0, 2)
      .map((card) => ({ front: clip(card.front, 220), back: clip(card.back, 400) })),
    diagram: lesson.diagram && lesson.diagram.nodes.length >= 2 ? lesson.diagram : null,
  };
}

/* --------------------------------------------------------------- book mode */

export type BookCoverage = {
  bookMode: true;
  sections: number;
  words: number;
  pages?: number;
  throughline: string;
  argumentMoves: string[];
  sectionMap: {
    index: number;
    title: string;
    words: number;
    pageStart?: number;
    pageEnd?: number;
  }[];
};

type Tokens = { input: number; output: number };

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Model output is trimmed at persistence/display boundaries, not rejected. */
function clip(value: string, max: number) {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function isBookSource(args: { kind: string; wordCount: number }) {
  return sourceIsBook({
    kind: args.kind,
    wordCount: args.wordCount,
    minWords: env.bookMinWords,
  });
}

/**
 * Contiguous groups of sections sized so one model call can read all of them.
 * The grouping is deterministic, which is what makes the coverage guarantee
 * auditable: every parsed section lands in exactly one block.
 */
function buildBookChunks(sections: SourceSection[], level: string): BookChunk[] {
  const totalWords = sections.reduce((sum, section) => sum + section.wordCount, 0);
  const wordsPerModule =
    level === "advanced" ? 9_000 : level === "intermediate" ? 11_000 : 13_000;

  const moduleCount = clamp(
    Math.max(
      Math.ceil(totalWords / wordsPerModule),
      // The schema carries at most 10 section digests per block.
      Math.ceil(sections.length / 10),
    ),
    Math.min(2, sections.length),
    Math.min(env.bookMaxModules, sections.length),
  );

  const boundaries: number[] = [];
  let cumulative = 0;
  let nextBoundary = 1;

  for (let index = 0; index < sections.length && nextBoundary < moduleCount; index++) {
    cumulative += sections[index].wordCount;
    if (cumulative >= (totalWords * nextBoundary) / moduleCount) {
      boundaries.push(index + 1);
      nextBoundary += 1;
    }
  }

  const groups: SourceSection[][] = [];
  let start = 0;
  for (const boundary of [...boundaries, sections.length]) {
    if (boundary <= start) continue;
    groups.push(sections.slice(start, boundary));
    start = boundary;
  }
  if (start < sections.length) groups.push(sections.slice(start));
  if (groups.length === 0) groups.push(sections);

  // Hard cap per block: the digest schema (and one model call) can handle ten
  // sections comfortably.
  const limitedGroups: SourceSection[][] = [];
  for (const group of groups) {
    for (let index = 0; index < group.length; index += 10) {
      limitedGroups.push(group.slice(index, index + 10));
    }
  }

  const wordsPerLesson =
    level === "advanced" ? 3_000 : level === "intermediate" ? 4_000 : 5_500;

  const chunks: BookChunk[] = limitedGroups.map((group, index) => {
    const words = group.reduce((sum, section) => sum + section.wordCount, 0);
    const minimum = Math.ceil(group.length / (level === "advanced" ? 3 : level === "intermediate" ? 5 : 8));
    return {
      index,
      sections: group,
      targetLessons: clamp(Math.max(minimum, Math.round(words / wordsPerLesson)), 1, 8),
    };
  });

  // Respect the configured lesson ceiling without ever leaving a section with
  // no lesson at all.
  let totalLessons = chunks.reduce((sum, chunk) => sum + chunk.targetLessons, 0);
  while (totalLessons > env.bookMaxLessons) {
    const largest = chunks.reduce(
      (best, chunk, index) =>
        chunk.targetLessons > chunks[best].targetLessons ? index : best,
      0,
    );
    if (chunks[largest].targetLessons <= 1) break;
    chunks[largest].targetLessons -= 1;
    totalLessons -= 1;
  }

  return chunks;
}

function resolveSourceRef(
  ref: BookLessonDraft["sourceRef"],
  pool: SourceSection[],
  fallbackLabel: string,
): SourceRef {
  const wanted = new Set(ref.sectionIndexes);
  let picked = pool.filter((section) => wanted.has(section.index));
  if (picked.length === 0) picked = pool.slice(0, 1);

  if (picked.length === 0) {
    return {
      label: fallbackLabel.slice(0, 200),
      pageStart: null,
      pageEnd: null,
      note: clip(ref.note, 280),
      sectionIndexes: [],
    };
  }

  const pages = picked.filter((section) => section.pageStart != null);
  const pageStart = pages.length
    ? Math.min(...pages.map((section) => section.pageStart as number))
    : null;
  const pageEnd = pages.length
    ? Math.max(...pages.map((section) => (section.pageEnd ?? section.pageStart) as number))
    : null;

  const label =
    picked.length === 1
      ? picked[0].title
      : `${picked[0].title} → ${picked[picked.length - 1].title}`;

  return {
    label: label.slice(0, 200),
    pageStart,
    pageEnd,
    note: clip(ref.note, 280),
    sectionIndexes: picked.map((section) => section.index),
  };
}

function estimateMinutes(lesson: LessonDraft) {
  const words = countWords(
    [lesson.hook, ...lesson.paragraphs, ...lesson.bullets, lesson.takeaway].join(" "),
  );
  return clamp(Math.round(words / 170), 3, 14);
}

function finalizeBookLesson(
  lesson: BookLessonDraft,
  pool: SourceSection[],
  fallbackLabel: string,
): LessonDraft {
  const finalized: LessonDraft = {
    title: clip(lesson.title, 120),
    objective: clip(lesson.objective, 320),
    hook: clip(lesson.hook, 400),
    paragraphs: lesson.paragraphs
      .filter(Boolean)
      .slice(0, 4)
      .map((paragraph) => clip(paragraph, 1_600)),
    bullets: lesson.bullets.slice(0, 4).map((bullet) => clip(bullet, 320)),
    takeaway: clip(lesson.takeaway, 400),
    diagram: lesson.diagram && lesson.diagram.nodes.length >= 2 ? lesson.diagram : null,
    quiz: {
      ...lesson.quiz,
      question: clip(lesson.quiz.question, 300),
      options: lesson.quiz.options.slice(0, 4).map((option) => clip(option, 160)),
      explanation: clip(lesson.quiz.explanation, 400),
      correctIndex: Math.min(3, Math.max(0, lesson.quiz.correctIndex)),
    },
    flashcards: lesson.flashcards
      .slice(0, 2)
      .map((card) => ({ front: clip(card.front, 220), back: clip(card.back, 400) })),
    sourceRef: resolveSourceRef(lesson.sourceRef, pool, fallbackLabel),
  };
  return { ...finalized, estimatedMinutes: estimateMinutes(finalized) };
}

function sectionDigestFor(
  digest: BookSectionDigest | undefined,
  section: SourceSection,
) {
  if (digest) return digest;
  const opening = section.text.replace(/\[page \d+\]/g, " ").replace(/\s+/g, " ").trim();
  return {
    sectionIndex: section.index,
    summary: opening.slice(0, 580),
    keyEvidence: [opening.slice(0, 240)],
  };
}

/* ------------------------------------------------------- structured calls */

async function completeStructured<T>(args: {
  schema: z.ZodType<T>;
  name: string;
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<{ data: T; tokens: Tokens }> {
  const formats = requestFormats();
  const targetTokens = args.maxTokens ?? env.maxOutputTokens;
  let budget = targetTokens;

  const messages: Message[] = [
    { role: "system", content: args.system },
    { role: "user", content: args.user },
  ];

  const attempt = async (format: Format) => {
    const completion = await getAiClient().chat.completions.create({
      model: resolveModel(env.model),
      temperature: args.temperature ?? 0.55,
      max_tokens: budget,
      messages,
      ...(format === "json_schema"
        ? { response_format: zodResponseFormat(args.schema, args.name) }
        : format === "json_object"
          ? { response_format: { type: "json_object" } }
          : {}),
    });

    const choice = completion.choices[0];
    const content = choice?.message?.content?.trim();
    if (!content) {
      throw new GenerationError(
        choice?.message?.refusal ?? "The model returned an empty response.",
        "generation_empty",
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(unwrapJson(content));
    } catch {
      throw new GenerationError(
        "The model returned malformed JSON.",
        "generation_malformed",
      );
    }

    const parsed = args.schema.safeParse(json);
    if (!parsed.success) {
      throw new GenerationError(
        `The model returned an invalid response (${summarizeIssues(parsed.error)}).`,
        "generation_invalid",
      );
    }

    return {
      data: parsed.data,
      tokens: {
        input: completion.usage?.prompt_tokens ?? 0,
        output: completion.usage?.completion_tokens ?? 0,
      },
    };
  };

  let lastError: GenerationError | null = null;

  for (const [index, format] of formats.entries()) {
    let retriedBudget = false;
    let repairs = 0;
    let transients = 0;

    while (true) {
      try {
        return await attempt(format);
      } catch (error) {
        const failure = toGenerationError(error);
        const affordable = affordableTokens(failure);

        if (affordable !== null && !retriedBudget) {
          if (affordable < MIN_OUTPUT_TOKENS) {
            throw new GenerationError(
              `The provider key can only afford ~${affordable} output tokens, below the ${MIN_OUTPUT_TOKENS} needed for one book section. Add credits or choose a cheaper OPENAI_MODEL.`,
              "insufficient_credits",
            );
          }
          if (affordable < budget) {
            budget = Math.floor(affordable * 0.95);
            retriedBudget = true;
            continue;
          }
        }

        // Re-ask with the missing fields named before the format loosens.
        if (isRepairable(failure) && repairs < REPAIR_MAX_ATTEMPTS) {
          repairs += 1;
          messages[1] = {
            role: "user",
            content: `${messages[1].content}${repairNote(failure)}`,
          };
          continue;
        }

        // One cooldown wait per book call; a whole-book job makes many calls.
        if (isTransient(failure) && transients < 1) {
          transients += 1;
          await wait(TRANSIENT_WAIT_MS);
          continue;
        }

        lastError = failure;
        const isLast = index === formats.length - 1;
        const retryable =
          failure.code === "generation_malformed" ||
          failure.code === "generation_empty" ||
          failure.code === "generation_invalid" ||
          (failure.code === "provider_error" && canLoosenFormat(failure));
        if (isLast || !retryable) throw failure;
        break;
      }
    }
  }

  throw lastError ?? new GenerationError("Course generation failed.");
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(Math.max(1, limit), items.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await task(items[index], index);
    }
  });

  await Promise.all(workers);
  return results;
}

async function generateBookModule(args: {
  plan: BookPlan;
  chunk: BookChunk;
  sourceTitle: string;
  level: string;
}): Promise<{ module: BookModuleDraft; digests: BookSectionDigest[]; tokens: Tokens }> {
  let missing: number[] = [];
  let lastError: GenerationError | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const extra =
      missing.length > 0
        ? `\n\nCOVERAGE CHECK FAILED. The previous attempt did not reference sections ${missing.join(", ")}. Every section must appear in at least one lesson's sourceRef.sectionIndexes.`
        : "";

    try {
      const result = await completeStructured({
        schema: bookModuleDraftSchema,
        name: "book_module",
        system: `${BOOK_SYSTEM_PROMPT}\n\nReturn exactly one JSON object matching the schema. No prose, no markdown fences.`,
        user: buildBookModulePrompt({
          plan: args.plan,
          chunk: args.chunk,
          sourceTitle: args.sourceTitle,
          level: args.level,
        }) + extra,
        maxTokens: Math.min(env.maxOutputTokens, 8_000),
      });

      const covered = new Set(
        result.data.lessons.flatMap((lesson) => lesson.sourceRef.sectionIndexes),
      );
      missing = args.chunk.sections
        .filter((section) => !covered.has(section.index))
        .map((section) => section.index);

      if (missing.length === 0) {
        const digests = args.chunk.sections.map((section) =>
          sectionDigestFor(
            result.data.sectionDigests.find(
              (digest) => digest.sectionIndex === section.index,
            ),
            section,
          ),
        );
        return { module: result.data, digests, tokens: result.tokens };
      }

      lastError = new GenerationError(
        `The model skipped sections ${missing.join(", ")} in “${args.chunk.sections[0].title}”.`,
        "coverage_incomplete",
      );
    } catch (error) {
      lastError = toGenerationError(error);
      if (lastError.code === "insufficient_credits") throw lastError;
    }
  }

  throw (
    lastError ??
    new GenerationError("The model could not cover every section in this block.")
  );
}

/**
 * Whole-book generation. Instead of sampling a digest, this plans the argument,
 * then reads every parsed section in bounded batches, then synthesises. Every
 * lesson carries the sections/pages it came from.
 */
export async function generateBookDraft(args: {
  input: GenerateInput;
  sourceText: string;
  kind: string;
  title: string;
  author?: string;
  wordCount: number;
  pageCount?: number;
  onProgress?: (update: { stage: string; progress: number }) => void;
}): Promise<{ draft: CourseDraft; tokens: Tokens; coverage: BookCoverage }> {
  const level = args.input.level ?? "beginner";
  const sections = parseSections({
    kind: args.kind,
    text: args.sourceText,
    pageCount: args.pageCount,
  });
  const totalWords = sections.reduce((sum, section) => sum + section.wordCount, 0);

  const coverage: BookCoverage = {
    bookMode: true,
    sections: sections.length,
    words: totalWords,
    pages: args.pageCount,
    throughline: "",
    argumentMoves: [],
    sectionMap: sections.map((section) => ({
      index: section.index,
      title: section.title,
      words: section.wordCount,
      pageStart: section.pageStart,
      pageEnd: section.pageEnd,
    })),
  };

  // Too short for the multi-pass path, or no provider configured: keep the
  // product usable without pretending this is a book companion.
  if (!env.aiEnabled || sections.length < 2) {
    const short = await generateCourseDraft({
      input: args.input,
      sourceText: args.sourceText,
      title: args.title,
      author: args.author,
      wordCount: args.wordCount,
    });
    return { ...short, coverage };
  }

  args.onProgress?.({ stage: "Mapping the argument", progress: 10 });

  const chunks = buildBookChunks(sections, level);
  const planResult = await completeStructured({
    schema: bookPlanSchema,
    name: "book_plan",
    system: `${BOOK_SYSTEM_PROMPT}\n\nYou are planning only. Return exactly one JSON object matching the schema.`,
    user: buildBookPlanPrompt({
      sourceTitle: args.title,
      author: args.author,
      level,
      totalWords,
      sections,
      chunks,
    }),
    maxTokens: Math.min(env.maxOutputTokens, 4_000),
    temperature: 0.45,
  });

  const plan: BookPlan = {
    ...planResult.data,
    title: clip(planResult.data.title, 120),
    description: clip(planResult.data.description, 400),
    category: clip(planResult.data.category, 60),
    tags: planResult.data.tags.map((tag) => clip(tag, 30)).slice(0, 5),
    throughline: clip(planResult.data.throughline, 700),
    argumentMoves: planResult.data.argumentMoves.map((move) => clip(move, 240)),
    readingPromise: clip(planResult.data.readingPromise, 320),
    modules: planResult.data.modules.map((module) => ({
      ...module,
      title: clip(module.title, 120),
      summary: clip(module.summary, 320),
    })),
  };
  const chunksWithMeta = chunks.map((chunk, index) => {
    const meta =
      plan.modules.find((module) => module.chunkIndex === index) ?? plan.modules[index];
    return {
      ...chunk,
      moduleTitle: meta?.title?.trim() || chunk.sections[0].title,
      moduleSummary:
        meta?.summary?.trim() ||
        `Covers ${chunk.sections.map((section) => section.title).join(", ")}.`,
    };
  });

  coverage.throughline = plan.throughline;
  coverage.argumentMoves = plan.argumentMoves;

  args.onProgress?.({ stage: "Writing the orientation", progress: 16 });

  let frameError: GenerationError | null = null;
  const framePromise = completeStructured({
    schema: bookLessonsSchema,
    name: "book_frame",
    system: `${BOOK_SYSTEM_PROMPT}\n\nReturn exactly one JSON object matching the schema.`,
    user: buildBookFramePrompt({
      plan,
      sourceTitle: args.title,
      sectionCount: sections.length,
    }),
    maxTokens: Math.min(env.maxOutputTokens, 4_500),
  }).catch((error: unknown) => {
    frameError = toGenerationError(error);
    return null;
  });

  const usage: Tokens = {
    input: planResult.tokens.input,
    output: planResult.tokens.output,
  };

  let completed = 0;
  let sectionsRead = 0;
  args.onProgress?.({ stage: "Reading every section", progress: 20 });

  const moduleResults = await mapLimit(
    chunksWithMeta,
    env.bookConcurrency,
    async (chunk) => {
      const result = await generateBookModule({
        plan,
        chunk,
        sourceTitle: args.title,
        level,
      });
      usage.input += result.tokens.input;
      usage.output += result.tokens.output;
      completed += 1;
      sectionsRead += chunk.sections.length;
      args.onProgress?.({
        stage: `Read ${Math.min(sectionsRead, sections.length)} of ${sections.length} sections`,
        progress: 20 + Math.round((completed / chunksWithMeta.length) * 60),
      });
      return result;
    },
  );

  args.onProgress?.({ stage: "Reconstructing the argument", progress: 84 });

  const digests = moduleResults.flatMap((result) => result.digests);
  const synthesisResult = await completeStructured({
    schema: bookLessonsSchema,
    name: "book_synthesis",
    system: `${BOOK_SYSTEM_PROMPT}\n\nReturn exactly one JSON object matching the schema.`,
    user: buildBookSynthesisPrompt({
      plan,
      sourceTitle: args.title,
      level,
      digests: digests.map((digest) => ({
        sectionIndex: digest.sectionIndex,
        title:
          sections.find((section) => section.index === digest.sectionIndex)?.title ??
          `Section ${digest.sectionIndex}`,
        summary: digest.summary,
        keyEvidence: digest.keyEvidence,
      })),
      moduleTitles: chunksWithMeta.map(
        (chunk) => chunk.moduleTitle ?? chunk.sections[0].title,
      ),
    }),
    maxTokens: Math.min(env.maxOutputTokens, 5_000),
  });

  usage.input += synthesisResult.tokens.input;
  usage.output += synthesisResult.tokens.output;

  const frame = await framePromise;
  if (!frame) {
    throw (
      frameError ??
      new GenerationError("The orientation lessons could not be generated.")
    );
  }

  args.onProgress?.({ stage: "Assembling the course", progress: 92 });

  const orientation: LessonDraft[] = frame.data.lessons.map((lesson) =>
    finalizeBookLesson(lesson, sections, args.title),
  );

  const modules: CourseDraft["modules"] = [
    {
      title: "The question and the argument",
      summary: plan.throughline.slice(0, 320),
      lessons: orientation,
    },
    ...moduleResults.map((result, index) => ({
      title: chunksWithMeta[index].moduleTitle ?? result.module.title,
      summary: chunksWithMeta[index].moduleSummary ?? result.module.summary,
      lessons: result.module.lessons.map((lesson) =>
        finalizeBookLesson(lesson, chunksWithMeta[index].sections, args.title),
      ),
    })),
    {
      title: "What the book establishes — and where it is vulnerable",
      summary:
        "The argument reconstructed, the strongest evidence behind it, and how to use it.",
      lessons: synthesisResult.data.lessons.map((lesson) =>
        finalizeBookLesson(lesson, sections, args.title),
      ),
    },
  ];

  // Coverage lives in the course banner and sources.metadata; the description
  // stays the author's one-line pitch.
  return {
    draft: {
      title: plan.title,
      description:
        plan.description || `A ${level} guided reading of ${args.title}.`,
      category: plan.category || "Books",
      level: (args.input.level ?? "beginner") as CourseDraft["level"],
      coverEmoji: plan.coverEmoji || "📖",
      tags: plan.tags,
      modules,
    },
    tokens: usage,
    coverage,
  };
}


/* ---------------------------------------------------------- local fallback */

const COLORS = ["amber", "emerald", "sky", "violet", "rose", "cyan"];

/**
 * Deterministic fallback so the product runs (and can be reviewed) without an
 * AI provider key. It is intentionally generic — never presented as AI output.
 */
export function demoDraft(input: GenerateInput, titleHint?: string): CourseDraft {
  const topic =
    input.prompt?.trim() ||
    titleHint?.replace(/\.[a-z]+$/i, "").trim() ||
    "How the thing actually works";

  const short = topic.length > 70 ? `${topic.slice(0, 67)}…` : topic;

  const moduleDefs = [
    {
      title: "The shape of the problem",
      summary: `Why ${short} is worth understanding, and the one question that unlocks it.`,
      lessons: [
        {
          title: `Start with the surprising part`,
          objective: `Explain what makes ${short} counter-intuitive.`,
          focus: "the assumption most people start with",
        },
        {
          title: "The model in one sentence",
          objective: "State the core idea without jargon.",
          focus: "a compact working model",
        },
        {
          title: "What the model leaves out",
          objective: "Show the limits of the first explanation.",
          focus: "the edges where simple stories break",
        },
      ],
    },
    {
      title: "How it actually moves",
      summary: "The mechanism, the feedback, and the delays that make outcomes hard to predict.",
      lessons: [
        {
          title: "The mechanism, step by step",
          objective: "Trace cause to effect through the system.",
          focus: "the causal chain",
        },
        {
          title: "Feedback and delay",
          objective: "Explain why the same action produces different results over time.",
          focus: "loops and lag",
        },
        {
          title: "Two failures that look alike",
          objective: "Distinguish a broken system from a mistimed one.",
          focus: "diagnosis",
        },
      ],
    },
    {
      title: "Using the idea",
      summary: "Turn the model into decisions you can defend and revise.",
      lessons: [
        {
          title: "Where leverage hides",
          objective: "Find the smallest change with the largest effect.",
          focus: "leverage points",
        },
        {
          title: "A decision you can actually run",
          objective: "Apply the model to one concrete choice.",
          focus: "practice",
        },
        {
          title: "Keep the model honest",
          objective: "Design a feedback loop that corrects you.",
          focus: "iteration",
        },
      ],
    },
  ];

  const modules = moduleDefs.map((module, moduleIndex) => ({
    title: module.title,
    summary: module.summary,
    lessons: module.lessons.map((lesson, lessonIndex) =>
      fallbackLesson({
        title: lesson.title,
        objective: lesson.objective,
        focus: lesson.focus,
        topic: short,
        index: moduleIndex * 3 + lessonIndex,
      }),
    ),
  }));

  return {
    title: `A field guide to ${short}`.slice(0, 120),
    description: `A ${modules.length * 3}-lesson course that builds a working model of ${short}, then shows you where to use it.`,
    category: "General",
    level: input.level ?? "beginner",
    coverEmoji: "🧠",
    tags: ["thinking", "fundamentals", "practice"],
    modules,
  };
}

function fallbackLesson(args: {
  title: string;
  objective: string;
  focus: string;
  topic: string;
  index: number;
}): LessonDraft {
  const { title, objective, focus, topic, index } = args;

  return {
    title,
    objective,
    hook: `Most explanations of ${topic} start in the wrong place. Start with ${focus} instead.`,
    paragraphs: [
      `The useful version of ${topic} is smaller than it looks. Hold one clear model in your head: a system takes an input, moves it through a mechanism, and returns a result that changes the next input. Everything else is detail hung on that frame.`,
      `That frame explains why ${focus} matters. When you change one part, the loop carries the change somewhere else — often somewhere you weren't looking. The result feels like resistance, but it is just the structure doing its job.`,
      `So the skill is not memorising more facts about ${topic}. It is learning to see which loop you are inside, and which small change actually alters it.`,
    ],
    bullets: [
      `A model is a tool for prediction, not a description of everything.`,
      `Feedback turns a single action into a pattern over time.`,
      `The best intervention is usually structural, not effortful.`,
    ],
    takeaway: `The loop explains the surprise: once you can name it and its delay, ${topic} stops being unpredictable.`,
    diagram:
      index % 3 === 1
        ? {
            type: "cycle",
            title: "The feedback loop",
            nodes: [
              { id: "a", label: "Action", emphasis: false },
              { id: "b", label: "Result", emphasis: false },
              { id: "c", label: "Adjustment", emphasis: true },
            ],
            edges: [
              { from: "a", to: "b", label: "produces" },
              { from: "b", to: "c", label: "triggers" },
              { from: "c", to: "a", label: "changes" },
            ],
          }
        : null,
    quiz: {
      question: `Which statement best captures the core of ${topic}?`,
      options: [
        `It is a fixed set of facts to memorise.`,
        `It is a structure whose feedback explains its behaviour.`,
        `It only works when nothing else changes.`,
        `It is best understood by studying each part alone.`,
      ],
      correctIndex: 1,
      explanation:
        "The point of the model is the relationship between parts. Isolated facts don't predict behaviour; feedback does.",
    },
    flashcards: [
      {
        front: `What is the working model of ${topic}?`,
        back: `An input moves through a mechanism and returns a result that changes the next input.`,
      },
      {
        front: `When ${topic} behaves unexpectedly, what should you look for first?`,
        back: "The loop and the delay — not a broken component.",
      },
    ],
  };
}

export function pickCoverColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
}
